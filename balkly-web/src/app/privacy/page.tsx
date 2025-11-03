import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="secondary" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-lg opacity-90 mt-2">Last updated: November 2, 2025</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card>
          <CardContent className="prose max-w-none p-8">
            <h2>1. Introduction</h2>
            <p>
              Balkly ("we," "our," or "us") respects your privacy and is committed to protecting your personal
              data. This privacy policy explains how we collect, use, and safeguard your information when you
              use our platform.
            </p>

            <h2>2. Information We Collect</h2>
            
            <h3>2.1 Information You Provide</h3>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, password, phone number</li>
              <li><strong>Profile Information:</strong> Bio, location, company details, VAT ID</li>
              <li><strong>Listing Information:</strong> Titles, descriptions, images, prices, locations</li>
              <li><strong>Payment Information:</strong> Processed securely by Stripe (we don't store card details)</li>
              <li><strong>Communication:</strong> Messages, forum posts, support inquiries</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <ul>
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent</li>
              <li><strong>Device Information:</strong> IP address, browser type, device type</li>
              <li><strong>Cookies:</strong> Session cookies, preference cookies, analytics cookies</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide and maintain our services</li>
              <li>Process payments and generate invoices</li>
              <li>Send transactional emails (order confirmations, tickets, notifications)</li>
              <li>Improve and personalize your experience</li>
              <li>Detect and prevent fraud and abuse</li>
              <li>Moderate content for safety</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>4. Smart Enhancement Features</h2>
            <p>
              Our platform uses automated systems to enhance your listings (title improvements, translations).
              This processing is done securely and your content is not stored by third-party services longer
              than necessary for processing.
            </p>

            <h2>5. Data Sharing</h2>
            <p>We may share your information with:</p>
            <ul>
              <li><strong>Payment Processors:</strong> Stripe for payment processing</li>
              <li><strong>Email Services:</strong> SendGrid/Postmark for transactional emails</li>
              <li><strong>Cloud Storage:</strong> For storing images and files</li>
              <li><strong>Analytics:</strong> Aggregated, anonymized data only</li>
            </ul>
            <p>We <strong>never</strong> sell your personal data to third parties.</p>

            <h2>6. Data Security</h2>
            <p>
              We implement appropriate security measures including:
            </p>
            <ul>
              <li>Encryption of data in transit (HTTPS/SSL)</li>
              <li>Secure password hashing (Argon2id)</li>
              <li>Two-factor authentication (optional)</li>
              <li>Regular security audits</li>
              <li>Access controls and monitoring</li>
            </ul>

            <h2>7. Your Rights (GDPR)</h2>
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of your data</li>
              <li><strong>Rectification:</strong> Correct inaccurate data</li>
              <li><strong>Erasure:</strong> Request deletion of your data</li>
              <li><strong>Portability:</strong> Export your data</li>
              <li><strong>Object:</strong> Object to certain processing</li>
              <li><strong>Withdraw Consent:</strong> Opt-out of marketing communications</li>
            </ul>
            <p>To exercise these rights, contact us at: privacy@balkly.com</p>

            <h2>8. Data Retention</h2>
            <p>
              We retain your personal data only as long as necessary for the purposes outlined in this policy
              or as required by law. Account data is retained while your account is active and for 30 days
              after deletion for backup purposes.
            </p>

            <h2>9. Cookies</h2>
            <p>
              We use cookies to:
            </p>
            <ul>
              <li>Maintain your session and keep you logged in</li>
              <li>Remember your preferences</li>
              <li>Analyze platform usage (anonymized)</li>
              <li>Improve platform performance</li>
            </ul>
            <p>You can control cookies through your browser settings.</p>

            <h2>10. Children's Privacy</h2>
            <p>
              Our service is not intended for users under 18 years of age. We do not knowingly collect
              personal information from children. If you become aware that a child has provided us with
              personal data, please contact us.
            </p>

            <h2>11. International Data Transfers</h2>
            <p>
              Your information may be transferred to and maintained on servers located outside your country.
              By using our service, you consent to such transfers while we ensure appropriate safeguards.
            </p>

            <h2>12. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of significant changes
              via email or platform notification. Continued use after changes constitutes acceptance.
            </p>

            <h2>13. Contact Us</h2>
            <p>
              For privacy-related questions or concerns:
            </p>
            <p>
              <strong>Email:</strong> privacy@balkly.com<br>
              <strong>Data Protection Officer:</strong> dpo@balkly.com<br>
              <strong>Address:</strong> Balkly Platform, Bosnia and Herzegovina
            </p>

            <div style="margin-top: 40px; padding: 20px; background: #f9fafb; border-radius: 8px;">
              <p style="margin: 0; text-align: center; color: #6b7280;">
                <strong>Your privacy matters to us.</strong> We're committed to protecting your personal information
                and being transparent about how we use it.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

