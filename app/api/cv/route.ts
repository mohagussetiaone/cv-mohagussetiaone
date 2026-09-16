import { NextResponse } from "next/server";
import { getAuthSession } from "@/auth";
import { isAdminEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const cv = await prisma.cvFile.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: cv });
  } catch {
    return NextResponse.json({ message: "Gagal mengambil data CV." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { fileName, fileUrl, fileSize } = body;

    if (!fileName || !fileUrl) {
      return NextResponse.json({ message: "fileName dan fileUrl wajib diisi." }, { status: 400 });
    }

    // Delete existing CV records (only one CV at a time)
    await prisma.cvFile.deleteMany();

    const cv = await prisma.cvFile.create({
      data: { fileName, fileUrl, fileSize: fileSize ?? null },
    });

    return NextResponse.json({ data: cv });
  } catch {
    return NextResponse.json({ message: "Gagal menyimpan CV." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { fileName, fileUrl, fileSize } = body;

    if (!fileName || !fileUrl) {
      return NextResponse.json({ message: "fileName dan fileUrl wajib diisi." }, { status: 400 });
    }

    // Delete existing and create new (only one CV at a time)
    await prisma.cvFile.deleteMany();

    const cv = await prisma.cvFile.create({
      data: { fileName, fileUrl, fileSize: fileSize ?? null },
    });

    return NextResponse.json({ data: cv });
  } catch {
    return NextResponse.json({ message: "Gagal memperbarui CV." }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getAuthSession();
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    await prisma.cvFile.deleteMany();

    return NextResponse.json({ message: "CV berhasil dihapus." });
  } catch {
    return NextResponse.json({ message: "Gagal menghapus CV." }, { status: 500 });
  }
}
