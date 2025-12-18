import { NextResponse } from "next/server";

// --- Types for YouTube API responses (minimal, typed subset) ---

interface YouTubeChannelListResponse {
  items?: Array<{
    contentDetails?: {
      relatedPlaylists?: {
        uploads?: string;
      };
    };
  }>;
  error?: {
    code?: number;
    message?: string;
  };
}

interface YouTubePlaylistItemsResponse {
  items?: Array<{
    contentDetails?: {
      videoId?: string;
    };
    snippet?: {
      title?: string;
      description?: string;
      publishedAt?: string;
      thumbnails?: {
        high?: { url?: string };
        maxres?: { url?: string };
        medium?: { url?: string };
      };
    };
  }>;
  nextPageToken?: string;
  pageInfo?: {
    totalResults?: number;
    resultsPerPage?: number;
  };
  error?: {
    code?: number;
    message?: string;
  };
}

interface YouTubeVideosListResponse {
  items?: Array<{
    id?: string;
    statistics?: {
      viewCount?: string;
    };
    contentDetails?: {
      duration?: string;
    };
  }>;
  error?: {
    code?: number;
    message?: string;
  };
}

// Clean video object returned to the client UI
export interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  viewCount?: string;
  duration?: string;
}

interface SuccessResponse {
  videos: YouTubeVideo[];
}

interface ErrorResponse {
  error: string;
}

// GET /api/youtube
// Fetches latest videos from the channel uploads playlist on the server.
export async function GET(): Promise<Response> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  // Fail fast but gracefully if env vars are missing in production.
  if (!apiKey) {
    return NextResponse.json<ErrorResponse>(
      {
        error:
          "YouTube API key is not configured on the server. Please set YOUTUBE_API_KEY in your environment.",
      },
      { status: 500 },
    );
  }

  if (!channelId) {
    return NextResponse.json<ErrorResponse>(
      {
        error:
          "YouTube channel ID is not configured on the server. Please set YOUTUBE_CHANNEL_ID in your environment.",
      },
      { status: 500 },
    );
  }

  try {
    // 1) Look up the channel to get the uploads playlist ID
    const channelUrl = new URL(
      "https://www.googleapis.com/youtube/v3/channels",
    );
    channelUrl.searchParams.set("part", "contentDetails");
    channelUrl.searchParams.set("id", channelId);
    channelUrl.searchParams.set("key", apiKey);

    const channelRes = await fetch(channelUrl.toString(), {
      // Cache a bit on the edge to reduce quota usage
      next: { revalidate: 300 },
    });

    if (!channelRes.ok) {
      return NextResponse.json<ErrorResponse>(
        {
          error: `YouTube channels.list request failed with status ${channelRes.status}`,
        },
        { status: 502 },
      );
    }

    const channelData = (await channelRes.json()) as YouTubeChannelListResponse;

    if (channelData.error) {
      const message =
        channelData.error.message ??
        "Unknown error from YouTube channels.list API.";
      return NextResponse.json<ErrorResponse>(
        { error: message },
        { status: 502 },
      );
    }

    const uploadsPlaylistId =
      channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      return NextResponse.json<ErrorResponse>(
        {
          error:
            "Channel uploads playlist not found. Please verify the channel ID and that the channel has uploaded videos.",
        },
        { status: 404 },
      );
    }

    // 2) Fetch videos from the uploads playlist. We request up to 50 items in one call
    // to keep within quota without implementing pagination in the UI.
    const playlistUrl = new URL(
      "https://www.googleapis.com/youtube/v3/playlistItems",
    );
    playlistUrl.searchParams.set("part", "snippet,contentDetails");
    playlistUrl.searchParams.set("playlistId", uploadsPlaylistId);
    playlistUrl.searchParams.set("maxResults", "50");
    playlistUrl.searchParams.set("key", apiKey);

    const playlistRes = await fetch(playlistUrl.toString(), {
      next: { revalidate: 120 },
    });

    if (!playlistRes.ok) {
      return NextResponse.json<ErrorResponse>(
        {
          error: `YouTube playlistItems.list request failed with status ${playlistRes.status}`,
        },
        { status: 502 },
      );
    }

    const playlistData =
      (await playlistRes.json()) as YouTubePlaylistItemsResponse;

    if (playlistData.error) {
      const message =
        playlistData.error.message ??
        "Unknown error from YouTube playlistItems.list API.";
      return NextResponse.json<ErrorResponse>(
        { error: message },
        { status: 502 },
      );
    }

    const items = playlistData.items ?? [];

    if (!items.length) {
      return NextResponse.json<SuccessResponse>({ videos: [] }, { status: 200 });
    }

    // 3) Fetch video statistics and duration for all videos
    const videoIds = items
      .map((item) => item.contentDetails?.videoId)
      .filter((id): id is string => !!id)
      .join(",");

    const videosUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
    videosUrl.searchParams.set("part", "statistics,contentDetails");
    videosUrl.searchParams.set("id", videoIds);
    videosUrl.searchParams.set("key", apiKey);

    const videosRes = await fetch(videosUrl.toString(), {
      next: { revalidate: 120 },
    });

    if (!videosRes.ok) {
      return NextResponse.json<ErrorResponse>(
        {
          error: `YouTube videos.list request failed with status ${videosRes.status}`,
        },
        { status: 502 },
      );
    }

    const videosData = (await videosRes.json()) as YouTubeVideosListResponse;

    if (videosData.error) {
      const message =
        videosData.error.message ??
        "Unknown error from YouTube videos.list API.";
      return NextResponse.json<ErrorResponse>(
        { error: message },
        { status: 502 },
      );
    }

    // Create a map of videoId -> statistics/duration for quick lookup
    const videoStatsMap = new Map<
      string,
      { viewCount?: string; duration?: string }
    >();
    videosData.items?.forEach((item) => {
      if (item.id) {
        videoStatsMap.set(item.id, {
          viewCount: item.statistics?.viewCount,
          duration: item.contentDetails?.duration,
        });
      }
    });

    // 4) Map to clean objects for the UI, combining playlist data with statistics
    const videos: YouTubeVideo[] = items
      .map((item) => {
        const videoId = item.contentDetails?.videoId;
        const snippet = item.snippet;
        if (!videoId || !snippet) return null;

        const thumbnail =
          snippet.thumbnails?.maxres?.url ||
          snippet.thumbnails?.high?.url ||
          snippet.thumbnails?.medium?.url ||
          "";

        const stats = videoStatsMap.get(videoId);

        const video: YouTubeVideo = {
          videoId,
          title: snippet.title ?? "Untitled video",
          description: snippet.description ?? "",
          thumbnail,
          publishedAt: snippet.publishedAt ?? new Date().toISOString(),
          viewCount: stats?.viewCount,
          duration: stats?.duration,
        };
        return video;
      })
      .filter((v): v is YouTubeVideo => v !== null);

    return NextResponse.json<SuccessResponse>({ videos }, { status: 200 });
  } catch (error) {
    console.error("YouTube API server error:", error);
    return NextResponse.json<ErrorResponse>(
      {
        error:
          "Failed to load YouTube videos. Please try again later or contact support if the issue persists.",
      },
      { status: 500 },
    );
  }
}
