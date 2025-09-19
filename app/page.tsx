import { ModuleErrorBoundary } from "@/components/error-boundary";
import Hero from "@/components/hero";

export default function Home() {
  return (
    <ModuleErrorBoundary>
      <Hero />
    </ModuleErrorBoundary>
  );
}
