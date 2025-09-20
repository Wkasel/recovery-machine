// Local SEO optimization for wellness business
export interface LocalBusinessData {
  name: string;
  description: string;
  address: {
    streetAddress?: string;
    addressLocality: string;
    addressRegion: string;
    postalCode?: string;
    addressCountry: string;
  };
  telephone?: string;
  email?: string;
  website: string;
  serviceAreas: string[];
  services: ServiceOffering[];
  openingHours: OpeningHours[];
  geo?: {
    latitude: number;
    longitude: number;
  };
  priceRange: string;
  paymentAccepted: string[];
  languages: string[];
}

export interface ServiceOffering {
  name: string;
  description: string;
  category: string;
  price?: {
    value: number;
    currency: string;
  };
  duration?: string;
  benefits: string[];
}

export interface OpeningHours {
  dayOfWeek: string;
  opens: string;
  closes: string;
}

// Service areas for The Recovery Machine
export const serviceAreas = [
  {
    name: "Los Angeles",
    state: "CA",
    zipCodes: ["90210", "90211", "90212", "90401", "90402", "90403"],
    coordinates: { lat: 34.0522, lng: -118.2437 },
  },
  {
    name: "Beverly Hills",
    state: "CA",
    zipCodes: ["90210", "90211", "90212"],
    coordinates: { lat: 34.0736, lng: -118.4004 },
  },
  {
    name: "Santa Monica",
    state: "CA",
    zipCodes: ["90401", "90402", "90403", "90404", "90405"],
    coordinates: { lat: 34.0195, lng: -118.4912 },
  },
  {
    name: "West Hollywood",
    state: "CA",
    zipCodes: ["90069", "90048"],
    coordinates: { lat: 34.09, lng: -118.3617 },
  },
  {
    name: "Manhattan Beach",
    state: "CA",
    zipCodes: ["90266"],
    coordinates: { lat: 33.8847, lng: -118.4109 },
  },
  {
    name: "Venice",
    state: "CA",
    zipCodes: ["90291", "90292"],
    coordinates: { lat: 33.985, lng: -118.4695 },
  },
  {
    name: "Malibu",
    state: "CA",
    zipCodes: ["90265"],
    coordinates: { lat: 34.0259, lng: -118.7798 },
  },
];

// Service offerings for structured data
export const wellnessServices: ServiceOffering[] = [
  {
    name: "Mobile Cold Plunge Therapy",
    description:
      "Professional cold plunge sessions delivered to your location for enhanced recovery and performance",
    category: "Recovery Therapy",
    price: { value: 150, currency: "USD" },
    duration: "30-45 minutes",
    benefits: [
      "Reduced inflammation",
      "Enhanced recovery",
      "Improved circulation",
      "Stress relief",
      "Boosted immunity",
    ],
  },
  {
    name: "Mobile Infrared Sauna",
    description:
      "Premium infrared sauna sessions at your location for detoxification and relaxation",
    category: "Wellness Therapy",
    price: { value: 200, currency: "USD" },
    duration: "45-60 minutes",
    benefits: [
      "Deep detoxification",
      "Improved circulation",
      "Muscle relaxation",
      "Better sleep",
      "Skin health",
    ],
  },
  {
    name: "Combined Recovery Package",
    description: "Cold plunge and infrared sauna combination for complete recovery experience",
    category: "Premium Recovery",
    price: { value: 300, currency: "USD" },
    duration: "90 minutes",
    benefits: [
      "Complete recovery protocol",
      "Maximum therapeutic benefit",
      "Enhanced performance",
      "Optimal wellness",
    ],
  },
  {
    name: "Weekly Wellness Program",
    description: "Regular weekly sessions for consistent recovery and wellness maintenance",
    category: "Wellness Program",
    price: { value: 500, currency: "USD" },
    duration: "Ongoing",
    benefits: [
      "Consistent recovery",
      "Performance optimization",
      "Preventive wellness",
      "Lifestyle enhancement",
    ],
  },
];

// Generate local business schema markup
export function generateLocalBusinessSchema(businessData: LocalBusinessData) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${businessData.website}#business`,
    name: businessData.name,
    description: businessData.description,
    url: businessData.website,
    address: {
      "@type": "PostalAddress",
      ...businessData.address,
    },
    areaServed: businessData.serviceAreas.map((area) => ({
      "@type": "City",
      name: area,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Wellness Services",
      itemListElement: businessData.services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
          category: service.category,
          provider: {
            "@type": "LocalBusiness",
            name: businessData.name,
          },
        },
        ...(service.price && {
          price: service.price.value,
          priceCurrency: service.price.currency,
        }),
      })),
    },
    openingHoursSpecification: businessData.openingHours.map((hours) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: hours.dayOfWeek,
      opens: hours.opens,
      closes: hours.closes,
    })),
    priceRange: businessData.priceRange,
    paymentAccepted: businessData.paymentAccepted,
    knowsLanguage: businessData.languages,
    ...(businessData.telephone && { telephone: businessData.telephone }),
    ...(businessData.email && { email: businessData.email }),
    ...(businessData.geo && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: businessData.geo.latitude,
        longitude: businessData.geo.longitude,
      },
    }),
    additionalType: [
      "https://schema.org/HealthAndBeautyBusiness",
      "https://schema.org/SportsActivityLocation",
    ],
  };
}

// Generate service-specific landing pages metadata
export function generateServicePageMetadata(service: ServiceOffering, area?: string) {
  const areaText = area ? ` in ${area}` : "";
  const title = `${service.name}${areaText} | The Recovery Machine`;
  const description = `${service.description}${areaText}. ${service.benefits.slice(0, 3).join(", ")}. Book your session today.`;

  return {
    title,
    description,
    keywords: [
      service.name.toLowerCase(),
      service.category.toLowerCase(),
      ...service.benefits.map((b) => b.toLowerCase()),
      ...(area ? [area.toLowerCase()] : []),
    ],
  };
}

// Local SEO content optimization
export const localSEOContent = {
  serviceCities: serviceAreas.map((area) => area.name),
  businessHours: "Monday-Sunday: 7:00 AM - 8:00 PM",
  serviceRadius: "30 miles from Los Angeles",
  emergencyServices: false,
  wheelchairAccessible: true,
  parkingAvailable: "Street parking varies by location",
  paymentMethods: ["Credit Card", "Debit Card", "Cash", "Venmo", "Zelle"],
  languages: ["English", "Spanish"],
  certifications: [
    "Professional Wellness Certification",
    "Cold Therapy Specialist",
    "Infrared Sauna Technician",
  ],
  serviceAreas: serviceAreas,
};
