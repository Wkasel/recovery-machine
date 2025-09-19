"use client";

import { FormBuilder } from "@/components/form/FormBuilder";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { clientAuthSchemas } from "@/core/schemas/client/auth";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface PhoneSignInProps {
  onError?: (error: string) => void;
  pageType?: "sign-in" | "sign-up";
}

export default function PhoneSignIn({ onError, pageType = "sign-in" }: PhoneSignInProps) {
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  // After successful verification
  if (verificationSuccess) {
    return (
      <div className="text-center space-y-4">
        <Alert variant="default" className="bg-muted">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Your phone number has been verified. You'll be redirected shortly.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!showOTPInput ? (
        <FormBuilder
          schema={clientAuthSchemas.phone.sendOtp}
          action={async (formData) => {
            const { sendMagicLink } = await import("@/core/actions/auth");
            return sendMagicLink(formData);
          }}
          formId="phone-send-otp"
          useCard={false}
          showActions={false}
          persistState={true}
          loadingFields={1}
          toastMessages={{
            success: "Verification code sent to your phone",
            error: "Failed to send code",
          }}
          analyticsEventName="auth_success"
          onSuccess={(data) => {
            const phoneInput = document.getElementById("phone") as HTMLInputElement;
            setPhoneNumber(phoneInput?.value || "");
            setShowOTPInput(true);
          }}
          onError={(error) => {
            if (onError) onError(error.message || "Failed to send verification code");
          }}
        >
          {(form) => (
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  {...form.register("phone")}
                  required
                  autoComplete="tel"
                  disabled={form.isLoading}
                  aria-invalid={!!form.formState.errors.phone}
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-destructive mt-1">
                    {String(form.formState.errors.phone.message)}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={form.isLoading}>
                {form.isLoading ? "Sending..." : "Send Verification Code"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                We'll send a verification code via SMS for a secure {pageType.replace("-", " ")}.
              </p>
            </div>
          )}
        </FormBuilder>
      ) : (
        <div className="space-y-4">
          <Alert variant="default" className="bg-muted">
            <AlertTitle>Enter verification code</AlertTitle>
            <AlertDescription>
              We sent a code to <span className="font-medium">{phoneNumber}</span>
            </AlertDescription>
          </Alert>

          <FormBuilder
            schema={clientAuthSchemas.phone.verifyOtp}
            action={async (formData) => {
              // Add the phone to the form data
              formData.append("phone", phoneNumber);
              const { signIn } = await import("@/core/actions/auth");
              return signIn(formData);
            }}
            formId="phone-verify-otp"
            useCard={false}
            showActions={false}
            loadingFields={1}
            toastMessages={{
              success: "Phone number verified successfully",
              error: "Failed to verify code",
            }}
            analyticsEventName="auth_success"
            onSuccess={() => {
              setVerificationSuccess(true);
              // Redirect will happen automatically from the server
            }}
            onError={(error) => {
              if (onError) onError(error.message || "Failed to verify code");
            }}
          >
            {(form) => (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="token" className="sr-only">
                    Verification code
                  </Label>
                  <Input
                    id="token"
                    type="text"
                    placeholder="Enter verification code"
                    {...form.register("token")}
                    required
                    pattern="[0-9]*"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    disabled={form.isLoading}
                    aria-invalid={!!form.formState.errors.token}
                    className="text-center text-lg tracking-widest"
                  />
                  {form.formState.errors.token && (
                    <p className="text-sm text-destructive mt-1">
                      {String(form.formState.errors.token.message)}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Button type="submit" className="w-full" disabled={form.isLoading}>
                    {form.isLoading ? "Verifying..." : "Verify Code"}
                  </Button>
                  <div className="flex items-center justify-between">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowOTPInput(false);
                        form.reset();
                      }}
                      disabled={form.isLoading}
                      className="text-xs"
                    >
                      Change number
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        form.reset();
                        setShowOTPInput(false);
                        setTimeout(() => setShowOTPInput(true), 0);
                      }}
                      disabled={form.isLoading}
                      className="text-xs"
                    >
                      Resend code
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Didn't receive a code? Check your phone number and try again.
                </p>
              </div>
            )}
          </FormBuilder>
        </div>
      )}
    </div>
  );
}
