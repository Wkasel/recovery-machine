// @ts-nocheck
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/utils/admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await requireAdminAccess(request, "operator");
    const supabase = await createServerSupabaseClient();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const active = searchParams.get("active");

    // Build query for email templates
    let query = supabase
      .from("email_templates")
      .select("*")
      .order("name", { ascending: true });

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    if (active !== null && active !== "all") {
      query = query.eq("active", active === "true");
    }

    const { data: templates, error } = await query;

    if (error) {
      console.error("Email templates query error:", error);
      return NextResponse.json({ error: "Failed to fetch email templates" }, { status: 500 });
    }

    return NextResponse.json({
      templates: templates || [],
      total: templates?.length || 0,
    });
  } catch (error) {
    console.error("Admin email templates error:", error);
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
      subject,
      html,
      text,
      variables,
      category,
      active,
    } = body;

    // Validate required fields
    if (!name || !subject || !html) {
      return NextResponse.json({ 
        error: "Name, subject, and HTML content are required" 
      }, { status: 400 });
    }

    const { data: template, error } = await supabase
      .from("email_templates")
      .insert({
        name,
        subject,
        html,
        text,
        variables: variables || [],
        category: category || "transactional",
        active: active !== false,
      })
      .select()
      .single();

    if (error) {
      console.error("Email template creation error:", error);
      return NextResponse.json({ error: "Failed to create email template" }, { status: 500 });
    }

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Email template creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}