import { CvManager } from "@/components/dashboard/CvManager";

export default async function CvPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <CvManager locale={locale} />;
}
