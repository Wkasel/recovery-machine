import { Metadata } from "next";
import PageWrapper from "@/components/v2-design/layout/PageWrapper";
import { generatePageMetadata } from "@/lib/metadata-helpers";

export const metadata: Metadata = generatePageMetadata({
  title: "Privacy Policy | The Recovery Machine",
  description: "Understand how Recovery Machine collects, uses, and protects your personal information. Our commitment to your privacy and data security.",
  url: "/privacy",
});

export default function PrivacyPage() {
  return (
    <PageWrapper>
      <div className="mb-12 animate-fade-in text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6 tracking-tight">
          PRIVACY POLICY
        </h1>
        <p className="text-xl text-charcoal/80">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-8 animate-fade-in-up">
        <section className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-charcoal/10">
          <h2 className="text-2xl font-medium mb-4">1. Information We Collect</h2>
          <p className="text-charcoal/80 leading-relaxed mb-4">
            We collect information you provide directly to us, such as when you create an
            account, book services, or contact us for support.
          </p>
          <ul className="space-y-3 text-charcoal/80">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-mint-accent rounded-full mt-2 flex-shrink-0" />
              <span>Personal information (name, email, phone number)</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-mint-accent rounded-full mt-2 flex-shrink-0" />
              <span>Location information for service delivery</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-mint-accent rounded-full mt-2 flex-shrink-0" />
              <span>Health information relevant to recovery services</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-mint-accent rounded-full mt-2 flex-shrink-0" />
              <span>Payment information (processed securely through third parties)</span>
            </li>
          </ul>
        </section>

        <section className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-charcoal/10">
          <h2 className="text-2xl font-medium mb-4">2. How We Use Your Information</h2>
          <p className="text-charcoal/80 leading-relaxed mb-4">
            We use the information we collect to provide, maintain, and improve our services,
            including:
          </p>
          <ul className="space-y-3 text-charcoal/80">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-mint-accent rounded-full mt-2 flex-shrink-0" />
              <span>Scheduling and delivering recovery sessions</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-mint-accent rounded-full mt-2 flex-shrink-0" />
              <span>Processing payments and managing subscriptions</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-mint-accent rounded-full mt-2 flex-shrink-0" />
              <span>Communicating with you about our services</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-mint-accent rounded-full mt-2 flex-shrink-0" />
              <span>Ensuring safety and appropriate service delivery</span>
            </li>
          </ul>
        </section>

        <section className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-charcoal/10">
          <h2 className="text-2xl font-medium mb-4">3. Information Sharing</h2>
          <p className="text-charcoal/80 leading-relaxed">
            We do not sell, trade, or otherwise transfer your personal information to third
            parties except as described in this policy or with your consent.
          </p>
        </section>

        <section className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-charcoal/10">
          <h2 className="text-2xl font-medium mb-4">4. Data Security</h2>
          <p className="text-charcoal/80 leading-relaxed">
            We implement appropriate technical and organizational measures to protect your
            personal information against unauthorized access, alteration, disclosure, or
            destruction.
          </p>
        </section>

        <section className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-charcoal/10">
          <h2 className="text-2xl font-medium mb-4">5. Your Rights</h2>
          <p className="text-charcoal/80 leading-relaxed mb-4">
            You have the right to:
          </p>
          <ul className="space-y-3 text-charcoal/80">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-mint-accent rounded-full mt-2 flex-shrink-0" />
              <span>Access, correct, or delete your personal information</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-mint-accent rounded-full mt-2 flex-shrink-0" />
              <span>Opt-out of marketing communications</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-mint-accent rounded-full mt-2 flex-shrink-0" />
              <span>Request data portability</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-mint-accent rounded-full mt-2 flex-shrink-0" />
              <span>Lodge a complaint with a supervisory authority</span>
            </li>
          </ul>
        </section>

        <section className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-charcoal/10">
          <h2 className="text-2xl font-medium mb-4">6. Contact Us</h2>
          <p className="text-charcoal/80 leading-relaxed">
            If you have questions about this Privacy Policy, please contact us via{" "}
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
