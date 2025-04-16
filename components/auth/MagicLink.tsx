"use client";

import { createBrowserSupabaseClient } from "@/services/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { Logger } from "@/lib/logger/Logger";

export default function MagicLink() {
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const client = createBrowserSupabaseClient();
    setSupabase(client);
  }, []);

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (!supabase) throw new Error("Supabase client not ready");
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect_to=/protected`,
        },
      });
      if (error) throw error;
      setIsSent(true);
      toast.success("Magic link sent to your email");
    } catch (error) {
      Logger.getInstance().error(
        "Error sending magic link",
        { component: "MagicLink" },
        error instanceof Error ? error : new Error(String(error))
      );
      toast.error("Failed to send magic link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (!supabase) throw new Error("Supabase client not ready");
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect_to=/protected`,
        },
      });
      if (error) throw error;
      setShowOTPInput(true);
      toast.success("OTP code sent to your email");
    } catch (error) {
      Logger.getInstance().error(
        "Error sending OTP",
        { component: "MagicLink" },
        error instanceof Error ? error : new Error(String(error))
      );
      toast.error("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (!supabase) throw new Error("Supabase client not ready");
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: "email",
      });
      if (error) throw error;
      toast.success("Successfully signed in");
      router.push("/protected");
    } catch (error) {
      Logger.getInstance().error(
        "Error verifying OTP",
        { component: "MagicLink" },
        error instanceof Error ? error : new Error(String(error))
      );
      toast.error("Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="text-center space-y-4">
        <h3 className="text-lg font-medium">Check your email</h3>
        <p className="text-sm text-muted-foreground">We've sent a magic link to {email}</p>
        <Button variant="outline" onClick={() => setIsSent(false)} className="w-full">
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
        <form onSubmit={handleSendMagicLink} className="space-y-4">
          <div>
            <Label htmlFor="email-magic">Email</Label>
            <Input
              id="email-magic"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Magic Link"}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="otp">
        {!showOTPInput ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <Label htmlFor="email-otp">Email</Label>
              <Input
                id="email-otp"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send OTP Code"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <Label htmlFor="otp">Enter OTP Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                required
                pattern="[0-9]{6}"
                maxLength={6}
                autoComplete="one-time-code"
              />
            </div>
            <div className="space-y-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setShowOTPInput(false);
                  setOtpCode("");
                }}
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
