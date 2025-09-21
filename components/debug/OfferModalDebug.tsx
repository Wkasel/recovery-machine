"use client";

import { Button } from "@/components/ui/button";
import { useFirstVisit } from "@/hooks/useFirstVisit";

export function OfferModalDebug() {
  const { resetFirstVisit } = useFirstVisit();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-red-900 p-2 rounded text-white text-xs">
      <p className="mb-2">Debug: Offer Modal</p>
      <Button
        size="sm"
        onClick={resetFirstVisit}
        className="text-xs h-8 bg-red-700 hover:bg-red-600"
      >
        Reset & Show Modal
      </Button>
    </div>
  );
}