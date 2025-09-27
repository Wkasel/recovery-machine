import { Metadata } from "next";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingPricing } from "@/components/landing/LandingPricing";
import { LandingTestimonials } from "@/components/landing/LandingTestimonials";
import { LandingFAQ } from "@/components/landing/LandingFAQ";
import { Flame, Heart, Zap, Shield, Clock, Thermometer, Sun } from "lucide-react";

export const metadata: Metadata = {
  title: "Infrared Sauna Delivery LA | Mobile Sauna Service | The Recovery Machine",
  description: "Professional infrared sauna delivery to your home in Los Angeles. Experience therapeutic heat therapy with expert setup. Same-day booking available across LA County.",
  keywords: "infrared sauna delivery LA, mobile sauna Los Angeles, sauna rental, heat therapy, detox therapy, mobile wellness LA",
  openGraph: {
    title: "Infrared Sauna Delivery Los Angeles - Mobile Heat Therapy",
    description: "Transform your wellness routine with professional infrared sauna delivery in Los Angeles. Expert setup, therapeutic benefits, same-day booking.",
    url: "https://therecoverymachine.com/infrared-sauna-delivery",
    siteName: "The Recovery Machine",
    images: [
      {
        url: "/infrared-sauna-og.jpg",
        width: 1200,
        height: 630,
        alt: "Infrared Sauna Delivery Los Angeles"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Infrared Sauna Delivery LA | Mobile Heat Therapy",
    description: "Professional infrared sauna delivered to your door in Los Angeles. Book your heat therapy session now!",
    images: ["/infrared-sauna-og.jpg"]
  },
  alternates: {
    canonical: "https://therecoverymachine.com/infrared-sauna-delivery"
  }
};

const saunaFeatures = [
  {
    icon: "Flame",
    title: "Advanced Infrared Technology",
    description: "Experience the latest in infrared sauna technology with full-spectrum heating elements for maximum therapeutic benefit.",
    benefits: [
      "Full-spectrum infrared heating (near, mid, far)",
      "Temperature range 120-180°F",
      "Even heat distribution technology",
      "EMF-free heating elements"
    ]
  },
  {
    icon: "Heart",
    title: "Proven Health Benefits",
    description: "Unlock the scientifically-backed benefits of regular infrared sauna therapy for your body and mind.",
    benefits: [
      "Improved cardiovascular health",
      "Enhanced detoxification and cleansing",
      "Stress reduction and better sleep",
      "Accelerated muscle recovery"
    ]
  },
  {
    icon: "Sun",
    title: "Premium Mobile Experience",
    description: "Enjoy luxury spa-quality infrared sauna therapy in the comfort of your own space with professional setup.",
    benefits: [
      "Spacious 2-4 person capacity",
      "Complete setup and breakdown",
      "Luxury amenities included",
      "Professional guidance and monitoring"
    ]
  }
];

const saunaPricing = [
  {
    name: "Single Infrared Sauna Session",
    description: "Perfect introduction to infrared heat therapy",
    price: "$175",
    period: "per session",
    features: [
      "45-minute infrared sauna session",
      "Professional setup and guidance",
      "Premium full-spectrum sauna",
      "Luxury towels and amenities",
      "Temperature customization",
      "Post-session hydration support"
    ],
    cta: "Book Single Session",
    highlight: {
      text: "Try It First",
      icon: "Zap"
    }
  },
  {
    name: "Weekly Sauna Wellness Plan",
    description: "Optimal frequency for maximum health benefits",
    price: "$500",
    originalPrice: "$700",
    savings: "29%",
    period: "per month",
    features: [
      "4 infrared sauna sessions per month",
      "Dedicated weekly appointment slot",
      "Wellness progress tracking",
      "Priority booking and support",
      "Flexible rescheduling options",
      "Personalized therapy optimization"
    ],
    cta: "Start Wellness Plan",
    popular: true,
    highlight: {
      text: "Best Value",
      icon: "Heart"
    }
  }
];

const saunaTestimonials = [
  {
    id: 1,
    name: "Amanda Foster",
    role: "Wellness Entrepreneur",
    location: "West Hollywood, CA",
    rating: 5,
    quote: "The infrared sauna delivery service has become an essential part of my wellness routine. The convenience of having a luxury spa experience at home is unmatched, and I feel the benefits immediately.",
    verified: true,
    sessionCount: "35+ sessions",
    beforeAfter: {
      before: "5-6 hrs",
      after: "7-8 hrs",
      metric: "Sleep Quality"
    }
  },
  {
    id: 2,
    name: "David Kim",
    role: "Tech Executive",
    location: "Santa Monica, CA",
    rating: 5,
    quote: "As someone with a demanding schedule, the mobile infrared sauna is perfect. The stress relief and mental clarity I get from each session has improved my work performance significantly.",
    verified: true,
    sessionCount: "20+ sessions",
    beforeAfter: {
      before: "8/10",
      after: "4/10",
      metric: "Stress Level"
    }
  },
  {
    id: 3,
    name: "Dr. Maria Gonzalez",
    role: "Cardiologist",
    location: "Beverly Hills, CA",
    rating: 5,
    quote: "From a medical perspective, the cardiovascular benefits of regular infrared sauna use are well-documented. This service makes it accessible and convenient for my patients.",
    verified: true,
    sessionCount: "Professional Partner"
  },
  {
    id: 4,
    name: "Jennifer Walsh",
    role: "Yoga Instructor",
    location: "Venice, CA",
    rating: 5,
    quote: "The detoxification and flexibility benefits complement my yoga practice perfectly. Having the sauna delivered to my studio has been amazing for my clients too.",
    verified: true,
    sessionCount: "45+ sessions"
  }
];

const saunaFAQs = [
  {
    question: "What temperature range do your infrared saunas operate at?",
    answer: "Our professional infrared saunas operate between 120-180°F (49-82°C). We customize the temperature based on your comfort level and therapeutic goals. Most sessions are conducted between 140-160°F for optimal benefits and comfort."
  },
  {
    question: "How long does it take to set up the mobile infrared sauna?",
    answer: "Setup typically takes 45-60 minutes, including sauna assembly, electrical connections, and safety checks. We arrive well before your session to ensure everything is ready at your scheduled time. Breakdown takes about 30-40 minutes after your session."
  },
  {
    question: "What are the main health benefits of infrared sauna therapy?",
    answer: "Infrared sauna therapy offers numerous benefits including improved cardiovascular health, enhanced detoxification, stress reduction, better sleep quality, pain relief, and accelerated muscle recovery. Regular use can also support weight management and boost immune function."
  },
  {
    question: "Do you require any special electrical setup for the infrared sauna?",
    answer: "Our mobile infrared saunas require a standard 120V household outlet. No special electrical installation is needed. We bring all necessary equipment and ensure safe electrical connections as part of our professional setup service."
  },
  {
    question: "How should I prepare for an infrared sauna session?",
    answer: "We recommend staying well-hydrated before, during, and after your session. Avoid alcohol and large meals 2-3 hours before. Wear comfortable, loose clothing or bring swimwear. We provide towels and water, and will give you a complete preparation guide when you book."
  },
  {
    question: "Can multiple people use the infrared sauna together?",
    answer: "Yes! Our infrared saunas accommodate 2-4 people comfortably, making them perfect for couples, families, or small groups. This makes the experience more social and cost-effective when sharing with others."
  }
];

export default function InfraredSaunaDeliveryPage() {
  return (
    <div className="min-h-screen">
      <LandingHero
        headline="Infrared Sauna Delivery Los Angeles"
        subheadline="Transform your wellness routine with professional infrared sauna therapy delivered to your door. Experience luxury spa-quality heat therapy with expert setup, safety monitoring, and premium equipment."
        primaryCTA="Book Sauna Session"
        secondaryCTA="View Pricing"
        badges={[
          { icon: "Shield", text: "Licensed & Insured" },
          { icon: "Flame", text: "Full-Spectrum Infrared" },
          { icon: "Clock", text: "Same-Day Available" }
        ]}
        trustIndicators={{
          rating: 5,
          reviewCount: "250+",
          locationText: "Los Angeles County"
        }}
        urgency={{
          text: "Limited weekend availability -",
          highlight: "Reserve your spot!"
        }}
      />

      <LandingFeatures
        title="Why Choose Our Mobile Infrared Sauna Service?"
        subtitle="Experience the therapeutic benefits of full-spectrum infrared heat therapy with the luxury and convenience of professional home service. Our certified wellness technicians ensure optimal results every session."
        features={saunaFeatures}
        ctaText="Book Your Session"
        ctaSubtext="Join LA's wellness community and discover why infrared sauna therapy is becoming the preferred choice for stress relief and recovery."
      />

      <LandingTestimonials
        title="Transformative Results from LA Infrared Sauna Users"
        subtitle="Discover how regular infrared sauna therapy has improved wellness, reduced stress, and enhanced quality of life for professionals and wellness enthusiasts across Los Angeles."
        testimonials={saunaTestimonials}
        targetAudience="wellness"
      />

      <LandingPricing
        title="Simple Infrared Sauna Pricing"
        subtitle="Choose the wellness plan that fits your lifestyle. Transparent pricing, no hidden fees, and the flexibility to enjoy luxury heat therapy on your schedule."
        tiers={saunaPricing}
        guaranteeText="100% satisfaction guarantee"
        additionalInfo={[
          "No electrical installation required",
          "Same-day booking available",
          "Professional wellness consultation included"
        ]}
      />

      <LandingFAQ
        title="Infrared Sauna Therapy Questions?"
        subtitle="Get expert answers about infrared sauna benefits, our mobile delivery service, and what to expect during your heat therapy session."
        faqs={saunaFAQs}
        contactCTA={{
          text: "Ready to experience infrared wellness?",
          subtext: "Book your mobile infrared sauna session or consult with our wellness experts"
        }}
      />
    </div>
  );
}