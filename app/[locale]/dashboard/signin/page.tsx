import { redirect } from "next/navigation";

type SignInPageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function DashboardSignInPage({ params, searchParams }: SignInPageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.error ? `?error=${encodeURIComponent(resolvedSearchParams.error)}` : "";

  redirect(`/${locale}/signin${query}`);
}
