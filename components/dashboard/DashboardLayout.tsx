"use client";

import type { DashboardTab } from "@/app/profile/page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-300 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
            </div>

            {/* User info and credits */}
            <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
                <Coins className="w-4 h-4 text-green-600" />
              <Badge variant="secondary" className="bg-neutral-900 text-green-300 border-neutral-800">
                  {profileData.credits} Credits
                </Badge>
              </div>

              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-neutral-800 text-neutral-100">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium text-white">
                    {user.user_metadata?.full_name || "Recovery Member"}
                  </p>
                  <p className="text-gray-300">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-black border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Custom Tab Implementation - Desktop */}
          <div className="hidden md:block">
            <div className="grid w-full grid-cols-6 bg-transparent border-0 p-0" role="tablist">
              {tabs.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-6 rounded-none border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "bg-neutral-900 text-white border-neutral-700"
                      : "border-transparent text-neutral-400 hover:text-white hover:bg-neutral-900"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Tab Implementation - Mobile */}
          <div className="md:hidden">
            <div className="grid w-full grid-cols-3 bg-transparent border-0 p-0" role="tablist">
              {tabs.slice(0, 3).map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex flex-col items-center space-y-1 py-3 px-2 transition-colors ${
                    activeTab === tab.id
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile overflow menu for remaining tabs */}
            <div className="grid grid-cols-3 mt-2 border-t border-neutral-800 pt-2">
              {tabs.slice(3).map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex flex-col items-center space-y-1 py-2 px-2 rounded transition-colors ${
                    activeTab === tab.id
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="min-h-[600px] p-6 bg-black border-neutral-800 text-white">{children}</Card>
      </div>
    </div>
  );
}
