/**
 * SEO Utility Functions
 * Provides consistent SEO metadata across all pages
 */

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://sachtalks.in";
const SITE_NAME = "SACH TALKS";
const DEFAULT_DESCRIPTION = "SACH TALKS is your trusted source for unbiased Hindi news, analysis, and investigative journalism. Watch our latest videos and read articles on politics, economy, and current affairs.";
const DEFAULT_IMAGE = `${SITE_URL}/placeholder.svg`;

export interface SEOData {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  category?: string;
  keywords?: string[];
}

/**
 * Get full page title with site name
 */
export function getPageTitle(title: string): string {
  if (title.includes(SITE_NAME)) {
    return title;
  }
  return `${title} | ${SITE_NAME}`;
}

/**
 * Get canonical URL for a page
 */
export function getCanonicalUrl(path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

/**
 * Generate JSON-LD structured data for articles
 */
export function generateArticleStructuredData(data: {
  title: string;
  description?: string;
  image?: string;
  url: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}): object {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    description: data.description || data.title,
    image: data.image || DEFAULT_IMAGE,
    url: data.url,
    datePublished: data.publishedTime,
    dateModified: data.modifiedTime || data.publishedTime,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/placeholder.svg`,
      },
    },
  };
}

/**
 * Generate JSON-LD structured data for website
 */
export function generateWebsiteStructuredData(): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blog?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate JSON-LD structured data for organization
 */
export function generateOrganizationStructuredData(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/placeholder.svg`,
    description: DEFAULT_DESCRIPTION,
    sameAs: [
      "https://www.youtube.com/@SachTalksOfficial",
      "https://x.com/SachTalks",
      "https://www.facebook.com/SachTalksofficial/",
      "https://www.instagram.com/sachtalksofficial/",
    ],
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Get default SEO data
 */
export function getDefaultSEO(): SEOData {
  return {
    title: `${SITE_NAME} - सच बोलो, सच सुनो | Hindi News Channel`,
    description: DEFAULT_DESCRIPTION,
    image: DEFAULT_IMAGE,
    url: SITE_URL,
    type: "website",
  };
}

export { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION, DEFAULT_IMAGE };
