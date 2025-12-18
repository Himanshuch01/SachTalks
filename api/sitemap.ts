// Serverless function to generate XML sitemap
// Accessible at /api/sitemap.xml

import { MongoClient, ObjectId } from "mongodb";

const SITE_URL = process.env.VITE_SITE_URL || "https://sachtalks.in";
const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

async function getPublishedBlogs() {
  if (!mongoUri || !dbName) {
    return [];
  }

  try {
    const client = await MongoClient.connect(mongoUri, {
      tls: true,
      serverSelectionTimeoutMS: 5000,
    });
    const db = client.db(dbName);
    const blogs = await db
      .collection("blogs")
      .find(
        { published: true, deleted: { $ne: true } },
        { projection: { slug: 1, createdAt: 1, created_at: 1 } }
      )
      .sort({ createdAt: -1 })
      .toArray();
    await client.close();
    return blogs;
  } catch (error) {
    console.error("Error fetching blogs for sitemap:", error);
    return [];
  }
}

export default async function handler(req: any, res: any) {
  // Only allow GET
  if (req.method && req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const blogs = await getPublishedBlogs();
    const currentDate = new Date().toISOString().split("T")[0];

    // Static pages with priorities
    const staticPages = [
      { url: "/", priority: "1.0", changefreq: "daily" },
      { url: "/blog", priority: "0.9", changefreq: "daily" },
      { url: "/videos", priority: "0.9", changefreq: "daily" },
      { url: "/about", priority: "0.8", changefreq: "monthly" },
      { url: "/contact", priority: "0.7", changefreq: "monthly" },
      { url: "/privacy-policy", priority: "0.5", changefreq: "yearly" },
      { url: "/terms-of-service", priority: "0.5", changefreq: "yearly" },
      { url: "/disclaimer", priority: "0.5", changefreq: "yearly" },
    ];

    // Blog pages
    const blogPages = blogs.map((blog: any) => {
      const lastmod = blog.created_at || blog.createdAt || currentDate;
      return {
        url: `/blog/${blog.slug}`,
        priority: "0.8",
        changefreq: "weekly",
        lastmod: typeof lastmod === "string" ? lastmod.split("T")[0] : currentDate,
      };
    });

    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
${blogPages
  .map(
    (page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    // Set XML content type
    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).send(sitemap);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    
    // Return minimal sitemap on error
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    return res.status(200).send(fallbackSitemap);
  }
}
