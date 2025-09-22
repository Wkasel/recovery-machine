// @ts-nocheck
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/utils/admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await requireAdminAccess(request, "admin"); // Require admin level for credit adjustments
    const resolvedParams = await params;
    const userId = resolvedParams.userId;
    const supabase = await createServerSupabaseClient();
    // userId already defined above

    const { amount, reason } = await request.json();

    if (!amount || !reason) {
      return NextResponse.json({ error: "Amount and reason are required" }, { status: 400 });
    }

    // Verify user exists
    const { data: user, error: userError } = await supabase
      .from("profiles")
      .select("id, credits")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if adjustment would result in negative credits
    if (user.credits + amount < 0) {
      return NextResponse.json(
        { error: "Insufficient credits for this adjustment" },
        { status: 400 }
      );
    }

    // Create credit transaction (this will automatically update user credits via trigger)
    const { data: transaction, error: transactionError } = await supabase
      .from("credit_transactions")
      .insert({
        user_id: userId,
        amount,
        transaction_type: "manual_adjustment",
        description: `${reason} (by admin)`,
      })
      .select()
      .single();

    if (transactionError) {
      console.error("Transaction creation error:", transactionError);
      return NextResponse.json({ error: "Failed to create credit transaction" }, { status: 500 });
    }

    // Get updated user data
    const { data: updatedUser } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .single();

    return NextResponse.json({
      success: true,
      transaction,
      new_balance: updatedUser?.credits || 0,
    });
  } catch (error) {
    console.error("Credit adjustment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
