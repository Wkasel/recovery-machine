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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Edit,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

interface ServiceArea {
  id: string;
  name: string;
  description?: string;
  zip_codes: string[];
  cities: string[];
  states: string[];
  radius_miles?: number;
  center_lat?: number;
  center_lng?: number;
  is_active: boolean;
  pricing_multiplier: number;
  travel_fee: number;
  created_at: string;
  updated_at: string;
}

export function ServiceAreaManager() {
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState<ServiceArea | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    zip_codes: "",
    cities: "",
    states: "",
    radius_miles: "",
    center_lat: "",
    center_lng: "",
    is_active: true,
    pricing_multiplier: "1.0",
    travel_fee: "0",
  });

  useEffect(() => {
    loadServiceAreas();
  }, []);

  const loadServiceAreas = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/service-areas");

      if (response.ok) {
        const data = await response.json();
        setServiceAreas(data.service_areas || []);
      } else {
        throw new Error("Failed to load service areas");
      }
    } catch (error) {
      console.error("Failed to load service areas:", error);
      toast({
        title: "Error",
        description: "Failed to load service areas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setSelectedArea(null);
    setEditMode(false);
    setFormData({
      name: "",
      description: "",
      zip_codes: "",
      cities: "",
      states: "",
      radius_miles: "",
      center_lat: "",
      center_lng: "",
      is_active: true,
      pricing_multiplier: "1.0",
      travel_fee: "0",
    });
    setDialogOpen(true);
  };

  const openEditDialog = (area: ServiceArea) => {
    setSelectedArea(area);
    setEditMode(true);
    setFormData({
      name: area.name,
      description: area.description || "",
      zip_codes: area.zip_codes.join(", "),
      cities: area.cities.join(", "),
      states: area.states.join(", "),
      radius_miles: area.radius_miles?.toString() || "",
      center_lat: area.center_lat?.toString() || "",
      center_lng: area.center_lng?.toString() || "",
      is_active: area.is_active,
      pricing_multiplier: area.pricing_multiplier.toString(),
      travel_fee: area.travel_fee.toString(),
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        zip_codes: formData.zip_codes.split(",").map((z) => z.trim()).filter(Boolean),
        cities: formData.cities.split(",").map((c) => c.trim()).filter(Boolean),
        states: formData.states.split(",").map((s) => s.trim()).filter(Boolean),
        radius_miles: formData.radius_miles ? parseFloat(formData.radius_miles) : null,
        center_lat: formData.center_lat ? parseFloat(formData.center_lat) : null,
        center_lng: formData.center_lng ? parseFloat(formData.center_lng) : null,
        pricing_multiplier: parseFloat(formData.pricing_multiplier),
        travel_fee: parseFloat(formData.travel_fee),
      };

      const url = editMode ? `/api/admin/service-areas/${selectedArea?.id}` : "/api/admin/service-areas";
      const method = editMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editMode ? "update" : "create"} service area`);
      }

      toast({
        title: "Success",
        description: `Service area ${editMode ? "updated" : "created"} successfully`,
      });

      loadServiceAreas();
      setDialogOpen(false);
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Error",
        description: `Failed to ${editMode ? "update" : "create"} service area`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (areaId: string) => {
    if (!confirm("Are you sure you want to delete this service area?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/service-areas/${areaId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete service area");
      }

      toast({
        title: "Success",
        description: "Service area deleted successfully",
      });

      loadServiceAreas();
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete service area",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const filteredAreas = serviceAreas.filter(
    (area) =>
      !searchTerm ||
      area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.cities.some((city) => city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      area.states.some((state) => state.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <span>Loading service areas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Areas</h1>
          <p className="text-gray-600">Manage service locations and coverage areas</p>
        </div>

        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service Area
        </Button>
      </div>

      {/* Controls */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search service areas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button onClick={loadServiceAreas} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Areas</p>
              <p className="text-2xl font-bold">{serviceAreas.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Areas</p>
              <p className="text-2xl font-bold">
                {serviceAreas.filter((area) => area.is_active).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Coverage</p>
              <p className="text-2xl font-bold">
                {serviceAreas.reduce((sum, area) => sum + area.cities.length, 0)} cities
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Service Areas Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Coverage</TableHead>
              <TableHead>Pricing</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAreas.map((area) => (
              <TableRow key={area.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{area.name}</div>
                    {area.description && (
                      <div className="text-sm text-gray-500">{area.description}</div>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-sm">
                    <div>{area.cities.length} cities</div>
                    <div className="text-gray-500">
                      {area.states.join(", ")} • {area.zip_codes.length} zip codes
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-sm">
                    <div>×{area.pricing_multiplier}</div>
                    {area.travel_fee > 0 && (
                      <div className="text-gray-500">
                        +{formatCurrency(area.travel_fee)} travel
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant={area.is_active ? "default" : "secondary"}>
                    {area.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(area)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(area.id)}
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

        {filteredAreas.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No service areas found matching your criteria
          </div>
        )}
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editMode ? "Edit Service Area" : "Create Service Area"}
            </DialogTitle>
            <DialogDescription>
              {editMode ? "Update service area details" : "Add a new service area"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Greater NYC Area"
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={formData.is_active ? "active" : "inactive"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, is_active: value === "active" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cities">Cities (comma-separated)</Label>
                <Input
                  id="cities"
                  value={formData.cities}
                  onChange={(e) => setFormData({ ...formData, cities: e.target.value })}
                  placeholder="New York, Brooklyn, Queens"
                />
              </div>
              <div>
                <Label htmlFor="states">States (comma-separated)</Label>
                <Input
                  id="states"
                  value={formData.states}
                  onChange={(e) => setFormData({ ...formData, states: e.target.value })}
                  placeholder="NY, NJ, CT"
                />
              </div>
              <div>
                <Label htmlFor="zip_codes">ZIP Codes (comma-separated)</Label>
                <Input
                  id="zip_codes"
                  value={formData.zip_codes}
                  onChange={(e) => setFormData({ ...formData, zip_codes: e.target.value })}
                  placeholder="10001, 10002, 10003"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pricing_multiplier">Pricing Multiplier</Label>
                <Input
                  id="pricing_multiplier"
                  type="number"
                  step="0.1"
                  value={formData.pricing_multiplier}
                  onChange={(e) =>
                    setFormData({ ...formData, pricing_multiplier: e.target.value })
                  }
                  placeholder="1.0"
                />
              </div>
              <div>
                <Label htmlFor="travel_fee">Travel Fee (cents)</Label>
                <Input
                  id="travel_fee"
                  type="number"
                  value={formData.travel_fee}
                  onChange={(e) => setFormData({ ...formData, travel_fee: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="flex-1">
                {editMode ? "Update" : "Create"} Service Area
              </Button>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}