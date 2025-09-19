// SMS Service - Twilio Integration for Booking Reminders
// Automated SMS notifications for Recovery Machine bookings

import { Twilio } from 'twilio';
import type { 
  Profile, 
  Booking,
  ApiResponse 
} from '@/lib/types/supabase';

// ===========================================================================
// CONFIGURATION & TYPES
// ===========================================================================

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const twilio = accountSid && authToken ? new Twilio(accountSid, authToken) : null;

export interface SMSTemplate {
  id: string;
  name: string;
  message: string;
  variables: string[];
  type: 'reminder' | 'confirmation' | 'update' | 'cancellation';
}

export interface SMSDeliveryStatus {
  messageId: string;
  status: 'queued' | 'sent' | 'delivered' | 'failed' | 'undelivered';
  errorCode?: string;
  errorMessage?: string;
  deliveredAt?: Date;
}

interface SMSContext {
  user: Partial<Profile>;
  booking?: Partial<Booking>;
  customData?: Record<string, any>;
}

// ===========================================================================
// SMS TEMPLATES
// ===========================================================================

const SMS_TEMPLATES = {
  BOOKING_REMINDER_24H: {
    id: 'booking-reminder-24h',
    name: '24 Hour Booking Reminder',
    type: 'reminder' as const,
    variables: ['firstName', 'date', 'time', 'address'],
    message: `Hi {{firstName}}! Your Recovery Machine session is tomorrow at {{time}} on {{date}}. We'll arrive at {{address}}. Reply STOP to opt out.`
  },

  BOOKING_REMINDER_2H: {
    id: 'booking-reminder-2h',
    name: '2 Hour Booking Reminder',
    type: 'reminder' as const,
    variables: ['firstName', 'time'],
    message: `{{firstName}}, your Recovery Machine session starts at {{time}} in 2 hours. Our therapist will call when arriving. Reply STOP to opt out.`
  },

  BOOKING_CONFIRMATION: {
    id: 'booking-confirmation',
    name: 'Booking Confirmation',
    type: 'confirmation' as const,
    variables: ['firstName', 'date', 'time'],
    message: `✅ Booking confirmed! Hi {{firstName}}, your Recovery Machine session is set for {{date}} at {{time}}. Check your email for details. Reply STOP to opt out.`
  },

  THERAPIST_ARRIVING: {
    id: 'therapist-arriving',
    name: 'Therapist Arriving',
    type: 'update' as const,
    variables: ['firstName', 'therapistName'],
    message: `🚗 {{therapistName}} is on the way for your Recovery Machine session, {{firstName}}! They'll arrive in 10-15 minutes. Reply STOP to opt out.`
  },

  BOOKING_CANCELLED: {
    id: 'booking-cancelled',
    name: 'Booking Cancelled',
    type: 'cancellation' as const,
    variables: ['firstName', 'date', 'time'],
    message: `Your Recovery Machine session on {{date}} at {{time}} has been cancelled, {{firstName}}. No charge applied. Book again anytime! Reply STOP to opt out.`
  },

  SESSION_COMPLETE: {
    id: 'session-complete',
    name: 'Session Complete',
    type: 'update' as const,
    variables: ['firstName'],
    message: `Thanks for your Recovery Machine session, {{firstName}}! 💪 How did it go? Leave a review and earn $10 credit: {{reviewUrl}} Reply STOP to opt out.`
  }
};

// ===========================================================================
// SMS SENDING FUNCTIONS
// ===========================================================================

export async function sendSMS(
  to: string,
  templateId: keyof typeof SMS_TEMPLATES,
  context: SMSContext,
  options?: {
    scheduledTime?: Date;
    trackDelivery?: boolean;
  }
): Promise<ApiResponse<{ messageId: string }>> {
  try {
    if (!twilio) {
      throw new Error('Twilio not configured. Check environment variables.');
    }

    if (!twilioPhoneNumber) {
      throw new Error('Twilio phone number not configured.');
    }

    // Validate phone number format
    const cleanPhone = cleanPhoneNumber(to);
    if (!isValidPhoneNumber(cleanPhone)) {
      throw new Error('Invalid phone number format');
    }

    const template = SMS_TEMPLATES[templateId];
    if (!template) {
      throw new Error(`SMS template ${templateId} not found`);
    }

    // Process template variables
    let message = template.message;

    const variables = {
      ...context.user,
      ...context.booking,
      ...context.customData,
      reviewUrl: `${process.env.NEXT_PUBLIC_APP_URL}/review`
    };

    // Replace template variables
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      message = message.replace(regex, String(value || ''));
    });

    // Send SMS
    const messageOptions: any = {
      body: message,
      from: twilioPhoneNumber,
      to: cleanPhone
    };

    if (options?.scheduledTime) {
      messageOptions.sendAt = options.scheduledTime;
    }

    const result = await twilio.messages.create(messageOptions);

    // Log SMS send
    await logSMSSent(templateId, to, result.sid);

    return {
      data: { messageId: result.sid },
      error: null,
      success: true
    };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to send SMS',
      success: false
    };
  }
}

// ===========================================================================
// AUTOMATED SMS WORKFLOWS
// ===========================================================================

export async function sendBookingConfirmationSMS(
  booking: Booking,
  profile: Profile
): Promise<ApiResponse<{ messageId: string }>> {
  if (!profile.phone) {
    return {
      data: null,
      error: 'No phone number available',
      success: false
    };
  }

  return sendSMS(
    profile.phone,
    'BOOKING_CONFIRMATION',
    {
      user: {
        firstName: extractFirstName(profile.email)
      },
      booking: {
        date: new Date(booking.date_time).toLocaleDateString(),
        time: new Date(booking.date_time).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }
    }
  );
}

export async function sendBookingReminderSMS(
  booking: Booking,
  profile: Profile,
  hoursBeforeBooking: number = 24
): Promise<ApiResponse<{ messageId: string }>> {
  if (!profile.phone) {
    return {
      data: null,
      error: 'No phone number available',
      success: false
    };
  }

  const templateId = hoursBeforeBooking === 24 ? 'BOOKING_REMINDER_24H' : 'BOOKING_REMINDER_2H';
  
  const context: SMSContext = {
    user: {
      firstName: extractFirstName(profile.email)
    },
    booking: {
      time: new Date(booking.date_time).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
  };

  if (hoursBeforeBooking === 24) {
    context.booking!.date = new Date(booking.date_time).toLocaleDateString();
    context.booking!.address = typeof booking.location_address === 'object' 
      ? formatAddress(booking.location_address as any)
      : String(booking.location_address);
  }

  return sendSMS(profile.phone, templateId, context);
}

export async function sendTherapistArrivingSMS(
  booking: Booking,
  profile: Profile,
  therapistName: string
): Promise<ApiResponse<{ messageId: string }>> {
  if (!profile.phone) {
    return {
      data: null,
      error: 'No phone number available',
      success: false
    };
  }

  return sendSMS(
    profile.phone,
    'THERAPIST_ARRIVING',
    {
      user: {
        firstName: extractFirstName(profile.email)
      },
      customData: {
        therapistName
      }
    }
  );
}

export async function sendBookingCancelledSMS(
  booking: Booking,
  profile: Profile
): Promise<ApiResponse<{ messageId: string }>> {
  if (!profile.phone) {
    return {
      data: null,
      error: 'No phone number available',
      success: false
    };
  }

  return sendSMS(
    profile.phone,
    'BOOKING_CANCELLED',
    {
      user: {
        firstName: extractFirstName(profile.email)
      },
      booking: {
        date: new Date(booking.date_time).toLocaleDateString(),
        time: new Date(booking.date_time).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }
    }
  );
}

export async function sendSessionCompleteSMS(
  booking: Booking,
  profile: Profile
): Promise<ApiResponse<{ messageId: string }>> {
  if (!profile.phone) {
    return {
      data: null,
      error: 'No phone number available',
      success: false
    };
  }

  return sendSMS(
    profile.phone,
    'SESSION_COMPLETE',
    {
      user: {
        firstName: extractFirstName(profile.email)
      },
      customData: {
        reviewUrl: `${process.env.NEXT_PUBLIC_APP_URL}/review?booking=${booking.id}`
      }
    }
  );
}

// ===========================================================================
// SMS DELIVERY TRACKING
// ===========================================================================

export async function getSMSDeliveryStatus(
  messageId: string
): Promise<ApiResponse<SMSDeliveryStatus>> {
  try {
    if (!twilio) {
      throw new Error('Twilio not configured');
    }

    const message = await twilio.messages(messageId).fetch();

    return {
      data: {
        messageId: message.sid,
        status: message.status as any,
        errorCode: message.errorCode || undefined,
        errorMessage: message.errorMessage || undefined,
        deliveredAt: message.dateUpdated || undefined
      },
      error: null,
      success: true
    };
  } catch (error) {
    console.error('Error fetching SMS delivery status:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch delivery status',
      success: false
    };
  }
}

export async function logSMSSent(
  templateId: string,
  recipient: string,
  messageId: string
): Promise<void> {
  try {
    // In a real implementation, you'd log this to your database
    console.log('SMS sent:', {
      templateId,
      recipient: maskPhoneNumber(recipient),
      messageId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error logging SMS send:', error);
  }
}

// ===========================================================================
// SCHEDULED SMS FUNCTIONS
// ===========================================================================

export async function scheduleBookingReminders(
  booking: Booking,
  profile: Profile
): Promise<ApiResponse<{ scheduledMessages: string[] }>> {
  const messageIds: string[] = [];
  const bookingTime = new Date(booking.date_time);
  
  try {
    // Schedule 24-hour reminder
    const reminder24h = new Date(bookingTime.getTime() - 24 * 60 * 60 * 1000);
    if (reminder24h > new Date()) {
      const result24h = await sendSMS(
        profile.phone!,
        'BOOKING_REMINDER_24H',
        {
          user: { firstName: extractFirstName(profile.email) },
          booking: {
            date: bookingTime.toLocaleDateString(),
            time: bookingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            address: typeof booking.location_address === 'object' 
              ? formatAddress(booking.location_address as any)
              : String(booking.location_address)
          }
        },
        { scheduledTime: reminder24h }
      );
      
      if (result24h.success && result24h.data) {
        messageIds.push(result24h.data.messageId);
      }
    }

    // Schedule 2-hour reminder
    const reminder2h = new Date(bookingTime.getTime() - 2 * 60 * 60 * 1000);
    if (reminder2h > new Date()) {
      const result2h = await sendSMS(
        profile.phone!,
        'BOOKING_REMINDER_2H',
        {
          user: { firstName: extractFirstName(profile.email) },
          booking: {
            time: bookingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        },
        { scheduledTime: reminder2h }
      );
      
      if (result2h.success && result2h.data) {
        messageIds.push(result2h.data.messageId);
      }
    }

    return {
      data: { scheduledMessages: messageIds },
      error: null,
      success: true
    };
  } catch (error) {
    console.error('Error scheduling booking reminders:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to schedule reminders',
      success: false
    };
  }
}

// ===========================================================================
// UTILITY FUNCTIONS
// ===========================================================================

function cleanPhoneNumber(phone: string): string {
  // Remove all non-numeric characters except +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // If no country code, assume US (+1)
  if (!cleaned.startsWith('+')) {
    if (cleaned.length === 10) {
      cleaned = '+1' + cleaned;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      cleaned = '+' + cleaned;
    }
  }
  
  return cleaned;
}

function isValidPhoneNumber(phone: string): boolean {
  // Basic validation for international phone numbers
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}

function maskPhoneNumber(phone: string): string {
  const cleaned = cleanPhoneNumber(phone);
  if (cleaned.length >= 8) {
    const visiblePart = cleaned.slice(-4);
    const maskedPart = '*'.repeat(cleaned.length - 4);
    return maskedPart + visiblePart;
  }
  return phone;
}

function extractFirstName(email: string): string {
  const localPart = email.split('@')[0];
  return localPart.split('.')[0].charAt(0).toUpperCase() + localPart.split('.')[0].slice(1);
}

function formatAddress(address: any): string {
  if (typeof address === 'string') return address;
  
  const parts = [
    address.street_number,
    address.route,
    address.locality,
    address.administrative_area_level_1
  ].filter(Boolean);
  
  return parts.join(' ');
}

// ===========================================================================
// TESTING & VALIDATION
// ===========================================================================

export async function testSMSDelivery(
  phone: string,
  templateId: keyof typeof SMS_TEMPLATES = 'BOOKING_CONFIRMATION'
): Promise<ApiResponse<{ messageId: string }>> {
  return sendSMS(
    phone,
    templateId,
    {
      user: {
        firstName: 'Test'
      },
      booking: {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
      },
      customData: {
        address: '123 Test St, Test City, TC'
      }
    }
  );
}

export function validateSMSTemplate(template: Partial<SMSTemplate>): string[] {
  const errors: string[] = [];
  
  if (!template.name) errors.push('Template name is required');
  if (!template.message) errors.push('Template message is required');
  if (!template.type) errors.push('Template type is required');
  if (template.message && template.message.length > 160) {
    errors.push('SMS message should be 160 characters or less for optimal delivery');
  }
  
  return errors;
}