"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Download, FileText, ShoppingCart, Star, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ExportJob {
  id: string;
  type: string;
  name: string;
  description: string;
  status: "pending" | "completed" | "failed";
  downloadUrl?: string;
  createdAt: Date;
}

export default function ExportsManager() {
  const [isExporting, setIsExporting] = useState(false);
  const [recentExports, setRecentExports] = useState<ExportJob[]>([]);

  const exportTypes = [
    {
      type: "users",
      name: "Users",
      description: "Export all user data including profiles, contacts, and registration details",
      icon: Users,
      endpoint: "/api/admin/users/export"
    },
    {
      type: "bookings",
      name: "Bookings",
      description: "Export booking data with customer details, dates, and service information",
      icon: Calendar,
      endpoint: "/api/admin/bookings/export"
    },
    {
      type: "orders",
      name: "Orders & Payments",
      description: "Export payment records, orders, and transaction history",
      icon: ShoppingCart,
      endpoint: "/api/admin/payments/export"
    },
    {
      type: "reviews",
      name: "Reviews",
      description: "Export customer reviews and ratings data",
      icon: Star,
      endpoint: "/api/admin/reviews/export"
    },
    {
      type: "referrals",
      name: "Referrals",
      description: "Export referral program data and statistics",
      icon: Users,
      endpoint: "/api/admin/referrals/export"
    }
  ];

  const handleExport = async (exportType: typeof exportTypes[0]) => {
    setIsExporting(true);
    
    try {
      const response = await fetch(exportType.endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to export ${exportType.name}`);
      }

      // Check if response is JSON (error) or file (success)
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        if (result.error) {
          throw new Error(result.error);
        }
      } else {
        // Handle file download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${exportType.type}_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        // Add to recent exports
        const newExport: ExportJob = {
          id: Math.random().toString(36).substr(2, 9),
          type: exportType.type,
          name: exportType.name,
          description: `Exported ${exportType.name.toLowerCase()} data`,
          status: "completed",
          createdAt: new Date(),
        };

        setRecentExports(prev => [newExport, ...prev.slice(0, 4)]);
        toast.success(`${exportType.name} exported successfully`);
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error(error instanceof Error ? error.message : "Export failed");
      
      // Add failed export to recent exports
      const failedExport: ExportJob = {
        id: Math.random().toString(36).substr(2, 9),
        type: exportType.type,
        name: exportType.name,
        description: `Failed to export ${exportType.name.toLowerCase()}`,
        status: "failed",
        createdAt: new Date(),
      };
      
      setRecentExports(prev => [failedExport, ...prev.slice(0, 4)]);
    } finally {
      setIsExporting(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: ExportJob["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-400";
      case "failed":
        return "text-red-400";
      case "pending":
        return "text-yellow-400";
      default:
        return "text-neutral-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exportTypes.map((exportType) => {
          const Icon = exportType.icon;
          return (
            <Card key={exportType.type}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Icon className="h-5 w-5 text-blue-400" />
                  <span>{exportType.name}</span>
                </CardTitle>
                <CardDescription className="text-neutral-400">
                  {exportType.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleExport(exportType)}
                  disabled={isExporting}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isExporting ? "Exporting..." : "Export CSV"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Exports */}
      {recentExports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Recent Exports</CardTitle>
            <CardDescription className="text-neutral-400">
              Your recent export activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentExports.map((exportJob) => (
                <div
                  key={exportJob.id}
                  className="flex items-center justify-between p-4 bg-neutral-900 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-neutral-400" />
                    <div>
                      <p className="font-medium text-white">{exportJob.name}</p>
                      <p className="text-sm text-neutral-400">{exportJob.description}</p>
                      <p className="text-xs text-neutral-500">
                        {formatDate(exportJob.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${getStatusColor(exportJob.status)}`}>
                      {exportJob.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Export Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-neutral-400">
          <div className="flex items-start space-x-2">
            <span className="text-blue-400">•</span>
            <p>All exports are generated in CSV format for easy import into Excel or other tools</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-400">•</span>
            <p>Exports include all relevant data up to the current date and time</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-400">•</span>
            <p>Personal information is included - ensure exports are handled securely</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-400">•</span>
            <p>Large datasets may take a few moments to generate and download</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}