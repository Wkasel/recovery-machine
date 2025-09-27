import { siteMetadata } from "@/config/metadata";

interface WellnessBusinessSchemaProps {
  services?: Array<{
    name: string;
    description: string;
    price?: string;
    duration?: string;
  }>;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    latitude?: number;
    longitude?: number;
  };
}

export function WellnessBusinessSchema({ 
  services = [],
  location = {}
}: WellnessBusinessSchemaProps) {
  const defaultServices = [
    {
      name: "Mobile Cold Plunge Therapy",
      description: "Professional cold plunge therapy delivered to your location with certified recovery specialists",
      duration: "45 minutes"
    },
    {
      name: "Mobile Infrared Sauna Sessions",
      description: "Full-spectrum infrared sauna therapy with professional-grade equipment and guidance",
      duration: "45 minutes"
    },
    {
      name: "Combined Recovery Sessions",
      description: "Complete recovery experience combining cold plunge and infrared sauna therapy",
      duration: "90 minutes"
    }
  ];

  const businessServices = services.length > 0 ? services : defaultServices;

  const schema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HealthAndBeautyBusiness", "SpaOrBeauty"],
    "@id": `${siteMetadata.siteUrl}/#business`,
    name: siteMetadata.organization.name,
    alternateName: ["Recovery Machine", "The Recovery Machine"],
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteMetadata.siteUrl}/logo.png`,
      width: 400,
      height: 400
    },
    image: [
      `${siteMetadata.siteUrl}/og-image.jpg`,
      `${siteMetadata.siteUrl}/services-image.jpg`,
      `${siteMetadata.siteUrl}/equipment-image.jpg`
    ],
    telephone: "+1-555-RECOVERY",
    email: "info@therecoverymachine.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: location.city || "Los Angeles",
      addressRegion: location.state || "CA",
      addressCountry: "US",
      ...(location.address && { streetAddress: location.address }),
      ...(location.zipCode && { postalCode: location.zipCode })
    },
    ...(location.latitude && location.longitude && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: location.latitude,
        longitude: location.longitude
      }
    }),
    areaServed: [
      {
        "@type": "State",
        name: "California"
      },
      {
        "@type": "City",
        name: "Los Angeles"
      },
      {
        "@type": "City", 
        name: "Beverly Hills"
      },
      {
        "@type": "City",
        name: "Santa Monica"
      },
      {
        "@type": "City",
        name: "West Hollywood"
      }
    ],
    serviceType: [
      "Mobile Wellness Services",
      "Cold Plunge Therapy", 
      "Infrared Sauna",
      "Recovery Therapy",
      "Mobile Spa Services"
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Recovery Services",
      itemListElement: businessServices.map((service, index) => ({
        "@type": "Offer",
        "@id": `${siteMetadata.siteUrl}/#service-${index + 1}`,
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
          category: "Wellness Services",
          ...(service.duration && { 
            duration: service.duration.includes('PT') ? service.duration : `PT${service.duration}` 
          })
        },
        ...(service.price && {
          priceSpecification: {
            "@type": "PriceSpecification",
            price: service.price,
            priceCurrency: "USD"
          }
        }),
        availability: "https://schema.org/InStock",
        validFrom: new Date().toISOString(),
        seller: {
          "@type": "Organization",
          name: siteMetadata.organization.name
        }
      }))
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "19:00"
      },
      {
        "@type": "OpeningHoursSpecification", 
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "08:00",
        closes: "18:00"
      }
    ],
    sameAs: [
      `https://twitter.com/${siteMetadata.twitterHandle.replace('@', '')}`,
      `https://instagram.com/${siteMetadata.twitterHandle.replace('@', '')}`,
      `https://facebook.com/${siteMetadata.twitterHandle.replace('@', '')}`
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: "+1-555-RECOVERY",
        email: "info@therecoverymachine.com",
        availableLanguage: ["English", "Spanish"],
        areaServed: "US-CA",
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "07:00",
          closes: "21:00"
        }
      },
      {
        "@type": "ContactPoint",
        contactType: "booking",
        telephone: "+1-555-RECOVERY",
        email: "bookings@therecoverymachine.com",
        availableLanguage: ["English"],
        areaServed: "US-CA"
      }
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1"
    },
    review: [
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5"
        },
        author: {
          "@type": "Person",
          name: "Professional Athlete"
        },
        reviewBody: "The convenience of having professional recovery equipment delivered to my home has transformed my training routine. The specialists are knowledgeable and the equipment is top-notch.",
        datePublished: "2024-12-01"
      }
    ],
    foundingDate: "2024",
    numberOfEmployees: "2-10",
    knowsAbout: [
      "Cold Plunge Therapy",
      "Infrared Sauna Therapy",
      "Recovery Protocols",
      "Wellness Services",
      "Mobile Spa Services",
      "Athletic Recovery",
      "Heat Therapy",
      "Cryotherapy"
    ],
    memberOf: [
      {
        "@type": "Organization",
        name: "California Wellness Association"
      },
      {
        "@type": "Organization", 
        name: "Mobile Spa Services Alliance"
      }
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Professional Certification",
        educationalLevel: "Professional",
        recognizedBy: {
          "@type": "Organization",
          name: "National Board of Wellness Professionals"
        }
      }
    ],
    potentialAction: [
      {
        "@type": "ReserveAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteMetadata.siteUrl}/book`,
          inLanguage: "en-US",
          actionPlatform: [
            "https://schema.org/DesktopWebPlatform",
            "https://schema.org/MobileWebPlatform"
          ]
        },
        result: {
          "@type": "Reservation",
          name: "Recovery Session Booking"
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

export default WellnessBusinessSchema;