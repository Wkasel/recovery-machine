import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import {
  Address,
  AvailabilitySlot,
  BookingFormData,
  DatabaseBooking,
  SetupFeeCalculation,
} from "@/lib/types/booking";

const supabase = createBrowserSupabaseClient();

export class BookingService {
  // Fetch available time slots for a specific date
  static async getAvailableSlots(date: string): Promise<AvailabilitySlot[]> {
    try {
      const { data, error } = await supabase
        .from("availability_slots")
        .select("*")
        .eq("date", date)
        .eq("is_available", true)
        .order("start_time");

      if (error) throw error;

      // Get existing bookings for the date to calculate current_bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from("bookings")
        .select("date_time, duration")
        .gte("date_time", `${date}T00:00:00`)
        .lt("date_time", `${date}T23:59:59`)
        // Some environments may not support "no_show" in the enum; filter only cancelled
        .neq("status", "cancelled");

      if (bookingsError) throw bookingsError;

      // Calculate current bookings for each slot
      return (data || [])
        .map((slot) => {
          const slotStart = new Date(`${date}T${slot.start_time}`);
          const slotEnd = new Date(`${date}T${slot.end_time}`);

          const conflictingBookings = (bookings || []).filter((booking) => {
            const bookingStart = new Date(booking.date_time);
            const bookingEnd = new Date(bookingStart.getTime() + booking.duration * 60000);

            return bookingStart < slotEnd && bookingEnd > slotStart;
          });

          return {
            ...slot,
            current_bookings: conflictingBookings.length,
          };
        })
        .filter((slot) => slot.current_bookings < slot.max_bookings);
    } catch (error) {
      console.error("Error fetching available slots:", error);
      return [];
    }
  }

  // Calculate setup fee based on address
  static async calculateSetupFee(address: Address): Promise<SetupFeeCalculation> {
    // Default setup fee calculation
    // In production, this would use Google Maps Distance Matrix API
    const baseSetupFee = 25000; // $250.00 base fee

    // Mock distance calculation based on ZIP code
    // In production, calculate actual distance from service area
    const mockDistance = this.getMockDistance(address.zipCode);

    // Distance-based fee: $5 per mile over 10 miles
    const distanceFee = mockDistance > 10 ? (mockDistance - 10) * 500 : 0;

    const totalSetupFee = baseSetupFee + distanceFee;

    return {
      baseSetupFee,
      distanceFee,
      totalSetupFee: Math.min(totalSetupFee, 50000), // Cap at $500
      distance: mockDistance,
      estimatedTravelTime: Math.round(mockDistance * 1.5), // Rough estimate: 1.5 minutes per mile
    };
  }

  // Mock distance calculation (replace with real Google Maps API)
  private static getMockDistance(zipCode: string): number {
    // Mock distances based on ZIP code patterns
    const zip = parseInt(zipCode);
    if (zip >= 90210 && zip <= 90299) return 5; // Beverly Hills area - close
    if (zip >= 90001 && zip <= 90099) return 15; // Downtown LA - medium
    if (zip >= 91000 && zip <= 91999) return 25; // Valley - far
    return 12; // Default medium distance
  }

  // Check for booking conflicts
  static async checkConflicts(
    dateTime: string,
    duration: number,
    userId?: string
  ): Promise<boolean> {
    try {
      const startTime = new Date(dateTime);
      const endTime = new Date(startTime.getTime() + duration * 60000);

      const { data, error } = await supabase
        .from("bookings")
        .select("id, date_time, duration, user_id")
        .gte("date_time", startTime.toISOString())
        .lt("date_time", endTime.toISOString())
        .neq("status", "cancelled");

      if (error) throw error;

      // Check for any overlapping bookings
      const conflicts = (data || []).filter((booking) => {
        const bookingStart = new Date(booking.date_time);
        const bookingEnd = new Date(bookingStart.getTime() + booking.duration * 60000);

        // If it's the same user, allow (for editing existing bookings)
        if (userId && booking.user_id === userId) return false;

        return startTime < bookingEnd && endTime > bookingStart;
      });

      return conflicts.length > 0;
    } catch (error) {
      console.error("Error checking conflicts:", error);
      return true; // Assume conflict on error for safety
    }
  }

  // Create a new booking
  static async createBooking(
    bookingData: BookingFormData,
    userId: string
  ): Promise<DatabaseBooking | null> {
    try {
      // First check for conflicts
      const hasConflicts = await this.checkConflicts(
        bookingData.dateTime,
        bookingData.duration,
        userId
      );

      if (hasConflicts) {
        throw new Error("Booking conflict detected. Please choose a different time.");
      }

      const { data, error } = await supabase
        .from("bookings")
        .insert([
          {
            user_id: userId,
            date_time: bookingData.dateTime,
            duration: bookingData.duration,
            add_ons: bookingData.addOns,
            location_address: bookingData.address,
            special_instructions: bookingData.specialInstructions,
            status: "scheduled",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error creating booking:", error);
      return null;
    }
  }

  // Get user's bookings
  static async getUserBookings(userId: string): Promise<DatabaseBooking[]> {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", userId)
        .order("date_time", { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      return [];
    }
  }

  // Cancel a booking
  static async cancelBooking(bookingId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled", updated_at: new Date().toISOString() })
        .eq("id", bookingId)
        .eq("user_id", userId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error("Error cancelling booking:", error);
      return false;
    }
  }

  // Generate default availability slots for a date (admin function)
  static async generateDefaultSlots(date: string): Promise<boolean> {
    try {
      // Generate slots from 8 AM to 6 PM, 2-hour intervals
      const slots = [];
      const baseDate = new Date(date);

      for (let hour = 8; hour < 18; hour += 2) {
        slots.push({
          date,
          start_time: `${hour.toString().padStart(2, "0")}:00:00`,
          end_time: `${(hour + 2).toString().padStart(2, "0")}:00:00`,
          is_available: true,
          max_bookings: 1,
        });
      }

      const { error } = await supabase.from("availability_slots").insert(slots);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error("Error generating default slots:", error);
      return false;
    }
  }
}
