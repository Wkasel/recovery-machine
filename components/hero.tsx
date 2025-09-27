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
            <Caption className="text-primary font-medium">Now serving OC & LA</Caption>
          </div>

          {/* Main Headline - Clean Typography */}
          <Stack space="6" align="center">
            <Heading
              as="h1"
              size="display-2xl"
              weight="bold"
              className="font-mono tracking-tight leading-none text-6xl md:text-7xl lg:text-8xl"
            >
              The
            </Heading>
            <Heading
              as="h1"
              size="display-2xl"
              weight="bold"
              className="font-mono tracking-tight leading-none text-4xl md:text-5xl lg:text-6xl text-primary"
            >
              Recovery Machine
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
              Professional mobile recovery in Orange County & Los Angeles. Experience elite contrast therapy
              delivered to your doorstep.
            </Text>
          </div>

          {/* Primary CTA - Email Collection Focus */}
          <div className="flex flex-col gap-6 justify-center items-center w-full">
            <div className="w-full max-w-md">
              {isSubscribed ? (
                <div className="text-center p-6 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="text-primary mb-2">✓ Success!</div>
                  <p className="text-foreground">
                    Thanks for your interest! We'll contact you to schedule your session.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email to book a session"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 px-6 text-lg bg-background border-2 border-primary/20 rounded-lg focus:border-primary focus:outline-none transition-colors"
                    required
                    disabled={isLoading}
                  />
                  {error && <p className="text-destructive text-sm text-center">{error}</p>}
                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="inline-flex items-center justify-center whitespace-nowrap font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-xl text-xl h-14 px-12 rounded-lg shadow-lg border-2 border-primary/20 min-w-[200px] transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span className="mr-3">Book Session</span>
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
            <Button
              onClick={scrollToHowItWorks}
              variant="outline"
              className="border-2 border-muted-foreground/30 text-muted-foreground hover:bg-muted/10 text-lg font-medium h-12 px-8"
            >
              Learn More
            </Button>
          </div>

          {/* Service Areas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-muted-foreground bg-background/60 backdrop-blur-sm px-4 py-3 rounded-lg border border-border/50 hover:bg-background/80 transition-all duration-200">
              <Shield className="h-4 w-4" />
              <Caption className="font-medium">Orange County</Caption>
            </div>
            <div className="flex items-center justify-center gap-3 text-muted-foreground bg-background/60 backdrop-blur-sm px-4 py-3 rounded-lg border border-border/50 hover:bg-background/80 transition-all duration-200">
              <Calendar className="h-4 w-4" />
              <Caption className="font-medium">Los Angeles</Caption>
            </div>
            <div className="flex items-center justify-center gap-3 text-primary bg-primary/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-primary/20 hover:bg-primary/20 transition-all duration-200">
              <Star className="h-4 w-4 fill-current" />
              <Caption className="font-medium">Available Now</Caption>
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
