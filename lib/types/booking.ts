import { z } from 'zod'

// Service types and pricing
export type ServiceType = 'cold_plunge' | 'infrared_sauna' | 'combo_package'

export interface ServiceOption {
  id: ServiceType
  name: string
  description: string
  duration: number // in minutes
  basePrice: number // in cents
  features: string[]
  popular?: boolean
}

export const services: ServiceOption[] = [
  {
    id: 'cold_plunge',
    name: 'Cold Plunge',
    description: '30-minute cold therapy session for recovery and wellness',
    duration: 30,
    basePrice: 8000, // $80.00
    features: ['30-minute session', 'Professional setup', 'Post-session consultation']
  },
  {
    id: 'infrared_sauna',
    name: 'Infrared Sauna',
    description: '30-minute infrared sauna session for detox and relaxation',
    duration: 30,
    basePrice: 7500, // $75.00
    features: ['30-minute session', 'Temperature control', 'Towels included']
  },
  {
    id: 'combo_package',
    name: 'Ultimate Recovery Combo',
    description: '60-minute session combining cold plunge and infrared sauna',
    duration: 60,
    basePrice: 12000, // $120.00
    features: ['Cold plunge session', 'Infrared sauna session', 'Extended recovery time', 'Professional guidance'],
    popular: true
  }
]

// Address validation schema
export const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code is required'),
  placeId: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional()
})

export type Address = z.infer<typeof addressSchema>

// Booking form schema
export const bookingFormSchema = z.object({
  serviceType: z.enum(['cold_plunge', 'infrared_sauna', 'combo_package']),
  dateTime: z.string().min(1, 'Date and time are required'),
  duration: z.number().min(30).max(120),
  address: addressSchema,
  addOns: z.object({
    extraVisits: z.number().min(0).max(5).default(0),
    familyMembers: z.number().min(0).max(4).default(0),
    extendedTime: z.number().min(0).max(30).default(0) // extra minutes
  }).default({}),
  specialInstructions: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms and conditions')
})

export type BookingFormData = z.infer<typeof bookingFormSchema>

// Setup fee calculation
export interface SetupFeeCalculation {
  baseSetupFee: number // in cents
  distanceFee: number // in cents
  totalSetupFee: number // in cents
  distance: number // in miles
  estimatedTravelTime: number // in minutes
}

// Booking step tracking
export type BookingStep = 'service' | 'address' | 'calendar' | 'payment' | 'confirmation'

export interface BookingState {
  currentStep: BookingStep
  serviceType?: ServiceType
  dateTime?: string
  address?: Address
  addOns?: {
    extraVisits: number
    familyMembers: number
    extendedTime: number
  }
  setupFee?: SetupFeeCalculation
  specialInstructions?: string
}

// Calendar availability
export interface AvailabilitySlot {
  id: string
  date: string
  start_time: string
  end_time: string
  is_available: boolean
  max_bookings: number
  current_bookings: number
}

// Database types
export interface DatabaseBooking {
  id: string
  user_id: string
  order_id?: string
  date_time: string
  duration: number
  add_ons: Record<string, any>
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  location_address: Record<string, any>
  special_instructions?: string
  created_at: string
  updated_at: string
}