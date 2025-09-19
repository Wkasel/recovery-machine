import Link from "next/link";
import { CheckCircle, Clock, Users, Shield, Snowflake, Flame } from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      icon: Snowflake,
      title: "Professional Cold Plunge",
      description: "Precision temperature control (38-55°F) with commercial-grade filtration system for optimal cold exposure therapy."
    },
    {
      icon: Flame,
      title: "Full-Spectrum Infrared Sauna",
      description: "Near, mid, and far-infrared wavelengths for deep tissue healing, detoxification, and enhanced recovery."
    },
    {
      icon: Users,
      title: "Certified Specialists",
      description: "Every session guided by trained recovery professionals who ensure safety and maximize therapeutic benefits."
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Book sessions that fit your schedule. Morning, afternoon, or evening - we adapt to your lifestyle."
    },
    {
      icon: Shield,
      title: "Safety First",
      description: "Comprehensive health screening, professional oversight, and full insurance coverage for peace of mind."
    },
    {
      icon: CheckCircle,
      title: "Complete Service",
      description: "Setup, guidance, premium accessories, and cleanup all included. You just show up and recover."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="mb-16 text-center">
          <Link href="/" className="text-neutral-400 hover:text-white mb-8 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Features & Benefits</h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Professional recovery therapy delivered with commercial-grade equipment and expert guidance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="bg-black border border-neutral-800 p-8 text-center">
                <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-6">
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-black border border-neutral-800 p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience Professional Recovery?</h2>
          <p className="text-neutral-400 mb-8 max-w-2xl mx-auto">
            Join hundreds of professionals, athletes, and wellness enthusiasts who have transformed their recovery routine with Recovery Machine.
          </p>
          <Link 
            href="/book" 
            className="inline-block bg-neutral-900 border border-neutral-800 text-white px-12 py-4 text-lg font-semibold hover:bg-neutral-800 transition-colors"
          >
            Book Your First Session
          </Link>
        </div>
      </div>
    </div>
  );
}