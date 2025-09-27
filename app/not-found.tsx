import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <div className="mb-8">
          <h1 className="text-8xl font-bold mb-4 text-neutral-800">404</h1>
          <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
          <p className="text-xl text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3 hover:bg-neutral-200 transition-colors font-medium"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-800 text-white px-6 py-3 hover:bg-neutral-800 transition-colors font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-800">
          <h3 className="text-lg font-semibold mb-4">Popular Pages</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <Link
              href="/services"
              className="text-muted-foreground hover:text-white transition-colors"
            >
              Services
            </Link>
            <Link
              href="/pricing"
              className="text-muted-foreground hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-white transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm text-muted-foreground">
            Need help? Contact us on{" "}
            <a
              href="https://www.instagram.com/therecoverymachine_/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:underline"
            >
              Instagram
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}