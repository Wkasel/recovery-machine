import { Metadata } from "next";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingPricing } from "@/components/landing/LandingPricing";
import { LandingTestimonials } from "@/components/landing/LandingTestimonials";
import { LandingFAQ } from "@/components/landing/LandingFAQ";
import { Snowflake, Flame, Trophy, Shield, Clock, Star, MapPin, Thermometer } from "lucide-react";

export const metadata: Metadata = {
  title: "Mobile Recovery Beverly Hills | Cold Plunge + Sauna Delivery | The Recovery Machine",
  description: "Premium mobile recovery services in Beverly Hills. Professional cold plunge and infrared sauna therapy delivered to your home or office. Same-day booking for Beverly Hills residents.",
  keywords: "mobile recovery Beverly Hills, cold plunge Beverly Hills, infrared sauna delivery Beverly Hills, wellness services 90210, luxury recovery therapy",
  openGraph: {
    title: "Mobile Recovery Beverly Hills - Luxury Wellness Delivered",
    description: "Experience premium mobile recovery therapy in Beverly Hills. Professional cold plunge and infrared sauna services delivered to your door with white-glove service.",
    url: "https://therecoverymachine.com/locations/beverly-hills",
    siteName: "The Recovery Machine",
    images: [
      {
        url: "/beverly-hills-recovery-og.jpg",
        width: 1200,
        height: 630,
        alt: "Mobile Recovery Beverly Hills"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Mobile Recovery Beverly Hills | Luxury Wellness Delivered",
    description: "Premium cold plunge and sauna therapy delivered to Beverly Hills homes and offices. Book today!",
    images: ["/beverly-hills-recovery-og.jpg"]
  },
  alternates: {
    canonical: "https://therecoverymachine.com/locations/beverly-hills"
  }
};

const beverlyHillsFeatures = [
  {
    icon: Snowflake,
    title: "Premium Cold Plunge Beverly Hills",
    description: "Experience luxury cold water therapy with our professional-grade mobile service designed for Beverly Hills' discerning residents.",
    benefits: [
      "White-glove service and setup",
      "Medical-grade temperature control",
      "Concierge-level customer care",
      "Flexible scheduling for busy lifestyles"
    ]
  },
  {
    icon: Flame,
    title: "Luxury Infrared Sauna Delivery",
    description: "Transform your Beverly Hills home into a wellness sanctuary with our premium infrared sauna service featuring full-spectrum technology.",
    benefits: [
      "Full-spectrum infrared heating",
      "Spacious luxury accommodations",
      "Premium amenities included",
      "Professional wellness consultation"
    ]
  },
  {
    icon: Trophy,
    title: "Executive Recovery Programs",
    description: "Tailored wellness solutions for Beverly Hills executives, entrepreneurs, and high-achievers who demand the best in recovery therapy.",
    benefits: [
      "Executive-level service standards",
      "Confidential and discreet service",
      "Flexible corporate packages",
      "Performance optimization focus"
    ]
  }
];

const beverlyHillsPricing = [
  {
    name: "Beverly Hills Cold Plunge",
    description: "Premium cold water therapy with luxury service",
    price: "$175",
    period: "per session",
    features: [
      "30-minute premium cold plunge session",
      "White-glove setup and service",
      "Temperature customization (38-55°F)",
      "Luxury towels and amenities",
      "Professional safety monitoring",
      "Post-session wellness consultation"
    ],
    cta: "Book Cold Plunge",
    highlight: {
      text: "Most Popular",
      icon: Snowflake
    }
  },
  {
    name: "Beverly Hills Sauna Experience",
    description: "Luxury infrared sauna therapy at your location",
    price: "$200",
    period: "per session",
    features: [
      "45-minute full-spectrum infrared sauna",
      "Premium spa-quality setup",
      "Luxury amenities and refreshments",
      "Personal wellness attendant",
      "Flexible temperature control",
      "Exclusive Beverly Hills service"
    ],
    cta: "Book Sauna Session",
    highlight: {
      text: "Luxury Experience",
      icon: Flame
    }
  }
];

const beverlyHillsTestimonials = [
  {
    id: 1,
    name: "Alexandra Sterling",
    role: "Entertainment Executive",
    location: "Beverly Hills, CA 90210",
    rating: 5,
    quote: "The Recovery Machine provides exactly the level of service you'd expect in Beverly Hills. Professional, discreet, and incredibly effective. The cold plunge sessions have become essential to my weekly routine.",
    verified: true,
    sessionCount: "30+ sessions",
    beforeAfter: {
      before: "6/10",
      after: "9/10",
      metric: "Energy Level"
    }
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    role: "Plastic Surgeon",
    location: "Beverly Hills Medical District",
    rating: 5,
    quote: "As a physician, I appreciate the professional protocols and medical-grade equipment. The convenience of having this service come to my home fits perfectly with my demanding schedule.",
    verified: true,
    sessionCount: "Professional Partner"
  },
  {
    id: 3,
    name: "Sarah Rodriguez",
    role: "Real Estate Executive", 
    location: "Beverly Hills Golden Triangle",
    rating: 5,
    quote: "The infrared sauna delivery is a game-changer. After stressful days in real estate, having this luxury wellness experience at home helps me decompress and sleep better.",
    verified: true,
    sessionCount: "25+ sessions",
    beforeAfter: {
      before: "5 hrs",
      after: "8 hrs",
      metric: "Sleep Quality"
    }
  }
];

const beverlyHillsFAQs = [
  {
    question: "Do you provide service throughout all of Beverly Hills?",
    answer: "Yes, we provide comprehensive mobile recovery services throughout Beverly Hills including the Golden Triangle, Beverly Hills Flats, Trousdale Estates, and surrounding luxury neighborhoods. Our white-glove service is designed specifically for Beverly Hills' discerning residents."
  },
  {
    question: "What makes your Beverly Hills service different?",
    answer: "Our Beverly Hills service includes premium amenities, white-glove setup, and concierge-level customer care. We understand the expectations of Beverly Hills residents and deliver accordingly with luxury linens, premium refreshments, and professional wellness consultations."
  },
  {
    question: "Can you accommodate same-day bookings in Beverly Hills?",
    answer: "Absolutely! We maintain priority availability for Beverly Hills residents with same-day and emergency booking options. Our Beverly Hills service includes expedited setup and flexible scheduling to accommodate busy executive schedules."
  },
  {
    question: "Do you work with Beverly Hills medical professionals?",
    answer: "Yes, we collaborate with many Beverly Hills medical practices, plastic surgeons, and wellness professionals. We can coordinate with your healthcare providers and integrate recovery therapy into your existing wellness regimen."
  },
  {
    question: "What safety and privacy measures do you have for Beverly Hills clients?",
    answer: "We maintain the highest standards of discretion and privacy for all Beverly Hills clients. Our team is fully background-checked, bonded, and trained in confidentiality protocols. All equipment is medical-grade and we follow strict safety procedures."
  }
];

export default function BeverlyHillsPage() {
  return (
    <div className="min-h-screen">
      <LandingHero
        headline="Mobile Recovery Beverly Hills"
        subheadline="Experience premium cold plunge and infrared sauna therapy delivered to your Beverly Hills home or office. Professional-grade equipment with white-glove service designed for discerning clients who demand excellence."
        primaryCTA="Book Beverly Hills Service"
        secondaryCTA="View Pricing"
        badges={[
          { icon: Shield, text: "White-Glove Service" },
          { icon: Star, text: "5-Star Beverly Hills Reviews" },
          { icon: Clock, text: "Same-Day Available" }
        ]}
        trustIndicators={{
          rating: 5,
          reviewCount: "150+",
          locationText: "Beverly Hills Clients"
        }}
        urgency={{
          text: "Limited Beverly Hills availability -",
          highlight: "Reserve today!"
        }}
      />

      <LandingFeatures
        title="Premium Recovery Services for Beverly Hills"
        subtitle="Our Beverly Hills service combines cutting-edge recovery technology with the luxury service standards you expect. From executives to entertainers, we provide discrete, professional wellness therapy that fits your lifestyle."
        features={beverlyHillsFeatures}
        ctaText="Experience Beverly Hills Service"
        ctaSubtext="Join Beverly Hills residents who've discovered the convenience and luxury of professional mobile recovery therapy."
      />

      <LandingTestimonials
        title="Beverly Hills Client Success Stories"
        subtitle="See how Beverly Hills executives, medical professionals, and luxury lifestyle enthusiasts have integrated professional recovery therapy into their wellness routines."
        testimonials={beverlyHillsTestimonials}
        targetAudience="luxury"
      />

      <LandingPricing
        title="Beverly Hills Premium Pricing"
        subtitle="Luxury wellness experiences with transparent pricing. No hidden fees, just professional recovery therapy delivered with the service excellence Beverly Hills demands."
        tiers={beverlyHillsPricing}
        guaranteeText="Beverly Hills satisfaction guarantee"
        additionalInfo={[
          "White-glove service included",
          "Same-day booking available",
          "Premium amenities and consultation"
        ]}
      />

      <LandingFAQ
        title="Beverly Hills Service Questions?"
        subtitle="Get answers about our premium mobile recovery services, Beverly Hills availability, luxury amenities, and what makes our service the choice of discerning clients."
        faqs={beverlyHillsFAQs}
        contactCTA={{
          text: "Ready for Beverly Hills luxury wellness?",
          subtext: "Experience the premier mobile recovery service trusted by Beverly Hills residents"
        }}
      />

      {/* Beverly Hills Specific Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Serving Beverly Hills Neighborhoods</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[
              "Golden Triangle",
              "Beverly Hills Flats", 
              "Trousdale Estates",
              "Beverly Hills Gateway",
              "Beverly Hills Post Office",
              "Benedict Canyon"
            ].map((neighborhood) => (
              <div key={neighborhood} className="p-4 bg-background rounded-lg">
                <MapPin className="h-4 w-4 text-primary mx-auto mb-2" />
                <div className="text-sm font-medium">{neighborhood}</div>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground">
            Premium mobile recovery services delivered throughout Beverly Hills with same-day availability
          </p>
        </div>
      </section>
    </div>
  );
}