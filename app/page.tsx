import { OfferModalDebug } from "@/components/debug/OfferModalDebug";
import Hero from "@/components/hero";
import { HomePageClient } from "@/components/HomePageClient";
import { EmailCapture } from "@/components/sections/EmailCapture";
import HowItWorks from "@/components/sections/HowItWorks";
import { Pricing } from "@/components/sections/Pricing";
import { SocialProof } from "@/components/sections/SocialProof";
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen">
      <LocalBusinessSchema />

      {/* SSR-rendered content for SEO */}
      <Hero />
      <HowItWorks />
      <SocialProof />
      <Pricing />
      <EmailCapture />

      {/* Client-only modal functionality */}
      <HomePageClient />

      <OfferModalDebug />
    </div>
  );
}
