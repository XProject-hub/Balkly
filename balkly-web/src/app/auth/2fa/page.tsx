"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, ArrowLeft } from "lucide-react";

export default function TwoFactorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id");

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/v1/auth/2fa/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          code,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Store token
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        const data = await response.json();
        setError(data.message || "Invalid code. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Smartphone className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
          <CardDescription>
            Enter the 6-digit code from your authenticator app
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 text-center">
                Verification Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="w-full px-4 py-3 border rounded-lg text-center text-3xl tracking-widest font-mono"
                maxLength={6}
                autoFocus
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading || code.length !== 6}>
              {loading ? "Verifying..." : "Verify"}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Lost your device?{" "}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => {
                    const recoveryCode = prompt("Enter a recovery code:");
                    if (recoveryCode) {
                      setCode(recoveryCode);
                    }
                  }}
                >
                  Use recovery code
                </button>
              </p>
              <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center">
                <ArrowLeft className="mr-1 h-3 w-3" />
                Back to Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

