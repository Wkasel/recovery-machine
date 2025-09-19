// types/supabase.ts
// Recovery Machine Supabase types

export interface User {
  id: string;
  email: string;
  phone: string | null;
  address: string | null;
  referral_code: string | null;
  credits: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  bolt_checkout_id: string | null;
  amount: number;
  status: 'pending' | 'paid' | 'refunded';
  setup_fee_applied: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  order_id: string;
  date_time: string;
  duration: number; // 30 minutes default
  add_ons: Record<string, any>; // JSON: {extra_visits: 2, family: true}
  status: 'scheduled' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  invitee_email: string;
  status: 'pending' | 'accepted';
  reward_credits: number;
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
  created_at: string;
  updated_at: string;
}

export interface Admin {
  id: string;
  email: string;
  role: 'super' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<User, "id" | "created_at" | "updated_at">>;
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
        Insert: Omit<Referral, "id" | "created_at" | "updated_at">;
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
    };
  };
}
