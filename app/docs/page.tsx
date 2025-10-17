import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 text-foreground">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-serif tracking-tight mb-4">Documentation</h1>
          <p className="text-xl font-light text-muted-foreground">
            Everything you need to know about Recovery Machine
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <section className="bg-white/70 backdrop-blur-sm border border-border rounded-3xl shadow-lg p-6">
              <h2 className="text-xl font-bold font-serif tracking-tight mb-4">Getting Started</h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-foreground font-light hover:text-foreground hover:underline">
                    About Recovery Machine
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="text-foreground font-light hover:text-foreground hover:underline">
                    Features & Benefits
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-foreground font-light hover:text-foreground hover:underline">
                    Pricing & Membership
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-foreground font-light hover:text-foreground hover:underline">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </section>

            <section className="bg-white/70 backdrop-blur-sm border border-border rounded-3xl shadow-lg p-6">
              <h2 className="text-xl font-bold font-serif tracking-tight mb-4">Safety & Guidelines</h2>
              <ul className="space-y-3 text-foreground font-light">
                <li>• Health screening requirements</li>
                <li>• Cold exposure safety protocols</li>
                <li>• Infrared sauna guidelines</li>
                <li>• Contraindications and precautions</li>
              </ul>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-white/70 backdrop-blur-sm border border-border rounded-3xl shadow-lg p-6">
              <h2 className="text-xl font-bold font-serif tracking-tight mb-4">Support</h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/contact" className="text-foreground font-light hover:text-foreground hover:underline">
                    Contact Support
                  </Link>
                </li>
                <li className="text-foreground font-light">Frequently Asked Questions</li>
                <li className="text-foreground font-light">Scheduling & Cancellation</li>
                <li className="text-foreground font-light">Equipment Information</li>
              </ul>
            </section>

            <section className="bg-white/70 backdrop-blur-sm border border-border rounded-3xl shadow-lg p-6">
              <h2 className="text-xl font-bold font-serif tracking-tight mb-4">Legal</h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/terms" className="text-foreground font-light hover:text-foreground hover:underline">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-foreground font-light hover:text-foreground hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-foreground font-light hover:text-foreground hover:underline">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </section>
          </div>
        </div>

        <div className="mt-12 bg-white/70 backdrop-blur-sm border border-border rounded-3xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold font-serif tracking-tight mb-4">Ready to Get Started?</h3>
          <p className="text-muted-foreground font-light mb-6">
            Experience professional recovery therapy at your location
          </p>
          <Link
            href="/contact"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-md"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
