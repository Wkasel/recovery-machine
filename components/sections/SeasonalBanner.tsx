"use client";

import { Sun, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SeasonalBanner() {
  return (
    <section className="py-16 bg-gradient-to-br from-secondary/10 via-background to-primary/10 border-y border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-border/30">
          {/* Left: Seasonal Message */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-secondary/20 px-5 py-2.5 rounded-full border border-secondary/30 mb-5 shadow-sm">
              <Sun className="h-5 w-5 text-secondary" />
              <span className="text-secondary font-bold text-sm">Summer Recovery Season</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4 tracking-tight">
              Beat the heat, recover smarter
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Summer training demands serious recovery. Mobile cold plunge and infrared sauna delivered to help you stay cool, recover faster, and perform better.
            </p>
          </div>

          {/* Right: CTA */}
          <div className="flex-shrink-0">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 font-bold text-lg px-10 py-6 h-14 shadow-lg rounded-full transition-all duration-300"
            >
              <Link href="#how-it-works" className="inline-flex items-center">
                <span className="mr-3">Get Started Today</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
