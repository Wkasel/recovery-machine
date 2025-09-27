"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heading, Text } from "@/components/typography/Typography";
import { ArrowRight, Star, Shield, MapPin, Clock, Thermometer, Flame, Snowflake, Zap, Heart, Sun } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { usePathname } from "next/navigation";
import { trackBookingClick } from "@/components/analytics/ConversionTracking";

// Icon mapping for client components
const iconMap = {
  Shield,
  Clock,
  Thermometer,
  Flame, 
  Snowflake,
  Zap,
  Heart,
  Sun,
  MapPin,
} as const;

type IconName = keyof typeof iconMap;

interface LandingHeroProps {
  headline: string;
  subheadline: string;
  primaryCTA: string;
  secondaryCTA?: string;
  videoSrc?: string;
  badges?: Array<{
    icon: IconName;
    text: string;
  }>;
  trustIndicators?: {
    rating: number;
    reviewCount: string;
    locationText?: string;
  };
  urgency?: {
    text: string;
    highlight: string;
  };
}

export const LandingHero: FC<LandingHeroProps> = ({
  headline,
  subheadline,
  primaryCTA,
  secondaryCTA,
  videoSrc = "/promo-video.mp4",
  badges = [
    { icon: Shield, text: "Licensed & Insured" },
    { icon: Star, text: "5-Star Service" },
    { icon: Clock, text: "Same-Day Booking" }
  ],
  trustIndicators = {
    rating: 5,
    reviewCount: "500+",
    locationText: "Los Angeles Area"
  },
  urgency
}) => {
  const pathname = usePathname();

  const handleBookingClick = () => {
    trackBookingClick("hero_primary_cta", pathname);
  };
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center bg-background text-foreground overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-30">
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-background/90" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Indicator Badge */}
        <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 border border-border mb-6">
          <div className="flex items-center">
            {[...Array(trustIndicators.rating)].map((_, i) => (
              <Star key={i} className="h-4 w-4 text-primary fill-current" />
            ))}
          </div>
          <span className="text-muted-foreground text-sm">
            {trustIndicators.rating}.0 • {trustIndicators.reviewCount} Reviews
          </span>
          {trustIndicators.locationText && (
            <>
              <span className="text-muted-foreground">•</span>
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground text-sm">{trustIndicators.locationText}</span>
            </>
          )}
        </div>

        {/* Urgency Banner */}
        {urgency && (
          <Badge className="bg-primary text-primary-foreground mb-6 px-4 py-2 text-sm font-semibold">
            {urgency.text} <span className="font-bold">{urgency.highlight}</span>
          </Badge>
        )}

        {/* Main Headline */}
        <Heading 
          as="h1" 
          size="display-lg" 
          weight="bold" 
          className="font-mono tracking-tight mb-6 leading-tight"
        >
          {headline}
        </Heading>

        {/* Subheadline */}
        <Text 
          size="xl" 
          color="muted" 
          align="center" 
          className="max-w-3xl mx-auto leading-relaxed mb-8"
        >
          {subheadline}
        </Text>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-semibold h-14 px-10"
          >
            <Link href="/book" className="flex items-center" onClick={handleBookingClick}>
              <span className="mr-2">{primaryCTA}</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          {secondaryCTA && (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-primary text-primary hover:bg-primary/10 text-lg font-semibold h-14 px-10"
            >
              <Link href="#pricing">
                {secondaryCTA}
              </Link>
            </Button>
          )}
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {badges.map((badge, index) => {
            const IconComponent = iconMap[badge.icon];
            return (
              <div key={index} className="flex items-center justify-center gap-3 text-muted-foreground bg-muted/50 px-4 py-3 border border-border">
                <IconComponent className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{badge.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="w-6 h-10 border-2 border-muted-foreground/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground/70 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};