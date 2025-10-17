import { Clock, Instagram, MapPin } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-serif tracking-tight font-bold mb-4">Contact Us</h1>
          <p className="text-xl font-light text-muted-foreground">Get in touch with our recovery specialists</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-serif tracking-tight font-bold mb-6">Get In Touch</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 border border-border rounded-2xl flex items-center justify-center">
                    <Instagram className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Follow Us</h3>
                    <a
                      href="https://www.instagram.com/therecoverymachine_/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      @therecoverymachine_
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 border border-border rounded-2xl flex items-center justify-center">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Service Area</h3>
                    <p className="font-light text-muted-foreground">Based in Newport Beach • Serving Southern California</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 border border-border rounded-2xl flex items-center justify-center">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Hours</h3>
                    <p className="font-light text-muted-foreground">7 AM - 9 PM, 7 days a week</p>
                  </div>
                </div>
              </div>
            </section>

          </div>

          <div className="space-y-8">
            <section>
              <h3 className="text-xl font-serif tracking-tight font-bold mb-6">Frequently Asked Questions</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">How far do you travel?</h4>
                  <p className="font-light text-muted-foreground text-sm">
                    Based in Newport Beach, we service Southern California and are expanding our coverage area. Setup fees may vary based on distance.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">What's included in a session?</h4>
                  <p className="font-light text-muted-foreground text-sm">
                    Each 45-minute session includes cold plunge and infrared sauna with professional
                    guidance, setup, cleanup, and premium accessories.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Can I cancel my membership?</h4>
                  <p className="font-light text-muted-foreground text-sm">
                    Yes, you can cancel anytime with 30 days' notice. No long-term contracts
                    required.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Is it safe?</h4>
                  <p className="font-light text-muted-foreground text-sm">
                    All sessions are supervised by certified recovery specialists. We screen for
                    contraindications and maintain comprehensive insurance coverage.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white/70 backdrop-blur-sm border border-border rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-serif tracking-tight font-bold mb-3">Business Inquiries</h3>
              <p className="font-light text-muted-foreground text-sm mb-4">
                Interested in corporate wellness programs or partnership opportunities?
              </p>
              <p className="font-light text-muted-foreground">
                Contact us via <a
                  href="https://www.instagram.com/therecoverymachine_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Instagram
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
