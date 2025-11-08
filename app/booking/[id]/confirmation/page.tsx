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
      <div className="min-h-screen pt-24 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-mint-accent border-t-transparent"></div>
          <p className="text-charcoal/70" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>Loading your booking confirmation...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-background">
        <div className="text-center space-y-6 bg-white/50 backdrop-blur-sm border border-charcoal/10 rounded-3xl p-12 shadow-lg max-w-md mx-4">
          <h1 className="text-3xl font-medium text-charcoal" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>BOOKING NOT FOUND</h1>
          <p className="text-charcoal/70" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>{error || "This confirmation link is invalid or has expired."}</p>
          <a
            href="/"
            className="inline-block px-8 py-3 bg-charcoal text-white rounded-full hover:bg-charcoal/90 hover:scale-105 transition-all duration-300 shadow-lg text-sm font-medium"
            style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
          >
            RETURN HOME
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-medium text-charcoal mb-3 tracking-tight" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>BOOKING CONFIRMED!</h1>
            <p className="text-charcoal/70 text-lg" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>Your Recovery Machine session is all set.</p>
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

          <div className="mt-12 text-center flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/book"
              className="inline-block px-8 py-3 bg-charcoal text-white rounded-full hover:bg-charcoal/90 hover:scale-105 transition-all duration-300 shadow-lg text-sm font-medium"
              style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
            >
              BOOK ANOTHER SESSION
            </a>
            <a
              href="/"
              className="inline-block px-8 py-3 border-2 border-charcoal text-charcoal rounded-full hover:bg-charcoal hover:text-white transition-all duration-300 shadow-sm text-sm font-medium"
              style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
            >
              RETURN HOME
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}