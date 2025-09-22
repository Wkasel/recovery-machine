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
    // Note: isDevelopmentEnvironment() returns true for production (temporarily enabled for testing)

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

    const supabase = await createServerSupabaseClient();

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Calculate amounts (all $0 with 100% discount)
    const servicePrice = bookingData.servicePrice || 0;
    const addOnsPrice = bookingData.addOnsPrice || 0;
    const totalServiceAmount = servicePrice + addOnsPrice;
    const setupFeeAmount = setupFee || 0;
    
    // Apply 100% discount
    const discountedServiceAmount = 0;
    const discountedSetupFee = 0;
    const finalAmount = discountedServiceAmount + discountedSetupFee;

    // Create the order record
    const orderData = createDevPaymentRecord(
      user.id,
      finalAmount,
      discountedSetupFee
    );

    // Validate order data before insertion
    validateOrderCreation(orderData);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([orderData])
      .select()
      .single();

    if (orderError) {
      console.error("Error creating dev order:", orderError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    // Create the booking record
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert([
        {
          user_id: user.id,
          order_id: order.id,
          date_time: bookingData.dateTime,
          duration: bookingData.duration,
          add_ons: bookingData.addOns,
          location_address: bookingData.address,
          special_instructions: bookingData.specialInstructions,
          status: "confirmed", // Immediately confirmed since "payment" succeeded
        },
      ])
      .select()
      .single();

    if (bookingError) {
      console.error("Error creating booking:", bookingError);
      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 }
      );
    }

    console.log('🔧 DEV MODE: Successfully created booking with payment bypass');

    return NextResponse.json({
      success: true,
      order: order,
      booking: booking,
      paymentBypass: true,
      devMode: true,
      originalAmount: totalServiceAmount + setupFeeAmount,
      finalAmount: finalAmount,
      discount: promoResult.discount,
      message: `Booking confirmed with ${promoResult.description}`
    });

  } catch (error) {
    console.error("Dev payment bypass error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}