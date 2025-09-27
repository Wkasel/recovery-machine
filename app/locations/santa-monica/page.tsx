import { Metadata } from "next";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingPricing } from "@/components/landing/LandingPricing";
import { LandingTestimonials } from "@/components/landing/LandingTestimonials";
import { LandingFAQ } from "@/components/landing/LandingFAQ";
import { Snowflake, Flame, Trophy, Shield, Clock, Star, MapPin, Waves, Sun } from "lucide-react";

export const metadata: Metadata = {
  title: "Mobile Recovery Santa Monica | Cold Plunge + Sauna Beach Delivery | The Recovery Machine",
  description: "Professional mobile recovery services in Santa Monica. Cold plunge and infrared sauna therapy delivered to your beachside location. Perfect for Santa Monica's active wellness community.",
  keywords: "mobile recovery Santa Monica, cold plunge Santa Monica, infrared sauna delivery Santa Monica, beach wellness 90401, athletic recovery Santa Monica",
  openGraph: {
    title: "Mobile Recovery Santa Monica - Beachside Wellness Delivered",
    description: "Experience professional mobile recovery therapy in Santa Monica. Cold plunge and infrared sauna services delivered to your beachside location with ocean views.",
    url: "https://therecoverymachine.com/locations/santa-monica",
    siteName: "The Recovery Machine",
    images: [
      {
        url: "/santa-monica-recovery-og.jpg",
        width: 1200,
        height: 630,
        alt: "Mobile Recovery Santa Monica"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Mobile Recovery Santa Monica | Beachside Wellness",
    description: "Professional cold plunge and sauna therapy delivered to Santa Monica locations. Perfect for beach workouts!",
    images: ["/santa-monica-recovery-og.jpg"]
  },
  alternates: {
    canonical: "https://therecoverymachine.com/locations/santa-monica"
  }
};

const santaMonicaFeatures = [
  {
    icon: Waves,
    title: "Beachside Cold Plunge Santa Monica",
    description: "Perfect complement to Santa Monica's beach culture and active lifestyle. Cold water therapy that enhances your beach workouts and ocean activities.",
    benefits: [
      "Ideal post-beach workout recovery",
      "Enhances ocean swimming benefits",
      "Perfect for Santa Monica athletes",
      "Complements beach volleyball training"
    ]
  },
  {
    icon: Sun,
    title: "Infrared Sauna for Active Lifestyles",
    description: "Designed for Santa Monica's health-conscious community. Our mobile infrared saunas provide the perfect recovery solution for your active beach lifestyle.",
    benefits: [
      "Enhanced post-workout recovery",
      "Supports active beach lifestyle",
      "Ideal for yoga and fitness enthusiasts",
      "Perfect for sunset recovery sessions"
    ]
  },
  {
    icon: Trophy,
    title: "Athletic Recovery for Beach Athletes",
    description: "Tailored for Santa Monica's vibrant athletic community including beach volleyball players, surfers, runners, and fitness enthusiasts.",
    benefits: [
      "Optimized for beach sports",
      "Supports endurance training",
      "Enhances outdoor workout recovery",
      "Popular with Santa Monica gyms"
    ]
  }
];

const santaMonicaPricing = [
  {
    name: "Santa Monica Cold Plunge",
    description: "Beach-perfect cold water therapy",
    price: "$150",
    period: "per session",
    features: [
      "30-minute cold plunge session",
      "Beach-friendly setup options",
      "Temperature optimized for post-beach recovery",
      "Professional safety monitoring",
      "Outdoor setup available",
      "Perfect for group beach sessions"
    ],
    cta: "Book Beach Recovery",
    highlight: {
      text: "Beach Perfect",
      icon: Waves
    }
  },
  {
    name: "Santa Monica Sauna Experience", 
    description: "Sunset sauna sessions with ocean breeze",
    price: "$175",
    period: "per session",
    features: [
      "45-minute infrared sauna session",
      "Ocean-view setup when possible",
      "Perfect for post-workout recovery",
      "Flexible outdoor positioning",
      "Sunset session specialty",
      "Beach community favorite"
    ],
    cta: "Book Sunset Sauna",
    highlight: {
      text: "Sunset Special",
      icon: Sun
    }
  }
];

const santaMonicaTestimonials = [
  {
    id: 1,
    name: "Jake Sullivan",
    role: "Beach Volleyball Player",
    location: "Santa Monica Beach, CA",
    rating: 5,
    quote: "After training on the beach all day, the mobile cold plunge is perfect for recovery. They set it up right near the beach and it's become essential to my training routine. Way better than just jumping in the ocean!",
    verified: true,
    sessionCount: "40+ sessions",
    beforeAfter: {
      before: "48 hrs",
      after: "24 hrs",
      metric: "Recovery Time"
    }
  },
  {
    id: 2,
    name: "Maria Gonzalez",
    role: "Yoga Instructor",
    location: "Santa Monica Pier Area",
    rating: 5,
    quote: "The infrared sauna delivery fits perfectly with my wellness practice. I love scheduling sunset sessions after teaching beach yoga classes. My students are always amazed when they see the setup!",
    verified: true,
    sessionCount: "35+ sessions",
    beforeAfter: {
      before: "7/10",
      after: "9/10",
      metric: "Flexibility"
    }
  },
  {
    id: 3,
    name: "David Chen",
    role: "Tech Startup Founder",
    location: "Santa Monica Business District",
    rating: 5,
    quote: "Working in Santa Monica's tech scene is intense. Having the mobile recovery service come to our office near the beach helps the whole team decompress. It's become our favorite team building activity.",
    verified: true,
    sessionCount: "25+ team sessions"
  },
  {
    id: 4,
    name: "Lisa Rodriguez",
    role: "Marathon Runner",
    location: "Santa Monica Running Community",
    rating: 5,
    quote: "The Santa Monica running community loves this service. After long beach runs, the mobile cold plunge helps with recovery and inflammation. It's like having a sports recovery center come to you.",
    verified: true,
    sessionCount: "50+ sessions"
  }
];

const santaMonicaFAQs = [
  {
    question: "Can you set up near Santa Monica Beach?",
    answer: "Yes! We can set up in beachside locations, private beach homes, and areas near Santa Monica Beach. Our equipment is designed for outdoor use and we can coordinate setups that take advantage of Santa Monica's beautiful ocean views."
  },
  {
    question: "Do you work with Santa Monica fitness studios and gyms?",
    answer: "Absolutely! We partner with many Santa Monica fitness studios, yoga classes, and gyms. We can coordinate group sessions for fitness classes, team training events, and wellness workshops throughout the Santa Monica area."
  },
  {
    question: "Is your service popular with beach athletes?",
    answer: "Very! Our Santa Monica service is especially popular with beach volleyball players, surfers, runners, and cyclists. The cold plunge therapy is perfect for post-beach workout recovery and complements the ocean lifestyle perfectly."
  },
  {
    question: "Can you accommodate sunset recovery sessions?",
    answer: "Yes, sunset sessions are one of our most popular Santa Monica offerings! We can schedule infrared sauna sessions during golden hour for a truly magical wellness experience with ocean views."
  },
  {
    question: "Do you serve all of Santa Monica?",
    answer: "We provide comprehensive service throughout Santa Monica including the Pier area, Third Street Promenade, Santa Monica Business District, beachfront properties, and all residential neighborhoods. Same-day booking is available throughout the area."
  }
];

export default function SantaMonicaPage() {
  return (
    <div className="min-h-screen">
      <LandingHero
        headline="Mobile Recovery Santa Monica"
        subheadline="Experience the perfect fusion of professional recovery therapy and Santa Monica's beach culture. Cold plunge and infrared sauna services delivered to your beachside location for the ultimate wellness experience."
        primaryCTA="Book Santa Monica Service"
        secondaryCTA="View Beach Packages"
        badges={[
          { icon: Waves, text: "Beach-Perfect Setup" },
          { icon: Star, text: "5-Star Santa Monica Reviews" },
          { icon: Clock, text: "Sunset Sessions Available" }
        ]}
        trustIndicators={{
          rating: 5,
          reviewCount: "200+",
          locationText: "Santa Monica Athletes"
        }}
        urgency={{
          text: "Beach season booking -",
          highlight: "Reserve your spot!"
        }}
      />

      <LandingFeatures
        title="Recovery Services for Santa Monica's Active Community"
        subtitle="Designed for Santa Monica's vibrant beach culture and active lifestyle. Our mobile recovery services complement your beach workouts, ocean activities, and wellness routine with professional-grade therapy delivered to your location."
        features={santaMonicaFeatures}
        ctaText="Experience Beach Recovery"
        ctaSubtext="Join Santa Monica's athletic community who've discovered the perfect complement to their beach lifestyle."
      />

      <LandingTestimonials
        title="Santa Monica Recovery Success Stories"
        subtitle="See how Santa Monica's athletes, fitness enthusiasts, and wellness community have integrated professional mobile recovery therapy into their active beach lifestyle."
        testimonials={santaMonicaTestimonials}
        targetAudience="athlete"
      />

      <LandingPricing
        title="Santa Monica Beach Recovery Pricing"
        subtitle="Transparent pricing for Santa Monica's wellness community. Beach-perfect recovery sessions designed for active lifestyles and outdoor enthusiasts."
        tiers={santaMonicaPricing}
        guaranteeText="Beach community satisfaction guarantee"
        additionalInfo={[
          "Beach-friendly outdoor setup",
          "Sunset session specialty",
          "Group beach sessions available"
        ]}
      />

      <LandingFAQ
        title="Santa Monica Beach Recovery Questions?"
        subtitle="Get answers about our mobile recovery services in Santa Monica, beach setups, athletic recovery programs, and how we serve the active Santa Monica community."
        faqs={santaMonicaFAQs}
        contactCTA={{
          text: "Ready for beach recovery sessions?",
          subtext: "Experience Santa Monica's favorite mobile recovery service trusted by beach athletes"
        }}
      />

      {/* Santa Monica Specific Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Serving All of Santa Monica</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[
              "Santa Monica Beach",
              "Third Street Promenade",
              "Santa Monica Pier",
              "Main Street",
              "Ocean Park",
              "Mid-City Santa Monica"
            ].map((area) => (
              <div key={area} className="p-4 bg-background rounded-lg">
                <MapPin className="h-4 w-4 text-primary mx-auto mb-2" />
                <div className="text-sm font-medium">{area}</div>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground">
            Professional mobile recovery services throughout Santa Monica with beach-friendly setup options
          </p>
        </div>
      </section>

      {/* Beach Lifestyle Integration */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Perfect for Santa Monica's Beach Lifestyle</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Waves className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Beach Volleyball Recovery</h3>
              <p className="text-sm text-muted-foreground">
                Perfect post-game recovery for Santa Monica's vibrant beach volleyball community.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sun className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Sunset Wellness Sessions</h3>
              <p className="text-sm text-muted-foreground">
                Magical infrared sauna experiences during Santa Monica's famous golden hour.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Athletic Community Favorite</h3>
              <p className="text-sm text-muted-foreground">
                Trusted by Santa Monica's runners, cyclists, surfers, and fitness enthusiasts.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}