import { Metadata } from "next";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingPricing } from "@/components/landing/LandingPricing";
import { LandingTestimonials } from "@/components/landing/LandingTestimonials";
import { LandingFAQ } from "@/components/landing/LandingFAQ";
import { Building2, Users, TrendingUp, Brain, Clock, Shield, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "Corporate Wellness LA | Employee Recovery Programs | The Recovery Machine",
  description: "Boost employee wellness and productivity with mobile recovery therapy. Professional cold plunge + sauna programs for LA companies. Reduce stress, improve performance, enhance retention.",
  keywords: "corporate wellness Los Angeles, employee wellness programs, corporate recovery therapy, team building LA, stress reduction workplace",
  openGraph: {
    title: "Corporate Wellness Los Angeles - Employee Recovery Programs",
    description: "Transform your workplace wellness with professional mobile recovery therapy. Boost productivity, reduce stress, improve employee satisfaction.",
    url: "https://therecoverymachine.com/corporate-wellness",
    siteName: "The Recovery Machine",
    images: [
      {
        url: "/corporate-wellness-og.jpg",
        width: 1200,
        height: 630,
        alt: "Corporate Wellness Los Angeles"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Corporate Wellness LA | Employee Recovery Programs",
    description: "Boost employee wellness and productivity with mobile recovery therapy for LA companies. Book now!",
    images: ["/corporate-wellness-og.jpg"]
  },
  alternates: {
    canonical: "https://therecoverymachine.com/corporate-wellness"
  }
};

const corporateFeatures = [
  {
    icon: Building2,
    title: "On-Site Wellness Programs",
    description: "Bring professional recovery therapy directly to your workplace with fully managed wellness programs that fit your company culture.",
    benefits: [
      "Mobile setup at your office location",
      "Flexible scheduling around work hours",
      "Professional wellness staff included",
      "Minimal disruption to operations"
    ]
  },
  {
    icon: TrendingUp,
    title: "Measurable ROI Benefits",
    description: "Invest in employee wellness with programs that deliver quantifiable returns through improved productivity and reduced healthcare costs.",
    benefits: [
      "Reduced stress and burnout rates",
      "Improved focus and mental clarity",
      "Lower absenteeism and turnover",
      "Enhanced team morale and culture"
    ]
  },
  {
    icon: Users,
    title: "Scalable Team Programs",
    description: "From small startups to large enterprises, our corporate wellness programs scale to meet your organization's unique needs.",
    benefits: [
      "Programs for 10-500+ employees",
      "Department-specific scheduling",
      "Executive wellness packages",
      "Team building integration"
    ]
  }
];

const corporatePricing = [
  {
    name: "Wellness Pilot Program",
    description: "Perfect way to introduce recovery therapy to your team",
    price: "$2,500",
    period: "per month",
    features: [
      "Up to 50 employee sessions per month",
      "2 on-site session days per week",
      "Professional wellness coordination",
      "Employee wellness education",
      "Usage analytics and reporting",
      "3-month pilot program commitment"
    ],
    cta: "Start Pilot Program",
    highlight: {
      text: "Most Popular",
      icon: Target
    }
  },
  {
    name: "Enterprise Wellness Package",
    description: "Comprehensive wellness solution for larger organizations",
    price: "$5,000",
    period: "per month",
    features: [
      "Unlimited employee sessions",
      "Daily on-site availability",
      "Dedicated wellness coordinator",
      "Executive wellness consultations",
      "Custom wellness education programs",
      "Advanced analytics and ROI tracking",
      "Flexible annual contract"
    ],
    cta: "Get Enterprise Quote",
    popular: true,
    highlight: {
      text: "Enterprise Choice",
      icon: Building2
    }
  },
  {
    name: "Executive Recovery Program",
    description: "Premium wellness program for C-suite and leadership teams",
    price: "Custom",
    period: "contact us",
    features: [
      "Private executive session scheduling",
      "Flexible location options (office/home)",
      "Personal wellness coaching",
      "Stress management protocols",
      "Performance optimization focus",
      "Confidential health tracking"
    ],
    cta: "Discuss Executive Program",
    highlight: {
      text: "Executive Level",
      icon: Brain
    }
  }
];

const corporateTestimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Chief People Officer",
    location: "Tech Startup, Santa Monica",
    rating: 5,
    quote: "Our employee wellness scores improved 40% after implementing the recovery therapy program. The team loves the sessions and we've seen measurable improvements in productivity and job satisfaction.",
    verified: true,
    sessionCount: "Company Partner",
    beforeAfter: {
      before: "6.2/10",
      after: "8.7/10",
      metric: "Employee Wellness Score"
    }
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "CEO",
    location: "Marketing Agency, Beverly Hills",
    rating: 5,
    quote: "The mobile recovery service has become our secret weapon for attracting and retaining top talent. Employees regularly mention it as a standout benefit that sets us apart from competitors.",
    verified: true,
    sessionCount: "150+ employees served"
  },
  {
    id: 3,
    name: "Dr. Jennifer Liu",
    role: "Wellness Director",
    location: "Finance Firm, Downtown LA",
    rating: 5,
    quote: "From a wellness perspective, the stress reduction and mental clarity benefits are remarkable. We've seen a 30% reduction in stress-related sick days since launching the program.",
    verified: true,
    sessionCount: "Corporate Health Partner",
    beforeAfter: {
      before: "25%",
      after: "12%",
      metric: "Stress-Related Absences"
    }
  },
  {
    id: 4,
    name: "David Park",
    role: "Operations Manager",
    location: "E-commerce Company, Culver City",
    rating: 5,
    quote: "The logistics are seamless and the professional setup means zero disruption to our operations. Employees consistently rate the recovery sessions as their favorite workplace benefit.",
    verified: true,
    sessionCount: "200+ sessions completed"
  }
];

const corporateFAQs = [
  {
    question: "How does mobile recovery therapy work at corporate locations?",
    answer: "We bring our professional equipment directly to your office, setting up in conference rooms, outdoor spaces, or designated wellness areas. Setup typically takes 45-60 minutes, and we handle all logistics including breakdown and cleanup. No special infrastructure is required."
  },
  {
    question: "What ROI can we expect from corporate wellness programs?",
    answer: "Companies typically see 3:1 to 6:1 ROI through reduced absenteeism, lower healthcare costs, improved productivity, and enhanced employee retention. We provide detailed analytics to track usage, employee satisfaction, and wellness metrics to measure program success."
  },
  {
    question: "How do you accommodate different employee schedules and preferences?",
    answer: "We offer flexible scheduling including before work, lunch hours, and after work sessions. Employees can book individual slots or participate in group sessions. We work with your HR team to create scheduling systems that maximize participation while minimizing workflow disruption."
  },
  {
    question: "Can the program integrate with our existing wellness benefits?",
    answer: "Absolutely! Our programs complement existing wellness initiatives and can integrate with your current benefits platform. We work with wellness committees, HR teams, and benefits providers to create a cohesive employee wellness ecosystem."
  },
  {
    question: "What safety and insurance considerations are there?",
    answer: "We carry comprehensive commercial liability insurance and follow strict safety protocols. All employees receive safety briefings, and our certified technicians monitor all sessions. We also provide health screening questionnaires and work with your occupational health requirements."
  },
  {
    question: "How do you measure employee engagement and program success?",
    answer: "We provide detailed analytics including participation rates, session frequency, employee satisfaction scores, and wellness metrics. Optional surveys and biometric tracking can measure stress levels, sleep quality, and overall wellness improvements to demonstrate clear ROI."
  }
];

export default function CorporateWellnessPage() {
  return (
    <div className="min-h-screen">
      <LandingHero
        headline="Corporate Wellness Los Angeles"
        subheadline="Transform your workplace culture with professional mobile recovery therapy. Boost employee wellness, productivity, and retention with on-site cold plunge and infrared sauna programs tailored for LA businesses."
        primaryCTA="Schedule Consultation"
        secondaryCTA="View Programs"
        badges={[
          { icon: Shield, text: "Fully Insured Service" },
          { icon: Users, text: "500+ Employees Served" },
          { icon: Clock, text: "Flexible Scheduling" }
        ]}
        trustIndicators={{
          rating: 5,
          reviewCount: "50+",
          locationText: "LA Companies Served"
        }}
        urgency={{
          text: "Q1 program planning -",
          highlight: "Book your consultation!"
        }}
      />

      <LandingFeatures
        title="Why LA Companies Choose Our Wellness Programs"
        subtitle="Invest in your most valuable asset - your team. Our corporate wellness programs deliver measurable improvements in employee satisfaction, productivity, and overall company culture."
        features={corporateFeatures}
        ctaText="Get Program Details"
        ctaSubtext="Join innovative LA companies that prioritize employee wellness and see the competitive advantage it provides."
      />

      <LandingTestimonials
        title="Real Results from LA Companies"
        subtitle="See how forward-thinking organizations across Los Angeles have transformed their workplace culture and employee satisfaction with professional recovery therapy programs."
        testimonials={corporateTestimonials}
        targetAudience="corporate"
      />

      <LandingPricing
        title="Corporate Wellness Investment Options"
        subtitle="Choose the wellness program that fits your organization size and culture. Transparent pricing with measurable ROI that benefits both employees and your bottom line."
        tiers={corporatePricing}
        guaranteeText="Employee satisfaction guarantee"
        additionalInfo={[
          "No long-term contracts required",
          "Flexible scheduling and setup",
          "Comprehensive insurance coverage included"
        ]}
      />

      <LandingFAQ
        title="Corporate Wellness Program Questions?"
        subtitle="Get answers about implementing workplace recovery therapy, ROI expectations, logistics, and how our programs integrate with your existing benefits."
        faqs={corporateFAQs}
        contactCTA={{
          text: "Ready to invest in employee wellness?",
          subtext: "Schedule a consultation to discuss your company's wellness goals and program options"
        }}
      />
    </div>
  );
}