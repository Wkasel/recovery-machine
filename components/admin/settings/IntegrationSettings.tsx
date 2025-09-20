"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
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

interface IntegrationSettingsProps {
  settings: BusinessSetting[];
  onUpdateSetting: (key: string, value: any) => Promise<void>;
  loading: boolean;
}

export function IntegrationSettings({
  settings,
  onUpdateSetting,
  loading,
}: IntegrationSettingsProps) {
  const [localValues, setLocalValues] = useState<Record<string, any>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

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

  const toggleShowSecret = (key: string) => {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async (key: string) => {
    const value = localValues[key];
    if (value !== undefined) {
      await onUpdateSetting(key, value);
      setLocalValues((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const isSecretField = (key: string) => {
    return key.includes("secret") || key.includes("token") || key.includes("key");
  };

  const maskSecret = (value: string) => {
    if (!value || value.length <= 8) return "••••••••";
    return value.substring(0, 4) + "••••••••" + value.substring(value.length - 4);
  };

  return (
    <div className="space-y-6">
      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>Security Note:</strong> API keys and secrets are encrypted and stored securely.
          Only enter credentials in a secure environment.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Processing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Payment Processing
              <Badge variant="secondary">Bolt</Badge>
            </CardTitle>
            <CardDescription>Configure Bolt payment processing integration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Bolt Public Key */}
            {getSetting("bolt_public_key") && (
              <div className="space-y-2">
                <Label htmlFor="bolt_public_key">{getSetting("bolt_public_key")?.label}</Label>
                <Input
                  id="bolt_public_key"
                  type="text"
                  value={getValue("bolt_public_key") || ""}
                  onChange={(e) => setValue("bolt_public_key", e.target.value)}
                  placeholder="pk_test_..."
                />
                <p className="text-xs text-gray-500">
                  {getSetting("bolt_public_key")?.description}
                </p>
                {localValues["bolt_public_key"] !== undefined && (
                  <Button
                    size="sm"
                    onClick={async () => handleSave("bolt_public_key")}
                    disabled={loading}
                  >
                    Save
                  </Button>
                )}
              </div>
            )}

            {/* Bolt Webhook Secret */}
            {getSetting("bolt_webhook_secret") && (
              <div className="space-y-2">
                <Label htmlFor="bolt_webhook_secret">
                  {getSetting("bolt_webhook_secret")?.label}
                </Label>
                <div className="relative">
                  <Input
                    id="bolt_webhook_secret"
                    type={showSecrets["bolt_webhook_secret"] ? "text" : "password"}
                    value={getValue("bolt_webhook_secret") || ""}
                    onChange={(e) => setValue("bolt_webhook_secret", e.target.value)}
                    placeholder={
                      getValue("bolt_webhook_secret")
                        ? maskSecret(getValue("bolt_webhook_secret"))
                        : "whsec_..."
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => toggleShowSecret("bolt_webhook_secret")}
                  >
                    {showSecrets["bolt_webhook_secret"] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  {getSetting("bolt_webhook_secret")?.description}
                </p>
                {localValues["bolt_webhook_secret"] !== undefined && (
                  <Button
                    size="sm"
                    onClick={async () => handleSave("bolt_webhook_secret")}
                    disabled={loading}
                  >
                    Save
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Google Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Google Services
              <Badge variant="secondary">Maps & Calendar</Badge>
            </CardTitle>
            <CardDescription>
              Google Maps for distance calculation and Google Calendar integration.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google API Key */}
            {getSetting("google_api_key") && (
              <div className="space-y-2">
                <Label htmlFor="google_api_key">{getSetting("google_api_key")?.label}</Label>
                <div className="relative">
                  <Input
                    id="google_api_key"
                    type={showSecrets["google_api_key"] ? "text" : "password"}
                    value={getValue("google_api_key") || ""}
                    onChange={(e) => setValue("google_api_key", e.target.value)}
                    placeholder={
                      getValue("google_api_key")
                        ? maskSecret(getValue("google_api_key"))
                        : "AIza..."
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => toggleShowSecret("google_api_key")}
                  >
                    {showSecrets["google_api_key"] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">{getSetting("google_api_key")?.description}</p>
                {localValues["google_api_key"] !== undefined && (
                  <Button
                    size="sm"
                    onClick={async () => handleSave("google_api_key")}
                    disabled={loading}
                  >
                    Save
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* SMS/Communication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              SMS & Communication
              <Badge variant="secondary">Twilio</Badge>
            </CardTitle>
            <CardDescription>SMS notifications and communication via Twilio.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Twilio Account SID */}
            {getSetting("twilio_account_sid") && (
              <div className="space-y-2">
                <Label htmlFor="twilio_account_sid">
                  {getSetting("twilio_account_sid")?.label}
                </Label>
                <Input
                  id="twilio_account_sid"
                  type="text"
                  value={getValue("twilio_account_sid") || ""}
                  onChange={(e) => setValue("twilio_account_sid", e.target.value)}
                  placeholder="AC..."
                />
                <p className="text-xs text-gray-500">
                  {getSetting("twilio_account_sid")?.description}
                </p>
                {localValues["twilio_account_sid"] !== undefined && (
                  <Button
                    size="sm"
                    onClick={async () => handleSave("twilio_account_sid")}
                    disabled={loading}
                  >
                    Save
                  </Button>
                )}
              </div>
            )}

            {/* Twilio Auth Token */}
            {getSetting("twilio_auth_token") && (
              <div className="space-y-2">
                <Label htmlFor="twilio_auth_token">{getSetting("twilio_auth_token")?.label}</Label>
                <div className="relative">
                  <Input
                    id="twilio_auth_token"
                    type={showSecrets["twilio_auth_token"] ? "text" : "password"}
                    value={getValue("twilio_auth_token") || ""}
                    onChange={(e) => setValue("twilio_auth_token", e.target.value)}
                    placeholder={
                      getValue("twilio_auth_token")
                        ? maskSecret(getValue("twilio_auth_token"))
                        : "Auth Token"
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => toggleShowSecret("twilio_auth_token")}
                  >
                    {showSecrets["twilio_auth_token"] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  {getSetting("twilio_auth_token")?.description}
                </p>
                {localValues["twilio_auth_token"] !== undefined && (
                  <Button
                    size="sm"
                    onClick={async () => handleSave("twilio_auth_token")}
                    disabled={loading}
                  >
                    Save
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Social Media
              <Badge variant="secondary">Instagram</Badge>
            </CardTitle>
            <CardDescription>Social media integrations for marketing and content.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Instagram Access Token */}
            {getSetting("instagram_access_token") && (
              <div className="space-y-2">
                <Label htmlFor="instagram_access_token">
                  {getSetting("instagram_access_token")?.label}
                </Label>
                <div className="relative">
                  <Input
                    id="instagram_access_token"
                    type={showSecrets["instagram_access_token"] ? "text" : "password"}
                    value={getValue("instagram_access_token") || ""}
                    onChange={(e) => setValue("instagram_access_token", e.target.value)}
                    placeholder={
                      getValue("instagram_access_token")
                        ? maskSecret(getValue("instagram_access_token"))
                        : "Access Token"
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => toggleShowSecret("instagram_access_token")}
                  >
                    {showSecrets["instagram_access_token"] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  {getSetting("instagram_access_token")?.description}
                </p>
                {localValues["instagram_access_token"] !== undefined && (
                  <Button
                    size="sm"
                    onClick={async () => handleSave("instagram_access_token")}
                    disabled={loading}
                  >
                    Save
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
