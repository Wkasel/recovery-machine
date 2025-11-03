import { Metadata } from "next";
import Link from "next/link";
import PageWrapper from "@/components/v2-design/layout/PageWrapper";
import { generatePageMetadata } from "@/lib/metadata-helpers";

export const metadata: Metadata = generatePageMetadata({
  title: "Cancellation Policy | The Recovery Machine",
  description: "Understand our flexible cancellation and rescheduling policy for mobile recovery services. Easy cancellations with advance notice.",
  url: "/cancellation",
});

export default function CancellationPage() {
  return (
    <PageWrapper>
      <div className="mb-12 animate-fade-in text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6 tracking-tight">
          CANCELLATION POLICY
        </h1>
        <p className="text-xl text-charcoal/80">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

        <div className="space-y-8 animate-fade-in-up">
          <section className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-charcoal/10">
            <h2 className="text-2xl md:text-3xl font-medium mb-4">Cancellation Notice</h2>
            <p className="text-charcoal/80 leading-relaxed text-lg mb-4">
              We understand that schedules change. To ensure the best service for all our clients, we require advance notice for cancellations and rescheduling.
            </p>
            <ul className="space-y-3 text-charcoal/80">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-mint-accent rounded-full mt-2 flex-shrink-0" />
                <span><strong>24+ hours notice:</strong> Full refund or reschedule with no penalty</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-mint-accent rounded-full mt-2 flex-shrink-0" />
                <span><strong>12-24 hours notice:</strong> 50% session fee charged, or reschedule for a $50 fee</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-mint-accent rounded-full mt-2 flex-shrink-0" />
                <span><strong>Less than 12 hours:</strong> Full session fee charged, no refund</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-mint-accent rounded-full mt-2 flex-shrink-0" />
                <span><strong>No-show:</strong> Full session fee charged, future bookings may require prepayment</span>
              </li>
            </ul>
          </section>

          <section className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-charcoal/10">
            <h2 className="text-2xl md:text-3xl font-medium mb-4">Membership Cancellations</h2>
            <p className="text-charcoal/80 leading-relaxed text-lg mb-4">
              For monthly membership subscriptions:
            </p>
            <ul className="space-y-3 text-charcoal/80">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-mint-accent rounded-full mt-2 flex-shrink-0" />
                <span>Memberships require 30 days' notice to cancel</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-mint-accent rounded-full mt-2 flex-shrink-0" />
                <span>You may use remaining sessions during the 30-day notice period</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-mint-accent rounded-full mt-2 flex-shrink-0" />
                <span>No refunds for unused sessions after cancellation</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-mint-accent rounded-full mt-2 flex-shrink-0" />
                <span>Pausing memberships available for up to 60 days (medical or travel reasons)</span>
              </li>
            </ul>
          </section>

          <section className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-charcoal/10">
            <h2 className="text-2xl md:text-3xl font-medium mb-4">Weather & Emergency Cancellations</h2>
            <p className="text-charcoal/80 leading-relaxed text-lg mb-4">
              In cases of severe weather, natural disasters, or other emergencies:
            </p>
            <ul className="space-y-3 text-charcoal/80">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-mint-accent rounded-full mt-2 flex-shrink-0" />
                <span>Sessions cancelled by The Recovery Machine receive full refund or free reschedule</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-mint-accent rounded-full mt-2 flex-shrink-0" />
                <span>Client-initiated emergency cancellations evaluated case-by-case</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-mint-accent rounded-full mt-2 flex-shrink-0" />
                <span>Medical emergencies with documentation receive full refund</span>
              </li>
            </ul>
          </section>

          <section className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-charcoal/10">
            <h2 className="text-2xl md:text-3xl font-medium mb-4">How to Cancel</h2>
            <p className="text-charcoal/80 leading-relaxed text-lg mb-4">
              To cancel or reschedule your session:
            </p>
            <ul className="space-y-3 text-charcoal/80">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-mint-accent rounded-full mt-2 flex-shrink-0" />
                <span>Contact us via Instagram DM: <a href="https://www.instagram.com/therecoverymachine_/" target="_blank" rel="noopener noreferrer" className="text-charcoal font-medium hover:text-mint-accent">@therecoverymachine_</a></span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-mint-accent rounded-full mt-2 flex-shrink-0" />
                <span>Use your booking confirmation email to request changes</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-mint-accent rounded-full mt-2 flex-shrink-0" />
                <span>Allow up to 24 hours for confirmation of your cancellation</span>
              </li>
            </ul>
          </section>

          <section className="bg-charcoal text-white rounded-3xl p-8 animate-scale-in">
            <h2 className="text-2xl font-medium mb-4">Questions?</h2>
            <p className="text-white/90 mb-6">
              If you have questions about our cancellation policy or need to discuss a special circumstance, please don't hesitate to reach out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-block bg-mint-accent text-charcoal text-sm font-medium px-8 py-3 rounded-full hover:bg-mint-accent/90 hover:scale-105 transition-all duration-300 text-center"
              >
                CONTACT US
              </Link>
              <Link
                href="/book"
                className="inline-block bg-transparent border-2 border-mint-accent text-mint-accent text-sm font-medium px-8 py-3 rounded-full hover:bg-mint-accent hover:text-charcoal transition-all duration-300 text-center"
              >
                BOOK NOW
              </Link>
            </div>
          </section>
        </div>
      </PageWrapper>
  );
}
