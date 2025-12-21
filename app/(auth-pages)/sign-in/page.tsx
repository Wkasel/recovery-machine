"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendMagicLink, signIn } from "@/core/actions/auth";
import { CheckCircle, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function SignInForm(): React.ReactElement {
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError === "callback_failed") {
      setError("Magic link authentication failed. Please try again.");
    }
  }, [searchParams]);

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    // Pass the redirect URL if specified in query params
    const redirectTo = searchParams.get("redirect");
    if (redirectTo) {
      formData.append("redirectTo", redirectTo);
    }

    const result = await signIn(formData);

    // If we get here (no redirect), check for errors
    if (result && !result.success) {
      setError(result.error);
      setIsLoading(false);
    }
    // If successful, signIn will redirect automatically
  };

  const handleMagicLink = async () => {
    if (!email) {
      setError("Please enter your email first");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("email", email);

      // Pass the redirect URL if specified in query params
      const redirectTo = searchParams.get("redirect");
      if (redirectTo) {
        formData.append("redirectTo", redirectTo);
      }

      const result = await sendMagicLink(formData);
      console.log("Magic link result:", result);
      setMagicLinkSent(true);
    } catch (err: any) {
      console.error("Magic link error:", err);
      setError(err.message || "Failed to send magic link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (magicLinkSent) {
    return (
      <Card className="w-full bg-white/70 backdrop-blur-sm border-mint-accent/20">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <Alert className="bg-mint-accent/20 border-mint-accent/30">
              <CheckCircle className="h-4 w-4 text-mint" />
              <AlertDescription className="text-charcoal" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
                Magic link sent to <span className="font-medium">{email}</span>. Check your email
                and click the link to sign in.
              </AlertDescription>
            </Alert>
            <Button
              variant="outline"
              onClick={() => setMagicLinkSent(false)}
              className="w-full rounded-full border-charcoal text-charcoal hover:bg-charcoal hover:text-white"
              style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
            >
              Try different email
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white/70 backdrop-blur-sm border-mint-accent/20">
      <CardContent className="p-6 space-y-4">
        {error && (
          <Alert className="bg-amber-50/50 border-amber-200/50 backdrop-blur-sm">
            <AlertDescription className="text-amber-800 font-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
              {error === "Invalid login credentials"
                ? "Hmm, we couldn't find that email and password combination. Double-check your credentials or try signing in with a magic link."
                : error}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handlePasswordSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-charcoal" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="bg-white border-mint-accent/30 text-charcoal placeholder:text-charcoal-light/50"
              style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-charcoal" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="bg-white border-mint-accent/30 text-charcoal placeholder:text-charcoal-light/50"
              style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
            />
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-charcoal text-white hover:bg-charcoal/90 rounded-full disabled:opacity-50"
              style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
            >
              <Lock className="mr-2 h-4 w-4" />
              {isLoading ? "Signing in..." : "Sign in with Password"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-mint-accent/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-charcoal-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleMagicLink}
              className="w-full rounded-full border-mint-accent/30 text-charcoal hover:bg-mint-accent/10"
              style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
              disabled={isLoading || !email}
            >
              <Mail className="mr-2 h-4 w-4" />
              {isLoading ? "Sending..." : "Send Magic Link"}
            </Button>
          </div>
        </form>

        <div className="text-center space-y-4 pt-4">
          <p className="text-sm text-charcoal-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-charcoal font-medium hover:text-mint transition-colors">
              Sign up
            </Link>
          </p>

          <div className="text-xs text-charcoal-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-charcoal hover:text-mint transition-colors">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-charcoal hover:text-mint transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SignInPage(): React.ReactElement {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin h-8 w-8 border-2 border-mint border-t-transparent rounded-full"></div>
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
