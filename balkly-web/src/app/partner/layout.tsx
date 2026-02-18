"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, Tag, BarChart3, ScanLine, Loader2 } from "lucide-react";

const NAV_ITEMS = [
  { href: "/partner", label: "Dashboard", icon: LayoutDashboard },
  { href: "/partner/staff", label: "Staff", icon: Users },
  { href: "/partner/offers", label: "Offers", icon: Tag },
  { href: "/partner/conversions", label: "Conversions", icon: BarChart3 },
  { href: "/partner/scan", label: "Scan QR", icon: ScanLine },
];

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) { router.push("/auth/login"); return; }

        const res = await fetch("/api/v1/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          const role = data.user?.role;
          if (role === "partner" || role === "staff" || role === "admin") {
            setAuthorized(true);
            setUserRole(role);
          } else {
            router.push("/dashboard");
          }
        } else {
          router.push("/auth/login");
        }
      } catch {
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authorized) return null;

  const isStaffOnly = userRole === "staff";

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-1 overflow-x-auto py-3">
            {NAV_ITEMS.map((item) => {
              if (isStaffOnly && item.href === "/partner/staff") return null;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                    active
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
