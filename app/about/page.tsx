import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Recovery Machine - Mobile Wellness & Recovery Services",
  description:
    "Learn about Recovery Machine's mission to bring professional cold plunge and infrared sauna therapy directly to your location. Commercial-grade equipment with certified specialists.",
  keywords:
    "mobile recovery, cold plunge therapy, infrared sauna, wellness services, professional recovery, Los Angeles wellness",
  openGraph: {
    title: "About Recovery Machine - Professional Mobile Recovery",
    description:
      "Professional-grade cold plunge and infrared sauna therapy delivered to your doorstep with certified recovery specialists.",
    type: "website",
    images: [
      {
        url: "/api/og?title=About%20Recovery%20Machine&description=Professional%20Mobile%20Recovery",
        width: 1200,
        height: 630,
        alt: "About Recovery Machine - Mobile Wellness Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Recovery Machine - Professional Mobile Recovery",
    description:
      "Professional-grade cold plunge and infrared sauna therapy delivered to your doorstep.",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">About Recovery Machine</h1>
          <p className="text-xl text-muted-foreground">
            Professional recovery delivered to your doorstep
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              Recovery Machine brings professional-grade cold plunge and infrared sauna therapy
              directly to your location. We believe that optimal recovery shouldn't require
              expensive memberships or travel time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Professional Equipment</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our mobile units feature commercial-grade equipment including precision
              temperature-controlled cold plunge tanks and full-spectrum infrared saunas. Each
              session is guided by certified recovery specialists who ensure safe and effective
              protocols.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Why Choose Recovery Machine?</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Professional-grade equipment delivered to your location</li>
              <li>Certified recovery specialists guide every session</li>
              <li>Flexible scheduling that fits your lifestyle</li>
              <li>No setup or cleanup required</li>
              <li>Consistent weekly sessions for optimal results</li>
              <li>75% savings compared to individual bookings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Get Started Today</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Join hundreds of athletes, professionals, and wellness enthusiasts who have made
              Recovery Machine part of their routine. Experience the benefits of consistent cold
              plunge and infrared sauna therapy without leaving your home.
            </p>
            <Link
              href="/book"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/90 transition-colors rounded-md"
            >
              Book Your Session
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
