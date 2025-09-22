"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Bell, Mail, MessageSquare, Phone, Save, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface NotificationSetting {
  key: string;
  value: string;
  category: string;
  type: string;
  display_name: string;
  description: string;
  user_configurable: boolean;
  is_enabled: boolean;
  validation_schema: any;
  default_value: string;
  sort_order: number;
}

export default function NotificationsManager() {
  const supabase = createBrowserSupabaseClient();
  const [settings, setSettings] = useState<NotificationSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("business_settings")
        .select("*")
        .eq("category", "notifications")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error("Error loading notification settings:", error);
      toast.error("Failed to load notification settings");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async (key: string, newValue: string) => {
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from("business_settings")
        .update({ value: newValue })
        .eq("key", key);

      if (error) throw error;

      // Update local state
      setSettings(prev => 
        prev.map(setting => 
          setting.key === key 
            ? { ...setting, value: newValue }
            : setting
        )
      );

      toast.success("Setting updated successfully");
    } catch (error) {
      console.error("Error updating setting:", error);
      toast.error("Failed to update setting");
    } finally {
      setIsSaving(false);
    }
  };

  const renderSettingInput = (setting: NotificationSetting) => {
    const currentValue = setting.value;

    switch (setting.type) {
      case "boolean":
        return (
          <Switch
            checked={currentValue === "true"}
            onCheckedChange={(checked) => updateSetting(setting.key, checked.toString())}
            disabled={isSaving}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            value={currentValue}
            onChange={(e) => updateSetting(setting.key, e.target.value)}
            disabled={isSaving}
            className="w-24"
            min={setting.validation_schema?.minimum}
            max={setting.validation_schema?.maximum}
          />
        );

      case "string":
        if (setting.validation_schema?.format === "email") {
          return (
            <Input
              type="email"
              value={currentValue.replace(/"/g, "")}
              onChange={(e) => updateSetting(setting.key, `"${e.target.value}"`)}
              disabled={isSaving}
              className="max-w-md"
            />
          );
        }
        return (
          <Input
            type="text"
            value={currentValue.replace(/"/g, "")}
            onChange={(e) => updateSetting(setting.key, `"${e.target.value}"`)}
            disabled={isSaving}
            className="max-w-md"
          />
        );

      case "array":
        // For booking reminder hours array
        if (setting.key === "booking_reminder_hours") {
          const hours = JSON.parse(currentValue);
          return (
            <div className="space-y-2">
              <Label className="text-sm text-neutral-400">
                Current reminders: {hours.join(", ")} hours before
              </Label>
              <Input
                type="text"
                placeholder="24, 2"
                value={hours.join(", ")}
                onChange={(e) => {
                  const newHours = e.target.value.split(",").map(h => parseInt(h.trim())).filter(h => !isNaN(h));
                  updateSetting(setting.key, JSON.stringify(newHours));
                }}
                disabled={isSaving}
                className="max-w-md"
              />
            </div>
          );
        }
        return (
          <Input
            type="text"
            value={currentValue}
            onChange={(e) => updateSetting(setting.key, e.target.value)}
            disabled={isSaving}
            className="max-w-md"
          />
        );

      default:
        return (
          <Input
            type="text"
            value={currentValue}
            onChange={(e) => updateSetting(setting.key, e.target.value)}
            disabled={isSaving}
            className="max-w-md"
          />
        );
    }
  };

  const getSettingIcon = (key: string) => {
    if (key.includes("email")) return Mail;
    if (key.includes("sms")) return MessageSquare;
    if (key.includes("phone")) return Phone;
    return Bell;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-600 animate-pulse rounded w-1/3"></div>
        <div className="grid grid-cols-1 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-gray-600 animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-blue-400 mr-3" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {settings.filter(s => s.key.includes("email") && s.value === "true").length}
                </p>
                <p className="text-xs text-neutral-400">Email Notifications Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-green-400 mr-3" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {settings.filter(s => s.key.includes("sms") && s.value === "true").length}
                </p>
                <p className="text-xs text-neutral-400">SMS Notifications Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-purple-400 mr-3" />
              <div>
                <p className="text-2xl font-bold text-white">{settings.length}</p>
                <p className="text-xs text-neutral-400">Total Settings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Settings */}
      <div className="space-y-4">
        {settings.map((setting) => {
          const Icon = getSettingIcon(setting.key);
          return (
            <Card key={setting.key}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Icon className="h-5 w-5 text-blue-400" />
                  <span>{setting.display_name}</span>
                </CardTitle>
                <CardDescription className="text-neutral-400">
                  {setting.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {renderSettingInput(setting)}
                  </div>
                  {setting.type === "boolean" && (
                    <div className="ml-4">
                      <span className={`text-sm font-medium ${
                        setting.value === "true" ? "text-green-400" : "text-neutral-500"
                      }`}>
                        {setting.value === "true" ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Notification Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-neutral-400">
          <div className="flex items-start space-x-2">
            <span className="text-blue-400">•</span>
            <p>Email notifications require configured SMTP settings in integrations</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-400">•</span>
            <p>SMS notifications require Twilio account configuration</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-400">•</span>
            <p>Booking reminders are sent automatically based on the configured times</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-400">•</span>
            <p>Changes take effect immediately for new bookings</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}