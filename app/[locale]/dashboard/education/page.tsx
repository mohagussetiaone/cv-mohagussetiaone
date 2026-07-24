import { EducationClient } from "@/components/dashboard/EducationClient";

export default async function EducationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <EducationClient locale={locale} />;
}
