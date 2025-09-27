import Pricing from "@/components/sections/Pricing";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing - Recovery Machine Mobile Wellness Services",
  description:
    "Transparent pricing for mobile cold plunge and infrared sauna services. Weekly memberships starting at $400/month with 75% savings. Professional recovery at your location.",
  keywords:
    "cold plunge pricing, infrared sauna cost, mobile wellness pricing, recovery membership, Los Angeles wellness services",
  openGraph: {
    title: "Recovery Machine Pricing - Mobile Wellness Services",
    description:
      "Weekly memberships starting at $400/month with 75% savings. Professional cold plunge and infrared sauna delivered to your door.",
    type: "website",
    images: [
      {
        url: "/api/og?title=Recovery%20Machine%20Pricing&description=Mobile%20Wellness%20Services",
        width: 1200,
        height: 630,
        alt: "Recovery Machine Pricing - Mobile Wellness Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Recovery Machine Pricing - Mobile Wellness Services",
    description:
      "Weekly memberships starting at $400/month with 75% savings. Professional recovery at your location.",
  },
};

export default function PricingPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-muted-foreground hover:text-foreground mb-8 inline-block">
          ← Back to Home
        </Link>
      </div>
      <Pricing />
    </div>
  );
}
