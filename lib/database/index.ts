// Database utilities and CRUD operations for Recovery Machine
// Centralized database operations with error handling

import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  ApiResponse,
  AvailabilitySlot,
  Booking,
  CreateBookingData,
  CreateOrderData,
  CreateReferralData,
  CreateReviewData,
  CreditTransaction,
  Order,
  Profile,
  Referral,
  Review,
  UpdateProfileData,
} from "@/lib/types/supabase";

// ===========================================================================
// CLIENT FACTORIES
// ===========================================================================

export async function getSupabaseClient(context: "server" | "client" = "client") {
  if (context === "server") {
    return createServerSupabaseClient();
  }
  return createBrowserSupabaseClient();
}

// ===========================================================================
// PROFILE OPERATIONS
// ===========================================================================

export async function createUserProfile(
  userId: string,
  profileData: Omit<Profile, "id" | "created_at" | "updated_at" | "referral_code">
): Promise<ApiResponse<Profile>> {
  try {
    const supabase = getSupabaseClient("server");

    const { data, error } = await supabase
      .from("profiles")
      .insert([{ id: userId, ...profileData }])
      .select()
      .single();

    if (error) throw error;

    return { data, error: null, success: true };
  } catch (error) {
    console.error("Error creating user profile:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to create profile",
      success: false,
    };
  }
}

export async function getUserProfile(userId: string): Promise<ApiResponse<Profile>> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

    if (error) throw error;

    return { data, error: null, success: true };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch profile",
      success: false,
    };
  }
}

export async function updateUserProfile(
  userId: string,
  updates: UpdateProfileData
): Promise<ApiResponse<Profile>> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null, success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to update profile",
      success: false,
    };
  }
}

// ===========================================================================
// ORDER OPERATIONS
// ===========================================================================

export async function createOrder(orderData: CreateOrderData): Promise<ApiResponse<Order>> {
  try {
    const supabase = getSupabaseClient("server");

    const { data, error } = await supabase.from("orders").insert([orderData]).select().single();

    if (error) throw error;

    return { data, error: null, success: true };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to create order",
      success: false,
    };
  }
}

export async function getUserOrders(userId: string): Promise<ApiResponse<Order[]>> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { data: data || [], error: null, success: true };
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch orders",
      success: false,
    };
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
  boltCheckoutId?: string
): Promise<ApiResponse<Order>> {
  try {
    const supabase = getSupabaseClient("server");

    const updates: Partial<Order> = { status };
    if (boltCheckoutId) {
      updates.bolt_checkout_id = boltCheckoutId;
    }

    const { data, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null, success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to update order",
      success: false,
    };
  }
}

// ===========================================================================
// BOOKING OPERATIONS
// ===========================================================================

export async function createBooking(bookingData: CreateBookingData): Promise<ApiResponse<Booking>> {
  try {
    const supabase = getSupabaseClient("server");

    const { data, error } = await supabase.from("bookings").insert([bookingData]).select().single();

    if (error) throw error;

    return { data, error: null, success: true };
  } catch (error) {
    console.error("Error creating booking:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to create booking",
      success: false,
    };
  }
}

export async function getUserBookings(userId: string): Promise<ApiResponse<Booking[]>> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", userId)
      .order("date_time", { ascending: true });

    if (error) throw error;

    return { data: data || [], error: null, success: true };
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch bookings",
      success: false,
    };
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: Booking["status"]
): Promise<ApiResponse<Booking>> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", bookingId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null, success: true };
  } catch (error) {
    console.error("Error updating booking status:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to update booking",
      success: false,
    };
  }
}

// ===========================================================================
// REFERRAL OPERATIONS
// ===========================================================================

export async function createReferral(
  referralData: CreateReferralData
): Promise<ApiResponse<Referral>> {
  try {
    const supabase = getSupabaseClient("server");

    const { data, error } = await supabase
      .from("referrals")
      .insert([referralData])
      .select()
      .single();

    if (error) throw error;

    return { data, error: null, success: true };
  } catch (error) {
    console.error("Error creating referral:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to create referral",
      success: false,
    };
  }
}

export async function getUserReferrals(userId: string): Promise<ApiResponse<Referral[]>> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("referrals")
      .select("*")
      .eq("referrer_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { data: data || [], error: null, success: true };
  } catch (error) {
    console.error("Error fetching user referrals:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch referrals",
      success: false,
    };
  }
}

export async function findReferralByCode(referralCode: string): Promise<ApiResponse<Profile>> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("referral_code", referralCode)
      .single();

    if (error) throw error;

    return { data, error: null, success: true };
  } catch (error) {
    console.error("Error finding referral by code:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Referral code not found",
      success: false,
    };
  }
}

// ===========================================================================
// REVIEW OPERATIONS
// ===========================================================================

export async function createReview(reviewData: CreateReviewData): Promise<ApiResponse<Review>> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.from("reviews").insert([reviewData]).select().single();

    if (error) throw error;

    return { data, error: null, success: true };
  } catch (error) {
    console.error("Error creating review:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to create review",
      success: false,
    };
  }
}

export async function getFeaturedReviews(): Promise<ApiResponse<Review[]>> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) throw error;

    return { data: data || [], error: null, success: true };
  } catch (error) {
    console.error("Error fetching featured reviews:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch reviews",
      success: false,
    };
  }
}

// ===========================================================================
// AVAILABILITY OPERATIONS
// ===========================================================================

export async function getAvailableSlots(
  startDate: string,
  endDate: string
): Promise<ApiResponse<AvailabilitySlot[]>> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("availability_slots")
      .select("*")
      .eq("is_available", true)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) throw error;

    return { data: data || [], error: null, success: true };
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch availability",
      success: false,
    };
  }
}

export async function markSlotUnavailable(slotId: string): Promise<ApiResponse<AvailabilitySlot>> {
  try {
    const supabase = getSupabaseClient("server");

    const { data, error } = await supabase
      .from("availability_slots")
      .update({ is_available: false })
      .eq("id", slotId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null, success: true };
  } catch (error) {
    console.error("Error marking slot unavailable:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to update slot",
      success: false,
    };
  }
}

// ===========================================================================
// CREDIT OPERATIONS
// ===========================================================================

export async function addCredits(
  userId: string,
  amount: number,
  transactionType: CreditTransaction["transaction_type"],
  description?: string,
  referralId?: string
): Promise<ApiResponse<CreditTransaction>> {
  try {
    const supabase = getSupabaseClient("server");

    const { data, error } = await supabase
      .from("credit_transactions")
      .insert([
        {
          user_id: userId,
          amount,
          transaction_type: transactionType,
          description,
          referral_id: referralId,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return { data, error: null, success: true };
  } catch (error) {
    console.error("Error adding credits:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to add credits",
      success: false,
    };
  }
}

export async function getUserCreditTransactions(
  userId: string
): Promise<ApiResponse<CreditTransaction[]>> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("credit_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { data: data || [], error: null, success: true };
  } catch (error) {
    console.error("Error fetching credit transactions:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch transactions",
      success: false,
    };
  }
}

// ===========================================================================
// TESTING UTILITIES
// ===========================================================================

export async function testDatabaseConnection(): Promise<ApiResponse<boolean>> {
  try {
    const supabase = getSupabaseClient();

    // Simple test query
    const { data, error } = await supabase
      .from("profiles")
      .select("count", { count: "exact", head: true });

    if (error) throw error;

    return { data: true, error: null, success: true };
  } catch (error) {
    console.error("Database connection test failed:", error);
    return {
      data: false,
      error: error instanceof Error ? error.message : "Connection test failed",
      success: false,
    };
  }
}

export async function getTableCounts(): Promise<ApiResponse<Record<string, number>>> {
  try {
    const supabase = getSupabaseClient("server");

    const tables = ["profiles", "orders", "bookings", "referrals", "reviews", "availability_slots"];
    const counts: Record<string, number> = {};

    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      counts[table] = count || 0;
    }

    return { data: counts, error: null, success: true };
  } catch (error) {
    console.error("Error getting table counts:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to get table counts",
      success: false,
    };
  }
}
