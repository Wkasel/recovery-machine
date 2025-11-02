"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useToast } from "@/lib/hooks/use-toast";
import { Shield, UserPlus, RefreshCw, UserX } from "lucide-react";
import { useEffect, useState } from "react";

interface Admin {
  id: string;
  email: string;
  role: "super_admin" | "admin" | "operator";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function AdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<"admin" | "operator">("admin");
  const { toast } = useToast();

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/admins");

      if (response.ok) {
        const data = await response.json();
        setAdmins(data.admins || []);
      } else {
        throw new Error("Failed to load admins");
      }
    } catch (error) {
      console.error("Failed to load admins:", error);
      toast({
        title: "Error",
        description: "Failed to load admin users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAdmin = async () => {
    if (!newAdminEmail || !newAdminRole) return;

    try {
      const response = await fetch("/api/admin/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: newAdminEmail,
          role: newAdminRole,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create admin");
      }

      toast({
        title: "Success",
        description: `Admin ${newAdminEmail} created successfully`,
      });

      setDialogOpen(false);
      setNewAdminEmail("");
      setNewAdminRole("admin");
      loadAdmins();
    } catch (error) {
      console.error("Failed to create admin:", error);
      toast({
        title: "Error",
        description: "Failed to create admin user",
        variant: "destructive",
      });
    }
  };

  const toggleAdminStatus = async (adminId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/admins/${adminId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_active: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update admin status");
      }

      toast({
        title: "Success",
        description: `Admin ${!currentStatus ? "activated" : "deactivated"} successfully`,
      });

      loadAdmins();
    } catch (error) {
      console.error("Failed to update admin:", error);
      toast({
        title: "Error",
        description: "Failed to update admin status",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-destructive/10 text-destructive border-red-300";
      case "admin":
        return "bg-primary/10 text-blue-800 border-blue-300";
      case "operator":
        return "bg-primary/10 text-green-800 border-green-300";
      default:
        return "bg-muted text-foreground border-border";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Admin Management</h2>
          <p className="text-muted-foreground">Manage admin users and their permissions</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Admin</DialogTitle>
              <DialogDescription>
                Create a new admin user with specific role and permissions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newAdminRole} onValueChange={(value: any) => setNewAdminRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="operator">Operator</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Admin: Full access to all features
                  <br />
                  Operator: Limited access to bookings and users
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createAdmin} disabled={!newAdminEmail}>
                  Create Admin
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-accent/50 transition-colors border-border">
              <TableHead className="text-foreground font-semibold">Email</TableHead>
              <TableHead className="text-foreground font-semibold">Role</TableHead>
              <TableHead className="text-foreground font-semibold">Status</TableHead>
              <TableHead className="text-foreground font-semibold">Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    {admin.email}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getRoleBadgeColor(admin.role)}>
                    {admin.role.replace("_", " ").toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={admin.is_active ? "default" : "secondary"}>
                    {admin.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(admin.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  {admin.role !== "super_admin" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAdminStatus(admin.id, admin.is_active)}
                    >
                      <UserX className="h-4 w-4 mr-2" />
                      {admin.is_active ? "Deactivate" : "Activate"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {admins.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No admin users found. Click "Add Admin" to create one.
        </div>
      )}
    </div>
  );
}
