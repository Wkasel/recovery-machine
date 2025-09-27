"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heading, Text } from "@/components/typography/Typography";
import { Check, ArrowRight, Star, Zap } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface PricingTier {
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  period: string;
  savings?: string;
  features: string[];
  cta: string;
  popular?: boolean;
  highlight?: {
    text: string;
    icon?: React.ComponentType<{ className?: string }>;
  };
}

interface LandingPricingProps {
  title: string;
  subtitle: string;
  tiers: PricingTier[];
  guaranteeText?: string;
  additionalInfo?: string[];
}

export const LandingPricing: FC<LandingPricingProps> = ({
  title,
  subtitle,
  tiers,
  guaranteeText = "30-day money-back guarantee",
  additionalInfo = [
    "No long-term contracts",
    "Cancel anytime with 30 days notice",
    "Professional setup included"
  ]
}) => {
  return (
    <section id="pricing" className="py-24 lg:py-32 bg-background">
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

        {/* Pricing Tiers */}
        <div className={`grid gap-8 ${tiers.length === 1 ? 'max-w-xl mx-auto' : tiers.length === 2 ? 'grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto' : 'grid-cols-1 lg:grid-cols-3'} mb-16`}>
          {tiers.map((tier, index) => (
            <Card 
              key={index} 
              className={`relative ${tier.popular ? 'border-primary border-2 shadow-xl' : 'border-border'} transition-all duration-300 hover:shadow-lg`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-6 py-2 text-sm font-semibold">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8 pt-12">
                {tier.highlight && (
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4 mx-auto">
                    {tier.highlight.icon && <tier.highlight.icon className="h-4 w-4" />}
                    {tier.highlight.text}
                  </div>
                )}

                <Heading as="h3" size="xl" weight="bold" className="mb-2">
                  {tier.name}
                </Heading>
                
                <Text size="base" color="muted" className="mb-6">
                  {tier.description}
                </Text>

                <div className="mb-6">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-5xl font-bold text-foreground">{tier.price}</span>
                    <span className="text-muted-foreground ml-2">{tier.period}</span>
                  </div>
                  
                  {tier.originalPrice && tier.savings && (
                    <div className="flex items-center justify-center gap-3 text-sm">
                      <span className="text-muted-foreground line-through">
                        {tier.originalPrice}
                      </span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        Save {tier.savings}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="px-8 pb-8">
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <Text size="sm" className="text-foreground">
                        {feature}
                      </Text>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  size="lg"
                  className={`w-full ${tier.popular ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'} text-lg font-semibold h-14`}
                  variant={tier.popular ? "default" : "secondary"}
                >
                  <Link href="/book" className="inline-flex items-center justify-center">
                    {tier.cta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Information */}
        <div className="bg-muted/30 border border-border rounded-lg p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 text-primary mb-2">
              <Zap className="h-5 w-5" />
              <Text size="lg" weight="semibold" className="text-foreground">
                {guaranteeText}
              </Text>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {additionalInfo.map((info, index) => (
              <div key={index} className="flex items-center justify-center gap-2">
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                <Text size="sm" color="muted">
                  {info}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};