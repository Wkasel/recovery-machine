"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword } from "@/core/actions/auth";
import { ArrowLeft, CheckCircle, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ResetPasswordPage(): React.ReactElement {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setError("Please enter a new password");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("password", password);

    const result = await updatePassword(formData);

    if (result && !result.success) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setSuccess(true);
      setIsLoading(false);
    }
  };

  if (success) {
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
                Password updated!
              </h3>
              <p className="text-sm text-charcoal-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
                Your password has been successfully updated. You can now sign in with your new password.
              </p>
            </div>

            <Link href="/sign-in" className="w-full block">
              <Button
                className="w-full bg-charcoal text-white hover:bg-charcoal/90 rounded-full"
                style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
              >
                Sign in
              </Button>
            </Link>
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
            Reset your password
          </h2>
          <p className="text-sm text-charcoal-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
            Enter your new password below.
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
            <Label htmlFor="password" className="text-charcoal" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
              New Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="bg-white border-mint-accent/30 text-charcoal placeholder:text-charcoal-light/50"
              style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
            />
            <p className="text-xs text-charcoal-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
              Must be at least 8 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-charcoal" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            <Lock className="mr-2 h-4 w-4" />
            {isLoading ? "Updating..." : "Update Password"}
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
