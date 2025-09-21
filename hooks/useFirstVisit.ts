"use client";

import { useEffect, useState } from "react";

const FIRST_VISIT_KEY = "recovery-machine-first-visit";
const MODAL_SHOWN_KEY = "recovery-machine-modal-shown";

export function useFirstVisit() {
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if this is a first visit
    const hasVisited = localStorage.getItem(FIRST_VISIT_KEY);
    const modalShown = localStorage.getItem(MODAL_SHOWN_KEY);
    
    if (!hasVisited) {
      // First time visitor
      setIsFirstVisit(true);
      localStorage.setItem(FIRST_VISIT_KEY, "true");
      
      // Show modal only if it hasn't been shown before
      if (!modalShown) {
        setShouldShowModal(true);
      }
    }
    
    setIsLoading(false);
  }, []);

  const markModalAsShown = () => {
    localStorage.setItem(MODAL_SHOWN_KEY, "true");
    setShouldShowModal(false);
  };

  const resetFirstVisit = () => {
    localStorage.removeItem(FIRST_VISIT_KEY);
    localStorage.removeItem(MODAL_SHOWN_KEY);
    setIsFirstVisit(false);
    setShouldShowModal(false);
  };

  return {
    isFirstVisit,
    shouldShowModal,
    isLoading,
    markModalAsShown,
    resetFirstVisit, // For testing purposes
  };
}