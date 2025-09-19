// Custom meta tags for wellness business optimization
export interface WellnessMetaTags {
  businessType?: string;
  serviceArea?: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  operatingHours?: string;
  priceRange?: string;
  languages?: string[];
  certifications?: string[];
}

export function generateWellnessMetaTags({
  businessType = "Mobile Wellness Service",
  serviceArea = ["Los Angeles", "Beverly Hills", "Santa Monica"],
  coordinates = { latitude: 34.0522, longitude: -118.2437 },
  operatingHours = "Mo-Su 07:00-20:00",
  priceRange = "$$",
  languages = ["en", "es"],
  certifications = ["Professional Wellness Certification"]
}: WellnessMetaTags = {}) {
  
  return {
    // Geographic metadata
    'geo.region': 'US-CA',
    'geo.placename': serviceArea.join(', '),
    'geo.position': `${coordinates.latitude};${coordinates.longitude}`,
    'ICBM': `${coordinates.latitude}, ${coordinates.longitude}`,
    
    // Business metadata
    'business.contact_data.street_address': serviceArea[0] + ', CA',
    'business.contact_data.locality': serviceArea[0],
    'business.contact_data.region': 'CA',
    'business.contact_data.country_name': 'United States',
    'business.hours': operatingHours,
    'business.price_range': priceRange,
    'business.type': businessType,
    
    // Service metadata
    'service.category': 'Health and Wellness',
    'service.type': 'Mobile Therapy Services',
    'service.areas': serviceArea.join(', '),
    
    // Language and accessibility
    'language': languages.join(', '),
    'content-language': languages[0],
    
    // Mobile optimization
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Recovery Machine',
    'application-name': 'Recovery Machine',
    'msapplication-TileColor': '#0066cc',
    'theme-color': '#0066cc',
    
    // SEO optimization
    'revisit-after': '7 days',
    'distribution': 'global',
    'rating': 'general',
    'robots': 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    
    // Social media optimization
    'fb:app_id': process.env.FACEBOOK_APP_ID || '',
    'twitter:app:name:iphone': 'Recovery Machine',
    'twitter:app:name:ipad': 'Recovery Machine',
    'twitter:app:name:googleplay': 'Recovery Machine',
    
    // Business verification
    'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION || '',
    'msvalidate.01': process.env.BING_SITE_VERIFICATION || '',
    'yandex-verification': process.env.YANDEX_VERIFICATION || '',
    
    // Performance hints
    'preconnect': [
      'https://fonts.googleapis.com',
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com'
    ].join(', '),
    
    // Security
    'referrer': 'origin-when-cross-origin',
    'content-security-policy': "default-src 'self'; script-src 'self' 'unsafe-inline' *.google-analytics.com *.googletagmanager.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: *.google-analytics.com *.googletagmanager.com",
  };
}

// Generate meta tags for specific wellness pages
export function getPageSpecificMetaTags(pageType: string): Record<string, string> {
  const baseTags = generateWellnessMetaTags();
  
  switch (pageType) {
    case 'home':
      return {
        ...baseTags,
        'page.type': 'homepage',
        'page.category': 'wellness-services',
        'service.highlighted': 'Cold Plunge, Infrared Sauna',
      };
      
    case 'services':
      return {
        ...baseTags,
        'page.type': 'services',
        'page.category': 'service-catalog',
        'service.types': 'Cold Plunge Therapy, Infrared Sauna, Recovery Sessions',
      };
      
    case 'booking':
      return {
        ...baseTags,
        'page.type': 'booking',
        'page.category': 'conversion',
        'conversion.goal': 'session-booking',
      };
      
    case 'contact':
      return {
        ...baseTags,
        'page.type': 'contact',
        'page.category': 'support',
        'contact.methods': 'Phone, Email, Online Form',
      };
      
    default:
      return baseTags;
  }
}

// Helper function to convert meta tags to JSX meta elements
export function metaTagsToElements(tags: Record<string, string>) {
  return Object.entries(tags)
    .filter(([_, value]) => value) // Only include tags with values
    .map(([name, content]) => ({ name, content }));
}