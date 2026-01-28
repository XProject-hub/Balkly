"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in and is admin
    const token = localStorage.getItem("auth_token");
    const userStr = localStorage.getItem("user");
    
    if (!token || !userStr) {
      router.push("/auth/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      
      if (user.role !== "admin") {
        // Not admin - redirect to home
        toast.error("Access denied. Admin privileges required.");
        router.push("/");
        return;
      }
    } catch (e) {
      // Invalid user data - redirect to login
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      router.push("/auth/login");
    }
  }, [router]);

  return <>{children}</>;
}

