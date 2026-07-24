import { WorksClient } from "@/components/dashboard/WorksClient";

export default async function WorksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <WorksClient locale={locale} />;
}
