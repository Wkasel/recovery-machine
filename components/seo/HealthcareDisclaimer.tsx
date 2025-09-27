"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface HealthcareDisclaimerProps {
  type?: "banner" | "footer" | "inline";
  showIcon?: boolean;
  className?: string;
}

export function HealthcareDisclaimer({ 
  type = "footer", 
  showIcon = true,
  className = ""
}: HealthcareDisclaimerProps) {
  const disclaimerText = {
    banner: "The Recovery Machine provides wellness services for educational and recreational purposes only. Our services are not intended to diagnose, treat, cure, or prevent any disease or medical condition.",
    footer: "Disclaimer: The Recovery Machine wellness services are for general health and wellness purposes only. Individual results may vary. Consult your healthcare provider before beginning any new wellness regimen.",
    inline: "This information is for educational purposes only and is not intended as medical advice."
  };

  const bannerContent = (
    <Alert className={`border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800 ${className}`}>
      {showIcon && <Info className="h-4 w-4" />}
      <AlertDescription className="text-sm">
        {disclaimerText[type]}
        {type === "banner" && (
          <>
            {" "}
            <strong>Always consult with a healthcare professional before starting any wellness program.</strong>
            {" "}
            <a 
              href="/health-disclaimer" 
              className="underline hover:no-underline text-blue-600 dark:text-blue-400"
            >
              View full health disclaimer
            </a>
          </>
        )}
      </AlertDescription>
    </Alert>
  );

  const footerContent = (
    <div className={`text-xs text-muted-foreground border-t border-border pt-4 mt-8 ${className}`}>
      <p className="mb-2">
        <strong>Health & Wellness Disclaimer:</strong> {disclaimerText[type]}
      </p>
      <p className="mb-2">
        The Recovery Machine team includes certified professionals, but our services are wellness-focused and not medical treatments. 
        If you have any medical conditions, please consult your doctor before booking.
      </p>
      <p>
        <a 
          href="/health-disclaimer" 
          className="underline hover:no-underline"
        >
          Full Health Disclaimer
        </a>
        {" | "}
        <a 
          href="/privacy" 
          className="underline hover:no-underline"
        >
          Privacy Policy
        </a>
        {" | "}
        <a 
          href="/terms" 
          className="underline hover:no-underline"
        >
          Terms of Service
        </a>
      </p>
    </div>
  );

  const inlineContent = (
    <div className={`text-sm text-muted-foreground italic p-3 bg-muted/50 rounded-md ${className}`}>
      {showIcon && <Info className="h-4 w-4 inline mr-2" />}
      {disclaimerText[type]}
    </div>
  );

  switch (type) {
    case "banner":
      return bannerContent;
    case "footer":
      return footerContent;
    case "inline":
      return inlineContent;
    default:
      return footerContent;
  }
}

export default HealthcareDisclaimer;