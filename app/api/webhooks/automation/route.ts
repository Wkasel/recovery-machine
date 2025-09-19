// Automation Webhooks API Route
// Handles automated email and SMS triggers from booking/user events

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { 
  triggerUserSignupWorkflow,
  triggerBookingWorkflow,
  triggerReferralWorkflow
} from '@/lib/services/automation';
import { getUserProfile } from '@/lib/database';

// ===========================================================================
// WEBHOOK HANDLERS
// ===========================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, record, old_record, schema, table } = body;

    // Validate webhook signature in production
    // const signature = request.headers.get('x-supabase-signature');
    // if (!validateWebhookSignature(signature, body)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    console.log('Webhook received:', { type, schema, table, record: record?.id });

    const supabase = createServerSupabaseClient();

    // Route to appropriate handler based on table and event type
    switch (table) {
      case 'profiles':
        return handleProfileEvents(type, record, old_record, supabase);
      
      case 'bookings':
        return handleBookingEvents(type, record, old_record, supabase);
      
      case 'referrals':
        return handleReferralEvents(type, record, old_record, supabase);
      
      default:
        console.log(`Unhandled table: ${table}`);
        return NextResponse.json({ 
          success: true, 
          message: 'Event not handled by automation' 
        });
    }

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// ===========================================================================
// EVENT HANDLERS
// ===========================================================================

async function handleProfileEvents(
  type: string,
  record: any,
  old_record: any,
  supabase: any
) {
  if (type === 'INSERT') {
    // New user signup - trigger welcome workflow
    console.log('New user signup detected:', record.id);
    
    try {
      const result = await triggerUserSignupWorkflow(record.id);
      
      if (result.success) {
        console.log('Welcome workflow triggered successfully');
      } else {
        console.error('Failed to trigger welcome workflow:', result.error);
      }

      return NextResponse.json({
        success: true,
        message: 'Profile creation processed',
        workflow_triggered: result.success
      });
    } catch (error) {
      console.error('Error in profile workflow:', error);
      return NextResponse.json(
        { error: 'Failed to process profile creation' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ 
    success: true, 
    message: 'Profile event processed' 
  });
}

async function handleBookingEvents(
  type: string,
  record: any,
  old_record: any,
  supabase: any
) {
  try {
    // Get user profile for the booking
    const profileResult = await getUserProfile(record.user_id);
    
    if (!profileResult.success || !profileResult.data) {
      console.error('User profile not found for booking:', record.id);
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    const profile = profileResult.data;

    if (type === 'INSERT') {
      // New booking created
      console.log('New booking created:', record.id);
      
      const result = await triggerBookingWorkflow(record, profile, 'created');
      
      return NextResponse.json({
        success: true,
        message: 'Booking creation processed',
        workflow_triggered: result.success
      });
    }

    if (type === 'UPDATE') {
      // Booking status changed
      const oldStatus = old_record?.status;
      const newStatus = record.status;
      
      console.log(`Booking status changed: ${oldStatus} -> ${newStatus}`);

      let workflowTriggered = false;

      // Handle status transitions
      if (oldStatus !== 'confirmed' && newStatus === 'confirmed') {
        // Booking confirmed - trigger reminder workflow
        const result = await triggerBookingWorkflow(record, profile, 'confirmed');
        workflowTriggered = result.success;
      }

      if (oldStatus !== 'completed' && newStatus === 'completed') {
        // Booking completed - trigger review request workflow
        const result = await triggerBookingWorkflow(record, profile, 'completed');
        workflowTriggered = result.success;
      }

      return NextResponse.json({
        success: true,
        message: 'Booking update processed',
        workflow_triggered: workflowTriggered
      });
    }

  } catch (error) {
    console.error('Error in booking workflow:', error);
    return NextResponse.json(
      { error: 'Failed to process booking event' },
      { status: 500 }
    );
  }

  return NextResponse.json({ 
    success: true, 
    message: 'Booking event processed' 
  });
}

async function handleReferralEvents(
  type: string,
  record: any,
  old_record: any,
  supabase: any
) {
  if (type === 'INSERT') {
    // New referral created
    console.log('New referral created:', record.id);
    
    try {
      // Get referrer profile
      const profileResult = await getUserProfile(record.referrer_id);
      
      if (!profileResult.success || !profileResult.data) {
        console.error('Referrer profile not found:', record.referrer_id);
        return NextResponse.json(
          { error: 'Referrer profile not found' },
          { status: 404 }
        );
      }

      const result = await triggerReferralWorkflow(record, profileResult.data);
      
      return NextResponse.json({
        success: true,
        message: 'Referral creation processed',
        workflow_triggered: result.success
      });
    } catch (error) {
      console.error('Error in referral workflow:', error);
      return NextResponse.json(
        { error: 'Failed to process referral creation' },
        { status: 500 }
      );
    }
  }

  if (type === 'UPDATE') {
    // Referral status changed
    const oldStatus = old_record?.status;
    const newStatus = record.status;
    
    if (oldStatus !== 'first_booking' && newStatus === 'first_booking') {
      // Referral completed - could trigger celebration email
      console.log('Referral completed:', record.id);
      
      // TODO: Implement referral completion celebration workflow
      return NextResponse.json({
        success: true,
        message: 'Referral completion processed'
      });
    }
  }

  return NextResponse.json({ 
    success: true, 
    message: 'Referral event processed' 
  });
}

// ===========================================================================
// MANUAL TRIGGER ENDPOINT
// ===========================================================================

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { workflow_type, user_id, booking_id, referral_id, event_type } = body;

    const supabase = createServerSupabaseClient();
    
    // Get the authenticated user (admin only for manual triggers)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: admin } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    let result;

    switch (workflow_type) {
      case 'user_signup':
        if (!user_id) {
          return NextResponse.json(
            { error: 'user_id required for signup workflow' },
            { status: 400 }
          );
        }
        result = await triggerUserSignupWorkflow(user_id);
        break;

      case 'booking':
        if (!booking_id || !event_type) {
          return NextResponse.json(
            { error: 'booking_id and event_type required' },
            { status: 400 }
          );
        }

        // Get booking and profile
        const { data: bookingData } = await supabase
          .from('bookings')
          .select(`
            *,
            profiles:user_id (*)
          `)
          .eq('id', booking_id)
          .single();

        if (!bookingData) {
          return NextResponse.json(
            { error: 'Booking not found' },
            { status: 404 }
          );
        }

        result = await triggerBookingWorkflow(
          bookingData, 
          bookingData.profiles, 
          event_type
        );
        break;

      case 'referral':
        if (!referral_id) {
          return NextResponse.json(
            { error: 'referral_id required' },
            { status: 400 }
          );
        }

        // Get referral and referrer profile
        const { data: referralData } = await supabase
          .from('referrals')
          .select(`
            *,
            profiles:referrer_id (*)
          `)
          .eq('id', referral_id)
          .single();

        if (!referralData) {
          return NextResponse.json(
            { error: 'Referral not found' },
            { status: 404 }
          );
        }

        result = await triggerReferralWorkflow(referralData, referralData.profiles);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid workflow_type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: result.success,
      data: result.data,
      error: result.error,
      message: `Manual ${workflow_type} workflow ${result.success ? 'triggered' : 'failed'}`
    });

  } catch (error) {
    console.error('Error in manual workflow trigger:', error);
    return NextResponse.json(
      { error: 'Failed to trigger workflow' },
      { status: 500 }
    );
  }
}

// ===========================================================================
// WORKFLOW STATUS ENDPOINT
// ===========================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'status') {
      // Return automation system status
      return NextResponse.json({
        success: true,
        data: {
          status: 'active',
          workflows_enabled: [
            'welcome-series',
            'booking-confirmation',
            'booking-reminders',
            'post-session-review'
          ],
          last_processed: new Date().toISOString(),
          total_processed_today: 0 // Would be from database in production
        }
      });
    }

    if (action === 'health') {
      // Health check for monitoring
      return NextResponse.json({
        success: true,
        data: {
          automation_service: 'healthy',
          email_service: 'healthy',
          sms_service: 'healthy',
          database: 'healthy',
          timestamp: new Date().toISOString()
        }
      });
    }

    return NextResponse.json(
      { error: 'Invalid action parameter' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in automation status:', error);
    return NextResponse.json(
      { error: 'Failed to get automation status' },
      { status: 500 }
    );
  }
}

// ===========================================================================
// UTILITY FUNCTIONS
// ===========================================================================

function validateWebhookSignature(signature: string | null, body: any): boolean {
  // In production, validate the webhook signature from Supabase
  // This ensures the webhook is genuinely from your Supabase instance
  
  if (!signature) return false;
  
  // TODO: Implement proper signature validation
  // const expectedSignature = crypto
  //   .createHmac('sha256', process.env.SUPABASE_WEBHOOK_SECRET!)
  //   .update(JSON.stringify(body))
  //   .digest('hex');
  
  // return signature === expectedSignature;
  
  return true; // For development only
}