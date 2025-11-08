"use client";

import Script from "next/script";

export function LocalBusinessSchema(): React.ReactElement {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "The Recovery Machine",
    description:
      "Mobile cold plunge and infrared sauna services delivered to your location. Professional recovery therapy with commercial-grade equipment and certified specialists.",
    url: "https://therecoverymachine.co",
    email: "hello@recoverymachine.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Los Angeles",
      addressRegion: "CA",
      addressCountry: "US",
      areaServed: "Greater Los Angeles Area",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "34.0522",
      longitude: "-118.2437",
    },
    openingHours: "Mo-Su 07:00-21:00",
    priceRange: "$$",
    paymentAccepted: "Credit Card, Debit Card",
    servesCuisine: null,
    serviceType: "Mobile Wellness Services",
    areaServed: [
      {
        "@type": "City",
        name: "Los Angeles",
        addressRegion: "CA",
      },
      {
        "@type": "City",
        name: "Beverly Hills",
        addressRegion: "CA",
      },
      {
        "@type": "City",
        name: "Santa Monica",
        addressRegion: "CA",
      },
      {
        "@type": "City",
        name: "West Hollywood",
        addressRegion: "CA",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Recovery Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Mobile Cold Plunge Therapy",
            description:
              "Professional cold plunge therapy delivered to your location with commercial-grade equipment and certified specialists.",
            serviceType: "Wellness Service",
            offers: {
              "@type": "Offer",
              price: "175",
              priceCurrency: "USD",
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Mobile Infrared Sauna",
            description:
              "Full-spectrum infrared sauna sessions delivered to your location for deep tissue healing and recovery.",
            serviceType: "Wellness Service",
            offers: {
              "@type": "Offer",
              price: "175",
              priceCurrency: "USD",
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Recovery Lite Membership",
            description:
              "2 mobile sessions per month with personalized infrared or cold plunge sessions.",
            serviceType: "Wellness Service",
            offers: {
              "@type": "Offer",
              price: "275",
              priceCurrency: "USD",
              priceSpecification: {
                "@type": "RecurringCharge",
                duration: "P1M",
                frequency: "Monthly",
              },
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Full Spectrum Contrast Membership",
            description:
              "4 mobile sessions per month including full contrast therapy with cold plunge and infrared sauna.",
            serviceType: "Wellness Service",
            offers: {
              "@type": "Offer",
              price: "525",
              priceCurrency: "USD",
              priceSpecification: {
                "@type": "RecurringCharge",
                duration: "P1M",
                frequency: "Monthly",
              },
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Elite Performance Membership",
            description:
              "8 mobile sessions per month with all recovery modalities and priority scheduling.",
            serviceType: "Wellness Service",
            offers: {
              "@type": "Offer",
              price: "850",
              priceCurrency: "USD",
              priceSpecification: {
                "@type": "RecurringCharge",
                duration: "P1M",
                frequency: "Monthly",
              },
            },
          },
        },
      ],
    },
    logo: "https://therecoverymachine.co/logo.png",
    image: "https://therecoverymachine.co/api/og",
    sameAs: ["https://instagram.com/therecoverymachine", "https://twitter.com/therecoverymachine"],
  };

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
