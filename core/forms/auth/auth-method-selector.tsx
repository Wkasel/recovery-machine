"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendMagicLink, signIn, signUp } from "@/core/actions/auth";
import { useState } from "react";

export type AuthMethod = "signin" | "signup" | "magic";

interface AuthMethodSelectorProps {
  method?: AuthMethod;
  onMethodChange?: (method: AuthMethod) => void;
}

export function AuthMethodSelector({ method = "signin", onMethodChange }: AuthMethodSelectorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      if (method === "magic") {
        const result = await sendMagicLink(formData);
        setMessage(result.message);
      } else if (method === "signup") {
        await signUp(formData);
      } else {
        await signIn(formData);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {method === "signin" && "Sign In"}
          {method === "signup" && "Sign Up"}
          {method === "magic" && "Magic Link"}
        </CardTitle>
        <CardDescription>
          {method === "signin" && "Welcome back to The Recovery Machine"}
          {method === "signup" && "Join The Recovery Machine"}
          {method === "magic" && "Get a magic link sent to your email"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
          </div>

          {method !== "magic" && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? "Loading..."
              : method === "signin"
                ? "Sign In"
                : method === "signup"
                  ? "Sign Up"
                  : "Send Magic Link"}
          </Button>
        </form>

        {message && <p className="mt-4 text-sm text-center text-muted-foreground">{message}</p>}

        <div className="mt-4 flex justify-center space-x-2 text-sm">
          {method !== "signin" && (
            <Button variant="link" onClick={() => onMethodChange?.("signin")}>
              Sign In
            </Button>
          )}
          {method !== "signup" && (
            <Button variant="link" onClick={() => onMethodChange?.("signup")}>
              Sign Up
            </Button>
          )}
          {method !== "magic" && (
            <Button variant="link" onClick={() => onMethodChange?.("magic")}>
              Magic Link
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
