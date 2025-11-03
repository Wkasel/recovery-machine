import { z } from "zod";

// Service types and pricing
export type ServiceType =
  | "cold_plunge"
  | "infrared_sauna"
  | "combo_package"
  | "membership_lite"
  | "membership_full_spectrum"
  | "membership_elite";

export interface ServiceOption {
  id: ServiceType;
  name: string;
  description: string;
  duration: number; // in minutes
  basePrice: number; // in cents
  features: string[];
  popular?: boolean;
  recurring?: boolean; // true for memberships
  category?: "one-time" | "membership"; // categorize services
}

export const services: ServiceOption[] = [
  // One-Time Sessions
  {
    id: "cold_plunge",
    name: "Cold Plunge Session",
    description: "Professional cold therapy for recovery and wellness",
    duration: 60,
    basePrice: 17500, // $175.00 (household session base)
    features: ["Up to 4 people", "60-minute session", "Professional setup", "Post-session consultation"],
    category: "one-time",
  },
  {
    id: "infrared_sauna",
    name: "Infrared Sauna Session",
    description: "Full-spectrum infrared therapy for detox and relaxation",
    duration: 60,
    basePrice: 17500, // $175.00 (household session base)
    features: ["Up to 4 people", "60-minute session", "Temperature control", "Towels included"],
    category: "one-time",
  },
  {
    id: "combo_package",
    name: "Complete Recovery Experience",
    description: "Combined cold plunge and infrared sauna session",
    duration: 60,
    basePrice: 20000, // $200.00 (household session upper range)
    features: [
      "Up to 4 people",
      "Cold plunge therapy",
      "Infrared sauna session",
      "Extended recovery time",
      "Professional guidance",
    ],
    category: "one-time",
  },
  // Monthly Memberships
  {
    id: "membership_lite",
    name: "Recovery Lite",
    description: "2 visits per month",
    duration: 60,
    basePrice: 27500, // $275.00 per month
    features: [
      "2 mobile sessions per month",
      "Choose infrared sauna or cold plunge",
      "Professional setup and guidance",
      "Flexible scheduling",
      "Cancel with 30 days' notice",
    ],
    recurring: true,
    category: "membership",
  },
  {
    id: "membership_full_spectrum",
    name: "Full Spectrum Contrast",
    description: "4 visits per month",
    duration: 60,
    basePrice: 52500, // $525.00 per month
    features: [
      "4 mobile sessions per month (1 per week)",
      "Full contrast therapy (cold plunge + infrared)",
      "Professional setup and guidance",
      "Priority scheduling",
      "Cancel with 30 days' notice",
      "Save 10% with 10-session pack",
    ],
    popular: true,
    recurring: true,
    category: "membership",
  },
  {
    id: "membership_elite",
    name: "Elite Performance",
    description: "8 visits per month",
    duration: 60,
    basePrice: 85000, // $850.00 per month
    features: [
      "8 mobile sessions per month (2 per week)",
      "All recovery modalities included",
      "Priority scheduling",
      "Personalized recovery protocols",
      "Cancel with 30 days' notice",
      "Maximum flexibility",
    ],
    recurring: true,
    category: "membership",
  },
];

// Address validation schema
export const addressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "ZIP code is required"),
  placeId: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export type Address = z.infer<typeof addressSchema>;

// Booking form schema
export const bookingFormSchema = z.object({
  serviceType: z.enum([
    "cold_plunge",
    "infrared_sauna",
    "combo_package",
    "membership_lite",
    "membership_full_spectrum",
    "membership_elite",
  ]),
  dateTime: z.string().min(1, "Date and time are required"),
  duration: z.number().min(30).max(120),
  address: addressSchema,
  addOns: z
    .object({
      extraVisits: z.number().min(0).max(5).default(0),
      familyMembers: z.number().min(0).max(4).default(0),
      extendedTime: z.number().min(0).max(30).default(0), // extra minutes
    })
    .default({}),
  specialInstructions: z.string().optional(),
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms and conditions"),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

// Setup fee calculation
export interface SetupFeeCalculation {
  baseSetupFee: number; // in cents
  distanceFee: number; // in cents
  totalSetupFee: number; // in cents
  distance: number; // in miles
  estimatedTravelTime: number; // in minutes
}

// Booking step tracking
export type BookingStep = "service" | "address" | "calendar" | "payment" | "confirmation";

export interface BookingState {
  currentStep: BookingStep;
  serviceType?: ServiceType;
  dateTime?: string;
  address?: Address;
  addOns?: {
    extraVisits: number;
    familyMembers: number;
    extendedTime: number;
  };
  setupFee?: SetupFeeCalculation;
  specialInstructions?: string;
  paymentMethod?: "card" | "subscription";
}

// Calendar availability
export interface AvailabilitySlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  max_bookings: number;
  current_bookings: number;
}

// Database types
export interface DatabaseBooking {
  id: string;
  user_id: string;
  order_id?: string;
  date_time: string;
  duration: number;
  add_ons: Record<string, any>;
  status: "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show";
  location_address: Record<string, any>;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
}
