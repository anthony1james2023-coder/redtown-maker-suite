import CyberpunkDecorations from "@/components/CyberpunkDecorations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const contactMethods = [
  { icon: Mail, label: "Email Us", value: "support@redtown2.com", desc: "We reply within 24 hours" },
  { icon: MessageSquare, label: "Discord", value: "discord.gg/redtown2", desc: "Get instant help from the community" },
  { icon: MapPin, label: "Location", value: "San Francisco, CA", desc: "Remote-first company" },
  { icon: Clock, label: "Hours", value: "Mon-Fri 9am-6pm PST", desc: "Weekend support via Discord" },
];

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setName(""); setEmail(""); setSubject(""); setMessage("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">Contact</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get in <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Have a question, feedback, or partnership inquiry? We'd love to hear from you.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {contactMethods.map((method) => (
              <Card key={method.label} className="text-center bg-card/50 backdrop-blur-sm border-primary/10">
                <CardContent className="p-5">
                  <method.icon className="w-7 h-7 mx-auto mb-2 text-primary" />
                  <div className="font-bold text-sm mb-1">{method.label}</div>
                  <div className="text-xs text-primary/80 mb-1">{method.value}</div>
                  <div className="text-[10px] text-muted-foreground">{method.desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          <Card className="max-w-2xl mx-auto bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
                  <Input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <Input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                <Textarea placeholder="Your message..." value={message} onChange={(e) => setMessage(e.target.value)} rows={6} required />
                <Button type="submit" className="w-full" size="lg">
                  <Send className="w-4 h-4 mr-2" /> Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
