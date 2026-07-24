import { redirect } from "next/navigation";
import { getAuthSession } from "@/auth";
import { isAdminEmail } from "@/lib/auth";
import { ProjectClient } from "@/components/dashboard/ProjectClient";

export default async function ProjectPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getAuthSession();

  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    redirect(`/${locale}/signin`);
  }

  return <ProjectClient locale={locale} userEmail={session.user.email} />;
}
