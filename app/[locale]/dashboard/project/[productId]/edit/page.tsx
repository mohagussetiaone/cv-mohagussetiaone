import { redirect, notFound } from "next/navigation";
import { getAuthSession } from "@/auth";
import { isAdminEmail } from "@/lib/auth";
import { getProjectByProductId } from "@/lib/projects";
import { ProjectEditor } from "@/components/dashboard/ProjectEditor";
import type { ProjectLocale } from "@/app/types/project";

export default async function EditProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; productId: string }>;
  searchParams: Promise<{ page?: string; pageSize?: string; search?: string }>;
}) {
  const { locale, productId } = await params;
  const session = await getAuthSession();

  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    redirect(`/${locale}/signin`);
  }

  const projectLocale: ProjectLocale = locale === "en" ? "en" : "id";
  const project = await getProjectByProductId(productId, projectLocale);

  if (!project) {
    notFound();
  }

  return <ProjectEditor project={project} locale={locale} />;
}
