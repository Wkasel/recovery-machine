// Email Send API Route
// Handles sending emails with Resend integration

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/services/email';
import type { EmailPreferences } from '@/lib/services/email';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      to, 
      templateId, 
      context, 
      options = {} 
    } = body;

    // Validate required fields
    if (!to || !templateId) {
      return NextResponse.json(
        { error: 'Missing required fields: to, templateId' },
        { status: 400 }
      );
    }

    // Check if user has permission to send emails (admin only for some templates)
    const adminOnlyTemplates = ['NEWSLETTER'];
    if (adminOnlyTemplates.includes(templateId)) {
      const { data: admin } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (!admin) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }
    }

    // Send the email
    const result = await sendEmail(to, templateId, context, options);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data
    });

  } catch (error) {
    console.error('Error in email send API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'templates') {
      // Return available email templates
      const templates = [
        { id: 'WELCOME_NEW_USER', name: 'Welcome New User', category: 'transactional' },
        { id: 'BOOKING_CONFIRMATION', name: 'Booking Confirmation', category: 'transactional' },
        { id: 'BOOKING_REMINDER_24H', name: '24 Hour Reminder', category: 'notification' },
        { id: 'REFERRAL_INVITATION', name: 'Referral Invitation', category: 'marketing' },
        { id: 'REVIEW_REQUEST', name: 'Review Request', category: 'notification' },
        { id: 'NEWSLETTER', name: 'Newsletter', category: 'marketing' }
      ];

      return NextResponse.json({
        success: true,
        data: templates
      });
    }

    if (action === 'test') {
      const email = searchParams.get('email');
      const templateId = searchParams.get('template') || 'WELCOME_NEW_USER';

      if (!email) {
        return NextResponse.json(
          { error: 'Email parameter required for test' },
          { status: 400 }
        );
      }

      // Send test email
      const result = await sendEmail(
        email,
        templateId as any,
        {
          user: {
            firstName: 'Test User',
            referralCode: 'TEST123'
          },
          customData: {
            bookingDate: new Date().toLocaleDateString(),
            bookingTime: new Date().toLocaleTimeString()
          }
        },
        {
          tags: ['test', 'api-test']
        }
      );

      return NextResponse.json({
        success: result.success,
        data: result.data,
        error: result.error
      });
    }

    return NextResponse.json(
      { error: 'Invalid action parameter' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in email API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}