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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stack, Grid, Flex } from "@/components/ui/layout";
import { Switch } from "@/components/ui/switch";
import { Heading, Text } from "@/components/typography/Typography";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  CreditCard,
  Loader2,
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    loadPreferences();
  }, [user.id]);

  // Track changes for unsaved state
  useEffect(() => {
    const originalSettings = {
      full_name: user.user_metadata?.full_name || "",
      email: user.email || "",
      phone: profileData.phone || "",
      address: {
        street: profileData.address?.street || "",
        city: profileData.address?.city || "",
        state: profileData.address?.state || "",
        zipCode: profileData.address?.zipCode || "",
      },
    };

    const hasChanges = JSON.stringify(settings) !== JSON.stringify({
      ...originalSettings,
      preferences: settings.preferences,
    });
    
    setHasUnsavedChanges(hasChanges);
  }, [settings, user, profileData]);

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

      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      
      toast.success("Profile updated successfully!", {
        description: "Your changes have been saved.",
      });
      
      onRefresh();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile", {
        description: "Please try again or contact support if the issue persists.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async () => {
    setIsDeleting(true);
    try {
      // In a real app, you'd have an API endpoint to handle account deletion
      await supabase.auth.signOut();
      toast.success("Account deletion request submitted.", {
        description: "You will receive a confirmation email.",
      });

      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account", {
        description: "Please contact support for assistance.",
      });
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
    <Stack spacing="xl">
      {/* Header */}
      <div>
        <Heading size="lg" weight="bold">
          Account Settings
        </Heading>
        <Text variant="large" color="muted" className="mt-2">
          Manage your profile and preferences
        </Text>
        
        {lastSaved && (
          <Flex align="center" gap="sm" className="mt-3">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <Text size="sm" color="success">
              Last saved: {lastSaved.toLocaleString()}
            </Text>
          </Flex>
        )}
      </div>

      {/* Personal Information */}
      <Card variant="elevated" className="hover:shadow-md transition-shadow duration-200">
        <CardHeader spacing="md">
          <Flex align="center" gap="sm">
            <UserIcon className="w-5 h-5 text-primary" />
            <CardTitle size="lg">Personal Information</CardTitle>
          </Flex>
          <CardDescription>
            Update your personal details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent spacing="lg">
          <Grid cols={2} gap="lg" className="grid-cols-1 md:grid-cols-2">
            <Stack spacing="sm">
              <Label htmlFor="full-name" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="full-name"
                value={settings.full_name}
                onChange={(e) => setSettings((prev) => ({ ...prev, full_name: e.target.value }))}
                placeholder="Your full name"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </Stack>
            
            <Stack spacing="sm">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                disabled
                className="bg-muted/50 cursor-not-allowed"
              />
              <Text size="xs" color="muted">
                Email cannot be changed. Contact support if needed.
              </Text>
            </Stack>
            
            <Stack spacing="sm">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 (555) 123-4567"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </Stack>
            
            <Stack spacing="sm">
              <Label htmlFor="referral-code" className="text-sm font-medium">
                Referral Code
              </Label>
              <Input
                id="referral-code"
                value={profileData.referral_code}
                disabled
                className="bg-muted/50 font-mono cursor-not-allowed"
              />
            </Stack>
          </Grid>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card variant="elevated" className="hover:shadow-md transition-shadow duration-200">
        <CardHeader spacing="md">
          <Flex align="center" gap="sm">
            <MapPin className="w-5 h-5 text-primary" />
            <CardTitle size="lg">Default Address</CardTitle>
          </Flex>
          <CardDescription>
            Your primary address for recovery sessions
          </CardDescription>
        </CardHeader>
        <CardContent spacing="lg">
          <Stack spacing="lg">
            <Stack spacing="sm">
              <Label htmlFor="street" className="text-sm font-medium">
                Street Address
              </Label>
              <Input
                id="street"
                value={settings.address.street}
                onChange={(e) => handleAddressChange("street", e.target.value)}
                placeholder="123 Main Street"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </Stack>
            
            <Grid cols={3} gap="lg" className="grid-cols-1 md:grid-cols-3">
              <Stack spacing="sm">
                <Label htmlFor="city" className="text-sm font-medium">
                  City
                </Label>
                <Input
                  id="city"
                  value={settings.address.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  placeholder="Orange County / Los Angeles"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </Stack>
              
              <Stack spacing="sm">
                <Label htmlFor="state" className="text-sm font-medium">
                  State
                </Label>
                <Input
                  id="state"
                  value={settings.address.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                  placeholder="CA"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </Stack>
              
              <Stack spacing="sm">
                <Label htmlFor="zip" className="text-sm font-medium">
                  ZIP Code
                </Label>
                <Input
                  id="zip"
                  value={settings.address.zipCode}
                  onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                  placeholder="94102"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </Stack>
            </Grid>
          </Stack>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card variant="elevated" className="hover:shadow-md transition-shadow duration-200">
        <CardHeader spacing="md">
          <Flex align="center" gap="sm">
            <Bell className="w-5 h-5 text-primary" />
            <CardTitle size="lg">Notification Preferences</CardTitle>
          </Flex>
          <CardDescription>
            Choose how you'd like to receive updates and reminders
          </CardDescription>
        </CardHeader>
        <CardContent spacing="lg">
          <Stack spacing="xl">
            {[
              {
                key: "email_notifications" as const,
                label: "Email Notifications",
                description: "Receive important updates via email",
              },
              {
                key: "sms_notifications" as const,
                label: "SMS Notifications",
                description: "Get text message alerts and reminders",
              },
              {
                key: "booking_reminders" as const,
                label: "Booking Reminders",
                description: "Remind me about upcoming sessions",
              },
              {
                key: "marketing_emails" as const,
                label: "Marketing Emails",
                description: "Receive promotional offers and wellness tips",
              },
            ].map((pref) => (
              <Flex key={pref.key} justify="between" align="center" className="group">
                <Stack spacing="xs">
                  <Label htmlFor={pref.key} className="text-sm font-medium cursor-pointer">
                    {pref.label}
                  </Label>
                  <Text size="sm" color="muted">
                    {pref.description}
                  </Text>
                </Stack>
                <Switch
                  id={pref.key}
                  checked={settings.preferences[pref.key]}
                  onCheckedChange={(checked) => handlePreferenceChange(pref.key, checked)}
                  className="group-hover:scale-105 transition-transform"
                />
              </Flex>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Account Balance */}
      <Card variant="success" className="bg-green-50 border-green-200 hover:shadow-md transition-shadow duration-200">
        <CardHeader spacing="md">
          <Flex align="center" gap="sm">
            <CreditCard className="w-5 h-5 text-green-600" />
            <CardTitle size="lg" className="text-green-900">Account Balance</CardTitle>
          </Flex>
          <CardDescription className="text-green-700">
            Your current credit balance and transaction history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Flex justify="between" align="center" className="p-6 bg-green-100 rounded-lg border border-green-200">
            <Stack spacing="xs">
              <Text size="sm" className="text-green-700">Current Balance</Text>
              <Heading size="lg" weight="bold" className="text-green-900">
                {profileData.credits} Credits
              </Heading>
              <Text size="sm" className="text-green-600">
                ≈ ${profileData.credits} value
              </Text>
            </Stack>
            <CreditCard className="w-8 h-8 text-green-600" />
          </Flex>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Card variant="elevated">
        <CardContent className="p-6">
          <Flex justify="between" align="center" className="flex-col sm:flex-row gap-4">
            <div>
              {hasUnsavedChanges && (
                <Flex align="center" gap="sm">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <Text size="sm" color="warning">
                    You have unsaved changes
                  </Text>
                </Flex>
              )}
            </div>
            
            <Button 
              onClick={updateProfile} 
              disabled={isLoading || !hasUnsavedChanges}
              size="lg"
              className="w-full sm:w-auto min-w-32 hover:scale-105 transition-transform"
              leftIcon={
                isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )
              }
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </Flex>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card variant="danger" className="border-destructive/20">
        <CardHeader spacing="md">
          <Flex align="center" gap="sm">
            <Shield className="w-5 h-5 text-destructive" />
            <CardTitle size="lg" className="text-destructive">Danger Zone</CardTitle>
          </Flex>
          <CardDescription>
            Irreversible actions that affect your account
          </CardDescription>
        </CardHeader>
        <CardContent spacing="lg">
          <Alert className="border-destructive/20 bg-destructive/5">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-destructive-foreground">
              <Text weight="semibold">Warning:</Text> Account deletion is permanent and cannot be undone. 
              All your data, bookings, and credits will be lost.
            </AlertDescription>
          </Alert>

          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
            className="w-full sm:w-auto"
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>

      {/* Delete Account Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <Stack spacing="lg">
                <Text>
                  Are you absolutely sure you want to delete your account? This action cannot be undone.
                </Text>
                
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <Stack spacing="sm">
                      <Text weight="semibold" className="text-destructive-foreground">
                        This will permanently:
                      </Text>
                      <ul className="text-sm text-destructive space-y-1 ml-4">
                        <li>• Delete your profile and personal information</li>
                        <li>• Cancel all upcoming bookings</li>
                        <li>• Remove your {profileData.credits} credits (${profileData.credits} value)</li>
                        <li>• Delete your referral code and history</li>
                        <li>• Remove all reviews and feedback</li>
                      </ul>
                    </Stack>
                  </AlertDescription>
                </Alert>
              </Stack>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep My Account</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteAccount}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? (
                <Flex align="center" gap="sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </Flex>
              ) : (
                "Yes, Delete My Account"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Stack>
  );
}