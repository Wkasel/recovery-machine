"use client";

import { getSupabaseClient } from "@/services/supabase/clientFactory";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logger } from "@/lib/logger/Logger";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const supabaseClient = await getSupabaseClient();
        setSupabase(supabaseClient);
        const {
          data: { user },
          error,
        } = await supabaseClient.auth.getUser();
        if (error) throw error;
        setUser(user);
      } catch (error) {
        Logger.getInstance().error(
          "Error loading profile",
          { component: "ProfilePage" },
          error instanceof Error ? error : new Error(String(error))
        );
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleUpdateEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newEmail = formData.get("email") as string;
    try {
      setIsUpdating(true);
      if (!supabase) throw new Error("Supabase client not ready");
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      toast.success("Email update confirmation sent");
    } catch (error) {
      Logger.getInstance().error(
        "Error updating email",
        { component: "ProfilePage" },
        error instanceof Error ? error : new Error(String(error))
      );
      toast.error("Failed to update email");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setIsUpdating(true);
      if (!supabase) throw new Error("Supabase client not ready");
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated successfully");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      Logger.getInstance().error(
        "Error updating password",
        { component: "ProfilePage" },
        error instanceof Error ? error : new Error(String(error))
      );
      toast.error("Failed to update password");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Manage your account settings and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Profile Info */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Account Information</h3>
            <div className="text-sm text-muted-foreground">
              <p>User ID: {user?.id}</p>
              <p>Current Email: {user?.email}</p>
              <p>Last Sign In: {new Date(user?.last_sign_in_at).toLocaleString()}</p>
            </div>
          </div>

          {/* Update Email */}
          <form onSubmit={handleUpdateEmail} className="space-y-4">
            <h3 className="text-lg font-medium">Update Email</h3>
            <div className="space-y-2">
              <Label htmlFor="email">New Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter new email"
                required
                autoComplete="email"
              />
            </div>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Email"}
            </Button>
          </form>

          {/* Update Password */}
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <h3 className="text-lg font-medium">Change Password</h3>
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter new password"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
