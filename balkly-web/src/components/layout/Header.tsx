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
  Moon,
  Sun,
} from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CurrencySwitcher from "@/components/CurrencySwitcher";
import { useTranslation } from "@/lib/i18n/translations";

export default function Header() {
  const router = useRouter();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("auth_token");
      const userData = localStorage.getItem("user");
      
      if (token && userData) {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    // Check auth on mount
    checkAuth();

    // Listen for auth changes
    window.addEventListener('auth-change', checkAuth);
    window.addEventListener('storage', checkAuth);

    // Get theme from localStorage
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }

    return () => {
      window.removeEventListener('auth-change', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

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
    <header className="border-b bg-white dark:bg-gray-900 sticky top-0 z-50 shadow-sm">
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
              {t('nav.listings')}
            </Link>
            <Link
              href="/events"
              className="flex items-center text-sm font-medium hover:text-primary transition-colors"
            >
              <Calendar className="h-4 w-4 mr-1" />
              {t('nav.events')}
            </Link>
            <Link
              href="/forum"
              className="flex items-center text-sm font-medium hover:text-primary transition-colors"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              {t('nav.forum')}
            </Link>
            {isLoggedIn && (
              <Link
                href="/dashboard"
                className="flex items-center text-sm font-medium hover:text-primary transition-colors"
              >
                <LayoutDashboard className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
            )}
          </nav>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                id="header-search"
                name="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700"
                autoComplete="off"
              />
            </div>
          </form>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            {/* Language & Currency Switchers */}
            <LanguageSwitcher />
            <CurrencySwitcher />
            
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-9 px-0"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
            
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
                  id="mobile-search"
                  name="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                  autoComplete="off"
                />
              </div>
            </form>

            <nav className="space-y-2">
              <Link
                href="/listings"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg"
              >
                <Package className="h-4 w-4 mr-2" />
                Listings
              </Link>
              <Link
                href="/events"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Events
              </Link>
              <Link
                href="/forum"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg"
              >
              <MessageCircle className="h-4 w-4 mr-2" />
              Forum
            </Link>

            <div className="border-t my-2" />
            <div className="px-4 py-2 flex items-center justify-between">
              <span className="text-sm font-medium">Theme</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-9 px-0"
              >
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
            </div>

            {isLoggedIn ? (
                <>
                  <div className="border-t my-2" />
                  <Link
                    href="/listings/create"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Post Listing
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg"
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/messages"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Messages
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
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
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setIsMenuOpen(false)}
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

