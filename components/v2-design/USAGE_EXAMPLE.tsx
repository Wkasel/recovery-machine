/**
 * Example usage of V2 Design components in a Next.js page
 *
 * This file demonstrates how to import and use the converted components
 * in your Next.js application.
 */

'use client';

import {
  AnnouncementBar,
  Header,
  Hero,
  HowItWorks,
  MediaGallery,
  Pricing,
  BookNow,
  Footer,
} from '@/components/v2-design';

export default function LandingPage() {
  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
      {/* Fixed Elements */}
      <AnnouncementBar />
      <Header />

      {/* Page Sections */}
      <main>
        <Hero />
        <HowItWorks />
        <MediaGallery />
        <Pricing />
        <BookNow />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

/**
 * Alternative: Import individual components
 */
export function AlternativeImport() {
  // Individual imports
  const Hero = require('@/components/v2-design/sections/Hero').default;
  const Header = require('@/components/v2-design/layout/Header').default;

  return (
    <>
      <Header />
      <Hero />
    </>
  );
}

/**
 * Usage with custom props (DottedLine example)
 */
export function CustomDottedLineUsage() {
  const { DottedLine } = require('@/components/v2-design');

  return (
    <div className="flex flex-col items-center">
      {/* Default height (200px) */}
      <DottedLine />

      {/* Custom height */}
      <DottedLine height={150} />

      {/* With custom className */}
      <DottedLine height={100} className="opacity-50" />
    </div>
  );
}

/**
 * Tailwind Configuration Required
 *
 * Add these custom colors to your tailwind.config.js:
 */
const tailwindConfig = {
  theme: {
    extend: {
      colors: {
        'mint': '#E8F5E9',
        'mint-accent': '#A5D6A7',
        'charcoal': '#3E443F',
      },
    },
  },
};

/**
 * Required Dependencies
 *
 * Ensure these are installed:
 *
 * npm install gsap
 * npm install next react react-dom
 *
 * Or:
 *
 * pnpm add gsap
 */

/**
 * Environment Setup
 *
 * 1. Ensure all images are in the /public directory:
 *    - /public/logo.svg
 *    - /public/recovery-van.png
 *
 * 2. Add tailwind colors to your config
 *
 * 3. Import GSAP types if needed:
 *    npm install --save-dev @types/gsap
 */
