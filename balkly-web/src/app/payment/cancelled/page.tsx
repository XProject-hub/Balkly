"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelledPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            Payment Cancelled
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You cancelled the payment. No charges have been made.
          </p>
          
          <div className="space-y-3">
            <Button className="w-full" asChild>
              <Link href="/dashboard/listings">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to My Listings
              </Link>
            </Button>
            
            <Button variant="outline" className="w-full" asChild>
              <Link href="/">
                Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

