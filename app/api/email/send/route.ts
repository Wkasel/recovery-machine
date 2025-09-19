import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Temporary stub for email sending
    // TODO: Implement proper email service integration
    const body = await request.json();
    
    return NextResponse.json({
      success: true,
      message: 'Email functionality temporarily disabled'
    });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { error: 'Email service unavailable' },
      { status: 500 }
    );
  }
}