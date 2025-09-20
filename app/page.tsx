"use client";

import Hero from "@/components/hero";
import { EmailCapture } from "@/components/sections/EmailCapture";
import HowItWorks from "@/components/sections/HowItWorks";
import { Pricing } from "@/components/sections/Pricing";
import { SocialProof } from "@/components/sections/SocialProof";
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen">
      <LocalBusinessSchema />
      <Hero />
      <HowItWorks />
      <SocialProof />
      <Pricing />
      <EmailCapture />
    </div>
  );
}
