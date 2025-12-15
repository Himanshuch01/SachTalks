import { ExternalLink, Play, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const CHANNEL_ID = "UCQTJfE6cW4s3qVGg9UJiK5g"; // Sach Talks Official channel ID

// Featured videos - these would ideally come from YouTube API
const featuredVideos = [
  {
    id: "dQw4w9WgXcQ",
    title: "Breaking: Latest Political Analysis - What You Need to Know",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    views: "125K",
    duration: "15:32",
    date: "2 days ago",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "Exclusive Interview: Inside Story Revealed",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    views: "89K",
    duration: "22:45",
    date: "5 days ago",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "Truth Behind The Headlines - Deep Dive Investigation",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    views: "156K",
    duration: "18:20",
    date: "1 week ago",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "Weekly News Roundup - Top Stories This Week",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    views: "98K",
    duration: "25:10",
    date: "1 week ago",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "Expert Panel Discussion: Economy & Future",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    views: "76K",
    duration: "45:00",
    date: "2 weeks ago",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "Ground Report: Stories That Matter",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    views: "112K",
    duration: "12:15",
    date: "2 weeks ago",
  },
];

const YouTubeSection = () => {
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

        {/* Embedded Channel Video */}
        <div className="mb-12">
          <div className="aspect-video w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.youtube.com/embed?listType=user_uploads&list=SachTalksOfficial"
              title="Sach Talk Latest Video"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVideos.map((video, index) => (
            <a
              key={index}
              href={`https://www.youtube.com/@SachTalksOfficial`}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="overflow-hidden border-0 shadow-md card-hover bg-card">
                <div className="relative aspect-video overflow-hidden">
                  <div className="absolute inset-0 bg-news-charcoal flex items-center justify-center">
                    <Play className="w-12 h-12 text-primary-foreground/50" />
                  </div>
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
