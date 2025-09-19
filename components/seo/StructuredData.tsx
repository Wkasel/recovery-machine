import { LocalBusinessJsonLd } from '@/components/JsonLd/LocalBusinessJsonLd';
import { ColdPlungeServiceJsonLd, InfraredSaunaServiceJsonLd } from '@/components/JsonLd/ServiceJsonLd';
import { FAQJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';

// Common wellness FAQs for the business
const wellnessFAQs = [
  {
    question: "What are the benefits of cold plunge therapy?",
    answer: "Cold plunge therapy offers numerous benefits including reduced inflammation, improved circulation, enhanced recovery, boosted immune system, increased energy levels, and improved mental clarity. Regular sessions can help with muscle recovery, stress relief, and overall wellness."
  },
  {
    question: "How does mobile infrared sauna work?",
    answer: "Our mobile infrared sauna uses far-infrared technology to penetrate deep into tissues, promoting detoxification through sweat. We bring a professional-grade portable sauna to your location, set it up, and provide a complete wellness experience including towels, water, and guidance."
  },
  {
    question: "What areas do you serve in Los Angeles?",
    answer: "We provide mobile wellness services throughout Los Angeles including Beverly Hills, Santa Monica, West Hollywood, Manhattan Beach, Venice, Malibu, and surrounding areas within 30 miles of downtown LA."
  },
  {
    question: "How long do the sessions last?",
    answer: "Cold plunge sessions typically last 30-45 minutes including setup and guidance, while infrared sauna sessions last 45-60 minutes. Combined sessions can take up to 90 minutes for the complete recovery experience."
  },
  {
    question: "Do I need any special preparation?",
    answer: "We provide all necessary equipment and guidance. For cold plunge, wear swimwear and stay hydrated. For infrared sauna, bring comfortable clothes to change into. We provide towels, water, and post-session refreshments."
  },
  {
    question: "Is it safe for beginners?",
    answer: "Yes, our certified wellness professionals guide you through each session, ensuring safety and comfort. We customize the experience based on your fitness level and health status. We recommend consulting with your healthcare provider if you have any medical conditions."
  },
  {
    question: "How often should I book sessions?",
    answer: "For optimal benefits, we recommend 2-3 sessions per week. Many clients start with our weekly wellness program and adjust based on their recovery needs and lifestyle. Consistency is key for maximum therapeutic benefits."
  },
  {
    question: "What's included in the mobile service?",
    answer: "Our mobile service includes professional equipment setup, certified technician guidance, all necessary accessories (towels, robes, water), post-session consultation, and complete cleanup. We handle everything so you can focus on your wellness experience."
  }
];

// Page-specific structured data components
export function HomePageStructuredData() {
  return (
    <>
      <LocalBusinessJsonLd />
      <ColdPlungeServiceJsonLd />
      <InfraredSaunaServiceJsonLd />
      <FAQJsonLd faqs={wellnessFAQs.slice(0, 4)} />
    </>
  );
}

export function ServicesPageStructuredData() {
  const servicesBreadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' }
  ];

  return (
    <>
      <LocalBusinessJsonLd />
      <ColdPlungeServiceJsonLd />
      <InfraredSaunaServiceJsonLd />
      <BreadcrumbJsonLd breadcrumbs={servicesBreadcrumbs} />
      <FAQJsonLd faqs={wellnessFAQs} />
    </>
  );
}

export function BookingPageStructuredData() {
  const bookingBreadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Book Session', url: '/booking' }
  ];

  const bookingFAQs = [
    {
      question: "How do I book a session?",
      answer: "You can book online through our booking system, call us directly, or text us. We typically respond within 2 hours and can often accommodate same-day appointments based on availability."
    },
    {
      question: "What's your cancellation policy?",
      answer: "We require 4 hours notice for cancellations. Same-day cancellations may incur a 50% fee. We understand emergencies happen and will work with you when possible."
    },
    {
      question: "Do you offer packages or memberships?",
      answer: "Yes, we offer weekly wellness packages, monthly memberships, and corporate wellness programs. Packages provide better value and ensure consistent wellness routines."
    },
    {
      question: "What forms of payment do you accept?",
      answer: "We accept all major credit cards, debit cards, cash, Venmo, and Zelle. Payment is due at the time of service unless you have a prepaid package or membership."
    }
  ];

  return (
    <>
      <LocalBusinessJsonLd />
      <BreadcrumbJsonLd breadcrumbs={bookingBreadcrumbs} />
      <FAQJsonLd faqs={bookingFAQs} />
    </>
  );
}

export function ContactPageStructuredData() {
  const contactBreadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Contact', url: '/contact' }
  ];

  const contactFAQs = [
    {
      question: "How can I contact The Recovery Machine?",
      answer: "You can reach us by phone, email, text message, or through our online contact form. We respond to all inquiries within 2-4 hours during business hours."
    },
    {
      question: "What are your business hours?",
      answer: "We operate Monday through Sunday from 7:00 AM to 8:00 PM. We offer flexible scheduling including early morning and evening appointments to fit your schedule."
    },
    {
      question: "Do you offer emergency or urgent appointments?",
      answer: "While we don't offer emergency services, we can often accommodate urgent wellness needs with same-day appointments. Contact us directly to check availability."
    }
  ];

  return (
    <>
      <LocalBusinessJsonLd />
      <BreadcrumbJsonLd breadcrumbs={contactBreadcrumbs} />
      <FAQJsonLd faqs={contactFAQs} />
    </>
  );
}