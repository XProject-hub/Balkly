"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            Payment Failed
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Something went wrong with your payment. Please try again or contact support.
          </p>
          
          <div className="space-y-3">
            <Button className="w-full" asChild>
              <Link href="/dashboard/listings">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to My Listings
              </Link>
            </Button>
            
            <Button variant="outline" className="w-full" asChild>
              <Link href="/contact">
                <Mail className="mr-2 h-4 w-4" />
                Contact Support
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

