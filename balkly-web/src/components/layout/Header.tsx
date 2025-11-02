"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Search,
  User,
  Menu,
  X,
  Package,
  Calendar,
  MessageCircle,
  LogOut,
  Settings,
  LayoutDashboard,
} from "lucide-react";

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary">Balkly</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/listings"
              className="flex items-center text-sm font-medium hover:text-primary transition-colors"
            >
              <Package className="h-4 w-4 mr-1" />
              Listings
            </Link>
            <Link
              href="/events"
              className="flex items-center text-sm font-medium hover:text-primary transition-colors"
            >
              <Calendar className="h-4 w-4 mr-1" />
              Events
            </Link>
            <Link
              href="/forum"
              className="flex items-center text-sm font-medium hover:text-primary transition-colors"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Forum
            </Link>
          </nav>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
              />
            </div>
          </form>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            {isLoggedIn ? (
              <>
                <Button variant="outline" size="sm" asChild className="hidden md:flex">
                  <Link href="/listings/create">
                    <Package className="h-4 w-4 mr-2" />
                    Post Listing
                  </Link>
                </Button>
                
                <div className="relative group">
                  <Button variant="ghost" size="sm" className="hidden md:flex">
                    <User className="h-4 w-4 mr-2" />
                    {user?.name}
                  </Button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-2 text-sm hover:bg-accent rounded-t-lg"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/messages"
                      className="flex items-center px-4 py-2 text-sm hover:bg-accent"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Messages
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm hover:bg-accent"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                    {user?.role === "admin" && (
                      <Link
                        href="/admin"
                        className="flex items-center px-4 py-2 text-sm hover:bg-accent border-t"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-accent rounded-b-lg text-destructive"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>
            </form>

            <nav className="space-y-2">
              <Link
                href="/listings"
                className="flex items-center px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg"
              >
                <Package className="h-4 w-4 mr-2" />
                Listings
              </Link>
              <Link
                href="/events"
                className="flex items-center px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Events
              </Link>
              <Link
                href="/forum"
                className="flex items-center px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Forum
              </Link>

              {isLoggedIn ? (
                <>
                  <div className="border-t my-2" />
                  <Link
                    href="/listings/create"
                    className="flex items-center px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Post Listing
                  </Link>
                  <Link
                    href="/dashboard"
                    className="flex items-center px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg"
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/messages"
                    className="flex items-center px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Messages
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      href="/admin"
                      className="flex items-center px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t my-2" />
                  <Link
                    href="/auth/login"
                    className="flex items-center px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="flex items-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

