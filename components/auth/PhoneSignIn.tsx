"use client";

import { getSupabaseClient } from "@/services/supabase/clientFactory";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Logger } from "@/lib/logger/Logger";

export default function PhoneSignIn() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    async function initSupabase() {
      const client = await getSupabaseClient();
      setSupabase(client);
    }
    initSupabase();
  }, []);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (!supabase) throw new Error("Supabase client not ready");
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });
      if (error) throw error;
      setShowOTPInput(true);
      toast.success("OTP sent to your phone number");
    } catch (error) {
      Logger.getInstance().error(
        "Error sending OTP",
        { component: "PhoneSignIn" },
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
      const { error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otpCode,
        type: "sms",
      });
      if (error) throw error;
      toast.success("Successfully signed in");
      // Redirect will be handled by middleware
    } catch (error) {
      Logger.getInstance().error(
        "Error verifying OTP",
        { component: "PhoneSignIn" },
        error instanceof Error ? error : new Error(String(error))
      );
      toast.error("Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      {!showOTPInput ? (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              pattern="^\+[1-9]\d{1,14}$"
              title="Phone number must be in international format (e.g., +1234567890)"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send OTP"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div>
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter OTP"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              required
              pattern="[0-9]{6}"
              maxLength={6}
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
              onClick={() => setShowOTPInput(false)}
            >
              Back to Phone Number
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
