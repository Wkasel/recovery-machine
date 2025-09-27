"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-muted-foreground">Loading your booking confirmation...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-400">Booking Not Found</h1>
          <p className="text-muted-foreground">{error || "This confirmation link is invalid or has expired."}</p>
          <a 
            href="/" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-green-400 mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground">Your Recovery Machine session has been confirmed.</p>
          </div>
          
          <BookingConfirmation
            booking={booking}
            orderAmount={booking.orders?.amount || 0}
            setupFee={0}
            onShare={() => {
              // Copy current URL to clipboard
              navigator.clipboard.writeText(window.location.href);
              alert("Confirmation link copied to clipboard!");
            }}
          />

          <div className="mt-8 text-center">
            <a 
              href="/book" 
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-4"
            >
              Book Another Session
            </a>
            <a 
              href="/" 
              className="inline-block px-6 py-3 border border-neutral-600 text-muted-foreground rounded-md hover:bg-neutral-800"
            >
              Return Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}