'use client';

import { useState, useEffect } from 'react';

const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const dismissed = localStorage.getItem('announcementDismissed');
    if (dismissed !== 'true') {
      setIsVisible(true);
    }
  }, []);

  const handleClose = (): void => {
    setIsVisible(false);
    localStorage.setItem('announcementDismissed', 'true');
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) return null;
  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-mint-accent text-charcoal py-2 md:py-3 px-4 md:px-6 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex-1 text-center">
          <p className="text-xs md:text-sm font-bold">
            Now Serving Southern California - Book Now
          </p>
        </div>
        <button
          onClick={handleClose}
          className="text-charcoal hover:text-charcoal/70 transition-colors ml-2 md:ml-4 flex-shrink-0"
          aria-label="Close announcement"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 5L5 15M5 5L15 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
