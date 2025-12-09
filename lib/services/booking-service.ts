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

  // Calculate setup fee based on address with real traffic data
  static async calculateSetupFee(address: Address): Promise<SetupFeeCalculation> {
    const baseSetupFee = 7999; // $79.99 base fee

    // Costa Mesa dispatch center coordinates
    const DISPATCH_CENTER = {
      address: '2777 Bristol St Unit E, Costa Mesa, CA 92626',
      lat: 33.6846,
      lng: -117.8871
    };

    try {
      // Try to get real distance and traffic data from Google Maps
      if (typeof window !== 'undefined' && window.google) {
        const service = new window.google.maps.DistanceMatrixService();

        const result = await new Promise<any>((resolve, reject) => {
          service.getDistanceMatrix(
            {
              origins: [DISPATCH_CENTER.address],
              destinations: [address.lat && address.lng
                ? { lat: address.lat, lng: address.lng }
                : `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`],
              travelMode: window.google.maps.TravelMode.DRIVING,
              drivingOptions: {
                departureTime: new Date(), // Current time for real-time traffic
                trafficModel: window.google.maps.TrafficModel.BEST_GUESS
              },
              unitSystem: window.google.maps.UnitSystem.IMPERIAL,
            },
            (response: any, status: any) => {
              if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
                resolve(response);
              } else {
                reject(new Error('Distance Matrix API failed'));
              }
            }
          );
        });

        const element = result.rows[0].elements[0];
        const distanceInMiles = element.distance.value / 1609.34; // meters to miles
        const durationInMinutes = Math.ceil(element.duration_in_traffic
          ? element.duration_in_traffic.value / 60
          : element.duration.value / 60);

        // Distance-based fee: $5 per mile over 10 miles
        const distanceFee = distanceInMiles > 10 ? Math.ceil((distanceInMiles - 10) * 500) : 0;

        const totalSetupFee = baseSetupFee + distanceFee;

        return {
          baseSetupFee,
          distanceFee,
          totalSetupFee: Math.min(totalSetupFee, 50000), // Cap at $500
          distance: Math.round(distanceInMiles * 10) / 10, // Round to 1 decimal
          estimatedTravelTime: durationInMinutes, // Real-time traffic estimate
        };
      } else {
        // Fallback to mock calculation if Google Maps not available
        throw new Error('Google Maps not available');
      }
    } catch (error) {
      console.warn('Using fallback distance calculation:', error);

      // Fallback: Use mock distance based on ZIP code
      const mockDistance = this.getMockDistanceFromCostaMesa(address.zipCode);
      const distanceFee = mockDistance > 10 ? Math.ceil((mockDistance - 10) * 500) : 0;
      const totalSetupFee = baseSetupFee + distanceFee;

      return {
        baseSetupFee,
        distanceFee,
        totalSetupFee: Math.min(totalSetupFee, 50000),
        distance: mockDistance,
        estimatedTravelTime: Math.round(mockDistance * 2), // 2 minutes per mile with traffic buffer
      };
    }
  }

  // Mock distance calculation from Costa Mesa dispatch center (fallback)
  private static getMockDistanceFromCostaMesa(zipCode: string): number {
    // Approximate distances from Costa Mesa (2777 Bristol St) based on ZIP code patterns
    const zip = parseInt(zipCode);

    // Costa Mesa (92626-92629)
    if (zip >= 92626 && zip <= 92629) return 3;

    // Newport Beach (92660-92663, 92625)
    if ((zip >= 92660 && zip <= 92663) || zip === 92625) return 5;

    // Huntington Beach (92646-92649)
    if (zip >= 92646 && zip <= 92649) return 8;

    // Fountain Valley (92708)
    if (zip === 92708) return 6;

    // Irvine area (92602-92620)
    if (zip >= 92602 && zip <= 92620) return 8;

    // Santa Ana (92701-92799)
    if (zip >= 92701 && zip <= 92799) return 6;

    // Laguna Beach (92651-92654)
    if (zip >= 92651 && zip <= 92654) return 12;

    // Tustin, Orange (92780-92869)
    if (zip >= 92780 && zip <= 92869) return 10;

    // Anaheim area (92801-92899)
    if (zip >= 92801 && zip <= 92899) return 15;

    // Long Beach area (90801-90815)
    if (zip >= 90801 && zip <= 90815) return 20;

    // Seal Beach, Los Alamitos (90740, 90720)
    if (zip === 90740 || zip === 90720) return 15;

    // Downtown LA (90001-90099)
    if (zip >= 90001 && zip <= 90099) return 40;

    // Torrance, Redondo (90501-90510, 90277-90278)
    if ((zip >= 90501 && zip <= 90510) || zip === 90277 || zip === 90278) return 30;

    return 20; // Default ~20 miles
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
