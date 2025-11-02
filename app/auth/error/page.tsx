import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 bg-background">
      <div className="max-w-md w-full space-y-4 text-center">
        <h1 className="text-2xl font-bold text-charcoal" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>Authentication Error</h1>
        <p className="text-charcoal-light font-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
          We encountered an issue while trying to authenticate you. This could be due to an expired
          link, an invalid token, or a server issue.
        </p>
        <div className="flex flex-col gap-2 pt-4">
          <Button asChild className="rounded-full bg-charcoal text-white hover:bg-charcoal/90 hover:scale-105 transition-all" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
            <Link href="/sign-in">Try signing in again</Link>
          </Button>
          <Button variant="outline" asChild className="rounded-full border-mint-accent text-charcoal hover:bg-mint-accent/10 hover:scale-105 transition-all" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
            <Link href="/">Return to home page</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
