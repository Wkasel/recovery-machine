import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <div className="max-w-md w-full space-y-4 text-center">
        <h1 className="text-2xl font-bold">Authentication Error</h1>
        <p className="text-muted-foreground">
          We encountered an issue while trying to authenticate you. This could be due to an expired
          link, an invalid token, or a server issue.
        </p>
        <div className="flex flex-col gap-2 pt-4">
          <Button asChild>
            <Link href="/sign-in">Try signing in again</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Return to home page</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
