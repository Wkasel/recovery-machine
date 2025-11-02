import { Metadata } from "next";
import Link from "next/link";
import PageWrapper from "@/components/v2-design/layout/PageWrapper";
import { generatePageMetadata } from "@/lib/metadata-helpers";

export const metadata: Metadata = generatePageMetadata({
  title: "About Recovery Machine | Mobile Wellness & Recovery Services",
  description: "Learn about Recovery Machine's mission to bring professional cold plunge and infrared sauna therapy directly to your location. Commercial-grade equipment with certified specialists.",
  keywords: "mobile recovery, cold plunge therapy, infrared sauna, wellness services, professional recovery, Los Angeles wellness",
  url: "/about",
});

export default function AboutPage() {
  return (
    <PageWrapper>
      <div className="space-y-12">
        <div className="animate-fade-in text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6 tracking-tight">
            ABOUT RECOVERY MACHINE
          </h1>
          <p className="text-xl text-charcoal/80">
            Professional recovery delivered to your doorstep
          </p>
        </div>

        <section className="animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl font-medium mb-4">OUR MISSION</h2>
          <p className="text-charcoal/80 leading-relaxed text-lg">
            Recovery Machine brings professional-grade cold plunge and infrared sauna therapy
            directly to your location. We believe that optimal recovery shouldn't require
            expensive memberships or travel time.
          </p>
        </section>

        <section className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-charcoal/10 animate-slide-in-left">
          <h2 className="text-2xl md:text-3xl font-medium mb-4">PROFESSIONAL EQUIPMENT</h2>
          <p className="text-charcoal/80 leading-relaxed text-lg">
            Our mobile units feature commercial-grade equipment including precision
            temperature-controlled cold plunge tanks and full-spectrum infrared saunas. Each
            session is guided by certified recovery specialists who ensure safe and effective
            protocols.
          </p>
        </section>

        <section className="animate-slide-in-right">
          <h2 className="text-2xl md:text-3xl font-medium mb-6">WHY CHOOSE RECOVERY MACHINE?</h2>
          <ul className="space-y-4">
            {[
              "Professional-grade equipment delivered to your location",
              "Certified recovery specialists guide every session",
              "Flexible scheduling that fits your lifestyle",
              "No setup or cleanup required",
              "Consistent weekly sessions for optimal results",
              "75% savings compared to individual bookings"
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-charcoal/80 text-lg">
                <div className="w-2 h-2 bg-mint-accent rounded-full mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-charcoal/10 animate-scale-in">
          <h2 className="text-2xl md:text-3xl font-medium mb-4">GET STARTED TODAY</h2>
          <p className="text-charcoal/80 leading-relaxed text-lg mb-8">
            Join hundreds of athletes, professionals, and wellness enthusiasts who have made
            Recovery Machine part of their routine. Experience the benefits of consistent cold
            plunge and infrared sauna therapy without leaving your home.
          </p>
          <Link
            href="/book"
            className="inline-block bg-charcoal text-white text-sm font-medium px-10 py-4 rounded-full hover:bg-charcoal/90 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            BOOK YOUR SESSION
          </Link>
        </section>
      </div>
    </PageWrapper>
  );
}
