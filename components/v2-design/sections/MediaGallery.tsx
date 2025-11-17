'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';

interface MediaItem {
  type: 'image' | 'video';
  src: string;
  label: string;
}

interface SelectedMedia extends MediaItem {
  index: number;
}

const MediaGallery: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const scroll = (direction: 'left' | 'right'): void => {
    if (scrollRef.current) {
      const scrollAmount = 420; // card width + gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Enable mouse drag scrolling
  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;
    let hasDragged = false;

    const handleMouseDown = (e: MouseEvent): void => {
      isDown = true;
      hasDragged = false;
      slider.classList.add('cursor-grabbing');
      slider.classList.remove('cursor-grab');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const handleMouseLeave = (): void => {
      isDown = false;
      slider.classList.remove('cursor-grabbing');
      slider.classList.add('cursor-grab');
    };

    const handleMouseUp = (): void => {
      isDown = false;
      slider.classList.remove('cursor-grabbing');
      slider.classList.add('cursor-grab');
      setTimeout(() => setIsDragging(hasDragged), 0);
    };

    const handleMouseMove = (e: MouseEvent): void => {
      if (!isDown) return;
      e.preventDefault();
      hasDragged = true;
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener('mousedown', handleMouseDown);
    slider.addEventListener('mouseleave', handleMouseLeave);
    slider.addEventListener('mouseup', handleMouseUp);
    slider.addEventListener('mousemove', handleMouseMove);

    return () => {
      slider.removeEventListener('mousedown', handleMouseDown);
      slider.removeEventListener('mouseleave', handleMouseLeave);
      slider.removeEventListener('mouseup', handleMouseUp);
      slider.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Focus trap for modal (WCAG 2.4.3)
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedMedia || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element on mount
    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent): void => {
      // Arrow navigation
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigatePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateNext();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setSelectedMedia(null);
      }

      // Focus trap (Tab key)
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMedia]);

  const navigateNext = (): void => {
    if (!selectedMedia) return;
    const nextIndex = (selectedMedia.index + 1) % media.length;
    setSelectedMedia({ ...media[nextIndex], index: nextIndex });
  };

  const navigatePrev = (): void => {
    if (!selectedMedia) return;
    const prevIndex = selectedMedia.index === 0 ? media.length - 1 : selectedMedia.index - 1;
    setSelectedMedia({ ...media[prevIndex], index: prevIndex });
  };

  // Real media items with images and videos
  const media: MediaItem[] = [
    { type: 'video', src: '/nov-images/promo-1.mov', label: 'Recovery Machine in Action' },
    { type: 'image', src: '/nov-images/van-still.png', label: 'Mobile Recovery Unit' },
    { type: 'image', src: '/nov-images/full-front-interior-still.jpeg', label: 'Full Interior Setup' },
    { type: 'image', src: '/nov-images/plunge-still.png', label: 'Cold Plunge Therapy' },
    { type: 'image', src: '/nov-images/sauna-still.png', label: 'Infrared Sauna' },
  ];

  const handleMediaClick = (item: MediaItem, index: number): void => {
    if (!isDragging) {
      setSelectedMedia({ ...item, index });
    }
    setIsDragging(false);
  };

  return (
    <section
      id="recovery-gallery"
      className="min-h-screen py-20 pt-32 overflow-hidden relative flex items-center snap-start"
      aria-labelledby="gallery-heading"
    >
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6 mb-6 flex items-center justify-between">
          <h3 id="gallery-heading" className="text-2xl md:text-3xl font-medium">RECOVERY IN ACTION</h3>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full bg-charcoal text-white flex items-center justify-center hover:bg-charcoal/80 transition-colors"
              aria-label="Scroll left"
            >
              ←
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full bg-charcoal text-white flex items-center justify-center hover:bg-charcoal/80 transition-colors"
              aria-label="Scroll right"
            >
              →
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-auto pl-4 pr-4 md:pl-6 md:pr-6 pb-6 scrollbar-hide cursor-grab select-none"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {media.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMediaClick(item, index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleMediaClick(item, index);
                }
              }}
              className="flex-none w-[280px] md:w-[400px] h-[200px] md:h-[300px] rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer relative group focus:outline-none focus:ring-4 focus:ring-mint-accent"
              aria-label={`View ${item.label}${item.type === 'video' ? ' video' : ' image'}`}
            >
              {item.type === 'video' ? (
                <video
                  src={item.src}
                  poster="/nov-images/van-still.png"
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  preload="none"
                  aria-label={item.label}
                />
              ) : (
                <Image
                  src={item.src}
                  alt={item.label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 280px, 400px"
                  loading="lazy"
                  quality={85}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" aria-hidden="true" />
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
                    <svg className="w-8 h-8 text-charcoal ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
              <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6">
                <div className="text-white text-base md:text-xl font-medium backdrop-blur-sm bg-charcoal/40 px-3 md:px-4 py-1.5 md:py-2 rounded-lg inline-block">
                  {item.label}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center mt-4 text-sm text-charcoal/60" aria-live="polite">
          ← Drag to explore or use arrow buttons →
        </div>

        <div className="text-center mt-10">
          <a
            href="#pricing"
            className="inline-block bg-charcoal text-white text-sm font-medium px-8 py-3 rounded-full hover:bg-charcoal/90 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            VIEW PRICING →
          </a>
        </div>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>

      {/* Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-6"
          onClick={() => setSelectedMedia(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div
            ref={modalRef}
            className="relative max-w-5xl w-full bg-mint rounded-2xl overflow-hidden"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-charcoal text-white flex items-center justify-center hover:bg-charcoal/80 transition-colors z-10"
              aria-label="Close modal"
            >
              ✕
            </button>
            <div className="relative w-full aspect-video bg-black">
              {selectedMedia.type === 'video' ? (
                <video
                  src={selectedMedia.src}
                  poster="/nov-images/van-still.png"
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  className="w-full h-full"
                  aria-label={selectedMedia.label}
                >
                  <source src={selectedMedia.src} type="video/quicktime" />
                  {/* TODO: Add caption files for WCAG 1.2.2 compliance
                      <track kind="captions" src="/captions/promo-video.vtt" srclang="en" label="English" default />
                  */}
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Image
                  src={selectedMedia.src}
                  alt={selectedMedia.label}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  quality={90}
                  priority
                />
              )}
            </div>
            <div className="p-6">
              <h3 id="modal-title" className="text-2xl font-medium mb-2">{selectedMedia.label}</h3>
              <p id="modal-description" className="text-charcoal/70">
                {selectedMedia.type === 'video'
                  ? 'See our mobile recovery service in action. Professional equipment delivered directly to you.'
                  : 'Professional-grade recovery equipment and facilities.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MediaGallery;
