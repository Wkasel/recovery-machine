import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Require setup token for security
    const setupToken = process.env.ADMIN_SETUP_TOKEN;
    const authHeader = request.headers.get('authorization');

    if (!setupToken || authHeader !== `Bearer ${setupToken}`) {
      return NextResponse.json(
        { error: 'Invalid setup token. Set ADMIN_SETUP_TOKEN in environment variables.' },
        { status: 401 }
      );
    }

    console.log('Setting up admin users...');

    const supabase = await createServerSupabaseClient();

    // Read admin users from environment variables
    // Format: ADMIN_EMAILS="email1:role1,email2:role2"
    // Example: ADMIN_EMAILS="wkasel@gmail.com:super_admin,william@dsco.co:admin"
    const adminEmailsEnv = process.env.ADMIN_EMAILS;

    if (!adminEmailsEnv) {
      return NextResponse.json(
        { error: 'ADMIN_EMAILS not set in environment variables' },
        { status: 400 }
      );
    }

    const adminUsers = adminEmailsEnv.split(',').map(entry => {
      const [email, role = 'admin'] = entry.trim().split(':');
      return { email: email.trim(), role: role.trim() as 'super_admin' | 'admin' | 'operator' };
    });

    const results = [];

    for (const admin of adminUsers) {
      console.log(`Setting up admin user: ${admin.email}`);

      // Validate role
      if (!['super_admin', 'admin', 'operator'].includes(admin.role)) {
        results.push({
          email: admin.email,
          success: false,
          error: `Invalid role: ${admin.role}`
        });
        continue;
      }

      // Insert/update admin user
      const { data, error } = await supabase
        .from('admins')
        .upsert({
          email: admin.email,
          role: admin.role,
          is_active: true,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'email'
        })
        .select();

      if (error) {
        console.error(`Error creating admin user ${admin.email}:`, error);
        results.push({ email: admin.email, success: false, error: error.message });
      } else {
        console.log(`✅ Admin user ${admin.email} created successfully`);
        results.push({ email: admin.email, success: true, data });
      }
    }

    const allSuccessful = results.every(r => r.success);

    return NextResponse.json({
      success: allSuccessful,
      message: allSuccessful
        ? 'All admin users created successfully'
        : 'Some admin users failed to create',
      results
    });

  } catch (error) {
    console.error('Setup failed:', error);
    return NextResponse.json({ error: 'Setup failed', details: error }, { status: 500 });
  }
}