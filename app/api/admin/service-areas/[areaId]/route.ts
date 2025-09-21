// @ts-nocheck
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/utils/admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { areaId: string } }
) {
  try {
    await requireAdminAccess(request, "admin");
    const supabase = await createServerSupabaseClient();

    const body = await request.json();
    const {
      name,
      description,
      zip_codes,
      cities,
      states,
      radius_miles,
      center_lat,
      center_lng,
      is_active,
      pricing_multiplier,
      travel_fee,
    } = body;

    const { data: serviceArea, error } = await supabase
      .from("service_areas")
      .update({
        name,
        description,
        zip_codes: zip_codes || [],
        cities: cities || [],
        states: states || [],
        radius_miles,
        center_lat,
        center_lng,
        is_active,
        pricing_multiplier,
        travel_fee,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.areaId)
      .select()
      .single();

    if (error) {
      console.error("Service area update error:", error);
      return NextResponse.json({ error: "Failed to update service area" }, { status: 500 });
    }

    return NextResponse.json({ service_area: serviceArea });
  } catch (error) {
    console.error("Service area update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { areaId: string } }
) {
  try {
    await requireAdminAccess(request, "admin");
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("service_areas")
      .delete()
      .eq("id", params.areaId);

    if (error) {
      console.error("Service area deletion error:", error);
      return NextResponse.json({ error: "Failed to delete service area" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Service area deletion error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}