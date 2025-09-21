import { Suspense } from "react";
import { HomePage } from "@/components/HomePage";
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";

function HomePageFallback() {
  return (
    <div className="bg-black text-white min-h-screen">
      <LocalBusinessSchema />
      <div className="animate-pulse">
        <div className="h-96 bg-gray-800 rounded"></div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen">
      <LocalBusinessSchema />
      <Suspense fallback={<HomePageFallback />}>
        <HomePage />
      </Suspense>
    </div>
  );
}
