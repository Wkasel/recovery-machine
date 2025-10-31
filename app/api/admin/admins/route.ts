import { requireAdminAccess } from "@/lib/utils/admin/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/admins - List all admins
export async function GET(request: NextRequest) {
  try {
    // Require at least admin role to view admins
    await requireAdminAccess(request, "admin");

    const supabase = await createServerSupabaseClient();

    const { data: admins, error } = await supabase
      .from("admins")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ admins });
  } catch (error) {
    console.error("Failed to fetch admins:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch admins" },
      { status: 500 }
    );
  }
}

// POST /api/admin/admins - Create new admin
export async function POST(request: NextRequest) {
  try {
    // Require super_admin role to create admins
    await requireAdminAccess(request, "super_admin");

    const supabase = await createServerSupabaseClient();
    const body = await request.json();
    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      );
    }

    // Only allow creating admin or operator roles (not super_admin)
    if (!["admin", "operator"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Only 'admin' or 'operator' can be created" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("admins")
      .insert({
        email,
        role,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ admin: data });
  } catch (error) {
    console.error("Failed to create admin:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create admin" },
      { status: 500 }
    );
  }
}
