import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  mobile: z.string().trim().min(10, "Valid mobile number is required").max(15, "Mobile number is too long"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  address: z.string().trim().max(500, "Address must be less than 500 characters").optional(),
  problem: z.string().trim().min(10, "Please describe your query in at least 10 characters").max(2000, "Message must be less than 2000 characters"),
});

const contactInfo = [
  {
    icon: MapPin,
    title: "Office Address",
    details: [
      "1st Floor, Ramdiri House",
      "Dadiji Lane, Boring Road",
      "Patna, Bihar 800001",
    ],
  },
  {
    icon: Phone,
    title: "Phone Number",
    details: ["+91 XXXXX XXXXX", "+91 XXXXX XXXXX"],
  },
  {
    icon: Mail,
    title: "Email Address",
    details: ["contact@sachtalk.com", "news@sachtalk.com"],
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: ["Monday - Saturday", "9:00 AM - 8:00 PM"],
  },
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    problem: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validatedData = contactSchema.parse(formData);
      
      // Here you would typically send the data to your backend
      console.log("Form submitted:", validatedData);
      
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });

      // Reset form
      setFormData({
        name: "",
        mobile: "",
        email: "",
        address: "",
        problem: "",
      });
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - Sach Talk | Get in Touch</title>
        <meta name="description" content="Contact Sach Talk for news tips, feedback, or inquiries. Visit our office in Patna, Bihar or reach out through our contact form." />
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-hero text-primary-foreground">
          <div className="container-wide mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-primary-foreground/10 rounded-full text-sm font-medium mb-6">
              संपर्क करें
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto">
              Have a news tip, feedback, or want to collaborate? We'd love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="section-padding bg-background">
          <div className="container-wide mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-24 relative z-10">
              {contactInfo.map((info, index) => (
                <Card key={index} className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <info.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-display font-bold text-foreground mb-3">{info.title}</h3>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-sm text-muted-foreground">
                        {detail}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Map & Form Section */}
        <section className="section-padding bg-muted/50">
          <div className="container-wide mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Map */}
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
                  Our Location
                </h2>
                <div className="rounded-xl overflow-hidden shadow-lg border border-border h-[400px] lg:h-[500px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.7689774244714!2d85.01234567890123!3d25.609999999999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed58a1a0b0a0a1%3A0x1234567890abcdef!2sBoring%20Road%2C%20Patna%2C%20Bihar%20800001!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Sach Talk Office Location"
                  />
                </div>
                <div className="mt-6 p-4 bg-card rounded-lg border border-border">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Sach Talk Office</p>
                      <p className="text-sm text-muted-foreground">
                        1st Floor, Ramdiri House, Dadiji Lane, Boring Road, Patna, Bihar 800001
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
                  Send Us a Message
                </h2>
                <Card className="border-border">
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          className={errors.name ? "border-destructive" : ""}
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="mobile">Mobile Number *</Label>
                          <Input
                            id="mobile"
                            name="mobile"
                            type="tel"
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder="+91 XXXXX XXXXX"
                            className={errors.mobile ? "border-destructive" : ""}
                          />
                          {errors.mobile && <p className="text-sm text-destructive">{errors.mobile}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            className={errors.email ? "border-destructive" : ""}
                          />
                          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Your Address (Optional)</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Enter your address"
                          className={errors.address ? "border-destructive" : ""}
                        />
                        {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="problem">Your Query / Message *</Label>
                        <Textarea
                          id="problem"
                          name="problem"
                          value={formData.problem}
                          onChange={handleChange}
                          placeholder="Describe your query, news tip, or feedback..."
                          rows={5}
                          className={errors.problem ? "border-destructive" : ""}
                        />
                        {errors.problem && <p className="text-sm text-destructive">{errors.problem}</p>}
                      </div>

                      <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                        <Send className="w-4 h-4" />
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        {/* FAQ Section */}
        <section className="section-padding bg-background">
          <div className="container-wide mx-auto">
            <div className="text-center mb-12">
              <span className="news-badge mb-4">FAQ</span>
              <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mt-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {[
                {
                  question: "How can I submit a news tip?",
                  answer: "You can submit news tips through our contact form above, or email us directly at news@sachtalk.com. We take all tips seriously and investigate them thoroughly.",
                },
                {
                  question: "How long does it take to get a response?",
                  answer: "We typically respond to all inquiries within 24-48 hours during business days. For urgent matters, please call our office directly.",
                },
                {
                  question: "Can I visit your office?",
                  answer: "Yes, our office is open for visitors during working hours (Monday-Saturday, 9 AM - 8 PM). Please call ahead to schedule an appointment.",
                },
                {
                  question: "How can I advertise on Sach Talk?",
                  answer: "For advertising inquiries, please email advertising@sachtalk.com with your requirements. Our team will get back to you with available options.",
                },
                {
                  question: "How do I report incorrect information?",
                  answer: "If you believe we have published incorrect information, please email corrections@sachtalk.com with details. We take accuracy seriously and will investigate promptly.",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="bg-card p-6 rounded-xl border border-border hover:border-primary/50 transition-colors"
                >
                  <h3 className="font-display font-bold text-foreground mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Connect */}
        <section className="section-padding bg-gradient-hero text-primary-foreground">
          <div className="container-wide mx-auto text-center">
            <h2 className="font-display text-2xl md:text-4xl font-bold mb-4">
              Connect With Us on Social Media
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Follow us on social media for the latest updates, behind-the-scenes content, and breaking news alerts.
            </p>
            <div className="flex justify-center gap-4">
              {[
                { name: "YouTube", href: "https://www.youtube.com/@SachTalksOfficial", color: "bg-red-600 hover:bg-red-700" },
                { name: "Twitter", href: "#", color: "bg-blue-500 hover:bg-blue-600" },
                { name: "Facebook", href: "#", color: "bg-blue-700 hover:bg-blue-800" },
                { name: "Instagram", href: "#", color: "bg-pink-600 hover:bg-pink-700" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-6 py-3 rounded-full text-white font-medium transition-colors ${social.color}`}
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ContactPage;
