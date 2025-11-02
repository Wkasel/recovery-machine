'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import DottedLine from '@/components/v2-design/ui/DottedLine';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Hero: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const vanRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;

    // Split text into words for stagger animation
    const words = titleRef.current.querySelectorAll('.word');

    // Animate title words with stagger
    gsap.fromTo(
      words,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.5
      }
    );

    // Animate first dotted line drawing down
    if (line1Ref.current) {
      gsap.fromTo(
        line1Ref.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1,
          ease: 'power2.inOut',
          delay: 1.5,
          transformOrigin: 'top'
        }
      );
    }

    // Van slides in from left
    if (vanRef.current) {
      gsap.fromTo(
        vanRef.current,
        { x: -200, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.4,
          ease: 'power3.out',
          delay: 2.5,
        }
      );
    }

    // Buttons fade in
    if (buttonsRef.current) {
      gsap.fromTo(
        buttonsRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          delay: 3.2,
        }
      );
    }

    // Second dotted line draws down
    if (line2Ref.current) {
      gsap.fromTo(
        line2Ref.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.2,
          ease: 'power2.inOut',
          delay: 3.5,
          transformOrigin: 'top'
        }
      );
    }

    // Parallax effect on scroll for title
    if (titleRef.current && sectionRef.current) {
      gsap.to(titleRef.current, {
        y: 150,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        }
      });
    }

    // Parallax effect on scroll for van
    if (vanRef.current && sectionRef.current) {
      gsap.to(vanRef.current, {
        y: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        }
      });
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const scrollToHowItWorks = (): void => {
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      // Temporarily disable scroll-snap for smooth scrolling
      const mainElement = document.querySelector('main');
      const htmlElement = document.documentElement;
      const originalScrollSnapType = mainElement?.style.scrollSnapType || '';
      const originalScrollBehavior = htmlElement.style.scrollBehavior;

      if (mainElement) mainElement.style.scrollSnapType = 'none';
      htmlElement.style.scrollBehavior = 'auto';

      const headerHeight = 80; // Approximate header height
      const offsetTop = howItWorksSection.offsetTop - headerHeight - 80; // Extra padding

      gsap.to(window, {
        scrollTo: { y: offsetTop, autoKill: true },
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          // Re-enable scroll-snap after animation
          if (mainElement) mainElement.style.scrollSnapType = originalScrollSnapType || 'y proximity';
          htmlElement.style.scrollBehavior = originalScrollBehavior;
        }
      });
    }
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col items-center justify-center py-32 pt-40 snap-start">
      <h1
        ref={titleRef}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-center max-w-4xl px-4 md:px-6 mb-6 md:mb-8"
      >
        <span className="word inline-block">WELLNESS</span>{' '}
        <span className="word inline-block">THAT</span>{' '}
        <span className="word inline-block">COMES</span>{' '}
        <span className="word inline-block">TO</span>{' '}
        <span className="word inline-block">YOU</span>
      </h1>

      <div ref={line1Ref} className="transform-origin-top">
        <DottedLine height={80} />
      </div>

      <div ref={vanRef} className="w-full max-w-3xl px-4 md:px-6 my-6 md:my-8">
        <Image
          src="/recovery-van.png"
          alt="The Recovery Machine Van"
          width={1200}
          height={600}
          className="w-full h-auto"
          priority
        />
      </div>

      <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8 px-4">
        <button
          onClick={scrollToHowItWorks}
          className="bg-transparent border-2 border-charcoal text-charcoal text-xs md:text-sm font-medium px-6 md:px-8 py-2.5 md:py-3 rounded-full hover:bg-charcoal hover:text-white transition-all duration-300 hover:scale-105 whitespace-nowrap"
        >
          LEARN MORE
        </button>
        <a
          href="/book"
          className="bg-charcoal text-white text-xs md:text-sm font-medium px-6 md:px-8 py-2.5 md:py-3 rounded-full hover:bg-charcoal/90 hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-2xl text-center whitespace-nowrap"
        >
          BOOK NOW
        </a>
      </div>

      <div ref={line2Ref} className="transform-origin-top">
        <DottedLine height={120} />
      </div>
    </section>
  );
};

export default Hero;
