"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar, Check, Clock, Star, Users } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Recovery Lite",
    subtitle: "2 visits per month",
    price: "$275",
    period: "per month",
    description: "Personalized infrared or cold plunge sessions",
    features: [
      "2 mobile sessions per month",
      "Choose infrared sauna or cold plunge",
      "Professional setup and guidance",
      "Flexible scheduling",
      "Cancel with 30 days' notice",
    ],
    popular: false,
    cta: "Get Started",
    ctaVariant: "default" as const,
  },
  {
    name: "Full Spectrum Contrast",
    subtitle: "4 visits per month",
    price: "$525",
    period: "per month",
    description: "Includes infrared + cold plunge contrast therapy",
    features: [
      "4 mobile sessions per month (1 per week)",
      "Full contrast therapy (cold plunge + infrared)",
      "Professional setup and guidance",
      "Priority scheduling",
      "Cancel with 30 days' notice",
      "Save 10% with 10-session pack",
    ],
    popular: true,
    cta: "Start Membership",
    ctaVariant: "default" as const,
  },
  {
    name: "Elite Performance",
    subtitle: "8 visits per month",
    price: "$850",
    period: "per month",
    description: "All-modality recovery with priority scheduling",
    features: [
      "8 mobile sessions per month (2 per week)",
      "All recovery modalities included",
      "Priority scheduling",
      "Personalized recovery protocols",
      "Cancel with 30 days' notice",
      "Maximum flexibility",
    ],
    popular: false,
    cta: "Join Elite",
    ctaVariant: "default" as const,
  },
];

const singleSessions = [
  {
    name: "Household Recovery Session",
    price: "$175-$200",
    description: "Up to 4 people • 60 minutes",
  },
  {
    name: "Group/Team Recovery",
    price: "$250-$300",
    description: "5+ people • 90 minutes",
  },
];

const corporatePackages = [
  {
    name: "Corporate/Event Package",
    price: "$1,000-$1,200",
    description: "4+ hours on-site for wellness days, events, and athletic teams",
  },
  {
    name: "Gym Rental - 1 Day/Month",
    price: "$1,500",
    description: "Full day access (8 hours)",
  },
  {
    name: "Gym Rental - 2 Days/Month",
    price: "$1,250 per day",
    description: "Full day access (8 hours each)",
  },
  {
    name: "Half Day Rental",
    price: "$750",
    description: "4 hours access",
  },
];

const travelFees = {
  name: "Travel & Service Area",
  description: "Serving all of Orange County",
  features: [
    "Complimentary within 5 miles of Costa Mesa (2777 Bristol St)",
    "+$25 every 10 additional miles",
    "Coverage throughout Orange County",
  ],
};

const benefits = [
  {
    icon: Clock,
    title: "Flexible Memberships",
    description: "From 2 to 8 visits per month - choose what fits your lifestyle",
  },
  {
    icon: Calendar,
    title: "Easy Cancellation",
    description: "Monthly auto-renew with 30-day cancellation notice",
  },
  {
    icon: Users,
    title: "Group Sessions Available",
    description: "Household and team recovery options for groups of all sizes",
  },
];

export default function Pricing() {
  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/15 px-5 py-2.5 rounded-full border border-primary/30 text-sm font-bold mb-8 shadow-sm">
            <Star className="h-5 w-5 text-primary fill-current" />
            <span className="text-primary text-wide">Transparent Pricing</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-bold text-foreground mb-8 heading-condensed uppercase">
            Simple,<br className="md:hidden" /> Transparent<br className="md:hidden" /> Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12" style={{ letterSpacing: '0.01em' }}>
            Professional recovery at a fraction of the cost.<br className="hidden md:block" /> No hidden fees, no long-term contracts, maximum flexibility.
          </p>
          
          {/* Big Booking CTA */}
          <div className="flex justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 font-bold text-xl px-16 py-6 h-auto rounded-full shadow-lg transition-all duration-300"
            >
              <Link href="/book" className="flex items-center">
                <Calendar className="w-7 h-7 mr-4" />
                Book Your First Session
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
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-white border-2 border-primary/20 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:scale-110 group-hover:border-primary/40 transition-all duration-300">
                    <IconComponent className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-serif font-bold text-foreground mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-light">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* Membership Plans */}
        <div className="mb-24">
          <div className="flex items-center justify-center gap-3 mb-14">
            <div className="h-px w-12 bg-primary/30"></div>
            <h3 className="section-header text-2xl text-primary">Membership & Subscription</h3>
            <div className="h-px w-12 bg-primary/30"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative bg-white/70 backdrop-blur-sm border-2 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 ${plan.popular ? 'border-primary' : 'border-border'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary/15 text-primary border border-primary/30 px-6 py-2 text-sm font-semibold rounded-full shadow-sm">
                      <Star className="h-4 w-4 mr-1 fill-current" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-6 pt-12">
                  <CardTitle className="text-2xl font-bold text-foreground mb-1 uppercase tracking-tight">{plan.name}</CardTitle>
                  <p className="text-muted-foreground mb-8 text-sm" style={{ letterSpacing: '0.05em' }}>{plan.subtitle.toUpperCase()}</p>

                  <div className="mb-6">
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-5xl font-bold text-foreground price-display">{plan.price}</span>
                    </div>
                    <span className="text-muted-foreground text-sm" style={{ letterSpacing: '0.02em' }}>{plan.period}</span>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed">{plan.description}</p>
                </CardHeader>

                <CardContent className="px-6 pb-8">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 font-bold h-14 rounded-full shadow-lg transition-all duration-300"
                  >
                    <Link href="/book" className="inline-flex items-center justify-center">
                      <Calendar className="mr-2 h-5 w-5" />
                      {plan.cta}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-muted-foreground">
            Save 10% when you purchase a 10-session pack
          </p>
        </div>

        {/* Single Sessions & Corporate Packages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* Single Sessions */}
          <Card className="bg-white/70 backdrop-blur-sm border border-border rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-4 w-4 text-primary" />
                <CardTitle className="section-header text-lg text-primary">Household & Team Recovery Sessions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {singleSessions.map((session, index) => (
                  <div
                    key={index}
                    className="border-b border-border last:border-b-0 pb-4 last:pb-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-foreground uppercase tracking-tight text-sm">{session.name}</h4>
                      <span className="font-bold text-foreground price-display text-lg">{session.price}</span>
                    </div>
                    <p className="text-muted-foreground text-sm" style={{ letterSpacing: '0.01em' }}>{session.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Corporate Packages */}
          <Card className="bg-white/70 backdrop-blur-sm border border-border rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-4 w-4 text-primary" />
                <CardTitle className="section-header text-lg text-primary">Corporate & Gym Packages</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {corporatePackages.map((pkg, index) => (
                  <div
                    key={index}
                    className="border-b border-border last:border-b-0 pb-4 last:pb-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-foreground uppercase tracking-tight text-sm">{pkg.name}</h4>
                      <span className="font-bold text-foreground text-right price-display text-lg">{pkg.price}</span>
                    </div>
                    <p className="text-muted-foreground text-sm" style={{ letterSpacing: '0.01em' }}>{pkg.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Travel & Service Area */}
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-border rounded-3xl shadow-lg mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif font-bold text-foreground mb-2">{travelFees.name}</CardTitle>
            <p className="text-muted-foreground font-light">{travelFees.description}</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 max-w-2xl mx-auto">
              {travelFees.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-border rounded-3xl p-8 md:p-12 shadow-lg">
          <h3 className="text-2xl font-serif font-bold text-foreground text-center mb-8">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mx-auto mb-4 rounded-xl shadow-md">
                1
              </div>
              <p className="text-foreground font-medium">Monthly auto-renew</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mx-auto mb-4 rounded-xl shadow-md">
                2
              </div>
              <p className="text-foreground font-medium">Cancel with 30 days' notice</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mx-auto mb-4 rounded-xl shadow-md">
                3
              </div>
              <p className="text-foreground font-medium">Flexible scheduling</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mx-auto mb-4 rounded-xl shadow-md">
                4
              </div>
              <p className="text-foreground font-medium">Doorstep delivery</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-white/60 backdrop-blur-sm border border-border rounded-3xl p-12 shadow-lg">
          <h3 className="text-3xl font-serif font-bold text-foreground mb-4">Ready to Start Your Recovery Journey?</h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-light">
            Choose the plan that fits your lifestyle. From individual sessions to team packages - we've got you covered.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 font-bold text-xl px-16 py-6 h-auto rounded-full shadow-lg transition-all duration-300"
          >
            <Link href="/book" className="inline-flex items-center">
              <Calendar className="mr-4 h-7 w-7" />
              Book Your Session
              <ArrowRight className="ml-4 h-6 w-6" />
            </Link>
          </Button>
          <p className="mt-6 text-muted-foreground">
            Serving all of Orange County • +1 855-886-2244
          </p>
        </div>
      </div>
    </section>
  );
}
