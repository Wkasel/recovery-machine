// @ts-nocheck
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/utils/admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    await requireAdminAccess(request, "operator");
    const supabase = await createServerSupabaseClient();

    const { data: template, error } = await supabase
      .from("email_templates")
      .select("*")
      .eq("id", params.templateId)
      .single();

    if (error) {
      console.error("Email template query error:", error);
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Email template get error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    await requireAdminAccess(request, "admin");
    const supabase = await createServerSupabaseClient();

    const body = await request.json();
    const {
      name,
      subject,
      html,
      text,
      variables,
      category,
      active,
    } = body;

    const { data: template, error } = await supabase
      .from("email_templates")
      .update({
        name,
        subject,
        html,
        text,
        variables: variables || [],
        category,
        active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.templateId)
      .select()
      .single();

    if (error) {
      console.error("Email template update error:", error);
      return NextResponse.json({ error: "Failed to update email template" }, { status: 500 });
    }

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Email template update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    await requireAdminAccess(request, "admin");
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("email_templates")
      .delete()
      .eq("id", params.templateId);

    if (error) {
      console.error("Email template deletion error:", error);
      return NextResponse.json({ error: "Failed to delete email template" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email template deletion error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}