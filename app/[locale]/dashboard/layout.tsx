import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/auth";
import { isAdminEmail } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const session = await getAuthSession();
  const { locale } = await params;

  // Check if user is authenticated and is admin
  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    redirect(`/${locale}/signin`);
  }

  return (
    <DashboardShell locale={locale} userEmail={session.user.email}>
      {children}
    </DashboardShell>
  );
}
