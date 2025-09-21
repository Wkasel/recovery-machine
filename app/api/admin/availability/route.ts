import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/lib/utils/admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await requireAdminAccess(request, "operator");
    
    const url = new URL(request.url);
    const date = url.searchParams.get("date");
    
    const supabase = await createServerSupabaseClient();
    
    let query = supabase
      .from("availability_slots")
      .select("*")
      .order("date", { ascending: true })
      .order("start_time", { ascending: true });
    
    if (date) {
      query = query.eq("date", date);
    } else {
      // Get next 30 days if no date specified
      const today = new Date().toISOString().split('T')[0];
      const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      query = query.gte("date", today).lte("date", thirtyDaysLater);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching availability slots:", error);
      return NextResponse.json(
        { error: "Failed to fetch availability slots" },
        { status: 500 }
      );
    }

    return NextResponse.json({ slots: data || [] });
    
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdminAccess(request, "operator");
    
    const body = await request.json();
    const { id, is_available, max_bookings } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: "Slot ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    
    const updateData: any = {};
    if (typeof is_available === 'boolean') updateData.is_available = is_available;
    if (typeof max_bookings === 'number') updateData.max_bookings = max_bookings;
    
    const { data, error } = await supabase
      .from("availability_slots")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating availability slot:", error);
      return NextResponse.json(
        { error: "Failed to update availability slot" },
        { status: 500 }
      );
    }

    return NextResponse.json({ slot: data });
    
  } catch (error) {
    console.error("Error updating availability:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}