'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * HashScrollHandler - Client component that handles hash-based navigation
 *
 * When a user navigates to /#section from another page, this component
 * detects the hash and smoothly scrolls to that section using native browser APIs.
 *
 * Optimized for performance - no heavy animation libraries needed.
 */
export default function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // Only run on homepage
    if (pathname !== '/') return;

    // Check if there's a hash in the URL
    const hash = window.location.hash;
    if (!hash) return;

    // Wait a bit for the page to render
    const timeout = setTimeout(() => {
      const sectionId = hash.replace('#', '');
      const element = document.getElementById(sectionId);

      if (element) {
        // Get header height for offset
        const header = document.querySelector('header nav');
        const headerHeight = header?.getBoundingClientRect().height || 0;
        const offsetTop = element.offsetTop - headerHeight - 80; // Extra padding

        // Use native smooth scroll (better performance, no extra bundle size)
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }, 100); // Small delay to ensure page is rendered

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null; // This component doesn't render anything
}
