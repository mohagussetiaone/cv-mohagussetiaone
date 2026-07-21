import { NextResponse } from "next/server";
import { getAuthSession } from "@/auth";
import { isAdminEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getProjectsPage } from "@/lib/projects";
import type { ProjectLocale } from "@/app/types/project";
import { projectPayloadSchema } from "@/lib/validators/project";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale");
  const locale: ProjectLocale = localeParam === "en" ? "en" : "id";
  const search = searchParams.get("search") ?? "";
  const page = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const pageSize = Number.parseInt(searchParams.get("pageSize") ?? "10", 10);
  const result = await getProjectsPage({ locale, search, page, pageSize });

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json(
        {
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const json = await request.json();
    const payload = projectPayloadSchema.parse(json);

    // Auto-generate productId if not provided
    let productId = payload.productId;

    if (productId === undefined) {
      const lastProject = await prisma.project.findFirst({
        orderBy: { productId: "desc" },
        select: { productId: true },
      });
      productId = (lastProject?.productId ?? -1) + 1;
    } else {
      const existingProject = await prisma.project.findUnique({
        where: { productId },
      });

      if (existingProject) {
        return NextResponse.json(
          {
            message: `Project dengan productId ${productId} sudah ada.`,
          },
          { status: 409 }
        );
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

    const project = await prisma.project.create({
      data: {
        productId,
        image: payload.image,
        urlPreview: payload.urlPreview,
        githubUrl: payload.githubUrl,
        figmaUrl: payload.figmaUrl,
        internal: payload.internal,
        skills: {
          connect: payload.technologies.map((name) => ({ name })),
        },
        categories: {
          connect: payload.categories.map((name) => ({ name })),
        },
        translations: {
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

    return NextResponse.json(
      {
        message: "Project berhasil dibuat.",
        data: project,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && "issues" in error) {
      const issues = (error as { issues?: { message: string }[] }).issues ?? [];
      return NextResponse.json(
        {
          message: issues[0]?.message || "Payload tidak valid.",
        },
        { status: 400 }
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        message: "Terjadi kesalahan saat menyimpan project.",
      },
      { status: 500 }
    );
  }
}
