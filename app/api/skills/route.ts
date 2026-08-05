import { NextResponse } from "next/server";
import { getAuthSession } from "@/auth";
import { isAdminEmail } from "@/lib/auth";
import { createSectionItem, getSectionPayload } from "@/lib/section-content";

const SECTION = "skills" as const;

export async function GET() {
  try {
    const data = await getSectionPayload(SECTION);
    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal mengambil data skills." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const json = await request.json();
    const item = await createSectionItem(SECTION, json);
    return NextResponse.json({ message: "Skill berhasil ditambahkan.", data: item }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal menambahkan skill." }, { status: 500 });
  }
}