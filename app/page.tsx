import {
  Hero,
  HowItWorks,
  SocialProof,
  Pricing,
  EmailCapture
} from "@/components";
import BrowseByGoal from "@/components/sections/BrowseByGoal";
import SeasonalBanner from "@/components/sections/SeasonalBanner";
import TrustBadges from "@/components/sections/TrustBadges";

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <Hero />
      <SeasonalBanner />
      <TrustBadges />
      <BrowseByGoal />
      <HowItWorks />
      <SocialProof />
      <Pricing />
      <EmailCapture />
    </div>
  );
}