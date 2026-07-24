import { NextResponse } from "next/server";
import { getAuthSession } from "@/auth";
import { isAdminEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─── POST: Submit a message (public) ────────────────────────
export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { name, email, message } = json;

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Nama, email, dan pesan wajib diisi." },
        { status: 400 }
      );
    }

    if (typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { message: "Nama harus minimal 2 karakter." },
        { status: 400 }
      );
    }

    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: "Email tidak valid." },
        { status: 400 }
      );
    }

    if (typeof message !== "string" || message.trim().length < 6) {
      return NextResponse.json(
        { message: "Pesan harus minimal 6 karakter." },
        { status: 400 }
      );
    }

    const msg = await prisma.message.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
      },
    });

    return NextResponse.json(
      {
        message: "Pesan berhasil dikirim! Saya akan menghubungi Anda segera.",
        data: { id: msg.id },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create message:", error);
    return NextResponse.json(
      { message: "Gagal mengirim pesan. Silakan coba lagi." },
      { status: 500 }
    );
  }
}

// ─── GET: List messages (admin only) ─────────────────────────
export async function GET(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") ?? "20")));
    const status = searchParams.get("status"); // "unread", "replied", or undefined (all)

    const where: Record<string, unknown> = {};
    if (status === "unread") where.read = false;
    if (status === "replied") where.repliedAt = { not: null };

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.message.count({ where }),
    ]);

    return NextResponse.json({
      data: messages,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Failed to list messages:", error);
    return NextResponse.json(
      { message: "Gagal memuat pesan." },
      { status: 500 }
    );
  }
}
