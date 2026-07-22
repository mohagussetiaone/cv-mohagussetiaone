import { NextResponse } from "next/server";
import { getAuthSession } from "@/auth";
import { isAdminEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { SiteContentSection } from "@/app/types/site-content";

type RouteContext = {
  params: Promise<{
    section: string;
  }>;
};

type UpdateEntry = {
  key: string;
  locale: string;
  value: string;
  sortOrder?: number;
};

type UpsertPayload = {
  entries: UpdateEntry[];
};

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { section } = await params;
    const validSections: SiteContentSection[] = ["banner", "about", "skills", "contact", "navbar"];

    if (!validSections.includes(section as SiteContentSection)) {
      return NextResponse.json({ message: "Section tidak valid." }, { status: 400 });
    }

    const json = (await request.json()) as UpsertPayload;

    if (!json.entries || !Array.isArray(json.entries)) {
      return NextResponse.json({ message: "Payload tidak valid." }, { status: 400 });
    }

    // Upsert each entry
    for (const entry of json.entries) {
      const existing = await prisma.siteContent.findFirst({
        where: {
          section: section as SiteContentSection,
          key: entry.key,
          locale: entry.locale ?? "",
        },
      });

      if (existing) {
        await prisma.siteContent.update({
          where: { id: existing.id },
          data: {
            value: entry.value,
            sortOrder: entry.sortOrder ?? existing.sortOrder,
          },
        });
      } else {
        await prisma.siteContent.create({
          data: {
            section: section as SiteContentSection,
            key: entry.key,
            locale: entry.locale ?? "",
            value: entry.value,
            sortOrder: entry.sortOrder ?? 0,
          },
        });
      }
    }

    return NextResponse.json({
      message: "Konten berhasil diperbarui.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat menyimpan konten." },
      { status: 500 }
    );
  }
}
