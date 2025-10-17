import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-serif tracking-tight font-bold mb-4">Privacy Policy</h1>
          <p className="font-light text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose max-w-none">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-serif tracking-tight font-bold mb-4">1. Information We Collect</h2>
              <p className="font-light text-muted-foreground leading-relaxed">
                We collect information you provide directly to us, such as when you create an
                account, book services, or contact us for support.
              </p>
              <ul className="list-disc list-inside font-light text-muted-foreground mt-4 space-y-2">
                <li>Personal information (name, email, phone number)</li>
                <li>Location information for service delivery</li>
                <li>Health information relevant to recovery services</li>
                <li>Payment information (processed securely through third parties)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif tracking-tight font-bold mb-4">2. How We Use Your Information</h2>
              <p className="font-light text-muted-foreground leading-relaxed">
                We use the information we collect to provide, maintain, and improve our services,
                including:
              </p>
              <ul className="list-disc list-inside font-light text-muted-foreground mt-4 space-y-2">
                <li>Scheduling and delivering recovery sessions</li>
                <li>Processing payments and managing subscriptions</li>
                <li>Communicating with you about our services</li>
                <li>Ensuring safety and appropriate service delivery</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif tracking-tight font-bold mb-4">3. Information Sharing</h2>
              <p className="font-light text-muted-foreground leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to third
                parties except as described in this policy or with your consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif tracking-tight font-bold mb-4">4. Data Security</h2>
              <p className="font-light text-muted-foreground leading-relaxed">
                We implement appropriate security measures to protect your personal information
                against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif tracking-tight font-bold mb-4">5. Your Rights</h2>
              <p className="font-light text-muted-foreground leading-relaxed">
                You have the right to access, update, or delete your personal information. You may
                also opt out of certain communications from us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif tracking-tight font-bold mb-4">6. Cookies and Tracking</h2>
              <p className="font-light text-muted-foreground leading-relaxed">
                We use cookies and similar technologies to enhance your experience on our website
                and analyze usage patterns.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif tracking-tight font-bold mb-4">7. Contact Us</h2>
              <p className="font-light text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at
                privacy@recoverymachine.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
