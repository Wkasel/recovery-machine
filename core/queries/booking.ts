import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Booking } from "@/lib/types/supabase";

// Client-side queries
export const bookingQueries = {
  async getUserBookings(userId: string): Promise<Booking[]> {
    const supabase = createBrowserSupabaseClient();
    
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", userId)
      .order("date_time", { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getBookingById(id: string): Promise<Booking | null> {
    const supabase = createBrowserSupabaseClient();
    
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) return null;
    return data;
  },

  async getAvailableSlots(date: string): Promise<string[]> {
    const supabase = createBrowserSupabaseClient();
    
    // Get existing bookings for the date
    const { data: existingBookings, error } = await supabase
      .from("bookings")
      .select("date_time, duration")
      .gte("date_time", `${date} 00:00:00`)
      .lt("date_time", `${date} 23:59:59`)
      .eq("status", "scheduled");
    
    if (error) throw error;
    
    // Generate available slots (this is simplified - you'd want more complex logic)
    const allSlots = [
      "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
    ];
    
    const bookedSlots = existingBookings.map(booking => 
      new Date(booking.date_time).toTimeString().slice(0, 5)
    );
    
    return allSlots.filter(slot => !bookedSlots.includes(slot));
  },
};

// Server-side queries
export const bookingServerQueries = {
  async getAllBookings(): Promise<Booking[]> {
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("date_time", { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getBookingsByDateRange(startDate: string, endDate: string): Promise<Booking[]> {
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .gte("date_time", startDate)
      .lte("date_time", endDate)
      .order("date_time", { ascending: true });
    
    if (error) throw error;
    return data;
  },
};