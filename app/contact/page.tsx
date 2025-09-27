import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Recovery Machine - Mobile Wellness Services",
  description:
    "Contact Recovery Machine for mobile cold plunge and infrared sauna services in Los Angeles. Professional recovery specialists available 7 days a week.",
  keywords:
    "contact recovery machine, mobile wellness Los Angeles, cold plunge booking, infrared sauna appointment, recovery specialists",
  openGraph: {
    title: "Contact Recovery Machine - Mobile Wellness Services",
    description:
      "Get in touch with our recovery specialists. Mobile cold plunge and infrared sauna services in Greater Los Angeles Area.",
    type: "website",
    images: [
      {
        url: "/api/og?title=Contact%20Recovery%20Machine&description=Mobile%20Wellness%20Services",
        width: 1200,
        height: 630,
        alt: "Contact Recovery Machine - Mobile Wellness Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Recovery Machine - Mobile Wellness Services",
    description:
      "Get in touch with our recovery specialists. Mobile wellness services in Greater Los Angeles Area.",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground">Get in touch with our recovery specialists</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-muted-foreground">(555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-muted-foreground">hello@recoverymachine.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Service Area</h3>
                    <p className="text-muted-foreground">Greater Los Angeles Area</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Hours</h3>
                    <p className="text-muted-foreground">7 AM - 9 PM, 7 days a week</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4">Quick Start</h3>
              <p className="text-muted-foreground mb-4">
                Ready to experience professional recovery at home? Book your first session today.
              </p>
              <Link
                href="/book"
                className="inline-block bg-neutral-900 border border-neutral-800 text-white px-6 py-3 hover:bg-neutral-800 transition-colors"
              >
                Book Session
              </Link>
            </section>
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="text-xl font-bold mb-6">Frequently Asked Questions</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">How far do you travel?</h4>
                  <p className="text-muted-foreground text-sm">
                    We service the greater Los Angeles area. Setup fees may vary based on distance.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">What's included in a session?</h4>
                  <p className="text-muted-foreground text-sm">
                    Each 45-minute session includes cold plunge and infrared sauna with professional
                    guidance, setup, cleanup, and premium accessories.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Can I cancel my membership?</h4>
                  <p className="text-muted-foreground text-sm">
                    Yes, you can cancel anytime with 30 days' notice. No long-term contracts
                    required.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Is it safe?</h4>
                  <p className="text-muted-foreground text-sm">
                    All sessions are supervised by certified recovery specialists. We screen for
                    contraindications and maintain comprehensive insurance coverage.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-neutral-900 border border-neutral-800 p-6">
              <h3 className="text-lg font-bold mb-3">Business Inquiries</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Interested in corporate wellness programs or partnership opportunities?
              </p>
              <p className="text-muted-foreground">
                Email: <span className="text-white">business@recoverymachine.com</span>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
