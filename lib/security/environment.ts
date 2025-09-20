/**
 * Environment Variable Validation
 * Ensures all required environment variables are present and valid
 */

interface EnvironmentConfig {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;

  // App Configuration
  NEXT_PUBLIC_SITE_URL: string;

  // Payment (Bolt)
  BOLT_API_KEY?: string;
  BOLT_WEBHOOK_SECRET?: string;

  // Email Services
  RESEND_API_KEY?: string;

  // SMS Services
  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;

  // Monitoring
  SENTRY_DSN?: string;
  SENTRY_AUTH_TOKEN?: string;
}

const requiredEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_SITE_URL",
];

const optionalEnvVars = [
  "BOLT_API_KEY",
  "BOLT_WEBHOOK_SECRET",
  "RESEND_API_KEY",
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "SENTRY_DSN",
  "SENTRY_AUTH_TOKEN",
];

export function validateEnvironment(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  config: Partial<EnvironmentConfig>;
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const config: Partial<EnvironmentConfig> = {};

  // Check required environment variables
  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar];
    if (!value) {
      errors.push(`Missing required environment variable: ${envVar}`);
    } else {
      config[envVar as keyof EnvironmentConfig] = value;
    }
  }

  // Check optional environment variables and warn if missing important ones
  for (const envVar of optionalEnvVars) {
    const value = process.env[envVar];
    if (value) {
      config[envVar as keyof EnvironmentConfig] = value;
    } else if (["BOLT_API_KEY", "RESEND_API_KEY"].includes(envVar)) {
      warnings.push(`Optional but recommended environment variable missing: ${envVar}`);
    }
  }

  // Validate URL formats
  if (config.NEXT_PUBLIC_SUPABASE_URL && !isValidUrl(config.NEXT_PUBLIC_SUPABASE_URL)) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL must be a valid URL");
  }

  if (config.NEXT_PUBLIC_SITE_URL && !isValidUrl(config.NEXT_PUBLIC_SITE_URL)) {
    errors.push("NEXT_PUBLIC_SITE_URL must be a valid URL");
  }

  // Validate Supabase keys format
  if (
    config.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !config.NEXT_PUBLIC_SUPABASE_ANON_KEY.startsWith("eyJ")
  ) {
    errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid (should start with eyJ)");
  }

  if (config.SUPABASE_SERVICE_ROLE_KEY && !config.SUPABASE_SERVICE_ROLE_KEY.startsWith("eyJ")) {
    errors.push("SUPABASE_SERVICE_ROLE_KEY appears to be invalid (should start with eyJ)");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    config,
  };
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function requireValidEnvironment(): EnvironmentConfig {
  const validation = validateEnvironment();

  if (!validation.isValid) {
    const errorMessage = [
      "Environment validation failed:",
      ...validation.errors.map((error) => `  - ${error}`),
      "",
      "Please check your .env.local file and ensure all required variables are set.",
    ].join("\n");

    throw new Error(errorMessage);
  }

  if (validation.warnings.length > 0) {
    console.warn("Environment warnings:", validation.warnings);
  }

  return validation.config as EnvironmentConfig;
}

// Validate environment on module load in production
if (process.env.NODE_ENV === "production") {
  const validation = validateEnvironment();
  if (!validation.isValid) {
    console.error("Environment validation failed:", validation.errors);
  }
  if (validation.warnings.length > 0) {
    console.warn("Environment warnings:", validation.warnings);
  }
}
