import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="text-neutral-400 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Documentation</h1>
          <p className="text-xl text-neutral-400">
            Everything you need to know about Recovery Machine
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <section className="bg-black border border-neutral-800 p-6">
              <h2 className="text-xl font-bold mb-4">Getting Started</h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-neutral-300 hover:text-white">
                    About Recovery Machine
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="text-neutral-300 hover:text-white">
                    Features & Benefits
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-neutral-300 hover:text-white">
                    Pricing & Membership
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-neutral-300 hover:text-white">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </section>

            <section className="bg-black border border-neutral-800 p-6">
              <h2 className="text-xl font-bold mb-4">Safety & Guidelines</h2>
              <ul className="space-y-3 text-neutral-300">
                <li>• Health screening requirements</li>
                <li>• Cold exposure safety protocols</li>
                <li>• Infrared sauna guidelines</li>
                <li>• Contraindications and precautions</li>
              </ul>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-black border border-neutral-800 p-6">
              <h2 className="text-xl font-bold mb-4">Support</h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/contact" className="text-neutral-300 hover:text-white">
                    Contact Support
                  </Link>
                </li>
                <li className="text-neutral-300">Frequently Asked Questions</li>
                <li className="text-neutral-300">Scheduling & Cancellation</li>
                <li className="text-neutral-300">Equipment Information</li>
              </ul>
            </section>

            <section className="bg-black border border-neutral-800 p-6">
              <h2 className="text-xl font-bold mb-4">Legal</h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/terms" className="text-neutral-300 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-neutral-300 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-neutral-300 hover:text-white">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </section>
          </div>
        </div>

        <div className="mt-12 bg-black border border-neutral-800 p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-neutral-400 mb-6">
            Experience professional recovery therapy at your location
          </p>
          <Link
            href="/contact"
            className="inline-block bg-neutral-900 border border-neutral-800 text-white px-8 py-3 hover:bg-neutral-800 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
