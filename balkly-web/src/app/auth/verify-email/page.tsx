"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  
  const email = searchParams.get("email") || "";
  const isNewRegistration = searchParams.get("registered") === "true";

  const handleResend = async () => {
    if (!email) {
      setStatus("error");
      setMessage("No email address provided. Please try registering again.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.balkly.live'}/api/v1/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus("success");
        setMessage("Verification email sent! Please check your inbox.");
      } else {
        setStatus("error");
        setMessage("Failed to send verification email. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            {status === "success" ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : status === "error" ? (
              <AlertCircle className="h-8 w-8 text-destructive" />
            ) : (
              <Mail className="h-8 w-8 text-primary" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isNewRegistration ? "Registration Successful!" : "Verify Your Email"}
          </CardTitle>
          <CardDescription>
            {status === "idle" && (
              <>
                {isNewRegistration 
                  ? "We've sent a verification link to your email address."
                  : "Please verify your email to continue."}
              </>
            )}
            {status === "success" && message}
            {status === "error" && message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {email && (
            <div className="bg-muted/50 px-4 py-3 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">Verification email sent to:</p>
              <p className="font-medium">{email}</p>
            </div>
          )}

          {status === "idle" && (
            <>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-4 py-3 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Important:</strong> You must verify your email before you can log in.
                  Click the link in the email we sent you.
                </p>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                Didn't receive the email? Check your spam folder or request a new one.
              </p>

              <Button
                onClick={handleResend}
                disabled={loading || !email}
                className="w-full"
                variant="outline"
              >
                {loading ? "Sending..." : "Resend Verification Email"}
              </Button>
            </>
          )}

          {status === "success" && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Check your email and click the verification link to continue.
              </p>
            </div>
          )}

          <div className="pt-4 border-t">
            <Link href="/auth/login">
              <Button variant="ghost" className="w-full group">
                Go to Login
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
