'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Settings, Store, CreditCard, Bell, Plug, Server } from 'lucide-react';
import { BusinessInfoSettings } from './BusinessInfoSettings';
import { BookingPolicySettings } from './BookingPolicySettings';
import { PricingSettings } from './PricingSettings';
import { NotificationSettings } from './NotificationSettings';
import { IntegrationSettings } from './IntegrationSettings';
import { SystemSettings } from './SystemSettings';
import { createClient } from '@/utils/supabase/client';

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

export function BusinessSettingsManager() {
  const [settings, setSettings] = useState<BusinessSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const supabase = createClient();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .order('category, display_order');

      if (error) throw error;
      setSettings(data || []);
    } catch (err) {
      console.error('Error loading settings:', err);
      setError('Failed to load business settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      setSaveStatus('saving');
      
      // Call the database function to update the setting
      const { error } = await supabase.rpc('update_business_setting', {
        setting_key: key,
        setting_value: JSON.stringify(value)
      });

      if (error) throw error;

      // Update local state
      setSettings(prev => prev.map(setting => 
        setting.key === key ? { ...setting, value } : setting
      ));

      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Error updating setting:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const getSettingsByCategory = (category: string) => {
    return settings.filter(setting => setting.category === category);
  };

  const tabs = [
    {
      id: 'business_info',
      label: 'Business Info',
      icon: Store,
      component: BusinessInfoSettings,
      description: 'Basic business information and contact details'
    },
    {
      id: 'booking_policies',
      label: 'Booking Policies',
      icon: Settings,
      component: BookingPolicySettings,
      description: 'Booking rules and cancellation policies'
    },
    {
      id: 'pricing',
      label: 'Pricing',
      icon: CreditCard,
      component: PricingSettings,
      description: 'Service pricing and fee configuration'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      component: NotificationSettings,
      description: 'Email and SMS notification settings'
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: Plug,
      component: IntegrationSettings,
      description: 'Third-party service integrations'
    },
    {
      id: 'system',
      label: 'System',
      icon: Server,
      component: SystemSettings,
      description: 'Advanced system configuration'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Save Status */}
      {saveStatus !== 'idle' && (
        <Alert className={saveStatus === 'success' ? 'border-green-200 bg-green-50' : saveStatus === 'error' ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}>
          {saveStatus === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : saveStatus === 'error' ? (
            <AlertCircle className="h-4 w-4 text-red-600" />
          ) : (
            <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          )}
          <AlertDescription className={saveStatus === 'success' ? 'text-green-800' : saveStatus === 'error' ? 'text-red-800' : 'text-blue-800'}>
            {saveStatus === 'saving' && 'Saving settings...'}
            {saveStatus === 'success' && 'Settings saved successfully!'}
            {saveStatus === 'error' && 'Failed to save settings. Please try again.'}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="business_info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{tab.label}</h3>
                <p className="text-sm text-gray-600">{tab.description}</p>
              </div>
              <Badge variant="secondary">
                {getSettingsByCategory(tab.id).length} settings
              </Badge>
            </div>

            <tab.component
              settings={getSettingsByCategory(tab.id)}
              onUpdateSetting={updateSetting}
              loading={saveStatus === 'saving'}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}