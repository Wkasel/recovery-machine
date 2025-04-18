import Hero from "@/components/hero";
import { ModuleErrorBoundary } from "@/components/error-boundary";

export default function Home() {
  return (
    <ModuleErrorBoundary>
      <div className="flex flex-col gap-16">
        <Hero />
        {/* We can add more sections here as needed */}
      </div>
    </ModuleErrorBoundary>
  );
}
