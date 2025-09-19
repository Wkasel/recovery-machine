import { siteMetadata } from "@/config/metadata";

interface ServiceJsonLdProps {
  serviceName: string;
  description: string;
  serviceType: string;
  areaServed?: string[];
  provider?: {
    name: string;
    url: string;
  };
  offers?: {
    price?: string;
    priceCurrency?: string;
    description?: string;
  }[];
}

export const ServiceJsonLd = ({
  serviceName,
  description,
  serviceType,
  areaServed = [
    "Los Angeles, CA",
    "Beverly Hills, CA",
    "Santa Monica, CA", 
    "West Hollywood, CA",
    "Manhattan Beach, CA",
    "Venice, CA",
    "Malibu, CA"
  ],
  provider = {
    name: siteMetadata.organization.name,
    url: siteMetadata.siteUrl
  },
  offers = []
}: ServiceJsonLdProps) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName,
    "description": description,
    "serviceType": serviceType,
    "provider": {
      "@type": "LocalBusiness",
      "name": provider.name,
      "url": provider.url
    },
    "areaServed": areaServed.map(area => ({
      "@type": "City", 
      "name": area
    })),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `${serviceName} Offers`,
      "itemListElement": offers.map(offer => ({
        "@type": "Offer",
        "description": offer.description,
        ...(offer.price && {
          "price": offer.price,
          "priceCurrency": offer.priceCurrency || "USD"
        })
      }))
    },
    "category": "Health and Wellness",
    "serviceOutput": {
      "@type": "Thing",
      "name": "Improved Recovery and Wellness"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }}
    />
  );
};

// Predefined services for the Recovery Machine
export const ColdPlungeServiceJsonLd = () => (
  <ServiceJsonLd
    serviceName="Mobile Cold Plunge Therapy"
    description="Professional cold plunge therapy sessions delivered to your location for optimal recovery, reduced inflammation, and enhanced performance."
    serviceType="Cold Water Therapy"
    offers={[
      {
        description: "Single Cold Plunge Session",
        price: "150",
        priceCurrency: "USD"
      },
      {
        description: "Weekly Cold Plunge Package", 
        price: "500",
        priceCurrency: "USD"
      }
    ]}
  />
);

export const InfraredSaunaServiceJsonLd = () => (
  <ServiceJsonLd
    serviceName="Mobile Infrared Sauna Therapy"
    description="Professional infrared sauna sessions at your location for detoxification, relaxation, and improved circulation."
    serviceType="Infrared Sauna Therapy"
    offers={[
      {
        description: "Single Infrared Sauna Session",
        price: "200", 
        priceCurrency: "USD"
      },
      {
        description: "Combined Recovery Package",
        price: "300",
        priceCurrency: "USD"
      }
    ]}
  />
);