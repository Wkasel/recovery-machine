// @ts-nocheck// Instagram Posts API Route
// Fetches Instagram posts with caching and fallback support

import {
  getFeaturedInstagramPosts,
  getInstagramCacheStatus,
  getInstagramDataWithFallback,
  getRecoveryRelatedPosts,
  refreshInstagramCache,
  testInstagramConnection,
} from "@/lib/services/instagram";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "posts";
    const count = parseInt(searchParams.get("count") || "6");
    const useFallback = searchParams.get("fallback") !== "false";

    switch (action) {
      case "posts":
        const result = await getInstagramDataWithFallback(count, useFallback);
        return NextResponse.json({
          success: result.success,
          data: result.data,
          error: result.error,
        });

      case "featured":
        const featuredResult = await getFeaturedInstagramPosts(count);
        return NextResponse.json({
          success: featuredResult.success,
          data: featuredResult.data,
          error: featuredResult.error,
        });

      case "recovery":
        const recoveryResult = await getRecoveryRelatedPosts(count);
        return NextResponse.json({
          success: recoveryResult.success,
          data: recoveryResult.data,
          error: recoveryResult.error,
        });

      case "cache-status":
        const cacheStatus = getInstagramCacheStatus();
        return NextResponse.json({
          success: true,
          data: cacheStatus,
        });

      case "test-connection":
        const testResult = await testInstagramConnection();
        return NextResponse.json({
          success: testResult.success,
          data: testResult.data,
          error: testResult.error,
        });

      default:
        return NextResponse.json({ error: "Invalid action parameter" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in Instagram posts API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "refresh-cache") {
      const result = await refreshInstagramCache();
      return NextResponse.json({
        success: result.success,
        data: result.data,
        error: result.error,
        message: result.success ? "Cache refreshed successfully" : "Failed to refresh cache",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error in Instagram posts POST:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
