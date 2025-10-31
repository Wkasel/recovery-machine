"use client";

import { Play } from "lucide-react";
import { useState } from "react";

export default function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4">
            See Recovery Machine in Action
          </h2>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Professional equipment delivered right to your door. Watch how we bring the ultimate recovery experience to you.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black aspect-video">
            <video
              controls
              playsInline
              className="w-full h-full object-cover"
              poster="/video-thumbnail.jpg"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src="/promo-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none">
                <div className="bg-white/90 rounded-full p-6 shadow-xl">
                  <Play className="h-12 w-12 text-primary" fill="currentColor" />
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-border shadow-sm">
              <h3 className="font-bold text-foreground mb-2">Professional Equipment</h3>
              <p className="text-sm text-muted-foreground font-light">
                Commercial-grade cold plunge and infrared sauna systems
              </p>
            </div>
            <div className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-border shadow-sm">
              <h3 className="font-bold text-foreground mb-2">Complete Setup</h3>
              <p className="text-sm text-muted-foreground font-light">
                We handle everything from arrival to cleanup
              </p>
            </div>
            <div className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-border shadow-sm">
              <h3 className="font-bold text-foreground mb-2">Expert Guidance</h3>
              <p className="text-sm text-muted-foreground font-light">
                Certified specialists guide you through every session
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
