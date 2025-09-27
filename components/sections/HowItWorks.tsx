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
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Card } from "../ui/card";

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up",
    description:
      "Create your account and choose your membership plan. Setup takes less than 5 minutes.",
    duration: "< 5 min",
  },
  {
    icon: MapPin,
    title: "We Come to You",
    description:
      "Our mobile unit arrives at your location with professional cold plunge and infrared sauna.",
    duration: "Next day",
  },
  {
    icon: CheckCircle,
    title: "Experience Recovery",
    description: "Enjoy your 45-minute session with guided recovery protocols for optimal results.",
    duration: "45 min",
  },
  {
    icon: Repeat,
    title: "Build Your Routine",
    description: "Consistent weekly sessions delivered to maintain peak performance and recovery.",
    duration: "Weekly",
  },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const sectionId = "how-it-works";

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} id={sectionId} className="py-24 lg:py-32 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 border border-neutral-800 text-sm font-semibold mb-6">
            <Sparkles className="h-4 w-4 text-brand" />
            <span>Simple Process</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">How It Works</h2>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            Book → We arrive → You recover. Repeat weekly.
          </p>
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
                  className={`relative border bg-black h-full p-8 ${
                    isActive ? "border-white" : "border-neutral-800"
                  }`}
                >
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-white text-black flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute -top-3 -left-3 flex items-center gap-1 bg-neutral-900 border border-neutral-800 px-2 py-1">
                    <Clock className="h-3 w-3 text-brand" />
                    <span className="text-xs font-medium text-neutral-400">{step.duration}</span>
                  </div>

                  <div className="text-center pt-6">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-900 border border-neutral-800 mb-6 mx-auto">
                      <IconComponent className="w-8 h-8 text-brand" />
                    </div>

                    <h3 className="text-lg font-bold text-white mb-4">{step.title}</h3>

                    <p className="text-neutral-400 leading-relaxed text-sm">{step.description}</p>
                  </div>
                </Card>
              </button>
            );
          })}
        </div>

        {/* Equipment Showcase with Real Photos */}
        <div className="bg-black border border-neutral-800 p-8 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Professional Equipment</h3>
            <p className="text-neutral-400 text-lg">
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
      </div>
    </section>
  );
}
