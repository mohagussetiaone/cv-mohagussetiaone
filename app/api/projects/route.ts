import { NextResponse } from "next/server";
import { getAuthSession } from "@/auth";
import { isAdminEmail } from "@/lib/auth";
import { createNamedIfMissing, prisma } from "@/lib/prisma";
import { getProjects, getProjectsPage } from "@/lib/projects";
import type { ProjectLocale } from "@/app/types/project";
import { projectPayloadSchema } from "@/lib/validators/project";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale");
  const locale: ProjectLocale = localeParam === "en" ? "en" : "id";

  // Halaman publik: ambil SEMUA project tanpa pagination agar selalu sinkron dengan CRUD
  if (searchParams.get("all") === "true") {
    const data = await getProjects(locale);
    return NextResponse.json({ data });
  }

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
    const productId = payload.productId ?? globalThis.crypto.randomUUID();

    if (payload.productId) {
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

    // SQLite/D1 tidak mendukung skipDuplicates — helper menyaring nama yang sudah ada.
    await createNamedIfMissing("skill", payload.technologies);
    await createNamedIfMissing("category", payload.categories);

    const project = await prisma.project.create({
      data: {
        productId,
        projectName: payload.projectName,
        image: payload.image,
        urlPreview: payload.urlPreview,
        githubUrl: payload.githubUrl,
        figmaUrl: payload.figmaUrl,
        internal: payload.internal,
        techStack: payload.techStack,
        deployment: payload.deployment,
        server: payload.server,
        designMethod: payload.designMethod,
        orm: payload.orm,
        database: payload.database,
        domainProvider: payload.domainProvider,
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
              description: payload.translations.id.description,
            },
            {
              locale: "en",
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
