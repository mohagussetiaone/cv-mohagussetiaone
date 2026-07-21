import { redirect } from "next/navigation";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { getAuthSession } from "@/auth";
import { isAdminEmail } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInButton } from "@/components/dashboard/SignInButton";

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
  const query = resolvedSearchParams.error
    ? `?error=${encodeURIComponent(resolvedSearchParams.error)}`
    : "";

  redirect(`/${locale}/signin${query}`);
}
