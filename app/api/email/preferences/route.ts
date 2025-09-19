// Email Preferences API Route
// Manages user email preferences and unsubscribe functionality

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Default email preferences
const DEFAULT_PREFERENCES = {
  marketing: true,
  booking_reminders: true,
  booking_confirmations: true,
  referral_notifications: true,
  review_requests: true,
  newsletter: true,
  sms_notifications: true
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const token = searchParams.get('token'); // For unsubscribe links

    if (!userId && !token) {
      return NextResponse.json(
        { error: 'User ID or unsubscribe token required' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    let targetUserId = userId;

    // If using token, validate and get user ID
    if (token && !userId) {
      // In production, you'd validate the token and extract user ID
      // For now, this is a simplified implementation
      return NextResponse.json(
        { error: 'Token-based access not implemented yet' },
        { status: 501 }
      );
    }

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Get user profile with email preferences
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, email, metadata')
      .eq('id', targetUserId)
      .single();

    if (error || !profile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Extract email preferences from metadata or use defaults
    const preferences = profile.metadata?.email_preferences || DEFAULT_PREFERENCES;

    return NextResponse.json({
      success: true,
      data: {
        user_id: profile.id,
        email: profile.email,
        preferences
      }
    });

  } catch (error) {
    console.error('Error fetching email preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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
    const { preferences, user_id } = body;

    // Users can only update their own preferences unless they're admin
    let targetUserId = user.id;
    
    if (user_id && user_id !== user.id) {
      // Check if user is admin
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
      
      targetUserId = user_id;
    }

    // Validate preferences
    const validKeys = Object.keys(DEFAULT_PREFERENCES);
    const invalidKeys = Object.keys(preferences).filter(key => !validKeys.includes(key));
    
    if (invalidKeys.length > 0) {
      return NextResponse.json(
        { error: `Invalid preference keys: ${invalidKeys.join(', ')}` },
        { status: 400 }
      );
    }

    // Get current profile
    const { data: currentProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('metadata')
      .eq('id', targetUserId)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Update email preferences in metadata
    const currentMetadata = currentProfile.metadata || {};
    const updatedMetadata = {
      ...currentMetadata,
      email_preferences: {
        ...DEFAULT_PREFERENCES,
        ...currentMetadata.email_preferences,
        ...preferences
      }
    };

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ metadata: updatedMetadata })
      .eq('id', targetUserId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      data: {
        user_id: targetUserId,
        preferences: updatedMetadata.email_preferences
      }
    });

  } catch (error) {
    console.error('Error updating email preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, preferences, token } = body;

    const supabase = createServerSupabaseClient();

    if (action === 'unsubscribe') {
      if (!email && !token) {
        return NextResponse.json(
          { error: 'Email or token required for unsubscribe' },
          { status: 400 }
        );
      }

      // Find user by email
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, metadata')
        .eq('email', email)
        .single();

      if (error || !profile) {
        return NextResponse.json(
          { error: 'Email not found' },
          { status: 404 }
        );
      }

      // Unsubscribe from all marketing emails
      const currentMetadata = profile.metadata || {};
      const updatedMetadata = {
        ...currentMetadata,
        email_preferences: {
          ...DEFAULT_PREFERENCES,
          ...currentMetadata.email_preferences,
          marketing: false,
          newsletter: false,
          referral_notifications: false
        }
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ metadata: updatedMetadata })
        .eq('id', profile.id);

      if (updateError) {
        throw updateError;
      }

      return NextResponse.json({
        success: true,
        message: 'Successfully unsubscribed from marketing emails'
      });
    }

    if (action === 'subscribe') {
      if (!email) {
        return NextResponse.json(
          { error: 'Email required for subscription' },
          { status: 400 }
        );
      }

      // Find or create user profile
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('id, metadata')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found error
        throw error;
      }

      if (!profile) {
        // Create new profile for newsletter subscription
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            email,
            metadata: {
              email_preferences: preferences || { newsletter: true, marketing: true }
            }
          }])
          .select()
          .single();

        if (createError) {
          throw createError;
        }

        profile = newProfile;
      } else {
        // Update existing profile
        const currentMetadata = profile.metadata || {};
        const updatedMetadata = {
          ...currentMetadata,
          email_preferences: {
            ...DEFAULT_PREFERENCES,
            ...currentMetadata.email_preferences,
            ...preferences
          }
        };

        const { error: updateError } = await supabase
          .from('profiles')
          .update({ metadata: updatedMetadata })
          .eq('id', profile.id);

        if (updateError) {
          throw updateError;
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed to email updates'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in email preferences action:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}