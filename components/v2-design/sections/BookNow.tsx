'use client';

import { useWellnessTracking } from '@/components/analytics/GoogleAnalytics';

const BookNow: React.FC = () => {
  const { trackWellnessEvent } = useWellnessTracking();

  return (
    <section id="book" className="relative min-h-screen flex items-center justify-center py-24 pt-32 px-4 md:px-6 snap-start">
      <div className="text-center max-w-3xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium mb-4 md:mb-6">
          READY TO RECOVER?
        </h2>
        <p className="text-base md:text-lg text-charcoal/80 mb-8 md:mb-10">
          Professional wellness delivered to your door
        </p>
        <a
          href="/book/service"
          onClick={() => trackWellnessEvent('book_now_clicked', { location: 'book_now_section' })}
          className="inline-block bg-charcoal text-white text-base md:text-lg font-medium px-10 md:px-12 py-4 md:py-5 rounded-full hover:bg-charcoal/90 hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-2xl"
        >
          BOOK NOW
        </a>
      </div>
    </section>
  );
};

export default BookNow;
