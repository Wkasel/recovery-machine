"use client";

import { Button } from "@/components/ui/button";
import { Instagram, Star, TrendingUp, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const benefits = [
  {
    icon: Users,
    title: "On‑site setup included",
    desc: "We bring everything. You simply show up.",
  },
  {
    icon: Star,
    title: "Pro‑grade equipment",
    desc: "Cold plunge + infrared sauna, calibrated.",
  },
  {
    icon: TrendingUp,
    title: "Flexible scheduling",
    desc: "Book sessions that fit your week.",
  },
];

// Real photos from Recovery Machine Dropbox
const photos = [
  {
    id: 1,
    url: "https://www.dropbox.com/scl/fo/zzfdf01ghsbeyvr0a0jpk/ALpsttLegb5VhbjwXKN9sdM/RECENT%20STILLS/Screenshot%202025-10-16%20at%203.39.59%E2%80%AFPM.png?rlkey=5mzkci6n74xvke1t3sa3cnnfm&raw=1",
    alt: "Recovery Machine session",
  },
  {
    id: 2,
    url: "https://www.dropbox.com/scl/fo/zzfdf01ghsbeyvr0a0jpk/AGBxk7JKcjdnpKrZiPzlIPA/RECENT%20STILLS/Screenshot%202025-10-16%20at%203.40.41%E2%80%AFPM.png?rlkey=5mzkci6n74xvke1t3sa3cnnfm&raw=1",
    alt: "Cold plunge therapy",
  },
  {
    id: 3,
    url: "https://www.dropbox.com/scl/fo/zzfdf01ghsbeyvr0a0jpk/ADEG1vOnWVPKAgSmfk8AZiM/RECENT%20STILLS/Screenshot%202025-10-16%20at%203.41.17%E2%80%AFPM.png?rlkey=5mzkci6n74xvke1t3sa3cnnfm&raw=1",
    alt: "Infrared sauna wellness",
  },
  {
    id: 4,
    url: "https://www.dropbox.com/scl/fo/zzfdf01ghsbeyvr0a0jpk/AI-txvfPxh-GB_N1H3B23Oc/RECENT%20STILLS/Screenshot%202025-10-16%20at%203.41.58%E2%80%AFPM.png?rlkey=5mzkci6n74xvke1t3sa3cnnfm&raw=1",
    alt: "Mobile recovery setup",
  },
  {
    id: 5,
    url: "https://www.dropbox.com/scl/fo/zzfdf01ghsbeyvr0a0jpk/AHylKT2LQ8qnYQwE76Gm2Rg/RECENT%20STILLS/Screenshot%202025-10-16%20at%203.44.17%E2%80%AFPM.png?rlkey=5mzkci6n74xvke1t3sa3cnnfm&raw=1",
    alt: "Recovery experience",
  },
  {
    id: 6,
    url: "https://www.dropbox.com/scl/fo/zzfdf01ghsbeyvr0a0jpk/AOuF-abyuyZ1T7FRCQxh3JY/RECENT%20STILLS/Screenshot%202025-10-16%20at%203.44.58%E2%80%AFPM.png?rlkey=5mzkci6n74xvke1t3sa3cnnfm&raw=1",
    alt: "Professional wellness service",
  },
];

function PhotoGallery() {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleImageLoad = (id: number) => {
    setLoadedImages((prev) => new Set(prev).add(id));
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="relative aspect-square rounded-xl overflow-hidden bg-muted border-2 border-border shadow-md hover:shadow-xl transition-all duration-300 group"
        >
          <Image
            src={photo.url}
            alt={photo.alt}
            fill
            className={`object-cover transition-all duration-500 group-hover:scale-105 ${
              loadedImages.has(photo.id) ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => handleImageLoad(photo.id)}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          {!loadedImages.has(photo.id) && (
            <div className="absolute inset-0 animate-pulse bg-muted" />
          )}
        </div>
      ))}
    </div>
  );
}

export default function SocialProof() {

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-muted/20 via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
        {/* Benefits Section */}
        <div className="text-center mb-28">
          <div className="inline-flex items-center gap-2 bg-primary/15 px-5 py-2.5 rounded-full border border-primary/30 text-sm font-bold mb-10 shadow-sm">
            <Star className="h-5 w-5 text-primary fill-current" />
            <span className="text-primary text-wide">Why it works</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-bold text-foreground mb-10 heading-condensed uppercase">
            Results Without<br className="md:hidden" /> The Commute
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-20 leading-relaxed" style={{ letterSpacing: '0.01em' }}>
            Recover faster at home with a simple, guided routine.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.title}
                  className="text-center p-8 bg-white/70 backdrop-blur-sm border-2 border-border rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-primary/10 border-2 border-primary/20 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                      <IconComponent className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  <div className="text-lg font-bold text-foreground mb-2 uppercase tracking-tight">{item.title}</div>
                  <div className="text-muted-foreground" style={{ letterSpacing: '0.01em' }}>{item.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Photo Gallery Section */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-primary/30"></div>
            <h3 className="section-header text-xl text-primary">
              See Real Recoveries in Action
            </h3>
            <div className="h-px w-12 bg-primary/30"></div>
          </div>
          <p className="text-muted-foreground mb-10" style={{ letterSpacing: '0.02em' }}>
            Follow <span className="font-bold text-foreground">@therecoverymachine</span> for daily inspiration
          </p>

          {/* Photo Gallery */}
          <div className="mb-8">
            <PhotoGallery />
          </div>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-primary/30 text-foreground hover:bg-primary/10 hover:border-primary rounded-full shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
          >
            <Link
              href="https://instagram.com/therecoverymachine"
              target="_blank"
              className="inline-flex items-center"
            >
              <Instagram className="h-5 w-5 mr-2" />
              Follow on Instagram
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
