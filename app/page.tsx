import { 
  Hero,
  HowItWorks,
  SocialProof,
  Pricing,
  EmailCapture
} from "@/components";

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <Hero />
      <HowItWorks />
      <SocialProof />
      <Pricing />
      <EmailCapture />
    </div>
  );
}