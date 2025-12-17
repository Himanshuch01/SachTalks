import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, LogOut, ArrowLeft, Save } from "lucide-react";
import {
  type Blog,
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "@/lib/blogs";

const Admin = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image_url: "",
    category: "",
    published: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem("admin-authenticated");
    setIsAdmin(stored === "true");
    setLoading(false);
  }, []);

  // Load blogs when admin is authenticated
  useEffect(() => {
    if (isAdmin) {
      fetchBlogs();
    }
  }, [isAdmin]);

  // Auto-logout admin after 5 minutes of inactivity
  useEffect(() => {
    if (!isAdmin) return;

    const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes
    let timeoutId: number | null = null;

    const resetTimer = () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(() => {
        toast({
          title: "Session expired",
          description: "You were logged out due to inactivity.",
        });
        handleSignOut();
      }, INACTIVITY_LIMIT);
    };

    // User activity events
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    // Start initial timer
    resetTimer();

    // Cleanup on unmount or when admin logs out
    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [isAdmin]);

  const fetchBlogs = async () => {
    try {
      const data = await getAllBlogs();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs from MongoDB:", error);
    }
  };

  const handleSignOut = async () => {
    localStorage.removeItem("admin-authenticated");
    setIsAdmin(false);
    navigate("/");
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      image_url: "",
      category: "",
      published: false,
    });
    setEditingBlog(null);
    setIsCreating(false);
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || "",
      content: blog.content,
      image_url: blog.image_url || "",
      category: blog.category || "",
      published: blog.published,
    });
    setIsCreating(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    if (editingBlog) {
      try {
        await updateBlog(editingBlog.id!, {
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt || null,
          content: formData.content,
          image_url: formData.image_url || null,
          category: formData.category || null,
          published: formData.published,
        });
        toast({
          title: "Success",
          description: "Blog updated successfully",
        });
        resetForm();
        fetchBlogs();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update blog",
          variant: "destructive",
        });
      }
    } else {
      try {
        await createBlog({
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt || null,
          content: formData.content,
          image_url: formData.image_url || null,
          category: formData.category || null,
          published: formData.published,
        });
        toast({
          title: "Success",
          description: "Blog created successfully",
        });
        resetForm();
        fetchBlogs();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create blog",
          variant: "destructive",
        });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      // Soft-delete: mark as unpublished and deleted so it disappears
      // from the website and from published lists, while keeping data in DB.
      await updateBlog(id, { published: false, deleted: true });
      toast({
        title: "Success",
        description: "Blog removed from website successfully",
      });
      // Refresh the list so status updates in the admin panel
      fetchBlogs();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove blog",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-red rounded-sm flex items-center justify-center mx-auto mb-4">
              <span className="font-display font-bold text-primary-foreground text-2xl">S</span>
            </div>
            <CardTitle className="font-display text-2xl">Admin Access</CardTitle>
            <p className="text-muted-foreground mt-2">
              Sign in to access the admin panel
            </p>
          </CardHeader>
          <CardContent>
            <LoginForm onSuccess={() => {
              setIsAdmin(true);
              localStorage.setItem("admin-authenticated", "true");
              fetchBlogs();
            }} />
            <div className="mt-6 text-center">
              <Button variant="link" onClick={() => navigate("/")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container-wide mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="font-display text-xl font-bold">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:block">
              Admin
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container-wide mx-auto px-4 py-8">
        {isCreating ? (
          /* Blog Form */
          <Card>
            <CardHeader>
              <CardTitle className="font-display">
                {editingBlog ? "Edit Blog" : "Create New Blog"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={handleTitleChange}
                      placeholder="Enter blog title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      placeholder="blog-url-slug"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      placeholder="e.g., Politics, Economy"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) =>
                        setFormData({ ...formData, image_url: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    placeholder="Brief summary of the blog..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="Write your blog content here..."
                    rows={10}
                    required
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, published: checked })
                    }
                  />
                  <Label htmlFor="published">Publish immediately</Label>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="gap-2">
                    <Save className="w-4 h-4" />
                    {editingBlog ? "Update Blog" : "Create Blog"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          /* Blog List */
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl font-bold">Manage Blogs</h2>
              <Button onClick={() => setIsCreating(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                New Blog
              </Button>
            </div>

            {blogs.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    No blogs yet. Create your first blog post!
                  </p>
                  <Button onClick={() => setIsCreating(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create Blog
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {blogs.map((blog) => (
                  <Card key={blog.id}>
                    <CardContent className="py-4 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{blog.title}</h3>
                          {blog.published ? (
                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                              Published
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded">
                              Draft
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {blog.category && `${blog.category} • `}
                          {new Date(blog.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(blog)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDelete(blog.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

// Login Form Component - simple password gate (no Supabase)
const LoginForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD as string | undefined;
    if (!adminPassword) {
      toast({
        title: "Configuration Error",
        description: "VITE_ADMIN_PASSWORD is not set.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (password === adminPassword) {
      toast({
        title: "Access granted",
        description: "Welcome, admin.",
      });
      onSuccess();
    } else {
      toast({
        title: "Error",
        description: "Invalid admin password",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Admin Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          minLength={6}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Loading..." : "Sign In"}
      </Button>
    </form>
  );
};

export default Admin;
