"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Activity, AlertTriangle, Database, Shield } from "lucide-react";
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

interface SystemSettingsProps {
  settings: BusinessSetting[];
  onUpdateSetting: (key: string, value: any) => Promise<void>;
  loading: boolean;
}

export function SystemSettings({ settings, onUpdateSetting, loading }: SystemSettingsProps) {
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

  const formatTimeUnit = (value: number, unit: string) => {
    if (value === 1) return `1 ${unit}`;
    return `${value} ${unit}s`;
  };

  return (
    <div className="space-y-6">
      {getValue("maintenance_mode") && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Maintenance Mode Active:</strong> The booking system is currently disabled for
            customers.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              System Status
            </CardTitle>
            <CardDescription>Control system-wide settings and maintenance mode.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Maintenance Mode */}
            {getSetting("maintenance_mode") && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="flex items-center gap-2">
                      Maintenance Mode
                      <Badge variant={getValue("maintenance_mode") ? "destructive" : "secondary"}>
                        {getValue("maintenance_mode") ? "Active" : "Inactive"}
                      </Badge>
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Disable booking system for maintenance or updates
                    </p>
                  </div>
                  <Switch
                    checked={getValue("maintenance_mode") || false}
                    onCheckedChange={(checked) => setValue("maintenance_mode", checked)}
                  />
                </div>
                {localValues["maintenance_mode"] !== undefined && (
                  <Button
                    size="sm"
                    onClick={async () => handleSave("maintenance_mode")}
                    disabled={loading}
                    variant={getValue("maintenance_mode") ? "destructive" : "default"}
                  >
                    {getValue("maintenance_mode")
                      ? "Activate Maintenance"
                      : "Deactivate Maintenance"}
                  </Button>
                )}
              </div>
            )}

            {/* Debug Mode */}
            {getSetting("debug_mode") && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Debug Mode</Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Enable detailed logging and debug features
                    </p>
                  </div>
                  <Switch
                    checked={getValue("debug_mode") || false}
                    onCheckedChange={(checked) => setValue("debug_mode", checked)}
                  />
                </div>
                {localValues["debug_mode"] !== undefined && (
                  <Button
                    size="sm"
                    onClick={async () => handleSave("debug_mode")}
                    disabled={loading}
                  >
                    Save
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analytics & Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Analytics & Tracking
            </CardTitle>
            <CardDescription>Configure analytics and user tracking settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Analytics Enabled */}
            {getSetting("analytics_enabled") && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Analytics Tracking</Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Enable Google Analytics and user behavior tracking
                    </p>
                  </div>
                  <Switch
                    checked={getValue("analytics_enabled") || false}
                    onCheckedChange={(checked) => setValue("analytics_enabled", checked)}
                  />
                </div>
                {localValues["analytics_enabled"] !== undefined && (
                  <Button
                    size="sm"
                    onClick={async () => handleSave("analytics_enabled")}
                    disabled={loading}
                  >
                    Save
                  </Button>
                )}
              </div>
            )}

            {/* Session Timeout */}
            {getSetting("session_timeout_minutes") && (
              <div className="space-y-3">
                <Label>Session Timeout</Label>
                <div className="space-y-2">
                  <Slider
                    value={[getValue("session_timeout_minutes") || 60]}
                    onValueChange={([value]) => setValue("session_timeout_minutes", value)}
                    max={480}
                    min={15}
                    step={15}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>15 min</span>
                    <span className="font-medium">
                      {formatTimeUnit(getValue("session_timeout_minutes") || 60, "minute")}
                    </span>
                    <span>8 hours</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  How long users stay logged in before requiring re-authentication
                </p>
                {localValues["session_timeout_minutes"] !== undefined && (
                  <Button
                    size="sm"
                    onClick={async () => handleSave("session_timeout_minutes")}
                    disabled={loading}
                  >
                    Save
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription>Backup and data retention settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Backup Frequency */}
            {getSetting("backup_frequency_hours") && (
              <div className="space-y-3">
                <Label>Automatic Backup Frequency</Label>
                <div className="space-y-2">
                  <Slider
                    value={[getValue("backup_frequency_hours") || 24]}
                    onValueChange={([value]) => setValue("backup_frequency_hours", value)}
                    max={168}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>1 hour</span>
                    <span className="font-medium">
                      {getValue("backup_frequency_hours") >= 24
                        ? formatTimeUnit(
                            Math.floor((getValue("backup_frequency_hours") || 24) / 24),
                            "day"
                          )
                        : formatTimeUnit(getValue("backup_frequency_hours") || 24, "hour")}
                    </span>
                    <span>7 days</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  How often to automatically backup business data
                </p>
                {localValues["backup_frequency_hours"] !== undefined && (
                  <Button
                    size="sm"
                    onClick={async () => handleSave("backup_frequency_hours")}
                    disabled={loading}
                  >
                    Save
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle>System Status Overview</CardTitle>
            <CardDescription>Current system configuration summary.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span>Maintenance Mode:</span>
                  <Badge variant={getValue("maintenance_mode") ? "destructive" : "secondary"}>
                    {getValue("maintenance_mode") ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="flex justify-between">
                  <span>Debug Mode:</span>
                  <Badge variant={getValue("debug_mode") ? "default" : "secondary"}>
                    {getValue("debug_mode") ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <div className="flex justify-between">
                  <span>Analytics:</span>
                  <Badge variant={getValue("analytics_enabled") ? "default" : "secondary"}>
                    {getValue("analytics_enabled") ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <div className="flex justify-between">
                  <span>Session Timeout:</span>
                  <span>{getValue("session_timeout_minutes") || 60} min</span>
                </div>

                <div className="flex justify-between">
                  <span>Backup Frequency:</span>
                  <span>
                    {getValue("backup_frequency_hours") >= 24
                      ? `${Math.floor((getValue("backup_frequency_hours") || 24) / 24)} day(s)`
                      : `${getValue("backup_frequency_hours") || 24} hour(s)`}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
