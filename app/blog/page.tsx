import Link from "next/link";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="text-neutral-400 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Recovery Blog</h1>
          <p className="text-xl text-neutral-400">
            Latest insights on recovery, wellness, and performance
          </p>
        </div>

        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Content In Development</h2>
          <p className="text-neutral-400 mb-8 max-w-2xl mx-auto">
            We're developing the latest research, tips, and insights on cold therapy,
            infrared sauna benefits, and recovery optimization. Check back for expert content
            from our certified recovery specialists.
          </p>

          <div className="space-y-4">
            <p className="text-neutral-300">In the meantime, explore:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/features"
                className="bg-neutral-900 border border-neutral-800 text-white px-6 py-2 hover:bg-neutral-800 transition-colors"
              >
                Features & Benefits
              </Link>
              <Link
                href="/about"
                className="bg-neutral-900 border border-neutral-800 text-white px-6 py-2 hover:bg-neutral-800 transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="bg-neutral-900 border border-neutral-800 text-white px-6 py-2 hover:bg-neutral-800 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
