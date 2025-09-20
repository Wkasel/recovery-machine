"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface PricingSettingsProps {
  settings: BusinessSetting[];
  onUpdateSetting: (key: string, value: any) => Promise<void>;
  loading: boolean;
}

export function PricingSettings({ settings, onUpdateSetting, loading }: PricingSettingsProps) {
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

  const formatCurrency = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  const parseCurrency = (value: string) => {
    return Math.round(parseFloat(value || "0") * 100);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Base Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Base Pricing
            <Badge variant="outline">Public</Badge>
          </CardTitle>
          <CardDescription>Core service pricing that customers will see.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Base Session Price */}
          {getSetting("base_session_price") && (
            <div className="space-y-2">
              <Label htmlFor="base_session_price" className="flex items-center gap-2">
                {getSetting("base_session_price")?.label}
                {getSetting("base_session_price")?.is_required && (
                  <span className="text-red-500">*</span>
                )}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="base_session_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formatCurrency(getValue("base_session_price") || 0)}
                  onChange={(e) => setValue("base_session_price", parseCurrency(e.target.value))}
                  className="pl-8"
                  placeholder="0.00"
                />
              </div>
              <p className="text-xs text-gray-500">
                {getSetting("base_session_price")?.description}
              </p>
              {localValues["base_session_price"] !== undefined && (
                <Button
                  size="sm"
                  onClick={async () => handleSave("base_session_price")}
                  disabled={loading}
                >
                  Save
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Travel & Distance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Travel & Distance
            <Badge variant="outline">Public</Badge>
          </CardTitle>
          <CardDescription>Pricing for travel and service area limits.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Travel Fee Per Mile */}
          {getSetting("travel_fee_per_mile") && (
            <div className="space-y-2">
              <Label htmlFor="travel_fee_per_mile">
                {getSetting("travel_fee_per_mile")?.label}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="travel_fee_per_mile"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formatCurrency(getValue("travel_fee_per_mile") || 0)}
                  onChange={(e) => setValue("travel_fee_per_mile", parseCurrency(e.target.value))}
                  className="pl-8"
                  placeholder="0.00"
                />
              </div>
              <p className="text-xs text-gray-500">
                {getSetting("travel_fee_per_mile")?.description}
              </p>
              {localValues["travel_fee_per_mile"] !== undefined && (
                <Button
                  size="sm"
                  onClick={async () => handleSave("travel_fee_per_mile")}
                  disabled={loading}
                >
                  Save
                </Button>
              )}
            </div>
          )}

          {/* Max Travel Distance */}
          {getSetting("max_travel_distance") && (
            <div className="space-y-2">
              <Label htmlFor="max_travel_distance" className="flex items-center gap-2">
                {getSetting("max_travel_distance")?.label}
                {getSetting("max_travel_distance")?.is_required && (
                  <span className="text-red-500">*</span>
                )}
              </Label>
              <div className="relative">
                <Input
                  id="max_travel_distance"
                  type="number"
                  min="1"
                  max="100"
                  value={getValue("max_travel_distance") || 25}
                  onChange={(e) => setValue("max_travel_distance", parseInt(e.target.value))}
                  placeholder="25"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  miles
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {getSetting("max_travel_distance")?.description}
              </p>
              {localValues["max_travel_distance"] !== undefined && (
                <Button
                  size="sm"
                  onClick={async () => handleSave("max_travel_distance")}
                  disabled={loading}
                >
                  Save
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing Calculator Preview */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Pricing Preview</CardTitle>
          <CardDescription>See how your pricing will appear to customers.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="font-semibold mb-4">Sample Booking Calculation</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Base Session (30 min)</span>
                <span>${formatCurrency(getValue("base_session_price") || 15000)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>
                  Travel (10 miles × ${formatCurrency(getValue("travel_fee_per_mile") || 200)}/mile)
                </span>
                <span>${formatCurrency((getValue("travel_fee_per_mile") || 200) * 10)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>
                  $
                  {formatCurrency(
                    (getValue("base_session_price") || 15000) +
                      (getValue("travel_fee_per_mile") || 200) * 10
                  )}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
