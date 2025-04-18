"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import MagicLink from "./MagicLink";
import PhoneSignIn from "./PhoneSignIn";
import GoogleSignInButton from "./GoogleSignInButton";

export type AuthMethod = "oauth" | "magic-link" | "phone";

interface AuthProviderProps {
  defaultMethod?: AuthMethod;
  availableMethods?: AuthMethod[];
  footerContent?: React.ReactNode;
}

const methodLabels: Record<AuthMethod, string> = {
  oauth: "Social Login",
  "magic-link": "Magic Link",
  phone: "Phone",
};

export function AuthProvider({
  defaultMethod = "oauth",
  availableMethods = ["oauth", "magic-link", "phone"],
  footerContent,
}: AuthProviderProps) {
  const [error, setError] = useState<string | null>(null);
  const methods = availableMethods.filter(Boolean);

  return (
    <div className="w-full">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue={defaultMethod} className="w-full">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${methods.length}, 1fr)` }}>
          {methods.map((method) => (
            <TabsTrigger key={method} value={method} onClick={() => setError(null)}>
              {methodLabels[method]}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6">
          <TabsContent value="oauth">
            <div className="space-y-4">
              <GoogleSignInButton />
            </div>
          </TabsContent>

          <TabsContent value="magic-link">
            <MagicLink />
          </TabsContent>

          <TabsContent value="phone">
            <PhoneSignIn />
          </TabsContent>
        </div>
      </Tabs>

      {footerContent && <div className="mt-6">{footerContent}</div>}
    </div>
  );
}
