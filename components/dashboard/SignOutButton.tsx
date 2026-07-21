"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

type SignOutButtonProps = {
  callbackUrl: string;
};

export function SignOutButton({ callbackUrl }: SignOutButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => signOut({ callbackUrl })}
      className="rounded-full border-white/15 bg-transparent text-white hover:bg-white/10"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
}
