// @ts-nocheck
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/utils/admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await requireAdminAccess(request, "operator");
    const supabase = await createServerSupabaseClient();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");
    const active = searchParams.get("active");

    // Build query for service areas
    let query = supabase
      .from("service_areas")
      .select("*")
      .order("name", { ascending: true })
      .range(offset, offset + limit - 1);

    if (active !== null && active !== "all") {
      query = query.eq("is_active", active === "true");
    }

    const { data: serviceAreas, error } = await query;

    if (error) {
      console.error("Service areas query error:", error);
      return NextResponse.json({ error: "Failed to fetch service areas" }, { status: 500 });
    }

    return NextResponse.json({
      service_areas: serviceAreas || [],
      total: serviceAreas?.length || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Admin service areas error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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
      .insert({
        name,
        description,
        zip_codes: zip_codes || [],
        cities: cities || [],
        states: states || [],
        radius_miles,
        center_lat,
        center_lng,
        is_active: is_active !== false,
        pricing_multiplier: pricing_multiplier || 1.0,
        travel_fee: travel_fee || 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Service area creation error:", error);
      return NextResponse.json({ error: "Failed to create service area" }, { status: 500 });
    }

    return NextResponse.json({ service_area: serviceArea });
  } catch (error) {
    console.error("Service area creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}