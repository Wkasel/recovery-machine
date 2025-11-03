"use client";

import { notFound, redirect, useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import BookingPage from "../page";

const VALID_STEPS = ["service", "address", "calendar", "payment", "confirmation"] as const;
type ValidStep = typeof VALID_STEPS[number];

/**
 * Stateful booking URL structure: /book/[step]
 *
 * This provides better UX with:
 * - ✅ Browser back button works naturally
 * - ✅ Deep linking (users can bookmark specific steps)
 * - ✅ Better analytics (track drop-off by step)
 * - ✅ Shareable progress
 * - ✅ Resume on refresh
 */
export default function BookingStepPage() {
  const params = useParams();
  const router = useRouter();
  const step = params?.step as string;

  useEffect(() => {
    // Validate step parameter
    if (!step || !VALID_STEPS.includes(step as ValidStep)) {
      // Invalid step - redirect to start of flow
      router.replace("/book/service");
    }
  }, [step, router]);

  // Show 404 for invalid steps before redirect completes
  if (!step || !VALID_STEPS.includes(step as ValidStep)) {
    notFound();
  }

  // Render the booking page with URL-based step
  return <BookingPage initialStep={step as ValidStep} useUrlNavigation />;
}
