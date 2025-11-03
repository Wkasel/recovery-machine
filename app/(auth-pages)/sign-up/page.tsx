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
      <Card className="w-full bg-white/70 backdrop-blur-sm border-mint-accent/20">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <Alert className="bg-mint-accent/20 border-mint-accent/30">
              <CheckCircle className="h-4 w-4 text-mint" />
              <AlertDescription className="text-charcoal" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
                Magic link sent to <span className="font-medium">{email}</span>. Check your email
                and click the link to create your account.
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
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form action={handlePasswordSignUp} className="space-y-4">
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
              className="bg-white border-mint-accent/30 text-charcoal placeholder:text-charcoal-light/50"
              style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
              disabled={isLoading}
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
              placeholder="Create a strong password (8+ characters)"
              className="bg-white border-mint-accent/30 text-charcoal placeholder:text-charcoal-light/50"
              style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
              disabled={isLoading}
              minLength={8}
            />
            <p className="text-xs text-charcoal-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>Must be at least 8 characters</p>
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full bg-charcoal text-white hover:bg-charcoal/90 rounded-full"
              style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
              disabled={isLoading}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              {isLoading ? "Creating account..." : "Create Account with Password"}
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
              {isLoading ? "Sending..." : "Sign up with Magic Link"}
            </Button>
          </div>
        </form>

        <div className="text-center space-y-4 pt-4">
          <p className="text-sm text-charcoal-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
            Already have an account?{" "}
            <Link href="/sign-in" className="text-charcoal font-medium hover:text-mint transition-colors">
              Sign in
            </Link>
          </p>

          <div className="text-xs text-charcoal-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
            By signing up, you agree to our{" "}
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
