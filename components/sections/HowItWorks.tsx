"use client";

import {
  ArrowRight,
  Award,
  CheckCircle,
  Clock,
  MapPin,
  Repeat,
  Sparkles,
  UserPlus,
  Calendar,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

const steps = [
  {
    icon: Calendar,
    title: "Book Online",
    description:
      "Select your preferred date and time using our online booking system. Instant confirmation.",
    duration: "2 min",
  },
  {
    icon: CheckCircle,
    title: "Get Confirmed",
    description:
      "Receive immediate booking confirmation and details via email. No waiting.",
    duration: "Instant",
  },
  {
    icon: MapPin,
    title: "We Come to You",
    description: "Our mobile unit arrives at your location with professional cold plunge and infrared sauna.",
    duration: "On-time",
  },
  {
    icon: Award,
    title: "Experience Recovery",
    description: "Enjoy professional recovery sessions with guided protocols for optimal results.",
    duration: "60-90 min",
  },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState("");
  const [email2, setEmail2] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitted2, setIsSubmitted2] = useState(false);
  const [error, setError] = useState("");
  const [error2, setError2] = useState("");
  const sectionRef = useRef<HTMLElement>(null);
  const sectionId = "how-it-works";

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
          source: "how_it_works_header",
          metadata: {
            section: "how-it-works",
            position: "header",
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
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

  const handleEmailSubmit2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email2) return;

    setIsLoading2(true);
    setError2("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email2,
          source: "how_it_works_footer",
          metadata: {
            section: "how-it-works",
            position: "footer",
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted2(true);
        setEmail2("");
      } else {
        setError2(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setError2("Something went wrong. Please try again.");
    } finally {
      setIsLoading2(false);
    }
  };

  return (
    <section ref={sectionRef} id={sectionId} className="py-24 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
        {/* Header */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 bg-secondary/20 px-5 py-2.5 rounded-full border border-secondary/30 text-sm font-bold mb-10 shadow-sm">
            <Sparkles className="h-5 w-5 text-secondary" />
            <span className="text-secondary text-wide">Simple Process</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-bold text-foreground mb-10 heading-condensed uppercase">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12" style={{ letterSpacing: '0.01em' }}>
            Book online → Instant confirmation → We arrive → You recover.<br className="hidden md:block" /> Professional mobile recovery delivered.
          </p>

          {/* Book Now CTA */}
          <div className="flex justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xl px-12 py-6 h-14 shadow-xl transform hover:scale-105 transition-transform"
            >
              <Link href="/book">
                <span className="mr-3">Book Your Session</span>
                <Calendar className="w-6 h-6" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Steps Grid - Fixed Dark Theme */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10 mb-16">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isActive = activeStep === index;

            return (
              <button
                type="button"
                key={step.title}
                className="group relative text-left"
                onMouseEnter={() => setActiveStep(index)}
                onFocus={() => setActiveStep(index)}
              >
                {/* Connection Line - Fixed Spacing */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-5 z-0 transform -translate-y-1/2">
                    <ArrowRight
                      className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                    />
                  </div>
                )}

                <Card
                  className={`relative border bg-white/70 backdrop-blur-sm h-full p-8 shadow-md hover:shadow-xl rounded-2xl transition-all duration-300 ${
                    isActive ? "border-primary/50" : "border-border"
                  }`}
                >
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center text-sm font-bold shadow-md">
                    {index + 1}
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute -top-3 -left-3 flex items-center gap-1 bg-secondary/20 border border-secondary/30 rounded-full px-3 py-1.5 shadow-sm">
                    <Clock className="h-3 w-3 text-secondary" />
                    <span className="text-xs font-semibold text-secondary">{step.duration}</span>
                  </div>

                  <div className="text-center pt-6">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 border-2 border-primary/20 rounded-2xl mb-6 mx-auto shadow-sm">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>

                    <h3 className="text-lg font-serif font-bold text-foreground mb-4">{step.title}</h3>

                    <p className="text-muted-foreground leading-relaxed text-sm font-light">{step.description}</p>
                  </div>
                </Card>
              </button>
            );
          })}
        </div>

        {/* Equipment Showcase with Real Photos */}
        <div className="bg-white/70 backdrop-blur-sm border border-border rounded-3xl p-8 mb-16 shadow-lg">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-serif font-bold text-foreground mb-4">Professional Equipment</h3>
            <p className="text-muted-foreground text-lg font-light">
              Commercial-grade recovery delivered to your door
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Van Exterior */}
            <div className="text-center group">
              <div className="relative mb-6 overflow-hidden border-2 border-border rounded-2xl shadow-md group-hover:shadow-xl transition-all duration-300">
                <img
                  src="/van-exterior-photo.png"
                  alt="Recovery Machine mobile unit exterior"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h4 className="font-bold text-foreground mb-2 font-serif">Mobile Unit</h4>
              <p className="text-muted-foreground text-sm font-light">
                Professional setup arrives at your location
              </p>
            </div>

            {/* Cold Plunge */}
            <div className="text-center group">
              <div className="relative mb-6 overflow-hidden border-2 border-primary/20 rounded-2xl shadow-md group-hover:shadow-xl transition-all duration-300">
                <img
                  src="/cold-plunge-photo.jpg"
                  alt="Professional cold plunge setup"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h4 className="font-bold text-foreground mb-2 font-serif">Cold Plunge</h4>
              <p className="text-muted-foreground text-sm font-light">
                Precision temperature control for optimal recovery
              </p>
            </div>

            {/* Infrared Sauna */}
            <div className="text-center group">
              <div className="relative mb-6 overflow-hidden border-2 border-secondary/20 rounded-2xl shadow-md group-hover:shadow-xl transition-all duration-300">
                <img
                  src="/sauna-photo.jpg"
                  alt="Infrared sauna setup"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h4 className="font-bold text-foreground mb-2 font-serif">Infrared Sauna</h4>
              <p className="text-muted-foreground text-sm font-light">Deep tissue healing and detoxification</p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-border rounded-3xl p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center group">
              <div className="w-20 h-20 bg-white border-2 border-primary/20 rounded-2xl flex items-center justify-center mb-4 shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <CheckCircle className="w-9 w-9 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2 font-serif">No Setup Required</h3>
              <p className="text-muted-foreground text-sm font-light">
                We handle everything from arrival to cleanup
              </p>
            </div>

            <div className="flex flex-col items-center group">
              <div className="w-20 h-20 bg-white border-2 border-primary/20 rounded-2xl flex items-center justify-center mb-4 shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Award className="w-9 w-9 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2 font-serif">Professional Equipment</h3>
              <p className="text-muted-foreground text-sm font-light">
                Commercial-grade cold plunge and infrared sauna
              </p>
            </div>

            <div className="flex flex-col items-center group">
              <div className="w-20 h-20 bg-white border-2 border-secondary/20 rounded-2xl flex items-center justify-center mb-4 shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Sparkles className="w-9 w-9 text-secondary" />
              </div>
              <h3 className="font-bold text-foreground mb-2 font-serif">Expert Guidance</h3>
              <p className="text-muted-foreground text-sm font-light">
                Certified recovery specialists guide every session
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white/60 backdrop-blur-sm border border-border rounded-3xl p-12 shadow-lg">
          <h3 className="text-3xl font-serif font-bold text-foreground mb-4">Ready to Get Started?</h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-light">
            Experience professional mobile recovery throughout Southern California. Get updates on availability and services.
          </p>
          {isSubmitted2 ? (
            <div className="text-center p-6 bg-primary/10 border border-primary/20 rounded-2xl max-w-md mx-auto shadow-md">
              <div className="text-primary mb-2 font-bold">✓ Success!</div>
              <p className="text-foreground">
                Thanks for your interest! We'll keep you updated on availability.
              </p>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit2} className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email2}
                onChange={(e) => setEmail2(e.target.value)}
                className="h-14 px-6 text-lg bg-white text-foreground border-2 border-primary/20 rounded-2xl focus:border-primary focus:outline-none transition-colors flex-1 min-w-[250px] shadow-sm"
                required
                disabled={isLoading2}
              />
              <Button
                type="submit"
                size="lg"
                disabled={isLoading2 || !email2}
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 font-bold text-xl px-8 py-6 h-14 rounded-full shadow-lg transition-all duration-300"
              >
                {isLoading2 ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="mr-3">Get Updates</span>
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </Button>
              {error2 && <p className="text-red-400 text-sm mt-2">{error2}</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
