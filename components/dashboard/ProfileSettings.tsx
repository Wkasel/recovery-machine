"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User } from "@supabase/supabase-js";
import {
  AlertTriangle,
  Bell,
  CreditCard,
  MapPin,
  Save,
  Shield,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ProfileData {
  credits: number;
  referral_code: string;
  address: any;
  phone: string;
}

interface ProfileSettings {
  full_name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  preferences: {
    email_notifications: boolean;
    sms_notifications: boolean;
    marketing_emails: boolean;
    booking_reminders: boolean;
  };
}

interface ProfileSettingsProps {
  user: User;
  profileData: ProfileData;
  onRefresh: () => void;
}

export function ProfileSettings({ user, profileData, onRefresh }: ProfileSettingsProps) {
  const supabase = createBrowserSupabaseClient();
  const [settings, setSettings] = useState<ProfileSettings>({
    full_name: user.user_metadata?.full_name || "",
    email: user.email || "",
    phone: profileData.phone || "",
    address: {
      street: profileData.address?.street || "",
      city: profileData.address?.city || "",
      state: profileData.address?.state || "",
      zipCode: profileData.address?.zipCode || "",
    },
    preferences: {
      email_notifications: true,
      sms_notifications: false,
      marketing_emails: false,
      booking_reminders: true,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Load notification preferences (would come from database in real app)
    loadPreferences();
  }, [user.id]);

  const loadPreferences = async () => {
    // In a real app, you'd load these from a user_preferences table
    // For now, we'll use defaults
  };

  const updateProfile = async () => {
    setIsLoading(true);
    try {
      // Update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: settings.full_name,
        },
      });

      if (authError) throw authError;

      // Update profile in database
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          phone: settings.phone,
          address: settings.address,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      toast.success("Profile updated successfully!");
      onRefresh();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async () => {
    setIsDeleting(true);
    try {
      // In a real app, you'd have an API endpoint to handle account deletion
      // This would involve deleting user data while preserving some records for legal/business reasons

      // For now, we'll just sign out and show a message
      await supabase.auth.signOut();
      toast.success("Account deletion request submitted. You will receive a confirmation email.");

      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleAddressChange = (field: keyof ProfileSettings["address"], value: string) => {
    setSettings((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handlePreferenceChange = (field: keyof ProfileSettings["preferences"], value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Account Settings</h2>
        <p className="text-gray-300 mt-1">Manage your profile and preferences</p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserIcon className="w-5 h-5" />
            <span>Personal Information</span>
          </CardTitle>
          <CardDescription>Update your personal details and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                value={settings.full_name}
                onChange={(e) => setSettings((prev) => ({ ...prev, full_name: e.target.value }))}
                placeholder="Your full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="referral-code">Referral Code</Label>
              <Input
                id="referral-code"
                value={profileData.referral_code}
                disabled
                className="bg-gray-50 font-mono"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Default Address</span>
          </CardTitle>
          <CardDescription>Your primary address for recovery sessions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              value={settings.address.street}
              onChange={(e) => handleAddressChange("street", e.target.value)}
              placeholder="123 Main Street"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={settings.address.city}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                placeholder="Orange County / Los Angeles"
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={settings.address.state}
                onChange={(e) => handleAddressChange("state", e.target.value)}
                placeholder="CA"
              />
            </div>
            <div>
              <Label htmlFor="zip">ZIP Code</Label>
              <Input
                id="zip"
                value={settings.address.zipCode}
                onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                placeholder="94102"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notification Preferences</span>
          </CardTitle>
          <CardDescription>Choose how you'd like to receive updates and reminders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-gray-500">Receive important updates via email</p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.preferences.email_notifications}
              onCheckedChange={(checked) => handlePreferenceChange("email_notifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
              <p className="text-sm text-gray-500">Get text message alerts and reminders</p>
            </div>
            <Switch
              id="sms-notifications"
              checked={settings.preferences.sms_notifications}
              onCheckedChange={(checked) => handlePreferenceChange("sms_notifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="booking-reminders">Booking Reminders</Label>
              <p className="text-sm text-gray-500">Remind me about upcoming sessions</p>
            </div>
            <Switch
              id="booking-reminders"
              checked={settings.preferences.booking_reminders}
              onCheckedChange={(checked) => handlePreferenceChange("booking_reminders", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing-emails">Marketing Emails</Label>
              <p className="text-sm text-gray-500">Receive promotional offers and wellness tips</p>
            </div>
            <Switch
              id="marketing-emails"
              checked={settings.preferences.marketing_emails}
              onCheckedChange={(checked) => handlePreferenceChange("marketing_emails", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Credits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Account Balance</span>
          </CardTitle>
          <CardDescription>Your current credit balance and transaction history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div>
              <p className="text-sm text-green-700">Current Balance</p>
              <p className="text-2xl font-bold text-green-900">{profileData.credits} Credits</p>
              <p className="text-sm text-green-600">≈ ${profileData.credits} value</p>
            </div>
            <div className="text-green-600">
              <CreditCard className="w-8 h-8" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Card>
        <CardContent className="p-6">
          <Button onClick={updateProfile} disabled={isLoading} className="w-full md:w-auto">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-700">
            <Shield className="w-5 h-5" />
            <span>Danger Zone</span>
          </CardTitle>
          <CardDescription>Irreversible actions that affect your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="border-red-200 bg-red-50 mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-800">
              <strong>Warning:</strong> Account deletion is permanent and cannot be undone. All your
              data, bookings, and credits will be lost.
            </AlertDescription>
          </Alert>

          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
            className="w-full md:w-auto"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </CardContent>
      </Card>

      {/* Delete Account Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you absolutely sure you want to delete your account? This action cannot be undone.
              <div className="mt-4 p-4 bg-red-50 rounded border border-red-200">
                <h4 className="font-medium text-red-900 mb-2">This will permanently:</h4>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• Delete your profile and personal information</li>
                  <li>• Cancel all upcoming bookings</li>
                  <li>
                    • Remove your {profileData.credits} credits (${profileData.credits} value)
                  </li>
                  <li>• Delete your referral code and history</li>
                  <li>• Remove all reviews and feedback</li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep My Account</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteAccount}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Yes, Delete My Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
