"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Search, MessageCircle, Mail } from "lucide-react";

const FAQS = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How do I create an account?",
        a: "Click 'Sign Up' in the top right corner, enter your details, and verify your email address.",
      },
      {
        q: "Is registration free?",
        a: "Yes! Registration is completely free. You only pay when posting listings or purchasing premium features.",
      },
    ],
  },
  {
    category: "Listings",
    questions: [
      {
        q: "How much does it cost to post a listing?",
        a: "Listing fees vary by category: Auto (€4.99-€14.99), Real Estate (€9.99-€25.99) for 30 days.",
      },
      {
        q: "How long does my listing stay active?",
        a: "Standard listings stay active for 30 days. You can renew or upgrade at any time.",
      },
      {
        q: "Can I edit my listing after posting?",
        a: "Yes! You can edit, pause, or delete your listing anytime from your dashboard.",
      },
    ],
  },
  {
    category: "Payments",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit and debit cards through Stripe (Visa, Mastercard, Amex).",
      },
      {
        q: "Will I receive an invoice?",
        a: "Yes! A PDF invoice with VAT is generated automatically for every purchase.",
      },
      {
        q: "What is your refund policy?",
        a: "Listing fees are non-refundable after publication. Event tickets follow the organizer's refund policy.",
      },
    ],
  },
  {
    category: "Events & Tickets",
    questions: [
      {
        q: "How do I receive my tickets?",
        a: "Tickets are delivered instantly via email with QR codes. You can also download them from your dashboard.",
      },
      {
        q: "How do I use my QR code ticket?",
        a: "Simply show your QR code at the event entrance. It will be scanned for verification.",
      },
    ],
  },
  {
    category: "Safety",
    questions: [
      {
        q: "How do I stay safe when buying?",
        a: "Meet in public places, inspect items before payment, never send money in advance, and report suspicious listings.",
      },
      {
        q: "How do I report a listing?",
        a: "Click the flag icon on any listing to report it. Our team reviews all reports within 24 hours.",
      },
    ],
  },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return FAQS;

    const q = searchQuery.toLowerCase();
    return FAQS
      .map((section) => ({
        ...section,
        questions: section.questions.filter(
          (faq) =>
            faq.q.toLowerCase().includes(q) ||
            faq.a.toLowerCase().includes(q) ||
            section.category.toLowerCase().includes(q)
        ),
      }))
      .filter((section) => section.questions.length > 0);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="secondary" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-5xl font-bold mb-4">Help Center</h1>
          <p className="text-xl opacity-90 mb-8">
            Find answers to common questions
          </p>

          {/* Search Help */}
          <div className="max-w-2xl">
            <div className="flex gap-2 bg-white/10 backdrop-blur-md rounded-lg p-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
                <input
                  type="text"
                  placeholder="Search help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/90 text-foreground"
                />
              </div>
              {searchQuery && (
                <Button variant="secondary" onClick={() => setSearchQuery("")}>
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <MessageCircle className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Get help from our team</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Mail className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Email Us</CardTitle>
              <CardDescription>Send us a message</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <a href="mailto:support@balkly.live">support@balkly.live</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Search className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Browse Topics</CardTitle>
              <CardDescription>Common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Explore FAQs below
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto space-y-8">
          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try searching with different keywords or{" "}
                <button onClick={() => setSearchQuery("")} className="text-primary hover:underline">
                  clear the search
                </button>
              </p>
            </div>
          )}
          {filteredFaqs.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-2xl font-bold mb-4">{section.category}</h2>
              <div className="space-y-4">
                {section.questions.map((faq, qIdx) => (
                  <Card key={qIdx}>
                    <CardHeader>
                      <CardTitle className="text-lg">{faq.q}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{faq.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <Card className="mt-12 bg-primary text-primary-foreground">
          <CardContent className="py-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
            <p className="mb-6 opacity-90">
              Our support team is here to assist you
            </p>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
