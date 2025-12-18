import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, Database, UserCheck, Bell } from "lucide-react";
import { getPageTitle, getCanonicalUrl, DEFAULT_IMAGE } from "@/lib/seo";

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <html lang="hi" />
        <title>{getPageTitle("Privacy Policy - SACH TALKS | Your Data Protection")}</title>
        <meta name="description" content="Read SACH TALKS's privacy policy to understand how we collect, use, and protect your personal information. We are committed to protecting your privacy and ensuring data security." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={getCanonicalUrl("/privacy-policy")} />
        
        {/* Open Graph */}
        <meta property="og:title" content="Privacy Policy - SACH TALKS | Your Data Protection" />
        <meta property="og:description" content="Read SACH TALKS's privacy policy to understand how we collect, use, and protect your personal information." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={getCanonicalUrl("/privacy-policy")} />
        <meta property="og:image" content={DEFAULT_IMAGE} />
        <meta property="og:locale" content="hi_IN" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Privacy Policy - SACH TALKS" />
        <meta name="twitter:description" content="Read SACH TALKS's privacy policy to understand how we protect your personal information." />
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-hero text-primary-foreground">
          <div className="container-wide mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-primary-foreground/10 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4 inline mr-2" />
              गोपनीयता नीति
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto">
              We are committed to protecting your privacy and ensuring the security of your personal information.
            </p>
            <p className="text-sm text-primary-foreground/60 mt-4">
              Last Updated: December 2024
            </p>
          </div>
        </section>

        {/* Privacy Content */}
        <section className="section-padding bg-background">
          <div className="container-wide mx-auto max-w-4xl">
            {/* Introduction */}
            <div className="prose prose-lg max-w-none">
              <div className="bg-card p-6 rounded-xl border border-border mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="w-6 h-6 text-primary" />
                  <h2 className="font-display text-2xl font-bold text-foreground m-0">Introduction</h2>
                </div>
                <p className="text-muted-foreground">
                  SACH TALKS ("we", "our", or "us") operates the website and associated services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                </p>
              </div>

              {/* Information We Collect */}
              <div className="bg-card p-6 rounded-xl border border-border mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="w-6 h-6 text-primary" />
                  <h2 className="font-display text-2xl font-bold text-foreground m-0">Information We Collect</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Personal Information</h3>
                    <p>We may collect personal information that you voluntarily provide to us when you:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Fill out contact forms</li>
                      <li>Subscribe to our newsletter</li>
                      <li>Submit news tips or stories</li>
                      <li>Create an account on our platform</li>
                      <li>Participate in surveys or contests</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Automatically Collected Information</h3>
                    <p>When you visit our website, we automatically collect certain information about your device, including:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>IP address and location data</li>
                      <li>Browser type and version</li>
                      <li>Operating system</li>
                      <li>Pages visited and time spent</li>
                      <li>Referring website addresses</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* How We Use Information */}
              <div className="bg-card p-6 rounded-xl border border-border mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-6 h-6 text-primary" />
                  <h2 className="font-display text-2xl font-bold text-foreground m-0">How We Use Your Information</h2>
                </div>
                <div className="space-y-3 text-muted-foreground">
                  <p>We use the collected information for various purposes:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>To provide and maintain our services</li>
                    <li>To notify you about changes to our services</li>
                    <li>To respond to your inquiries and provide customer support</li>
                    <li>To send newsletters and promotional materials (with your consent)</li>
                    <li>To analyze website usage and improve our content</li>
                    <li>To detect, prevent, and address technical issues</li>
                    <li>To comply with legal obligations</li>
                  </ul>
                </div>
              </div>

              {/* Data Protection */}
              <div className="bg-card p-6 rounded-xl border border-border mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                  <h2 className="font-display text-2xl font-bold text-foreground m-0">Data Protection & Security</h2>
                </div>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                  <p>Our security measures include:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Encryption of data in transit using SSL/TLS</li>
                    <li>Regular security audits and assessments</li>
                    <li>Access controls and authentication mechanisms</li>
                    <li>Secure data storage practices</li>
                    <li>Employee training on data protection</li>
                  </ul>
                </div>
              </div>

              {/* Your Rights */}
              <div className="bg-card p-6 rounded-xl border border-border mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <UserCheck className="w-6 h-6 text-primary" />
                  <h2 className="font-display text-2xl font-bold text-foreground m-0">Your Rights</h2>
                </div>
                <div className="space-y-3 text-muted-foreground">
                  <p>You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access the personal information we hold about you</li>
                    <li>Request correction of inaccurate information</li>
                    <li>Request deletion of your personal information</li>
                    <li>Object to processing of your personal information</li>
                    <li>Request restriction of processing</li>
                    <li>Data portability</li>
                    <li>Withdraw consent at any time</li>
                  </ul>
                  <p className="mt-4">
                    To exercise any of these rights, please contact us at <a href="mailto:privacy@sachtalk.com" className="text-primary hover:underline">privacy@sachtalk.com</a>
                  </p>
                </div>
              </div>

              {/* Cookies */}
              <div className="bg-card p-6 rounded-xl border border-border mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Bell className="w-6 h-6 text-primary" />
                  <h2 className="font-display text-2xl font-bold text-foreground m-0">Cookies & Tracking</h2>
                </div>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with small amounts of data that may include an anonymous unique identifier.
                  </p>
                  <p>Types of cookies we use:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
                    <li><strong>Marketing Cookies:</strong> Used to track visitors across websites for advertising purposes</li>
                  </ul>
                  <p>
                    You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, some features of our service may not function properly without cookies.
                  </p>
                </div>
              </div>

              {/* Third Party */}
              <div className="bg-card p-6 rounded-xl border border-border mb-8">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">Third-Party Services</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Our website may contain links to third-party websites, including YouTube, social media platforms, and advertising networks. We are not responsible for the privacy practices of these external sites.
                  </p>
                  <p>
                    We recommend reviewing the privacy policies of any third-party sites you visit through links on our website.
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-primary/10 p-6 rounded-xl border border-primary/20">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">Contact Us</h2>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Email:</strong> <a href="mailto:privacy@sachtalk.com" className="text-primary hover:underline">privacy@sachtalk.com</a></p>
                  <p><strong>Address:</strong> 1st Floor, Ramdiri House, Dadiji Lane, Boring Road, Patna, Bihar 800001</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default PrivacyPolicyPage;
