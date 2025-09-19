'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

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

interface BookingPolicySettingsProps {
  settings: BusinessSetting[];
  onUpdateSetting: (key: string, value: any) => Promise<void>;
  loading: boolean;
}

export function BookingPolicySettings({ settings, onUpdateSetting, loading }: BookingPolicySettingsProps) {
  const [localValues, setLocalValues] = useState<Record<string, any>>({});

  const getSetting = (key: string) => {
    return settings.find(s => s.key === key);
  };

  const getValue = (key: string) => {
    if (localValues[key] !== undefined) {
      return localValues[key];
    }
    const setting = getSetting(key);
    return setting?.value;
  };

  const setValue = (key: string, value: any) => {
    setLocalValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key: string) => {
    const value = localValues[key];
    if (value !== undefined) {
      await onUpdateSetting(key, value);
      setLocalValues(prev => ({ ...prev, [key]: undefined }));
    }
  };

  const formatTimeUnit = (value: number, unit: string) => {
    if (value === 1) return `1 ${unit}`;
    return `${value} ${unit}s`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Booking Windows */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Windows</CardTitle>
          <CardDescription>
            Control how far in advance customers can book appointments.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Advance Booking Days */}
          {getSetting('booking_advance_days') && (
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                Maximum Advance Booking
                {getSetting('booking_advance_days')?.is_required && <span className="text-red-500">*</span>}
              </Label>
              <div className="space-y-2">
                <Slider
                  value={[getValue('booking_advance_days') || 30]}
                  onValueChange={([value]) => setValue('booking_advance_days', value)}
                  max={365}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>1 day</span>
                  <span className="font-medium">
                    {formatTimeUnit(getValue('booking_advance_days') || 30, 'day')}
                  </span>
                  <span>365 days</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {getSetting('booking_advance_days')?.description}
              </p>
              {localValues['booking_advance_days'] !== undefined && (
                <Button 
                  size="sm" 
                  onClick={() => handleSave('booking_advance_days')}
                  disabled={loading}
                >
                  Save
                </Button>
              )}
            </div>
          )}

          {/* Buffer Time */}
          {getSetting('booking_buffer_minutes') && (
            <div className="space-y-3">
              <Label>Buffer Time Between Bookings</Label>
              <div className="space-y-2">
                <Slider
                  value={[getValue('booking_buffer_minutes') || 15]}
                  onValueChange={([value]) => setValue('booking_buffer_minutes', value)}
                  max={120}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>0 min</span>
                  <span className="font-medium">
                    {formatTimeUnit(getValue('booking_buffer_minutes') || 15, 'minute')}
                  </span>
                  <span>120 min</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {getSetting('booking_buffer_minutes')?.description}
              </p>
              {localValues['booking_buffer_minutes'] !== undefined && (
                <Button 
                  size="sm" 
                  onClick={() => handleSave('booking_buffer_minutes')}
                  disabled={loading}
                >
                  Save
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancellation & Changes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Cancellation & Changes
            <Badge variant="outline">Public</Badge>
          </CardTitle>
          <CardDescription>
            Set policies for cancellations and rescheduling.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cancellation Hours */}
          {getSetting('booking_cancellation_hours') && (
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                Cancellation Policy
                {getSetting('booking_cancellation_hours')?.is_required && <span className="text-red-500">*</span>}
              </Label>
              <div className="space-y-2">
                <Slider
                  value={[getValue('booking_cancellation_hours') || 24]}
                  onValueChange={([value]) => setValue('booking_cancellation_hours', value)}
                  max={168}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>1 hour</span>
                  <span className="font-medium">
                    {getValue('booking_cancellation_hours') >= 24 
                      ? formatTimeUnit(Math.floor((getValue('booking_cancellation_hours') || 24) / 24), 'day')
                      : formatTimeUnit(getValue('booking_cancellation_hours') || 24, 'hour')
                    }
                  </span>
                  <span>7 days</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Minimum notice required to cancel without penalty
              </p>
              {localValues['booking_cancellation_hours'] !== undefined && (
                <Button 
                  size="sm" 
                  onClick={() => handleSave('booking_cancellation_hours')}
                  disabled={loading}
                >
                  Save
                </Button>
              )}
            </div>
          )}

          {/* Auto-Confirm */}
          {getSetting('booking_auto_confirm') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-Confirm Bookings</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Automatically confirm bookings or require manual approval
                  </p>
                </div>
                <Switch
                  checked={getValue('booking_auto_confirm') || false}
                  onCheckedChange={(checked) => setValue('booking_auto_confirm', checked)}
                />
              </div>
              {localValues['booking_auto_confirm'] !== undefined && (
                <Button 
                  size="sm" 
                  onClick={() => handleSave('booking_auto_confirm')}
                  disabled={loading}
                >
                  Save
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Capacity Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Capacity Management</CardTitle>
          <CardDescription>
            Set limits on daily bookings and capacity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Max Bookings Per Day */}
          {getSetting('booking_max_per_day') && (
            <div className="space-y-3">
              <Label>Maximum Bookings Per Day</Label>
              <div className="space-y-2">
                <Slider
                  value={[getValue('booking_max_per_day') || 8]}
                  onValueChange={([value]) => setValue('booking_max_per_day', value)}
                  max={50}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>1 booking</span>
                  <span className="font-medium">
                    {getValue('booking_max_per_day') || 8} bookings
                  </span>
                  <span>50 bookings</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {getSetting('booking_max_per_day')?.description}
              </p>
              {localValues['booking_max_per_day'] !== undefined && (
                <Button 
                  size="sm" 
                  onClick={() => handleSave('booking_max_per_day')}
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
  );
}