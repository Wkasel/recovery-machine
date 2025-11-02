import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-charcoal flex items-center justify-center">
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <div className="mb-8">
          <h1 className="text-8xl font-bold mb-4 text-mint-accent" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>404</h1>
          <h2 className="text-3xl font-bold mb-4 text-charcoal" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>Page Not Found</h2>
          <p className="text-xl text-charcoal-light mb-8 font-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-charcoal text-white px-6 py-3 rounded-full hover:bg-charcoal/90 transition-all hover:scale-105 font-medium"
              style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
            >
              <Home className="h-4 w-4" />
              Go Home
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-mint-accent/20 border-2 border-mint-accent text-charcoal px-6 py-3 rounded-full hover:bg-mint-accent/30 transition-all hover:scale-105 font-medium"
              style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-mint-accent/20">
          <h3 className="text-lg font-semibold mb-4 text-charcoal" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>Popular Pages</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <Link
              href="/services"
              className="text-charcoal-light hover:text-charcoal transition-colors font-medium"
              style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
            >
              Services
            </Link>
            <Link
              href="/pricing"
              className="text-charcoal-light hover:text-charcoal transition-colors font-medium"
              style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-charcoal-light hover:text-charcoal transition-colors font-medium"
              style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-charcoal-light hover:text-charcoal transition-colors font-medium"
              style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm text-charcoal-light font-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
            Need help? Contact us on{" "}
            <a
              href="https://www.instagram.com/therecoverymachine_/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal font-medium hover:text-mint transition-colors hover:underline"
            >
              Instagram
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}