import { SkillsClient } from "@/components/dashboard/SkillsClient";

export default async function SkillsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <SkillsClient locale={locale} />;
}
