import { NextResponse } from "next/server";
import { getAuthSession } from "@/auth";
import { isAdminEmail } from "@/lib/auth";
import { hasR2Config } from "@/lib/r2";
import { uploadFileToR2 } from "@/lib/upload";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]);
const maxFileSize = Number.parseInt(process.env.MENU_IMAGE_MAX_BYTES || "", 10) || 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    if (!hasR2Config()) {
      return NextResponse.json({ message: "Konfigurasi R2 belum lengkap di environment." }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "File image wajib diisi." }, { status: 400 });
    }

    if (!allowedTypes.has(file.type)) {
      return NextResponse.json({ message: "Format file harus JPG, PNG, WEBP, atau SVG." }, { status: 400 });
    }

    if (file.size > maxFileSize) {
      return NextResponse.json({ message: "Ukuran file maksimal 5MB." }, { status: 400 });
    }

    const { objectName, url } = await uploadFileToR2(file, "projects");

    return NextResponse.json({
      message: "Image berhasil diupload.",
      data: {
        objectName,
        url,
        contentType: file.type,
        size: file.size,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Terjadi kesalahan saat upload image ke R2." }, { status: 500 });
  }
}
