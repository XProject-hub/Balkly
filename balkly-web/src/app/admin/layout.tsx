"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const userStr = localStorage.getItem("user");
    
    if (!token || !userStr) {
      router.push("/auth/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      
      if (user.role !== "admin") {
        toast.error("Access denied. Admin privileges required.");
        router.push("/");
        return;
      }

      // Also verify with API to prevent localStorage manipulation
      fetch("/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json()).then(data => {
        if (data.user?.role === 'admin') {
          setAuthorized(true);
        } else {
          toast.error("Access denied. Admin privileges required.");
          router.push("/");
        }
      }).catch(() => {
        router.push("/auth/login");
      });
    } catch (e) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      router.push("/auth/login");
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return <>{children}</>;
}

