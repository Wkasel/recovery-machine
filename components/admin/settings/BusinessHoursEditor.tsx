'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

interface BusinessHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

interface BusinessHoursEditorProps {
  value: BusinessHours;
  onChange: (hours: BusinessHours) => void;
  onSave: () => void;
  hasChanges: boolean;
  loading: boolean;
}

const defaultHours: DayHours = {
  open: '09:00',
  close: '17:00',
  closed: false
};

const daysOfWeek = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' }
];

export function BusinessHoursEditor({ value, onChange, onSave, hasChanges, loading }: BusinessHoursEditorProps) {
  const updateDay = (day: string, updates: Partial<DayHours>) => {
    const currentDay = value[day as keyof BusinessHours] || defaultHours;
    const updatedHours = {
      ...value,
      [day]: { ...currentDay, ...updates }
    };
    onChange(updatedHours);
  };

  const copyToAllDays = (sourceDay: string) => {
    const sourceHours = value[sourceDay as keyof BusinessHours];
    if (!sourceHours) return;

    const updatedHours = { ...value };
    daysOfWeek.forEach(({ key }) => {
      if (key !== sourceDay) {
        updatedHours[key as keyof BusinessHours] = { ...sourceHours };
      }
    });
    onChange(updatedHours);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {daysOfWeek.map(({ key, label }) => {
          const dayHours = value[key as keyof BusinessHours] || defaultHours;
          
          return (
            <Card key={key} className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-[100px]">
                  <Label className="font-medium">{label}</Label>
                </div>

                <div className="flex items-center gap-4 flex-1">
                  {!dayHours.closed ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`${key}-open`} className="text-sm">Open:</Label>
                        <Input
                          id={`${key}-open`}
                          type="time"
                          value={dayHours.open || '09:00'}
                          onChange={(e) => updateDay(key, { open: e.target.value })}
                          className="w-32"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Label htmlFor={`${key}-close`} className="text-sm">Close:</Label>
                        <Input
                          id={`${key}-close`}
                          type="time"
                          value={dayHours.close || '17:00'}
                          onChange={(e) => updateDay(key, { close: e.target.value })}
                          className="w-32"
                        />
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => copyToAllDays(key)}
                        className="text-xs"
                      >
                        Copy to all
                      </Button>
                    </>
                  ) : (
                    <div className="text-gray-500 italic flex-1">Closed</div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Label htmlFor={`${key}-closed`} className="text-sm">Closed:</Label>
                  <Switch
                    id={`${key}-closed`}
                    checked={dayHours.closed || false}
                    onCheckedChange={(closed) => updateDay(key, { closed })}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {hasChanges && (
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Business Hours'}
          </Button>
        </div>
      )}
    </div>
  );
}