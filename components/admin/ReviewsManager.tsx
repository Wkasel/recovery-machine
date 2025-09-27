"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Calendar, Eye, EyeOff, MessageSquare, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Review {
  id: string;
  user_id: string;
  booking_id: string;
  rating: number;
  comment: string;
  google_synced: boolean;
  is_featured: boolean;
  reviewer_name: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    email: string;
    phone?: string;
  };
  bookings?: {
    date_time: string;
    add_ons: any;
  };
}

export default function ReviewsManager() {
  const supabase = createBrowserSupabaseClient();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [filterStatus]);

  const loadReviews = async () => {
    try {
      let query = supabase
        .from("reviews")
        .select(`
          *,
          profiles!reviews_user_id_fkey (
            email,
            phone
          ),
          bookings!reviews_booking_id_fkey (
            date_time,
            add_ons
          )
        `)
        .order("created_at", { ascending: false });

      if (filterStatus === "featured") {
        query = query.eq("is_featured", true);
      } else if (filterStatus === "synced") {
        query = query.eq("google_synced", true);
      }

      const { data, error } = await query;

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Error loading reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFeatured = async (reviewId: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ is_featured: !currentValue })
        .eq("id", reviewId);

      if (error) throw error;

      toast.success(`Review ${!currentValue ? "featured" : "unfeatured"} successfully`);
      loadReviews();
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review");
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const { error } = await supabase.from("reviews").delete().eq("id", reviewId);

      if (error) throw error;

      toast.success("Review deleted successfully");
      loadReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  const getServiceName = (addOns: any) => {
    if (addOns?.serviceType === "cold_plunge") return "Cold Plunge";
    if (addOns?.serviceType === "infrared_sauna") return "Infrared Sauna";
    if (addOns?.serviceType === "combo_package") return "Ultimate Recovery Combo";
    return "Recovery Session";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-600 animate-pulse rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-gray-600 animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-400 mr-3" />
              <div>
                <p className="text-2xl font-bold text-white">{reviews.length}</p>
                <p className="text-xs text-neutral-400">Total Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-400 mr-3 fill-current" />
              <div>
                <p className="text-2xl font-bold text-white">{averageRating}</p>
                <p className="text-xs text-neutral-400">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-blue-400 mr-3" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {reviews.filter(r => r.is_featured).length}
                </p>
                <p className="text-xs text-neutral-400">Featured</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-green-400 mr-3" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {reviews.filter(r => r.google_synced).length}
                </p>
                <p className="text-xs text-neutral-400">Google Synced</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[200px] bg-neutral-900 border-neutral-700 text-white">
            <SelectValue placeholder="Filter reviews" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-900 border-neutral-700">
            <SelectItem value="all">All Reviews</SelectItem>
            <SelectItem value="featured">Featured Only</SelectItem>
            <SelectItem value="synced">Google Synced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-white">
                        {getServiceName(review.bookings?.add_ons)}
                      </h4>
                      {review.is_featured && (
                        <Badge variant="warning">Featured</Badge>
                      )}
                      {review.google_synced && (
                        <Badge variant="secondary">Google Synced</Badge>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-neutral-400 mb-3">
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                        <span className="ml-2">{review.rating} stars</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(review.created_at)}</span>
                      </div>
                      <span>by {review.reviewer_name}</span>
                    </div>

                    {review.comment && (
                      <div className="bg-neutral-900 p-4 rounded-lg mb-3">
                        <p className="text-neutral-300 italic">"{review.comment}"</p>
                      </div>
                    )}

                    <div className="text-sm text-neutral-500">
                      Customer: {review.profiles?.email || "Unknown"}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleFeatured(review.id, review.is_featured)}
                      className={review.is_featured ? "" : ""}
                      variant={review.is_featured ? "warning" : "outline"}
                    >
                      {review.is_featured ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteReview(review.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-neutral-600" />
              <h3 className="text-lg font-medium text-white mb-2">No reviews found</h3>
              <p className="text-neutral-400">
                {filterStatus === "all" 
                  ? "No customer reviews have been submitted yet." 
                  : `No reviews match the current filter: ${filterStatus}`}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}