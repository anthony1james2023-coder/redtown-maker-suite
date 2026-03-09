import CyberpunkDecorations from "@/components/CyberpunkDecorations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

const sections = [
  { title: "1. Information We Collect", content: "We collect information you provide directly, such as your name, email address, and account details when you register. We also collect usage data including pages visited, features used, games created, and interaction patterns to improve our services." },
  { title: "2. How We Use Your Information", content: "Your information is used to provide and maintain our services, personalize your experience, communicate updates and announcements, analyze usage patterns to improve the platform, and ensure security of your account and data." },
  { title: "3. Data Storage & Security", content: "All data is encrypted at rest and in transit using industry-standard AES-256 encryption. We store data on secure cloud servers with regular backups. Access to personal data is restricted to authorized personnel only." },
  { title: "4. Sharing & Disclosure", content: "We do not sell your personal information. We may share data with trusted service providers who assist in operating our platform, when required by law, or with your explicit consent." },
  { title: "5. Cookies & Tracking", content: "We use essential cookies for authentication and session management. Analytics cookies help us understand how users interact with our platform. You can manage cookie preferences through your browser settings." },
  { title: "6. Your Rights", content: "You have the right to access, correct, or delete your personal data. You can export your data at any time. You may opt out of marketing communications. EU users have additional rights under GDPR." },
  { title: "7. Children's Privacy", content: "Our services are not directed to children under 13. We do not knowingly collect personal information from children. If we become aware of such collection, we will promptly delete the data." },
  { title: "8. Changes to This Policy", content: "We may update this privacy policy from time to time. We will notify you of significant changes via email or platform notification. Continued use after changes constitutes acceptance." },
];

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <CyberpunkDecorations />
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">Legal</Badge>
            <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: March 1, 2026</p>
          </div>

          <div className="space-y-6">
            {sections.map((section) => (
              <Card key={section.title} className="bg-card/50 backdrop-blur-sm border-primary/10">
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold mb-3">{section.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
