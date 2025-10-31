import Pricing from "@/components/sections/Pricing";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing - Recovery Machine Mobile Wellness Services",
  description:
    "Transparent pricing for mobile cold plunge and infrared sauna services. Memberships from $275-$850/month. Household sessions from $175. Serving Orange County.",
  keywords:
    "cold plunge pricing, infrared sauna cost, mobile wellness pricing, recovery membership, Orange County wellness services",
  openGraph: {
    title: "Recovery Machine Pricing - Mobile Wellness Services",
    description:
      "Flexible memberships from $275/month. Household sessions from $175. Professional cold plunge and infrared sauna delivered to your door in Orange County.",
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
      "Flexible memberships from $275/month. Professional recovery delivered throughout Orange County.",
  },
};

export default function PricingPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Pricing />
    </div>
  );
}
