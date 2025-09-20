// @ts-nocheck
// SMS Send API Route
// Handles SMS notifications with Twilio integration

import {
  getSMSDeliveryStatus,
  scheduleBookingReminders,
  sendSMS,
  testSMSDelivery,
} from "@/lib/services/sms";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, to, templateId, context, booking_id, options = {} } = body;

    // Check if user has SMS permissions (admin or booking owner)
    if (action !== "test") {
      let hasPermission = false;

      // Check if user is admin
      const { data: admin } = await supabase
        .from("admins")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .single();

      if (admin) {
        hasPermission = true;
      } else if (booking_id) {
        // Check if user owns the booking
        const { data: booking } = await supabase
          .from("bookings")
          .select("user_id")
          .eq("id", booking_id)
          .eq("user_id", user.id)
          .single();

        if (booking) {
          hasPermission = true;
        }
      }

      if (!hasPermission) {
        return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
      }
    }

    switch (action) {
      case "send":
        if (!to || !templateId) {
          return NextResponse.json(
            { error: "Missing required fields: to, templateId" },
            { status: 400 }
          );
        }

        const result = await sendSMS(to, templateId, context, options);

        return NextResponse.json({
          success: result.success,
          data: result.data,
          error: result.error,
        });

      case "schedule-reminders":
        if (!booking_id) {
          return NextResponse.json(
            { error: "Booking ID required for scheduling reminders" },
            { status: 400 }
          );
        }

        // Get booking and user details
        const { data: bookingData, error: bookingError } = await supabase
          .from("bookings")
          .select(
            `
            *,
            profiles:user_id (*)
          `
          )
          .eq("id", booking_id)
          .single();

        if (bookingError || !bookingData) {
          return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        if (!bookingData.profiles?.phone) {
          return NextResponse.json(
            { error: "No phone number available for this booking" },
            { status: 400 }
          );
        }

        const scheduleResult = await scheduleBookingReminders(bookingData, bookingData.profiles);

        return NextResponse.json({
          success: scheduleResult.success,
          data: scheduleResult.data,
          error: scheduleResult.error,
        });

      case "test":
        const phone = body.phone;
        const testTemplate = body.template || "BOOKING_CONFIRMATION";

        if (!phone) {
          return NextResponse.json({ error: "Phone number required for test" }, { status: 400 });
        }

        const testResult = await testSMSDelivery(phone, testTemplate);

        return NextResponse.json({
          success: testResult.success,
          data: testResult.data,
          error: testResult.error,
        });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in SMS send API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const messageId = searchParams.get("message_id");

    if (action === "delivery-status") {
      if (!messageId) {
        return NextResponse.json(
          { error: "Message ID required for delivery status" },
          { status: 400 }
        );
      }

      const result = await getSMSDeliveryStatus(messageId);

      return NextResponse.json({
        success: result.success,
        data: result.data,
        error: result.error,
      });
    }

    if (action === "templates") {
      const templates = [
        { id: "BOOKING_CONFIRMATION", name: "Booking Confirmation", type: "confirmation" },
        { id: "BOOKING_REMINDER_24H", name: "24 Hour Reminder", type: "reminder" },
        { id: "BOOKING_REMINDER_2H", name: "2 Hour Reminder", type: "reminder" },
        { id: "THERAPIST_ARRIVING", name: "Therapist Arriving", type: "update" },
        { id: "BOOKING_CANCELLED", name: "Booking Cancelled", type: "cancellation" },
        { id: "SESSION_COMPLETE", name: "Session Complete", type: "update" },
      ];

      return NextResponse.json({
        success: true,
        data: templates,
      });
    }

    return NextResponse.json({ error: "Invalid action parameter" }, { status: 400 });
  } catch (error) {
    console.error("Error in SMS API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
