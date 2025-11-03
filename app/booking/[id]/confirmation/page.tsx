"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { BookingConfirmation } from "@/components/booking/BookingConfirmation";

interface BookingData {
  id: string;
  user_id: string;
  order_id: string | null;
  date_time: string;
  duration: number;
  service_type: string;
  add_ons: Record<string, any>;
  status: string;
  address: Record<string, any>;
  notes: string | null;
  created_at: string;
  updated_at: string;
  orders?: {
    amount: number;
    status: string;
  };
}

export default function BookingConfirmationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = params.id;
  const token = searchParams.get("token");

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId || !token) {
      setError("Invalid confirmation link");
      setIsLoading(false);
      return;
    }

    fetchBookingDetails();
  }, [bookingId, token]);

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/confirmation?token=${token}`);
      
      if (!response.ok) {
        throw new Error("Booking not found or invalid token");
      }

      const data = await response.json();
      setBooking(data.booking);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load booking details");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground font-light">Loading your booking confirmation...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 bg-white/70 backdrop-blur-sm border border-border rounded-3xl p-12 shadow-lg max-w-md mx-4">
          <h1 className="text-2xl font-serif font-bold text-foreground">Booking Not Found</h1>
          <p className="text-muted-foreground font-light">{error || "This confirmation link is invalid or has expired."}</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-md font-semibold"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-serif font-bold text-primary mb-2 tracking-tight">Booking Confirmed!</h1>
            <p className="text-muted-foreground font-light">Your Recovery Machine session has been confirmed.</p>
          </div>

          <BookingConfirmation
            booking={booking}
            orderAmount={booking.orders?.amount || 0}
            setupFee={0}
            onNewBooking={() => router.push("/book/service")}
            onShare={() => {
              // Copy current URL to clipboard
              navigator.clipboard.writeText(window.location.href);
              alert("Confirmation link copied to clipboard!");
            }}
          />

          <div className="mt-8 text-center space-x-4">
            <a
              href="/book"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-md font-semibold"
            >
              Book Another Session
            </a>
            <a
              href="/"
              className="inline-block px-6 py-3 border-2 border-border text-foreground rounded-full hover:bg-muted hover:border-primary/30 transition-all duration-300 shadow-sm font-semibold"
            >
              Return Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}