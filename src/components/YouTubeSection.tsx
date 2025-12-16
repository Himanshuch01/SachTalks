import { useState, useEffect } from "react";
import { ExternalLink, Play, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  views: string;
  duration: string;
  date: string;
}

const YouTubeSection = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [featuredVideoId, setFeaturedVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try Supabase function first, fallback to direct API
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      
      if (supabaseUrl) {
        try {
          const headers: HeadersInit = {
            'Content-Type': 'application/json',
          };
          
          if (supabaseAnonKey) {
            headers['apikey'] = supabaseAnonKey;
          }
          
          const response = await fetch(
            `${supabaseUrl}/functions/v1/youtube-videos?maxResults=6`,
            { headers }
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data.videos && data.videos.length > 0) {
              setVideos(data.videos);
              setFeaturedVideoId(data.videos[0]?.id ?? null);
              setLoading(false);
              return;
            }
          } else {
            const errorData = await response.json().catch(() => ({}));
            console.log("Supabase function error:", errorData);
          }
        } catch (err) {
          console.log("Supabase function failed, trying direct API:", err);
        }
      }

      // Fallback to direct YouTube API
      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined;
      const channelId = "UCQTJfE6cW4s3qVGg9UJiK5g";

      if (!apiKey) {
        throw new Error("YouTube API key not configured");
      }

      // Get uploads playlist from channel - try by ID first, then by handle
      let channelData: any = null;
      let uploadsPlaylistId: string | null = null;

      // Try fetching by channel ID
      const channelResById = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
      );
      channelData = await channelResById.json();

      if (channelData.error) {
        console.error("YouTube API error:", channelData.error);
        throw new Error(channelData.error.message || "Failed to fetch channel details");
      }

      // If channel not found by ID, try by handle
      if (!channelData.items || channelData.items.length === 0) {
        console.log("Channel not found by ID, trying by handle...");
        const channelHandle = "SachTalksOfficial"; // Without @
        const channelResByHandle = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${channelHandle}&key=${apiKey}`
        );
        channelData = await channelResByHandle.json();

        if (channelData.error) {
          console.error("YouTube API error (by handle):", channelData.error);
          throw new Error(channelData.error.message || "Failed to fetch channel details");
        }
      }

      if (!channelData.items || channelData.items.length === 0) {
        console.error("Channel data:", channelData);
        throw new Error("Channel not found. Please check the channel ID or handle.");
      }

      uploadsPlaylistId =
        channelData.items[0]?.contentDetails?.relatedPlaylists?.uploads;

      if (!uploadsPlaylistId) {
        console.error("Channel data structure:", channelData.items[0]);
        throw new Error("Channel uploads playlist not found. The channel may not have any videos.");
      }

      console.log("Found uploads playlist ID:", uploadsPlaylistId);

      const videosRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=6&key=${apiKey}`
      );
      const videosData = await videosRes.json();

      if (videosData.error) {
        throw new Error(videosData.error.message || "Failed to fetch videos from YouTube API");
      }

      if (!videosData.items || videosData.items.length === 0) {
        setVideos([]);
        setLoading(false);
        return;
      }

      const videoIds = videosData.items
        .map((item: any) => item.contentDetails.videoId)
        .join(",");

      const statsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${apiKey}`
      );
      const statsData = await statsRes.json();

      if (statsData.error) {
        console.warn("Failed to fetch video statistics:", statsData.error);
      }

      const mapped: Video[] = videosData.items.map((item: any) => {
        const stats = statsData.items?.find(
          (s: any) => s.id === item.contentDetails.videoId
        );
        const duration = stats?.contentDetails?.duration || "PT0S";

        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        const hours = parseInt(match?.[1] || "0");
        const minutes = parseInt(match?.[2] || "0");
        const seconds = parseInt(match?.[3] || "0");
        const formattedDuration =
          hours > 0
            ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
                .toString()
                .padStart(2, "0")}`
            : `${minutes}:${seconds.toString().padStart(2, "0")}`;

        const viewCount = parseInt(stats?.statistics?.viewCount || "0");
        const formattedViews =
          viewCount >= 1000000
            ? `${(viewCount / 1000000).toFixed(1)}M`
            : viewCount >= 1000
            ? `${(viewCount / 1000).toFixed(0)}K`
            : viewCount.toString();

        const publishedAt = new Date(item.snippet.publishedAt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - publishedAt.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        let formattedDate = "";
        if (diffDays < 1) formattedDate = "Today";
        else if (diffDays === 1) formattedDate = "Yesterday";
        else if (diffDays < 7) formattedDate = `${diffDays} days ago`;
        else if (diffDays < 30)
          formattedDate = `${Math.floor(diffDays / 7)} weeks ago`;
        else if (diffDays < 365)
          formattedDate = `${Math.floor(diffDays / 30)} months ago`;
        else formattedDate = `${Math.floor(diffDays / 365)} years ago`;

        return {
          id: item.contentDetails.videoId,
          title: item.snippet.title,
          thumbnail:
            item.snippet.thumbnails.maxres?.url ||
            item.snippet.thumbnails.high?.url ||
            item.snippet.thumbnails.medium?.url,
          views: formattedViews,
          duration: formattedDuration,
          date: formattedDate,
        };
      });

      setVideos(mapped);
      setFeaturedVideoId(mapped[0]?.id ?? null);
    } catch (err) {
      console.error("Error fetching videos:", err);
      // If API fails, we'll show the playlist embed as fallback
      // Don't set error state, just show empty videos array
      // The playlist embed will still work without API
      setVideos([]);
      setFeaturedVideoId(null);
      setError(null); // Clear error so playlist embed can show
    } finally {
      setLoading(false);
    }
  };
  return (
    <section id="videos" className="section-padding bg-background">
      <div className="container-wide mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="news-badge mb-4">Latest Videos</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4">
              Watch <span className="text-primary">Sach Talk</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Stay informed with our latest news coverage, analysis, and exclusive interviews.
            </p>
          </div>
          <a
            href="https://www.youtube.com/@SachTalksOfficial"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="news" className="gap-2">
              View All Videos
              <ExternalLink className="w-4 h-4" />
            </Button>
          </a>
        </div>

        {/* Featured Video */}
        <div className="mb-12">
          <div className="aspect-video w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg border border-border bg-black">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Skeleton className="w-full h-full" />
              </div>
            ) : featuredVideoId ? (
              <iframe
                src={`https://www.youtube.com/embed/${featuredVideoId}`}
                title="Sach Talk Latest Video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <p className="text-center px-4">No videos available</p>
              </div>
            )}
          </div>
        </div>

        {/* Video Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden border-0 shadow-md bg-card">
                <Skeleton className="aspect-video" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchVideos} variant="outline">
              Try Again
            </Button>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No videos found</p>
            <a
              href="https://www.youtube.com/@SachTalksOfficial"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="gap-2">
                Visit YouTube Channel
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <a
                key={video.id}
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="overflow-hidden border-0 shadow-md card-hover bg-card">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Play overlay */}
                    <div className="absolute inset-0 bg-news-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-glow">
                        <Play className="w-8 h-8 text-primary-foreground ml-1" />
                      </div>
                    </div>
                    {/* Duration badge */}
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-news-dark/90 rounded text-xs text-primary-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {video.duration}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {video.views} views
                      </span>
                      <span>•</span>
                      <span>{video.date}</span>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        )}

        {/* Subscribe CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center p-8 rounded-2xl bg-gradient-hero">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
              Never Miss an Update
            </h3>
            <p className="text-primary-foreground/70 mb-6">
              Subscribe to Sach Talk for daily news and analysis
            </p>
            <a
              href="https://www.youtube.com/@SachTalksOfficial?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="hero" size="lg" className="gap-2">
                <Play className="w-5 h-5" />
                Subscribe Now - It's Free
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YouTubeSection;
