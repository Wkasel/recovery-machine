"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset } from "@/core/actions/auth";
import { ArrowLeft, CheckCircle, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage(): React.ReactElement {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("email", email);

    const result = await requestPasswordReset(formData);

    if (result.success) {
      setEmailSent(true);
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  if (emailSent) {
    return (
      <Card className="w-full bg-white/70 backdrop-blur-sm border-mint-accent/20">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-mint-accent/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-mint" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-charcoal" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
                Check your email
              </h3>
              <p className="text-sm text-charcoal-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
                If an account exists for{" "}
                <span className="font-medium text-charcoal">{email}</span>,
                we've sent password reset instructions.
              </p>
              <p className="text-xs text-charcoal-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
                Don't see it? Check your spam folder. The link expires in 1 hour.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                }}
                className="w-full rounded-full border-charcoal text-charcoal hover:bg-charcoal hover:text-white"
                style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
              >
                Try different email
              </Button>

              <Link href="/sign-in" className="w-full">
                <Button
                  variant="ghost"
                  className="w-full text-charcoal-light hover:text-charcoal"
                  style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to sign in
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white/70 backdrop-blur-sm border-mint-accent/20">
      <CardContent className="p-6 space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-charcoal" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
            Forgot your password?
          </h2>
          <p className="text-sm text-charcoal-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
            No worries! Enter your email and we'll send you a reset link.
          </p>
        </div>

        {error && (
          <Alert className="bg-amber-50/50 border-amber-200/50 backdrop-blur-sm">
            <AlertDescription className="text-amber-800 font-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-charcoal text-white hover:bg-charcoal/90 rounded-full disabled:opacity-50"
            style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
          >
            <Mail className="mr-2 h-4 w-4" />
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        <div className="text-center pt-4">
          <Link href="/sign-in" className="inline-flex items-center text-sm text-charcoal-light hover:text-charcoal transition-colors" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
