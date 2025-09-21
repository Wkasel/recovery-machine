// Node.js script to setup admin user
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables. Please check your .env file.');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdmin() {
  try {
    console.log('Setting up admin user: william@dsco.co');

    // First, check if admins table exists and create if needed
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'admins');

    if (tableError) {
      console.log('Creating admins table...');
      const { error: createError } = await supabase.rpc('exec', {
        sql: `
          CREATE TABLE IF NOT EXISTS admins (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email TEXT UNIQUE NOT NULL,
            role TEXT NOT NULL DEFAULT 'admin',
            is_active BOOLEAN NOT NULL DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY IF NOT EXISTS "Admins can read own data" ON admins
            FOR SELECT USING (auth.jwt() ->> 'email' = email);
        `
      });
      
      if (createError) {
        console.error('Error creating table:', createError);
      } else {
        console.log('✓ Admins table created');
      }
    }

    // Insert or update admin user
    const { data, error } = await supabase
      .from('admins')
      .upsert({
        email: 'william@dsco.co',
        role: 'admin',
        is_active: true
      }, {
        onConflict: 'email'
      });

    if (error) {
      console.error('Error setting up admin:', error);
    } else {
      console.log('✓ Admin user william@dsco.co setup complete');
    }

    // Verify admin exists
    const { data: adminCheck, error: checkError } = await supabase
      .from('admins')
      .select('*')
      .eq('email', 'william@dsco.co')
      .single();

    if (checkError) {
      console.error('Error checking admin:', checkError);
    } else {
      console.log('✓ Admin verified:', adminCheck);
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

setupAdmin();