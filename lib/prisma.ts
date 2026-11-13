import type { D1Database } from "@cloudflare/workers-types";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "./generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  const { env } = getCloudflareContext();
  const d1 = (env as { mycv_d1?: D1Database }).mycv_d1;

  if (!d1) {
    throw new Error(
      "Binding D1 mycv_d1 tidak tersedia — pastikan wrangler.toml mendeklarasikan [[d1_databases]] dengan binding mycv_d1.",
    );
  }

  return new PrismaClient({ adapter: new PrismaD1(d1) });
}

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

/**
 * Pengganti createMany({ skipDuplicates: true }) — opsi itu tidak didukung
 * SQLite/D1 (client mengetikkannya sebagai `never`). Perilaku dipertahankan:
 * hanya nama yang belum ada yang dibuat. Dipakai untuk Skill & Category
 * (keduanya hanya punya field `name` yang unik).
 */
export async function createNamedIfMissing(model: "skill" | "category", names: string[]): Promise<void> {
  const unique = [...new Set(names.map((name) => name.trim()).filter(Boolean))];
  if (unique.length === 0) return;
  const client = getPrismaClient();
  // Cabang terpisah (bukan union delegate) supaya tipenya konkret.
  const existing = (
    model === "skill"
      ? await client.skill.findMany({ where: { name: { in: unique } }, select: { name: true } })
      : await client.category.findMany({ where: { name: { in: unique } }, select: { name: true } })
  ).map((row) => row.name);
  const existingNames = new Set(existing);
  const missing = unique.filter((name) => !existingNames.has(name));
  if (missing.length > 0) {
    if (model === "skill") {
      await client.skill.createMany({ data: missing.map((name) => ({ name })) });
    } else {
      await client.category.createMany({ data: missing.map((name) => ({ name })) });
    }
  }
}
// Klien Prisma baru dibuat saat properti pertama diakses — yaitu waktu request di
// Worker, ketika getCloudflareContext() tersedia. Halaman publik memakai
// `export const dynamic = "force-dynamic"` supaya tidak pernah di-prerender saat
// build (binding D1 tidak ada di proses build).
// DATABASE_URL (Postgres) SUDAH TIDAK DIPAKAI — sumber data sekarang D1 mycv-d1.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(client)
      : value;
  },
});
