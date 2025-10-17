"use client";

import { Button } from "@/components/ui/button";
import { Instagram, Star, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef } from "react";

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

export default function SocialProof() {
  const beholdContainerId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ensureScript = async () =>
      new Promise<void>((resolve) => {
        const existing = document.querySelector('script[src="https://w.behold.so/widget.js"]');
        if (existing) {
          if (existing.getAttribute("data-loaded") === "true") return resolve();
          existing.addEventListener("load", () => resolve());
          return;
        }
        const script = document.createElement("script");
        script.src = "https://w.behold.so/widget.js";
        script.type = "module";
        script.async = true;
        script.addEventListener("load", () => {
          script.setAttribute("data-loaded", "true");
          resolve();
        });
        document.head.appendChild(script);
      });

    ensureScript().then(() => {
      const anyWindow = window as unknown as {
        BeholdWidget?: {
          render: (opts: { widgetId: string; container: HTMLElement | string }) => void;
        };
      };
      if (anyWindow.BeholdWidget && containerRef.current) {
        anyWindow.BeholdWidget.render({
          widgetId: "your-widget-id",
          container: containerRef.current,
        });
      }
    });
  }, []);

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-muted/20 via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
        {/* Benefits Section */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 bg-primary/15 px-5 py-2.5 rounded-full border border-primary/30 text-sm font-bold mb-8 shadow-sm">
            <Star className="h-5 w-5 text-primary fill-current" />
            <span className="text-primary">Why it works</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-8 tracking-tight">
            Results without the commute
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-16 leading-relaxed font-light">
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
                  <div className="text-xl font-serif font-semibold text-foreground mb-2">{item.title}</div>
                  <div className="text-muted-foreground font-light">{item.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Instagram Section - Behold.so Integration */}
        <div className="text-center">
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mb-4">
            See Real Recoveries in Action
          </h3>
          <p className="text-muted-foreground mb-8 font-light">
            Follow <span className="font-bold text-foreground">@therecoverymachine</span> for daily
            inspiration
          </p>

          {/* Behold.so Instagram Widget */}
          <div className="mb-8">
            <div
              id={beholdContainerId}
              ref={containerRef}
              className="min-h-[400px] rounded-2xl overflow-hidden border-2 border-border shadow-md"
            />
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
