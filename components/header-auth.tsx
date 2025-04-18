"use client";

import { useSignOut, useUser } from "@/core/supabase/hooks";
import Link from "next/link";
import type { ReactElement } from "react";
import { Button } from "./ui/button";

export default function AuthButton(): ReactElement {
  const { data: user, isLoading } = useUser();
  const { mutate: signOut, status } = useSignOut();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <Button onClick={() => signOut()} variant={"outline"} disabled={status === "pending"}>
        {status === "pending" ? "Signing out..." : "Sign out"}
      </Button>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
