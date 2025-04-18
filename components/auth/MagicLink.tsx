"use client";

import { useState } from "react";
import { useMagicLinkForm, useVerifyMagicLinkForm } from "@/core/forms/auth/magic-link-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function MagicLink() {
  const [emailSent, setEmailSent] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);

  const magicLinkForm = useMagicLinkForm({
    onEmailSent: () => setEmailSent(true),
  });

  const otpForm = useMagicLinkForm({
    onEmailSent: () => setShowOTPInput(true),
  });

  const verifyOtpForm = useVerifyMagicLinkForm();

  if (emailSent) {
    return (
      <div className="text-center space-y-4">
        <Alert>
          <AlertDescription>
            We've sent a magic link to {magicLinkForm.getValues().email}
          </AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => setEmailSent(false)} className="w-full">
          Use a different email
        </Button>
      </div>
    );
  }

  return (
    <Tabs defaultValue="magic-link" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
        <TabsTrigger value="otp">Email OTP</TabsTrigger>
      </TabsList>

      <TabsContent value="magic-link">
        {magicLinkForm.shouldShowSkeleton ? (
          <magicLinkForm.LoadingSkeleton />
        ) : (
          <form action={magicLinkForm.handleAction} className="space-y-4">
            <div>
              <Label htmlFor="email-magic">Email</Label>
              <Input
                id="email-magic"
                type="email"
                placeholder="you@example.com"
                {...magicLinkForm.register("email")}
                required
                autoComplete="email"
                disabled={magicLinkForm.isLoading}
              />
              {magicLinkForm.formState.errors.email?.message && (
                <p className="text-sm text-destructive mt-1">
                  {magicLinkForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={magicLinkForm.isLoading}>
              {magicLinkForm.isLoading ? "Sending..." : "Send Magic Link"}
            </Button>
          </form>
        )}
      </TabsContent>

      <TabsContent value="otp">
        {!showOTPInput ? (
          otpForm.shouldShowSkeleton ? (
            <otpForm.LoadingSkeleton />
          ) : (
            <form action={otpForm.handleAction} className="space-y-4">
              <div>
                <Label htmlFor="email-otp">Email</Label>
                <Input
                  id="email-otp"
                  type="email"
                  placeholder="you@example.com"
                  {...otpForm.register("email")}
                  required
                  autoComplete="email"
                  disabled={otpForm.isLoading}
                />
                {otpForm.formState.errors.email?.message && (
                  <p className="text-sm text-destructive mt-1">
                    {otpForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={otpForm.isLoading}>
                {otpForm.isLoading ? "Sending..." : "Send OTP Code"}
              </Button>
            </form>
          )
        ) : verifyOtpForm.shouldShowSkeleton ? (
          <verifyOtpForm.LoadingSkeleton />
        ) : (
          <form action={verifyOtpForm.handleAction} className="space-y-4">
            <input
              type="hidden"
              {...verifyOtpForm.register("email")}
              value={otpForm.getValues().email}
            />
            <div>
              <Label htmlFor="token">Enter OTP Code</Label>
              <Input
                id="token"
                type="text"
                placeholder="Enter 6-digit code"
                {...verifyOtpForm.register("token")}
                required
                pattern="[0-9]{6}"
                maxLength={6}
                autoComplete="one-time-code"
                disabled={verifyOtpForm.isLoading}
              />
              {verifyOtpForm.formState.errors.token?.message && (
                <p className="text-sm text-destructive mt-1">
                  {verifyOtpForm.formState.errors.token.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Button type="submit" className="w-full" disabled={verifyOtpForm.isLoading}>
                {verifyOtpForm.isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setShowOTPInput(false);
                  verifyOtpForm.reset();
                }}
                disabled={verifyOtpForm.isLoading}
              >
                Send New Code
              </Button>
            </div>
          </form>
        )}
      </TabsContent>
    </Tabs>
  );
}
