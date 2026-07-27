import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/auth";
import { isAdminEmail } from "@/lib/auth";
import { buildMinioObjectName, buildMinioPublicUrl, deleteMinioObject, ensureMinioBucket, getMinioBucketName, getMinioClient, hasMinioConfig } from "@/lib/minio";

export const runtime = "nodejs";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml", "application/pdf"]);
const maxFileSize = Number.parseInt(process.env.MENU_IMAGE_MAX_BYTES || "", 10) || 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    if (!hasMinioConfig()) {
      return NextResponse.json({ message: "Konfigurasi MinIO belum lengkap di environment." }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = (formData.get("folder") as string | null)?.trim() || "general";

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "File wajib diisi." }, { status: 400 });
    }

    if (!allowedTypes.has(file.type) && !file.type.startsWith("image/")) {
      return NextResponse.json({ message: "Format file tidak didukung. Gunakan JPG, PNG, WEBP, SVG, atau PDF." }, { status: 400 });
    }

    if (file.size > maxFileSize) {
      return NextResponse.json({ message: `Ukuran file maksimal ${Math.round(maxFileSize / 1024 / 1024)}MB.` }, { status: 400 });
    }

    const extension =
      file.name
        .split(".")
        .pop()
        ?.replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase() ||
      file.type.split("/")[1] ||
      "bin";
    const objectName = buildMinioObjectName(`${randomUUID()}.${extension}`, folder);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const client = getMinioClient();

    await ensureMinioBucket(client);
    await client.putObject(getMinioBucketName(), objectName, buffer, buffer.length, {
      "Content-Type": file.type,
      "Cache-Control": "public, max-age=31536000, immutable",
    });

    return NextResponse.json({
      message: "File berhasil diupload.",
      data: {
        objectName,
        url: buildMinioPublicUrl(objectName),
        contentType: file.type,
        size: file.size,
        folder,
      },
    });
  } catch (error) {
    console.error("[MinIO Upload Error]", error);
    const message = error instanceof Error ? error.message : "Terjadi kesalahan saat upload file ke MinIO.";
    return NextResponse.json({ message, detail: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    if (!hasMinioConfig()) {
      return NextResponse.json({ message: "Konfigurasi MinIO belum lengkap di environment." }, { status: 500 });
    }

    const json = await request.json();
    const { url } = json as { url?: string };

    if (!url || typeof url !== "string") {
      return NextResponse.json({ message: "URL file wajib diisi." }, { status: 400 });
    }

    await deleteMinioObject(url);

    return NextResponse.json({
      message: "File berhasil dihapus dari MinIO.",
    });
  } catch (error) {
    console.error("[MinIO Delete Error]", error);
    const message = error instanceof Error ? error.message : "Terjadi kesalahan saat menghapus file dari MinIO.";
    return NextResponse.json({ message, detail: message }, { status: 500 });
  }
}
