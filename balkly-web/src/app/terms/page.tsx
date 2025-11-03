import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
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
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-lg opacity-90 mt-2">Last updated: November 2, 2025</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card>
          <CardContent className="prose max-w-none p-8">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Balkly ("the Platform"), you accept and agree to be bound by the terms
              and provision of this agreement. If you do not agree to abide by the above, please do not use
              this service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              Balkly provides an online marketplace platform that enables users to:
            </p>
            <ul>
              <li>Post and browse classified listings</li>
              <li>Participate in community forum discussions</li>
              <li>Purchase event tickets</li>
              <li>Communicate with other users</li>
              <li>Access paid premium features</li>
            </ul>

            <h2>3. User Accounts</h2>
            <p>
              To access certain features of the Platform, you must register for an account. You agree to:
            </p>
            <ul>
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the security of your password and account</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Be responsible for all activities that occur under your account</li>
            </ul>

            <h2>4. Listing Policies</h2>
            <p>
              When creating listings, you agree to:
            </p>
            <ul>
              <li>Provide truthful and accurate descriptions</li>
              <li>Not post prohibited or illegal items</li>
              <li>Own the rights to all images and content posted</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Pay applicable listing fees before publication</li>
            </ul>

            <h2>5. Payment Terms</h2>
            <p>
              <strong>Listing Fees:</strong> Fees are charged based on the selected plan (Standard, Featured, or Boost).
              All fees are non-refundable unless otherwise stated.
            </p>
            <p>
              <strong>Event Tickets:</strong> A service fee of 7.5% + €0.35 per ticket applies to all ticket purchases.
            </p>
            <p>
              <strong>Forum Sticky:</strong> Fees for sticky posts are charged upfront for the selected duration.
            </p>

            <h2>6. Refund Policy</h2>
            <p>
              Refunds are handled on a case-by-case basis. For ticket refunds, please refer to the event
              organizer's specific refund policy. Listing fees are generally non-refundable after publication.
            </p>

            <h2>7. Prohibited Content</h2>
            <p>
              You may not post content that:
            </p>
            <ul>
              <li>Is illegal, fraudulent, or deceptive</li>
              <li>Infringes intellectual property rights</li>
              <li>Contains adult or offensive material</li>
              <li>Promotes violence or discrimination</li>
              <li>Contains spam or malicious code</li>
            </ul>

            <h2>8. Moderation</h2>
            <p>
              We reserve the right to review, reject, or remove any content that violates these terms.
              Content may be reviewed by automated systems and human moderators.
            </p>

            <h2>9. Intellectual Property</h2>
            <p>
              The Platform and its original content, features, and functionality are owned by Balkly and are
              protected by international copyright, trademark, and other intellectual property laws.
            </p>

            <h2>10. Limitation of Liability</h2>
            <p>
              Balkly shall not be liable for any indirect, incidental, special, consequential, or punitive
              damages resulting from your use or inability to use the service.
            </p>

            <h2>11. Dispute Resolution</h2>
            <p>
              Any disputes arising from the use of this Platform shall be resolved through mediation or
              arbitration in accordance with the laws of Bosnia and Herzegovina.
            </p>

            <h2>12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective immediately
              upon posting. Your continued use of the Platform constitutes acceptance of the modified terms.
            </p>

            <h2>13. Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact us at:
            </p>
            <p>
              <strong>Email:</strong> legal@balkly.com<br>
              <strong>Address:</strong> Balkly Platform, Bosnia and Herzegovina
            </p>

            <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
              <p style="text-align: center; color: #6b7280;">
                By using Balkly, you acknowledge that you have read and understood these Terms of Service.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

