"use server";

import { StripeCheckoutData } from "@/lib/stripe/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { BookingFormData } from "@/lib/types/booking";
import { z } from "zod";

const createBookingSchema = z.object({
  serviceType: z.enum(["cold_plunge", "infrared_sauna", "combo_package"]),
  dateTime: z.string(),
  duration: z.number().default(30),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    placeId: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }),
  addOns: z
    .object({
      extraVisits: z.number().default(0),
      familyMembers: z.number().default(0),
      extendedTime: z.number().default(0),
    })
    .default({}),
  specialInstructions: z.string().optional(),
  amount: z.number(), // Total amount including service + setup fee
  setupFee: z.number(), // Setup fee amount
  orderType: z.enum(["one_time", "subscription", "setup_fee"]).default("one_time"),
});

const updateBookingSchema = z.object({
  id: z.string(),
  date_time: z.string().optional(),
  status: z
    .enum(["scheduled", "confirmed", "in_progress", "completed", "cancelled", "no_show"])
    .optional(),
});

// Enhanced booking creation with payment integration
export async function createBookingWithPayment(
  bookingData: BookingFormData & {
    amount: number;
    setupFee: number;
    orderType: "one_time" | "subscription";
  }
) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (userError || !user) {
    throw new Error("Not authenticated");
  }

  if (!session?.access_token) {
    throw new Error("Missing access token");
  }

  // Create order first via payment API
  const orderData: StripeCheckoutData = {
    amount: bookingData.amount,
    currency: "USD",
    order_reference: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    description: `Recovery Machine - ${bookingData.serviceType} session`,
    customer_email: user.email!,
    order_type: bookingData.orderType,
    metadata: {
      serviceType: bookingData.serviceType,
      dateTime: bookingData.dateTime,
      address: bookingData.address,
      addOns: bookingData.addOns,
      specialInstructions: bookingData.specialInstructions,
      setupFee: bookingData.setupFee,
    },
  };

  // Call our payment API to create the order and get checkout URL
  const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/stripe/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!paymentResponse.ok) {
    const error = await paymentResponse.json();
    throw new Error(error.error || "Failed to create payment order");
  }

  const paymentResult = await paymentResponse.json();

  // Create booking record with actual order_id
  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      user_id: user.id,
      order_id: paymentResult.order_id, // Now using actual order ID
      date_time: bookingData.dateTime,
      duration: bookingData.duration,
      add_ons: bookingData.addOns,
      location_address: bookingData.address,
      special_instructions: bookingData.specialInstructions,
      status: "scheduled", // Will be updated to "confirmed" after payment
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    success: true,
    booking,
    paymentUrl: paymentResult.checkout_url,
    orderId: paymentResult.order_id,
    message: "Booking created successfully! Complete payment to confirm.",
  };
}

// Legacy function for backward compatibility (now uses createBookingWithPayment)
export async function createBooking(formData: FormData) {
  const data = createBookingSchema.parse({
    serviceType: formData.get("serviceType"),
    dateTime: formData.get("dateTime"),
    duration: Number(formData.get("duration")) || 30,
    address: formData.get("address") ? JSON.parse(formData.get("address") as string) : {},
    addOns: formData.get("addOns") ? JSON.parse(formData.get("addOns") as string) : {},
    specialInstructions: formData.get("specialInstructions") || undefined,
    amount: Number(formData.get("amount")) || 0,
    setupFee: Number(formData.get("setupFee")) || 0,
    orderType: (formData.get("orderType") as any) || "one_time",
  });

  return createBookingWithPayment(data);
}

export async function updateBooking(formData: FormData) {
  const data = updateBookingSchema.parse({
    id: formData.get("id"),
    date_time: formData.get("date_time"),
    status: formData.get("status"),
  });

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Not authenticated");
  }

  const { id, ...updateData } = data;

  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id); // Ensure user can only update their own bookings

  if (error) {
    throw new Error(error.message);
  }

  return { success: true, message: "Booking updated successfully!" };
}
