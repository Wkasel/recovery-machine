import Pricing from "@/components/v2-design/sections/Pricing";
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata-helpers";

export const metadata: Metadata = generatePageMetadata({
  title: "Pricing - Recovery Machine Mobile Wellness Services",
  description: "Transparent pricing for mobile cold plunge and infrared sauna services. Memberships from $275-$850/month. Household sessions from $175. Serving Orange County.",
  keywords: "cold plunge pricing, infrared sauna cost, mobile wellness pricing, recovery membership, Orange County wellness services",
  url: "/pricing",
  image: "/api/og?title=Recovery%20Machine%20Pricing",
});

export default function PricingPage(): JSX.Element {
  return <Pricing />;
}
