import { withSentryConfig } from "@sentry/nextjs";
import createWithBundleAnalyzer from "@next/bundle-analyzer";

/** @type {import('next').NextConfig} */
const nextConfig = (phase) => {
  const config = {
    reactStrictMode: true,
    sentry: {
      hideSourceMaps: process.env.NODE_ENV === "production",
    },
  };

  if (phase === "development") {
    config.logging = {
      fetches: {
        fullUrl: true,
      },
    };
  }

  const withBundleAnalyzer = createWithBundleAnalyzer({
    enabled: process.env.ANALYZE === "true",
    openAnalyzer: process.env.ANALYZE === "true" && process.env.OPEN_ANALYZER === "true",
  });

  // Sentry webpack plugin options
  const sentryWebpackPluginOptions = {
    silent: true, // Suppresses all logs
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options
  };

  // Make sure adding Sentry options is the last code to run before exporting
  return withSentryConfig(withBundleAnalyzer(config), sentryWebpackPluginOptions);
};

export default nextConfig;
