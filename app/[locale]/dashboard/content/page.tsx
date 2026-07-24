import { redirect } from "next/navigation";
import { getAuthSession } from "@/auth";
import { isAdminEmail } from "@/lib/auth";
import { ContentClient } from "@/components/dashboard/ContentClient";

export default async function ContentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getAuthSession();

  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    redirect(`/${locale}/signin`);
  }

  return <ContentClient locale={locale} />;
}
