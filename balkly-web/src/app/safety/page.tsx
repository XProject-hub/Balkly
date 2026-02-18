import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export default function SafetyTipsPage() {
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
          <div className="max-w-3xl">
            <Shield className="h-16 w-16 mb-4" />
            <h1 className="text-5xl font-bold mb-4">Safety Tips</h1>
            <p className="text-xl opacity-90">
              Stay safe while buying and selling on Balkly
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* General Safety */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Shield className="mr-2 h-6 w-6" />
              General Safety Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-3 flex items-center text-green-700">
                <CheckCircle className="mr-2 h-5 w-5" />
                DO's
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Meet in well-lit public places (shopping centers, cafes, police stations)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Bring a friend or family member with you</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Inspect items thoroughly before making payment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Check seller's profile and ratings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Use our messaging system to communicate</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Trust your instincts - if something feels wrong, walk away</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3 flex items-center text-red-700">
                <XCircle className="mr-2 h-5 w-5" />
                DON'Ts
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Never send money in advance or via wire transfer</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Don't share your bank details or passwords</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Avoid meeting at private or secluded locations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Don't accept checks or money orders</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Never click suspicious links or download unknown files</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Don't communicate outside of Balkly's platform</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Specific Scenarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Buying Safely</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>• Research the item's market value beforehand</p>
              <p>• Ask for proof of ownership</p>
              <p>• Test electronics and appliances before buying</p>
              <p>• For vehicles, request service history and inspection</p>
              <p>• Get everything in writing</p>
              <p>• Report suspicious sellers immediately</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Selling Safely</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>• Use clear, honest descriptions</p>
              <p>• Take photos in good lighting</p>
              <p>• Never give out personal information</p>
              <p>• Meet buyers in public places</p>
              <p>• Accept cash or verified payment methods only</p>
              <p>• Remove listing once sold</p>
            </CardContent>
          </Card>
        </div>

        {/* Warning Signs */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="mr-2 h-6 w-6" />
              Warning Signs of Scams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-destructive mr-2">⚠</span>
                <span>Prices that seem too good to be true</span>
              </li>
              <li className="flex items-start">
                <span className="text-destructive mr-2">⚠</span>
                <span>Requests to communicate outside the platform</span>
              </li>
              <li className="flex items-start">
                <span className="text-destructive mr-2">⚠</span>
                <span>Pressure to act quickly or urgently</span>
              </li>
              <li className="flex items-start">
                <span className="text-destructive mr-2">⚠</span>
                <span>Requests for advance payment or deposits</span>
              </li>
              <li className="flex items-start">
                <span className="text-destructive mr-2">⚠</span>
                <span>Poor grammar or suspicious language</span>
              </li>
              <li className="flex items-start">
                <span className="text-destructive mr-2">⚠</span>
                <span>Seller/buyer refuses to meet in person</span>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-destructive/10 rounded-lg">
              <p className="font-bold mb-2">If you suspect fraud:</p>
              <p className="text-sm mb-4">Report the listing immediately using the flag icon, and contact our support team.</p>
              <Button variant="destructive" asChild>
                <Link href="/contact">Report Suspicious Activity</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Safety */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Payment Safety</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-bold mb-2">For On-Platform Purchases (Event Tickets):</h4>
                <p>
                  Your payment is protected by Stripe. Never pay outside the platform for tickets
                  or services that can be purchased through Balkly.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2">For Direct Transactions:</h4>
                <p>
                  Pay only after receiving and inspecting the item. Use cash or verified payment
                  methods. Never send money via wire transfer or cryptocurrency for local deals.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card className="mt-8 bg-primary text-primary-foreground">
          <CardContent className="py-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Need Immediate Help?</h2>
            <p className="mb-6 opacity-90">
              If you've been a victim of fraud or feel unsafe, contact us immediately
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="secondary" size="lg" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button variant="outline" size="lg" className="bg-transparent" asChild>
                <a href="mailto:safety@balkly.live">safety@balkly.live</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

