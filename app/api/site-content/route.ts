import { NextResponse } from "next/server";
import { getAllSiteContent } from "@/lib/site-content";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") ?? "id";
    const content = await getAllSiteContent(locale);

    return NextResponse.json({ data: content });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal mengambil data konten." },
      { status: 500 }
    );
  }
}
