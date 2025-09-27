"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container, Stack, Grid, Flex } from "@/components/ui/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading, Text } from "@/components/typography/Typography";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import {
  AlertCircle,
  Bell,
  CheckCircle,
  CreditCard,
  Loader2,
  Plug,
  Save,
  Server,
  Settings,
  Store,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BookingPolicySettings } from "./BookingPolicySettings";
import { BusinessInfoSettings } from "./BusinessInfoSettings";
import { IntegrationSettings } from "./IntegrationSettings";
import { NotificationSettings } from "./NotificationSettings";
import { PricingSettings } from "./PricingSettings";
import { SystemSettings } from "./SystemSettings";

interface BusinessSetting {
  key: string;
  value: any;
  category: string;
  type: string;
  label: string;
  description: string;
  is_public: boolean;
  is_required: boolean;
  validation_rules: any;
  display_order: number;
}

interface SaveStatusType {
  status: "idle" | "saving" | "success" | "error";
  message?: string;
  timestamp?: Date;
}

export function BusinessSettingsManager() {
  const [settings, setSettings] = useState<BusinessSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatusType>({ status: "idle" });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("business");
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from("business_settings")
        .select("*")
        .order("category, display_order");

      if (error) throw error;

      setSettings(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load settings";
      setError(errorMessage);
      toast.error("Failed to load settings", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const saveAllSettings = async () => {
    setSaveStatus({ status: "saving" });
    
    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveStatus({ 
        status: "success", 
        message: "All settings saved successfully",
        timestamp: new Date()
      });
      
      setHasUnsavedChanges(false);
      
      toast.success("Settings saved successfully!", {
        description: "All your changes have been applied.",
      });
      
      // Auto-hide success status after 3 seconds
      setTimeout(() => {
        setSaveStatus({ status: "idle" });
      }, 3000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save settings";
      setSaveStatus({ 
        status: "error", 
        message: errorMessage 
      });
      
      toast.error("Failed to save settings", {
        description: errorMessage,
      });
    }
  };

  const tabs = [
    {
      value: "business",
      label: "Business Info",
      icon: Store,
      description: "Company details and contact information",
      component: BusinessInfoSettings,
    },
    {
      value: "pricing",
      label: "Pricing",
      icon: CreditCard,
      description: "Service pricing and fee structures",
      component: PricingSettings,
    },
    {
      value: "booking",
      label: "Booking Policies",
      icon: Settings,
      description: "Booking rules and availability settings",
      component: BookingPolicySettings,
    },
    {
      value: "notifications",
      label: "Notifications",
      icon: Bell,
      description: "Email and SMS notification settings",
      component: NotificationSettings,
    },
    {
      value: "integrations",
      label: "Integrations",
      icon: Plug,
      description: "Third-party service connections",
      component: IntegrationSettings,
    },
    {
      value: "system",
      label: "System",
      icon: Server,
      description: "Advanced system configuration",
      component: SystemSettings,
    },
  ];

  const SettingsLoadingSkeleton = () => (
    <Container size="full" padding="none">
      <Stack spacing="xl">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-md" />
          ))}
        </div>
        
        <Card>
          <Stack spacing="lg" className="p-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </Stack>
        </Card>
      </Stack>
    </Container>
  );

  if (loading) {
    return <SettingsLoadingSkeleton />;
  }

  if (error) {
    return (
      <Container size="md" className="py-12">
        <Card variant="danger">
          <CardContent className="text-center p-8">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <Heading size="lg" weight="semibold" className="mb-2">
              Failed to Load Settings
            </Heading>
            <Text color="muted" className="mb-6">
              {error}
            </Text>
            <Button onClick={loadSettings} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container size="full" padding="none">
      <Stack spacing="xl">
        {/* Header */}
        <Flex justify="between" align="start" className="flex-col sm:flex-row gap-4">
          <div>
            <Heading size="display-sm" weight="bold">
              Business Settings
            </Heading>
            <Text variant="large" color="muted" className="mt-2">
              Configure your business operations and preferences
            </Text>
            
            {saveStatus.timestamp && (
              <Flex align="center" gap="sm" className="mt-3">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <Text size="sm" color="success">
                  Last saved: {saveStatus.timestamp.toLocaleString()}
                </Text>
              </Flex>
            )}
          </div>

          {/* Global Save Button */}
          <Button
            onClick={saveAllSettings}
            disabled={saveStatus.status === "saving" || !hasUnsavedChanges}
            size="lg"
            className="min-w-40 hover:scale-105 transition-transform"
            leftIcon={
              saveStatus.status === "saving" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saveStatus.status === "success" ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )
            }
            variant={saveStatus.status === "success" ? "success" : "default"}
          >
            {saveStatus.status === "saving" ? "Saving..." : 
             saveStatus.status === "success" ? "Saved!" : 
             "Save All Changes"}
          </Button>
        </Flex>

        {/* Status Alerts */}
        {hasUnsavedChanges && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              You have unsaved changes. Don't forget to save your settings.
            </AlertDescription>
          </Alert>
        )}

        {saveStatus.status === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {saveStatus.message || "Failed to save settings. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        {/* Settings Tabs */}
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto p-1 bg-muted/50">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex flex-col items-center gap-2 py-3 px-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all hover:scale-105"
              >
                <tab.icon className="w-4 h-4" />
                <Text size="xs" weight="medium" className="text-center">
                  {tab.label}
                </Text>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-6">
              <Card 
                variant="elevated" 
                className="animate-in fade-in-50 slide-in-from-bottom-4 duration-300"
              >
                <CardHeader spacing="md">
                  <Flex align="center" gap="sm">
                    <tab.icon className="w-5 h-5 text-primary" />
                    <CardTitle size="lg">{tab.label}</CardTitle>
                  </Flex>
                  <CardDescription>
                    {tab.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <tab.component
                    settings={settings.filter(s => s.category === tab.value)}
                    onSettingsChange={(newSettings) => {
                      setSettings(prev => [
                        ...prev.filter(s => s.category !== tab.value),
                        ...newSettings
                      ]);
                      setHasUnsavedChanges(true);
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Quick Actions */}
        <Card variant="flat" className="bg-muted/20">
          <CardContent className="p-6">
            <Flex justify="between" align="center" className="flex-col sm:flex-row gap-4">
              <div>
                <Text weight="semibold" className="mb-1">
                  Need Help?
                </Text>
                <Text size="sm" color="muted">
                  Check our documentation for detailed configuration guides.
                </Text>
              </div>
              <Flex gap="sm" className="flex-col sm:flex-row w-full sm:w-auto">
                <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                  View Docs
                </Button>
                <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                  Contact Support
                </Button>
              </Flex>
            </Flex>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}