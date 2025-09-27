"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  Edit,
  Eye,
  Mail,
  Plus,
  RefreshCw,
  Search,
  Send,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { EmailTemplateEditor } from "./email-template-editor";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html: string;
  text?: string;
  variables: string[];
  category: "transactional" | "marketing" | "notification";
  active: boolean;
  created_at: string;
  updated_at: string;
}

export function EmailTemplateManager() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/email-templates");

      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      } else {
        throw new Error("Failed to load email templates");
      }
    } catch (error) {
      console.error("Failed to load email templates:", error);
      toast({
        title: "Error",
        description: "Failed to load email templates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openCreateEditor = () => {
    setSelectedTemplate(null);
    setEditMode(false);
    setEditorOpen(true);
  };

  const openEditEditor = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setEditMode(true);
    setEditorOpen(true);
  };

  const handleSave = async (template: EmailTemplate) => {
    try {
      const url = editMode ? `/api/admin/email-templates/${template.id}` : "/api/admin/email-templates";
      const method = editMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(template),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editMode ? "update" : "create"} template`);
      }

      toast({
        title: "Success",
        description: `Template ${editMode ? "updated" : "created"} successfully`,
      });

      loadTemplates();
      setEditorOpen(false);
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Error",
        description: `Failed to ${editMode ? "update" : "create"} template`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (templateId: string) => {
    if (!confirm("Are you sure you want to delete this template?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/email-templates/${templateId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete template");
      }

      toast({
        title: "Success",
        description: "Template deleted successfully",
      });

      loadTemplates();
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      });
    }
  };

  const handleTestEmail = async (templateId: string) => {
    const email = prompt("Enter email address to send test to:");
    if (!email) return;

    try {
      const response = await fetch(`/api/admin/email-templates/${templateId}/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to send test email");
      }

      toast({
        title: "Success",
        description: `Test email sent to ${email}`,
      });
    } catch (error) {
      console.error("Test email error:", error);
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive",
      });
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      transactional: "bg-blue-100 text-blue-800",
      marketing: "bg-purple-100 text-purple-800",
      notification: "bg-yellow-100 text-yellow-800",
    };

    return (
      <Badge className={colors[category as keyof typeof colors] || colors.transactional}>
        {category}
      </Badge>
    );
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      !searchTerm ||
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <span>Loading email templates...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-gray-600">Manage automated email templates and communications</p>
        </div>

        <Button onClick={openCreateEditor}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Controls */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="transactional">Transactional</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="notification">Notification</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={loadTemplates} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <Mail className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Templates</p>
              <p className="text-2xl font-bold">{templates.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <Mail className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-2xl font-bold">
                {templates.filter((t) => t.active).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <Mail className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Transactional</p>
              <p className="text-2xl font-bold">
                {templates.filter((t) => t.category === "transactional").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <Mail className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Marketing</p>
              <p className="text-2xl font-bold">
                {templates.filter((t) => t.category === "marketing").length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Templates Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Template</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Variables</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTemplates.map((template) => (
              <TableRow key={template.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{template.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {template.subject}
                    </div>
                  </div>
                </TableCell>

                <TableCell>{getCategoryBadge(template.category)}</TableCell>

                <TableCell>
                  <div className="text-sm">{template.variables.length} variables</div>
                </TableCell>

                <TableCell>
                  <Badge variant={template.active ? "default" : "secondary"}>
                    {template.active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>

                <TableCell>
                  <span className="text-sm text-gray-500">
                    {new Date(template.updated_at).toLocaleDateString()}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditEditor(template)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestEmail(template.id)}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(template.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No email templates found matching your criteria
          </div>
        )}
      </Card>

      {/* Template Editor Dialog */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-6xl h-[90vh] overflow-hidden">
          <DialogHeader className="pb-4">
            <DialogTitle>
              {editMode ? "Edit Email Template" : "Create Email Template"}
            </DialogTitle>
            <DialogDescription>
              {editMode ? "Update template content and settings" : "Create a new email template"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <EmailTemplateEditor
              templateId={selectedTemplate?.id}
              onSave={handleSave}
              onCancel={() => setEditorOpen(false)}
              className="h-full"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}