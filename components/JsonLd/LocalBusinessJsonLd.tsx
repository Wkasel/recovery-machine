import { siteMetadata } from "@/config/metadata";

interface LocalBusinessJsonLdProps {
  name?: string;
  description?: string;
  address?: {
    streetAddress?: string;
    addressLocality: string;
    addressRegion: string;
    postalCode?: string;
    addressCountry: string;
  };
  telephone?: string;
  email?: string;
  areaServed?: string[];
  serviceType?: string[];
  priceRange?: string;
  openingHours?: string[];
  geo?: {
    latitude: number;
    longitude: number;
  };
}

export const LocalBusinessJsonLd = ({
  name = "The Recovery Machine",
  description = "Mobile wellness and recovery services including cold plunge therapy and infrared sauna sessions delivered to your location.",
  address = {
    addressLocality: "Los Angeles",
    addressRegion: "CA",
    addressCountry: "US",
  },
  telephone,
  email,
  areaServed = [
    "Los Angeles, CA",
    "Beverly Hills, CA",
    "Santa Monica, CA",
    "West Hollywood, CA",
    "Manhattan Beach, CA",
    "Venice, CA",
    "Malibu, CA",
  ],
  serviceType = [
    "Cold Plunge Therapy",
    "Infrared Sauna",
    "Mobile Wellness Services",
    "Recovery Therapy",
    "Wellness Coaching",
    "Athletic Recovery",
  ],
  priceRange = "$$",
  openingHours = ["Mo-Su 07:00-20:00"],
  geo,
}: LocalBusinessJsonLdProps) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteMetadata.siteUrl}#business`,
    name: name,
    description: description,
    url: siteMetadata.siteUrl,
    logo: siteMetadata.organization.logo,
    image: [
      `${siteMetadata.siteUrl}/images/cold-plunge-mobile.jpg`,
      `${siteMetadata.siteUrl}/images/infrared-sauna-mobile.jpg`,
      `${siteMetadata.siteUrl}/images/recovery-setup.jpg`,
    ],
    address: {
      "@type": "PostalAddress",
      ...address,
    },
    areaServed: areaServed.map((area) => ({
      "@type": "City",
      name: area,
    })),
    serviceType: serviceType,
    priceRange: priceRange,
    openingHours: openingHours,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Recovery & Wellness Services",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Cold Plunge Therapy",
          description: "Mobile cold plunge sessions for recovery and wellness",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Single Cold Plunge Session",
                description: "Professional cold plunge therapy session at your location",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Weekly Cold Plunge Package",
                description: "Weekly cold plunge sessions for optimal recovery",
              },
            },
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "Infrared Sauna",
          description: "Mobile infrared sauna sessions for detox and relaxation",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Single Sauna Session",
                description: "Professional infrared sauna session at your location",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Combined Recovery Package",
                description: "Cold plunge and infrared sauna combination sessions",
              },
            },
          ],
        },
      ],
    },
    ...(telephone && { telephone: telephone }),
    ...(email && { email: email }),
    ...(geo && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: geo.latitude,
        longitude: geo.longitude,
      },
    }),
    sameAs: [
      `https://twitter.com/${siteMetadata.twitterHandle.replace("@", "")}`,
      // Add Instagram, Facebook when available
    ],
    additionalType: [
      "https://schema.org/HealthAndBeautyBusiness",
      "https://schema.org/SportsActivityLocation",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }}
    />
  );
};
