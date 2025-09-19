import { z } from "zod";

export const createReferralSchema = z.object({
  invitee_email: z.string().email("Please enter a valid email"),
  message: z.string().max(300).optional(),
});

export const acceptReferralSchema = z.object({
  referral_code: z.string().min(6, "Invalid referral code"),
});

export type CreateReferralInput = z.infer<typeof createReferralSchema>;
export type AcceptReferralInput = z.infer<typeof acceptReferralSchema>;