"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookingService } from "@/lib/services/booking-service";
import { AvailabilitySlot, ServiceType, services } from "@/lib/types/booking";
import { cn } from "@/lib/utils";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { AlertCircle, Calendar, Clock, Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface BookingCalendarProps {
  serviceType: ServiceType;
  selectedDateTime?: string;
  onDateTimeSelect: (dateTime: string) => void;
  onAddOnsChange: (addOns: {
    extraVisits: number;
    familyMembers: number;
    extendedTime: number;
  }) => void;
  onSpecialInstructionsChange: (instructions: string) => void;
  addOns?: { extraVisits: number; familyMembers: number; extendedTime: number };
  specialInstructions?: string;
  onNext: () => void;
  onBack: () => void;
}

interface TimeSlot {
  time: string;
  available: boolean;
  selected: boolean;
}

export function BookingCalendar({
  serviceType,
  selectedDateTime,
  onDateTimeSelect,
  onAddOnsChange,
  onSpecialInstructionsChange,
  addOns = { extraVisits: 0, familyMembers: 0, extendedTime: 0 },
  specialInstructions = "",
  onNext,
  onBack,
}: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [calendarView, setCalendarView] = useState<"month" | "week">("month");
  const calendarRef = useRef<FullCalendar>(null);

  const selectedService = services.find((s) => s.id === serviceType);
  const sessionDuration = selectedService?.duration || 30;

  // Parse existing selection
  useEffect(() => {
    if (selectedDateTime) {
      const date = new Date(selectedDateTime);
      setSelectedDate(date.toISOString().split("T")[0]);
      setSelectedTime(date.toTimeString().slice(0, 5));
    }
  }, [selectedDateTime]);

  // Load available slots when date changes
  useEffect(() => {
    if (selectedDate) {
      loadAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const loadAvailableSlots = async (date: string) => {
    setIsLoading(true);
    try {
      const slots = await BookingService.getAvailableSlots(date);
      setAvailableSlots(slots);
    } catch (error) {
      console.error("Error loading slots:", error);
      setAvailableSlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (selectInfo: any) => {
    const selectedDateStr = selectInfo.startStr.split("T")[0];
    setSelectedDate(selectedDateStr);
    setSelectedTime("");
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    const dateTime = `${selectedDate}T${time}:00`;
    onDateTimeSelect(dateTime);
  };

  const generateTimeSlots = (): TimeSlot[] => {
    if (!selectedDate) return [];

    const slots: TimeSlot[] = [];
    const date = new Date(selectedDate);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const currentHour = today.getHours();

    // Generate slots from 8 AM to 8 PM
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

        // Skip past times for today
        if (isToday && hour <= currentHour) continue;

        // Check if this time slot is available based on database slots
        const isAvailable = availableSlots.some((slot) => {
          const slotStart = slot.start_time.slice(0, 5);
          const slotEnd = slot.end_time.slice(0, 5);
          return timeStr >= slotStart && timeStr < slotEnd;
        });

        slots.push({
          time: timeStr,
          available: isAvailable,
          selected: timeStr === selectedTime,
        });
      }
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  const calculateTotalDuration = () => {
    return sessionDuration + addOns.extendedTime;
  };

  const calculateAddOnCost = () => {
    const familyMemberCost = addOns.familyMembers * 2500; // $25 per family member
    const extendedTimeCost = addOns.extendedTime * 200; // $2 per minute
    const extraVisitCost = addOns.extraVisits * (selectedService?.basePrice || 0) * 0.8; // 20% discount for extra visits

    return familyMemberCost + extendedTimeCost + extraVisitCost;
  };

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };

  const isNextEnabled = selectedDate && selectedTime;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Appointment Time</h2>
        <p className="text-gray-600">
          Select a date and time that works best for your {selectedService?.name} session
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Select Date</span>
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant={calendarView === "month" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCalendarView("month")}
                  >
                    Month
                  </Button>
                  <Button
                    variant={calendarView === "week" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCalendarView("week")}
                  >
                    Week
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={calendarView === "month" ? "dayGridMonth" : "timeGridWeek"}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "",
                }}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                select={handleDateSelect}
                validRange={{
                  start: new Date().toISOString().split("T")[0], // No past dates
                }}
                height="auto"
                selectConstraint={{
                  start: "08:00",
                  end: "20:00",
                }}
                businessHours={{
                  daysOfWeek: [1, 2, 3, 4, 5, 6, 0], // Monday - Sunday
                  startTime: "08:00",
                  endTime: "20:00",
                }}
                dayCellClassNames={(arg) => {
                  if (arg.dateStr === selectedDate) {
                    return "bg-blue-50 border-blue-300";
                  }
                  return "";
                }}
              />
            </CardContent>
          </Card>

          {/* Time slots */}
          {selectedDate && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Available Times</span>
                </CardTitle>
                <CardDescription>
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading available times...</p>
                  </div>
                ) : timeSlots.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={slot.selected ? "default" : "outline"}
                        size="sm"
                        disabled={!slot.available}
                        onClick={() => handleTimeSelect(slot.time)}
                        className={cn(
                          "h-12",
                          slot.selected && "ring-2 ring-blue-500",
                          !slot.available && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {formatTime(slot.time)}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No available times for this date</p>
                    <p className="text-sm text-gray-500">Please select a different date</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Booking summary and add-ons */}
        <div className="space-y-4">
          {/* Booking summary */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">{selectedService?.name}</p>
                <p className="text-sm text-gray-600">{calculateTotalDuration()} minutes</p>
              </div>

              {selectedDate && selectedTime && (
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-medium">
                    {new Date(`${selectedDate}T${selectedTime}`).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    at {formatTime(selectedTime)}
                  </p>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span>Base price:</span>
                  <span>{formatPrice(selectedService?.basePrice || 0)}</span>
                </div>
                {calculateAddOnCost() > 0 && (
                  <div className="flex justify-between">
                    <span>Add-ons:</span>
                    <span>{formatPrice(calculateAddOnCost())}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span>
                    {formatPrice((selectedService?.basePrice || 0) + calculateAddOnCost())}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add-ons */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Add-ons</span>
              </CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Family members */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <Label>Family Members</Label>
                    <p className="text-sm text-gray-600">$25 each</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onAddOnsChange({
                          ...addOns,
                          familyMembers: Math.max(0, addOns.familyMembers - 1),
                        })
                      }
                      disabled={addOns.familyMembers === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center">{addOns.familyMembers}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onAddOnsChange({
                          ...addOns,
                          familyMembers: Math.min(4, addOns.familyMembers + 1),
                        })
                      }
                      disabled={addOns.familyMembers === 4}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Extended time */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <Label>Extended Time</Label>
                    <p className="text-sm text-gray-600">$2 per minute</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onAddOnsChange({
                          ...addOns,
                          extendedTime: Math.max(0, addOns.extendedTime - 15),
                        })
                      }
                      disabled={addOns.extendedTime === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center text-sm">+{addOns.extendedTime}min</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onAddOnsChange({
                          ...addOns,
                          extendedTime: Math.min(30, addOns.extendedTime + 15),
                        })
                      }
                      disabled={addOns.extendedTime === 30}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Extra visits */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <Label>Extra Visits This Week</Label>
                    <p className="text-sm text-gray-600">20% discount</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onAddOnsChange({
                          ...addOns,
                          extraVisits: Math.max(0, addOns.extraVisits - 1),
                        })
                      }
                      disabled={addOns.extraVisits === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center">{addOns.extraVisits}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onAddOnsChange({
                          ...addOns,
                          extraVisits: Math.min(5, addOns.extraVisits + 1),
                        })
                      }
                      disabled={addOns.extraVisits === 5}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Special Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Any special requests or instructions for your session..."
                value={specialInstructions}
                onChange={(e) => onSpecialInstructionsChange(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack} size="lg">
          Back to Address
        </Button>

        <Button onClick={onNext} disabled={!isNextEnabled} size="lg" className="px-8">
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}
