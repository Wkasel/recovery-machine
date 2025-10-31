import { requireAdminAccess } from "@/lib/utils/admin/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// PATCH /api/admin/admins/[adminId] - Update admin status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { adminId: string } }
) {
  try {
    // Require super_admin role to update admins
    await requireAdminAccess(request, "super_admin");

    const supabase = await createServerSupabaseClient();
    const body = await request.json();
    const { is_active } = body;

    if (typeof is_active !== "boolean") {
      return NextResponse.json(
        { error: "is_active must be a boolean" },
        { status: 400 }
      );
    }

    // Check if trying to deactivate a super_admin
    const { data: admin } = await supabase
      .from("admins")
      .select("role")
      .eq("id", params.adminId)
      .single();

    if (admin?.role === "super_admin") {
      return NextResponse.json(
        { error: "Cannot deactivate super_admin users" },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from("admins")
      .update({
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.adminId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ admin: data });
  } catch (error) {
    console.error("Failed to update admin:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update admin" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/admins/[adminId] - Delete admin
export async function DELETE(
  request: NextRequest,
  { params }: { params: { adminId: string } }
) {
  try {
    // Require super_admin role to delete admins
    await requireAdminAccess(request, "super_admin");

    const supabase = await createServerSupabaseClient();

    // Check if trying to delete a super_admin
    const { data: admin } = await supabase
      .from("admins")
      .select("role")
      .eq("id", params.adminId)
      .single();

    if (admin?.role === "super_admin") {
      return NextResponse.json(
        { error: "Cannot delete super_admin users" },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from("admins")
      .delete()
      .eq("id", params.adminId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete admin:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete admin" },
      { status: 500 }
    );
  }
}
