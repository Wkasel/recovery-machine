// Social Share Component - Referral Link Sharing
// Enables sharing referral links across social platforms

"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Copy, DollarSign, Gift, MessageCircle, Share2, Users } from "lucide-react";
import { useState } from "react";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { toast } from "sonner";

// ===========================================================================
// TYPES & INTERFACES
// ===========================================================================

interface SocialShareProps {
  referralCode: string;
  userEmail?: string;
  shareUrl?: string;
  className?: string;
  showStats?: boolean;
  compact?: boolean;
}

interface ShareStats {
  totalShares: number;
  referralSignups: number;
  creditsEarned: number;
}

// ===========================================================================
// MAIN COMPONENT
// ===========================================================================

export function SocialShare({
  referralCode,
  userEmail,
  shareUrl,
  className = "",
  showStats = true,
  compact = false,
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<ShareStats>({
    totalShares: 0,
    referralSignups: 0,
    creditsEarned: 0,
  });

  // ===========================================================================
  // SHARE CONTENT CONFIGURATION
  // ===========================================================================

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://recoverymachine.com";
  const fullShareUrl = shareUrl || `${baseUrl}/sign-up?ref=${referralCode}`;

  const shareContent = {
    title: "Recovery Machine - Professional Recovery Therapy",
    description:
      "Get $25 off your first Recovery Machine session! Professional massage, compression therapy, and stretching delivered to your door.",
    hashtags: ["RecoveryMachine", "MassageTherapy", "Wellness", "Recovery", "Fitness"],
  };

  // Platform-specific messages
  const shareMessages = {
    facebook: `I've been loving Recovery Machine's in-home recovery sessions! 💆‍♀️ Use my referral code ${referralCode} and get $25 off your first session. Professional massage, compression therapy, and stretching delivered right to your door! #RecoveryMachine #Wellness`,

    twitter: `Amazing recovery sessions with @RecoveryMachine! 💪 Use code ${referralCode} for $25 off your first session. Professional therapy at home! #RecoveryMachine #Wellness ${fullShareUrl}`,

    whatsapp: `Hey! I've been using Recovery Machine for in-home recovery sessions and it's incredible! 🔥 Use my code ${referralCode} to get $25 off your first session. Check it out: ${fullShareUrl}`,

    linkedin: `Prioritizing recovery has been game-changing for my performance and wellbeing. Recovery Machine brings professional massage, compression therapy, and stretching right to your home. Use referral code ${referralCode} for $25 off your first session.`,

    email: `Subject: Get $25 off professional recovery therapy at home\n\nHi!\n\nI wanted to share something that's been amazing for my recovery and wellness - Recovery Machine. They bring professional massage, compression therapy, and stretching sessions right to your home.\n\nUse my referral code ${referralCode} and you'll get $25 off your first session. The convenience and quality are incredible!\n\nCheck it out here: ${fullShareUrl}\n\nBest regards`,
  };

  // ===========================================================================
  // HANDLERS
  // ===========================================================================

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullShareUrl);
      setCopied(true);
      toast.success("Referral link copied to clipboard!");

      // Track copy event
      trackShareEvent("copy");

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = (platform: string) => {
    // Track share event
    trackShareEvent(platform);

    // Update local stats (in production, this would update the database)
    setStats((prev) => ({
      ...prev,
      totalShares: prev.totalShares + 1,
    }));
  };

  const trackShareEvent = (platform: string) => {
    // Analytics tracking
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "referral_share", {
        event_category: "social_sharing",
        event_label: platform,
        referral_code: referralCode,
      });
    }

    // Log to console for development
    console.log("Share event:", { platform, referralCode, timestamp: new Date() });
  };

  // ===========================================================================
  // COMPACT VERSION
  // ===========================================================================

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button variant="outline" size="sm" onClick={handleCopyLink} className="flex-1">
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </>
          )}
        </Button>

        <WhatsappShareButton
          url={fullShareUrl}
          title={shareMessages.whatsapp}
          onShareWindowClose={() => handleShare("whatsapp")}
        >
          <Button variant="outline" size="sm">
            <MessageCircle className="h-4 w-4" />
          </Button>
        </WhatsappShareButton>

        <FacebookShareButton
          url={fullShareUrl}
          quote={shareMessages.facebook}
          hashtag="#RecoveryMachine"
          onShareWindowClose={() => handleShare("facebook")}
        >
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
        </FacebookShareButton>
      </div>
    );
  }

  // ===========================================================================
  // FULL VERSION
  // ===========================================================================

  return (
    <Card className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Gift className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Share & Earn Credits</h3>
          <p className="text-sm text-muted-foreground">
            Earn $50 for each friend who books their first session
          </p>
        </div>
      </div>

      {/* Referral Code */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">Your Referral Code</label>
        <div className="flex items-center gap-2">
          <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-lg font-semibold text-center">
            {referralCode}
          </div>
          <Button variant="outline" onClick={handleCopyLink} className="shrink-0">
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Share this code or link with friends to earn credits
        </p>
      </div>

      {/* Share Buttons */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-3 block">Share on Social Media</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Facebook */}
          <FacebookShareButton
            url={fullShareUrl}
            quote={shareMessages.facebook}
            hashtag="#RecoveryMachine"
            onShareWindowClose={() => handleShare("facebook")}
            className="w-full"
          >
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors">
              <FacebookIcon size={32} round />
              <span className="text-xs font-medium">Facebook</span>
            </div>
          </FacebookShareButton>

          {/* Twitter */}
          <TwitterShareButton
            url={fullShareUrl}
            title={shareMessages.twitter}
            hashtags={shareContent.hashtags}
            onShareWindowClose={() => handleShare("twitter")}
            className="w-full"
          >
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors">
              <TwitterIcon size={32} round />
              <span className="text-xs font-medium">Twitter</span>
            </div>
          </TwitterShareButton>

          {/* WhatsApp */}
          <WhatsappShareButton
            url={fullShareUrl}
            title={shareMessages.whatsapp}
            onShareWindowClose={() => handleShare("whatsapp")}
            className="w-full"
          >
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors">
              <WhatsappIcon size={32} round />
              <span className="text-xs font-medium">WhatsApp</span>
            </div>
          </WhatsappShareButton>

          {/* LinkedIn */}
          <LinkedinShareButton
            url={fullShareUrl}
            title={shareContent.title}
            summary={shareMessages.linkedin}
            onShareWindowClose={() => handleShare("linkedin")}
            className="w-full"
          >
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors">
              <LinkedinIcon size={32} round />
              <span className="text-xs font-medium">LinkedIn</span>
            </div>
          </LinkedinShareButton>

          {/* Email */}
          <EmailShareButton
            url={fullShareUrl}
            subject={shareMessages.email.split("\n")[0].replace("Subject: ", "")}
            body={shareMessages.email.split("\n\n").slice(1).join("\n\n")}
            onShareWindowClose={() => handleShare("email")}
            className="w-full"
          >
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors">
              <EmailIcon size={32} round />
              <span className="text-xs font-medium">Email</span>
            </div>
          </EmailShareButton>
        </div>
      </div>

      {/* Stats */}
      {showStats && (
        <div className="pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Share2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{stats.totalShares}</span>
              </div>
              <p className="text-xs text-muted-foreground">Shares</p>
            </div>

            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{stats.referralSignups}</span>
              </div>
              <p className="text-xs text-muted-foreground">Sign-ups</p>
            </div>

            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{stats.creditsEarned}</span>
              </div>
              <p className="text-xs text-muted-foreground">Credits Earned</p>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <h4 className="font-medium mb-2">💡 Tips for Better Results</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Share with friends who are into fitness or wellness</li>
          <li>• Explain the benefits you've experienced personally</li>
          <li>• Mention the convenience of in-home service</li>
          <li>• Post on Instagram or TikTok to reach more people</li>
        </ul>
      </div>
    </Card>
  );
}

// ===========================================================================
// QUICK SHARE BUTTON
// ===========================================================================

interface QuickShareButtonProps {
  referralCode: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function QuickShareButton({
  referralCode,
  variant = "default",
  size = "default",
  className = "",
}: QuickShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNativeShare = async () => {
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/sign-up?ref=${referralCode}`;
    const shareData = {
      title: "Recovery Machine - $25 Off Your First Session",
      text: `Use my referral code ${referralCode} and get $25 off your first Recovery Machine session!`,
      url: shareUrl,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);

        // Track share
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "referral_share", {
            event_category: "social_sharing",
            event_label: "native_share",
            referral_code: referralCode,
          });
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    } else {
      // Fallback to copy link
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Referral link copied to clipboard!");
      } catch (error) {
        toast.error("Failed to copy link");
      }
    }
  };

  return (
    <Button variant={variant} size={size} onClick={handleNativeShare} className={className}>
      <Share2 className="h-4 w-4 mr-2" />
      Share & Earn
    </Button>
  );
}
