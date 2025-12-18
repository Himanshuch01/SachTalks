// Serverless function for YouTube videos on Vercel.
// This is a classic Vercel API route (not Next App Router) so
// it works with the current Vite + React Router setup.

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

export default async function handler(req: any, res: any) {
  // Only allow GET for safety
  if (req.method && req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res
      .status(405)
      .json({ error: "Method not allowed. Use GET /api/youtube" });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey) {
    const body: ErrorResponse = {
      error:
        "YouTube API key is not configured on the server. Please set YOUTUBE_API_KEY.",
    };
    return res.status(500).json(body);
  }

  if (!channelId) {
    const body: ErrorResponse = {
      error:
        "YouTube channel ID is not configured on the server. Please set YOUTUBE_CHANNEL_ID.",
    };
    return res.status(500).json(body);
  }

  try {
    // 1) Fetch channel to get uploads playlist ID
    const channelUrl = new URL(
      "https://www.googleapis.com/youtube/v3/channels",
    );
    channelUrl.searchParams.set("part", "contentDetails");
    channelUrl.searchParams.set("id", channelId);
    channelUrl.searchParams.set("key", apiKey);

    const channelRes = await fetch(channelUrl.toString());

    if (!channelRes.ok) {
      const body: ErrorResponse = {
        error: `YouTube channels.list request failed with status ${channelRes.status}`,
      };
      return res.status(502).json(body);
    }

    const channelData = (await channelRes.json()) as YouTubeChannelListResponse;

    if (channelData.error) {
      const message =
        channelData.error.message ??
        "Unknown error from YouTube channels.list API.";
      const body: ErrorResponse = { error: message };
      return res.status(502).json(body);
    }

    const uploadsPlaylistId =
      channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      const body: ErrorResponse = {
        error:
          "Channel uploads playlist not found. Please verify the channel ID and that the channel has uploaded videos.",
      };
      return res.status(404).json(body);
    }

    // 2) Fetch up to 50 items from the uploads playlist
    const playlistUrl = new URL(
      "https://www.googleapis.com/youtube/v3/playlistItems",
    );
    playlistUrl.searchParams.set("part", "snippet,contentDetails");
    playlistUrl.searchParams.set("playlistId", uploadsPlaylistId);
    playlistUrl.searchParams.set("maxResults", "50");
    playlistUrl.searchParams.set("key", apiKey);

    const playlistRes = await fetch(playlistUrl.toString());

    if (!playlistRes.ok) {
      const body: ErrorResponse = {
        error: `YouTube playlistItems.list request failed with status ${playlistRes.status}`,
      };
      return res.status(502).json(body);
    }

    const playlistData =
      (await playlistRes.json()) as YouTubePlaylistItemsResponse;

    if (playlistData.error) {
      const message =
        playlistData.error.message ??
        "Unknown error from YouTube playlistItems.list API.";
      const body: ErrorResponse = { error: message };
      return res.status(502).json(body);
    }

    const items = playlistData.items ?? [];

    if (!items.length) {
      const body: SuccessResponse = { videos: [] };
      return res.status(200).json(body);
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

    const videosRes = await fetch(videosUrl.toString());

    if (!videosRes.ok) {
      const body: ErrorResponse = {
        error: `YouTube videos.list request failed with status ${videosRes.status}`,
      };
      return res.status(502).json(body);
    }

    const videosData = (await videosRes.json()) as YouTubeVideosListResponse;

    if (videosData.error) {
      const message =
        videosData.error.message ??
        "Unknown error from YouTube videos.list API.";
      const body: ErrorResponse = { error: message };
      return res.status(502).json(body);
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

    // 4) Combine playlist data with statistics
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

    const body: SuccessResponse = { videos };
    return res.status(200).json(body);
  } catch (error) {
    console.error("YouTube API server error:", error);
    const body: ErrorResponse = {
      error:
        "Failed to load YouTube videos. Please try again later or contact support if the issue persists.",
    };
    return res.status(500).json(body);
  }
}
