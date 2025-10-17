"use client";

import { Shield, Wrench, MapPin, Award } from "lucide-react";

const badges = [
  {
    icon: Wrench,
    title: "Commercial-grade equipment",
    description: "Professional cold plunge and infrared sauna systems",
  },
  {
    icon: Shield,
    title: "Certified recovery specialists",
    description: "Expert guidance for every session",
  },
  {
    icon: MapPin,
    title: "Southern California Coverage",
    description: "Based in Newport Beach, expanding service area",
  },
  {
    icon: Award,
    title: "Setup + cleanup included",
    description: "We bring everything. You simply show up.",
  },
];

export default function TrustBadges() {
  return (
    <section className="py-20 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge) => {
            const IconComponent = badge.icon;
            return (
              <div key={badge.title} className="text-center group">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white border-2 border-primary/20 rounded-2xl mb-5 shadow-md group-hover:shadow-xl group-hover:scale-110 group-hover:border-primary/40 transition-all duration-300">
                  <IconComponent className="h-9 w-9 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2 text-base">{badge.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{badge.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
