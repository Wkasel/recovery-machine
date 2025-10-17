import { CheckCircle, Clock, Flame, Shield, Snowflake, Users } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Features & Benefits - Professional Recovery Therapy",
  description:
    "Discover the features and benefits of Recovery Machine's mobile cold plunge and infrared sauna services. Professional equipment, certified specialists, and complete service.",
  keywords:
    "cold plunge features, infrared sauna benefits, mobile wellness, professional recovery therapy, certified specialists",
  openGraph: {
    title: "Recovery Machine Features - Professional Mobile Recovery",
    description:
      "Professional recovery therapy delivered with commercial-grade equipment and expert guidance. Cold plunge and infrared sauna at your location.",
    type: "website",
    images: [
      {
        url: "/api/og?title=Recovery%20Machine%20Features&description=Professional%20Mobile%20Recovery",
        width: 1200,
        height: 630,
        alt: "Recovery Machine Features - Mobile Wellness Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Recovery Machine Features - Professional Mobile Recovery",
    description:
      "Professional recovery therapy delivered with commercial-grade equipment and expert guidance.",
  },
};

export default function FeaturesPage() {
  const features = [
    {
      icon: Snowflake,
      title: "Professional Cold Plunge",
      description:
        "Precision temperature control (38-55°F) with commercial-grade filtration system for optimal cold exposure therapy.",
    },
    {
      icon: Flame,
      title: "Full-Spectrum Infrared Sauna",
      description:
        "Near, mid, and far-infrared wavelengths for deep tissue healing, detoxification, and enhanced recovery.",
    },
    {
      icon: Users,
      title: "Certified Specialists",
      description:
        "Every session guided by trained recovery professionals who ensure safety and maximize therapeutic benefits.",
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description:
        "Book sessions that fit your schedule. Morning, afternoon, or evening - we adapt to your lifestyle.",
    },
    {
      icon: Shield,
      title: "Safety First",
      description:
        "Comprehensive health screening, professional oversight, and full insurance coverage for peace of mind.",
    },
    {
      icon: CheckCircle,
      title: "Complete Service",
      description:
        "Setup, guidance, premium accessories, and cleanup all included. You just show up and recover.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 text-foreground">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold font-serif tracking-tight mb-4">Features & Benefits</h1>
          <p className="text-xl font-light text-muted-foreground max-w-2xl mx-auto">
            Professional recovery therapy delivered with commercial-grade equipment and expert
            guidance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="bg-white/70 backdrop-blur-sm border border-border rounded-3xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 border border-border rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <IconComponent className="h-8 w-8 text-foreground" />
                </div>
                <h3 className="text-xl font-bold font-serif tracking-tight mb-4">{feature.title}</h3>
                <p className="text-muted-foreground font-light leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-border rounded-3xl shadow-lg p-12 text-center">
          <h2 className="text-3xl font-bold font-serif tracking-tight mb-6">Ready to Experience Professional Recovery?</h2>
          <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
            Join hundreds of professionals, athletes, and wellness enthusiasts who have transformed
            their recovery routine with Recovery Machine.
          </p>
          <Link
            href="/book"
            className="inline-block bg-primary text-primary-foreground px-12 py-4 text-lg font-semibold rounded-full hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-md"
          >
            Book Your First Session
          </Link>
        </div>
      </div>
    </div>
  );
}
