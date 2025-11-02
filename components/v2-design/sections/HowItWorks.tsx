'use client';

import DottedLine from '@/components/v2-design/ui/DottedLine';

interface Step {
  number: string;
  time: string;
  title: string;
  description: string;
}

const HowItWorks: React.FC = () => {

  const steps: Step[] = [
    {
      number: '1',
      time: '2 min',
      title: 'Book',
      description: 'Select your date and time online'
    },
    {
      number: '2',
      time: 'Instant',
      title: 'We Arrive',
      description: 'Professional setup at your location'
    },
    {
      number: '3',
      time: '60-90 min',
      title: 'You Recover',
      description: 'Guided sessions for optimal results'
    }
  ];

  return (
    <section
      id="how-it-works"
      className="relative min-h-screen py-20 pt-32 px-4 md:px-6 flex items-center snap-start"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-3xl mx-auto w-full">
        <h2 id="how-it-works-heading" className="text-3xl md:text-4xl font-medium text-center mb-10 md:mb-12">
          HOW IT WORKS
        </h2>

        <div className="relative flex flex-col items-center">
          {/* Steps */}
          <div className="relative z-10 w-full">
            {steps.map((step, index) => (
              <div key={index}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-charcoal text-white flex items-center justify-center text-2xl md:text-3xl font-medium mb-2 md:mb-3 shadow-lg">
                    {step.number}
                  </div>

                  <div className="text-xs uppercase tracking-wider text-charcoal mb-1 font-medium">{step.time}</div>
                  <h3 className="text-xl md:text-2xl font-medium mb-2">{step.title}</h3>
                  <div className="bg-mint-accent/20 rounded-xl px-4 md:px-5 py-2 max-w-sm">
                    <p className="text-sm text-charcoal">{step.description}</p>
                  </div>
                </div>

                {/* Dotted line between steps */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-6">
                    <DottedLine height={60} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href="#recovery-gallery"
            className="inline-block bg-charcoal text-white text-sm font-medium px-8 py-3 rounded-full hover:bg-charcoal/90 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            SEE IT IN ACTION →
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
