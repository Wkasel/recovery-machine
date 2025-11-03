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

// FullCalendar v6+ includes styles in JS - no separate CSS imports needed

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
    // Handle both select events (desktop) and dateClick events (mobile)
    const selectedDateStr = selectInfo.startStr ? 
      selectInfo.startStr.split("T")[0] : 
      selectInfo.dateStr;
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
        <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>Choose Your Appointment Time</h2>
        <p className="text-muted-foreground font-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
          Select a date and time that works best for your {selectedService?.name} session
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20 md:pb-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card className="bg-white/70 backdrop-blur-sm border-border rounded-3xl shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-foreground" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
                  <Calendar className="w-5 h-5 text-foreground" />
                  <span>Select Date</span>
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant={calendarView === "month" ? "default" : "outline"}
                    size="sm"
                    className="min-h-[44px] min-w-[60px]"
                    onClick={() => setCalendarView("month")}
                  >
                    Month
                  </Button>
                  <Button
                    variant={calendarView === "week" ? "default" : "outline"}
                    size="sm"
                    className="min-h-[44px] min-w-[60px]"
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
                dateClick={handleDateSelect} // Add dateClick for mobile compatibility
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
                    return "bg-mint-accent/20 border-mint";
                  }
                  return "";
                }}
                // Mobile-specific optimizations
                eventDisplay="block"
                dayHeaderFormat={{ weekday: 'short' }}
                titleFormat={{ year: 'numeric', month: 'short' }}
                // Enhanced mobile touch interactions
                longPressDelay={0} // Disable long press to make single taps work better
                eventLongPressDelay={0}
                selectLongPressDelay={0}
                unselectAuto={false} // Keep selection when clicking elsewhere
                // Better mobile responsiveness
                aspectRatio={typeof window !== 'undefined' && window.innerWidth < 768 ? 1.0 : 1.35}
                contentHeight="auto"
                handleWindowResize={true}
                // Additional mobile touch improvements
                selectAllow={() => true} // Always allow selection
                selectOverlap={false} // Prevent overlapping selections
              />
            </CardContent>
          </Card>

          {/* Time slots */}
          {selectedDate && (
            <Card className="mt-4 bg-white/70 backdrop-blur-sm border-border rounded-3xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
                  <Clock className="w-5 h-5 text-foreground" />
                  <span>Available Times</span>
                </CardTitle>
                <CardDescription className="font-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
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
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mint mx-auto"></div>
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
                          "h-12 min-h-[44px] text-sm rounded-full hover:scale-105 transition-transform",
                          slot.selected && "ring-2 ring-mint/20 bg-mint text-charcoal",
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
          <Card className="bg-white/70 backdrop-blur-sm border-border rounded-3xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>Booking Summary</CardTitle>
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
          <Card className="bg-white/70 backdrop-blur-sm border-border rounded-3xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
                <Plus className="w-5 h-5 text-foreground" />
                <span>Add-ons</span>
              </CardTitle>
              <CardDescription className="font-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>Customize your experience</CardDescription>
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
                      className="min-h-[44px] min-w-[44px] p-0"
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
                      className="min-h-[44px] min-w-[44px] p-0"
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
                      className="min-h-[44px] min-w-[44px] p-0"
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
                      className="min-h-[44px] min-w-[44px] p-0"
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
                      className="min-h-[44px] min-w-[44px] p-0"
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
                      className="min-h-[44px] min-w-[44px] p-0"
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
          <Card className="bg-white/70 backdrop-blur-sm border-border rounded-3xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>Special Instructions</CardTitle>
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

      {/* Sticky Mobile Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-50">
        <div className="flex gap-3 max-w-md mx-auto">
          <Button variant="outline" onClick={onBack} className="flex-1 rounded-full">
            Back
          </Button>
          <Button onClick={onNext} disabled={!isNextEnabled} variant="ghost" className="flex-1 rounded-full !bg-charcoal !text-white hover:!bg-charcoal/90">
            Continue to Address
          </Button>
        </div>
      </div>

      {/* Desktop Navigation buttons */}
      <div className="hidden md:flex justify-between pt-6">
        <Button variant="outline" onClick={onBack} size="lg" className="rounded-full">
          Back to Address
        </Button>

        <Button onClick={onNext} disabled={!isNextEnabled} size="lg" variant="ghost" className="px-8 rounded-full !bg-charcoal !text-white hover:!bg-charcoal/90 hover:scale-105 transition-transform">
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}
