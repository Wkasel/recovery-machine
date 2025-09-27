import { Metadata } from "next";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingPricing } from "@/components/landing/LandingPricing";
import { LandingTestimonials } from "@/components/landing/LandingTestimonials";
import { LandingFAQ } from "@/components/landing/LandingFAQ";
import { Snowflake, Thermometer, Heart, Zap, Clock, Shield, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Mobile Cold Plunge Los Angeles | Same-Day Delivery | The Recovery Machine",
  description: "Professional mobile cold plunge therapy delivered to your door in Los Angeles. Book your cold plunge session in 60 seconds. Same-day availability, expert setup included.",
  keywords: "mobile cold plunge Los Angeles, cold plunge delivery LA, cold water therapy, ice bath Los Angeles, recovery therapy, mobile wellness",
  openGraph: {
    title: "Mobile Cold Plunge Los Angeles - Professional Cold Water Therapy",
    description: "Transform your recovery with professional mobile cold plunge therapy in Los Angeles. Expert setup, same-day booking, premium equipment.",
    url: "https://therecoverymachine.com/cold-plunge-la",
    siteName: "The Recovery Machine",
    images: [
      {
        url: "/cold-plunge-og.jpg",
        width: 1200,
        height: 630,
        alt: "Mobile Cold Plunge Los Angeles"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Mobile Cold Plunge Los Angeles | Same-Day Delivery",
    description: "Professional mobile cold plunge therapy delivered to your door in Los Angeles. Book now!",
    images: ["/cold-plunge-og.jpg"]
  },
  alternates: {
    canonical: "https://therecoverymachine.com/cold-plunge-la"
  }
};

const coldPlungeFeatures = [
  {
    icon: "Snowflake",
    title: "Professional-Grade Cold Plunge",
    description: "State-of-the-art chiller systems maintaining precise temperature control for optimal therapeutic benefits.",
    benefits: [
      "Temperature control 38-55°F",
      "Medical-grade filtration system",
      "Spacious single or multi-person tubs",
      "Professional setup and monitoring"
    ]
  },
  {
    icon: "Heart",
    title: "Science-Backed Health Benefits",
    description: "Experience the proven benefits of cold water therapy backed by leading sports medicine research.",
    benefits: [
      "Reduced inflammation and muscle soreness",
      "Enhanced athletic recovery",
      "Improved circulation and metabolism",
      "Mental clarity and stress relief"
    ]
  },
  {
    icon: "MapPin",
    title: "Convenient LA-Wide Service",
    description: "Serving all of Los Angeles County with same-day booking and professional on-site setup.",
    benefits: [
      "Same-day availability",
      "Complete setup and breakdown",
      "Licensed and insured service",
      "Flexible scheduling 7 days a week"
    ]
  }
];

const coldPlungePricing = [
  {
    name: "Single Cold Plunge Session",
    description: "Perfect for trying cold therapy for the first time",
    price: "$150",
    period: "per session",
    features: [
      "30-minute cold plunge session",
      "Professional setup and guidance",
      "Premium cold plunge equipment",
      "Safety monitoring included",
      "Temperature customization",
      "Post-session wellness consultation"
    ],
    cta: "Book Single Session",
    highlight: {
      text: "Try It First",
      icon: "Zap"
    }
  },
  {
    name: "Weekly Cold Plunge Package",
    description: "Optimal frequency for serious recovery benefits",
    price: "$400",
    originalPrice: "$600",
    savings: "33%",
    period: "per month",
    features: [
      "4 cold plunge sessions per month",
      "Dedicated weekly time slot",
      "Progress tracking and optimization",
      "Priority booking and support",
      "Flexible rescheduling",
      "Performance analytics dashboard"
    ],
    cta: "Start Weekly Plan",
    popular: true,
    highlight: {
      text: "Most Effective",
      icon: "Heart"
    }
  }
];

const coldPlungeTestimonials = [
  {
    id: 1,
    name: "Marcus Chen",
    role: "Professional Triathlete",
    location: "Manhattan Beach, CA",
    rating: 5,
    quote: "The mobile cold plunge service has revolutionized my recovery routine. Having professional-grade equipment delivered to my home means I can maintain consistent cold therapy without the commute to a facility.",
    verified: true,
    sessionCount: "40+ sessions",
    beforeAfter: {
      before: "48 hrs",
      after: "18 hrs",
      metric: "Recovery Time"
    }
  },
  {
    id: 2,
    name: "Dr. Sarah Rodriguez",
    role: "Sports Medicine Physician",
    location: "Beverly Hills, CA",
    rating: 5,
    quote: "As a physician, I appreciate the professional setup and safety protocols. The temperature control and monitoring give me confidence recommending this service to my patients.",
    verified: true,
    sessionCount: "Professional Partner"
  },
  {
    id: 3,
    name: "Jake Morrison",
    role: "CrossFit Athlete",
    location: "Venice, CA",
    rating: 5,
    quote: "Game changer for my training recovery. The convenience of having it at home means I actually stick to my cold therapy routine consistently.",
    verified: true,
    sessionCount: "25+ sessions",
    beforeAfter: {
      before: "6/10",
      after: "9/10",
      metric: "Energy Level"
    }
  },
  {
    id: 4,
    name: "Lisa Thompson",
    role: "Wellness Coach",
    location: "Santa Monica, CA",
    rating: 5,
    quote: "The mental clarity and mood boost I get from regular cold plunging is incredible. This service makes it so accessible and professional.",
    verified: true,
    sessionCount: "30+ sessions"
  }
];

const coldPlungeFAQs = [
  {
    question: "How cold is the water in your mobile cold plunge?",
    answer: "Our professional-grade chillers maintain water temperature between 38-55°F (3-13°C). We customize the temperature based on your experience level and therapeutic goals. Beginners typically start at 50-55°F and work down to colder temperatures as they adapt."
  },
  {
    question: "How long does setup take for a mobile cold plunge session?",
    answer: "Our team typically needs 30-45 minutes for complete setup, including equipment calibration and safety checks. We arrive early to ensure everything is ready for your scheduled session time. Breakdown takes approximately 20-30 minutes after your session."
  },
  {
    question: "Is cold plunge therapy safe? What safety measures do you have?",
    answer: "Yes, when done properly with professional supervision. Our certified technicians monitor your session, maintain optimal water conditions, and provide safety briefings. We follow strict safety protocols and have emergency procedures in place. We also screen for contraindications before your first session."
  },
  {
    question: "What areas of Los Angeles do you serve?",
    answer: "We provide mobile cold plunge services throughout Los Angeles County, including Beverly Hills, Santa Monica, Venice, Manhattan Beach, West Hollywood, Pasadena, and surrounding areas. Contact us to confirm service availability in your specific location."
  },
  {
    question: "Do I need any special preparation for cold plunge therapy?",
    answer: "We recommend staying well-hydrated, avoiding alcohol 24 hours before your session, and eating a light meal 2-3 hours prior. We'll provide a complete preparation guide when you book, along with what to expect during and after your session."
  },
  {
    question: "Can I book same-day cold plunge sessions?",
    answer: "Yes! We offer same-day booking based on availability. Our goal is to make recovery therapy as convenient as possible. For guaranteed availability, we recommend booking 24-48 hours in advance, especially for weekend sessions."
  }
];

export default function ColdPlungeLAPage() {
  return (
    <div className="min-h-screen">
      <LandingHero
        headline="Mobile Cold Plunge Los Angeles"
        subheadline="Professional cold water therapy delivered to your door. Experience the benefits of cold plunge therapy with expert setup, safety monitoring, and premium equipment. Same-day booking available across LA County."
        primaryCTA="Book Cold Plunge Now"
        secondaryCTA="View Pricing"
        badges={[
          { icon: "Shield", text: "Licensed & Insured" },
          { icon: "Thermometer", text: "Precise Temperature Control" },
          { icon: "Clock", text: "Same-Day Available" }
        ]}
        trustIndicators={{
          rating: 5,
          reviewCount: "300+",
          locationText: "Los Angeles County"
        }}
        urgency={{
          text: "Limited availability -",
          highlight: "Book today!"
        }}
      />

      <LandingFeatures
        title="Why Choose Our Mobile Cold Plunge Service?"
        subtitle="Experience professional-grade cold water therapy with the convenience of home service. Our certified technicians bring everything needed for a safe, effective cold plunge session."
        features={coldPlungeFeatures}
        ctaText="Book Your Session"
        ctaSubtext="Join hundreds of LA residents who've transformed their recovery routine with our mobile cold plunge service."
      />

      <LandingTestimonials
        title="Real Results from LA Cold Plunge Users"
        subtitle="See how professional cold water therapy has transformed recovery and performance for athletes, professionals, and wellness enthusiasts across Los Angeles."
        testimonials={coldPlungeTestimonials}
        targetAudience="athlete"
      />

      <LandingPricing
        title="Transparent Cold Plunge Pricing"
        subtitle="Choose the option that fits your recovery goals. No hidden fees, no long-term contracts, just professional cold water therapy when you need it."
        tiers={coldPlungePricing}
        guaranteeText="100% satisfaction guarantee"
        additionalInfo={[
          "No setup fees for Los Angeles area",
          "Same-day booking available",
          "Professional safety monitoring included"
        ]}
      />

      <LandingFAQ
        title="Cold Plunge Therapy Questions?"
        subtitle="Get answers to common questions about our mobile cold plunge service, safety protocols, and what to expect during your session."
        faqs={coldPlungeFAQs}
        contactCTA={{
          text: "Ready to experience cold plunge therapy?",
          subtext: "Book your mobile cold plunge session or speak with our recovery experts"
        }}
      />
    </div>
  );
}