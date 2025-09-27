"use client";

import { OfferModal } from "@/components/modals/OfferModal";
import { useFirstVisit } from "@/lib/hooks/useFirstVisit";
import { useEffect, useState } from "react";

export function HomePageClient() {
  const { shouldShowModal, markModalAsShown, isLoading } = useFirstVisit();
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle search params after mount to avoid SSR mismatch
  useEffect(() => {
    if (!mounted) return;

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const promoMode = searchParams.get("promo") === "1";

      // Force show via promo=1 or first-visit logic
      if (promoMode) {
        const timer = setTimeout(() => setShowModal(true), 300);
        return () => clearTimeout(timer);
      }
      if (shouldShowModal && !isLoading) {
        const timer = setTimeout(() => setShowModal(true), 2000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      // Gracefully handle any URL parsing errors
      console.warn("Error handling URL params for modal:", error);
    }
  }, [mounted, shouldShowModal, isLoading]);

  const handleCloseModal = () => {
    setShowModal(false);
    // Don't persist as shown when forced via promo=1 (useful for QA)
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const promoMode = searchParams.get("promo") === "1";
      if (!promoMode) {
        markModalAsShown();
      }
    } catch (error) {
      // If URL parsing fails, just mark as shown
      markModalAsShown();
    }
  };

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return <OfferModal isOpen={showModal} onClose={handleCloseModal} />;
}
