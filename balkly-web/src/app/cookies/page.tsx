import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="text-white py-12" style={{background: 'linear-gradient(135deg, #0F172A 0%, #111827 100%)'}}>
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="secondary" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold">Cookie Policy</h1>
          <p className="text-lg opacity-90 mt-2">Last updated: November 2025</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card>
          <CardContent className="prose max-w-none p-8">
            <h2>What Are Cookies</h2>
            <p>
              Cookies are small text files that are stored on your device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences and 
              understanding how you use our platform.
            </p>

            <h2>How We Use Cookies</h2>
            <h3>Essential Cookies</h3>
            <p>Required for the platform to function:</p>
            <ul>
              <li><strong>Authentication</strong>: Keep you logged in</li>
              <li><strong>Security</strong>: CSRF protection and secure sessions</li>
              <li><strong>Preferences</strong>: Language and currency selection</li>
            </ul>

            <h3>Analytics Cookies</h3>
            <p>Help us understand how visitors use our platform:</p>
            <ul>
              <li>Page views and navigation patterns</li>
              <li>Time spent on pages</li>
              <li>Device and browser information</li>
              <li>Aggregated, anonymous usage data</li>
            </ul>

            <h3>Functional Cookies</h3>
            <p>Enhance your experience:</p>
            <ul>
              <li>Remember your search filters</li>
              <li>Saved preferences</li>
              <li>Recently viewed items</li>
            </ul>

            <h2>Managing Cookies</h2>
            <p>
              You can control cookies through your browser settings. However, disabling certain 
              cookies may limit some platform features.
            </p>

            <h3>Browser Controls</h3>
            <ul>
              <li><strong>Chrome</strong>: Settings → Privacy and security → Cookies</li>
              <li><strong>Firefox</strong>: Options → Privacy & Security → Cookies</li>
              <li><strong>Safari</strong>: Preferences → Privacy → Cookies</li>
            </ul>

            <h2>Third-Party Cookies</h2>
            <p>We use the following third-party services that may set cookies:</p>
            <ul>
              <li><strong>Stripe</strong>: For secure payment processing</li>
              <li><strong>Google Analytics</strong>: For website analytics (if enabled)</li>
            </ul>

            <h2>Your Consent</h2>
            <p>
              By using Balkly, you consent to our use of cookies as described in this policy.
            </p>

            <h2>Contact Us</h2>
            <p>
              Questions about cookies? Contact us at privacy@balkly.com
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

