'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Segment Analytics Configuration
const SEGMENT_WRITE_KEY = process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY;

// Initialize Segment Analytics
export function SegmentAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!SEGMENT_WRITE_KEY) {
      console.warn('Segment write key not configured');
      return;
    }

    // Load Segment analytics script
    const loadSegment = () => {
      const analytics = (window as any).analytics = (window as any).analytics || [];
      
      if (!analytics.initialize) {
        if (analytics.invoked) {
          console.error('Segment snippet included twice.');
          return;
        }
        
        analytics.invoked = true;
        analytics.methods = [
          'trackSubmit', 'trackClick', 'trackLink', 'trackForm', 'pageview',
          'identify', 'reset', 'group', 'track', 'ready', 'alias', 'debug',
          'page', 'once', 'off', 'on', 'addSourceMiddleware', 'addIntegrationMiddleware',
          'setAnonymousId', 'addDestinationMiddleware'
        ];
        
        analytics.factory = function(method: string) {
          return function() {
            const args = Array.prototype.slice.call(arguments);
            args.unshift(method);
            analytics.push(args);
            return analytics;
          };
        };
        
        for (let i = 0; i < analytics.methods.length; i++) {
          const key = analytics.methods[i];
          analytics[key] = analytics.factory(key);
        }
        
        analytics.load = function(key: string, options?: any) {
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.async = true;
          script.src = `https://cdn.segment.com/analytics.js/v1/${key}/analytics.min.js`;
          
          const first = document.getElementsByTagName('script')[0];
          if (first && first.parentNode) {
            first.parentNode.insertBefore(script, first);
          }
          
          analytics._loadOptions = options;
        };
        
        analytics.SNIPPET_VERSION = '4.15.3';
        analytics.load(SEGMENT_WRITE_KEY);
      }
    };

    loadSegment();
  }, []);

  // Track page views
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.page({
        path: pathname,
        url: window.location.href,
        title: document.title
      });
    }
  }, [pathname]);

  return null;
}

// Enhanced Google Analytics 4 Integration
export function GA4Analytics() {
  useEffect(() => {
    const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
    
    if (!GA4_MEASUREMENT_ID) {
      console.warn('GA4 measurement ID not configured');
      return;
    }

    // Load GA4 script
    const script1 = document.createElement('script');
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    script1.async = true;
    document.head.appendChild(script1);

    // Initialize GA4
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA4_MEASUREMENT_ID}', {
        page_title: document.title,
        page_location: window.location.href
      });
    `;
    document.head.appendChild(script2);

    // Make gtag available globally
    (window as any).gtag = function() {
      (window as any).dataLayer.push(arguments);
    };
  }, []);

  return null;
}

// Combined Analytics Component
export function Analytics() {
  return (
    <>
      <SegmentAnalytics />
      <GA4Analytics />
    </>
  );
}

// Analytics Event Tracking Functions
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    // Segment tracking
    if ((window as any).analytics) {
      (window as any).analytics.track(eventName, properties);
    }
    
    // GA4 tracking
    if ((window as any).gtag) {
      (window as any).gtag('event', eventName, properties);
    }
  }
};

export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).analytics) {
    (window as any).analytics.identify(userId, traits);
  }
};

export const trackBookingFlow = {
  startBooking: () => trackEvent('booking_started'),
  selectService: (service: string) => trackEvent('booking_service_selected', { service }),
  enterAddress: () => trackEvent('booking_address_entered'),
  selectDate: (date: string) => trackEvent('booking_date_selected', { date }),
  submitPayment: (amount: number) => trackEvent('booking_payment_submitted', { amount }),
  completeBooking: (bookingId: string, amount: number) => trackEvent('booking_completed', { 
    booking_id: bookingId,
    revenue: amount
  }),
  abandonBooking: (step: string) => trackEvent('booking_abandoned', { step })
};

export const trackSocialProof = {
  instagramClick: (postId?: string) => trackEvent('instagram_post_clicked', { post_id: postId }),
  instagramFollow: () => trackEvent('instagram_follow_clicked'),
  testimonialView: (testimonialId: string) => trackEvent('testimonial_viewed', { testimonial_id: testimonialId }),
  reviewSubmit: (rating: number) => trackEvent('review_submitted', { rating })
};

export const trackNavigation = {
  ctaClick: (cta_text: string, location: string) => trackEvent('cta_clicked', { cta_text, location }),
  navClick: (nav_item: string) => trackEvent('navigation_clicked', { nav_item }),
  heroAction: (action: string) => trackEvent('hero_action', { action })
};