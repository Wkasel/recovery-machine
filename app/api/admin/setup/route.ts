import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    console.log('Setting up admin user: william@dsco.co');
    
    const supabase = await createServerSupabaseClient();

    // Create admins table if it doesn't exist
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS admins (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL DEFAULT 'admin',
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    const { error: createTableError } = await supabase.rpc('exec', { 
      sql: createTableSQL 
    });

    if (createTableError && !createTableError.message.includes('already exists')) {
      console.error('Error creating table:', createTableError);
      return NextResponse.json({ error: 'Failed to create admins table', details: createTableError }, { status: 500 });
    }

    // Enable RLS
    const { error: rlsError } = await supabase.rpc('exec', { 
      sql: 'ALTER TABLE admins ENABLE ROW LEVEL SECURITY;' 
    });

    if (rlsError && !rlsError.message.includes('already enabled')) {
      console.log('RLS already enabled or error:', rlsError);
    }

    // Create policy for admins to read their own data
    const policySQL = `
      DROP POLICY IF EXISTS "Admins can read own data" ON admins;
      CREATE POLICY "Admins can read own data" ON admins
        FOR SELECT USING (auth.jwt() ->> 'email' = email);
    `;

    const { error: policyError } = await supabase.rpc('exec', { 
      sql: policySQL 
    });

    if (policyError) {
      console.log('Policy creation result:', policyError);
    }

    // Insert/update admin user
    const { data, error } = await supabase
      .from('admins')
      .upsert({
        email: 'william@dsco.co',
        role: 'admin',
        is_active: true,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'email'
      })
      .select();

    if (error) {
      console.error('Error creating admin user:', error);
      return NextResponse.json({ error: 'Failed to create admin user', details: error }, { status: 500 });
    }

    console.log('✅ Admin user created successfully:', data);

    // Verify the admin user exists
    const { data: adminUser, error: verifyError } = await supabase
      .from('admins')
      .select('*')
      .eq('email', 'william@dsco.co')
      .single();

    if (verifyError) {
      console.error('Error verifying admin user:', verifyError);
      return NextResponse.json({ error: 'Failed to verify admin user', details: verifyError }, { status: 500 });
    }

    console.log('✅ Admin user verified:', adminUser);

    return NextResponse.json({ 
      success: true, 
      message: 'Admin user william@dsco.co created successfully',
      adminUser 
    });

  } catch (error) {
    console.error('Setup failed:', error);
    return NextResponse.json({ error: 'Setup failed', details: error }, { status: 500 });
  }
}