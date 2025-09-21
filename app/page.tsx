"use client";

import { OfferModalDebug } from "@/components/debug/OfferModalDebug";
import Hero from "@/components/hero";
import { OfferModal } from "@/components/modals/OfferModal";
import { EmailCapture } from "@/components/sections/EmailCapture";
import HowItWorks from "@/components/sections/HowItWorks";
import { Pricing } from "@/components/sections/Pricing";
import { SocialProof } from "@/components/sections/SocialProof";
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";
import { useFirstVisit } from "@/hooks/useFirstVisit";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const { shouldShowModal, markModalAsShown, isLoading } = useFirstVisit();
  const [showModal, setShowModal] = useState(false);
  const searchParams = useSearchParams();
  const promoMode = searchParams?.get("promo") === "1";

  useEffect(() => {
    // Force show via promo=1 or first-visit logic
    if (promoMode) {
      const timer = setTimeout(() => setShowModal(true), 300);
      return () => clearTimeout(timer);
    }
    if (shouldShowModal && !isLoading) {
      const timer = setTimeout(() => setShowModal(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [promoMode, shouldShowModal, isLoading]);

  const handleCloseModal = () => {
    setShowModal(false);
    // Don't persist as shown when forced via promo=1 (useful for QA)
    if (!promoMode) {
      markModalAsShown();
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <LocalBusinessSchema />
      <Hero />
      <HowItWorks />
      <SocialProof />
      <Pricing />
      <EmailCapture />

      <OfferModal
        isOpen={showModal}
        onClose={handleCloseModal}
      />

      <OfferModalDebug />
    </div>
  );
}
