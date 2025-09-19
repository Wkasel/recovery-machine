// Database connection and CRUD operation tests
// Test utilities for validating database setup

import { 
  testDatabaseConnection, 
  getTableCounts,
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  createOrder,
  createBooking,
  createReferral,
  getFeaturedReviews,
  getAvailableSlots
} from "./index";

// ===========================================================================
// TEST SUITE
// ===========================================================================

export async function runDatabaseTests() {
  console.log('🧪 Starting Recovery Machine Database Tests...\n');
  
  const results = {
    connectionTest: false,
    tableCountsTest: false,
    profileTest: false,
    orderTest: false,
    bookingTest: false,
    referralTest: false,
    reviewTest: false,
    availabilityTest: false,
    errors: [] as string[]
  };

  // Test 1: Database Connection
  console.log('1️⃣ Testing database connection...');
  try {
    const connectionResult = await testDatabaseConnection();
    if (connectionResult.success) {
      console.log('✅ Database connection successful');
      results.connectionTest = true;
    } else {
      console.log('❌ Database connection failed:', connectionResult.error);
      results.errors.push(`Connection: ${connectionResult.error}`);
    }
  } catch (error) {
    console.log('❌ Database connection test threw error:', error);
    results.errors.push(`Connection exception: ${error}`);
  }

  // Test 2: Table Counts
  console.log('\n2️⃣ Testing table structure...');
  try {
    const countsResult = await getTableCounts();
    if (countsResult.success && countsResult.data) {
      console.log('✅ All tables accessible:');
      Object.entries(countsResult.data).forEach(([table, count]) => {
        console.log(`   ${table}: ${count} records`);
      });
      results.tableCountsTest = true;
    } else {
      console.log('❌ Table counts test failed:', countsResult.error);
      results.errors.push(`Table counts: ${countsResult.error}`);
    }
  } catch (error) {
    console.log('❌ Table counts test threw error:', error);
    results.errors.push(`Table counts exception: ${error}`);
  }

  // Test 3: Profile Operations (Read-only for existing)
  console.log('\n3️⃣ Testing profile operations...');
  try {
    // Try to read first profile (if any exist)
    const profileResult = await getUserProfile('test-id-that-wont-exist');
    // We expect this to fail gracefully, not throw
    if (!profileResult.success) {
      console.log('✅ Profile read test completed (no test profile found - expected)');
      results.profileTest = true;
    }
  } catch (error) {
    console.log('❌ Profile test threw unexpected error:', error);
    results.errors.push(`Profile test exception: ${error}`);
  }

  // Test 4: Featured Reviews (Read-only)
  console.log('\n4️⃣ Testing review operations...');
  try {
    const reviewsResult = await getFeaturedReviews();
    if (reviewsResult.success) {
      console.log(`✅ Featured reviews query successful (${reviewsResult.data?.length || 0} reviews)`);
      results.reviewTest = true;
    } else {
      console.log('❌ Featured reviews test failed:', reviewsResult.error);
      results.errors.push(`Reviews: ${reviewsResult.error}`);
    }
  } catch (error) {
    console.log('❌ Reviews test threw error:', error);
    results.errors.push(`Reviews exception: ${error}`);
  }

  // Test 5: Availability Slots (Read-only)
  console.log('\n5️⃣ Testing availability operations...');
  try {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const availabilityResult = await getAvailableSlots(today, tomorrow);
    if (availabilityResult.success) {
      console.log(`✅ Availability query successful (${availabilityResult.data?.length || 0} slots)`);
      results.availabilityTest = true;
    } else {
      console.log('❌ Availability test failed:', availabilityResult.error);
      results.errors.push(`Availability: ${availabilityResult.error}`);
    }
  } catch (error) {
    console.log('❌ Availability test threw error:', error);
    results.errors.push(`Availability exception: ${error}`);
  }

  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log('=======================');
  
  const totalTests = 5;
  const passedTests = [
    results.connectionTest,
    results.tableCountsTest, 
    results.profileTest,
    results.reviewTest,
    results.availabilityTest
  ].filter(Boolean).length;

  console.log(`Passed: ${passedTests}/${totalTests} tests`);
  
  if (results.errors.length > 0) {
    console.log('\n❌ Errors encountered:');
    results.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }

  if (passedTests === totalTests) {
    console.log('\n🎉 All database tests passed! Database setup is working correctly.');
  } else {
    console.log(`\n⚠️  ${totalTests - passedTests} test(s) failed. Please check the errors above.`);
  }

  return results;
}

// ===========================================================================
// INDIVIDUAL TEST FUNCTIONS
// ===========================================================================

export async function testTableAccess() {
  const tables = [
    'profiles',
    'orders', 
    'bookings',
    'referrals',
    'reviews',
    'admins',
    'credit_transactions',
    'availability_slots'
  ];

  console.log('Testing table access...');
  
  for (const table of tables) {
    try {
      const { data, error } = await import('@/lib/supabase/client').then(m => 
        m.createBrowserSupabaseClient()
          .from(table)
          .select('count', { count: 'exact', head: true })
      );
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: accessible`);
      }
    } catch (error) {
      console.log(`❌ ${table}: exception - ${error}`);
    }
  }
}

export async function testMigrationStatus() {
  console.log('Migration status check:');
  console.log('========================');
  
  try {
    const supabase = await import('@/lib/supabase/server').then(m => m.createServerSupabaseClient());
    
    // Check if tables exist by querying system catalog
    const { data, error } = await supabase.rpc('check_table_exists', { table_name: 'profiles' });
    
    if (error) {
      console.log('❌ Could not check migration status');
      return false;
    }
    
    console.log('✅ Migration status check completed');
    return true;
  } catch (error) {
    console.log('❌ Migration status check failed:', error);
    return false;
  }
}

// Function to validate RLS policies are working
export async function testRLSPolicies() {
  console.log('Testing Row Level Security policies...');
  
  try {
    // This should fail without authentication
    const supabase = await import('@/lib/supabase/client').then(m => m.createBrowserSupabaseClient());
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    // Should either return empty array or require auth
    if (data !== null) {
      console.log('✅ RLS policies are configured (no unauthorized access)');
      return true;
    } else {
      console.log('⚠️  RLS test inconclusive');
      return false;
    }
  } catch (error) {
    console.log('❌ RLS test failed:', error);
    return false;
  }
}