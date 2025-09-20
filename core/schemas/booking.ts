import { z } from "zod";

export const createBookingSchema = z.object({
  date_time: z.string().datetime("Please select a valid date and time"),
  duration: z.number().min(30).max(120).default(30),
  add_ons: z
    .object({
      extra_visits: z.number().min(0).max(10).default(0),
      family_members: z.number().min(0).max(5).default(0),
      branded_towels: z.boolean().default(false),
      electrolytes: z.boolean().default(false),
    })
    .default({}),
  notes: z.string().max(500).optional(),
});

export const updateBookingSchema = z.object({
  id: z.string().uuid(),
  date_time: z.string().datetime().optional(),
  status: z.enum(["scheduled", "cancelled"]).optional(),
  notes: z.string().max(500).optional(),
});

export const bookingFilterSchema = z.object({
  status: z.enum(["scheduled", "cancelled", "all"]).default("all"),
  date_from: z.string().date().optional(),
  date_to: z.string().date().optional(),
  user_id: z.string().uuid().optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type BookingFilterInput = z.infer<typeof bookingFilterSchema>;
