import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Award, Target, Heart, Clock, Globe, Newspaper, Video, CheckCircle, Star } from "lucide-react";

const teamMembers = [
  {
    name: "Amit Kumar",
    role: "Founder & Editor-in-Chief",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    description: "Amit Kumar is the visionary behind Sach Talk. With over 15 years of experience in journalism, he founded Sach Talk with a mission to deliver unbiased, factual news to the masses. His dedication to truth and transparency has made Sach Talk a trusted name in Hindi news media.",
    quote: "Truth is the foundation of democracy.",
  },
  {
    name: "Priya Sharma",
    role: "Co-Founder & Managing Director",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    description: "Priya Sharma brings her expertise in media management and digital strategy to Sach Talk. She oversees the operational aspects of the organization and ensures that the team maintains the highest standards of journalistic integrity.",
    quote: "Empowering people with information.",
  },
  {
    name: "Rajesh Verma",
    role: "General Manager & Head of Operations",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    description: "Rajesh Verma manages the day-to-day operations of Sach Talk. With his extensive background in media production and team management, he ensures smooth functioning of all departments and timely delivery of news content.",
    quote: "Excellence in every story we tell.",
  },
];

const values = [
  {
    icon: Target,
    title: "Truth First",
    description: "We prioritize factual reporting over sensationalism.",
  },
  {
    icon: Users,
    title: "People's Voice",
    description: "We amplify stories that matter to common people.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We maintain the highest standards of journalism.",
  },
  {
    icon: Heart,
    title: "Integrity",
    description: "We stand by our values and ethical practices.",
  },
];

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Us - Sach Talk | Truth First News</title>
        <meta name="description" content="Learn about Sach Talk, our mission, vision, and the team behind India's trusted Hindi news channel." />
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-hero text-primary-foreground">
          <div className="container-wide mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-primary-foreground/10 rounded-full text-sm font-medium mb-6">
              हमारे बारे में
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              The Voice of Truth
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto">
              Sach Talk is committed to delivering unbiased, accurate, and impactful news that empowers the people of India.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="section-padding bg-background">
          <div className="container-wide mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="news-badge mb-4">Our Mission</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
                  सत्य की आवाज़, जनता की ताकत
                </h2>
                <p className="text-muted-foreground text-lg mb-6">
                  At Sach Talk, we believe that truth is the cornerstone of a healthy democracy. Our mission is to provide accurate, unbiased, and timely news coverage that empowers citizens to make informed decisions.
                </p>
                <p className="text-muted-foreground">
                  Founded with the vision of becoming India's most trusted Hindi news platform, we are dedicated to investigative journalism, ground-level reporting, and bringing stories that matter to the forefront.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors"
                  >
                    <value.icon className="w-10 h-10 text-primary mb-4" />
                    <h3 className="font-display font-bold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="section-padding bg-muted/50">
          <div className="container-wide mx-auto">
            <div className="text-center mb-16">
              <span className="news-badge mb-4">Our Leadership</span>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4">
                Meet Our Team
              </h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                The dedicated professionals behind Sach Talk who work tirelessly to bring you the truth.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg group"
                >
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-news-dark/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-display text-xl font-bold text-primary-foreground">
                        {member.name}
                      </h3>
                      <p className="text-primary text-sm font-medium">{member.role}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {member.description}
                    </p>
                    <blockquote className="italic text-primary font-medium border-l-2 border-primary pl-4">
                      "{member.quote}"
                    </blockquote>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section-padding bg-gradient-hero text-primary-foreground">
          <div className="container-wide mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="font-display text-4xl md:text-5xl font-bold mb-2">500K+</div>
                <p className="text-primary-foreground/70">YouTube Subscribers</p>
              </div>
              <div>
                <div className="font-display text-4xl md:text-5xl font-bold mb-2">1000+</div>
                <p className="text-primary-foreground/70">Videos Published</p>
              </div>
              <div>
                <div className="font-display text-4xl md:text-5xl font-bold mb-2">50M+</div>
                <p className="text-primary-foreground/70">Total Views</p>
              </div>
              <div>
                <div className="font-display text-4xl md:text-5xl font-bold mb-2">5+</div>
                <p className="text-primary-foreground/70">Years of Service</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Journey */}
        <section className="section-padding bg-background">
          <div className="container-wide mx-auto">
            <div className="text-center mb-16">
              <span className="news-badge mb-4">Our Journey</span>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4">
                The Story of Sach Talk
              </h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-1 h-full bg-border" />

                {/* Timeline items */}
                {[
                  {
                    year: "2019",
                    title: "The Beginning",
                    description: "Sach Talk was founded with a vision to provide unbiased Hindi news coverage to millions of Indians.",
                    icon: Star,
                  },
                  {
                    year: "2020",
                    title: "Digital Expansion",
                    description: "Launched our YouTube channel and rapidly grew to 100K subscribers within the first year.",
                    icon: Video,
                  },
                  {
                    year: "2021",
                    title: "Investigative Journalism",
                    description: "Established our investigative journalism wing, breaking several important stories.",
                    icon: Newspaper,
                  },
                  {
                    year: "2023",
                    title: "National Recognition",
                    description: "Reached 500K subscribers and became one of the most trusted Hindi news sources.",
                    icon: Award,
                  },
                  {
                    year: "2024",
                    title: "Expanding Horizons",
                    description: "Launched our website and blog platform to reach even more readers across India.",
                    icon: Globe,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`relative flex items-center mb-12 ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div className={`w-full md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                      <div className="bg-card p-6 rounded-xl border border-border hover:border-primary/50 transition-colors ml-8 md:ml-0">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-primary font-bold">{item.year}</span>
                        </div>
                        <h3 className="font-display text-xl font-bold text-foreground mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    {/* Timeline dot */}
                    <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What We Cover */}
        <section className="section-padding bg-muted/50">
          <div className="container-wide mx-auto">
            <div className="text-center mb-16">
              <span className="news-badge mb-4">Our Coverage</span>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4">
                What We Cover
              </h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                Comprehensive news coverage across all major sectors that matter to you.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: "Politics", color: "bg-red-500/10 text-red-500 border-red-500/20" },
                { name: "Economy", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
                { name: "International", color: "bg-green-500/10 text-green-500 border-green-500/20" },
                { name: "Sports", color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
                { name: "Technology", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
                { name: "Entertainment", color: "bg-pink-500/10 text-pink-500 border-pink-500/20" },
              ].map((category, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${category.color} text-center font-medium`}
                >
                  {category.name}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="section-padding bg-background">
          <div className="container-wide mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="news-badge mb-4">Why Sach Talk</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
                  Why Millions Trust Us
                </h2>
                <div className="space-y-4">
                  {[
                    "Independent and unbiased reporting",
                    "In-depth analysis of complex issues",
                    "Ground-level journalism from across India",
                    "Verified facts before publication",
                    "No sensationalism, only truth",
                    "Accessible in simple Hindi",
                  ].map((point, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card rounded-2xl p-8 border border-border">
                <div className="text-center">
                  <Clock className="w-16 h-16 text-primary mx-auto mb-6" />
                  <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                    24/7 News Coverage
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    We work around the clock to bring you the latest news and updates from across India and the world.
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="font-display text-2xl font-bold text-primary">24/7</div>
                      <p className="text-sm text-muted-foreground">Coverage</p>
                    </div>
                    <div>
                      <div className="font-display text-2xl font-bold text-primary">50+</div>
                      <p className="text-sm text-muted-foreground">Reporters</p>
                    </div>
                    <div>
                      <div className="font-display text-2xl font-bold text-primary">28</div>
                      <p className="text-sm text-muted-foreground">States</p>
                    </div>
                  </div>
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

export default AboutPage;
