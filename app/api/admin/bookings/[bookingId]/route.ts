// @ts-nocheck
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/utils/admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const admin = await requireAdminAccess(request, "operator");
    const supabase = await createServerSupabaseClient();
    const resolvedParams = await params;
    const bookingId = resolvedParams.bookingId;

    const { status, notes } = await request.json();

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    // Verify booking exists
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Update booking
    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        status,
        updated_at: new Date().toISOString(),
        ...(notes && { admin_notes: notes }),
      } as any)
      .eq("id", bookingId);

    if (updateError) {
      console.error("Booking update error:", updateError);
      return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
    }

    // Log the status change (you might want to create an audit table for this)
    console.log(
      `Booking ${bookingId} status changed from ${booking.status} to ${status} by admin ${admin.email}`
    );

    return NextResponse.json({
      success: true,
      message: "Booking updated successfully",
    });
  } catch (error) {
    console.error("Booking update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
