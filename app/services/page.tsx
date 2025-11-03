import { Metadata } from "next";
import Link from "next/link";
import { Snowflake, Flame, Trophy, Building2, ArrowRight, Star, Clock, Shield } from "lucide-react";
import PageWrapper from "@/components/v2-design/layout/PageWrapper";
import { generatePageMetadata } from "@/lib/metadata-helpers";

export const metadata: Metadata = generatePageMetadata({
  title: "Mobile Recovery Services Los Angeles | Professional Wellness Delivery | The Recovery Machine",
  description: "Comprehensive mobile recovery services across Los Angeles. Professional cold plunge, infrared sauna, athletic recovery, and corporate wellness programs delivered to your door. Same-day booking available.",
  keywords: "mobile recovery services Los Angeles, wellness delivery LA, cold plunge delivery, infrared sauna rental, athletic recovery, corporate wellness Los Angeles",
  url: "/services",
  image: "/services-overview-og.jpg",
});

const services = [
  {
    id: "cold-plunge",
    title: "Cold Plunge Los Angeles",
    description: "Professional mobile cold water therapy delivered to your door across LA County",
    longDescription: "Experience the proven benefits of cold water therapy with our professional-grade mobile cold plunge service. Our certified technicians bring state-of-the-art chiller systems maintaining precise temperature control (38-55°F) directly to your location.",
    icon: Snowflake,
    price: "Starting at $175",
    duration: "60-minute sessions",
    highlights: [
      "Same-day availability",
      "Professional setup included",
      "Temperature customization",
      "Medical-grade filtration"
    ],
    benefits: [
      "Reduced inflammation",
      "Enhanced recovery",
      "Improved circulation",
      "Mental clarity"
    ]
  },
  {
    id: "infrared-sauna",
    title: "Infrared Sauna Delivery",
    description: "Luxury full-spectrum infrared sauna therapy with professional home setup",
    longDescription: "Transform your wellness routine with our mobile infrared sauna service featuring advanced full-spectrum heating technology. Our spacious saunas accommodate 2-4 people and include luxury amenities for the ultimate heat therapy experience.",
    icon: Flame,
    price: "Starting at $175",
    duration: "60-minute sessions",
    highlights: [
      "Full-spectrum infrared",
      "2-4 person capacity",
      "Luxury amenities included",
      "Professional monitoring"
    ],
    benefits: [
      "Cardiovascular health",
      "Detoxification",
      "Stress reduction",
      "Better sleep"
    ]
  },
  {
    id: "athletic-recovery",
    title: "Athletic Recovery Services",
    description: "Elite contrast therapy protocols for serious athletes and competitors",
    longDescription: "Accelerate your performance with professional contrast therapy trusted by elite athletes. Our scientifically-designed hot-cold therapy cycles combine cold plunge and infrared sauna sessions for maximum recovery benefits.",
    icon: Trophy,
    price: "Starting at $250",
    duration: "90-minute group sessions",
    highlights: [
      "Elite protocols",
      "Performance tracking",
      "Sport-specific customization",
      "Professional guidance"
    ],
    benefits: [
      "Faster recovery",
      "Injury prevention",
      "Performance gains",
      "Reduced soreness"
    ]
  },
  {
    id: "corporate-wellness",
    title: "Corporate Wellness Programs",
    description: "Employee wellness solutions that boost productivity and morale",
    longDescription: "Invest in your team with comprehensive workplace wellness programs. Our mobile recovery services provide measurable ROI through improved employee satisfaction, reduced stress, and enhanced productivity.",
    icon: Building2,
    price: "Starting at $1,000",
    duration: "Flexible scheduling",
    highlights: [
      "On-site delivery",
      "Flexible scheduling",
      "ROI tracking",
      "Employee education"
    ],
    benefits: [
      "Reduced absenteeism",
      "Higher productivity",
      "Improved retention",
      "Better team morale"
    ]
  }
];

export default function ServicesPage() {
  return (
    <PageWrapper maxWidth="7xl">
      {/* Hero Section */}
      <div className="text-center mb-16 animate-fade-in">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6 tracking-tight">
          MOBILE RECOVERY SERVICES
          <span className="block text-charcoal/80 mt-2">ACROSS LOS ANGELES</span>
        </h1>
        <p className="text-lg md:text-xl text-charcoal/80 max-w-3xl mx-auto mb-12 animate-fade-in-up">
          Professional-grade wellness therapy delivered to your door. From cold plunge and infrared sauna
          to athletic recovery and corporate wellness programs.
        </p>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-6 mb-12 stagger-children">
          <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full border border-charcoal/10">
            <Shield className="h-5 w-5 text-charcoal" />
            <span className="text-sm font-medium">Licensed & Insured</span>
          </div>
          <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full border border-charcoal/10">
            <Star className="h-5 w-5 text-charcoal" />
            <span className="text-sm font-medium">500+ 5-Star Reviews</span>
          </div>
          <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full border border-charcoal/10">
            <Clock className="h-5 w-5 text-charcoal" />
            <span className="text-sm font-medium">Same-Day Booking</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
          <Link
            href="/book"
            className="bg-charcoal text-white text-sm font-medium px-8 py-3 rounded-full hover:bg-charcoal/90 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            BOOK NOW
          </Link>
          <Link
            href="/about"
            className="bg-transparent border-2 border-charcoal text-charcoal text-sm font-medium px-8 py-3 rounded-full hover:bg-charcoal hover:text-white transition-all duration-300"
          >
            LEARN MORE
          </Link>
        </div>
      </div>

      {/* Services Grid */}
      <section className="mb-20">

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium mb-4">
            COMPREHENSIVE RECOVERY SOLUTIONS
          </h2>
          <p className="text-lg text-charcoal/80 max-w-2xl mx-auto">
            Choose from our professional mobile recovery services, each designed to deliver
            maximum therapeutic benefits with the convenience of home delivery.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div key={service.id} className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-charcoal/10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-mint-accent/20 rounded-2xl">
                    <IconComponent className="h-6 w-6 text-charcoal" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-medium">{service.title}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm font-medium text-mint-accent">{service.price}</span>
                      <span className="text-sm text-charcoal/60">{service.duration}</span>
                    </div>
                  </div>
                </div>

                <p className="text-base text-charcoal/80 mb-6">
                  {service.description}
                </p>

                <p className="text-sm text-charcoal/70 leading-relaxed mb-6">
                  {service.longDescription}
                </p>

                {/* Service Highlights */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-sm uppercase tracking-wide">Service Highlights</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {service.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-charcoal/80">
                        <div className="w-1.5 h-1.5 bg-mint-accent rounded-full" />
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-sm uppercase tracking-wide">Key Benefits</h4>
                  <div className="flex flex-wrap gap-2">
                    {service.benefits.map((benefit, index) => (
                      <span key={index} className="text-xs bg-mint-accent/20 text-charcoal px-3 py-1 rounded-full">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href="/book"
                  className="flex items-center justify-center gap-2 w-full bg-charcoal text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-charcoal/90 hover:scale-105 transition-all duration-300"
                >
                  BOOK NOW
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white/30 -mx-4 px-4">
        <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-medium mb-12">
          WHY CHOOSE THE RECOVERY MACHINE?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-mint-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-charcoal" />
            </div>
            <h3 className="font-medium mb-2 text-lg">PROFESSIONAL STANDARDS</h3>
            <p className="text-sm text-charcoal/70">
              Licensed technicians, medical-grade equipment, and comprehensive insurance for your peace of mind.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-mint-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-charcoal" />
            </div>
            <h3 className="font-medium mb-2 text-lg">ULTIMATE CONVENIENCE</h3>
            <p className="text-sm text-charcoal/70">
              Same-day booking, complete setup and breakdown, zero hassle for maximum therapeutic benefit.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-mint-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-charcoal" />
            </div>
            <h3 className="font-medium mb-2 text-lg">PROVEN RESULTS</h3>
            <p className="text-sm text-charcoal/70">
              Trusted by 500+ satisfied customers including professional athletes and Fortune 500 companies.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <Link
            href="/book"
            className="inline-block bg-charcoal text-white text-sm font-medium px-10 py-4 rounded-full hover:bg-charcoal/90 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            BOOK YOUR SESSION
          </Link>
        </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-medium mb-6">SERVING ALL OF LOS ANGELES COUNTY</h2>
          <p className="text-lg text-charcoal/80 mb-12">
            Professional mobile recovery services delivered to your location across LA County
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              "Beverly Hills", "Santa Monica", "West Hollywood", "Manhattan Beach",
              "Venice", "Malibu", "Culver City", "Brentwood",
              "Pacific Palisades", "Marina del Rey", "Hermosa Beach", "El Segundo",
              "Century City", "Pasadena", "Burbank", "Long Beach"
            ].map((area) => (
              <div key={area} className="p-4 bg-white/50 backdrop-blur-sm rounded-xl text-center hover:bg-white/70 transition-colors border border-charcoal/10">
                {area}
              </div>
            ))}
          </div>

          <p className="text-sm text-charcoal/70 mt-8">
            Don't see your area? <Link href="/book" className="text-charcoal font-medium hover:underline">Book now</Link> to check availability.
          </p>
        </div>
      </section>
    </PageWrapper>
  );
}
