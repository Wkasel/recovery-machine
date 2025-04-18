"use client";

import { Button } from "@/components/ui/button";
import { useGoogleSignIn } from "@/core/forms/auth/oauth-form";
import { useLoading } from "@/lib/ui/loading/context";
import { FcGoogle } from "react-icons/fc";

export default function GoogleSignInButton() {
  const { setLoading, isLoading } = useLoading();
  const handleGoogleSignIn = useGoogleSignIn({
    onStart: () => setLoading("google-sign-in", true),
    onError: () => setLoading("google-sign-in", false),
  });

  return (
    <form action={handleGoogleSignIn}>
      <Button
        type="submit"
        className="w-full flex items-center justify-center gap-2"
        variant="outline"
        disabled={isLoading("google-sign-in")}
      >
        <FcGoogle className="h-5 w-5" />
        <span>{isLoading("google-sign-in") ? "Signing in..." : "Continue with Google"}</span>
      </Button>
    </form>
  );
}
