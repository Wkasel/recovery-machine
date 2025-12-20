'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) return null;

  const orangeCountyCities = [
    { name: 'Irvine', slug: 'irvine' },
    { name: 'Newport Beach', slug: 'newport-beach' },
    { name: 'Huntington Beach', slug: 'huntington-beach' },
    { name: 'Costa Mesa', slug: 'costa-mesa' },
    { name: 'Laguna Beach', slug: 'laguna-beach' },
    { name: 'Anaheim', slug: 'anaheim' }
  ];

  return (
    <footer className="py-16 px-6 snap-start bg-charcoal">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Company */}
          <div>
            <h3 className="text-white text-sm font-bold mb-4 tracking-wide">COMPANY</h3>
            <ul className="text-mint/80 text-sm space-y-3">
              <li>
                <Link href="/about" className="hover:text-mint-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-mint-accent transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-mint-accent transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-mint-accent transition-colors font-medium">
                  Book Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Orange County Service Areas */}
          <div>
            <h3 className="text-white text-sm font-bold mb-4 tracking-wide">ORANGE COUNTY</h3>
            <ul className="text-mint/80 text-sm space-y-3">
              {orangeCountyCities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/locations/${city.slug}`}
                    className="hover:text-mint-accent transition-colors"
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-sm font-bold mb-4 tracking-wide">SERVICES</h3>
            <ul className="text-mint/80 text-sm space-y-3">
              <li>Cold Plunge Therapy</li>
              <li>Infrared Sauna</li>
              <li>Contrast Therapy</li>
              <li>Athletic Recovery</li>
              <li>Corporate Wellness</li>
              <li>Mobile Service</li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h3 className="text-white text-sm font-bold mb-4 tracking-wide">LEGAL</h3>
            <ul className="text-mint/80 text-sm space-y-3 mb-6">
              <li>
                <Link href="/privacy" className="hover:text-mint-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-mint-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cancellation" className="hover:text-mint-accent transition-colors">
                  Cancellation Policy
                </Link>
              </li>
            </ul>

            <h3 className="text-white text-sm font-bold mb-4 tracking-wide">FOLLOW US</h3>
            <a
              href="https://www.instagram.com/therecoverymachine.oc/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-mint/80 text-sm hover:text-mint-accent transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span>@therecoverymachine.oc</span>
            </a>
          </div>
        </div>

        <div className="border-t border-mint/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-mint/60 text-sm">
              © {new Date().getFullYear()} The Recovery Machine. All rights reserved.
            </p>
            <p className="text-mint/40 text-xs text-center md:text-right max-w-md">
              Professional mobile wellness services. Licensed & insured. Consult with a healthcare provider before use.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
