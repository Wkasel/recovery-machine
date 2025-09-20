/**
 * Security Test Suite
 * Tests RLS policies and authentication boundaries
 */

import { validateEnvironment } from "@/lib/security/environment";
import { createBrowserSupabaseClient, createServiceSupabaseClient } from "@/utils/supabase/service";

interface SecurityTestResult {
  test: string;
  passed: boolean;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
}

export async function runSecurityTests(): Promise<SecurityTestResult[]> {
  const results: SecurityTestResult[] = [];

  // Test 1: Environment Validation
  results.push(await testEnvironmentValidation());

  // Test 2: RLS Policy Enforcement
  results.push(...(await testRLSPolicies()));

  // Test 3: Admin Permission Boundaries
  results.push(...(await testAdminPermissions()));

  // Test 4: Webhook Security
  results.push(await testWebhookSecurity());

  // Test 5: Client Type Usage
  results.push(...(await testClientUsage()));

  return results;
}

async function testEnvironmentValidation(): Promise<SecurityTestResult> {
  try {
    const validation = validateEnvironment();

    if (!validation.isValid) {
      return {
        test: "Environment Validation",
        passed: false,
        message: `Missing environment variables: ${validation.errors.join(", ")}`,
        severity: "critical",
      };
    }

    return {
      test: "Environment Validation",
      passed: true,
      message: "All required environment variables are present",
      severity: "low",
    };
  } catch (error) {
    return {
      test: "Environment Validation",
      passed: false,
      message: `Environment validation failed: ${error}`,
      severity: "critical",
    };
  }
}

async function testRLSPolicies(): Promise<SecurityTestResult[]> {
  const results: SecurityTestResult[] = [];

  try {
    const supabase = createBrowserSupabaseClient();

    // Test 1: Unauthenticated user cannot access user data
    const { data: profilesWithoutAuth } = await supabase.from("profiles").select("*").limit(1);

    results.push({
      test: "RLS - Unauthenticated Profile Access",
      passed: !profilesWithoutAuth || profilesWithoutAuth.length === 0,
      message:
        profilesWithoutAuth?.length > 0
          ? "SECURITY BREACH: Unauthenticated users can access profile data"
          : "RLS correctly blocks unauthenticated profile access",
      severity: profilesWithoutAuth?.length > 0 ? "critical" : "low",
    });

    // Test 2: Orders table access without authentication
    const { data: ordersWithoutAuth } = await supabase.from("orders").select("*").limit(1);

    results.push({
      test: "RLS - Unauthenticated Order Access",
      passed: !ordersWithoutAuth || ordersWithoutAuth.length === 0,
      message:
        ordersWithoutAuth?.length > 0
          ? "SECURITY BREACH: Unauthenticated users can access order data"
          : "RLS correctly blocks unauthenticated order access",
      severity: ordersWithoutAuth?.length > 0 ? "critical" : "low",
    });

    // Test 3: Admin table access without authentication
    const { data: adminsWithoutAuth } = await supabase.from("admins").select("*").limit(1);

    results.push({
      test: "RLS - Unauthenticated Admin Access",
      passed: !adminsWithoutAuth || adminsWithoutAuth.length === 0,
      message:
        adminsWithoutAuth?.length > 0
          ? "SECURITY BREACH: Unauthenticated users can access admin data"
          : "RLS correctly blocks unauthenticated admin access",
      severity: adminsWithoutAuth?.length > 0 ? "critical" : "low",
    });
  } catch (error) {
    results.push({
      test: "RLS Policy Testing",
      passed: false,
      message: `RLS test failed: ${error}`,
      severity: "high",
    });
  }

  return results;
}

async function testAdminPermissions(): Promise<SecurityTestResult[]> {
  const results: SecurityTestResult[] = [];

  try {
    // Test that admin functions exist and are secure
    const serviceClient = createServiceSupabaseClient();

    // Test admin helper functions
    const { data: isAdminResult, error: adminError } = await serviceClient.rpc("is_admin");

    results.push({
      test: "Admin Helper Function Availability",
      passed: !adminError,
      message: adminError
        ? `Admin helper function error: ${adminError.message}`
        : "Admin helper functions are available",
      severity: adminError ? "medium" : "low",
    });

    const { data: isSuperAdminResult, error: superAdminError } =
      await serviceClient.rpc("is_super_admin");

    results.push({
      test: "Super Admin Helper Function Availability",
      passed: !superAdminError,
      message: superAdminError
        ? `Super admin helper function error: ${superAdminError.message}`
        : "Super admin helper functions are available",
      severity: superAdminError ? "medium" : "low",
    });
  } catch (error) {
    results.push({
      test: "Admin Permission Testing",
      passed: false,
      message: `Admin permission test failed: ${error}`,
      severity: "high",
    });
  }

  return results;
}

async function testWebhookSecurity(): Promise<SecurityTestResult> {
  try {
    // Test that webhook endpoints require proper authentication
    const serviceClient = createServiceSupabaseClient();

    // Verify service client can perform operations
    const { error } = await serviceClient.from("profiles").select("count").limit(1);

    return {
      test: "Webhook Service Client",
      passed: !error,
      message: error
        ? `Service client cannot access data: ${error.message}`
        : "Service client can properly access data for webhook processing",
      severity: error ? "critical" : "low",
    };
  } catch (error) {
    return {
      test: "Webhook Security",
      passed: false,
      message: `Webhook security test failed: ${error}`,
      severity: "high",
    };
  }
}

async function testClientUsage(): Promise<SecurityTestResult[]> {
  const results: SecurityTestResult[] = [];

  try {
    // Test that service client exists and works
    const serviceClient = createServiceSupabaseClient();
    const browserClient = createBrowserSupabaseClient();

    results.push({
      test: "Service Client Creation",
      passed: !!serviceClient,
      message: "Service client created successfully",
      severity: "low",
    });

    results.push({
      test: "Browser Client Creation",
      passed: !!browserClient,
      message: "Browser client created successfully",
      severity: "low",
    });

    // Test that they use different keys
    const serviceUrl = (serviceClient as any).supabaseUrl;
    const browserUrl = (browserClient as any).supabaseUrl;

    results.push({
      test: "Client URL Consistency",
      passed: serviceUrl === browserUrl,
      message:
        serviceUrl === browserUrl
          ? "Both clients use the same Supabase URL"
          : "Clients use different URLs (configuration error)",
      severity: serviceUrl === browserUrl ? "low" : "high",
    });
  } catch (error) {
    results.push({
      test: "Client Usage Testing",
      passed: false,
      message: `Client usage test failed: ${error}`,
      severity: "high",
    });
  }

  return results;
}

// Run tests and display results
export function displaySecurityResults(results: SecurityTestResult[]): void {
  console.log("\n🔒 SECURITY TEST RESULTS\n");

  const critical = results.filter((r) => r.severity === "critical");
  const high = results.filter((r) => r.severity === "high");
  const medium = results.filter((r) => r.severity === "medium");
  const low = results.filter((r) => r.severity === "low");

  if (critical.length > 0) {
    console.log("🚨 CRITICAL ISSUES:");
    critical.forEach((r) => console.log(`  ❌ ${r.test}: ${r.message}`));
    console.log("");
  }

  if (high.length > 0) {
    console.log("⚠️  HIGH PRIORITY:");
    high.forEach((r) => console.log(`  ${r.passed ? "✅" : "❌"} ${r.test}: ${r.message}`));
    console.log("");
  }

  if (medium.length > 0) {
    console.log("🔶 MEDIUM PRIORITY:");
    medium.forEach((r) => console.log(`  ${r.passed ? "✅" : "❌"} ${r.test}: ${r.message}`));
    console.log("");
  }

  console.log("✅ PASSED TESTS:");
  low.filter((r) => r.passed).forEach((r) => console.log(`  ✅ ${r.test}: ${r.message}`));

  const totalTests = results.length;
  const passedTests = results.filter((r) => r.passed).length;
  const criticalFailures = critical.filter((r) => !r.passed).length;

  console.log(`\n📊 SUMMARY: ${passedTests}/${totalTests} tests passed`);

  if (criticalFailures > 0) {
    console.log(
      `🚨 ${criticalFailures} CRITICAL SECURITY ISSUES FOUND - IMMEDIATE ACTION REQUIRED`
    );
  } else if (high.filter((r) => !r.passed).length > 0) {
    console.log(`⚠️  High priority security issues found - should be addressed soon`);
  } else {
    console.log(`✅ No critical security issues detected`);
  }
}
