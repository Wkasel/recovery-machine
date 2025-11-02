import { Clock, Instagram, MapPin } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import PageWrapper from "@/components/v2-design/layout/PageWrapper";
import { generatePageMetadata } from "@/lib/metadata-helpers";

export const metadata: Metadata = generatePageMetadata({
  title: "Contact Recovery Machine | Mobile Wellness Services",
  description: "Contact Recovery Machine for mobile cold plunge and infrared sauna services in Los Angeles. Professional recovery specialists available 7 days a week.",
  keywords: "contact recovery machine, mobile wellness Los Angeles, cold plunge booking, infrared sauna appointment, recovery specialists",
  url: "/contact",
});

export default function ContactPage() {
  return (
    <PageWrapper>
      <div className="mb-12 animate-fade-in text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6 tracking-tight">
          CONTACT US
        </h1>
        <p className="text-xl text-charcoal/80">
          Get in touch with our recovery specialists
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8 animate-slide-in-left">
          <section>
            <h2 className="text-2xl font-medium mb-6">GET IN TOUCH</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-charcoal/10 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-mint-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Instagram className="h-6 w-6 text-charcoal" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">FOLLOW US</h3>
                  <a
                    href="https://www.instagram.com/therecoverymachine_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-charcoal/70 hover:text-mint-accent transition-colors"
                  >
                    @therecoverymachine_
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-charcoal/10 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-mint-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-charcoal" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">SERVICE AREA</h3>
                  <p className="text-charcoal/70">Orange County • Serving All of Southern California</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-charcoal/10 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-mint-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-charcoal" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">HOURS</h3>
                  <p className="text-charcoal/70">7 AM - 9 PM, 7 days a week</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8 animate-slide-in-right">
          <section>
            <h3 className="text-2xl font-medium mb-6">FREQUENTLY ASKED QUESTIONS</h3>
            <div className="space-y-6">
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-charcoal/10">
                <h4 className="font-medium mb-2 text-lg">How far do you travel?</h4>
                <p className="text-charcoal/70 text-sm leading-relaxed">
                  Based in Orange County, we service all of Southern California. Setup fees may vary based on distance.
                </p>
              </div>

              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-charcoal/10">
                <h4 className="font-medium mb-2 text-lg">What's included in a session?</h4>
                <p className="text-charcoal/70 text-sm leading-relaxed">
                  Each 45-minute session includes cold plunge and infrared sauna with professional
                  guidance, setup, cleanup, and premium accessories.
                </p>
              </div>

              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-charcoal/10">
                <h4 className="font-medium mb-2 text-lg">Can I cancel my membership?</h4>
                <p className="text-charcoal/70 text-sm leading-relaxed">
                  Yes, you can cancel anytime with 30 days' notice. No long-term contracts
                  required.
                </p>
              </div>

              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-charcoal/10">
                <h4 className="font-medium mb-2 text-lg">Is it safe?</h4>
                <p className="text-charcoal/70 text-sm leading-relaxed">
                  All sessions are supervised by certified recovery specialists. We screen for
                  contraindications and maintain comprehensive insurance coverage.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-charcoal text-white rounded-2xl p-8 animate-scale-in">
            <h3 className="text-lg font-medium mb-3">BUSINESS INQUIRIES</h3>
            <p className="text-white/80 text-sm mb-4">
              Interested in corporate wellness programs or partnership opportunities?
            </p>
            <p className="text-white/90">
              Contact us via{" "}
              <a
                href="https://www.instagram.com/therecoverymachine_/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-mint-accent hover:underline font-medium"
              >
                Instagram
              </a>
            </p>
          </section>
        </div>
      </div>

      <div className="mt-16 text-center animate-fade-in-up">
        <Link
          href="/book"
          className="inline-block bg-charcoal text-white text-sm font-medium px-10 py-4 rounded-full hover:bg-charcoal/90 hover:scale-105 transition-all duration-300 shadow-lg"
        >
          READY TO BOOK? →
        </Link>
      </div>
    </PageWrapper>
  );
}
