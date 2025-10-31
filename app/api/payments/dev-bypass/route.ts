import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { 
  validateDevPromoCode, 
  createDevPaymentRecord, 
  isDevelopmentEnvironment 
} from "@/lib/payment/dev-bypass";
import { 
  validateOrderCreation 
} from "@/lib/payment/production-safeguards";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { promoCode, bookingData, setupFee } = body;

    if (!promoCode || !bookingData) {
      return NextResponse.json(
        { error: "Promo code and booking data required" },
        { status: 400 }
      );
    }

    // Validate the promo code
    const promoResult = validateDevPromoCode(promoCode);
    
    if (!promoResult.isValid || !promoResult.shouldBypassPayment) {
      return NextResponse.json(
        { error: "Invalid promo code" },
        { status: 400 }
      );
    }

    console.log('🔧 DEV MODE: Payment bypass activated with code:', promoCode);

    // For dev bypass, route through the working /api/bookings endpoint
    // This ensures we use the same logic and avoid RLS issues
    const bookingRequest = {
      serviceType: bookingData.serviceType || "recovery_session",
      dateTime: bookingData.dateTime,
      duration: bookingData.duration,
      address: bookingData.address,
      addOns: bookingData.addOns,
      specialInstructions: bookingData.specialInstructions,
      amount: bookingData.servicePrice + bookingData.addOnsPrice + (bookingData.setupFee || 0),
      setupFee: 0,
      orderType: "one_time",
      devBypass: true,
    };

    // Create a new request for the bookings API
    const bookingResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('Cookie') || '', // Forward auth cookies
      },
      body: JSON.stringify(bookingRequest)
    });

    if (!bookingResponse.ok) {
      const errorData = await bookingResponse.json();
      console.error("Booking API error:", errorData);
      return NextResponse.json(
        { error: errorData.error || "Failed to create booking" },
        { status: 500 }
      );
    }

    const bookingResult = await bookingResponse.json();

    console.log('🔧 DEV MODE: Successfully created booking with payment bypass');

    return NextResponse.json({
      ...bookingResult,
      paymentBypass: true,
      devMode: true,
      discount: promoResult.discount,
      message: `Booking confirmed with ${promoResult.description}`,
    });

  } catch (error) {
    console.error("Dev payment bypass error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
