import { NextResponse } from "next/server";
import { getAuthSession } from "@/auth";
import { isAdminEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// ─── GET: Get single message (admin only) ────────────────────
export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const messageId = Number(id);
    if (Number.isNaN(messageId)) {
      return NextResponse.json({ message: "ID tidak valid." }, { status: 400 });
    }

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return NextResponse.json({ message: "Pesan tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ data: message });
  } catch (error) {
    console.error("Failed to get message:", error);
    return NextResponse.json({ message: "Gagal memuat pesan." }, { status: 500 });
  }
}

// ─── PUT: Mark message as read (admin only) ───────────────────
export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const messageId = Number(id);
    if (Number.isNaN(messageId)) {
      return NextResponse.json({ message: "ID tidak valid." }, { status: 400 });
    }

    const json = await request.json();
    const message = await prisma.message.update({
      where: { id: messageId },
      data: {
        read: json.read ?? true,
      },
    });

    return NextResponse.json({
      message: "Pesan berhasil diperbarui.",
      data: message,
    });
  } catch (error) {
    console.error("Failed to update message:", error);
    return NextResponse.json({ message: "Gagal memperbarui pesan." }, { status: 500 });
  }
}
