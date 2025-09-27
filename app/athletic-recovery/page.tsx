import { Metadata } from "next";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingPricing } from "@/components/landing/LandingPricing";
import { LandingTestimonials } from "@/components/landing/LandingTestimonials";
import { LandingFAQ } from "@/components/landing/LandingFAQ";
import { Trophy, Target, Zap, Activity, Clock, Shield, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Athletic Recovery Services Los Angeles | Professional Sports Recovery | The Recovery Machine",
  description: "Elite athletic recovery services for LA athletes. Mobile cold plunge + infrared sauna therapy. Trusted by professional athletes, trainers, and sports teams across Los Angeles.",
  keywords: "athletic recovery Los Angeles, sports recovery LA, athlete therapy, cold plunge athletes, sauna recovery, mobile sports therapy",
  openGraph: {
    title: "Athletic Recovery Services Los Angeles - Elite Sports Recovery",
    description: "Professional athletic recovery services for LA athletes. Mobile contrast therapy trusted by pros. Accelerate your performance and recovery.",
    url: "https://therecoverymachine.com/athletic-recovery",
    siteName: "The Recovery Machine",
    images: [
      {
        url: "/athletic-recovery-og.jpg",
        width: 1200,
        height: 630,
        alt: "Athletic Recovery Services Los Angeles"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Athletic Recovery Services LA | Elite Sports Recovery",
    description: "Professional mobile recovery therapy for LA athletes. Trusted by pros. Book your session now!",
    images: ["/athletic-recovery-og.jpg"]
  },
  alternates: {
    canonical: "https://therecoverymachine.com/athletic-recovery"
  }
};

const athleticFeatures = [
  {
    icon: Trophy,
    title: "Elite Contrast Therapy Protocol",
    description: "Scientifically-designed hot-cold therapy cycles proven to accelerate recovery and enhance athletic performance.",
    benefits: [
      "Cold plunge (38-50°F) + Infrared sauna (140-180°F)",
      "Optimized timing for maximum benefit",
      "Professional athlete protocols",
      "Performance tracking and analytics"
    ]
  },
  {
    icon: Target,
    title: "Sport-Specific Recovery Programs",
    description: "Customized recovery protocols tailored to your sport, training intensity, and performance goals.",
    benefits: [
      "Endurance sport recovery optimization",
      "Strength training recovery protocols",
      "Competition preparation sessions",
      "Injury prevention and rehabilitation"
    ]
  },
  {
    icon: Activity,
    title: "Professional Athletic Support",
    description: "Work with certified recovery specialists who understand elite athletic demands and recovery science.",
    benefits: [
      "Certified sports recovery technicians",
      "Collaboration with trainers and coaches",
      "Performance data integration",
      "Ongoing protocol optimization"
    ]
  }
];

const athleticPricing = [
  {
    name: "Single Recovery Session",
    description: "Complete contrast therapy for immediate recovery",
    price: "$200",
    period: "per session",
    features: [
      "30-min cold plunge + 30-min infrared sauna",
      "Sport-specific protocol guidance",
      "Professional setup and monitoring",
      "Performance metrics tracking",
      "Post-session recovery consultation",
      "Hydration and electrolyte support"
    ],
    cta: "Book Recovery Session",
    highlight: {
      text: "Pro Protocol",
      icon: Zap
    }
  },
  {
    name: "Elite Athlete Package",
    description: "Comprehensive weekly recovery for serious athletes",
    price: "$600",
    originalPrice: "$800",
    savings: "25%",
    period: "per month",
    features: [
      "4 contrast therapy sessions per month",
      "Dedicated weekly recovery slot",
      "Personalized protocol development",
      "Performance analytics dashboard",
      "Priority booking and support",
      "Coach/trainer collaboration tools",
      "Competition preparation sessions"
    ],
    cta: "Join Elite Program",
    popular: true,
    highlight: {
      text: "Elite Choice",
      icon: Trophy
    }
  },
  {
    name: "Team Recovery Program",
    description: "Group sessions for teams and training groups",
    price: "Custom",
    period: "contact us",
    features: [
      "Multi-athlete session capacity",
      "Team-specific recovery protocols",
      "Bulk session discounts available",
      "Coach education and training",
      "Competition schedule coordination",
      "Performance tracking for entire team"
    ],
    cta: "Get Team Quote",
    highlight: {
      text: "Team Rates",
      icon: Target
    }
  }
];

const athleticTestimonials = [
  {
    id: 1,
    name: "Carlos Mendoza",
    role: "Professional Soccer Player",
    location: "Los Angeles FC",
    rating: 5,
    quote: "The contrast therapy has become essential to my training routine. I recover faster between matches and feel stronger throughout the season. The mobile service means I can maintain consistency even during busy competition schedules.",
    verified: true,
    sessionCount: "60+ sessions",
    beforeAfter: {
      before: "72 hrs",
      after: "36 hrs",
      metric: "Recovery Time"
    }
  },
  {
    id: 2,
    name: "Maya Patel",
    role: "Marathon Runner",
    location: "Santa Monica Track Club",
    rating: 5,
    quote: "Since starting regular contrast therapy, my race times have improved and I experience significantly less muscle soreness. The professional protocols are perfectly tailored to endurance athletes.",
    verified: true,
    sessionCount: "40+ sessions",
    beforeAfter: {
      before: "3:15",
      after: "3:08",
      metric: "Marathon PR"
    }
  },
  {
    id: 3,
    name: "Dr. James Wilson",
    role: "Sports Medicine Physician",
    location: "UCLA Sports Medicine",
    rating: 5,
    quote: "I recommend this service to my elite athletes. The science-based approach and professional execution provide real performance benefits. The data tracking helps me monitor athlete progress.",
    verified: true,
    sessionCount: "Professional Partner"
  },
  {
    id: 4,
    name: "Ashley Chen",
    role: "Olympic Swimmer",
    location: "USC Aquatics",
    rating: 5,
    quote: "The cold plunge and sauna combination has transformed my training recovery. I can train harder and more frequently while staying injury-free. This service is a game-changer for serious athletes.",
    verified: true,
    sessionCount: "80+ sessions"
  }
];

const athleticFAQs = [
  {
    question: "How does contrast therapy benefit athletic performance?",
    answer: "Contrast therapy (alternating hot and cold) enhances recovery by improving circulation, reducing inflammation, accelerating metabolic waste removal, and promoting muscle repair. Research shows it can reduce recovery time by 30-50% and improve subsequent performance."
  },
  {
    question: "What's the optimal timing for recovery sessions around training?",
    answer: "For best results, schedule sessions 2-6 hours post-workout or on rest days. Avoid immediately before training as it may temporarily reduce muscle power. We work with your training schedule to optimize timing for maximum benefit."
  },
  {
    question: "Do you work with sports teams and training groups?",
    answer: "Yes! We provide team recovery services for sports clubs, training groups, and professional teams. We offer group rates, team-specific protocols, and can coordinate with coaching staff to integrate recovery into training programs."
  },
  {
    question: "Can you customize protocols for different sports?",
    answer: "Absolutely. We develop sport-specific protocols based on training demands, competition schedules, and recovery needs. Endurance athletes, strength athletes, and team sport players all benefit from different approaches to contrast therapy."
  },
  {
    question: "How do you track and measure recovery progress?",
    answer: "We use performance metrics including heart rate variability, subjective recovery scores, training load data, and objective measures like range of motion. Our analytics dashboard helps athletes and coaches monitor progress and optimize protocols."
  },
  {
    question: "Is your service used by professional athletes?",
    answer: "Yes, we work with professional athletes, Olympic competitors, and elite amateurs across various sports. Our protocols are based on sports science research and refined through work with high-performance athletes and sports medicine professionals."
  }
];

export default function AthleticRecoveryPage() {
  return (
    <div className="min-h-screen">
      <LandingHero
        headline="Elite Athletic Recovery Services"
        subheadline="Accelerate your performance with professional contrast therapy trusted by elite athletes. Mobile cold plunge + infrared sauna sessions designed for serious competitors and training enthusiasts across Los Angeles."
        primaryCTA="Book Recovery Session"
        secondaryCTA="View Programs"
        badges={[
          { icon: Shield, text: "Pro Athletes Trust Us" },
          { icon: TrendingUp, text: "Proven Performance Gains" },
          { icon: Clock, text: "Fits Your Schedule" }
        ]}
        trustIndicators={{
          rating: 5,
          reviewCount: "400+",
          locationText: "Elite Athletes Served"
        }}
        urgency={{
          text: "Competition season booking -",
          highlight: "Reserve now!"
        }}
      />

      <LandingFeatures
        title="Why Elite Athletes Choose Our Recovery Service"
        subtitle="Experience the same professional contrast therapy protocols used by Olympic athletes and professional sports teams. Our science-based approach delivers measurable performance improvements."
        features={athleticFeatures}
        ctaText="Start Elite Recovery"
        ctaSubtext="Join hundreds of LA athletes who've gained competitive advantage through professional recovery therapy."
      />

      <LandingTestimonials
        title="Real Performance Gains from Elite Athletes"
        subtitle="See how professional contrast therapy has accelerated recovery, improved performance, and prevented injuries for competitive athletes across all sports in Los Angeles."
        testimonials={athleticTestimonials}
        targetAudience="athlete"
      />

      <LandingPricing
        title="Professional Athletic Recovery Pricing"
        subtitle="Choose the recovery program that matches your competitive level and training intensity. Transparent pricing for serious athletes who demand results."
        tiers={athleticPricing}
        guaranteeText="Performance improvement guarantee"
        additionalInfo={[
          "Sport-specific protocols included",
          "Performance tracking and analytics",
          "Coach collaboration available"
        ]}
      />

      <LandingFAQ
        title="Athletic Recovery Questions?"
        subtitle="Get expert answers about contrast therapy benefits, training integration, and how our protocols can enhance your athletic performance and recovery."
        faqs={athleticFAQs}
        contactCTA={{
          text: "Ready to gain competitive advantage?",
          subtext: "Book your athletic recovery session or consult with our sports recovery specialists"
        }}
      />
    </div>
  );
}