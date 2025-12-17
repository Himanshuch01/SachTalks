import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPublishedBlogs, type Blog } from "@/lib/blogs";

const BlogSection = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getPublishedBlogs(6);
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs from MongoDB:", error);
      }
      setLoading(false);
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Placeholder blogs if no data
  const placeholderBlogs: Blog[] = [
    {
      id: "1",
      title: "Breaking: Major Policy Changes Announced",
      slug: "major-policy-changes",
      excerpt: "The government has announced significant policy changes that will affect millions of citizens...",
      image_url: null,
      category: "Politics",
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Economic Analysis: What the Numbers Tell Us",
      slug: "economic-analysis",
      excerpt: "A deep dive into the latest economic indicators and what they mean for the future...",
      image_url: null,
      category: "Economy",
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Exclusive: Behind the Headlines",
      slug: "behind-headlines",
      excerpt: "Our investigative team uncovers the truth behind recent controversial headlines...",
      image_url: null,
      category: "Investigation",
      created_at: new Date().toISOString(),
    },
  ];

  const displayBlogs = blogs.length > 0 ? blogs : placeholderBlogs;

  const getImageSrc = (blog: Blog): string | null => {
    if (blog.image_url) return blog.image_url;
    if (blog.image_data && blog.image_mime) {
      return `data:${blog.image_mime};base64,${blog.image_data}`;
    }
    return null;
  };

  return (
    <section id="blogs" className="section-padding bg-muted/50">
      <div className="container-wide mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="news-badge mb-4">News & Articles</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4">
              Latest <span className="text-primary">Blogs</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Read our in-depth articles, analysis, and opinion pieces on current affairs.
            </p>
          </div>
          <Link to="/blog">
            <Button variant="news" className="gap-2">
              View All Articles
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-video bg-muted" />
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-20 mb-4" />
                  <div className="h-6 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayBlogs.map((blog, index) => (
              <Link key={blog.id} to={`/blog/${blog.slug}`} className="group">
                <Card
                  className="overflow-hidden border-0 shadow-md card-hover bg-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative aspect-video overflow-hidden bg-gradient-dark">
                    {getImageSrc(blog) ? (
                      <img
                        src={getImageSrc(blog)!}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-display text-4xl font-bold text-primary-foreground/20">
                          {blog.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    {blog.category && (
                      <div className="absolute top-4 left-4">
                        <span className="news-badge">{blog.category}</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(blog.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    SACH TALKS
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {blog.title}
                    </h3>
                    {blog.excerpt && (
                      <p className="text-muted-foreground line-clamp-2 mb-4">
                        {blog.excerpt}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1 text-primary font-medium text-sm group-hover:gap-2 transition-all">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {blogs.length === 0 && !loading && (
          <p className="text-center text-muted-foreground mt-8">
            New articles coming soon! Subscribe to our YouTube channel for the latest updates.
          </p>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
