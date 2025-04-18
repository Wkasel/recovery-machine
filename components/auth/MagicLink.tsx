"use client";

import { FormBuilder } from "@/components/form/FormBuilder";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { clientAuthSchemas } from "@/core/schemas/client/auth";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface MagicLinkProps {
  onError?: (error: string) => void;
  pageType?: "sign-in" | "sign-up";
}

export default function MagicLink({ onError, pageType = "sign-in" }: MagicLinkProps) {
  const [emailSent, setEmailSent] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [email, setEmail] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const title = pageType === "sign-in" ? "Sign in" : "Sign up";

  // When a magic link email is sent successfully
  if (emailSent) {
    return (
      <div className="text-center space-y-4">
        <Alert variant="default" className="bg-muted">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Check your inbox</AlertTitle>
          <AlertDescription>
            We've sent a magic link to <span className="font-medium">{email}</span>
          </AlertDescription>
        </Alert>
        <p className="text-sm text-muted-foreground">
          Click the link in the email to {pageType === "sign-in" ? "sign in" : "sign up"}. If you
          don't see it, check your spam folder.
        </p>
        <Button variant="outline" onClick={() => setEmailSent(false)} className="w-full">
          Use a different email
        </Button>
      </div>
    );
  }

  // After successful OTP verification
  if (verificationSuccess) {
    return (
      <div className="text-center space-y-4">
        <Alert variant="default" className="bg-muted">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Your email has been verified. You'll be redirected shortly.
          </AlertDescription>
        </Alert>
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
        <FormBuilder
          schema={clientAuthSchemas.magicLink.send}
          action={async (formData) => {
            const { sendMagicLink } = await import("@/core/actions/server/auth/methods/magic-link");
            return sendMagicLink(formData);
          }}
          formId="magic-link-send"
          useCard={false}
          showActions={false}
          persistState={true}
          loadingFields={1}
          toastMessages={{
            success: `Magic link sent to your email`,
            error: "Failed to send magic link",
          }}
          analyticsEventName="auth_success"
          onSuccess={(data) => {
            const emailInput = document.getElementById("email-magic") as HTMLInputElement;
            setEmail(emailInput?.value || "");
            setEmailSent(true);
          }}
          onError={(error) => {
            if (onError) onError(error.message || "Failed to send magic link");
          }}
        >
          {(form) => (
            <div className="space-y-4">
              <div>
                <Label htmlFor="email-magic">Email</Label>
                <Input
                  id="email-magic"
                  type="email"
                  placeholder="you@example.com"
                  {...form.register("email")}
                  required
                  autoComplete="email"
                  disabled={form.isLoading}
                  aria-invalid={!!form.formState.errors.email}
                />
                {form.formState.errors.email?.message && (
                  <p className="text-sm text-destructive mt-1">
                    {String(form.formState.errors.email.message)}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={form.isLoading}>
                {form.isLoading ? `Sending...` : `Send Magic Link`}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                We'll email you a magic link for a password-free {pageType.replace("-", " ")}.
              </p>
            </div>
          )}
        </FormBuilder>
      </TabsContent>

      <TabsContent value="otp">
        {!showOTPInput ? (
          <FormBuilder
            schema={clientAuthSchemas.magicLink.send}
            action={async (formData) => {
              const { sendMagicLink } = await import(
                "@/core/actions/server/auth/methods/magic-link"
              );
              return sendMagicLink(formData);
            }}
            formId="otp-send"
            useCard={false}
            showActions={false}
            persistState={true}
            loadingFields={1}
            toastMessages={{
              success: "OTP code sent to your email",
              error: "Failed to send OTP code",
            }}
            analyticsEventName="auth_success"
            onSuccess={(data) => {
              const emailInput = document.getElementById("email-otp") as HTMLInputElement;
              setEmail(emailInput?.value || "");
              setShowOTPInput(true);
            }}
            onError={(error) => {
              if (onError) onError(error.message || "Failed to send OTP code");
            }}
          >
            {(form) => (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email-otp">Email</Label>
                  <Input
                    id="email-otp"
                    type="email"
                    placeholder="you@example.com"
                    {...form.register("email")}
                    required
                    autoComplete="email"
                    disabled={form.isLoading}
                    aria-invalid={!!form.formState.errors.email}
                  />
                  {form.formState.errors.email?.message && (
                    <p className="text-sm text-destructive mt-1">
                      {String(form.formState.errors.email.message)}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={form.isLoading}>
                  {form.isLoading ? "Sending..." : "Send OTP Code"}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  We'll email you a one-time verification code for {pageType.replace("-", " ")}.
                </p>
              </div>
            )}
          </FormBuilder>
        ) : (
          <div className="space-y-4">
            <Alert variant="default" className="bg-muted">
              <AlertTitle>Enter verification code</AlertTitle>
              <AlertDescription>
                We sent a 6-digit code to <span className="font-medium">{email}</span>
              </AlertDescription>
            </Alert>

            <FormBuilder
              schema={clientAuthSchemas.magicLink.verify}
              action={async (formData) => {
                // Add the email to the form data
                formData.append("email", email);
                const { verifyMagicLinkOtp } = await import(
                  "@/core/actions/server/auth/methods/magic-link"
                );
                return verifyMagicLinkOtp(formData);
              }}
              formId="otp-verify"
              useCard={false}
              showActions={false}
              loadingFields={1}
              toastMessages={{
                success: "Successfully verified email",
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
                      placeholder="Enter 6-digit code"
                      {...form.register("token")}
                      required
                      pattern="[0-9]{6}"
                      maxLength={6}
                      autoComplete="one-time-code"
                      disabled={form.isLoading}
                      aria-invalid={!!form.formState.errors.token}
                      className="text-center text-lg tracking-widest"
                    />
                    {form.formState.errors.token?.message && (
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
                        Change email
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
                </div>
              )}
            </FormBuilder>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
