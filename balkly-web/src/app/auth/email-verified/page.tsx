"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function EmailVerifiedPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-balkly-blue to-iris-purple flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardContent className="pt-12 pb-12">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src="/logo.png" 
              alt="Balkly" 
              className="h-24 mx-auto"
            />
          </div>

          {/* Success Icon */}
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>

          {/* Message */}
          <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-gray-100">
            Email Verified!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Your account has been successfully verified.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Redirecting to dashboard in {countdown} seconds...
          </p>

          {/* Manual redirect button */}
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 text-balkly-blue hover:underline font-medium"
          >
            Go to Dashboard Now →
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

