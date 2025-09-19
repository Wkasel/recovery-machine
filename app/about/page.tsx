import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="text-neutral-400 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">About Recovery Machine</h1>
          <p className="text-xl text-neutral-400">Professional recovery delivered to your doorstep</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-neutral-300 leading-relaxed">
              Recovery Machine brings professional-grade cold plunge and infrared sauna therapy directly to your location. 
              We believe that optimal recovery shouldn't require expensive memberships or travel time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Professional Equipment</h2>
            <p className="text-neutral-300 leading-relaxed">
              Our mobile units feature commercial-grade equipment including precision temperature-controlled cold plunge 
              tanks and full-spectrum infrared saunas. Each session is guided by certified recovery specialists who ensure 
              safe and effective protocols.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Why Choose Recovery Machine?</h2>
            <ul className="list-disc list-inside text-neutral-300 space-y-2">
              <li>Professional-grade equipment delivered to your location</li>
              <li>Certified recovery specialists guide every session</li>
              <li>Flexible scheduling that fits your lifestyle</li>
              <li>No setup or cleanup required</li>
              <li>Consistent weekly sessions for optimal results</li>
              <li>75% savings compared to individual bookings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Get Started Today</h2>
            <p className="text-neutral-300 leading-relaxed mb-6">
              Join hundreds of athletes, professionals, and wellness enthusiasts who have made Recovery Machine 
              part of their routine. Experience the benefits of consistent cold plunge and infrared sauna therapy 
              without leaving your home.
            </p>
            <Link 
              href="/book" 
              className="inline-block bg-neutral-900 border border-neutral-800 text-white px-8 py-3 hover:bg-neutral-800 transition-colors"
            >
              Book Your First Session
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}