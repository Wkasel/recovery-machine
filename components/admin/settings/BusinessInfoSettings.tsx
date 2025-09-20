"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { BusinessHoursEditor } from "./BusinessHoursEditor";

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

interface BusinessInfoSettingsProps {
  settings: BusinessSetting[];
  onUpdateSetting: (key: string, value: any) => Promise<void>;
  loading: boolean;
}

export function BusinessInfoSettings({
  settings,
  onUpdateSetting,
  loading,
}: BusinessInfoSettingsProps) {
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

  const handleAddressChange = (field: string, value: string) => {
    const currentAddress = getValue("business_address") || {};
    const newAddress = { ...currentAddress, [field]: value };
    setValue("business_address", newAddress);
  };

  const businessName = getSetting("business_name");
  const businessEmail = getSetting("business_email");
  const businessPhone = getSetting("business_phone");
  const businessAddress = getSetting("business_address");
  const businessHours = getSetting("business_hours");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Basic Information
            <Badge variant="outline">Public</Badge>
          </CardTitle>
          <CardDescription>
            This information will be displayed on your website and booking forms.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Business Name */}
          {businessName && (
            <div className="space-y-2">
              <Label htmlFor="business_name" className="flex items-center gap-2">
                {businessName.label}
                {businessName.is_required && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="business_name"
                value={getValue("business_name") || ""}
                onChange={(e) => setValue("business_name", e.target.value)}
                placeholder="Enter business name"
                required={businessName.is_required}
              />
              <p className="text-xs text-gray-500">{businessName.description}</p>
              {localValues["business_name"] !== undefined && (
                <Button
                  size="sm"
                  onClick={async () => handleSave("business_name")}
                  disabled={loading}
                >
                  Save
                </Button>
              )}
            </div>
          )}

          {/* Business Email */}
          {businessEmail && (
            <div className="space-y-2">
              <Label htmlFor="business_email" className="flex items-center gap-2">
                {businessEmail.label}
                {businessEmail.is_required && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="business_email"
                type="email"
                value={getValue("business_email") || ""}
                onChange={(e) => setValue("business_email", e.target.value)}
                placeholder="Enter business email"
                required={businessEmail.is_required}
              />
              <p className="text-xs text-gray-500">{businessEmail.description}</p>
              {localValues["business_email"] !== undefined && (
                <Button
                  size="sm"
                  onClick={async () => handleSave("business_email")}
                  disabled={loading}
                >
                  Save
                </Button>
              )}
            </div>
          )}

          {/* Business Phone */}
          {businessPhone && (
            <div className="space-y-2">
              <Label htmlFor="business_phone" className="flex items-center gap-2">
                {businessPhone.label}
                {businessPhone.is_required && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="business_phone"
                type="tel"
                value={getValue("business_phone") || ""}
                onChange={(e) => setValue("business_phone", e.target.value)}
                placeholder="Enter business phone"
                required={businessPhone.is_required}
              />
              <p className="text-xs text-gray-500">{businessPhone.description}</p>
              {localValues["business_phone"] !== undefined && (
                <Button
                  size="sm"
                  onClick={async () => handleSave("business_phone")}
                  disabled={loading}
                >
                  Save
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Business Address */}
      {businessAddress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Business Address
              <Badge variant="outline">Public</Badge>
            </CardTitle>
            <CardDescription>Physical address for your business location.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={getValue("business_address")?.street || ""}
                onChange={(e) => handleAddressChange("street", e.target.value)}
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={getValue("business_address")?.city || ""}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={getValue("business_address")?.state || ""}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                  placeholder="State"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code</Label>
              <Input
                id="zip"
                value={getValue("business_address")?.zip || ""}
                onChange={(e) => handleAddressChange("zip", e.target.value)}
                placeholder="12345"
              />
            </div>

            {localValues["business_address"] !== undefined && (
              <Button onClick={async () => handleSave("business_address")} disabled={loading}>
                Save Address
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Business Hours */}
      {businessHours && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Business Hours
              <Badge variant="outline">Public</Badge>
            </CardTitle>
            <CardDescription>Set your operating hours for each day of the week.</CardDescription>
          </CardHeader>
          <CardContent>
            <BusinessHoursEditor
              value={getValue("business_hours") || {}}
              onChange={(hours) => setValue("business_hours", hours)}
              onSave={async () => handleSave("business_hours")}
              hasChanges={localValues["business_hours"] !== undefined}
              loading={loading}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
