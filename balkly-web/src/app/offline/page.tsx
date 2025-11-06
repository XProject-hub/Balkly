import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-mist-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-12 pb-8 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <WifiOff className="h-10 w-10 text-gray-400" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            You're Offline
          </h1>
          
          <p className="text-gray-600 mb-8">
            No internet connection. Please check your network and try again.
          </p>

          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-balkly-blue to-iris-purple text-white"
          >
            Try Again
          </Button>

          <div className="mt-8 text-sm text-gray-500">
            <p>Some features may be available offline.</p>
            <p className="mt-2">
              <Link href="/" className="text-balkly-blue hover:underline">
                Return to homepage
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

