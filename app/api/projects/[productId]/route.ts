import { NextResponse } from "next/server";
import { getAuthSession } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/auth";
import { deleteMinioObject, hasMinioConfig } from "@/lib/minio";
import { getProjectByProductId } from "@/lib/projects";
import { projectPayloadSchema } from "@/lib/validators/project";
import type { ProjectLocale } from "@/app/types/project";

type RouteContext = {
  params: Promise<{
    productId: string;
  }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { productId } = await params;
    if (!productId) {
      return NextResponse.json({ message: "Product ID tidak valid." }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const localeParam = searchParams.get("locale");
    const locale: ProjectLocale = localeParam === "en" ? "en" : "id";

    const project = await getProjectByProductId(productId, locale);
    if (!project) {
      return NextResponse.json({ message: "Project tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ data: project });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Terjadi kesalahan saat mengambil project." }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { productId } = await params;
    const currentProductId = productId;

    if (!currentProductId) {
      return NextResponse.json({ message: "Product ID tidak valid." }, { status: 400 });
    }

    const json = await request.json();
    const payload = projectPayloadSchema.parse(json);

    const existingProject = await prisma.project.findUnique({
      where: {
        productId: currentProductId,
      },
      include: {
        translations: true,
      },
    });

    if (!existingProject) {
      return NextResponse.json({ message: "Project tidak ditemukan." }, { status: 404 });
    }

    if (payload.productId !== undefined && payload.productId !== currentProductId) {
      const conflictProject = await prisma.project.findUnique({
        where: {
          productId: payload.productId,
        },
      });

      if (conflictProject) {
        return NextResponse.json({ message: `Project dengan productId ${payload.productId} sudah ada.` }, { status: 409 });
      }
    }

    await prisma.skill.createMany({
      data: payload.technologies.map((name) => ({ name })),
      skipDuplicates: true,
    });

    await prisma.category.createMany({
      data: payload.categories.map((name) => ({ name })),
      skipDuplicates: true,
    });

    const updatedProject = await prisma.project.update({
      where: {
        productId: currentProductId,
      },
      data: {
        productId: payload.productId ?? currentProductId,
        image: payload.image,
        urlPreview: payload.urlPreview,
        githubUrl: payload.githubUrl,
        figmaUrl: payload.figmaUrl,
        internal: payload.internal,
        skills: {
          set: payload.technologies.map((name) => ({ name })),
        },
        categories: {
          set: payload.categories.map((name) => ({ name })),
        },
        translations: {
          deleteMany: {},
          create: [
            {
              locale: "id",
              projectName: payload.translations.id.projectName,
              description: payload.translations.id.description,
            },
            {
              locale: "en",
              projectName: payload.translations.en.projectName,
              description: payload.translations.en.description,
            },
          ],
        },
      },
      include: {
        translations: true,
      },
    });

    return NextResponse.json({
      message: "Project berhasil diperbarui.",
      data: updatedProject,
    });
  } catch (error) {
    if (error instanceof Error && "issues" in error) {
      const issues = (error as { issues?: { message: string }[] }).issues ?? [];
      return NextResponse.json({ message: issues[0]?.message || "Payload tidak valid." }, { status: 400 });
    }

    console.error(error);
    return NextResponse.json({ message: "Terjadi kesalahan saat memperbarui project." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { productId: productIdParam } = await params;
    const productId = productIdParam;

    if (!productId) {
      return NextResponse.json({ message: "Product ID tidak valid." }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { productId },
    });

    if (!project) {
      return NextResponse.json({ message: "Project tidak ditemukan." }, { status: 404 });
    }

    // Hapus image dari MinIO storage jika ada
    if (project.image && hasMinioConfig()) {
      try {
        await deleteMinioObject(project.image);
      } catch (err) {
        console.error("Gagal hapus image dari MinIO:", err);
      }
    }

    await prisma.projectTranslation.deleteMany({
      where: { projectId: project.id },
    });

    await prisma.project.delete({
      where: { productId },
    });

    return NextResponse.json({
      message: "Project berhasil dihapus.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Terjadi kesalahan saat menghapus project." }, { status: 500 });
  }
}
