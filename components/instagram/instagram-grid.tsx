// Instagram Grid Component - Social Proof Display
// Displays Instagram posts in a responsive grid layout

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { InstagramMedia } from "@/lib/services/instagram";
import { ExternalLink, Heart, Instagram, Loader2, MessageCircle, RefreshCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ===========================================================================
// TYPES & INTERFACES
// ===========================================================================

interface InstagramGridProps {
  count?: number;
  showCaption?: boolean;
  showEngagement?: boolean;
  columns?: 2 | 3 | 4 | 6;
  className?: string;
  useFallback?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number; // in minutes
}

interface InstagramGridState {
  posts: InstagramMedia[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// ===========================================================================
// MAIN COMPONENT
// ===========================================================================

export function InstagramGrid({
  count = 6,
  showCaption = true,
  showEngagement = false,
  columns = 3,
  className = "",
  useFallback = true,
  autoRefresh = false,
  refreshInterval = 60, // 1 hour
}: InstagramGridProps) {
  const [state, setState] = useState<InstagramGridState>({
    posts: [],
    loading: true,
    error: null,
    lastUpdated: null,
  });

  // ===========================================================================
  // DATA FETCHING
  // ===========================================================================

  const fetchInstagramPosts = async (showToast = false) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const response = await fetch(`/api/instagram/posts?count=${count}&fallback=${useFallback}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch Instagram posts");
      }

      setState({
        posts: result.data || [],
        loading: false,
        error: result.error || null,
        lastUpdated: new Date(),
      });

      if (showToast && result.data?.length > 0) {
        toast.success(`Refreshed ${result.data.length} Instagram posts`);
      }
    } catch (error) {
      console.error("Error fetching Instagram posts:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to load Instagram posts",
      }));

      if (showToast) {
        toast.error("Failed to refresh Instagram posts");
      }
    }
  };

  // ===========================================================================
  // EFFECTS
  // ===========================================================================

  useEffect(() => {
    fetchInstagramPosts();
  }, [count, useFallback]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(
      () => {
        fetchInstagramPosts();
      },
      refreshInterval * 60 * 1000
    );

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // ===========================================================================
  // HANDLERS
  // ===========================================================================

  const handleRefresh = () => {
    fetchInstagramPosts(true);
  };

  const handlePostClick = (post: InstagramMedia) => {
    // Track click for analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "instagram_post_click", {
        event_category: "social_proof",
        event_label: post.id,
      });
    }
  };

  // ===========================================================================
  // UTILITY FUNCTIONS
  // ===========================================================================

  const formatCaption = (caption: string, maxLength = 100) => {
    if (!caption) return "";
    if (caption.length <= maxLength) return caption;
    return caption.substring(0, maxLength).trim() + "...";
  };

  const getGridClass = () => {
    const baseClass = "grid gap-4";
    switch (columns) {
      case 2:
        return `${baseClass} grid-cols-1 md:grid-cols-2`;
      case 3:
        return `${baseClass} grid-cols-1 md:grid-cols-2 lg:grid-cols-3`;
      case 4:
        return `${baseClass} grid-cols-2 md:grid-cols-3 lg:grid-cols-4`;
      case 6:
        return `${baseClass} grid-cols-2 md:grid-cols-3 lg:grid-cols-6`;
      default:
        return `${baseClass} grid-cols-1 md:grid-cols-2 lg:grid-cols-3`;
    }
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  // ===========================================================================
  // LOADING STATE
  // ===========================================================================

  if (state.loading) {
    return (
      <div className={`${getGridClass()} ${className}`}>
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            {showCaption && (
              <div className="p-3">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}
          </Card>
        ))}
      </div>
    );
  }

  // ===========================================================================
  // ERROR STATE
  // ===========================================================================

  if (state.error && (!state.posts || state.posts.length === 0)) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Instagram className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Instagram Posts Unavailable</h3>
        <p className="text-muted-foreground mb-4">{state.error}</p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  // ===========================================================================
  // SUCCESS STATE
  // ===========================================================================

  return (
    <div className={className}>
      {/* Header with refresh button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Instagram className="h-5 w-5 text-pink-600" />
          <h3 className="text-lg font-semibold">Follow Our Journey</h3>
          {state.error && (
            <Badge variant="secondary" className="text-xs">
              Cached Data
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {state.lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Updated {timeAgo(state.lastUpdated.toISOString())}
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={state.loading}>
            {state.loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Instagram Grid */}
      <div className={getGridClass()}>
        {state.posts.map((post) => (
          <InstagramPost
            key={post.id}
            post={post}
            showCaption={showCaption}
            showEngagement={showEngagement}
            onClick={() => handlePostClick(post)}
          />
        ))}
      </div>

      {/* Follow button */}
      <div className="text-center mt-6">
        <Button asChild variant="outline">
          <Link
            href="https://instagram.com/recoverymachine"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram className="h-4 w-4 mr-2" />
            Follow @recoverymachine
            <ExternalLink className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

// ===========================================================================
// INDIVIDUAL POST COMPONENT
// ===========================================================================

interface InstagramPostProps {
  post: InstagramMedia;
  showCaption: boolean;
  showEngagement: boolean;
  onClick: () => void;
}

function InstagramPost({ post, showCaption, showEngagement, onClick }: InstagramPostProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    onClick();
    window.open(post.permalink, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow duration-200">
      <div className="relative aspect-square bg-muted" onClick={handleClick}>
        {!imageError ? (
          <>
            {!imageLoaded && <Skeleton className="absolute inset-0" />}
            <Image
              src={post.media_url}
              alt={post.caption || "Instagram post"}
              fill
              className={`object-cover transition-opacity duration-200 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              } group-hover:scale-105 transition-transform duration-200`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-muted/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <ExternalLink className="h-6 w-6 text-foreground" />
            </div>

            {/* Media type indicator */}
            {post.media_type === "CAROUSEL_ALBUM" && (
              <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
                Album
              </Badge>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <Instagram className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Post content */}
      {(showCaption || showEngagement) && (
        <div className="p-3">
          {showCaption && post.caption && (
            <p className="text-sm text-muted-foreground mb-2">{formatCaption(post.caption, 80)}</p>
          )}

          {showEngagement && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {post.like_count !== undefined && (
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  <span>{post.like_count}</span>
                </div>
              )}
              {post.comments_count !== undefined && (
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>{post.comments_count}</span>
                </div>
              )}
              <span className="ml-auto">{timeAgo(post.timestamp)}</span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

// ===========================================================================
// COMPACT VERSION FOR SMALLER SPACES
// ===========================================================================

export function InstagramGridCompact({
  count = 4,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <InstagramGrid
      count={count}
      showCaption={false}
      showEngagement={false}
      columns={4}
      className={className}
      useFallback={true}
    />
  );
}

// ===========================================================================
// UTILITY FUNCTION FOR FORMATTING
// ===========================================================================

function formatCaption(caption: string, maxLength: number): string {
  if (!caption) return "";
  if (caption.length <= maxLength) return caption;
  return caption.substring(0, maxLength).trim() + "...";
}

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks}w`;
}
