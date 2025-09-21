import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/lib/admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await requireAdminAccess(request, "operator");
    
    const body = await request.json();
    const { startDate, endDate } = body;
    
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Start date and end date are required" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const slots = [];
    
    // Generate slots for each day between startDate and endDate
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      
      // Generate slots from 8 AM to 8 PM, 2-hour intervals
      for (let hour = 8; hour < 20; hour += 2) {
        slots.push({
          date: dateStr,
          start_time: `${hour.toString().padStart(2, "0")}:00:00`,
          end_time: `${(hour + 2).toString().padStart(2, "0")}:00:00`,
          is_available: true,
          max_bookings: 1,
        });
      }
    }

    // Insert all slots
    const { data, error } = await supabase
      .from("availability_slots")
      .insert(slots)
      .select();

    if (error) {
      console.error("Error inserting availability slots:", error);
      return NextResponse.json(
        { error: "Failed to generate availability slots" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Generated ${data.length} availability slots`,
      slots: data.length
    });
    
  } catch (error) {
    console.error("Error generating availability:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}