import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function RefundPolicyPage() {
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
          <h1 className="text-4xl font-bold">Refund Policy</h1>
          <p className="text-lg opacity-90 mt-2">Last updated: November 2025</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card>
          <CardContent className="prose max-w-none p-8">
            <h2>Refund Policy Overview</h2>
            <p>
              At Balkly, we strive to ensure customer satisfaction. This policy outlines our 
              refund procedures for different types of purchases.
            </p>

            <h2>Listing Fees</h2>
            <h3>Standard, Featured, and Boost Plans</h3>
            <ul>
              <li><strong>Non-refundable after publication</strong>: Once your listing goes live, the fee is not refundable</li>
              <li><strong>Before publication</strong>: Full refund if listing is cancelled before going live</li>
              <li><strong>Technical issues</strong>: Full refund if we cannot publish your listing due to technical problems</li>
            </ul>

            <h2>Forum Sticky Posts</h2>
            <ul>
              <li><strong>Non-refundable</strong>: Sticky post fees are non-refundable once activated</li>
              <li><strong>Before activation</strong>: Full refund if cancelled before sticky period begins</li>
            </ul>

            <h2>Event Tickets</h2>
            <h3>Balkly Ticketing</h3>
            <ul>
              <li><strong>Cancellation window</strong>: Refunds available up to 48 hours before event</li>
              <li><strong>Event cancellation</strong>: Full refund if event is cancelled by organizer</li>
              <li><strong>Event postponement</strong>: Ticket valid for new date, or refund available</li>
              <li><strong>Processing fee</strong>: €0.35 per ticket is non-refundable</li>
            </ul>

            <h3>Affiliate/Partner Events</h3>
            <ul>
              <li>Refund policy determined by event organizer</li>
              <li>Contact the partner directly for refund requests</li>
            </ul>

            <h2>Refund Processing</h2>
            <h3>Timeline</h3>
            <ul>
              <li><strong>Review</strong>: 1-3 business days</li>
              <li><strong>Approval</strong>: Email notification sent</li>
              <li><strong>Processing</strong>: 5-10 business days to original payment method</li>
            </ul>

            <h3>How to Request</h3>
            <ol>
              <li>Login to your account</li>
              <li>Go to Dashboard → Orders</li>
              <li>Select the order</li>
              <li>Click "Request Refund"</li>
              <li>Provide reason for refund</li>
            </ol>

            <h2>Exceptions</h2>
            <p>Refunds will not be issued for:</p>
            <ul>
              <li>Change of mind after publication</li>
              <li>Seller disputes (handled through mediation)</li>
              <li>Completed transactions between users</li>
            </ul>

            <h2>Governing Law</h2>
            <p>
              This Refund Policy is governed by the laws of the United Arab Emirates. 
              All refund disputes shall be resolved in accordance with UAE consumer protection regulations.
            </p>

            <h2>Contact Us</h2>
            <p>
              <strong>NoLimitsDevelopments LLC</strong><br />
              Dubai, United Arab Emirates<br />
              Email: <a href="mailto:refunds@balkly.live" className="text-balkly-blue hover:underline">refunds@balkly.live</a><br />
              Support: <a href="mailto:support@balkly.live" className="text-balkly-blue hover:underline">support@balkly.live</a><br />
              Or contact us through our <Link href="/contact" className="text-balkly-blue hover:underline">support page</Link>
            </p>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg border-l-4 border-balkly-blue">
              <p className="font-medium text-gray-900 mb-2">📧 Need Help with a Refund?</p>
              <p className="text-sm text-gray-700 mb-3">
                Our support team is here to assist with any refund-related questions. 
                We aim to respond within 24 hours.
              </p>
              <p className="text-xs text-gray-600">
                Response time: Mon-Fri 9AM-6PM GST (Gulf Standard Time)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

