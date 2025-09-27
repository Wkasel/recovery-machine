import { 
  Hero,
  HowItWorks,
  SocialProof,
  Pricing,
  EmailCollection
} from "@/components";

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <Hero />
      <HowItWorks />
      <SocialProof />
      <Pricing />
      <EmailCollection />
    </div>
  );
}