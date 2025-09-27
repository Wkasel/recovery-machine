import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, source = "website", metadata = {} } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    // Try to insert the email subscription
    const { data, error } = await supabase
      .from("newsletter_subscriptions")
      .insert({
        email: email.toLowerCase().trim(),
        source,
        metadata,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      // Check if it's a unique constraint violation (email already exists)
      if (error.code === "23505") {
        return NextResponse.json(
          { message: "Email already subscribed", alreadySubscribed: true },
          { status: 200 }
        );
      }

      console.error("Newsletter subscription error:", error);
      return NextResponse.json({ error: "Failed to subscribe to newsletter" }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "Successfully subscribed to newsletter",
        subscription: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
