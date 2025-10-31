import {
  Hero,
  HowItWorks,
  SocialProof,
  Pricing,
  EmailCapture,
  VideoShowcase
} from "@/components";
import BrowseByGoal from "@/components/sections/BrowseByGoal";
import SeasonalBanner from "@/components/sections/SeasonalBanner";
import TrustBadges from "@/components/sections/TrustBadges";

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <Hero />
      <VideoShowcase />
      <SeasonalBanner />
      <Pricing />
      <TrustBadges />
      <HowItWorks />
      <BrowseByGoal />
      <SocialProof />
      <EmailCapture />
    </div>
  );
}