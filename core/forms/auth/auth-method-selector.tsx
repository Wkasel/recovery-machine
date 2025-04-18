"use client";

import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import MagicLink from "@/components/auth/MagicLink";
import PhoneSignIn from "@/components/auth/PhoneSignIn";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export type AuthMethod = "oauth" | "magic-link" | "phone";

interface AuthMethodSelectorProps {
  defaultMethod?: AuthMethod;
  availableMethods?: AuthMethod[];
  footerContent?: React.ReactNode;
  /** The page type affects messaging */
  pageType?: "sign-in" | "sign-up";
  /** Where to redirect after successful authentication */
  redirectTo?: string;
}

const methodLabels: Record<AuthMethod, string> = {
  oauth: "Social Login",
  "magic-link": "Magic Link",
  phone: "Phone",
};

export function AuthMethodSelector({
  defaultMethod = "oauth",
  availableMethods = ["oauth", "magic-link", "phone"],
  footerContent,
  pageType = "sign-in",
  redirectTo = "/protected",
}: AuthMethodSelectorProps) {
  const [error, setError] = useState<string | null>(null);
  const [activeMethod, setActiveMethod] = useState<AuthMethod>(defaultMethod);
  const methods = availableMethods.filter(Boolean);

  // Create a unified error handler for child components to use
  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    // Scroll to the top to ensure error is visible
    setTimeout(() => {
      const errorElement = document.querySelector(".alert-error");
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // Create a method change handler that clears errors
  const handleMethodChange = (method: AuthMethod) => {
    setError(null);
    setActiveMethod(method);
  };

  return (
    <div className="w-full">
      {error && (
        <Alert variant="destructive" className="mb-4 alert-error">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs
        defaultValue={defaultMethod}
        className="w-full"
        onValueChange={(value) => handleMethodChange(value as AuthMethod)}
      >
        <TabsList
          className="grid w-full"
          style={{ gridTemplateColumns: `repeat(${methods.length}, 1fr)` }}
        >
          {methods.map((method) => (
            <TabsTrigger key={method} value={method}>
              {methodLabels[method]}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Fixed height container based on the tallest form to prevent layout shifts */}
        <div className="mt-6 min-h-[350px]">
          <TabsContent value="oauth" className="m-0 h-full">
            <div className="space-y-4">
              <GoogleSignInButton onError={handleError} redirectTo={redirectTo} />
            </div>
          </TabsContent>

          <TabsContent value="magic-link" className="m-0 h-full">
            <MagicLink onError={handleError} pageType={pageType} />
          </TabsContent>

          <TabsContent value="phone" className="m-0 h-full">
            <PhoneSignIn onError={handleError} pageType={pageType} />
          </TabsContent>
        </div>
      </Tabs>

      {footerContent && <div className="mt-6">{footerContent}</div>}
    </div>
  );
}

// For backward compatibility
export { AuthMethodSelector as AuthProvider };
