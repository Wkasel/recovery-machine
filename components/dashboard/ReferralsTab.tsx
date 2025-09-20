"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@supabase/supabase-js";
import {
  CheckCircle,
  Clock,
  Copy,
  DollarSign,
  Facebook,
  Gift,
  Mail,
  MessageCircle,
  Plus,
  Share2,
  Twitter,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ProfileData {
  credits: number;
  referral_code: string;
  address: any;
  phone: string;
}

interface Referral {
  id: string;
  invitee_email: string;
  invitee_id: string | null;
  status: "pending" | "signed_up" | "first_booking" | "expired";
  reward_credits: number;
  credits_awarded_at: string | null;
  expires_at: string;
  created_at: string;
}

interface ReferralsTabProps {
  user: User;
  profileData: ProfileData;
  onRefresh: () => void;
}

export function ReferralsTab({ user, profileData, onRefresh }: ReferralsTabProps) {
  const supabase = createBrowserSupabaseClient();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    loadReferrals();
  }, [user.id]);

  const loadReferrals = async () => {
    try {
      const { data, error } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setReferrals(data || []);
    } catch (error) {
      console.error("Error loading referrals:", error);
      toast.error("Failed to load referrals");
    } finally {
      setIsLoading(false);
    }
  };

  const sendInvite = async () => {
    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    if (!inviteEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsInviting(true);
    try {
      // Check if email is already referred
      const { data: existing } = await supabase
        .from("referrals")
        .select("id")
        .eq("referrer_id", user.id)
        .eq("invitee_email", inviteEmail.toLowerCase())
        .single();

      if (existing) {
        toast.error("You have already sent an invite to this email");
        return;
      }

      // Create referral record
      const { error } = await supabase.from("referrals").insert({
        referrer_id: user.id,
        invitee_email: inviteEmail.toLowerCase(),
        reward_credits: 50,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      });

      if (error) throw error;

      // In a real app, you'd send an email here via an edge function or API
      toast.success("Invite sent successfully!");

      setInviteEmail("");
      setInviteDialogOpen(false);
      loadReferrals();
    } catch (error) {
      console.error("Error sending invite:", error);
      toast.error("Failed to send invite");
    } finally {
      setIsInviting(false);
    }
  };

  const getReferralLink = () => {
    return `${window.location.origin}?ref=${profileData.referral_code}`;
  };

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(getReferralLink());
      toast.success("Referral link copied to clipboard!");
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = getReferralLink();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast.success("Referral link copied to clipboard!");
    }
  };

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(profileData.referral_code);
      toast.success("Referral code copied to clipboard!");
    } catch (error) {
      toast.success("Referral code copied!");
    }
  };

  const shareViaEmail = () => {
    const subject = "Try Recovery Machine - Get $50 off your first session!";
    const body = `Hey! I've been using Recovery Machine for my recovery sessions and thought you'd love it too.

Use my referral code "${profileData.referral_code}" or this link to get $50 off your first session:
${getReferralLink()}

Recovery Machine brings professional cold plunge and infrared sauna therapy right to your home. It's been amazing for my recovery and wellness routine!

Check it out: ${getReferralLink()}`;

    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const shareViaText = () => {
    const message = `Try Recovery Machine with my referral code "${profileData.referral_code}" and get $50 off! ${getReferralLink()}`;

    if (navigator.share) {
      navigator.share({
        title: "Recovery Machine Referral",
        text: message,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(message);
      toast.success("Message copied to clipboard!");
    }
  };

  const shareOnSocial = (platform: "facebook" | "twitter") => {
    const message = `Just discovered Recovery Machine - professional recovery therapy at home! Get $50 off with my referral: ${getReferralLink()}`;

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getReferralLink())}&quote=${encodeURIComponent(message)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
    };

    window.open(urls[platform], "_blank", "width=600,height=400");
  };

  const getStatusBadge = (status: string, expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const isExpired = now > expiry;

    if (isExpired && status === "pending") {
      return <Badge variant="destructive">Expired</Badge>;
    }

    const statusConfig = {
      pending: { label: "Pending", variant: "secondary" as const, icon: Clock },
      signed_up: { label: "Signed Up", variant: "default" as const, icon: UserPlus },
      first_booking: { label: "Completed", variant: "secondary" as const, icon: CheckCircle },
      expired: { label: "Expired", variant: "destructive" as const, icon: Clock },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <Icon className="w-3 h-3" />
        <span>{config.label}</span>
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTotalEarned = () => {
    return referrals
      .filter((r) => r.status === "first_booking")
      .reduce((total, r) => total + r.reward_credits, 0);
  };

  const getPendingEarnings = () => {
    return referrals
      .filter((r) => r.status === "signed_up")
      .reduce((total, r) => total + r.reward_credits, 0);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 animate-pulse rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Referral Program</h2>
          <p className="text-gray-600 mt-1">Earn $50 for every friend you refer</p>
        </div>
        <Button onClick={() => setInviteDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Invite Friend
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                <p className="text-2xl font-bold text-blue-600">{referrals.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Credits Earned</p>
                <p className="text-2xl font-bold text-green-600">{getTotalEarned()}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Earnings</p>
                <p className="text-2xl font-bold text-orange-600">{getPendingEarnings()}</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Code Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Code</CardTitle>
          <CardDescription>Share this code or link with friends to earn rewards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="referral-code">Referral Code</Label>
              <div className="flex mt-1">
                <Input
                  id="referral-code"
                  value={profileData.referral_code}
                  readOnly
                  className="font-mono text-lg"
                />
                <Button variant="outline" onClick={copyReferralCode} className="ml-2">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <Label htmlFor="referral-link">Referral Link</Label>
            <div className="flex mt-1">
              <Input id="referral-link" value={getReferralLink()} readOnly className="text-sm" />
              <Button variant="outline" onClick={copyReferralLink} className="ml-2">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex space-x-2 pt-2">
            <Button variant="outline" onClick={() => setShareDialogOpen(true)} className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" onClick={shareViaEmail} className="flex-1">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Share2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Share Your Code</h3>
              <p className="text-sm text-gray-600">
                Send your referral code or link to friends and family
              </p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <UserPlus className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2. They Sign Up</h3>
              <p className="text-sm text-gray-600">
                Your friend creates an account using your referral code
              </p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Gift className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Earn Rewards</h3>
              <p className="text-sm text-gray-600">
                Get $50 in credits when they book their first session
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral History */}
      <Card>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
          <CardDescription>Track your referrals and earnings</CardDescription>
        </CardHeader>
        <CardContent>
          {referrals.length > 0 ? (
            <div className="space-y-4">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{referral.invitee_email}</p>
                    <p className="text-sm text-gray-600">
                      Sent {formatDate(referral.created_at)}
                      {referral.expires_at && ` • Expires ${formatDate(referral.expires_at)}`}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {referral.status === "first_booking" && (
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">
                          +{referral.reward_credits} credits
                        </p>
                        <p className="text-xs text-gray-500">
                          Earned{" "}
                          {referral.credits_awarded_at
                            ? formatDate(referral.credits_awarded_at)
                            : "recently"}
                        </p>
                      </div>
                    )}
                    {getStatusBadge(referral.status, referral.expires_at)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No referrals yet</h3>
              <p className="text-gray-600 mb-4">Start inviting friends to earn rewards!</p>
              <Button onClick={() => setInviteDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Send Your First Invite
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite a Friend</DialogTitle>
            <DialogDescription>
              Send a personal invitation and earn $50 when they book their first session
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="invite-email">Friend's Email</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="friend@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="mt-1"
              />
            </div>

            <Alert>
              <Gift className="h-4 w-4" />
              <AlertDescription>
                They'll receive $50 off their first session, and you'll earn $50 in credits when
                they book!
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendInvite} disabled={isInviting}>
              {isInviting ? "Sending..." : "Send Invite"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Referral</DialogTitle>
            <DialogDescription>Choose how you'd like to share your referral code</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Button variant="outline" onClick={shareViaEmail} className="w-full justify-start">
              <Mail className="w-4 h-4 mr-3" />
              Share via Email
            </Button>

            <Button variant="outline" onClick={shareViaText} className="w-full justify-start">
              <MessageCircle className="w-4 h-4 mr-3" />
              Share via Text/Message
            </Button>

            <Button
              variant="outline"
              onClick={() => shareOnSocial("facebook")}
              className="w-full justify-start"
            >
              <Facebook className="w-4 h-4 mr-3" />
              Share on Facebook
            </Button>

            <Button
              variant="outline"
              onClick={() => shareOnSocial("twitter")}
              className="w-full justify-start"
            >
              <Twitter className="w-4 h-4 mr-3" />
              Share on Twitter
            </Button>

            <Button variant="outline" onClick={copyReferralLink} className="w-full justify-start">
              <Copy className="w-4 h-4 mr-3" />
              Copy Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
