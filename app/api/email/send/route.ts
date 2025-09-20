// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Temporary stub for email sending
    // TODO: Implement proper email service integration
    const _body = await request.json();

    return NextResponse.json({
      success: true,
      message: "Email functionality temporarily disabled",
    });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json({ error: "Email service unavailable" }, { status: 500 });
  }
}
