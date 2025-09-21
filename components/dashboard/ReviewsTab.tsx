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
import { Textarea } from "@/components/ui/textarea";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { Calendar, Edit, MessageSquare, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface BookingForReview {
  id: string;
  date_time: string;
  duration: number;
  add_ons: any;
  status: string;
  location_address: any;
}

interface Review {
  id: string;
  booking_id: string;
  rating: number;
  comment: string;
  google_synced: boolean;
  is_featured: boolean;
  reviewer_name: string;
  created_at: string;
  updated_at: string;
  booking?: BookingForReview;
}

interface ReviewsTabProps {
  user: User;
}

export function ReviewsTab({ user }: ReviewsTabProps) {
  const supabase = createBrowserSupabaseClient();
  const [pendingBookings, setPendingBookings] = useState<BookingForReview[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingForReview | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  useEffect(() => {
    loadReviewData();
  }, [user.id]);

  const loadReviewData = async () => {
    try {
      // Load completed bookings without reviews
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select("id, date_time, duration, add_ons, status, location_address")
        .eq("user_id", user.id)
        .eq("status", "completed")
        .order("date_time", { ascending: false });

      if (bookingsError) throw bookingsError;

      // Load existing reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select(
          `
          *,
          bookings!inner (
            id,
            date_time,
            duration,
            add_ons,
            status,
            location_address
          )
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (reviewsError) throw reviewsError;

      // Filter out bookings that already have reviews
      const reviewedBookingIds = new Set(reviewsData?.map((r) => r.booking_id) || []);
      const pendingReviews =
        bookingsData?.filter((booking) => !reviewedBookingIds.has(booking.id)) || [];

      setPendingBookings(pendingReviews);
      setReviews(reviewsData || []);
    } catch (error) {
      console.error("Error loading review data:", error);
      toast.error("Failed to load review data");
    } finally {
      setIsLoading(false);
    }
  };

  const submitReview = async () => {
    if (!selectedBooking || rating === 0) {
      toast.error("Please provide a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData = {
        user_id: user.id,
        booking_id: selectedBooking.id,
        rating,
        comment: comment.trim(),
        reviewer_name: reviewerName.trim() || user.user_metadata?.full_name || "Anonymous",
        google_synced: false,
        is_featured: false,
      };

      if (editingReview) {
        // Update existing review
        const { error } = await supabase
          .from("reviews")
          .update({
            rating,
            comment: comment.trim(),
            reviewer_name: reviewerName.trim() || editingReview.reviewer_name,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingReview.id);

        if (error) throw error;
        toast.success("Review updated successfully!");
      } else {
        // Create new review
        const { error } = await supabase.from("reviews").insert(reviewData);

        if (error) throw error;
        toast.success("Review submitted successfully!");
      }

      resetForm();
      loadReviewData();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase.from("reviews").delete().eq("id", reviewId);

      if (error) throw error;

      toast.success("Review deleted successfully");
      loadReviewData();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  const resetForm = () => {
    setReviewDialogOpen(false);
    setSelectedBooking(null);
    setEditingReview(null);
    setRating(0);
    setComment("");
    setReviewerName("");
  };

  const openReviewDialog = (booking: BookingForReview, existingReview?: Review) => {
    setSelectedBooking(booking);
    setEditingReview(existingReview || null);
    setRating(existingReview?.rating || 0);
    setComment(existingReview?.comment || "");
    setReviewerName(existingReview?.reviewer_name || user.user_metadata?.full_name || "");
    setReviewDialogOpen(true);
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
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (
    rating: number,
    size: "sm" | "md" | "lg" = "md",
    interactive: boolean = false
  ) => {
    const starSize = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    }[size];

    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={interactive ? () => setRating(star) : undefined}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 animate-pulse rounded w-1/3"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Reviews & Feedback</h2>
        <p className="text-gray-300 mt-1">Rate your recovery sessions and share your experience</p>
      </div>

      {/* Pending Reviews */}
      {pendingBookings.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">Pending Reviews</CardTitle>
            <CardDescription className="text-blue-700">
              Help others by sharing your experience with these completed sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg border"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-white">{getServiceName(booking.add_ons)}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-300 mt-1">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(booking.date_time)}</span>
                    </div>
                    <span>{booking.duration} minutes</span>
                  </div>
                </div>
                <Button onClick={() => openReviewDialog(booking)}>
                  <Star className="w-4 h-4 mr-2" />
                  Write Review
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Existing Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Your Reviews</CardTitle>
          <CardDescription>Your feedback helps improve our service</CardDescription>
        </CardHeader>
        <CardContent>
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-white">
                          {getServiceName(review.booking?.add_ons)}
                        </h4>
                        {review.is_featured && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            Featured
                          </Badge>
                        )}
                        {review.google_synced && (
                          <Badge variant="secondary">Synced to Google</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-300">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {review.booking?.date_time
                              ? formatDate(review.booking.date_time)
                              : "N/A"}
                          </span>
                        </div>
                        <span>Reviewed {formatDate(review.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openReviewDialog(review.booking!, review)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => deleteReview(review.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-300">{review.rating} out of 5 stars</span>
                    </div>

                    {review.comment && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 italic">"{review.comment}"</p>
                        <p className="text-sm text-gray-500 mt-2">- {review.reviewer_name}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-white mb-2">No reviews yet</h3>
              <p className="text-gray-300">Complete a session to leave your first review</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={() => !isSubmitting && resetForm()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingReview ? "Edit Review" : "Write a Review"}</DialogTitle>
            <DialogDescription>
              {selectedBooking && (
                <>
                  {getServiceName(selectedBooking.add_ons)} on{" "}
                  {formatDate(selectedBooking.date_time)}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
              {renderStars(rating, "lg", true)}
            </div>

            <div>
              <label
                htmlFor="reviewer-name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Display Name
              </label>
              <input
                id="reviewer-name"
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="Your name for the review"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Comment (Optional)
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this session..."
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={resetForm} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={submitReview} disabled={isSubmitting || rating === 0}>
              {isSubmitting ? "Submitting..." : editingReview ? "Update Review" : "Submit Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
