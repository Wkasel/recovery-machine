// Email Service - Resend Integration with Template Management
// Comprehensive email system for Recovery Machine with automated workflows

import type { ApiResponse, Booking, Profile, Referral, Review } from "@/lib/types/supabase";
import { Resend } from "resend";

// ===========================================================================
// CONFIGURATION & TYPES
// ===========================================================================

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailPreferences {
  marketing: boolean;
  booking_reminders: boolean;
  booking_confirmations: boolean;
  referral_notifications: boolean;
  review_requests: boolean;
  newsletter: boolean;
  sms_notifications: boolean;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html: string;
  text?: string;
  variables: string[];
  category: "transactional" | "marketing" | "notification";
  active: boolean;
}

export interface EmailAnalytics {
  template_id: string;
  sent_count: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  bounced_count: number;
  unsubscribed_count: number;
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
}

interface EmailContext {
  user: Partial<Profile>;
  booking?: Partial<Booking>;
  referral?: Partial<Referral>;
  review?: Partial<Review>;
  customData?: Record<string, any>;
}

// ===========================================================================
// EMAIL TEMPLATES
// ===========================================================================

const EMAIL_TEMPLATES = {
  // Welcome Series
  WELCOME_NEW_USER: {
    id: "welcome-new-user",
    name: "Welcome New User",
    subject: "Welcome to Recovery Machine! 🎉",
    category: "transactional" as const,
    variables: ["firstName", "referralCode"],
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1f2937;">Welcome to Recovery Machine, {{firstName}}!</h1>
        
        <p>We're thrilled to have you join our community of wellness enthusiasts. Recovery Machine brings professional-grade recovery therapy directly to your door.</p>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Your Referral Code: <strong>{{referralCode}}</strong></h3>
          <p>Share this code with friends and earn $50 in credits for each successful referral!</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{siteUrl}}/book" style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Book Your First Session</a>
        </div>
        
        <p>Have questions? Reply to this email or visit our FAQ section.</p>
        
        <p>Best regards,<br>The Recovery Machine Team</p>
      </div>
    `,
  },

  // Booking Confirmations
  BOOKING_CONFIRMATION: {
    id: "booking-confirmation",
    name: "Booking Confirmation",
    subject: "Your Recovery Session is Confirmed! 🗓️",
    category: "transactional" as const,
    variables: ["firstName", "bookingDate", "bookingTime", "address", "duration", "addOns"],
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1f2937;">Session Confirmed, {{firstName}}!</h1>
        
        <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #059669; margin-top: 0;">📅 Session Details</h3>
          <p><strong>Date:</strong> {{bookingDate}}</p>
          <p><strong>Time:</strong> {{bookingTime}}</p>
          <p><strong>Duration:</strong> {{duration}} minutes</p>
          <p><strong>Location:</strong> {{address}}</p>
          {{#if addOns}}
          <p><strong>Add-ons:</strong> {{addOns}}</p>
          {{/if}}
        </div>
        
        <h3 style="color: #1f2937;">What to Expect</h3>
        <ul>
          <li>Our certified therapist will arrive 10 minutes early to set up</li>
          <li>All equipment is sanitized and professional-grade</li>
          <li>Wear comfortable clothing you can move in</li>
          <li>Have a clean, flat space ready (bedroom, living room, etc.)</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{siteUrl}}/dashboard/bookings" style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">View Booking Details</a>
        </div>
        
        <p>Need to reschedule? You can modify your booking up to 4 hours before your session.</p>
        
        <p>Best regards,<br>The Recovery Machine Team</p>
      </div>
    `,
  },

  // Booking Reminders
  BOOKING_REMINDER_24H: {
    id: "booking-reminder-24h",
    name: "24 Hour Booking Reminder",
    subject: "Your Recovery Session is Tomorrow! 🔔",
    category: "notification" as const,
    variables: ["firstName", "bookingDate", "bookingTime", "address"],
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1f2937;">Tomorrow's Session Reminder</h1>
        
        <p>Hi {{firstName}},</p>
        
        <p>Just a friendly reminder that your recovery session is scheduled for <strong>tomorrow</strong>!</p>
        
        <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #92400e; margin-top: 0;">⏰ Session Tomorrow</h3>
          <p><strong>Date:</strong> {{bookingDate}}</p>
          <p><strong>Time:</strong> {{bookingTime}}</p>
          <p><strong>Location:</strong> {{address}}</p>
        </div>
        
        <h3 style="color: #1f2937;">Pre-Session Checklist</h3>
        <ul>
          <li>✅ Clear a flat space for the session</li>
          <li>✅ Wear comfortable, moveable clothing</li>
          <li>✅ Stay hydrated before and after</li>
          <li>✅ Have your phone accessible for our therapist's arrival call</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{siteUrl}}/dashboard/bookings" style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Manage Booking</a>
        </div>
        
        <p>Questions? Reply to this email and we'll be happy to help.</p>
        
        <p>See you tomorrow!<br>The Recovery Machine Team</p>
      </div>
    `,
  },

  // Referral Invitations
  REFERRAL_INVITATION: {
    id: "referral-invitation",
    name: "Referral Invitation",
    subject: "{{referrerName}} wants to share Recovery Machine with you! 💪",
    category: "marketing" as const,
    variables: ["referrerName", "referrerCode", "inviteeEmail"],
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1f2937;">{{referrerName}} thinks you'd love Recovery Machine!</h1>
        
        <p>Hi there,</p>
        
        <p>{{referrerName}} has invited you to try Recovery Machine - professional recovery therapy delivered to your door.</p>
        
        <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #059669; margin-top: 0;">🎁 Special Invitation</h3>
          <p>Use code <strong>{{referrerCode}}</strong> and get:</p>
          <ul>
            <li>$25 off your first session</li>
            <li>Free consultation with our certified therapist</li>
            <li>No setup fees</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{siteUrl}}/sign-up?ref={{referrerCode}}" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Claim Your Discount</a>
        </div>
        
        <h3 style="color: #1f2937;">What is Recovery Machine?</h3>
        <p>We bring professional-grade recovery equipment directly to your home:</p>
        <ul>
          <li>🔥 Theragun percussion therapy</li>
          <li>❄️ Normatec compression therapy</li>
          <li>🧘 Guided stretching and mobility</li>
          <li>💪 Custom recovery plans</li>
        </ul>
        
        <p>Join thousands of satisfied customers who've made recovery a priority.</p>
        
        <p>Best regards,<br>The Recovery Machine Team</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 12px; color: #6b7280;">This invitation was sent to {{inviteeEmail}} by {{referrerName}}. If you don't want to receive these emails, you can <a href="{{unsubscribeUrl}}">unsubscribe</a>.</p>
      </div>
    `,
  },

  // Review Requests
  REVIEW_REQUEST: {
    id: "review-request",
    name: "Review Request",
    subject: "How was your Recovery Machine session? ⭐",
    category: "notification" as const,
    variables: ["firstName", "bookingDate", "therapistName"],
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1f2937;">How was your session, {{firstName}}?</h1>
        
        <p>We hope you had an amazing recovery session on {{bookingDate}}{{#if therapistName}} with {{therapistName}}{{/if}}!</p>
        
        <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #92400e; margin-top: 0;">⭐ Share Your Experience</h3>
          <p>Your feedback helps us improve and helps other wellness enthusiasts discover Recovery Machine.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{siteUrl}}/review?booking={{bookingId}}" style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Leave a Review</a>
        </div>
        
        <p>As a thank you for your review, we'll add <strong>$10 in credits</strong> to your account!</p>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="{{siteUrl}}/book" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Book Your Next Session</a>
        </div>
        
        <p>Thanks for choosing Recovery Machine!</p>
        
        <p>Best regards,<br>The Recovery Machine Team</p>
      </div>
    `,
  },

  // Newsletter Template
  NEWSLETTER: {
    id: "newsletter",
    name: "Newsletter",
    subject: "Recovery Tips & Updates from Recovery Machine 📰",
    category: "marketing" as const,
    variables: ["firstName", "content", "featuredTip"],
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1f2937;">Recovery Machine Newsletter</h1>

        <p>Hi {{firstName}},</p>

        <p>Welcome to your weekly dose of recovery tips, success stories, and updates from the Recovery Machine community!</p>

        <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #059669; margin-top: 0;">💡 Featured Recovery Tip</h3>
          <p>{{featuredTip}}</p>
        </div>

        <div>
          {{content}}
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="{{siteUrl}}/book" style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Book a Session</a>
        </div>

        <p>Keep recovering strong!</p>

        <p>Best regards,<br>The Recovery Machine Team</p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 12px; color: #6b7280;">You're receiving this because you subscribed to Recovery Machine updates. <a href="{{unsubscribeUrl}}">Unsubscribe</a> | <a href="{{preferencesUrl}}">Update Preferences</a></p>
      </div>
    `,
  },

  // Booking Cancellation
  BOOKING_CANCELLATION: {
    id: "booking-cancellation",
    name: "Booking Cancellation",
    subject: "Your Recovery Session Has Been Cancelled",
    category: "transactional" as const,
    variables: ["firstName", "bookingDate", "bookingTime", "cancellationReason", "refundAmount"],
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1f2937;">Session Cancelled</h1>

        <p>Hi {{firstName}},</p>

        <p>Your Recovery Machine session scheduled for <strong>{{bookingDate}}</strong> at <strong>{{bookingTime}}</strong> has been cancelled.</p>

        <div style="background: #fef2f2; border: 1px solid #ef4444; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #991b1b; margin-top: 0;">Cancellation Details</h3>
          <p><strong>Date:</strong> {{bookingDate}}</p>
          <p><strong>Time:</strong> {{bookingTime}}</p>
          {{#if cancellationReason}}<p><strong>Reason:</strong> {{cancellationReason}}</p>{{/if}}
          {{#if refundAmount}}<p><strong>Refund Amount:</strong> ` + '$' + `{{refundAmount}}</p>{{/if}}
        </div>

        {{#if refundAmount}}
        <p>Your refund of <strong>` + '$' + `{{refundAmount}}</strong> will be processed within 5-7 business days to your original payment method.</p>
        {{/if}}

        <div style="text-align: center; margin: 30px 0;">
          <a href="{{siteUrl}}/book" style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Book Another Session</a>
        </div>

        <p>We're sorry we couldn't accommodate you this time. We hope to see you again soon!</p>

        <p>If you have any questions about this cancellation, please don't hesitate to contact us.</p>

        <p>Best regards,<br>The Recovery Machine Team</p>
      </div>
    `,
  },

  // Booking Rescheduling
  BOOKING_RESCHEDULED: {
    id: "booking-rescheduled",
    name: "Booking Rescheduled",
    subject: "Your Recovery Session Has Been Rescheduled 📅",
    category: "transactional" as const,
    variables: ["firstName", "oldDate", "oldTime", "newDate", "newTime", "address"],
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1f2937;">Session Rescheduled, {{firstName}}!</h1>

        <p>Your Recovery Machine session has been successfully rescheduled.</p>

        <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #92400e; margin-top: 0;">📅 Schedule Update</h3>
          <div style="margin: 15px 0;">
            <p style="margin: 5px 0;"><strong>Previous Date:</strong> <span style="text-decoration: line-through;">{{oldDate}} at {{oldTime}}</span></p>
            <p style="margin: 5px 0; color: #059669;"><strong>New Date:</strong> {{newDate}} at {{newTime}}</p>
          </div>
          <p style="margin: 10px 0 0 0;"><strong>Location:</strong> {{address}}</p>
        </div>

        <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #059669; margin-top: 0;">✅ You're All Set!</h3>
          <p style="margin: 5px 0;">Our recovery specialist will arrive at your location on {{newDate}}.</p>
          <p style="margin: 5px 0;">You'll receive a reminder 24 hours before your session.</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="{{siteUrl}}/dashboard/bookings" style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">View Booking Details</a>
        </div>

        <p>Need to make another change? You can reschedule or cancel up to 24 hours before your session.</p>

        <p>Looking forward to seeing you!</p>

        <p>Best regards,<br>The Recovery Machine Team</p>
      </div>
    `,
  },
};

// ===========================================================================
// EMAIL SENDING FUNCTIONS
// ===========================================================================

export async function sendEmail(
  to: string | string[],
  templateId: keyof typeof EMAIL_TEMPLATES,
  context: EmailContext,
  options?: {
    from?: string;
    replyTo?: string;
    tags?: string[];
    headers?: Record<string, string>;
  }
): Promise<ApiResponse<{ id: string }>> {
  try {
    const template = EMAIL_TEMPLATES[templateId];
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    // Process template variables
    let subject = template.subject;
    let html = template.html;

    // Replace template variables
    const variables = {
      ...context.user,
      ...context.booking,
      ...context.referral,
      ...context.review,
      ...context.customData,
      siteUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      unsubscribeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe`,
      preferencesUrl: `${process.env.NEXT_PUBLIC_APP_URL}/preferences`,
    };

    // Simple template replacement (in production, use a proper template engine)
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      subject = subject.replace(regex, String(value || ""));
      html = html.replace(regex, String(value || ""));
    });

    const emailData = {
      from: options?.from || process.env.FROM_EMAIL || "noreply@recoverymachine.com",
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      replyTo: options?.replyTo,
      tags: options?.tags || [template.category, templateId],
      headers: options?.headers,
    };

    const result = await resend.emails.send(emailData);

    // Log email send for analytics
    await logEmailSent(templateId, to, result.data?.id || "");

    return {
      data: { id: result.data?.id || "" },
      error: null,
      success: true,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to send email",
      success: false,
    };
  }
}

// ===========================================================================
// AUTOMATED EMAIL WORKFLOWS
// ===========================================================================

export async function sendWelcomeEmail(profile: Profile): Promise<ApiResponse<{ id: string }>> {
  return sendEmail(
    profile.email,
    "WELCOME_NEW_USER",
    {
      user: {
        firstName: extractFirstName(profile.email),
        referralCode: profile.referral_code,
      },
    },
    {
      tags: ["welcome", "onboarding"],
    }
  );
}

export async function sendBookingConfirmation(
  booking: Booking,
  profile: Profile
): Promise<ApiResponse<{ id: string }>> {
  const addOnsText =
    booking.add_ons && typeof booking.add_ons === "object"
      ? Object.entries(booking.add_ons)
          .filter(([, value]) => value)
          .map(([key]) => key.replace("_", " "))
          .join(", ")
      : "";

  return sendEmail(
    profile.email,
    "BOOKING_CONFIRMATION",
    {
      user: {
        firstName: extractFirstName(profile.email),
      },
      booking: {
        bookingDate: new Date(booking.date_time).toLocaleDateString(),
        bookingTime: new Date(booking.date_time).toLocaleTimeString(),
        duration: booking.duration,
        address:
          typeof booking.location_address === "object"
            ? JSON.stringify(booking.location_address)
            : booking.location_address,
        addOns: addOnsText,
      },
      customData: {
        bookingId: booking.id,
      },
    },
    {
      tags: ["booking", "confirmation"],
    }
  );
}

export async function sendBookingReminder(
  booking: Booking,
  profile: Profile,
  hoursBeforeBooking: number = 24
): Promise<ApiResponse<{ id: string }>> {
  const templateId = hoursBeforeBooking === 24 ? "BOOKING_REMINDER_24H" : "BOOKING_REMINDER_24H";

  return sendEmail(
    profile.email,
    templateId,
    {
      user: {
        firstName: extractFirstName(profile.email),
      },
      booking: {
        bookingDate: new Date(booking.date_time).toLocaleDateString(),
        bookingTime: new Date(booking.date_time).toLocaleTimeString(),
        address:
          typeof booking.location_address === "object"
            ? JSON.stringify(booking.location_address)
            : booking.location_address,
      },
    },
    {
      tags: ["booking", "reminder", `${hoursBeforeBooking}h`],
    }
  );
}

export async function sendReferralInvitation(
  referral: Referral,
  referrerProfile: Profile
): Promise<ApiResponse<{ id: string }>> {
  return sendEmail(
    referral.invitee_email,
    "REFERRAL_INVITATION",
    {
      referral: {
        referrerName: extractFirstName(referrerProfile.email),
        referrerCode: referrerProfile.referral_code,
        inviteeEmail: referral.invitee_email,
      },
    },
    {
      tags: ["referral", "invitation"],
    }
  );
}

export async function sendReviewRequest(
  booking: Booking,
  profile: Profile,
  therapistName?: string
): Promise<ApiResponse<{ id: string }>> {
  return sendEmail(
    profile.email,
    "REVIEW_REQUEST",
    {
      user: {
        firstName: extractFirstName(profile.email),
      },
      booking: {
        bookingDate: new Date(booking.date_time).toLocaleDateString(),
        therapistName,
      },
      customData: {
        bookingId: booking.id,
      },
    },
    {
      tags: ["review", "request"],
    }
  );
}

export async function sendNewsletter(
  emails: string[],
  content: string,
  featuredTip: string,
  subject?: string
): Promise<ApiResponse<{ ids: string[] }>> {
  const results = await Promise.all(
    emails.map(async (email) =>
      sendEmail(
        email,
        "NEWSLETTER",
        {
          user: {
            firstName: extractFirstName(email),
          },
          customData: {
            content,
            featuredTip,
          },
        },
        {
          tags: ["newsletter", "marketing"],
        }
      )
    )
  );

  const successfulIds = results
    .filter((result) => result.success)
    .map((result) => result.data?.id || "");

  return {
    data: { ids: successfulIds },
    error: null,
    success: successfulIds.length > 0,
  };
}

export async function sendBookingCancellation(
  booking: Booking,
  profile: Profile,
  cancellationReason?: string,
  refundAmount?: number
): Promise<ApiResponse<{ id: string }>> {
  return sendEmail(
    profile.email,
    "BOOKING_CANCELLATION",
    {
      user: {
        firstName: extractFirstName(profile.email),
      },
      booking: {
        bookingDate: new Date(booking.date_time).toLocaleDateString(),
        bookingTime: new Date(booking.date_time).toLocaleTimeString(),
        cancellationReason,
        refundAmount: refundAmount ? (refundAmount / 100).toFixed(2) : undefined,
      },
      customData: {
        bookingId: booking.id,
      },
    },
    {
      tags: ["booking", "cancellation"],
    }
  );
}

export async function sendBookingRescheduled(
  booking: Booking,
  profile: Profile,
  oldDateTime: Date,
  newDateTime: Date
): Promise<ApiResponse<{ id: string }>> {
  const address =
    typeof booking.location_address === "object"
      ? JSON.stringify(booking.location_address)
      : booking.location_address;

  return sendEmail(
    profile.email,
    "BOOKING_RESCHEDULED",
    {
      user: {
        firstName: extractFirstName(profile.email),
      },
      booking: {
        oldDate: oldDateTime.toLocaleDateString(),
        oldTime: oldDateTime.toLocaleTimeString(),
        newDate: newDateTime.toLocaleDateString(),
        newTime: newDateTime.toLocaleTimeString(),
        address,
      },
      customData: {
        bookingId: booking.id,
      },
    },
    {
      tags: ["booking", "rescheduled"],
    }
  );
}

// ===========================================================================
// EMAIL ANALYTICS & TRACKING
// ===========================================================================

export async function logEmailSent(
  templateId: string,
  recipients: string | string[],
  emailId: string
): Promise<void> {
  try {
    // In a real implementation, you'd log this to your database
    console.log("Email sent:", {
      templateId,
      recipients: Array.isArray(recipients) ? recipients : [recipients],
      emailId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error logging email send:", error);
  }
}

export async function getEmailAnalytics(
  templateId?: string,
  dateRange?: { from: Date; to: Date }
): Promise<ApiResponse<EmailAnalytics[]>> {
  try {
    // In a real implementation, you'd fetch this from your database
    // This is a mock response
    const mockAnalytics: EmailAnalytics[] = [
      {
        template_id: "WELCOME_NEW_USER",
        sent_count: 150,
        delivered_count: 148,
        opened_count: 95,
        clicked_count: 12,
        bounced_count: 2,
        unsubscribed_count: 1,
        delivery_rate: 98.7,
        open_rate: 64.2,
        click_rate: 12.6,
      },
    ];

    return {
      data: mockAnalytics.filter(
        (analytics) => !templateId || analytics.template_id === templateId
      ),
      error: null,
      success: true,
    };
  } catch (error) {
    console.error("Error fetching email analytics:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch analytics",
      success: false,
    };
  }
}

// ===========================================================================
// UTILITY FUNCTIONS
// ===========================================================================

function extractFirstName(email: string): string {
  const localPart = email.split("@")[0];
  return localPart.split(".")[0].charAt(0).toUpperCase() + localPart.split(".")[0].slice(1);
}

export function validateEmailTemplate(template: Partial<EmailTemplate>): string[] {
  const errors: string[] = [];

  if (!template.name) errors.push("Template name is required");
  if (!template.subject) errors.push("Template subject is required");
  if (!template.html) errors.push("Template HTML is required");
  if (!template.category) errors.push("Template category is required");

  return errors;
}

export async function testEmailDelivery(
  email: string,
  templateId: keyof typeof EMAIL_TEMPLATES = "WELCOME_NEW_USER"
): Promise<ApiResponse<{ id: string }>> {
  return sendEmail(
    email,
    templateId,
    {
      user: {
        firstName: "Test",
        referralCode: "TEST123",
      },
      customData: {
        bookingDate: new Date().toLocaleDateString(),
        bookingTime: new Date().toLocaleTimeString(),
      },
    },
    {
      tags: ["test", "delivery-test"],
    }
  );
}
