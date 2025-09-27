import { Metadata } from "next";
import Link from "next/link";
import { HealthcareDisclaimer } from "@/components/seo/HealthcareDisclaimer";

export const metadata: Metadata = {
  title: "Health Disclaimer - The Recovery Machine",
  description: "Important health and wellness disclaimer for Recovery Machine services. Read about our wellness protocols, safety measures, and medical considerations.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function HealthDisclaimerPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Health & Wellness Disclaimer</h1>
          <p className="text-xl text-muted-foreground">
            Important information about our wellness services and your health
          </p>
        </div>

        <div className="space-y-8 prose prose-neutral dark:prose-invert max-w-none">
          <HealthcareDisclaimer type="banner" />

          <section>
            <h2 className="text-2xl font-bold mb-4">General Wellness Services</h2>
            <p>
              The Recovery Machine provides mobile wellness services including cold plunge therapy 
              and infrared sauna sessions. Our services are designed for general health and wellness 
              purposes and are intended for healthy individuals seeking recovery and performance 
              optimization benefits.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Not Medical Treatment</h2>
            <p>
              <strong>Important:</strong> Our services are NOT medical treatments and are not intended 
              to diagnose, treat, cure, or prevent any disease or medical condition. The Recovery Machine 
              wellness specialists are certified in wellness protocols but are not medical professionals 
              unless specifically licensed as such.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Medical Consultation Required</h2>
            <p>
              Before participating in any Recovery Machine wellness sessions, you should consult with 
              your healthcare provider, especially if you have:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Cardiovascular conditions or heart disease</li>
              <li>Blood pressure issues (high or low)</li>
              <li>Pregnancy or nursing</li>
              <li>Diabetes or blood sugar regulation issues</li>
              <li>Respiratory conditions</li>
              <li>Recent surgeries or injuries</li>
              <li>Any chronic medical conditions</li>
              <li>Take medications that may be affected by temperature therapy</li>
              <li>Any concerns about temperature therapy safety</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Risks and Contraindications</h2>
            <h3 className="text-xl font-semibold mb-3">Cold Plunge Therapy</h3>
            <p>
              Cold water immersion may not be suitable for individuals with certain conditions. 
              Potential risks include but are not limited to:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2 mb-4">
              <li>Hypothermia</li>
              <li>Cardiovascular stress</li>
              <li>Breathing difficulties</li>
              <li>Skin irritation</li>
              <li>Exacerbation of certain medical conditions</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Infrared Sauna Therapy</h3>
            <p>
              Infrared sauna sessions may not be appropriate for all individuals. Potential risks include:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Dehydration</li>
              <li>Overheating</li>
              <li>Blood pressure changes</li>
              <li>Medication interactions</li>
              <li>Pregnancy complications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Individual Results</h2>
            <p>
              Individual results from wellness services vary significantly based on numerous factors 
              including age, health status, consistency of use, lifestyle factors, and individual 
              response to therapies. No specific results are guaranteed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Safety Protocols</h2>
            <p>
              The Recovery Machine maintains strict safety protocols and uses professional-grade 
              equipment. Our certified specialists are trained in wellness protocols and emergency 
              procedures. However, you participate in wellness sessions at your own risk and are 
              responsible for communicating any health concerns or changes in your condition.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Emergency Situations</h2>
            <p>
              If you experience any adverse reactions during or after a wellness session, discontinue 
              the session immediately and seek appropriate medical attention. In case of emergency, 
              call 911 or your local emergency services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Informed Consent</h2>
            <p>
              By booking and participating in Recovery Machine wellness services, you acknowledge that:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>You have read and understood this health disclaimer</li>
              <li>You have consulted with your healthcare provider as appropriate</li>
              <li>You understand the potential risks involved</li>
              <li>You are participating voluntarily and at your own risk</li>
              <li>You will communicate any health concerns to your wellness specialist</li>
              <li>You will follow all safety guidelines and instructions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Questions or Concerns</h2>
            <p>
              If you have any questions about our wellness services, safety protocols, or health 
              considerations, please contact us at{" "}
              <a href="mailto:safety@therecoverymachine.com" className="text-primary hover:underline">
                safety@therecoverymachine.com
              </a>{" "}
              before booking your session.
            </p>
          </section>

          <div className="border-t border-border pt-8 mt-12">
            <p className="text-sm text-muted-foreground">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}<br />
              <strong>Effective Date:</strong> {new Date().toLocaleDateString()}<br />
              This disclaimer may be updated periodically. Please review before each session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}