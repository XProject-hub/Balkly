"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleResend = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/auth/send-verification", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
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
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription>
            {status === "idle" && "We've sent a verification link to your email address"}
            {status === "success" && message}
            {status === "error" && message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "idle" && (
            <>
              <p className="text-sm text-muted-foreground text-center">
                Click the link in the email to verify your account. If you didn't receive the email, you can request a new one.
              </p>

              <Button
                onClick={handleResend}
                disabled={loading}
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
              <Button onClick={() => router.push("/dashboard")} className="w-full">
                Go to Dashboard
              </Button>
            </div>
          )}

          <div className="text-center text-sm">
            <Link href="/dashboard" className="text-primary hover:underline">
              Skip for now
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

