import { Pricing } from "@/components/sections/Pricing";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-neutral-400 hover:text-white mb-8 inline-block">
          ← Back to Home
        </Link>
      </div>
      <Pricing />
    </div>
  );
}