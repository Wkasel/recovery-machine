// Simple analytics types for Recovery Machine

export type EventName =
  | "auth_success"
  | "booking_started"
  | "booking_completed"
  | "referral_sent"
  | "review_submitted"
  | "profile_updated";

export interface Event {
  name: EventName;
  properties?: Record<string, any>;
  timestamp?: string;
}

// Simple event tracking function that can be expanded later
export function trackEvent(event: Event) {
  // For now, just log to console - can integrate with analytics later
  console.log("Analytics Event:", event);
}
