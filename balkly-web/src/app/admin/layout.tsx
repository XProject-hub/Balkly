"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

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

    const user = JSON.parse(userStr);
    
    if (user.role !== "admin") {
      // Not admin - redirect to home
      router.push("/");
      alert("Access denied. Admin privileges required.");
      return;
    }
  }, [router]);

  return <>{children}</>;
}

