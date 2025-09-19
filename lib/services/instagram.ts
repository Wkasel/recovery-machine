// Instagram Service - Basic Display API Integration for Social Proof
// Automated Instagram content fetching with caching for Recovery Machine

import type { ApiResponse } from '@/lib/types/supabase';

// ===========================================================================
// CONFIGURATION & TYPES
// ===========================================================================

export interface InstagramMedia {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  username?: string;
  like_count?: number;
  comments_count?: number;
}

export interface InstagramUser {
  id: string;
  username: string;
  account_type: string;
  media_count: number;
}

export interface InstagramCacheEntry {
  data: InstagramMedia[];
  cached_at: string;
  expires_at: string;
}

// Cache duration in milliseconds (1 hour)
const CACHE_DURATION = 60 * 60 * 1000;

// In-memory cache (in production, use Redis or similar)
let instagramCache: InstagramCacheEntry | null = null;

// ===========================================================================
// INSTAGRAM API FUNCTIONS
// ===========================================================================

export async function getInstagramAccessToken(): Promise<string | null> {
  // In production, you'd refresh the token automatically
  return process.env.INSTAGRAM_ACCESS_TOKEN || null;
}

export async function fetchInstagramUser(): Promise<ApiResponse<InstagramUser>> {
  try {
    const accessToken = await getInstagramAccessToken();
    if (!accessToken) {
      throw new Error('Instagram access token not configured');
    }

    const response = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`Instagram API error: ${data.error.message}`);
    }

    return {
      data,
      error: null,
      success: true
    };
  } catch (error) {
    console.error('Error fetching Instagram user:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch Instagram user',
      success: false
    };
  }
}

export async function fetchInstagramMedia(
  limit: number = 12,
  useCache: boolean = true
): Promise<ApiResponse<InstagramMedia[]>> {
  try {
    // Check cache first
    if (useCache && instagramCache) {
      const now = new Date();
      const expiresAt = new Date(instagramCache.expires_at);
      
      if (now < expiresAt) {
        return {
          data: instagramCache.data.slice(0, limit),
          error: null,
          success: true
        };
      }
    }

    const accessToken = await getInstagramAccessToken();
    if (!accessToken) {
      throw new Error('Instagram access token not configured');
    }

    // Fetch media from Instagram
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink,caption,timestamp,username&limit=${Math.min(limit, 25)}&access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    if (result.error) {
      throw new Error(`Instagram API error: ${result.error.message}`);
    }

    const media: InstagramMedia[] = result.data || [];

    // Filter out videos for better performance (optional)
    const filteredMedia = media.filter(item => 
      item.media_type === 'IMAGE' || item.media_type === 'CAROUSEL_ALBUM'
    );

    // Update cache
    if (useCache) {
      const now = new Date();
      instagramCache = {
        data: filteredMedia,
        cached_at: now.toISOString(),
        expires_at: new Date(now.getTime() + CACHE_DURATION).toISOString()
      };
    }

    return {
      data: filteredMedia.slice(0, limit),
      error: null,
      success: true
    };
  } catch (error) {
    console.error('Error fetching Instagram media:', error);
    
    // Fallback to cache if available
    if (instagramCache && instagramCache.data.length > 0) {
      console.log('Falling back to cached Instagram data');
      return {
        data: instagramCache.data.slice(0, limit),
        error: `API error, showing cached data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        success: true
      };
    }

    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch Instagram media',
      success: false
    };
  }
}

export async function getInstagramMediaDetails(mediaId: string): Promise<ApiResponse<InstagramMedia>> {
  try {
    const accessToken = await getInstagramAccessToken();
    if (!accessToken) {
      throw new Error('Instagram access token not configured');
    }

    const response = await fetch(
      `https://graph.instagram.com/${mediaId}?fields=id,media_type,media_url,thumbnail_url,permalink,caption,timestamp,username&access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`Instagram API error: ${data.error.message}`);
    }

    return {
      data,
      error: null,
      success: true
    };
  } catch (error) {
    console.error('Error fetching Instagram media details:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch media details',
      success: false
    };
  }
}

// ===========================================================================
// CURATED CONTENT FUNCTIONS
// ===========================================================================

export async function getFeaturedInstagramPosts(
  count: number = 6
): Promise<ApiResponse<InstagramMedia[]>> {
  try {
    const result = await fetchInstagramMedia(count * 2); // Fetch more to filter
    
    if (!result.success || !result.data) {
      return result;
    }

    // Filter for high-quality posts (you can customize this logic)
    const featuredPosts = result.data
      .filter(post => {
        // Filter criteria for featured posts
        const hasGoodCaption = post.caption && post.caption.length > 50;
        const isRecent = new Date(post.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
        return hasGoodCaption || isRecent;
      })
      .slice(0, count);

    return {
      data: featuredPosts,
      error: null,
      success: true
    };
  } catch (error) {
    console.error('Error getting featured Instagram posts:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to get featured posts',
      success: false
    };
  }
}

export async function getRecoveryRelatedPosts(
  count: number = 8
): Promise<ApiResponse<InstagramMedia[]>> {
  try {
    const result = await fetchInstagramMedia(25); // Fetch more to filter
    
    if (!result.success || !result.data) {
      return result;
    }

    // Filter for recovery-related keywords
    const recoveryKeywords = [
      'recovery', 'massage', 'therapy', 'wellness', 'muscle', 'stretch',
      'relax', 'healing', 'treatment', 'health', 'fitness', 'pain relief'
    ];

    const recoveryPosts = result.data
      .filter(post => {
        if (!post.caption) return false;
        
        const caption = post.caption.toLowerCase();
        return recoveryKeywords.some(keyword => caption.includes(keyword));
      })
      .slice(0, count);

    return {
      data: recoveryPosts,
      error: null,
      success: true
    };
  } catch (error) {
    console.error('Error getting recovery-related posts:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to get recovery posts',
      success: false
    };
  }
}

// ===========================================================================
// CACHE MANAGEMENT
// ===========================================================================

export function clearInstagramCache(): void {
  instagramCache = null;
}

export function getInstagramCacheStatus(): {
  cached: boolean;
  cachedAt?: string;
  expiresAt?: string;
  itemCount?: number;
} {
  if (!instagramCache) {
    return { cached: false };
  }

  return {
    cached: true,
    cachedAt: instagramCache.cached_at,
    expiresAt: instagramCache.expires_at,
    itemCount: instagramCache.data.length
  };
}

export async function refreshInstagramCache(): Promise<ApiResponse<InstagramMedia[]>> {
  clearInstagramCache();
  return fetchInstagramMedia(25, true);
}

// ===========================================================================
// FALLBACK DATA FOR DEVELOPMENT
// ===========================================================================

export function getMockInstagramData(): InstagramMedia[] {
  return [
    {
      id: 'mock_1',
      media_type: 'IMAGE',
      media_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      permalink: '#',
      caption: 'Professional massage therapy session with Recovery Machine! 💆‍♀️ #recovery #massage #wellness',
      timestamp: new Date().toISOString(),
      username: 'recoverymachine'
    },
    {
      id: 'mock_2',
      media_type: 'IMAGE',
      media_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop',
      permalink: '#',
      caption: 'Theragun percussion therapy for muscle recovery 🔥 #theragun #recovery #fitness',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      username: 'recoverymachine'
    },
    {
      id: 'mock_3',
      media_type: 'IMAGE',
      media_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop',
      permalink: '#',
      caption: 'Compression therapy with Normatec boots 🦵 Amazing results! #normatec #compression #therapy',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      username: 'recoverymachine'
    },
    {
      id: 'mock_4',
      media_type: 'IMAGE',
      media_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      permalink: '#',
      caption: 'Relaxation and muscle relief at home 🏠 Perfect after workout! #homerecovery #wellness',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      username: 'recoverymachine'
    },
    {
      id: 'mock_5',
      media_type: 'IMAGE',
      media_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      permalink: '#',
      caption: 'Professional equipment, professional results 💪 #professional #recovery #equipment',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      username: 'recoverymachine'
    },
    {
      id: 'mock_6',
      media_type: 'IMAGE',
      media_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop',
      permalink: '#',
      caption: 'Customer testimonial: "Best recovery session ever!" ⭐⭐⭐⭐⭐ #testimonial #5stars',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      username: 'recoverymachine'
    }
  ];
}

export async function getInstagramDataWithFallback(
  count: number = 6,
  useFallback: boolean = true
): Promise<ApiResponse<InstagramMedia[]>> {
  try {
    // Try to fetch real data first
    const result = await fetchInstagramMedia(count);
    
    if (result.success && result.data && result.data.length > 0) {
      return result;
    }

    // Fallback to mock data if enabled and real data fails
    if (useFallback) {
      console.log('Using fallback Instagram data');
      return {
        data: getMockInstagramData().slice(0, count),
        error: 'Using fallback data - Instagram API not available',
        success: true
      };
    }

    return result;
  } catch (error) {
    console.error('Error getting Instagram data:', error);
    
    if (useFallback) {
      return {
        data: getMockInstagramData().slice(0, count),
        error: `Error fetching Instagram data, using fallback: ${error instanceof Error ? error.message : 'Unknown error'}`,
        success: true
      };
    }

    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch Instagram data',
      success: false
    };
  }
}

// ===========================================================================
// UTILITY FUNCTIONS
// ===========================================================================

export function formatInstagramCaption(caption: string, maxLength: number = 100): string {
  if (!caption) return '';
  
  if (caption.length <= maxLength) return caption;
  
  return caption.substring(0, maxLength).trim() + '...';
}

export function extractHashtags(caption: string): string[] {
  if (!caption) return [];
  
  const hashtagRegex = /#[\w]+/g;
  const matches = caption.match(hashtagRegex);
  
  return matches ? matches.map(tag => tag.substring(1)) : [];
}

export function isInstagramConfigured(): boolean {
  return !!(
    process.env.INSTAGRAM_ACCESS_TOKEN &&
    process.env.NEXT_PUBLIC_INSTAGRAM_USER_ID
  );
}

export function getInstagramProfileUrl(): string {
  const userId = process.env.NEXT_PUBLIC_INSTAGRAM_USER_ID;
  return userId ? `https://instagram.com/${userId}` : '#';
}

// ===========================================================================
// TESTING FUNCTIONS
// ===========================================================================

export async function testInstagramConnection(): Promise<ApiResponse<{ status: string; user?: InstagramUser }>> {
  try {
    if (!isInstagramConfigured()) {
      return {
        data: { status: 'not_configured' },
        error: 'Instagram API credentials not configured',
        success: false
      };
    }

    const userResult = await fetchInstagramUser();
    
    if (!userResult.success) {
      return {
        data: { status: 'connection_failed' },
        error: userResult.error,
        success: false
      };
    }

    return {
      data: { 
        status: 'connected',
        user: userResult.data 
      },
      error: null,
      success: true
    };
  } catch (error) {
    console.error('Error testing Instagram connection:', error);
    return {
      data: { status: 'error' },
      error: error instanceof Error ? error.message : 'Connection test failed',
      success: false
    };
  }
}