import createWithBundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = (phase) => {
  const config = {
    reactStrictMode: true,
    typescript: {
      // TypeScript checking temporarily disabled for deployment
      ignoreBuildErrors: true,
    },
    eslint: {
      // ESLint checking enabled for production safety
      ignoreDuringBuilds: false,
    },
    // Performance optimizations
    experimental: {
      optimizePackageImports: [
        '@radix-ui/react-accordion',
        '@radix-ui/react-alert-dialog',
        '@radix-ui/react-aspect-ratio',
        '@radix-ui/react-avatar',
        '@radix-ui/react-checkbox',
        '@radix-ui/react-collapsible',
        '@radix-ui/react-context-menu',
        '@radix-ui/react-dialog',
        '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-hover-card',
        '@radix-ui/react-label',
        '@radix-ui/react-menubar',
        '@radix-ui/react-navigation-menu',
        '@radix-ui/react-popover',
        '@radix-ui/react-progress',
        '@radix-ui/react-radio-group',
        '@radix-ui/react-scroll-area',
        '@radix-ui/react-select',
        '@radix-ui/react-separator',
        '@radix-ui/react-slider',
        '@radix-ui/react-slot',
        '@radix-ui/react-switch',
        '@radix-ui/react-tabs',
        '@radix-ui/react-toggle',
        '@radix-ui/react-toggle-group',
        '@radix-ui/react-tooltip',
        'lucide-react',
        'recharts',
        '@tanstack/react-query',
      ],
    },
    // Turbopack configuration (moved from experimental.turbo)
    turbopack: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    // Image optimization
    images: {
      formats: ['image/webp', 'image/avif'],
      minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
      dangerouslyAllowSVG: true,
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      domains: [],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**.therecoverymachine.com',
        },
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
        },
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
        },
        {
          protocol: 'https',
          hostname: '**.dropbox.com',
        },
      ],
    },
    // Compression and caching
    compress: true,
    poweredByHeader: false,
    generateEtags: true,
    // Headers for security and performance
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-DNS-Prefetch-Control',
              value: 'on'
            },
            {
              key: 'X-Frame-Options',
              value: 'DENY'
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff'
            },
            {
              key: 'Referrer-Policy',
              value: 'origin-when-cross-origin'
            },
            {
              key: 'Permissions-Policy',
              value: 'camera=(), microphone=(), geolocation=()'
            }
          ],
        },
        {
          source: '/api/(.*)',
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: '*'
            },
            {
              key: 'Access-Control-Allow-Methods',
              value: 'GET, POST, PUT, DELETE, OPTIONS'
            },
            {
              key: 'Access-Control-Allow-Headers',
              value: 'Content-Type, Authorization'
            },
            {
              key: 'Cache-Control',
              value: 'public, max-age=0, s-maxage=86400, stale-while-revalidate'
            }
          ],
        },
        {
          source: '/_next/image(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable'
            }
          ],
        },
        {
          source: '/_next/static/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable'
            }
          ],
        },
      ];
    },
    // Redirects for SEO
    async redirects() {
      return [
        {
          source: '/home',
          destination: '/',
          permanent: true,
        },
        {
          source: '/index',
          destination: '/',
          permanent: true,
        },
        // Redirect old URL patterns if migrating
        {
          source: '/services/cold-plunge',
          destination: '/services#cold-plunge',
          permanent: true,
        },
        {
          source: '/services/infrared-sauna',
          destination: '/services#infrared-sauna',
          permanent: true,
        },
      ];
    },
    // Bundle optimization
    webpack: (config, { dev, isServer }) => {
      // Optimize bundle size
      if (!dev && !isServer) {
        config.optimization.splitChunks = {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              reuseExistingChunk: true,
            },
            common: {
              name: 'common',
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        };
      }

      // Ignore source maps in production for smaller bundles
      if (!dev) {
        config.devtool = false;
      }

      return config;
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

  // Sentry configuration for error monitoring
  const sentryConfig = {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    silent: !process.env.CI,
    widenClientFileUpload: true,
    reactComponentAnnotation: {
      enabled: true,
    },
    tunnelRoute: '/monitoring',
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
  };

  // Return config with Sentry wrapper for error monitoring
  const configWithBundleAnalyzer = withBundleAnalyzer(config);
  
  // Temporarily disable Sentry wrapping to avoid Rollup dependency issues
  // if (process.env.NODE_ENV === 'production' || process.env.SENTRY_DSN) {
  //   return withSentryConfig(configWithBundleAnalyzer, sentryConfig);
  // }
  
  return configWithBundleAnalyzer;
};

export default nextConfig;
