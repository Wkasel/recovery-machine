import { Metadata } from "next";
import PageWrapper from "@/components/v2-design/layout/PageWrapper";
import { generatePageMetadata } from "@/lib/metadata-helpers";

export const metadata: Metadata = generatePageMetadata({
  title: "Terms of Service | The Recovery Machine",
  description: "Terms and conditions for using Recovery Machine mobile wellness services. Understand your rights and responsibilities as a customer.",
  url: "/terms",
});

export default function TermsPage() {
  return (
    <PageWrapper>
      <div className="mb-12 animate-fade-in text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6 tracking-tight">
          TERMS OF SERVICE
        </h1>
        <p className="text-xl text-charcoal/80">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-8 animate-fade-in-up">
        <section className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-charcoal/10">
          <h2 className="text-2xl font-medium mb-4">1. Acceptance of Terms</h2>
          <p className="text-charcoal/80 leading-relaxed">
            By accessing and using Recovery Machine's services, you accept and agree to be bound
            by the terms and provision of this agreement.
          </p>
        </section>

        <section className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-charcoal/10">
          <h2 className="text-2xl font-medium mb-4">2. Service Description</h2>
          <p className="text-charcoal/80 leading-relaxed">
            Recovery Machine provides mobile cold plunge and infrared sauna services delivered
            to your location. Our services include professional equipment setup, guided
            sessions, and recovery protocols.
          </p>
        </section>

        <section className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-charcoal/10">
          <h2 className="text-2xl font-medium mb-4">3. Booking and Cancellation</h2>
          <p className="text-charcoal/80 leading-relaxed mb-4">
            Bookings can be made through our website or via Instagram. Cancellations must
            be made at least 24 hours in advance to avoid charges. Monthly memberships require
            30 days notice for cancellation.
          </p>
          <p className="text-charcoal/80 leading-relaxed">
            For full details, please review our{" "}
            <a href="/cancellation" className="text-charcoal font-medium hover:text-mint-accent transition-colors">
              Cancellation Policy
            </a>
            .
          </p>
        </section>

        <section className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-charcoal/10">
          <h2 className="text-2xl font-medium mb-4">4. Health and Safety</h2>
          <p className="text-charcoal/80 leading-relaxed">
            Users must disclose any medical conditions that may be affected by cold exposure or
            heat therapy. Recovery Machine reserves the right to refuse service to individuals
            with contraindicated health conditions.
          </p>
        </section>

        <section className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-charcoal/10">
          <h2 className="text-2xl font-medium mb-4">5. Liability</h2>
          <p className="text-charcoal/80 leading-relaxed">
            Users participate in recovery sessions at their own risk. Recovery Machine maintains
            comprehensive insurance but recommends users consult healthcare providers before
            use. Professional supervision is provided during all sessions.
          </p>
        </section>

        <section className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-charcoal/10">
          <h2 className="text-2xl font-medium mb-4">6. Payment Terms</h2>
          <p className="text-charcoal/80 leading-relaxed">
            Payment is required at the time of booking. We accept major credit cards and process
            payments securely through Stripe. Monthly memberships are billed automatically on
            the same day each month.
          </p>
        </section>

        <section className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-charcoal/10">
          <h2 className="text-2xl font-medium mb-4">7. Privacy</h2>
          <p className="text-charcoal/80 leading-relaxed">
            Your privacy is important to us. Please review our{" "}
            <a href="/privacy" className="text-charcoal font-medium hover:text-mint-accent transition-colors">
              Privacy Policy
            </a>
            {" "}to understand how we collect, use, and protect your information.
          </p>
        </section>

        <section className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-charcoal/10">
          <h2 className="text-2xl font-medium mb-4">8. Contact Information</h2>
          <p className="text-charcoal/80 leading-relaxed">
            For questions about these Terms of Service, please contact us via{" "}
            <a
              href="https://www.instagram.com/therecoverymachine_/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal font-medium hover:text-mint-accent transition-colors"
            >
              Instagram
            </a>
            .
          </p>
        </section>
      </div>
    </PageWrapper>
  );
}
