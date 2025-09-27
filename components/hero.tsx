"use client";

import { Button, Heading, Text, Caption, Stack, Inline, Container } from "@/components";
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
    <section className="relative min-h-screen flex flex-col justify-center items-center bg-background text-foreground overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-30">
          <source src="/promo-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-background/90" />
      </div>

      {/* Main Content - Centered and Minimal */}
      <Container size="xl" className="relative z-10 text-center">
        <Stack space="16" align="center" className="max-w-5xl mx-auto">
          {/* Trust Indicator - Modern Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20 backdrop-blur-sm">
            <Star className="h-4 w-4 text-primary fill-current" />
            <Caption className="text-primary font-medium">Professional mobile recovery</Caption>
          </div>

          {/* Main Headline - Clean Typography */}
          <Stack space="6" align="center">
            <Heading 
              as="h1" 
              size="display-2xl" 
              weight="bold" 
              className="font-mono tracking-tight leading-none text-6xl md:text-7xl lg:text-8xl"
            >
              Recovery
            </Heading>
            <Heading 
              as="h1" 
              size="display-2xl" 
              weight="bold" 
              className="font-mono tracking-tight leading-none text-6xl md:text-7xl lg:text-8xl"
            >
              When You Need It
            </Heading>
          </Stack>

          {/* Subheadline - Clean and Direct */}
          <div className="w-full flex justify-center">
            <Text 
              size="xl" 
              color="muted" 
              align="center" 
              className="max-w-3xl text-2xl leading-relaxed font-medium text-center mx-auto"
            >
              Cold plunge + infrared sauna. We come to you. Book in 60 seconds.
            </Text>
          </div>

          {/* Primary CTAs - Vercel Style Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full">
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-xl font-semibold h-14 px-12 border-0 min-w-[200px]"
            >
              <Link href="/book" className="flex items-center justify-center">
                <span className="mr-3">Book Now</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              onClick={scrollToHowItWorks}
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary/10 text-xl font-semibold h-14 px-12 min-w-[200px]"
            >
              How It Works
            </Button>
          </div>

          {/* Trust Badges - Modern Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-muted-foreground bg-background/60 backdrop-blur-sm px-4 py-3 rounded-lg border border-border/50 hover:bg-background/80 transition-all duration-200">
              <Shield className="h-4 w-4" />
              <Caption className="font-medium">Secure Payments</Caption>
            </div>
            <div className="flex items-center justify-center gap-3 text-muted-foreground bg-background/60 backdrop-blur-sm px-4 py-3 rounded-lg border border-border/50 hover:bg-background/80 transition-all duration-200">
              <Calendar className="h-4 w-4" />
              <Caption className="font-medium">Flexible Scheduling</Caption>
            </div>
            <div className="flex items-center justify-center gap-3 text-primary bg-primary/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-primary/20 hover:bg-primary/20 transition-all duration-200">
              <Star className="h-4 w-4 fill-current" />
              <Caption className="font-medium">Pro Equipment</Caption>
            </div>
          </div>
        </Stack>
      </Container>

      {/* Minimal Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <button
          type="button"
          onClick={scrollToHowItWorks}
          className="text-muted-foreground hover:text-foreground p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
          aria-label="Scroll to How It Works section"
        >
          <div className="w-6 h-10 border border-border flex justify-center">
            <div className="w-1 h-3 bg-muted-foreground mt-2"></div>
          </div>
        </button>
      </div>
    </section>
  );
}
