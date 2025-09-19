import Link from "next/link";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="text-neutral-400 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-neutral-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">What Are Cookies</h2>
              <p className="text-neutral-300 leading-relaxed">
                Cookies are small text files that are stored on your computer or mobile device when you visit a website. 
                They help us provide you with a better experience by remembering your preferences and improving our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">How We Use Cookies</h2>
              <p className="text-neutral-300 leading-relaxed mb-4">
                Recovery Machine uses cookies for the following purposes:
              </p>
              <ul className="list-disc list-inside text-neutral-300 space-y-2">
                <li>Essential website functionality and security</li>
                <li>Remembering your login status and preferences</li>
                <li>Analyzing website traffic and usage patterns</li>
                <li>Improving our services and user experience</li>
                <li>Preventing fraud and ensuring security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Types of Cookies We Use</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Essential Cookies</h3>
                  <p className="text-neutral-300">
                    These cookies are necessary for the website to function properly. They enable core functionality 
                    such as security, network management, and accessibility.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Analytics Cookies</h3>
                  <p className="text-neutral-300">
                    These cookies help us understand how visitors interact with our website by collecting and 
                    reporting information anonymously.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Functional Cookies</h3>
                  <p className="text-neutral-300">
                    These cookies enable enhanced functionality and personalization, such as remembering your 
                    preferences and settings.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Managing Cookies</h2>
              <p className="text-neutral-300 leading-relaxed">
                You can control and manage cookies in your browser settings. Most browsers allow you to refuse 
                cookies or delete existing ones. However, please note that disabling cookies may affect the 
                functionality of our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Third-Party Cookies</h2>
              <p className="text-neutral-300 leading-relaxed">
                We may use third-party services like Google Analytics that may set their own cookies. These 
                services help us improve our website and understand our users better.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Updates to This Policy</h2>
              <p className="text-neutral-300 leading-relaxed">
                We may update this Cookie Policy from time to time. Any changes will be posted on this page 
                with an updated revision date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-neutral-300 leading-relaxed">
                If you have questions about our use of cookies, please contact us at privacy@recoverymachine.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}