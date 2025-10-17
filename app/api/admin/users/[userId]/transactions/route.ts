// @ts-nocheck
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/utils/admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await requireAdminAccess("operator");
    const supabase = await createServerSupabaseClient();
    const resolvedParams = await params;
    const userId = resolvedParams.userId;

    const { data: transactions, error } = await supabase
      .from("credit_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Transaction query error:", error);
      return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
    }

    return NextResponse.json({
      transactions: transactions || [],
      total: transactions?.length || 0,
    });
  } catch (error) {
    console.error("User transactions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
