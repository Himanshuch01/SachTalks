import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import YouTubeSection from "@/components/YouTubeSection";
import BlogSection from "@/components/BlogSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>SACH TALKS - सच बोलो, सच सुनो | Hindi News Channel</title>
        <meta
          name="description"
          content="SACH TALKS is your trusted source for unbiased Hindi news, analysis, and investigative journalism. Watch our latest videos and read articles on politics, economy, and current affairs."
        />
        <meta
          name="keywords"
          content="SACH TALKS, Hindi news, Indian news, politics, current affairs, investigative journalism, truth, सच टॉक"
        />
        <meta property="og:title" content="SACH TALKS - Hindi News Channel" />
        <meta
          property="og:description"
          content="Your trusted source for unbiased news and analysis. सच बोलो, सच सुनो।"
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://sachtalk.com" />
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
