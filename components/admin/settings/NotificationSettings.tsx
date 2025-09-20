"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface BusinessSetting {
  key: string;
  value: any;
  type: string;
  label: string;
  description: string;
  is_public: boolean;
  is_required: boolean;
  validation_rules: any;
}

interface NotificationSettingsProps {
  settings: BusinessSetting[];
  onUpdateSetting: (key: string, value: any) => Promise<void>;
  loading: boolean;
}

export function NotificationSettings({
  settings,
  onUpdateSetting,
  loading,
}: NotificationSettingsProps) {
  const [localValues, setLocalValues] = useState<Record<string, any>>({});

  const getSetting = (key: string) => {
    return settings.find((s) => s.key === key);
  };

  const getValue = (key: string) => {
    if (localValues[key] !== undefined) {
      return localValues[key];
    }
    const setting = getSetting(key);
    return setting?.value;
  };

  const setValue = (key: string, value: any) => {
    setLocalValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key: string) => {
    const value = localValues[key];
    if (value !== undefined) {
      await onUpdateSetting(key, value);
      setLocalValues((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* General Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>General Notifications</CardTitle>
          <CardDescription>Enable or disable notification channels.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Notifications */}
          {getSetting("email_notifications_enabled") && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Send booking confirmations and updates via email
                  </p>
                </div>
                <Switch
                  checked={getValue("email_notifications_enabled") || false}
                  onCheckedChange={(checked) => setValue("email_notifications_enabled", checked)}
                />
              </div>
              {localValues["email_notifications_enabled"] !== undefined && (
                <Button
                  size="sm"
                  onClick={async () => handleSave("email_notifications_enabled")}
                  disabled={loading}
                >
                  Save
                </Button>
              )}
            </div>
          )}

          {/* Booking Confirmation Email */}
          {getSetting("booking_confirmation_email") && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Booking Confirmation Emails</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Automatically send confirmation emails when bookings are made
                  </p>
                </div>
                <Switch
                  checked={getValue("booking_confirmation_email") || false}
                  onCheckedChange={(checked) => setValue("booking_confirmation_email", checked)}
                />
              </div>
              {localValues["booking_confirmation_email"] !== undefined && (
                <Button
                  size="sm"
                  onClick={async () => handleSave("booking_confirmation_email")}
                  disabled={loading}
                >
                  Save
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admin Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Notifications</CardTitle>
          <CardDescription>Configure where admin notifications are sent.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Admin Notification Email */}
          {getSetting("admin_notification_email") && (
            <div className="space-y-2">
              <Label htmlFor="admin_notification_email" className="flex items-center gap-2">
                {getSetting("admin_notification_email")?.label}
                {getSetting("admin_notification_email")?.is_required && (
                  <span className="text-red-500">*</span>
                )}
              </Label>
              <Input
                id="admin_notification_email"
                type="email"
                value={getValue("admin_notification_email") || ""}
                onChange={(e) => setValue("admin_notification_email", e.target.value)}
                placeholder="admin@example.com"
                required={getSetting("admin_notification_email")?.is_required}
              />
              <p className="text-xs text-gray-500">
                {getSetting("admin_notification_email")?.description}
              </p>
              {localValues["admin_notification_email"] !== undefined && (
                <Button
                  size="sm"
                  onClick={async () => handleSave("admin_notification_email")}
                  disabled={loading}
                >
                  Save
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Preview */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Notification Preview</CardTitle>
          <CardDescription>
            Preview how notifications will be sent to customers and admins.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Notifications */}
            <div className="space-y-3">
              <h4 className="font-medium">Customer Notifications</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Booking Confirmations</span>
                  <span
                    className={
                      getValue("email_notifications_enabled") &&
                      getValue("booking_confirmation_email")
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  >
                    {getValue("email_notifications_enabled") &&
                    getValue("booking_confirmation_email")
                      ? "✓ Enabled"
                      : "✗ Disabled"}
                  </span>
                </div>
              </div>
            </div>

            {/* Admin Notifications */}
            <div className="space-y-3">
              <h4 className="font-medium">Admin Notifications</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>New Bookings</span>
                  <span
                    className={
                      getValue("admin_notification_email") ? "text-green-600" : "text-gray-400"
                    }
                  >
                    {getValue("admin_notification_email") ? "✓ Configured" : "✗ No Email Set"}
                  </span>
                </div>
                {getValue("admin_notification_email") && (
                  <div className="text-xs text-gray-600">
                    Sent to: {getValue("admin_notification_email")}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
