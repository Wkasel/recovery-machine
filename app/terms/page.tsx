import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-serif tracking-tight font-bold mb-4">Terms of Service</h1>
          <p className="font-light text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose max-w-none">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-serif tracking-tight font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="font-light text-muted-foreground leading-relaxed">
                By accessing and using Recovery Machine's services, you accept and agree to be bound
                by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif tracking-tight font-bold mb-4">2. Service Description</h2>
              <p className="font-light text-muted-foreground leading-relaxed">
                Recovery Machine provides mobile cold plunge and infrared sauna services delivered
                to your location. Our services include professional equipment setup, guided
                sessions, and recovery protocols.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif tracking-tight font-bold mb-4">3. Booking and Cancellation</h2>
              <p className="font-light text-muted-foreground leading-relaxed">
                Bookings can be made through our website or mobile application. Cancellations must
                be made at least 24 hours in advance to avoid charges. Monthly memberships require
                30 days notice for cancellation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif tracking-tight font-bold mb-4">4. Health and Safety</h2>
              <p className="font-light text-muted-foreground leading-relaxed">
                Users must disclose any medical conditions that may be affected by cold exposure or
                heat therapy. Recovery Machine reserves the right to refuse service to individuals
                with contraindicated health conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif tracking-tight font-bold mb-4">5. Liability</h2>
              <p className="font-light text-muted-foreground leading-relaxed">
                Users participate in recovery sessions at their own risk. Recovery Machine maintains
                comprehensive insurance but recommends users consult healthcare providers before
                use.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif tracking-tight font-bold mb-4">6. Privacy</h2>
              <p className="font-light text-muted-foreground leading-relaxed">
                Your privacy is important to us. Please review our Privacy Policy to understand how
                we collect, use, and protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif tracking-tight font-bold mb-4">7. Contact Information</h2>
              <p className="font-light text-muted-foreground leading-relaxed">
                For questions about these Terms of Service, please contact us at
                legal@recoverymachine.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
