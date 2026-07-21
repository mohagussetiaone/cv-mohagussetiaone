"use client";

import { LogIn } from "lucide-react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

type SignInButtonProps = {
  callbackUrl: string;
};

export function SignInButton({ callbackUrl }: SignInButtonProps) {
  return (
    <Button type="button" onClick={() => signIn("google", { callbackUrl })} className="w-full rounded-full bg-white text-black hover:bg-white/90">
      <LogIn className="mr-2 h-4 w-4" />
      Login dengan Google
    </Button>
  );
}
