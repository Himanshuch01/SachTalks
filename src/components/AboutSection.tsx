import { Target, Shield, Users, Award } from "lucide-react";

const AboutSection = () => {
  const values = [
    {
      icon: Target,
      title: "Accuracy",
      description: "We verify every fact before reporting. Truth is our foundation.",
    },
    {
      icon: Shield,
      title: "Independence",
      description: "Free from political bias and corporate influence.",
    },
    {
      icon: Users,
      title: "For the People",
      description: "News that matters to common citizens, not just the elite.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Award-winning journalism that sets the standard.",
    },
  ];

  return (
    <section id="about" className="section-padding bg-background">
      <div className="container-wide mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <span className="news-badge mb-4">About Us</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">
              The Voice of <span className="text-primary">Truth</span>
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">Sach Talk</strong> (सच टॉक) is a leading Hindi news channel dedicated to delivering unbiased, factual reporting on current affairs, politics, economy, and social issues.
              </p>
              <p>
                Founded with the mission to bring truth to millions, we believe that every citizen deserves access to accurate information. Our team of experienced journalists works tirelessly to uncover stories that matter.
              </p>
              <p>
                From breaking news to in-depth analysis, from ground reports to expert discussions - Sach Talk is your trusted partner in staying informed about the world around you.
              </p>
            </div>

            {/* Mission Statement */}
            <div className="mt-8 p-6 rounded-lg bg-gradient-hero">
              <p className="font-display text-xl text-primary-foreground italic">
                "सच बोलो, सच सुनो - हमारा मिशन है हर नागरिक तक सही खबर पहुंचाना।"
              </p>
              <p className="text-primary-foreground/70 mt-2 text-sm">
                "Speak truth, hear truth - Our mission is to deliver accurate news to every citizen."
              </p>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-6 rounded-lg bg-card shadow-md card-hover border border-border/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
