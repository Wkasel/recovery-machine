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
    icon: UserPlus,
    title: "Join Waitlist",
    description:
      "Sign up for early access and be the first to know when we launch in your area.",
    duration: "2 min",
  },
  {
    icon: Calendar,
    title: "We Launch",
    description:
      "Get notified when Recovery Machine is available in Orange County and Los Angeles.",
    duration: "Soon",
  },
  {
    icon: MapPin,
    title: "We Come to You",
    description: "Our mobile unit arrives at your location with professional cold plunge and infrared sauna.",
    duration: "On-demand",
  },
  {
    icon: CheckCircle,
    title: "Experience Recovery",
    description: "Enjoy professional recovery sessions with guided protocols for optimal results.",
    duration: "45 min",
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
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-black px-4 py-2 border border-neutral-800 text-sm font-semibold mb-6">
            <Sparkles className="h-4 w-4 text-white" />
            <span className="text-white">Simple Process</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">How It Will Work</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Join waitlist → We launch → You recover. Professional mobile recovery coming soon.
          </p>
          
          {/* Email Collection CTA */}
          <div className="flex justify-center">
            {isSubmitted ? (
              <div className="text-center p-6 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="text-primary mb-2">✓ Success!</div>
                <p className="text-foreground">
                  Thanks for joining! We'll keep you updated on our launch.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 items-center">
                <input
                  type="email"
                  placeholder="Enter your email for updates"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 px-6 text-lg bg-background border-2 border-primary/20 rounded-lg focus:border-primary focus:outline-none transition-colors min-w-[300px]"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading || !email}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xl px-12 py-6 h-14 shadow-xl"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="mr-3">Get Early Access</span>
                      <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </Button>
                {error && <p className="text-destructive text-sm mt-2">{error}</p>}
              </form>
            )}
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
                      className={`h-5 w-5 ${isActive ? "text-white" : "text-neutral-600"}`}
                    />
                  </div>
                )}

                <Card
                  className={`relative border bg-background h-full p-8 ${
                    isActive ? "border-primary" : "border-border"
                  }`}
                >
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute -top-3 -left-3 flex items-center gap-1 bg-black border border-neutral-800 px-2 py-1">
                    <Clock className="h-3 w-3 text-white" />
                    <span className="text-xs font-medium text-white">{step.duration}</span>
                  </div>

                  <div className="text-center pt-6">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-black border border-neutral-800 mb-6 mx-auto">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-4">{step.title}</h3>

                    <p className="text-muted-foreground leading-relaxed text-sm">{step.description}</p>
                  </div>
                </Card>
              </button>
            );
          })}
        </div>

        {/* Equipment Showcase with Real Photos */}
        <div className="bg-background border border-border p-8 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Professional Equipment</h3>
            <p className="text-muted-foreground text-lg">
              Commercial-grade recovery delivered to your door
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Van Exterior */}
            <div className="text-center">
              <div className="relative mb-6 overflow-hidden border border-neutral-800">
                <img
                  src="/van-exterior-photo.png"
                  alt="Recovery Machine mobile unit exterior"
                  className="w-full h-64 object-cover"
                />
              </div>
              <h4 className="font-bold text-white mb-2">Mobile Unit</h4>
              <p className="text-neutral-400 text-sm">
                Professional setup arrives at your location
              </p>
            </div>

            {/* Cold Plunge */}
            <div className="text-center">
              <div className="relative mb-6 overflow-hidden border border-neutral-800">
                <img
                  src="/cold-plunge-photo.jpg"
                  alt="Professional cold plunge setup"
                  className="w-full h-64 object-cover"
                />
              </div>
              <h4 className="font-bold text-white mb-2">Cold Plunge</h4>
              <p className="text-neutral-400 text-sm">
                Precision temperature control for optimal recovery
              </p>
            </div>

            {/* Infrared Sauna */}
            <div className="text-center">
              <div className="relative mb-6 overflow-hidden border border-neutral-800">
                <img
                  src="/sauna-photo.jpg"
                  alt="Infrared sauna setup"
                  className="w-full h-64 object-cover"
                />
              </div>
              <h4 className="font-bold text-white mb-2">Infrared Sauna</h4>
              <p className="text-neutral-400 text-sm">Deep tissue healing and detoxification</p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-black border border-neutral-800 p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">No Setup Required</h3>
              <p className="text-neutral-400 text-sm">
                We handle everything from arrival to cleanup
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">Professional Equipment</h3>
              <p className="text-neutral-400 text-sm">
                Commercial-grade cold plunge and infrared sauna
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">Expert Guidance</h3>
              <p className="text-neutral-400 text-sm">
                Certified recovery specialists guide every session
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-black border border-neutral-800 p-12">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Join the Waitlist?</h3>
          <p className="text-xl text-neutral-400 mb-8 max-w-2xl mx-auto">
            Be the first to experience professional mobile recovery in Orange County and Los Angeles. Get early access and exclusive offers.
          </p>
          {isSubmitted2 ? (
            <div className="text-center p-6 bg-green-900/20 border border-green-800 rounded-lg max-w-md mx-auto">
              <div className="text-green-400 mb-2">✓ Success!</div>
              <p className="text-white">
                You're on the waitlist! We'll contact you when we launch.
              </p>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit2} className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email2}
                onChange={(e) => setEmail2(e.target.value)}
                className="h-14 px-6 text-lg bg-white text-black border-2 border-white rounded-lg focus:outline-none transition-colors flex-1 min-w-[250px]"
                required
                disabled={isLoading2}
              />
              <Button
                type="submit"
                size="lg"
                disabled={isLoading2 || !email2}
                className="bg-white text-black hover:bg-gray-100 font-bold text-xl px-8 py-6 h-14"
              >
                {isLoading2 ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="mr-3">Join Waitlist</span>
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
