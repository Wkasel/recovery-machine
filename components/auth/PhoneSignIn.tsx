"use client";

import { useState } from "react";
import { usePhoneForm, useVerifyPhoneForm } from "@/core/forms/auth/phone-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function PhoneSignIn() {
  const [showOTPInput, setShowOTPInput] = useState(false);

  const phoneForm = usePhoneForm({
    onCodeSent: () => setShowOTPInput(true),
  });

  const verifyOtpForm = useVerifyPhoneForm();

  return (
    <div className="space-y-4">
      {!showOTPInput ? (
        <form action={phoneForm.handleAction} className="space-y-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              {...phoneForm.register("phone")}
              required
              autoComplete="tel"
            />
            {phoneForm.formState.errors.phone && (
              <p className="text-sm text-destructive mt-1">
                {phoneForm.formState.errors.phone.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={phoneForm.formState.isSubmitting}>
            {phoneForm.formState.isSubmitting ? "Sending..." : "Send Verification Code"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            We'll send a verification code to this number
          </p>
        </form>
      ) : (
        <form action={verifyOtpForm.handleAction} className="space-y-4">
          <input
            type="hidden"
            {...verifyOtpForm.register("phone")}
            value={phoneForm.getValues().phone}
          />
          <div>
            <Label htmlFor="token">Verification Code</Label>
            <Input
              id="token"
              type="text"
              placeholder="Enter verification code"
              {...verifyOtpForm.register("token")}
              required
              pattern="[0-9]*"
              inputMode="numeric"
              autoComplete="one-time-code"
            />
            {verifyOtpForm.formState.errors.token && (
              <p className="text-sm text-destructive mt-1">
                {verifyOtpForm.formState.errors.token.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Button type="submit" className="w-full" disabled={verifyOtpForm.formState.isSubmitting}>
              {verifyOtpForm.formState.isSubmitting ? "Verifying..." : "Verify Code"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setShowOTPInput(false);
                verifyOtpForm.reset();
              }}
            >
              Send New Code
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Didn't receive a code? Check your phone number and try again
          </p>
        </form>
      )}
    </div>
  );
}
