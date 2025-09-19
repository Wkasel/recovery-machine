"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { z } from "zod";

const createBookingSchema = z.object({
  date_time: z.string(),
  duration: z.number().default(30),
  add_ons: z.record(z.any()).default({}),
});

const updateBookingSchema = z.object({
  id: z.string(),
  date_time: z.string().optional(),
  status: z.enum(["scheduled", "cancelled"]).optional(),
});

export async function createBooking(formData: FormData) {
  const data = createBookingSchema.parse({
    date_time: formData.get("date_time"),
    duration: Number(formData.get("duration")) || 30,
    add_ons: formData.get("add_ons") ? JSON.parse(formData.get("add_ons") as string) : {},
  });

  const supabase = await createServerSupabaseClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error("Not authenticated");
  }

  // TODO: Add order creation logic with payment
  
  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      user_id: user.id,
      order_id: "temp-order-id", // Will be replaced with actual order
      ...data,
      status: "scheduled",
    })
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return { success: true, booking, message: "Booking created successfully!" };
}

export async function updateBooking(formData: FormData) {
  const data = updateBookingSchema.parse({
    id: formData.get("id"),
    date_time: formData.get("date_time"),
    status: formData.get("status"),
  });

  const supabase = await createServerSupabaseClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
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