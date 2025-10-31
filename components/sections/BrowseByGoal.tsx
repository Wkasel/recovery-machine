"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Heart, TrendingUp, Moon, ArrowRight } from "lucide-react";
import Link from "next/link";

const goals = [
  {
    icon: Zap,
    title: "Muscle Recovery",
    description: "Accelerate post-workout recovery with targeted contrast therapy protocols.",
    benefits: ["Reduce inflammation", "Speed healing", "Ease soreness"],
    recommended: "Cold Plunge + Sauna",
  },
  {
    icon: Heart,
    title: "Stress Relief",
    description: "Release tension and reset your nervous system with therapeutic heat and cold.",
    benefits: ["Lower cortisol", "Boost mood", "Mental clarity"],
    recommended: "Infrared Sauna Focus",
  },
  {
    icon: TrendingUp,
    title: "Performance",
    description: "Optimize athletic output and build resilience for peak performance.",
    benefits: ["Increase endurance", "Boost metabolism", "Enhance focus"],
    recommended: "Combined Protocol",
  },
  {
    icon: Moon,
    title: "Sleep Optimization",
    description: "Improve sleep quality through body temperature regulation and relaxation.",
    benefits: ["Deeper sleep", "Faster onset", "Better REM cycles"],
    recommended: "Evening Sauna Session",
  },
];

export default function BrowseByGoal() {
  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/15 px-5 py-2.5 rounded-full border border-primary/30 text-sm font-bold mb-6 shadow-sm">
            <Zap className="h-5 w-5 text-primary" />
            <span className="text-primary">Your Goals, Your Recovery</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6 tracking-tight">
            Browse by Goal
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
            Choose your recovery path based on what matters most to you.
          </p>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {goals.map((goal) => {
            const IconComponent = goal.icon;
            return (
              <Card
                key={goal.title}
                className="p-8 border-2 border-border hover:border-primary/50 transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-md hover:shadow-xl rounded-2xl"
              >
                {/* Icon and Title */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-primary/10 border-2 border-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-serif font-bold text-foreground mb-2">{goal.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{goal.description}</p>
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-6 ml-[72px]">
                  <ul className="space-y-2">
                    {goal.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center text-foreground">
                        <div className="w-1.5 h-1.5 bg-primary mr-3 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Service */}
                <div className="ml-[72px] pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground mb-2">Recommended:</div>
                  <div className="font-semibold text-foreground">{goal.recommended}</div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 font-bold text-xl px-12 py-6 h-14 rounded-full shadow-lg transition-all duration-300"
          >
            <Link href="#how-it-works" className="inline-flex items-center">
              <span className="mr-3">Start Your Recovery</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
