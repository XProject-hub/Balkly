"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, LogIn } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EmailVerifiedPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown timer - redirect to login page
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/auth/login");
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
            <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-bounce">
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
          <p className="text-lg font-medium text-green-600 dark:text-green-400 mb-4">
            You can now log in to your account!
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Redirecting to login in {countdown} seconds...
          </p>

          {/* Manual redirect button */}
          <Button
            onClick={() => router.push("/auth/login")}
            className="mt-6 w-full"
            size="lg"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Log In Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

