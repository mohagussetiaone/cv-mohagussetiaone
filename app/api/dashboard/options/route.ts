import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [skills, categories] = await Promise.all([
      prisma.skill.findMany({
        orderBy: { name: "asc" },
        select: { name: true },
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
        select: { name: true },
      }),
    ]);

    return NextResponse.json({
      skills: skills.map((s) => s.name),
      categories: categories.map((c) => c.name),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal mengambil data opsi." },
      { status: 500 }
    );
  }
}
