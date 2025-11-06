import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-iris-purple to-teal-glow text-white py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-5xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-xl text-white/90">Last Updated: November 6, 2025</p>
          <p className="text-white/80 mt-4">NoLimitsDevelopments LLC • Dubai, UAE</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 lg:p-16">
          <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b-2 prose-h2:border-iris-purple/20 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-4 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-li:text-gray-700 prose-li:mb-2 prose-strong:text-gray-900 prose-a:text-balkly-blue prose-a:no-underline hover:prose-a:underline prose-ul:my-6 prose-ol:my-6">
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

            <h2>Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. Check this page periodically for changes.
            </p>

            <h2>Contact Us</h2>
            <p>
              <strong>NoLimitsDevelopments LLC</strong><br />
              Dubai, United Arab Emirates<br />
              Email: <a href="mailto:privacy@balkly.live" className="text-balkly-blue hover:underline">privacy@balkly.live</a>
            </p>
            
            <hr className="my-8" />
            
            <p className="text-sm text-gray-600">
              This Cookie Policy complies with UAE Federal Decree-Law No. 45 of 2021 on the Protection 
              of Personal Data and international privacy standards.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

