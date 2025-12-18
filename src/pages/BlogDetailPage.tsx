import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getBlogBySlug, type Blog } from "@/lib/blogs";
import { getPageTitle, getCanonicalUrl, generateArticleStructuredData, generateBreadcrumbStructuredData, DEFAULT_IMAGE } from "@/lib/seo";

const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    const data = await getBlogBySlug(slug!);
    if (data) {
      setBlog(data);
    }
    setLoading(false);
  };

  const getImageSrc = (blog: Blog): string | null => {
    if (blog.image_url) return blog.image_url;
    if (blog.image_data && blog.image_mime) {
      return `data:${blog.image_mime};base64,${blog.image_data}`;
    }
    return null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.excerpt || "",
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Article link has been copied to clipboard.",
      });
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen bg-background">
          <div className="container-wide mx-auto px-4 py-12">
            <Skeleton className="h-8 w-32 mb-6" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <Skeleton className="aspect-video w-full max-w-4xl mb-8" />
            <div className="max-w-4xl space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">
              Article Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/blog">
              <Button className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const blogUrl = getCanonicalUrl(`/blog/${blog.slug}`);
  const blogImage = getImageSrc(blog) || DEFAULT_IMAGE;
  const publishedTime = blog.created_at || blog.createdAt;
  
  const articleStructuredData = generateArticleStructuredData({
    title: blog.title,
    description: blog.excerpt || blog.title,
    image: blogImage,
    url: blogUrl,
    publishedTime: publishedTime,
    author: "SACH TALKS",
  });

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: "Home", url: getCanonicalUrl("/") },
    { name: "Blog", url: getCanonicalUrl("/blog") },
    { name: blog.title, url: blogUrl },
  ]);

  return (
    <>
      <Helmet>
        <html lang="hi" />
        <title>{getPageTitle(`${blog.title} - SACH TALKS`)}</title>
        <meta name="description" content={blog.excerpt || blog.title} />
        <meta name="keywords" content={`${blog.category || ""}, Hindi news, ${blog.title}, SACH TALKS`} />
        <link rel="canonical" href={blogUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt || blog.title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={blogUrl} />
        <meta property="og:image" content={blogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="hi_IN" />
        {publishedTime && <meta property="article:published_time" content={publishedTime} />}
        {blog.category && <meta property="article:section" content={blog.category} />}
        <meta property="article:author" content="SACH TALKS" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.excerpt || blog.title} />
        <meta name="twitter:image" content={blogImage} />
        <meta name="twitter:site" content="@SachTalks" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify([articleStructuredData, breadcrumbStructuredData])}
        </script>
      </Helmet>

      <Header />

      <main className="pt-20 min-h-screen bg-background">
        <article className="container-wide mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>

          {/* Article Header */}
          <header className="max-w-4xl mb-8">
            {blog.category && (
              <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded mb-4">
                {blog.category}
              </span>
            )}
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(blog.created_at)}
              </span>
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                SACH TALKS Team
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </header>

          {/* Featured Image */}
          {getImageSrc(blog) && (
            <div className="max-w-4xl mb-10">
              <img
                src={getImageSrc(blog)!}
                alt={blog.title}
                className="w-full rounded-xl shadow-lg"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="max-w-4xl">
            <div className="prose prose-lg max-w-none">
              {blog.content.split("\n").map((paragraph, index) => (
                <p key={index} className="text-foreground/80 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-4xl mt-12 p-8 bg-muted rounded-xl text-center">
            <h3 className="font-display text-xl font-bold text-foreground mb-2">
              Stay Updated with SACH TALKS
            </h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to our YouTube channel for daily news updates and analysis.
            </p>
            <a
              href="https://www.youtube.com/@SachTalksOfficial?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="hero">Subscribe on YouTube</Button>
            </a>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
};

export default BlogDetailPage;
