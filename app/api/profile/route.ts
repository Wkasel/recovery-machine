import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function generateReferralCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user profile data
    const { data: profileData, error: profileError } = await supabase
      .from("users")
      .select("credits, referral_code, address, phone")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);

      // If user doesn't exist in users table, create referral code
      const referralCode = generateReferralCode();

      // Try to update user with referral code
      const { data: updatedData, error: updateError } = await supabase
        .from("users")
        .update({ referral_code: referralCode })
        .eq("id", user.id)
        .select("credits, referral_code, address, phone")
        .single();

      if (updateError) {
        // Return default values if update fails
        return NextResponse.json({
          credits: 0,
          referral_code: referralCode,
          address: null,
          phone: "",
        });
      }

      return NextResponse.json(updatedData);
    }

    // If profile exists but missing referral code, generate one
    if (!profileData.referral_code) {
      const referralCode = generateReferralCode();

      const { data: updatedData, error: updateError } = await supabase
        .from("users")
        .update({ referral_code: referralCode })
        .eq("id", user.id)
        .select("credits, referral_code, address, phone")
        .single();

      if (!updateError && updatedData) {
        return NextResponse.json(updatedData);
      }
    }

    return NextResponse.json(profileData);
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await request.json();

    // Update user profile
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
