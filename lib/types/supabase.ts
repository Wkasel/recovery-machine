// Recovery Machine Supabase Database Types
// Auto-generated and manually maintained types for type safety

// ===========================================================================
// CORE TABLE TYPES
// ===========================================================================

export interface Profile {
  id: string; // UUID from auth.users
  email: string;
  phone: string | null;
  address: Record<string, any> | null; // JSONB for address data
  referral_code: string | null; // Auto-generated unique code
  credits: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  bolt_checkout_id: string | null;
  amount: number; // in cents
  setup_fee_applied: number; // in cents
  status: "pending" | "processing" | "paid" | "refunded" | "failed";
  order_type: "subscription" | "one_time" | "setup_fee";
  metadata: Record<string, any>; // JSONB for additional payment data
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  order_id: string | null;
  date_time: string; // TIMESTAMPTZ
  duration: number; // minutes, default 30
  service_type: string; // Required NOT NULL field
  add_ons: Record<string, any>; // JSONB: {extra_visits: 2, family: true, sauna_time: 15}
  status: "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show";
  address: Record<string, any>; // JSONB for delivery address
  special_instructions: string | null;
  created_at: string;
  updated_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  invitee_email: string;
  invitee_id: string | null; // null until they sign up
  status: "pending" | "signed_up" | "first_booking" | "expired";
  reward_credits: number;
  credits_awarded_at: string | null;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  booking_id: string;
  rating: number; // 1-5
  comment: string | null;
  google_synced: boolean;
  is_featured: boolean; // For homepage testimonials
  reviewer_name: string | null; // For public display
  created_at: string;
  updated_at: string;
}

export interface Admin {
  id: string;
  user_id: string;
  email: string;
  role: "super_admin" | "admin" | "operator";
  permissions: Record<string, any>; // JSONB for granular permissions
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  referral_id: string | null;
  amount: number; // Can be negative for deductions
  transaction_type: "referral_bonus" | "booking_credit" | "manual_adjustment" | "refund";
  description: string | null;
  created_at: string;
}

export interface AvailabilitySlot {
  id: string;
  date: string; // DATE
  start_time: string; // TIME
  end_time: string; // TIME
  is_available: boolean;
  max_bookings: number; // Default 1
  created_at: string;
  updated_at: string;
}

// ===========================================================================
// SUPABASE DATABASE SCHEMA TYPE
// ===========================================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "id" | "created_at" | "updated_at" | "referral_code">;
        Update: Partial<Omit<Profile, "id" | "created_at" | "updated_at" | "referral_code">>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Order, "id" | "created_at" | "updated_at">>;
      };
      bookings: {
        Row: Booking;
        Insert: Omit<Booking, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Booking, "id" | "created_at" | "updated_at">>;
      };
      referrals: {
        Row: Referral;
        Insert: Omit<Referral, "id" | "created_at" | "updated_at" | "credits_awarded_at">;
        Update: Partial<Omit<Referral, "id" | "created_at" | "updated_at">>;
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Review, "id" | "created_at" | "updated_at">>;
      };
      admins: {
        Row: Admin;
        Insert: Omit<Admin, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Admin, "id" | "created_at" | "updated_at">>;
      };
      credit_transactions: {
        Row: CreditTransaction;
        Insert: Omit<CreditTransaction, "id" | "created_at">;
        Update: never; // Credit transactions are immutable
      };
      availability_slots: {
        Row: AvailabilitySlot;
        Insert: Omit<AvailabilitySlot, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<AvailabilitySlot, "id" | "created_at" | "updated_at">>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_super_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// ===========================================================================
// HELPER TYPES FOR APPLICATION USE
// ===========================================================================

// Booking with related data
export type BookingWithDetails = Booking & {
  order?: Order;
  user?: Profile;
  review?: Review;
};

// Referral with related data
export type ReferralWithDetails = Referral & {
  referrer?: Profile;
  invitee?: Profile;
};

// Order with related data
export type OrderWithDetails = Order & {
  user?: Profile;
  bookings?: Booking[];
};

// Review with related data
export type ReviewWithDetails = Review & {
  user?: Profile;
  booking?: Booking;
};

// Admin with related data
export type AdminWithDetails = Admin & {
  user?: {
    email: string;
    id: string;
  };
};

// User profile with stats
export type ProfileWithStats = Profile & {
  total_bookings?: number;
  total_referrals?: number;
  total_credits_earned?: number;
  recent_bookings?: Booking[];
};

// ===========================================================================
// FORM TYPES FOR FRONTEND
// ===========================================================================

export type CreateBookingData = Database["public"]["Tables"]["bookings"]["Insert"];
export type UpdateBookingData = Database["public"]["Tables"]["bookings"]["Update"];
export type CreateOrderData = Database["public"]["Tables"]["orders"]["Insert"];
export type CreateReferralData = Database["public"]["Tables"]["referrals"]["Insert"];
export type CreateReviewData = Database["public"]["Tables"]["reviews"]["Insert"];
export type UpdateProfileData = Database["public"]["Tables"]["profiles"]["Update"];

// ===========================================================================
// API RESPONSE TYPES
// ===========================================================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};
