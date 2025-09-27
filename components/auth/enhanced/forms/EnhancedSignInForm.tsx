"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, CheckCircle, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { signIn, sendMagicLink } from "@/core/actions/auth";
import { signInSchema, magicLinkSchema, type SignInFormData, type MagicLinkFormData } from "../validation/auth-schemas";
import { useAuthForm, useRateLimit } from "@/lib/hooks/useAuthForm";
import { FormField } from "./FormField";
import { PasswordField } from "./PasswordField";

interface EnhancedSignInFormProps {
  onSuccess?: () => void;
  showMagicLink?: boolean;
  className?: string;
}

export function EnhancedSignInForm({ 
  onSuccess,
  showMagicLink = true,
  className 
}: EnhancedSignInFormProps) {
  const [authMethod, setAuthMethod] = useState<"password" | "magic-link">("password");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const rateLimit = useRateLimit(5, 15 * 60 * 1000); // 5 attempts per 15 minutes

  // Password sign-in form
  const passwordForm = useAuthForm({
    schema: signInSchema,
    action: signIn,
    successRedirect: "/profile",
    onSuccess,
    onError: (error) => {
      rateLimit.addAttempt();
    },
  });

  // Magic link form
  const magicLinkForm = useAuthForm({
    schema: magicLinkSchema,
    action: sendMagicLink,
    onSuccess: () => {
      setMagicLinkSent(true);
    },
  });

  if (magicLinkSent) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Check your email</h3>
              <p className="text-sm text-muted-foreground">
                We've sent a magic link to{" "}
                <span className="font-medium text-foreground">
                  {magicLinkForm.form.getValues("email")}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                Click the link in your email to sign in. The link will expire in 24 hours.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setMagicLinkSent(false);
                  magicLinkForm.form.reset();
                }}
                className="w-full"
              >
                Try different email
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAuthMethod("password")}
                className="w-full"
              >
                Use password instead
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your Recovery Machine account
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Auth method selector */}
        {showMagicLink && (
          <div className="flex rounded-lg bg-muted p-1">
            <button
              type="button"
              onClick={() => setAuthMethod("password")}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                authMethod === "password"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Lock className="w-4 h-4 inline mr-2" />
              Password
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod("magic-link")}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                authMethod === "magic-link"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              Magic Link
            </button>
          </div>
        )}

        {/* Error alerts */}
        {passwordForm.submitError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{passwordForm.submitError}</AlertDescription>
          </Alert>
        )}

        {magicLinkForm.submitError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{magicLinkForm.submitError}</AlertDescription>
          </Alert>
        )}

        {/* Rate limiting warning */}
        {rateLimit.isRateLimited && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Too many failed attempts. Please wait {rateLimit.remainingTime} seconds before trying again.
            </AlertDescription>
          </Alert>
        )}

        {/* Password form */}
        {authMethod === "password" && (
          <form onSubmit={passwordForm.handleSubmit} className="space-y-4">
            <FormField
              form={passwordForm.form}
              name="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <PasswordField
              form={passwordForm.form}
              name="password"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  {...passwordForm.form.register("rememberMe")}
                />
                <Label htmlFor="rememberMe" className="text-sm text-muted-foreground">
                  Remember me
                </Label>
              </div>
              
              <Link 
                href="/forgot-password" 
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={passwordForm.isLoading}
              loadingText="Signing in..."
              disabled={rateLimit.isRateLimited}
            >
              Sign in
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        )}

        {/* Magic link form */}
        {authMethod === "magic-link" && (
          <form onSubmit={magicLinkForm.handleSubmit} className="space-y-4">
            <FormField
              form={magicLinkForm.form}
              name="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              helperText="We'll send you a secure sign-in link"
              required
              autoComplete="email"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Button
              type="submit"
              className="w-full"
              loading={magicLinkForm.isLoading}
              loadingText="Sending magic link..."
            >
              Send magic link
              <Mail className="w-4 h-4 ml-2" />
            </Button>
          </form>
        )}

        {/* Footer */}
        <div className="text-center space-y-4 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>

          <div className="text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}