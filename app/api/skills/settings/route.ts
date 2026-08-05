import { NextResponse } from "next/server";
import { getAuthSession } from "@/auth";
import { isAdminEmail } from "@/lib/auth";
import { upsertSectionSettings } from "@/lib/section-content";

const SECTION = "skills" as const;

export async function PUT(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const json = (await request.json()) as { entries?: { key: string; locale: string; value: string }[] };
    if (!json.entries || !Array.isArray(json.entries)) {
      return NextResponse.json({ message: "Payload tidak valid." }, { status: 400 });
    }

    await upsertSectionSettings(SECTION, json.entries);
    return NextResponse.json({ message: "Pengaturan skills berhasil disimpan." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal menyimpan pengaturan skills." }, { status: 500 });
  }
}