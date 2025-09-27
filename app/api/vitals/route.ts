import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const vitals = await request.json();
    
    // Log Core Web Vitals for monitoring
    console.log('Core Web Vitals:', {
      name: vitals.name,
      value: vitals.value,
      id: vitals.id,
      url: request.headers.get('referer') || 'unknown',
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    });

    // You can extend this to send to your analytics service
    // Example: send to Google Analytics, DataDog, etc.
    
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error processing vitals:', error);
    return NextResponse.json({ error: 'Failed to process vitals' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'Core Web Vitals endpoint active',
    timestamp: new Date().toISOString()
  });
}