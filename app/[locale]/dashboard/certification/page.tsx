import { CertificationClient } from "@/components/dashboard/CertificationClient";

export default async function CertificationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <CertificationClient locale={locale} />;
}
