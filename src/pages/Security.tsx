import CyberpunkDecorations from "@/components/CyberpunkDecorations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Eye, Server, Key, CheckCircle } from "lucide-react";

const securityFeatures = [
  { icon: Lock, title: "End-to-End Encryption", desc: "All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Your projects and personal information are always protected." },
  { icon: Server, title: "Secure Infrastructure", desc: "Hosted on enterprise-grade cloud infrastructure with DDoS protection, firewalls, and regular security audits." },
  { icon: Key, title: "Authentication & Access", desc: "Multi-factor authentication, OAuth 2.0, and role-based access control to keep your account secure." },
  { icon: Eye, title: "Privacy by Design", desc: "Minimal data collection, transparent policies, and full compliance with GDPR, CCPA, and other regulations." },
  { icon: Shield, title: "Vulnerability Management", desc: "Regular penetration testing, bug bounty program, and 24/7 security monitoring." },
  { icon: CheckCircle, title: "Compliance", desc: "SOC 2 Type II compliant. Regular third-party audits ensure our security practices meet the highest standards." },
];

const Security = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <CyberpunkDecorations />
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">Security</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Security is Our <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">Top Priority</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We use industry-leading security practices to protect your data, projects, and privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            {securityFeatures.map((feature) => (
              <Card key={feature.title} className="hover:border-primary/30 transition-all duration-300 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <feature.icon className="w-10 h-10 mb-4 text-primary" />
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Report Section */}
          <Card className="max-w-2xl mx-auto bg-card/50 backdrop-blur-sm border-primary/10">
            <CardContent className="p-8 text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-bold mb-2">Report a Vulnerability</h2>
              <p className="text-muted-foreground mb-4">
                Found a security issue? We appreciate responsible disclosure. Contact our security team at <span className="text-primary font-mono">security@redtown2.com</span>.
              </p>
              <Badge variant="secondary">Bug Bounty Program Available</Badge>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Security;
