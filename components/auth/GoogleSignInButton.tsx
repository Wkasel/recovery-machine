"use client";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";

interface GoogleSignInButtonProps {
  onError?: (error: string) => void;
  redirectTo?: string;
}

export default function GoogleSignInButton({
  onError,
  redirectTo = "/protected"
}: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    try {
      setIsLoading(true);
      // The URL will be used in the href attribute of the button
    } catch (error) {
      setIsLoading(false);
      if (onError) onError(typeof error === 'string' ? error : 'Failed to sign in with Google');
    }
  };

  const oauthUrl = `/api/auth/oauth?provider=google&redirectTo=${encodeURIComponent(redirectTo)}`;

  return (
    <Button
      asChild
      className="w-full flex items-center justify-center gap-2"
      variant="outline"
      disabled={isLoading}
      onClick={handleClick}
    >
      <a href={oauthUrl}>
        <FcGoogle className="h-5 w-5" />
        <span>{isLoading ? "Signing in..." : "Continue with Google"}</span>
      </a>
    </Button>
  );
}
