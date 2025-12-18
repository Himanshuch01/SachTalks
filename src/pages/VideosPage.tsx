import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPageTitle, getCanonicalUrl, DEFAULT_IMAGE } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Clock, Eye, ExternalLink, Youtube } from "lucide-react";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  views: string;
  duration: string;
  date: string;
}

// Shape of the server-side YouTube API response
interface ApiVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration?: string; // ISO 8601
  viewCount?: string;
}

interface ApiResponse {
  videos?: ApiVideo[];
  error?: string;
}

const VideosPage = () => {
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

      const res = await fetch("/api/youtube");

      const contentType = res.headers.get("content-type") || "";
      const isJson = contentType.toLowerCase().includes("application/json");

      // If response is not JSON (e.g. HTML error page), avoid calling res.json()
      if (!isJson) {
        const text = await res.text().catch(() => "");
        console.error("Non-JSON response from /api/youtube:", text);
        throw new Error(
          "Server returned an unexpected response for videos. Please check that the /api/youtube route is deployed and returning JSON."
        );
      }

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as ApiResponse | null;
        const message =
          data?.error ??
          `Failed to load videos from server (HTTP ${res.status}).`;
        throw new Error(message);
      }

      // Safe: server indicated JSON and status OK.
      const data = (await res.json()) as ApiResponse;

      if (data.error) {
        throw new Error(data.error);
      }

      const apiVideos = data.videos ?? [];

      if (!apiVideos.length) {
        setVideos([]);
        setFeaturedVideoId(null);
        return;
      }

      const mapped: Video[] = apiVideos.map((video) => {
        const isoDuration = video.duration ?? "PT0S";

        // Parse ISO 8601 duration format (PT1H2M3S)
        const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        const hours = parseInt(match?.[1] || "0", 10);
        const minutes = parseInt(match?.[2] || "0", 10);
        const seconds = parseInt(match?.[3] || "0", 10);
        const formattedDuration =
          hours > 0
            ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
                .toString()
                .padStart(2, "0")}`
            : `${minutes}:${seconds.toString().padStart(2, "0")}`;

        // Format view count if available
        const rawViewCount = video.viewCount ?? "0";
        const viewCount = parseInt(rawViewCount, 10) || 0;
        const formattedViews =
          viewCount >= 1_000_000
            ? `${(viewCount / 1_000_000).toFixed(1)}M`
            : viewCount >= 1_000
            ? `${(viewCount / 1_000).toFixed(0)}K`
            : viewCount.toString();

        // Format relative date from publishedAt
        const publishedAtDate = new Date(video.publishedAt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - publishedAtDate.getTime());
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
          id: video.videoId,
          title: video.title,
          thumbnail: video.thumbnail,
          views: formattedViews,
          duration: formattedDuration,
          date: formattedDate,
        };
      });

      setVideos(mapped);

      const firstVideoId = mapped[0]?.id;
      if (firstVideoId && firstVideoId.trim() !== "") {
        setFeaturedVideoId(firstVideoId);
      } else {
        setFeaturedVideoId(null);
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load videos. Please try again later.";
      setError(errorMessage);
      setVideos([]);
      setFeaturedVideoId(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <html lang="hi" />
        <title>{getPageTitle("Videos - SACH TALKS | Latest News Videos")}</title>
        <meta name="description" content="Watch the latest news videos, interviews, and analysis from SACH TALKS. Subscribe to our YouTube channel for daily updates on politics, economy, and current affairs." />
        <meta name="keywords" content="Hindi news videos, YouTube videos, news analysis, interviews, SACH TALKS videos, current affairs videos" />
        <link rel="canonical" href={getCanonicalUrl("/videos")} />
        
        {/* Open Graph */}
        <meta property="og:title" content="Videos - SACH TALKS | Latest News Videos" />
        <meta property="og:description" content="Watch the latest news videos, interviews, and analysis from SACH TALKS. Subscribe to our YouTube channel for daily updates." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={getCanonicalUrl("/videos")} />
        <meta property="og:image" content={DEFAULT_IMAGE} />
        <meta property="og:locale" content="hi_IN" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Videos - SACH TALKS | Latest News Videos" />
        <meta name="twitter:description" content="Watch the latest news videos, interviews, and analysis from SACH TALKS." />
        <meta name="twitter:image" content={DEFAULT_IMAGE} />
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-hero text-primary-foreground">
          <div className="container-wide mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-primary-foreground/10 rounded-full text-sm font-medium mb-6">
              वीडियो
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Watch Our Videos
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-8">
              Stay informed with our latest news coverage, analysis, and exclusive interviews.
            </p>
            <a
              href="https://www.youtube.com/@SachTalksOfficial?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="hero" size="lg" className="gap-2">
                <Youtube className="w-5 h-5" />
                Subscribe on YouTube
              </Button>
            </a>
          </div>
        </section>

        {/* Featured Video */}
        <section className="section-padding bg-background">
          <div className="container-wide mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
              Latest Video
            </h2>
            <div className="aspect-video w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-border flex items-center justify-center bg-black">
              {featuredVideoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${featuredVideoId}`}
                  title="SACH TALKS Latest Video"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="text-muted-foreground text-sm md:text-base px-4 text-center">
                  Latest video will appear here once loaded.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Video Grid */}
        <section className="section-padding bg-muted/50">
          <div className="container-wide mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                All Videos
              </h2>
              <a
                href="https://www.youtube.com/@SachTalksOfficial"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="gap-2">
                  View on YouTube
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="aspect-video" />
                    <CardContent className="p-4 space-y-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={fetchVideos}>Try Again</Button>
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  No videos found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Check back soon for new content!
                </p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map((video) => (
                  <a
                    key={video.id}
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <Card className="overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Play overlay */}
                        <div className="absolute inset-0 bg-news-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-glow">
                            <Play className="w-7 h-7 text-primary-foreground ml-1" />
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
          </div>
        </section>

        {/* Subscribe CTA */}
        <section className="section-padding bg-gradient-hero text-primary-foreground">
          <div className="container-wide mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Never Miss an Update
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Subscribe to SACH TALKS on YouTube for daily news, analysis, and exclusive interviews. Join our growing community of informed viewers.
            </p>
            <a
              href="https://www.youtube.com/@SachTalksOfficial?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="hero" size="lg" className="gap-2">
                <Youtube className="w-5 h-5" />
                Subscribe Now - It's Free
              </Button>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default VideosPage;
