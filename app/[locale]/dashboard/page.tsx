import { redirect } from "next/navigation";
import { getAuthSession } from "@/auth";
import { isAdminEmail } from "@/lib/auth";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getAuthSession();

  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    redirect(`/${locale}/signin`);
  }

  return <DashboardClient locale={locale} userEmail={session.user.email} />;
}
