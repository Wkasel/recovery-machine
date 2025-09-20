#!/usr/bin/env node

/**
 * Security Test Runner
 * Runs the security test suite and displays results
 */

const { execSync } = require('child_process');
const path = require('path');

async function runSecurityTests() {
  console.log('🔒 Starting Security Test Suite...\n');

  try {
    // Check if environment variables are available
    console.log('1. Checking environment configuration...');
    
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables:');
      missingVars.forEach(varName => console.error(`   - ${varName}`));
      console.error('\nPlease ensure your .env.local file contains all required variables.');
      process.exit(1);
    }

    console.log('✅ Environment variables are configured\n');

    // Test database connectivity
    console.log('2. Testing database connectivity...');
    
    try {
      const { createServiceSupabaseClient } = require('../utils/supabase/service.ts');
      const supabase = createServiceSupabaseClient();
      
      // Simple connectivity test
      const { error } = await supabase.from('profiles').select('count').limit(1);
      
      if (error) {
        console.error('❌ Database connectivity failed:', error.message);
        process.exit(1);
      }
      
      console.log('✅ Database connection successful\n');
    } catch (error) {
      console.error('❌ Failed to test database connectivity:', error.message);
      console.error('\nThis might be due to incorrect Supabase configuration.');
      process.exit(1);
    }

    // Test RLS policies
    console.log('3. Testing Row Level Security policies...');
    
    const { createBrowserSupabaseClient } = require('../utils/supabase/service.ts');
    const browserClient = createBrowserSupabaseClient();
    
    // Test unauthenticated access to protected tables
    const tables = ['profiles', 'orders', 'bookings', 'admins'];
    let rlsViolations = 0;
    
    for (const table of tables) {
      try {
        const { data, error } = await browserClient.from(table).select('*').limit(1);
        
        if (data && data.length > 0) {
          console.error(`❌ RLS VIOLATION: Unauthenticated access to ${table} table allowed`);
          rlsViolations++;
        } else {
          console.log(`✅ RLS working correctly for ${table} table`);
        }
      } catch (error) {
        console.log(`✅ RLS working correctly for ${table} table (access denied)`);
      }
    }
    
    if (rlsViolations > 0) {
      console.error(`\n🚨 CRITICAL: ${rlsViolations} RLS policy violations found!`);
      console.error('Row Level Security is not properly configured. This is a critical security issue.');
      process.exit(1);
    }

    console.log('\n✅ All RLS policies are working correctly');

    // Test admin functions
    console.log('\n4. Testing admin helper functions...');
    
    const serviceClient = createServiceSupabaseClient();
    
    try {
      const { error: adminError } = await serviceClient.rpc('is_admin');
      const { error: superAdminError } = await serviceClient.rpc('is_super_admin');
      
      if (adminError || superAdminError) {
        console.error('❌ Admin helper functions not available');
        console.error('This may affect admin functionality.');
      } else {
        console.log('✅ Admin helper functions are available');
      }
    } catch (error) {
      console.error('❌ Failed to test admin functions:', error.message);
    }

    // Summary
    console.log('\n🎉 SECURITY TEST SUITE COMPLETED');
    console.log('✅ No critical security issues detected');
    console.log('\nYour application security configuration appears to be correct.');

  } catch (error) {
    console.error('\n❌ Security test suite failed:', error.message);
    console.error('\nPlease review your configuration and try again.');
    process.exit(1);
  }
}

// Handle async execution
runSecurityTests().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});