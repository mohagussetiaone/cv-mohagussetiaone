import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/auth";
import { isAdminEmail } from "@/lib/auth";
import {
  buildMinioObjectName,
  buildMinioPublicUrl,
  ensureMinioBucket,
  getMinioBucketName,
  getMinioClient,
  hasMinioConfig,
} from "@/lib/minio";

export const runtime = "nodejs";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]);
const maxFileSize = Number.parseInt(process.env.MENU_IMAGE_MAX_BYTES || "", 10) || 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    if (!hasMinioConfig()) {
      return NextResponse.json(
        { message: "Konfigurasi MinIO belum lengkap di environment." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "File image wajib diisi." }, { status: 400 });
    }

    if (!allowedTypes.has(file.type)) {
      return NextResponse.json(
        { message: "Format file harus JPG, PNG, WEBP, atau SVG." },
        { status: 400 }
      );
    }

    if (file.size > maxFileSize) {
      return NextResponse.json(
        { message: "Ukuran file maksimal 5MB." },
        { status: 400 }
      );
    }

    const extension =
      file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() ||
      file.type.split("/")[1] ||
      "bin";
    const objectName = buildMinioObjectName(`${randomUUID()}.${extension}`);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const client = getMinioClient();

    await ensureMinioBucket(client);
    await client.putObject(getMinioBucketName(), objectName, buffer, buffer.length, {
      "Content-Type": file.type,
      "Cache-Control": "public, max-age=31536000, immutable",
    });

    return NextResponse.json({
      message: "Image berhasil diupload.",
      data: {
        objectName,
        url: buildMinioPublicUrl(objectName),
        contentType: file.type,
        size: file.size,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Terjadi kesalahan saat upload image ke MinIO." },
      { status: 500 }
    );
  }
}
