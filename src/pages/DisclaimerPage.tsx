import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AlertCircle, Info, ExternalLink, TrendingUp, MessageSquare, Camera } from "lucide-react";
import { getPageTitle, getCanonicalUrl, DEFAULT_IMAGE } from "@/lib/seo";

const DisclaimerPage = () => {
  return (
    <>
      <Helmet>
        <html lang="hi" />
        <title>{getPageTitle("Disclaimer - SACH TALKS | Important Notices")}</title>
        <meta name="description" content="Read SACH TALKS's disclaimer regarding content accuracy, opinions, and liability limitations. Important notices regarding the content and services provided." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={getCanonicalUrl("/disclaimer")} />
        
        {/* Open Graph */}
        <meta property="og:title" content="Disclaimer - SACH TALKS | Important Notices" />
        <meta property="og:description" content="Read SACH TALKS's disclaimer regarding content accuracy, opinions, and liability limitations." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={getCanonicalUrl("/disclaimer")} />
        <meta property="og:image" content={DEFAULT_IMAGE} />
        <meta property="og:locale" content="hi_IN" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Disclaimer - SACH TALKS" />
        <meta name="twitter:description" content="Read SACH TALKS's disclaimer regarding content accuracy and liability." />
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-hero text-primary-foreground">
          <div className="container-wide mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-primary-foreground/10 rounded-full text-sm font-medium mb-6">
              <AlertCircle className="w-4 h-4 inline mr-2" />
              अस्वीकरण
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Disclaimer
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto">
              Important notices regarding the content and services provided by SACH TALKS.
            </p>
            <p className="text-sm text-primary-foreground/60 mt-4">
              Last Updated: December 2024
            </p>
          </div>
        </section>

        {/* Disclaimer Content */}
        <section className="section-padding bg-background">
          <div className="container-wide mx-auto max-w-4xl">
            <div className="prose prose-lg max-w-none">
              {/* General Disclaimer */}
              <div className="bg-card p-6 rounded-xl border border-border mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Info className="w-6 h-6 text-primary" />
                  <h2 className="font-display text-2xl font-bold text-foreground m-0">General Disclaimer</h2>
                </div>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    The information provided on SACH TALKS website and YouTube channel is for general informational and educational purposes only. While we strive to provide accurate and up-to-date information, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on the Site.
                  </p>
                  <p>
                    Any reliance you place on such information is strictly at your own risk. We shall not be liable for any loss or damage arising from your use of the information provided.
                  </p>
                </div>
              </div>

              {/* News Content */}
              <div className="bg-card p-6 rounded-xl border border-border mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  <h2 className="font-display text-2xl font-bold text-foreground m-0">News Content Disclaimer</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Accuracy of Information</h3>
                    <p>
                      While SACH TALKS strives to verify all news stories and information before publication, we cannot guarantee the absolute accuracy of every piece of content. News situations can evolve rapidly, and information may change after publication.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Editorial Independence</h3>
                    <p>
                      SACH TALKS maintains editorial independence and is not influenced by any political party, government body, or commercial entity. Our reporting is based on our journalistic judgment and commitment to truth.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Corrections Policy</h3>
                    <p>
                      If we discover errors in our reporting, we will promptly correct them and publish corrections where appropriate. If you believe we have published inaccurate information, please contact us at <a href="mailto:corrections@sachtalk.com" className="text-primary hover:underline">corrections@sachtalk.com</a>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Opinions & Views */}
              <div className="bg-card p-6 rounded-xl border border-border mb-8">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">Opinions & Views</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong>Personal Opinions:</strong> Some content on our platform, including video commentaries, opinion pieces, and analysis, represents the personal views and opinions of the respective authors or presenters. These opinions do not necessarily reflect the official position of SACH TALKS as an organization.
                  </p>
                  <p>
                    <strong>Guest Content:</strong> Views expressed by guests, interviewees, or contributors in our videos and articles are their own and do not represent endorsement by SACH TALKS.
                  </p>
                  <p>
                    <strong>Viewer Discretion:</strong> We encourage viewers and readers to exercise their own judgment and critical thinking when consuming our content, and to seek multiple sources of information on important matters.
                  </p>
                </div>
              </div>

              {/* Financial Disclaimer */}
              <div className="bg-card p-6 rounded-xl border border-border mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  <h2 className="font-display text-2xl font-bold text-foreground m-0">Financial & Investment Disclaimer</h2>
                </div>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Any financial, economic, or investment-related content provided on SACH TALKS is for informational purposes only and should NOT be construed as:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Financial advice or investment recommendations</li>
                    <li>Professional financial planning guidance</li>
                    <li>Tax, legal, or accounting advice</li>
                    <li>Endorsement of any financial product or service</li>
                  </ul>
                  <p className="mt-4">
                    Always consult with qualified financial advisors, tax professionals, and legal experts before making any financial decisions. Investing involves risks, including the potential loss of principal.
                  </p>
                </div>
              </div>

              {/* External Links */}
              <div className="bg-card p-6 rounded-xl border border-border mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <ExternalLink className="w-6 h-6 text-primary" />
                  <h2 className="font-display text-2xl font-bold text-foreground m-0">External Links Disclaimer</h2>
                </div>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Our website and content may contain links to external websites that are not provided or maintained by SACH TALKS. We do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
                  </p>
                  <p>
                    The inclusion of any links does not necessarily imply a recommendation or endorsement of the views expressed within them. We have no control over the nature, content, and availability of those sites.
                  </p>
                </div>
              </div>

              {/* Media & Images */}
              <div className="bg-card p-6 rounded-xl border border-border mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Camera className="w-6 h-6 text-primary" />
                  <h2 className="font-display text-2xl font-bold text-foreground m-0">Media & Images Disclaimer</h2>
                </div>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Images, videos, and graphics used on our platform may include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Original content created by SACH TALKS</li>
                    <li>Licensed stock images and videos</li>
                    <li>Images used under fair use for news reporting and commentary</li>
                    <li>User-submitted content</li>
                  </ul>
                  <p className="mt-4">
                    If you believe any content on our platform infringes your copyright, please contact us at <a href="mailto:legal@sachtalk.com" className="text-primary hover:underline">legal@sachtalk.com</a> with details of the alleged infringement.
                  </p>
                </div>
              </div>

              {/* No Professional Advice */}
              <div className="bg-card p-6 rounded-xl border border-border mb-8">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">No Professional Advice</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    The content on SACH TALKS should not be construed as professional advice in any field, including but not limited to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Legal advice</li>
                    <li>Medical or health advice</li>
                    <li>Financial or investment advice</li>
                    <li>Technical or professional consulting</li>
                  </ul>
                  <p>
                    For specific professional advice, please consult with qualified professionals in the relevant field.
                  </p>
                </div>
              </div>

              {/* Limitation of Liability */}
              <div className="bg-yellow-500/10 p-6 rounded-xl border border-yellow-500/20 mb-8">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">⚠️ Limitation of Liability</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    IN NO EVENT SHALL SACH TALK, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Your access to or use of or inability to access or use the Service</li>
                    <li>Any conduct or content of any third party on the Service</li>
                    <li>Any content obtained from the Service</li>
                    <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                  </ul>
                </div>
              </div>

              {/* Changes */}
              <div className="bg-card p-6 rounded-xl border border-border mb-8">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">Changes to This Disclaimer</h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify or update this disclaimer at any time without prior notice. It is your responsibility to review this disclaimer periodically for any changes. Your continued use of the Site following the posting of any changes constitutes acceptance of those changes.
                </p>
              </div>

              {/* Contact */}
              <div className="bg-primary/10 p-6 rounded-xl border border-primary/20">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">Contact Us</h2>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about this Disclaimer, please contact us:
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

export default DisclaimerPage;
