import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

const sections = [
  { title: "1. Acceptance of Terms", content: "By accessing or using Redtown 2, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services." },
  { title: "2. Account Registration", content: "You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials. You must be at least 13 years old to use our services." },
  { title: "3. User Content", content: "You retain ownership of games and content you create on Redtown 2. By publishing content, you grant us a license to host, display, and distribute your content on our platform. You are responsible for ensuring your content does not violate any laws or third-party rights." },
  { title: "4. Acceptable Use", content: "You agree not to use the platform for illegal activities, harassment, or distributing malicious content. You must not attempt to gain unauthorized access to our systems. Automated scraping or data extraction is prohibited without prior written consent." },
  { title: "5. Intellectual Property", content: "Redtown 2 and its original content, features, and functionality are owned by Redtown 2 and protected by international copyright, trademark, and other intellectual property laws." },
  { title: "6. Subscriptions & Payments", content: "Paid features are billed on a recurring basis. You can cancel your subscription at any time. Refunds are provided in accordance with our refund policy. Prices may change with 30 days notice." },
  { title: "7. Limitation of Liability", content: "Redtown 2 is provided 'as is' without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform." },
  { title: "8. Termination", content: "We may terminate or suspend your account for violations of these terms. You may delete your account at any time. Upon termination, your right to use the service will immediately cease." },
  { title: "9. Governing Law", content: "These terms are governed by the laws of the State of California, United States. Any disputes will be resolved in the courts of San Francisco County, California." },
];

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">Legal</Badge>
            <FileText className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
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

export default Terms;
