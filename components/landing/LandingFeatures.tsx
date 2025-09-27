"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/typography/Typography";
import { Check, ArrowRight, Snowflake, Heart, MapPin, Flame, Sun, Thermometer, Shield, Clock, Zap } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

// Icon mapping for client components
const iconMap = {
  Snowflake,
  Heart,
  MapPin,
  Flame,
  Sun,
  Thermometer,
  Shield,
  Clock,
  Zap,
} as const;

type IconName = keyof typeof iconMap;

interface Feature {
  icon: IconName;
  title: string;
  description: string;
  benefits: string[];
}

interface LandingFeaturesProps {
  title: string;
  subtitle: string;
  features: Feature[];
  ctaText: string;
  ctaSubtext?: string;
}

export const LandingFeatures: FC<LandingFeaturesProps> = ({
  title,
  subtitle,
  features,
  ctaText,
  ctaSubtext
}) => {
  return (
    <section className="py-24 lg:py-32 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Heading
            as="h2"
            size="display-md"
            weight="bold"
            className="mb-6 tracking-tight"
          >
            {title}
          </Heading>
          <Text
            size="xl"
            color="muted"
            align="center"
            className="max-w-3xl mx-auto leading-relaxed"
          >
            {subtitle}
          </Text>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon];
            return (
              <Card key={index} className="border-border hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg mb-6 mx-auto">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  
                  <Heading
                    as="h3"
                    size="lg"
                    weight="semibold"
                    align="center"
                    className="mb-4"
                  >
                    {feature.title}
                  </Heading>
                  
                  <Text
                    size="base"
                    color="muted"
                    align="center"
                    className="mb-6 leading-relaxed"
                  >
                    {feature.description}
                  </Text>

                  {/* Benefits List */}
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <Text size="sm" className="text-foreground">
                          {benefit}
                        </Text>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-card border border-border rounded-lg p-12">
          <Heading
            as="h3"
            size="xl"
            weight="semibold"
            className="mb-4"
          >
            Ready to Experience the Difference?
          </Heading>
          
          {ctaSubtext && (
            <Text
              size="lg"
              color="muted"
              align="center"
              className="mb-8 max-w-2xl mx-auto"
            >
              {ctaSubtext}
            </Text>
          )}

          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-semibold h-14 px-10"
          >
            <Link href="/book" className="flex items-center">
              <span className="mr-2">{ctaText}</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          
          <Text
            size="sm"
            color="muted"
            align="center"
            className="mt-4"
          >
            Book in 60 seconds • Same-day availability • 100% satisfaction guarantee
          </Text>
        </div>
      </div>
    </section>
  );
};