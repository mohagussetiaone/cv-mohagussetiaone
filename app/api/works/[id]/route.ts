import { NextResponse } from "next/server";
import { getAuthSession } from "@/auth";
import { isAdminEmail } from "@/lib/auth";
import { deleteSectionItem, getSectionItem, updateSectionItem } from "@/lib/section-content";

const SECTION = "works" as const;

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ message: "ID tidak valid." }, { status: 400 });
    }

    const item = await getSectionItem(SECTION, id);
    if (!item) {
      return NextResponse.json({ message: "Item tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ data: item });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal mengambil data work experience." }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ message: "ID tidak valid." }, { status: 400 });
    }

    const json = await request.json();
    const item = await updateSectionItem(SECTION, id, json);
    return NextResponse.json({ message: "Work experience berhasil diperbarui.", data: item });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal memperbarui work experience." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ message: "ID tidak valid." }, { status: 400 });
    }

    await deleteSectionItem(SECTION, id);
    return NextResponse.json({ message: "Work experience berhasil dihapus." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal menghapus work experience." }, { status: 500 });
  }
}
