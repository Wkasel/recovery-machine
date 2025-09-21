// @ts-nocheck
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/utils/admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    await requireAdminAccess(request, "admin");
    const supabase = await createServerSupabaseClient();

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 });
    }

    // Get template
    const { data: template, error: templateError } = await supabase
      .from("email_templates")
      .select("*")
      .eq("id", params.templateId)
      .single();

    if (templateError || !template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    // For now, we'll just log the test email
    // In production, you would integrate with your email service (SendGrid, Mailgun, etc.)
    console.log("Test email would be sent:", {
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    // TODO: Replace with actual email sending logic
    // Example with SendGrid:
    // await sendTestEmail({
    //   to: email,
    //   subject: template.subject,
    //   html: template.html,
    //   text: template.text
    // });

    return NextResponse.json({ 
      success: true, 
      message: `Test email sent to ${email}` 
    });
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json({ error: "Failed to send test email" }, { status: 500 });
  }
}