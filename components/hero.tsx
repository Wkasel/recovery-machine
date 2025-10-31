"use client";

import { Button, Caption, Container, Heading, Stack, Text } from "@/components";
import { ArrowRight, Calendar, Shield, Star } from "lucide-react";
import { useState } from "react";

export default function Hero() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState("");

  const scrollToHowItWorks = () => {
    const element = document.getElementById("how-it-works");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source: "hero_section",
          metadata: {
            page: "home",
            section: "hero",
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubscribed(true);
        setEmail("");
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-background via-muted/20 to-background text-foreground overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-20">
          <source src="/promo-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95" />
      </div>

      {/* Main Content - Centered and Minimal */}
      <Container size="xl" className="relative z-10 text-center">
        <Stack space="16" align="center" className="max-w-5xl mx-auto">
          {/* Trust Indicator - Modern Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 px-5 py-2.5 rounded-full border border-primary/30 shadow-sm">
            <Star className="h-4 w-4 text-primary fill-current" />
            <Caption className="text-primary font-semibold">Orange County • Serving All of Southern California</Caption>
          </div>

          {/* Main Headline - Bold & Condensed like pricing sheet */}
          <Stack space="8" align="center">
            <Heading
              as="h1"
              size="display-2xl"
              weight="bold"
              className="font-sans heading-condensed text-6xl md:text-7xl lg:text-8xl text-foreground uppercase"
            >
              Recovery<br />Made Mobile
            </Heading>
          </Stack>

          {/* Subheadline - Wider tracking */}
          <div className="w-full flex justify-center">
            <Text
              size="xl"
              color="muted"
              align="center"
              className="max-w-3xl text-lg md:text-xl leading-relaxed text-center mx-auto"
              style={{ letterSpacing: '0.02em' }}
            >
              Cold plunge + infrared sauna delivered to your door.<br className="hidden md:block" /> Professional equipment. Expert guidance. Zero commute.
            </Text>
          </div>

          {/* Primary CTA - Book Now Focus */}
          <div className="flex flex-col gap-6 justify-center items-center w-full">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-xl text-xl h-14 px-12 rounded-lg shadow-lg border-2 border-primary/20 min-w-[200px] transform hover:scale-105"
              >
                <a href="/book">
                  <span className="mr-3">Book Now</span>
                  <Calendar className="h-5 w-5" />
                </a>
              </Button>
              <Button
                onClick={scrollToHowItWorks}
                variant="outline"
                size="lg"
                className="border-2 border-muted-foreground/30 text-muted-foreground hover:bg-muted/10 text-lg font-medium h-14 px-8"
              >
                Learn More
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Book your session in minutes • Instant confirmation
            </p>
          </div>

          {/* Service Areas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-foreground bg-white/80 backdrop-blur-sm px-5 py-4 rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
              <Shield className="h-5 w-5 text-primary" />
              <Caption className="font-semibold">Orange County</Caption>
            </div>
            <div className="flex items-center justify-center gap-3 text-foreground bg-white/80 backdrop-blur-sm px-5 py-4 rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
              <Calendar className="h-5 w-5 text-primary" />
              <Caption className="font-semibold">Expanding Coverage</Caption>
            </div>
            <div className="flex items-center justify-center gap-3 text-primary-foreground bg-primary backdrop-blur-sm px-5 py-4 rounded-2xl border border-primary shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
              <Star className="h-5 w-5 fill-current" />
              <Caption className="font-bold text-white">Available Now</Caption>
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
