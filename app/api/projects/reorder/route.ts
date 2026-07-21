import { NextResponse } from "next/server";
import { getAuthSession } from "@/auth";
import { isAdminEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const json = await request.json();
    const { items } = json as { items: { productId: number; sortOrder: number }[] };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: "Items array is required." }, { status: 400 });
    }

    // Batch update all sort orders in a transaction
    await prisma.$transaction(
      items.map((item) =>
        prisma.project.update({
          where: { productId: item.productId },
          data: { sortOrder: item.sortOrder },
        })
      )
    );

    return NextResponse.json({
      message: "Urutan project berhasil diperbarui.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat memperbarui urutan project." },
      { status: 500 }
    );
  }
}
