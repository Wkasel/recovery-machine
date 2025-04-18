import { signOutAction } from "@/core/actions/server/auth/sign-out";
import { getCurrentUser } from "@/core/actions/server/auth/user-profile";

import { AuthError } from "@/core/errors/auth/AuthError";
import type { IUser } from "@/core/types";
import Link from "next/link";
import type { ReactElement } from "react";
import { Button } from "./ui/button";

interface ISuccessResult {
  success: true;
  data?: {
    user: IUser | null;
  };
  message?: string;
}

interface IErrorResult {
  success: false;
  error: string;
}

type ActionResult = ISuccessResult | IErrorResult;

export default async function AuthButton(): Promise<ReactElement> {
  const result = (await getCurrentUser()) as ActionResult;

  if (!result.success) {
    throw AuthError.unauthorized();
  }

  return result.data?.user ? (
    <div className="flex items-center gap-4">
      Hey, {result.data.user.email}!
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form>
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
