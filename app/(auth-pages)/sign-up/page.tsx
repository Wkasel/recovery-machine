"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendMagicLink, signUp } from "@/core/actions/auth";
import { CheckCircle, Mail, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SignUpPage(): React.ReactElement {
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handlePasswordSignUp = async (formData: FormData) => {
    setIsLoading(true);
    setError("");
    try {
      await signUp(formData);
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    }
    setIsLoading(false);
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
      await sendMagicLink(formData);
      setMagicLinkSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send magic link");
    }
    setIsLoading(false);
  };

  if (magicLinkSent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-neutral-900 border-neutral-800">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Alert className="bg-green-950/50 border-green-900/50">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-100">
                  Magic link sent to <span className="font-medium">{email}</span>. Check your email
                  and click the link to create your account.
                </AlertDescription>
              </Alert>
              <Button
                variant="outline"
                onClick={() => setMagicLinkSent(false)}
                className="w-full bg-transparent border-neutral-700 text-white hover:bg-neutral-800"
              >
                Try different email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-neutral-900 border-neutral-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
          <CardDescription className="text-neutral-400">
            Join The Recovery Machine community
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert className="bg-red-950/50 border-red-900/50">
              <AlertDescription className="text-red-100">{error}</AlertDescription>
            </Alert>
          )}

          <form action={handlePasswordSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
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
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a strong password (8+ characters)"
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                disabled={isLoading}
                minLength={8}
              />
              <p className="text-xs text-neutral-500">Must be at least 8 characters</p>
            </div>

            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-neutral-200"
                disabled={isLoading}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {isLoading ? "Creating account..." : "Create Account with Password"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-neutral-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-neutral-900 px-2 text-neutral-400">Or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleMagicLink}
                className="w-full bg-transparent border-neutral-700 text-white hover:bg-neutral-800"
                disabled={isLoading || !email}
              >
                <Mail className="mr-2 h-4 w-4" />
                {isLoading ? "Sending..." : "Sign up with Magic Link"}
              </Button>
            </div>
          </form>

          <div className="text-center space-y-4 pt-4">
            <p className="text-sm text-neutral-400">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-white font-medium hover:underline">
                Sign in
              </Link>
            </p>

            <div className="text-xs text-neutral-500">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-white hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-white hover:underline">
                Privacy Policy
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
