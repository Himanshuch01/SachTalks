import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText, Scale, AlertTriangle, Copyright, Users, Gavel } from "lucide-react";

const TermsOfServicePage = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - Sach Talk | Usage Agreement</title>
        <meta name="description" content="Read Sach Talk's terms of service to understand the rules and guidelines for using our website and services." />
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-hero text-primary-foreground">
          <div className="container-wide mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-primary-foreground/10 rounded-full text-sm font-medium mb-6">
              <FileText className="w-4 h-4 inline mr-2" />
              सेवा की शर्तें
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto">
              Please read these terms carefully before using our website and services.
            </p>
            <p className="text-sm text-primary-foreground/60 mt-4">
              Effective Date: December 2024
            </p>
          </div>
        </section>

        {/* Terms Content */}
        <section className="section-padding bg-background">
          <div className="container-wide mx-auto max-w-4xl">
            <div className="prose prose-lg max-w-none">
              {/* Acceptance */}
              <div className="bg-card p-6 rounded-xl border border-border mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Scale className="w-6 h-6 text-primary" />
                  <h2 className="font-display text-2xl font-bold text-foreground m-0">Acceptance of Terms</h2>
                </div>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    By accessing and using the Sach Talk website ("Site") and its services, you accept and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you should not use our Site.
                  </p>
                  <p>
                    We reserve the right to modify these terms at any time. Your continued use of the Site after any changes indicates your acceptance of the modified terms.
                  </p>
                </div>
              </div>

              {/* Use of Service */}
              <div className="bg-card p-6 rounded-xl border border-border mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-primary" />
                  <h2 className="font-display text-2xl font-bold text-foreground m-0">Use of Service</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Eligibility</h3>
                    <p>
                      You must be at least 13 years of age to use our services. If you are under 18, you must have parental consent to access certain features.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Permitted Use</h3>
                    <p>You agree to use our Site only for lawful purposes and in accordance with these Terms. You agree NOT to:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Use the Site in any way that violates applicable laws or regulations</li>
                      <li>Impersonate any person or entity</li>
                      <li>Transmit any viruses, malware, or harmful code</li>
                      <li>Attempt to gain unauthorized access to any part of the Site</li>
                      <li>Use automated means to access or scrape content without permission</li>
                      <li>Interfere with the proper functioning of the Site</li>
                      <li>Harass, abuse, or harm other users</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="bg-card p-6 rounded-xl border border-border mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Copyright className="w-6 h-6 text-primary" />
                  <h2 className="font-display text-2xl font-bold text-foreground m-0">Content & Intellectual Property</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Our Content</h3>
                    <p>
                      All content on this Site, including but not limited to text, graphics, logos, images, audio clips, video clips, data compilations, and software, is the property of Sach Talk or its content suppliers and is protected by Indian and international copyright laws.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Limited License</h3>
                    <p>
                      You are granted a limited, non-exclusive, non-transferable license to access and view the content on this Site for personal, non-commercial use only. You may not:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Reproduce, duplicate, or copy content without written permission</li>
                      <li>Modify or create derivative works</li>
                      <li>Distribute, sell, or commercially exploit the content</li>
                      <li>Remove any copyright or proprietary notices</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">User Submissions</h3>
                    <p>
                      By submitting any content (news tips, comments, feedback) to Sach Talk, you grant us a worldwide, royalty-free, perpetual license to use, modify, publish, and distribute such content.
                    </p>
                  </div>
                </div>
              </div>

              {/* User Accounts */}
              <div className="bg-card p-6 rounded-xl border border-border mb-8">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">User Accounts</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    If you create an account with us, you are responsible for:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Maintaining the confidentiality of your account credentials</li>
                    <li>All activities that occur under your account</li>
                    <li>Immediately notifying us of any unauthorized use</li>
                    <li>Providing accurate and complete information</li>
                  </ul>
                  <p>
                    We reserve the right to terminate accounts that violate these terms or are inactive for extended periods.
                  </p>
                </div>
              </div>

              {/* Third Party */}
              <div className="bg-card p-6 rounded-xl border border-border mb-8">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">Third-Party Links & Services</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Our Site may contain links to third-party websites, including YouTube, social media platforms, and advertising networks. These links are provided for your convenience only.
                  </p>
                  <p>
                    We do not endorse or assume responsibility for the content, privacy policies, or practices of any third-party websites. You access third-party sites at your own risk.
                  </p>
                </div>
              </div>

              {/* Limitation of Liability */}
              <div className="bg-card p-6 rounded-xl border border-border mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-primary" />
                  <h2 className="font-display text-2xl font-bold text-foreground m-0">Limitation of Liability</h2>
                </div>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, SACH TALK SHALL NOT BE LIABLE FOR:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                    <li>Any loss of profits, data, or business opportunities</li>
                    <li>Any damages arising from your use or inability to use the Site</li>
                    <li>Any errors, inaccuracies, or omissions in content</li>
                    <li>Any unauthorized access to or use of our servers</li>
                  </ul>
                </div>
              </div>

              {/* Indemnification */}
              <div className="bg-card p-6 rounded-xl border border-border mb-8">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">Indemnification</h2>
                <p className="text-muted-foreground">
                  You agree to indemnify, defend, and hold harmless Sach Talk, its officers, directors, employees, agents, and affiliates from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the Site, violation of these Terms, or infringement of any third-party rights.
                </p>
              </div>

              {/* Governing Law */}
              <div className="bg-card p-6 rounded-xl border border-border mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Gavel className="w-6 h-6 text-primary" />
                  <h2 className="font-display text-2xl font-bold text-foreground m-0">Governing Law & Jurisdiction</h2>
                </div>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                  </p>
                  <p>
                    Any disputes arising from these Terms or your use of the Site shall be subject to the exclusive jurisdiction of the courts located in Patna, Bihar, India.
                  </p>
                </div>
              </div>

              {/* Termination */}
              <div className="bg-card p-6 rounded-xl border border-border mb-8">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">Termination</h2>
                <p className="text-muted-foreground">
                  We reserve the right to terminate or suspend your access to our Site immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the Site will immediately cease.
                </p>
              </div>

              {/* Contact */}
              <div className="bg-primary/10 p-6 rounded-xl border border-primary/20">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">Contact Us</h2>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Email:</strong> <a href="mailto:legal@sachtalk.com" className="text-primary hover:underline">legal@sachtalk.com</a></p>
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

export default TermsOfServicePage;
