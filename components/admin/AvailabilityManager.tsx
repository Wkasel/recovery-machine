"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Calendar, Clock, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface AvailabilitySlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  max_bookings: number;
  created_at: string;
}

export function AvailabilityManager() {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Set default dates (today and 30 days from now)
  useEffect(() => {
    const today = new Date();
    const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    setStartDate(today.toISOString().split('T')[0]);
    setEndDate(thirtyDaysLater.toISOString().split('T')[0]);
  }, []);

  const fetchSlots = async (date?: string) => {
    try {
      setIsLoading(true);
      const url = date ? `/api/admin/availability?date=${date}` : "/api/admin/availability";
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch availability slots");
      }
      
      const data = await response.json();
      setSlots(data.slots || []);
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast.error("Failed to load availability slots");
    } finally {
      setIsLoading(false);
    }
  };

  const generateDefaultSlots = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }

    try {
      setIsGenerating(true);
      const response = await fetch("/api/admin/availability/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate,
          endDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate availability slots");
      }

      const data = await response.json();
      toast.success(`Generated ${data.slots} availability slots`);
      
      // Refresh the slots list
      await fetchSlots(selectedDate);
    } catch (error) {
      console.error("Error generating slots:", error);
      toast.error("Failed to generate availability slots");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSlotAvailability = async (slotId: string, currentValue: boolean) => {
    try {
      const response = await fetch("/api/admin/availability", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: slotId,
          is_available: !currentValue,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update slot");
      }

      toast.success("Slot updated successfully");
      
      // Update local state
      setSlots(slots.map(slot => 
        slot.id === slotId 
          ? { ...slot, is_available: !currentValue }
          : slot
      ));
    } catch (error) {
      console.error("Error updating slot:", error);
      toast.error("Failed to update slot");
    }
  };

  const updateMaxBookings = async (slotId: string, maxBookings: number) => {
    try {
      const response = await fetch("/api/admin/availability", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: slotId,
          max_bookings: maxBookings,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update slot");
      }

      toast.success("Max bookings updated");
      
      // Update local state
      setSlots(slots.map(slot => 
        slot.id === slotId 
          ? { ...slot, max_bookings: maxBookings }
          : slot
      ));
    } catch (error) {
      console.error("Error updating slot:", error);
      toast.error("Failed to update slot");
    }
  };

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short", 
      day: "numeric",
    });
  };

  const groupSlotsByDate = (slots: AvailabilitySlot[]) => {
    return slots.reduce((groups, slot) => {
      const date = slot.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(slot);
      return groups;
    }, {} as Record<string, AvailabilitySlot[]>);
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const groupedSlots = groupSlotsByDate(slots);
  const hasSlots = Object.keys(groupedSlots).length > 0;

  return (
    <div className="space-y-6">
      {/* Generate Default Slots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Generate Availability Slots</span>
          </CardTitle>
          <CardDescription>
            Create default availability slots for a date range
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <Button 
              onClick={generateDefaultSlots} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Slots
                </>
              )}
            </Button>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            This will create 2-hour time slots from 8 AM to 8 PM for each day in the selected range.
          </div>
        </CardContent>
      </Card>

      {/* Filter and View Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Current Availability</span>
          </CardTitle>
          <CardDescription>
            View and manage existing availability slots
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end mb-4">
            <div className="flex-1">
              <Label htmlFor="filter-date">Filter by Date (optional)</Label>
              <Input
                id="filter-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                placeholder="All dates"
              />
            </div>
            <Button onClick={() => fetchSlots(selectedDate)} disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Loading availability slots...</p>
            </div>
          ) : !hasSlots ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No availability slots found</p>
              <p className="text-sm text-muted-foreground">
                Use the "Generate Slots" section above to create default availability
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedSlots)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([date, dateSlots]) => (
                  <div key={date} className="border border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-white mb-4">
                      {formatDate(date)} ({new Date(date).toLocaleDateString()})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {dateSlots
                        .sort((a, b) => a.start_time.localeCompare(b.start_time))
                        .map((slot) => (
                          <div
                            key={slot.id}
                            className={`border rounded-lg p-4 ${
                              slot.is_available
                                ? "border-green-600 bg-primary/5/5"
                                : "border-red-600 bg-red-50/5"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium text-white">
                                  {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                                </span>
                              </div>
                              <Badge 
                                variant={slot.is_available ? "default" : "destructive"}
                                className="text-xs"
                              >
                                {slot.is_available ? "Available" : "Disabled"}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center justify-between mb-3">
                              <Label className="text-sm text-muted-foreground">Available</Label>
                              <Switch
                                checked={slot.is_available}
                                onCheckedChange={() => 
                                  toggleSlotAvailability(slot.id, slot.is_available)
                                }
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <Label className="text-sm text-muted-foreground">Max Bookings</Label>
                              <Input
                                type="number"
                                min="1"
                                max="10"
                                value={slot.max_bookings}
                                onChange={(e) => 
                                  updateMaxBookings(slot.id, parseInt(e.target.value) || 1)
                                }
                                className="w-20 h-8 text-center"
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}