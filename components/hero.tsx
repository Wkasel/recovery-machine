// @ts-nocheck"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Shield, Star } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const scrollToHowItWorks = () => {
    const element = document.getElementById("how-it-works");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center bg-black text-white overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-30">
          <source src="/promo-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Main Content - Centered and Minimal */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Trust Indicator - Minimal Style */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-neutral-900 px-4 py-2 border border-neutral-800">
            <Star className="h-4 w-4 text-brand" />
            <span className="text-neutral-300 text-sm font-mono">Professional mobile recovery</span>
          </div>
        </div>

        {/* Main Headline - Clean Typography */}
        <h1 className="text-white font-medium leading-tight mb-8">
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight font-mono">
            Recovery
          </span>
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight font-mono">
            When You Need It
          </span>
        </h1>

        {/* Subheadline - Clean and Direct */}
        <div className="mb-12">
          <p className="text-neutral-300 text-xl mb-6 max-w-2xl mx-auto leading-relaxed">
            Cold plunge + infrared sauna. We come to you. Book in 60 seconds.
          </p>
        </div>

        {/* Primary CTAs - Vercel Style Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button
            asChild
            className="bg-white text-black hover:bg-neutral-200 text-lg font-medium h-12 px-8 border-0"
          >
            <Link href="/book" className="flex items-center">
              <span className="mr-2">Book Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            onClick={scrollToHowItWorks}
            variant="outline"
            className="border border-brand text-brand hover:bg-brand/10 text-lg font-medium h-12 px-8"
          >
            How It Works
          </Button>
        </div>

        {/* Trust Badges - Minimal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 text-neutral-400 bg-neutral-900 px-4 py-3 border border-neutral-800">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-mono">Secure Payments</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-neutral-400 bg-neutral-900 px-4 py-3 border border-neutral-800">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-mono">Flexible Scheduling</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-neutral-400 bg-neutral-900 px-4 py-3 border border-neutral-800">
            <Star className="h-4 w-4 text-brand" />
            <span className="text-sm font-mono">Pro Equipment</span>
          </div>
        </div>
      </div>

      {/* Minimal Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <button
          type="button"
          onClick={scrollToHowItWorks}
          className="text-neutral-600 hover:text-white p-2"
          aria-label="Scroll to How It Works section"
        >
          <div className="w-6 h-10 border border-neutral-700 flex justify-center">
            <div className="w-1 h-3 bg-neutral-600 mt-2"></div>
          </div>
        </button>
      </div>
    </section>
  );
}
