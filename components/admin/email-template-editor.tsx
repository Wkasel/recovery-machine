// Email Template Editor Component - Admin Interface
// Allows admins to customize email templates with preview functionality

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Code, Eye, Mail, Palette, RotateCcw, Save, TestTube } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ===========================================================================
// TYPES & INTERFACES
// ===========================================================================

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html: string;
  text?: string;
  variables: string[];
  category: "transactional" | "marketing" | "notification";
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface TemplateVariable {
  name: string;
  description: string;
  example: string;
  required: boolean;
}

interface EmailTemplateEditorProps {
  templateId?: string;
  onSave?: (template: EmailTemplate) => void;
  onCancel?: () => void;
  className?: string;
}

// ===========================================================================
// PREDEFINED VARIABLES
// ===========================================================================

const AVAILABLE_VARIABLES: TemplateVariable[] = [
  { name: "firstName", description: "User's first name", example: "John", required: false },
  {
    name: "email",
    description: "User's email address",
    example: "john@example.com",
    required: false,
  },
  {
    name: "referralCode",
    description: "User's referral code",
    example: "JOHN123",
    required: false,
  },
  { name: "bookingDate", description: "Booking date", example: "2024-12-25", required: false },
  { name: "bookingTime", description: "Booking time", example: "2:00 PM", required: false },
  { name: "duration", description: "Session duration", example: "60 minutes", required: false },
  {
    name: "address",
    description: "Service address",
    example: "123 Main St, City, State",
    required: false,
  },
  {
    name: "addOns",
    description: "Selected add-ons",
    example: "Sauna time, Extra visits",
    required: false,
  },
  {
    name: "therapistName",
    description: "Therapist name",
    example: "Sarah Johnson",
    required: false,
  },
  {
    name: "siteUrl",
    description: "Website URL",
    example: "https://recoverymachine.com",
    required: true,
  },
  {
    name: "unsubscribeUrl",
    description: "Unsubscribe link",
    example: "https://recoverymachine.com/unsubscribe",
    required: true,
  },
  {
    name: "preferencesUrl",
    description: "Email preferences link",
    example: "https://recoverymachine.com/preferences",
    required: false,
  },
];

const TEMPLATE_CATEGORIES = [
  {
    value: "transactional",
    label: "Transactional",
    description: "Booking confirmations, receipts, etc.",
  },
  { value: "marketing", label: "Marketing", description: "Newsletters, promotions, referrals" },
  { value: "notification", label: "Notification", description: "Reminders, updates, alerts" },
];

// ===========================================================================
// MAIN COMPONENT
// ===========================================================================

export function EmailTemplateEditor({
  templateId,
  onSave,
  onCancel,
  className = "",
}: EmailTemplateEditorProps) {
  const [template, setTemplate] = useState<EmailTemplate>({
    id: "",
    name: "",
    subject: "",
    html: "",
    text: "",
    variables: [],
    category: "transactional",
    active: true,
  });

  const [originalTemplate, setOriginalTemplate] = useState<EmailTemplate | null>(null);
  const [previewData, setPreviewData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");

  // ===========================================================================
  // EFFECTS
  // ===========================================================================

  useEffect(() => {
    if (templateId) {
      loadTemplate(templateId);
    } else {
      // Initialize with default values for new template
      initializeNewTemplate();
    }
  }, [templateId]);

  useEffect(() => {
    if (originalTemplate) {
      const changed = JSON.stringify(template) !== JSON.stringify(originalTemplate);
      setHasChanges(changed);
    }
  }, [template, originalTemplate]);

  // ===========================================================================
  // DATA LOADING
  // ===========================================================================

  const loadTemplate = async (id: string) => {
    try {
      setLoading(true);
      // In production, this would fetch from your API
      // For now, we'll use mock data
      const mockTemplate: EmailTemplate = {
        id,
        name: "Welcome New User",
        subject: "Welcome to Recovery Machine! 🎉",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1f2937;">Welcome to Recovery Machine, {{firstName}}!</h1>
            <p>We're thrilled to have you join our community of wellness enthusiasts.</p>
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Your Referral Code: <strong>{{referralCode}}</strong></h3>
              <p>Share this code with friends and earn $50 in credits for each successful referral!</p>
            </div>
            <a href="{{siteUrl}}/book" style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px;">Book Your First Session</a>
          </div>
        `,
        variables: ["firstName", "referralCode", "siteUrl"],
        category: "transactional",
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setTemplate(mockTemplate);
      setOriginalTemplate(mockTemplate);
      initializePreviewData(mockTemplate.variables);
    } catch (error) {
      console.error("Error loading template:", error);
      toast.error("Failed to load template");
    } finally {
      setLoading(false);
    }
  };

  const initializeNewTemplate = () => {
    const newTemplate: EmailTemplate = {
      id: `template_${Date.now()}`,
      name: "",
      subject: "",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1f2937;">Your Template Title</h1>
          <p>Start writing your email content here...</p>
          <p>Best regards,<br>The Recovery Machine Team</p>
        </div>
      `,
      variables: [],
      category: "transactional",
      active: true,
    };

    setTemplate(newTemplate);
    setOriginalTemplate(null);
    initializePreviewData([]);
  };

  const initializePreviewData = (variables: string[]) => {
    const mockData: Record<string, string> = {};
    AVAILABLE_VARIABLES.forEach((variable) => {
      if (variables.includes(variable.name)) {
        mockData[variable.name] = variable.example;
      }
    });
    setPreviewData(mockData);
  };

  // ===========================================================================
  // HANDLERS
  // ===========================================================================

  const handleTemplateChange = (field: keyof EmailTemplate, value: any) => {
    setTemplate((prev) => ({
      ...prev,
      [field]: value,
      updated_at: new Date().toISOString(),
    }));
  };

  const handleVariableToggle = (variableName: string) => {
    setTemplate((prev) => {
      const variables = prev.variables.includes(variableName)
        ? prev.variables.filter((v) => v !== variableName)
        : [...prev.variables, variableName];

      return {
        ...prev,
        variables,
        updated_at: new Date().toISOString(),
      };
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Validate template
      if (!template.name.trim()) {
        toast.error("Template name is required");
        return;
      }

      if (!template.subject.trim()) {
        toast.error("Subject is required");
        return;
      }

      if (!template.html.trim()) {
        toast.error("HTML content is required");
        return;
      }

      // In production, this would save to your API
      console.log("Saving template:", template);

      setOriginalTemplate(template);
      setHasChanges(false);
      toast.success("Template saved successfully");

      if (onSave) {
        onSave(template);
      }
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Failed to save template");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (originalTemplate) {
      setTemplate(originalTemplate);
      initializePreviewData(originalTemplate.variables);
      setHasChanges(false);
      toast.success("Template reset to last saved version");
    }
  };

  const handleTestEmail = async () => {
    try {
      const testEmail = prompt("Enter email address to send test to:");
      if (!testEmail) return;

      setLoading(true);

      // In production, this would call your test email API
      console.log("Sending test email to:", testEmail);

      toast.success(`Test email sent to ${testEmail}`);
    } catch (error) {
      console.error("Error sending test email:", error);
      toast.error("Failed to send test email");
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewDataChange = (variable: string, value: string) => {
    setPreviewData((prev) => ({
      ...prev,
      [variable]: value,
    }));
  };

  const generatePreview = () => {
    let html = template.html;
    let subject = template.subject;

    Object.entries(previewData).forEach(([variable, value]) => {
      const regex = new RegExp(`{{${variable}}}`, "g");
      html = html.replace(regex, value);
      subject = subject.replace(regex, value);
    });

    return { html, subject };
  };

  // ===========================================================================
  // RENDER
  // ===========================================================================

  if (loading && !template.id) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-8 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {templateId ? "Edit Template" : "Create Template"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {templateId ? `Editing ${template.name}` : "Create a new email template"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasChanges && <Badge variant="secondary">Unsaved Changes</Badge>}
            <Badge variant={template.active ? "default" : "secondary"}>
              {template.active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="variables" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Variables
            </TabsTrigger>
          </TabsList>

          {/* Edit Tab */}
          <TabsContent value="edit" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    value={template.name}
                    onChange={(e) => handleTemplateChange("name", e.target.value)}
                    placeholder="e.g., Welcome New User"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={template.category}
                    onValueChange={(value) => handleTemplateChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TEMPLATE_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div>
                            <div className="font-medium">{category.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {category.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject Line</Label>
                  <Input
                    id="subject"
                    value={template.subject}
                    onChange={(e) => handleTemplateChange("subject", e.target.value)}
                    placeholder="e.g., Welcome to Recovery Machine! 🎉"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={template.active}
                      onChange={(e) => handleTemplateChange("active", e.target.checked)}
                    />
                    <span className="text-sm">Active</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="html">HTML Content</Label>
              <Textarea
                id="html"
                value={template.html}
                onChange={(e) => handleTemplateChange("html", e.target.value)}
                placeholder="Enter your HTML email content..."
                rows={15}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use {"{{"} variableName {"}"} syntax for dynamic content
              </p>
            </div>

            <div>
              <Label htmlFor="text">Plain Text Version (Optional)</Label>
              <Textarea
                id="text"
                value={template.text || ""}
                onChange={(e) => handleTemplateChange("text", e.target.value)}
                placeholder="Enter plain text version for better deliverability..."
                rows={8}
              />
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Preview Subject</Label>
                <div className="p-3 bg-muted rounded-lg font-medium">
                  {generatePreview().subject || "No subject"}
                </div>
              </div>

              <div>
                <Label>Email Preview</Label>
                <div className="border rounded-lg overflow-hidden">
                  <div
                    className="p-4 bg-white"
                    dangerouslySetInnerHTML={{ __html: generatePreview().html }}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Variables Tab */}
          <TabsContent value="variables" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-4">Available Variables</h3>
                <div className="space-y-2">
                  {AVAILABLE_VARIABLES.map((variable) => (
                    <div
                      key={variable.name}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <input
                        type="checkbox"
                        checked={template.variables.includes(variable.name)}
                        onChange={() => handleVariableToggle(variable.name)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-muted px-1 rounded">
                            {`{{${variable.name}}}`}
                          </code>
                          {variable.required && (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{variable.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Preview Data</h3>
                <div className="space-y-3">
                  {template.variables.map((variableName) => {
                    const variable = AVAILABLE_VARIABLES.find((v) => v.name === variableName);
                    if (!variable) return null;

                    return (
                      <div key={variableName}>
                        <Label htmlFor={`preview-${variableName}`}>{variable.name}</Label>
                        <Input
                          id={`preview-${variableName}`}
                          value={previewData[variableName] || ""}
                          onChange={(e) => handlePreviewDataChange(variableName, e.target.value)}
                          placeholder={variable.example}
                        />
                      </div>
                    );
                  })}

                  {template.variables.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No variables selected. Choose variables from the left panel to see preview
                      options.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="p-6 border-t bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleTestEmail} disabled={loading}>
              <TestTube className="h-4 w-4 mr-2" />
              Send Test
            </Button>

            {hasChanges && (
              <Button variant="ghost" size="sm" onClick={handleReset} disabled={loading}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onCancel && (
              <Button variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
            )}

            <Button onClick={handleSave} disabled={loading || !hasChanges}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
