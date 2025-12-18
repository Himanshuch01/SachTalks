import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import YouTubeSection from "@/components/YouTubeSection";
import BlogSection from "@/components/BlogSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import { getPageTitle, getCanonicalUrl, generateWebsiteStructuredData, generateOrganizationStructuredData, SITE_URL, DEFAULT_IMAGE } from "@/lib/seo";

const Index = () => {
  const structuredData = [
    generateWebsiteStructuredData(),
    generateOrganizationStructuredData(),
  ];

  return (
    <>
      <Helmet>
        <html lang="hi" />
        <title>{getPageTitle("SACH TALKS - सच बोलो, सच सुनो | Hindi News Channel")}</title>
        <meta
          name="description"
          content="SACH TALKS is your trusted source for unbiased Hindi news, analysis, and investigative journalism. Watch our latest videos and read articles on politics, economy, and current affairs."
        />
        <meta
          name="keywords"
          content="SACH TALKS, Hindi news, Indian news, politics, current affairs, investigative journalism, truth, सच टॉक, हिंदी न्यूज़, भारतीय समाचार"
        />
        <link rel="canonical" href={getCanonicalUrl("/")} />
        
        {/* Open Graph */}
        <meta property="og:title" content={getPageTitle("SACH TALKS - सच बोलो, सच सुनो | Hindi News Channel")} />
        <meta
          property="og:description"
          content="SACH TALKS is your trusted source for unbiased Hindi news, analysis, and investigative journalism. Watch our latest videos and read articles on politics, economy, and current affairs."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={getCanonicalUrl("/")} />
        <meta property="og:image" content={DEFAULT_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="hi_IN" />
        <meta property="og:site_name" content="SACH TALKS" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={getPageTitle("SACH TALKS - सच बोलो, सच सुनो | Hindi News Channel")} />
        <meta name="twitter:description" content="SACH TALKS is your trusted source for unbiased Hindi news, analysis, and investigative journalism." />
        <meta name="twitter:image" content={DEFAULT_IMAGE} />
        <meta name="twitter:site" content="@SachTalks" />
        <meta name="twitter:creator" content="@SachTalks" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <main>
          <HeroSection />
          <YouTubeSection />
          <BlogSection />
          <AboutSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
