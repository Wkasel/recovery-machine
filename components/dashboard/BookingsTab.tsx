"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  AlertCircle,
  Calendar,
  CalendarX,
  CheckCircle,
  Clock,
  Edit,
  MapPin,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Booking {
  id: string;
  date_time: string;
  duration: number;
  add_ons: any;
  status: string;
  location_address: any;
  special_instructions: string;
  created_at: string;
  updated_at: string;
}

interface BookingsTabProps {
  user: User;
  onRefresh: () => void;
}

export function BookingsTab({ user, onRefresh }: BookingsTabProps) {
  const supabase = createBrowserSupabaseClient();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadBookings();
  }, [user.id]);

  const loadBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("date_time", { ascending: true });

      if (error) throw error;

      // Filter to show only upcoming and recent bookings
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const relevantBookings =
        data?.filter((booking) => {
          const bookingDate = new Date(booking.date_time);
          return (
            bookingDate > thirtyDaysAgo ||
            !["completed", "cancelled", "no_show"].includes(booking.status)
          );
        }) || [];

      setBookings(relevantBookings);
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const canCancelBooking = (booking: Booking) => {
    const bookingDate = new Date(booking.date_time);
    const now = new Date();
    const hoursUntilBooking = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Can cancel if booking is more than 24 hours away and not already cancelled/completed
    return (
      hoursUntilBooking > 24 && !["cancelled", "completed", "no_show"].includes(booking.status)
    );
  };

  const canRescheduleBooking = (booking: Booking) => {
    const bookingDate = new Date(booking.date_time);
    const now = new Date();
    const hoursUntilBooking = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Can reschedule if booking is more than 48 hours away and not already cancelled/completed
    return (
      hoursUntilBooking > 48 && !["cancelled", "completed", "no_show"].includes(booking.status)
    );
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    setCancelling(true);
    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedBooking.id);

      if (error) throw error;

      toast.success("Booking cancelled successfully");
      loadBookings();
      onRefresh();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    } finally {
      setCancelling(false);
      setCancelDialogOpen(false);
      setSelectedBooking(null);
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const getServiceName = (addOns: any) => {
    if (addOns?.serviceType === "cold_plunge") return "Cold Plunge";
    if (addOns?.serviceType === "infrared_sauna") return "Infrared Sauna";
    if (addOns?.serviceType === "combo_package") return "Ultimate Recovery Combo";
    return "Recovery Session";
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: "Scheduled", variant: "secondary" as const, icon: Calendar },
      confirmed: { label: "Confirmed", variant: "default" as const, icon: CheckCircle },
      in_progress: { label: "In Progress", variant: "default" as const, icon: Clock },
      completed: { label: "Completed", variant: "secondary" as const, icon: CheckCircle },
      cancelled: { label: "Cancelled", variant: "destructive" as const, icon: XCircle },
      no_show: { label: "No Show", variant: "destructive" as const, icon: CalendarX },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <Icon className="w-3 h-3" />
        <span>{config.label}</span>
      </Badge>
    );
  };

  const upcomingBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date_time);
    const now = new Date();
    return bookingDate > now && !["cancelled", "no_show"].includes(booking.status);
  });

  const recentBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date_time);
    const now = new Date();
    return bookingDate <= now || ["cancelled", "no_show"].includes(booking.status);
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 animate-pulse rounded w-1/3"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Bookings</h2>
          <p className="text-gray-300 mt-1">Manage your recovery sessions</p>
        </div>
        <Button asChild>
          <Link href="/book">
            <Plus className="w-4 h-4 mr-2" />
            New Booking
          </Link>
        </Button>
      </div>

      {/* Cancellation Policy Notice */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Cancellation Policy:</strong> Sessions can be cancelled up to 24 hours in advance.
          Rescheduling is available up to 48 hours before your session.
        </AlertDescription>
      </Alert>

      {/* Upcoming Bookings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">
          Upcoming Sessions ({upcomingBookings.length})
        </h3>

        {upcomingBookings.length > 0 ? (
          <div className="space-y-4">
            {upcomingBookings.map((booking) => {
              const dateTime = formatDateTime(booking.date_time);
              const canCancel = canCancelBooking(booking);
              const canReschedule = canRescheduleBooking(booking);

              return (
                <Card key={booking.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-lg font-semibold text-white">
                            {getServiceName(booking.add_ons)}
                          </h4>
                          {getStatusBadge(booking.status)}
                        </div>

                        <div className="space-y-2 text-sm text-gray-300">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{dateTime.date}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>
                              {dateTime.time} ({booking.duration} minutes)
                            </span>
                          </div>
                          {booking.location_address?.street && (
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {booking.location_address.street}, {booking.location_address.city}
                              </span>
                            </div>
                          )}
                        </div>

                        {booking.special_instructions && (
                          <div className="bg-gray-50 p-3 rounded text-sm">
                            <strong>Instructions:</strong> {booking.special_instructions}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2 ml-6">
                        {canReschedule && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/book?reschedule=${booking.id}`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Reschedule
                            </Link>
                          </Button>
                        )}

                        {canCancel && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setCancelDialogOpen(true);
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        )}

                        {!canCancel && !canReschedule && booking.status === "scheduled" && (
                          <p className="text-xs text-gray-500 text-center">
                            Changes not allowed within 24-48 hours
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <CalendarX className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-white mb-2">No upcoming sessions</h3>
              <p className="text-gray-300 mb-4">Ready to book your next recovery session?</p>
              <Button asChild>
                <Link href="/book">
                  <Plus className="w-4 h-4 mr-2" />
                  Book Session
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Bookings */}
      {recentBookings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Recent Sessions ({recentBookings.length})
          </h3>

          <div className="space-y-4">
            {recentBookings.map((booking) => {
              const dateTime = formatDateTime(booking.date_time);

              return (
                <Card key={booking.id} className="opacity-75">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-lg font-medium text-gray-700">
                            {getServiceName(booking.add_ons)}
                          </h4>
                          {getStatusBadge(booking.status)}
                        </div>

                        <div className="space-y-2 text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {dateTime.date} at {dateTime.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
              {selectedBooking && (
                <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                  <strong>{getServiceName(selectedBooking.add_ons)}</strong>
                  <br />
                  {formatDateTime(selectedBooking.date_time).date} at{" "}
                  {formatDateTime(selectedBooking.date_time).time}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelBooking}
              disabled={cancelling}
              className="bg-red-600 hover:bg-red-700"
            >
              {cancelling ? "Cancelling..." : "Cancel Booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
