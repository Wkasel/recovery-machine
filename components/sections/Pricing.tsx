"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar, Check, Clock, Star, Users } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Weekly Recovery Membership",
    subtitle: "Perfect for consistent performance",
    price: "$400",
    period: "per month",
    originalValue: "$1,600",
    savings: "75%",
    description: "4 home visits (1 per week), 30 minutes per person",
    features: [
      "4 mobile sessions per month (1 per week)",
      "30-minute sessions (cold plunge + IR sauna)",
      "Professional setup and guidance",
      "Flexible scheduling",
      "Cancel with 30 days' notice",
      "Doorstep delivery and pickup",
    ],
    popular: true,
    cta: "Subscribe Now",
    ctaVariant: "default" as const,
  },
];

const setupFee = {
  name: "One-Time Setup Fee",
  description: "Onboarding, setup, travel calibration, and supplies",
  priceRange: "$250 – $500",
  note: "Varies by distance and customization requirements",
  features: [
    "Professional equipment installation",
    "Safety calibration and testing",
    "Initial consultation and training",
    "Custom setup for your space",
    "Equipment maintenance kit",
    "24/7 support setup",
  ],
};

const addOns = [
  {
    name: "Extra Visit",
    price: "$150",
    unit: "per session",
    description: "Additional recovery session beyond your monthly plan",
  },
  {
    name: "Additional Family Member",
    price: "$75",
    unit: "per session",
    description: "Add family members to your existing sessions",
  },
  {
    name: "Branded Towels & Electrolytes",
    price: "Complimentary",
    unit: "",
    description: "Premium recovery accessories included with membership",
  },
];

const benefits = [
  {
    icon: Clock,
    title: "Save 75% vs. Single Bookings",
    description: "Just $100 per session with membership vs. $400 individual pricing",
  },
  {
    icon: Calendar,
    title: "Ultimate Flexibility",
    description: "Monthly auto-renew with 30-day cancellation notice",
  },
  {
    icon: Users,
    title: "Family-Friendly",
    description: "Add family members for just $75 per session",
  },
];

export default function Pricing() {
  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Professional recovery at a fraction of the cost. No hidden fees, no long-term contracts,
            maximum flexibility.
          </p>
          
          {/* Big Booking CTA */}
          <div className="flex justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xl px-16 py-6 h-auto shadow-xl"
            >
              <Link href="/book" className="flex items-center">
                <Calendar className="w-7 h-7 mr-4" />
                Book Your Recovery Session
                <ArrowRight className="w-6 h-6 ml-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* Main Pricing Plan */}
        <div className="max-w-2xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <Card key={index} className="relative bg-black border-2 border-neutral-800">
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-neutral-900 text-white border border-neutral-800 px-6 py-2 text-sm font-semibold">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8 pt-12">
                <CardTitle className="text-2xl font-bold text-white mb-2">{plan.name}</CardTitle>
                <p className="text-neutral-400 mb-6">{plan.subtitle}</p>

                <div className="mb-6">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-neutral-400 ml-2">{plan.period}</span>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <span className="text-neutral-500 line-through">
                      {plan.originalValue} value
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-neutral-900 text-white border border-neutral-800"
                    >
                      Save {plan.savings}
                    </Badge>
                  </div>
                </div>

                <p className="text-neutral-400 mb-8">{plan.description}</p>
              </CardHeader>

              <CardContent className="px-8 pb-8">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-neutral-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  size="lg"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xl font-bold h-16 shadow-lg"
                >
                  <Link href="/book" className="inline-flex items-center justify-center">
                    <Calendar className="mr-3 h-6 w-6" />
                    {plan.cta}
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Link>
                </Button>

                <p className="text-center text-sm text-neutral-500 mt-4">
                  No long-term commitment • Cancel anytime with 30 days notice
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Setup Fee & Add-ons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Setup Fee */}
          <Card className="bg-black border border-neutral-800">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white mb-2">{setupFee.name}</CardTitle>
              <div className="text-2xl font-bold text-white mb-2">{setupFee.priceRange}</div>
              <p className="text-neutral-400 text-sm">{setupFee.note}</p>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-300 mb-6">{setupFee.description}</p>
              <ul className="space-y-3">
                {setupFee.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-4 w-4 text-white mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-400 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Add-ons */}
          <Card className="bg-black border border-neutral-800">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white mb-4">Optional Add-Ons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {addOns.map((addon, index) => (
                  <div
                    key={index}
                    className="border-b border-neutral-800 last:border-b-0 pb-4 last:pb-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white">{addon.name}</h4>
                      <span className="font-bold text-white">
                        {addon.price}
                        {addon.unit && (
                          <span className="text-sm font-normal text-neutral-400 ml-1">
                            {addon.unit}
                          </span>
                        )}
                      </span>
                    </div>
                    <p className="text-neutral-400 text-sm">{addon.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="bg-black border border-neutral-800 p-8 md:p-12">
          <h3 className="text-2xl font-bold text-white text-center mb-8">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-white text-black flex items-center justify-center text-lg font-bold mx-auto mb-4">
                1
              </div>
              <p className="text-neutral-300 font-medium">Monthly auto-renew</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-white text-black flex items-center justify-center text-lg font-bold mx-auto mb-4">
                2
              </div>
              <p className="text-neutral-300 font-medium">Cancel with 30 days' notice</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-white text-black flex items-center justify-center text-lg font-bold mx-auto mb-4">
                3
              </div>
              <p className="text-neutral-300 font-medium">Flexible scheduling</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-white text-black flex items-center justify-center text-lg font-bold mx-auto mb-4">
                4
              </div>
              <p className="text-neutral-300 font-medium">Doorstep delivery</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16 bg-black border border-neutral-800 p-12">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Recovery?</h3>
          <p className="text-xl text-neutral-400 mb-8 max-w-2xl mx-auto">
            Join 500+ members who've transformed their recovery routine with mobile wellness services.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xl px-16 py-6 h-auto shadow-xl"
          >
            <Link href="/book" className="inline-flex items-center">
              <Calendar className="mr-4 h-7 w-7" />
              Start Your Recovery Journey
              <ArrowRight className="ml-4 h-6 w-6" />
            </Link>
          </Button>
          <p className="mt-6 text-neutral-500">
            Available 7 days a week • Orange County & Los Angeles
          </p>
        </div>
      </div>
    </section>
  );
}
