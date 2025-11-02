'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';

  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // GSAP animations on mount
  useEffect(() => {
    if (!headerRef.current || !navRef.current) return;

    // Animate header on mount - fade in and slide down
    gsap.fromTo(
      navRef.current,
      { y: -20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2
      }
    );

    // Hide/show header on scroll
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateHeader = () => {
      const scrollY = window.scrollY;

      if (scrollY > 100) {
        if (scrollY > lastScrollY) {
          // Scrolling down - hide header
          gsap.to(navRef.current, {
            y: -100,
            duration: 0.3,
            ease: 'power2.inOut'
          });
        } else {
          // Scrolling up - show header
          gsap.to(navRef.current, {
            y: 0,
            duration: 0.3,
            ease: 'power2.inOut'
          });
        }
      } else {
        // At top of page - always show
        gsap.to(navRef.current, {
          y: 0,
          duration: 0.3,
          ease: 'power2.inOut'
        });
      }

      lastScrollY = scrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Animate mobile menu
  useEffect(() => {
    if (!mobileMenuRef.current) return;

    if (mobileMenuOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [mobileMenuOpen]);

  const closeMobileMenu = (): void => setMobileMenuOpen(false);

  /**
   * Smart navigation handler for section links
   * - If on homepage: smooth scroll to section
   * - If on other page: navigate to homepage then scroll to section
   */
  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string): void => {
    e.preventDefault();

    if (isHomePage) {
      // Already on homepage - smooth scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        // Temporarily disable scroll-snap for smooth scrolling
        const mainElement = document.querySelector('main');
        const htmlElement = document.documentElement;
        const originalScrollSnapType = mainElement?.style.scrollSnapType || '';
        const originalScrollBehavior = htmlElement.style.scrollBehavior;

        if (mainElement) mainElement.style.scrollSnapType = 'none';
        htmlElement.style.scrollBehavior = 'auto';

        const headerHeight = navRef.current?.offsetHeight || 0;
        const offsetTop = element.offsetTop - headerHeight - 80; // Extra padding

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
    } else {
      // On different page - navigate to homepage with hash
      router.push(`/#${sectionId}`);
    }

    closeMobileMenu();
  };

  /**
   * Handle homepage navigation with smooth scroll
   */
  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    if (isHomePage) {
      e.preventDefault();
      gsap.to(window, {
        scrollTo: { y: 0, autoKill: true },
        duration: 1,
        ease: 'power2.inOut'
      });
    }
    // If not on homepage, let Next.js Link handle the navigation
    closeMobileMenu();
  };

  return (
    <header ref={headerRef} className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-3 md:px-6">
      {/* Skip to main content link for keyboard users (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] bg-mint-accent text-charcoal px-4 py-2 rounded-full font-medium"
      >
        Skip to main content
      </a>
      <nav
        ref={navRef}
        className="rounded-full px-4 md:px-8 py-3 md:py-4 flex items-center justify-between shadow-2xl backdrop-blur-sm"
        style={{ backgroundColor: '#3E443F' }}
        aria-label="Main navigation"
      >
        <Link
          href="/"
          onClick={handleHomeClick}
          className="flex items-center h-8 md:h-10 cursor-pointer"
        >
          <Image
            src="/logo.svg"
            alt="The Recovery Machine"
            width={120}
            height={40}
            className="h-full w-auto brightness-0 invert"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="/#how-it-works"
            onClick={(e) => handleSectionClick(e, 'how-it-works')}
            className="text-white text-sm font-medium hover:text-mint-accent transition-all duration-300 hover:scale-105"
          >
            HOW IT WORKS
          </a>
          <a
            href="/#pricing"
            onClick={(e) => handleSectionClick(e, 'pricing')}
            className="text-white text-sm font-medium hover:text-mint-accent transition-all duration-300 hover:scale-105"
          >
            PRICING
          </a>
          <Link
            href="/profile"
            className="text-white text-sm font-medium hover:text-mint-accent transition-all duration-300 hover:scale-105"
          >
            MY ACCOUNT
          </Link>
          <Link
            href="/book"
            className="bg-mint-accent text-black text-sm font-medium px-6 py-2 rounded-full hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-lg"
          >
            BOOK NOW
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-3">
          <Link
            href="/book"
            className="bg-mint-accent text-black text-xs font-medium px-4 py-2 rounded-full hover:bg-opacity-90 transition-all duration-300"
          >
            BOOK NOW
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-2"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          className="md:hidden mt-3 rounded-2xl shadow-2xl backdrop-blur-sm overflow-hidden"
          style={{ backgroundColor: '#3E443F' }}
          role="menu"
          aria-label="Mobile navigation menu"
        >
          <div className="flex flex-col py-2" role="none">
            <a
              href="/#how-it-works"
              onClick={(e) => handleSectionClick(e, 'how-it-works')}
              className="text-white text-sm font-medium px-6 py-3 hover:bg-mint-accent/10 transition-colors"
            >
              HOW IT WORKS
            </a>
            <a
              href="/#pricing"
              onClick={(e) => handleSectionClick(e, 'pricing')}
              className="text-white text-sm font-medium px-6 py-3 hover:bg-mint-accent/10 transition-colors"
            >
              PRICING
            </a>
            <Link
              href="/profile"
              onClick={closeMobileMenu}
              className="text-white text-sm font-medium px-6 py-3 hover:bg-mint-accent/10 transition-colors"
            >
              MY ACCOUNT
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
