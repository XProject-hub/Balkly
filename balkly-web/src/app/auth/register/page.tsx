"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authAPI } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.register(formData);
      
      if (response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        window.dispatchEvent(new Event('auth-change'));
        
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 100);
      } else {
        router.push(`/auth/verify-email?email=${encodeURIComponent(formData.email)}&registered=true`);
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      const errorMsg = err.response?.data?.message || err.response?.data?.errors || "Registration failed. Please try again.";
      
      // If errors is an object, format it
      if (typeof errorMsg === 'object') {
        const firstError = Object.values(errorMsg)[0];
        setError(Array.isArray(firstError) ? firstError[0] : String(firstError));
      } else {
        setError(String(errorMsg));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">{t.auth.registerTitle}</CardTitle>
          <CardDescription>{t.auth.registerSubtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="register-name" className="block text-sm font-medium mb-2">{t.auth.fullName}</label>
              <input
                id="register-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="register-email" className="block text-sm font-medium mb-2">{t.auth.email}</label>
              <input
                id="register-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="register-password" className="block text-sm font-medium mb-2">{t.auth.password}</label>
              <input
                id="register-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={8}
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="register-confirm" className="block text-sm font-medium mb-2">{t.auth.confirmPassword}</label>
              <input
                id="register-confirm"
                type="password"
                value={formData.password_confirmation}
                onChange={(e) =>
                  setFormData({ ...formData, password_confirmation: e.target.value })
                }
                required
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-start">
              <input id="terms" type="checkbox" required className="mt-1 mr-2" />
              <label htmlFor="terms" className="text-sm">
                {t.auth.byRegistering}{" "}
                <Link href="/terms" className="text-primary hover:underline">{t.auth.termsOfService}</Link>{" "}
                {t.auth.and}{" "}
                <Link href="/privacy" className="text-primary hover:underline">{t.auth.privacyPolicy}</Link>
              </label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t.common.loading : t.auth.registerBtn}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              {t.auth.hasAccount}{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                {t.auth.loginLink}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

