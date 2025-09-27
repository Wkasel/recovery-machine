"use client";

import type { DashboardTab } from "@/app/profile/page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container, Stack, Flex } from "@/components/ui/layout";
import { Heading, Text } from "@/components/typography/Typography";
import type { User } from "@supabase/supabase-js";
import {
  ArrowLeft,
  Calendar,
  Coins,
  History,
  LayoutDashboard,
  Settings,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

interface ProfileData {
  credits: number;
  referral_code: string;
  address: any;
  phone: string;
}

interface DashboardLayoutProps {
  user: User;
  profileData: ProfileData;
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  children: ReactNode;
}

export function DashboardLayout({
  user,
  profileData,
  activeTab,
  onTabChange,
  children,
}: DashboardLayoutProps) {
  const getUserInitials = () => {
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(" ")
        .map((name: string) => name[0])
        .join("")
        .toUpperCase();
    }
    return user.email?.substring(0, 2).toUpperCase() || "RM";
  };

  const tabs = [
    {
      id: "overview" as DashboardTab,
      label: "Overview",
      icon: LayoutDashboard,
      description: "Dashboard home",
    },
    {
      id: "bookings" as DashboardTab,
      label: "Bookings",
      icon: Calendar,
      description: "Manage sessions",
    },
    {
      id: "history" as DashboardTab,
      label: "History",
      icon: History,
      description: "Past sessions",
    },
    {
      id: "referrals" as DashboardTab,
      label: "Referrals",
      icon: Users,
      description: "Invite friends",
    },
    {
      id: "reviews" as DashboardTab,
      label: "Reviews",
      icon: Star,
      description: "Rate sessions",
    },
    {
      id: "settings" as DashboardTab,
      label: "Settings",
      icon: Settings,
      description: "Account settings",
    },
  ];

  const TabButton = ({ 
    tab, 
    isActive, 
    isMobile = false 
  }: { 
    tab: typeof tabs[0]; 
    isActive: boolean; 
    isMobile?: boolean;
  }) => (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-label={`${tab.label} - ${tab.description}`}
      onClick={() => onTabChange(tab.id)}
      className={`
        group relative flex items-center justify-center gap-2 py-4 px-6 
        font-medium transition-all duration-200 ease-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
        ${isMobile ? 'flex-col py-3 px-2' : 'flex-row'}
        ${isActive 
          ? 'bg-neutral-900 text-white border-b-2 border-primary shadow-sm' 
          : 'border-b-2 border-transparent text-neutral-400 hover:text-white hover:bg-neutral-900/50 hover:scale-105'
        }
      `}
    >
      <tab.icon className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} transition-transform group-hover:scale-110`} />
      <Text 
        size={isMobile ? "xs" : "sm"} 
        weight="medium"
        className="transition-colors"
      >
        {tab.label}
      </Text>
      
      {/* Active indicator */}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-in slide-in-from-bottom-1 duration-200" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <Container size="xl" padding="md">
          <Flex justify="between" align="center" className="py-4">
            {/* Navigation */}
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hover:scale-105 transition-transform"
            >
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>

            {/* User info and credits */}
            <Flex align="center" gap="lg">
              {/* Credits Display */}
              <Flex align="center" gap="sm">
                <Coins className="w-4 h-4 text-green-600" />
                <Badge 
                  variant="secondary" 
                  className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 transition-colors"
                >
                  {profileData.credits} Credits
                </Badge>
              </Flex>

              {/* User Profile */}
              <Flex align="center" gap="md">
                <Avatar className="h-9 w-9 ring-2 ring-border hover:ring-primary transition-all">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <Text size="sm" weight="medium">
                    {user.user_metadata?.full_name || "Recovery Member"}
                  </Text>
                  <Text size="xs" color="muted">
                    {user.email}
                  </Text>
                </div>
              </Flex>
            </Flex>
          </Flex>
        </Container>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-border bg-background/50 backdrop-blur">
        <Container size="xl" padding="md">
          {/* Desktop Tabs */}
          <div className="hidden md:block">
            <div 
              className="grid w-full grid-cols-6 bg-transparent border-0 p-0" 
              role="tablist"
              aria-label="Dashboard navigation"
            >
              {tabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  tab={tab}
                  isActive={activeTab === tab.id}
                />
              ))}
            </div>
          </div>

          {/* Mobile Tabs */}
          <div className="md:hidden">
            {/* Primary tabs */}
            <div 
              className="grid w-full grid-cols-3 bg-transparent border-0 p-0 mb-2" 
              role="tablist"
              aria-label="Primary dashboard navigation"
            >
              {tabs.slice(0, 3).map((tab) => (
                <TabButton
                  key={tab.id}
                  tab={tab}
                  isActive={activeTab === tab.id}
                  isMobile
                />
              ))}
            </div>

            {/* Secondary tabs */}
            <div 
              className="grid grid-cols-3 border-t border-border pt-2"
              role="tablist"
              aria-label="Secondary dashboard navigation"
            >
              {tabs.slice(3).map((tab) => (
                <TabButton
                  key={tab.id}
                  tab={tab}
                  isActive={activeTab === tab.id}
                  isMobile
                />
              ))}
            </div>
          </div>
        </Container>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Container size="xl" padding="md" className="py-8">
          <Card 
            variant="elevated" 
            size="lg"
            className="min-h-[600px] animate-in fade-in-50 slide-in-from-bottom-4 duration-300"
          >
            {children}
          </Card>
        </Container>
      </main>
    </div>
  );
}