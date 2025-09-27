"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { resetPasswordRequestSchema, type ResetPasswordRequestFormData } from "../validation/auth-schemas";
import { useAuthForm } from "@/lib/hooks/useAuthForm";
import { FormField } from "./FormField";

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function ForgotPasswordForm({ onSuccess, className }: ForgotPasswordFormProps) {
  const [emailSent, setEmailSent] = useState(false);

  // Mock password reset action (replace with actual implementation)
  const resetPasswordAction = async (formData: FormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  };

  const resetForm = useAuthForm({
    schema: resetPasswordRequestSchema,
    action: resetPasswordAction,
    onSuccess: () => {
      setEmailSent(true);
      onSuccess?.();
    },
  });

  if (emailSent) {
    return (
      <Card className={className}>
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
                We've sent password reset instructions to{" "}
                <span className="font-medium text-foreground">
                  {resetForm.form.getValues("email")}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                If you don't see the email, check your spam folder. The link will expire in 1 hour.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEmailSent(false);
                  resetForm.form.reset();
                }}
                className="w-full"
              >
                Try different email
              </Button>
              
              <Button variant="ghost" size="sm" asChild className="w-full">
                <Link href="/sign-in">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to sign in
                </Link>
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
        <CardTitle className="text-2xl font-bold">Forgot password?</CardTitle>
        <CardDescription>
          Enter your email and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {resetForm.submitError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{resetForm.submitError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={resetForm.handleSubmit} className="space-y-4">
          <FormField
            form={resetForm.form}
            name="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Button
            type="submit"
            className="w-full"
            loading={resetForm.isLoading}
            loadingText="Sending reset link..."
          >
            Send reset link
            <Mail className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <div className="text-center pt-4 border-t">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/sign-in">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to sign in
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}