'use client';

import { useWellnessTracking } from '@/components/analytics/GoogleAnalytics';

interface Plan {
  name: string;
  visits: string;
  price: string;
  description: string;
  popular: boolean;
}

const Pricing: React.FC = () => {
  const { trackWellnessEvent, trackServiceInterest } = useWellnessTracking();

  const plans: Plan[] = [
    {
      name: 'Recovery Lite',
      visits: '2 visits/month',
      price: '$275',
      description: 'Sauna or cold plunge',
      popular: false
    },
    {
      name: 'Full Spectrum',
      visits: '4 visits/month',
      price: '$525',
      description: 'Contrast therapy included',
      popular: true
    },
    {
      name: 'Elite Performance',
      visits: '8 visits/month',
      price: '$850',
      description: 'All modalities + priority',
      popular: false
    }
  ];

  return (
    <section id="pricing" className="relative min-h-screen py-20 pt-32 px-4 md:px-6 bg-white flex items-center snap-start">
      <div className="max-w-5xl mx-auto w-full">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-center mb-12 md:mb-16">
          PRICING
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch md:items-center">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-5 md:p-6 rounded-2xl border-2 transition-all ${
                plan.popular
                  ? 'border-mint-accent bg-mint/30 shadow-2xl md:scale-110 hover:shadow-mint-accent/30 hover:-translate-y-3'
                  : 'border-charcoal/20 bg-white hover:shadow-2xl hover:-translate-y-2'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-mint-accent text-charcoal text-xs font-bold px-4 py-1 rounded-full shadow-md z-10 whitespace-nowrap">
                  MOST POPULAR
                </div>
              )}

              <div className="text-center">
                <h3 className={`font-medium mb-1 ${plan.popular ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'}`}>{plan.name}</h3>
                <p className="text-xs text-charcoal/60 mb-3 md:mb-4">{plan.visits}</p>

                <div className={`font-medium mb-2 ${plan.popular ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl'}`}>{plan.price}</div>
                <p className="text-xs text-charcoal/80 mb-3 md:mb-4">per month</p>

                <p className="text-sm mb-5 md:mb-6">{plan.description}</p>

                <a
                  href="/book"
                  onClick={() => {
                    trackServiceInterest(plan.name);
                    trackWellnessEvent('pricing_plan_selected', {
                      plan: plan.name,
                      price: plan.price,
                      location: 'pricing_section'
                    });
                  }}
                  className={`block w-full py-2.5 md:py-3 rounded-full font-medium transition-all text-sm hover:scale-105 ${
                    plan.popular
                      ? 'bg-charcoal text-white hover:bg-charcoal/90 shadow-lg'
                      : 'bg-mint-accent text-black hover:bg-mint-accent/90'
                  }`}
                >
                  GET STARTED
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#book"
            onClick={() => trackWellnessEvent('ready_to_book_clicked', { location: 'pricing_section' })}
            className="inline-block bg-charcoal text-white text-sm font-medium px-8 py-3 rounded-full hover:bg-charcoal/90 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            READY TO BOOK? →
          </a>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
