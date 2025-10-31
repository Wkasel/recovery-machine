import Link from "next/link";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 text-foreground">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-serif tracking-tight mb-4">Recovery Blog</h1>
          <p className="text-xl font-light text-muted-foreground">
            Latest insights on recovery, wellness, and performance
          </p>
        </div>

        <div className="text-center py-16">
          <h2 className="text-2xl font-bold font-serif tracking-tight mb-4">Content In Development</h2>
          <p className="text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
            We're developing the latest research, tips, and insights on cold therapy,
            infrared sauna benefits, and recovery optimization. Check back for expert content
            from our certified recovery specialists.
          </p>

          <div className="space-y-4">
            <p className="text-foreground font-light">In the meantime, explore:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/features"
                className="bg-card border border-border text-foreground px-6 py-2 rounded-full hover:bg-muted hover:scale-105 transition-all duration-300 shadow-md"
              >
                Features & Benefits
              </Link>
              <Link
                href="/about"
                className="bg-card border border-border text-foreground px-6 py-2 rounded-full hover:bg-muted hover:scale-105 transition-all duration-300 shadow-md"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="bg-primary text-primary-foreground px-6 py-2 rounded-full hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-md"
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
