import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Snowflake, Flame, Trophy, Building2, ArrowRight, Star, Clock, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Mobile Recovery Services Los Angeles | Professional Wellness Delivery | The Recovery Machine",
  description: "Comprehensive mobile recovery services across Los Angeles. Professional cold plunge, infrared sauna, athletic recovery, and corporate wellness programs delivered to your door. Same-day booking available.",
  keywords: "mobile recovery services Los Angeles, wellness delivery LA, cold plunge delivery, infrared sauna rental, athletic recovery, corporate wellness Los Angeles",
  openGraph: {
    title: "Mobile Recovery Services Los Angeles - Professional Wellness Delivery",
    description: "Transform your wellness routine with professional mobile recovery services. Cold plunge, infrared sauna, athletic recovery, and corporate programs delivered across LA County.",
    url: "https://therecoverymachine.com/services",
    siteName: "The Recovery Machine",
    images: [
      {
        url: "/services-overview-og.jpg",
        width: 1200,
        height: 630,
        alt: "Mobile Recovery Services Los Angeles"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Mobile Recovery Services LA | Professional Wellness Delivery",
    description: "Comprehensive mobile recovery services delivered across Los Angeles. Book your session today!",
    images: ["/services-overview-og.jpg"]
  },
  alternates: {
    canonical: "https://therecoverymachine.com/services"
  }
};

const services = [
  {
    id: "cold-plunge",
    title: "Cold Plunge Los Angeles",
    description: "Professional mobile cold water therapy delivered to your door across LA County",
    longDescription: "Experience the proven benefits of cold water therapy with our professional-grade mobile cold plunge service. Our certified technicians bring state-of-the-art chiller systems maintaining precise temperature control (38-55°F) directly to your location.",
    href: "/cold-plunge-la",
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
    ],
    serviceAreas: [
      "Beverly Hills",
      "Santa Monica", 
      "West Hollywood",
      "Manhattan Beach",
      "Venice",
      "Malibu"
    ]
  },
  {
    id: "infrared-sauna",
    title: "Infrared Sauna Delivery",
    description: "Luxury full-spectrum infrared sauna therapy with professional home setup",
    longDescription: "Transform your wellness routine with our mobile infrared sauna service featuring advanced full-spectrum heating technology. Our spacious saunas accommodate 2-4 people and include luxury amenities for the ultimate heat therapy experience.",
    href: "/infrared-sauna-delivery",
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
    ],
    serviceAreas: [
      "Beverly Hills",
      "Santa Monica",
      "West Hollywood", 
      "Culver City",
      "Brentwood",
      "Pacific Palisades"
    ]
  },
  {
    id: "athletic-recovery",
    title: "Athletic Recovery Services",
    description: "Elite contrast therapy protocols for serious athletes and competitors",
    longDescription: "Accelerate your performance with professional contrast therapy trusted by elite athletes. Our scientifically-designed hot-cold therapy cycles combine cold plunge and infrared sauna sessions for maximum recovery benefits.",
    href: "/athletic-recovery",
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
    ],
    serviceAreas: [
      "Manhattan Beach",
      "Venice",
      "Santa Monica",
      "Hermosa Beach",
      "El Segundo",
      "Marina del Rey"
    ]
  },
  {
    id: "corporate-wellness",
    title: "Corporate Wellness Programs",
    description: "Employee wellness solutions that boost productivity and morale",
    longDescription: "Invest in your team with comprehensive workplace wellness programs. Our mobile recovery services provide measurable ROI through improved employee satisfaction, reduced stress, and enhanced productivity.",
    href: "/corporate-wellness",
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
    ],
    serviceAreas: [
      "Santa Monica Tech Hub",
      "Beverly Hills Business District",
      "Culver City Studios",
      "Century City",
      "West Hollywood",
      "Downtown LA"
    ]
  }
];

const trustIndicators = [
  { icon: Shield, text: "Licensed & Insured" },
  { icon: Star, text: "500+ 5-Star Reviews" },
  { icon: Clock, text: "Same-Day Booking" }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="mb-6">
            <Badge variant="secondary" className="mb-4">
              Professional Mobile Recovery
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Mobile Recovery Services
              <span className="block text-primary">Across Los Angeles</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Professional-grade wellness therapy delivered to your door. From cold plunge and infrared sauna 
              to athletic recovery and corporate wellness programs, we bring the spa experience to you.
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {trustIndicators.map((indicator, index) => {
              const IconComponent = indicator.icon;
              return (
                <div key={index} className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full">
                  <IconComponent className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{indicator.text}</span>
                </div>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/book">Book Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Recovery Solutions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our professional mobile recovery services, each designed to deliver 
              maximum therapeutic benefits with the convenience of home delivery.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <Card key={service.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{service.title}</CardTitle>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm font-medium text-primary">{service.price}</span>
                          <span className="text-sm text-muted-foreground">{service.duration}</span>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {service.longDescription}
                    </p>

                    {/* Service Highlights */}
                    <div>
                      <h4 className="font-medium mb-2">Service Highlights</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {service.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            {highlight}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Benefits */}
                    <div>
                      <h4 className="font-medium mb-2">Key Benefits</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.benefits.map((benefit, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Service Areas */}
                    <div>
                      <h4 className="font-medium mb-2">Service Areas</h4>
                      <p className="text-sm text-muted-foreground">
                        {service.serviceAreas.slice(0, 3).join(", ")} and {service.serviceAreas.length - 3} more locations
                      </p>
                    </div>

                    {/* CTA */}
                    <Button asChild className="w-full group-hover:bg-primary/90">
                      <Link href="/book" className="flex items-center justify-center gap-2">
                        Book Now
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Why Choose The Recovery Machine?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Professional Standards</h3>
              <p className="text-sm text-muted-foreground">
                Licensed technicians, medical-grade equipment, and comprehensive insurance for your peace of mind.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Ultimate Convenience</h3>
              <p className="text-sm text-muted-foreground">
                Same-day booking, complete setup and breakdown, zero hassle for maximum therapeutic benefit.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Proven Results</h3>
              <p className="text-sm text-muted-foreground">
                Trusted by 500+ satisfied customers including professional athletes and Fortune 500 companies.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <Button size="lg" asChild>
              <Link href="/book">Book Your Session</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Serving All of Los Angeles County</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Professional mobile recovery services delivered to your location across LA County
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {[
              "Beverly Hills", "Santa Monica", "West Hollywood", "Manhattan Beach",
              "Venice", "Malibu", "Culver City", "Brentwood", 
              "Pacific Palisades", "Marina del Rey", "Hermosa Beach", "El Segundo",
              "Century City", "Pasadena", "Burbank", "Long Beach"
            ].map((area) => (
              <div key={area} className="p-3 bg-background rounded-lg text-center hover:bg-primary/5 transition-colors">
                {area}
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            Don't see your area? <Link href="/book" className="text-primary hover:underline">Book now</Link> to check availability.
          </p>
        </div>
      </section>
    </div>
  );
}