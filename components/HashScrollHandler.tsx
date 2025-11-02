'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollToPlugin);
}

/**
 * HashScrollHandler - Client component that handles hash-based navigation
 *
 * When a user navigates to /#section from another page, this component
 * detects the hash and smoothly scrolls to that section.
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
        // Temporarily disable scroll-snap for smooth scrolling
        const mainElement = document.querySelector('main');
        const htmlElement = document.documentElement;
        const originalScrollSnapType = mainElement?.style.scrollSnapType || '';
        const originalScrollBehavior = htmlElement.style.scrollBehavior;

        if (mainElement) mainElement.style.scrollSnapType = 'none';
        htmlElement.style.scrollBehavior = 'auto';

        // Get header height for offset
        const header = document.querySelector('header nav');
        const headerHeight = header?.getBoundingClientRect().height || 0;
        const offsetTop = element.offsetTop - headerHeight - 80; // Extra padding

        // Smooth scroll with GSAP
        gsap.to(window, {
          scrollTo: { y: offsetTop, autoKill: true },
          duration: 1,
          ease: 'power2.inOut',
          onComplete: () => {
            // Re-enable scroll-snap after animation
            if (mainElement) mainElement.style.scrollSnapType = originalScrollSnapType || 'y proximity';
            htmlElement.style.scrollBehavior = originalScrollBehavior;
          }
        });
      }
    }, 100); // Small delay to ensure page is rendered

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null; // This component doesn't render anything
}
