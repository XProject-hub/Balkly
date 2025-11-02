"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireVerified?: boolean;
  requireRole?: string;
}

export default function ProtectedRoute({
  children,
  requireVerified = false,
  requireRole,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/auth/login");
        return;
      }

      if (requireVerified && !user?.email_verified_at) {
        router.push("/auth/verify-email");
        return;
      }

      if (requireRole && user?.role !== requireRole) {
        router.push("/");
        return;
      }
    }
  }, [loading, isAuthenticated, user, requireVerified, requireRole, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requireVerified && !user?.email_verified_at) {
    return null;
  }

  if (requireRole && user?.role !== requireRole) {
    return null;
  }

  return <>{children}</>;
}

