import { NextResponse } from "next/server";
import { getAuthSession } from "@/auth";
import { isAdminEmail } from "@/lib/auth";
import { deleteR2Object, hasR2Config } from "@/lib/r2";
import { uploadFileToR2 } from "@/lib/upload";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml", "application/pdf"]);
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
    const folder = (formData.get("folder") as string | null)?.trim() || "general";

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "File wajib diisi." }, { status: 400 });
    }

    // Strict PDF-only for CV uploads
    if (folder === "cv") {
      if (file.type !== "application/pdf") {
        return NextResponse.json({ message: "CV hanya boleh berformat PDF." }, { status: 400 });
      }
    } else if (!allowedTypes.has(file.type) && !file.type.startsWith("image/")) {
      return NextResponse.json({ message: "Format file tidak didukung. Gunakan JPG, PNG, WEBP, SVG, atau PDF." }, { status: 400 });
    }

    if (file.size > maxFileSize) {
      return NextResponse.json({ message: `Ukuran file maksimal ${Math.round(maxFileSize / 1024 / 1024)}MB.` }, { status: 400 });
    }

    const { objectName, url } = await uploadFileToR2(file, folder);

    return NextResponse.json({
      message: "File berhasil diupload.",
      data: {
        objectName,
        url,
        contentType: file.type,
        size: file.size,
        folder,
      },
    });
  } catch (error) {
    console.error("[R2 Upload Error]", error);
    const message = error instanceof Error ? error.message : "Terjadi kesalahan saat upload file ke R2.";
    return NextResponse.json({ message, detail: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    if (!hasR2Config()) {
      return NextResponse.json({ message: "Konfigurasi R2 belum lengkap di environment." }, { status: 500 });
    }

    const json = await request.json();
    const { url } = json as { url?: string };

    if (!url || typeof url !== "string") {
      return NextResponse.json({ message: "URL file wajib diisi." }, { status: 400 });
    }

    await deleteR2Object(url);

    return NextResponse.json({
      message: "File berhasil dihapus dari R2.",
    });
  } catch (error) {
    console.error("[R2 Delete Error]", error);
    const message = error instanceof Error ? error.message : "Terjadi kesalahan saat menghapus file dari R2.";
    return NextResponse.json({ message, detail: message }, { status: 500 });
  }
}
