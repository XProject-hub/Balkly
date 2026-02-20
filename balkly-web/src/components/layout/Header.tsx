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
  ChevronDown,
  Car,
  Globe,
} from "lucide-react";
import CurrencySwitcher from "@/components/CurrencySwitcher";
import NotificationBell from "@/components/NotificationBell";
import { useLanguage, languageLabels, type Language } from "@/contexts/LanguageContext";

export default function Header() {
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("light");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("auth_token");
      const userData = localStorage.getItem("user");
      if (token && userData && userData !== "undefined" && userData !== "null") {
        try {
          const parsedUser = JSON.parse(userData);
          setIsLoggedIn(true);
          setUser(parsedUser);
        } catch {
          setIsLoggedIn(false);
          setUser(null);
          localStorage.removeItem("user");
          localStorage.removeItem("auth_token");
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuth();
    window.addEventListener("auth-change", checkAuth);
    window.addEventListener("storage", checkAuth);

    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    if (savedTheme === "dark") document.documentElement.classList.add("dark");

    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("auth-change", checkAuth);
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".user-menu-container")) setShowUserMenu(false);
      if (!target.closest(".lang-menu-container")) setShowLangMenu(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

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
    setShowUserMenu(false);
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="border-b bg-white dark:bg-gray-900 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <img
              src="/logo.png"
              alt="Balkly"
              width={250}
              height={200}
              className="h-12 sm:h-16 lg:h-20 w-auto dark:brightness-110"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <Link href="/listings" className="flex items-center text-sm font-medium hover:text-primary transition-colors whitespace-nowrap">
              <Package className="h-4 w-4 mr-1" />
              {t.nav.ads}
            </Link>
            <Link href="/events" className="flex items-center text-sm font-medium hover:text-primary transition-colors whitespace-nowrap">
              <Calendar className="h-4 w-4 mr-1" />
              {t.nav.events}
            </Link>
            <Link href="/forum" className="flex items-center text-sm font-medium hover:text-primary transition-colors whitespace-nowrap">
              <MessageCircle className="h-4 w-4 mr-1" />
              {t.nav.forum}
            </Link>
            <Link href="/car-rental" className="flex items-center text-sm font-medium hover:text-primary transition-colors whitespace-nowrap">
              <Car className="h-4 w-4 mr-1" />
              {t.nav.carRental}
            </Link>
            {isLoggedIn && (
              <Link href="/dashboard" className="flex items-center text-sm font-medium hover:text-primary transition-colors whitespace-nowrap">
                <LayoutDashboard className="h-4 w-4 mr-1" />
                {t.nav.myAccount}
              </Link>
            )}
          </nav>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden xl:flex flex-1 max-w-sm mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                id="header-search"
                name="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.nav.search}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700"
                autoComplete="off"
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {isLoggedIn && (
              <div className="hidden xs:block">
                <NotificationBell />
              </div>
            )}

            <div className="hidden sm:block">
              <CurrencySwitcher />
            </div>

            {/* Language Switcher */}
            <div className="relative lang-menu-container hidden sm:block">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 px-2"
                onClick={() => setShowLangMenu(!showLangMenu)}
                aria-label="Change language"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden xl:inline text-xs font-medium">{languageLabels[language].flag} {languageLabels[language].label}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-background border rounded-lg shadow-lg py-1 z-50">
                  {(Object.keys(languageLabels) as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); setShowLangMenu(false); }}
                      className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-accent transition-colors ${language === lang ? "font-bold text-primary" : ""}`}
                    >
                      <span>{languageLabels[lang].flag}</span>
                      <span>{languageLabels[lang].label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="w-8 h-8 sm:w-9 sm:h-9 p-0" aria-label="Toggle theme">
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            {/* Desktop User Menu */}
            {isLoggedIn ? (
              <div className="relative user-menu-container hidden lg:block">
                <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => setShowUserMenu(!showUserMenu)}>
                  <User className="h-4 w-4" />
                  <span className="hidden xl:inline max-w-[100px] truncate">{user?.name}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-background border rounded-lg shadow-lg py-1 z-50">
                    <Link href="/dashboard" onClick={() => setShowUserMenu(false)} className="flex items-center px-4 py-2 text-sm hover:bg-accent">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      {t.nav.myAccount}
                    </Link>
                    <Link href="/dashboard/messages" onClick={() => setShowUserMenu(false)} className="flex items-center px-4 py-2 text-sm hover:bg-accent">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {t.nav.messages}
                    </Link>
                    <Link href="/settings" onClick={() => setShowUserMenu(false)} className="flex items-center px-4 py-2 text-sm hover:bg-accent">
                      <Settings className="h-4 w-4 mr-2" />
                      {t.nav.settings}
                    </Link>
                    {user?.role === "admin" && (
                      <Link href="/admin" onClick={() => setShowUserMenu(false)} className="flex items-center px-4 py-2 text-sm hover:bg-accent border-t">
                        <Settings className="h-4 w-4 mr-2" />
                        {t.nav.adminPanel}
                      </Link>
                    )}
                    {(user?.role === "partner" || user?.role === "staff") && (
                      <Link href="/partner" onClick={() => setShowUserMenu(false)} className="flex items-center px-4 py-2 text-sm hover:bg-accent border-t">
                        <Settings className="h-4 w-4 mr-2" />
                        {t.nav.partnerDashboard}
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm hover:bg-accent text-destructive border-t">
                      <LogOut className="h-4 w-4 mr-2" />
                      {t.nav.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">{t.nav.login}</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/register">{t.nav.signUp}</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 p-0"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 sm:top-20 bg-background z-40 overflow-y-auto">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  id="mobile-search"
                  name="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.nav.searchAds}
                  className="w-full pl-11 pr-4 py-3 border rounded-xl text-base dark:bg-gray-800 dark:border-gray-700"
                  autoComplete="off"
                />
              </div>
            </form>

            <nav className="space-y-1">
              <Link href="/listings" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-3 text-base font-medium hover:bg-accent rounded-xl transition-colors">
                <Package className="h-5 w-5 mr-3" />
                {t.nav.ads}
              </Link>
              <Link href="/events" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-3 text-base font-medium hover:bg-accent rounded-xl transition-colors">
                <Calendar className="h-5 w-5 mr-3" />
                {t.nav.events}
              </Link>
              <Link href="/forum" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-3 text-base font-medium hover:bg-accent rounded-xl transition-colors">
                <MessageCircle className="h-5 w-5 mr-3" />
                {t.nav.forum}
              </Link>
              <Link href="/car-rental" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-3 text-base font-medium hover:bg-accent rounded-xl transition-colors">
                <Car className="h-5 w-5 mr-3" />
                {t.nav.carRental}
              </Link>

              <div className="border-t my-4 dark:border-gray-700" />

              {/* Language Switcher (mobile) */}
              <div className="px-4 py-3">
                <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <Globe className="h-4 w-4" /> {t.header.language}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {(Object.keys(languageLabels) as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); setIsMenuOpen(false); }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-all ${
                        language === lang ? "border-primary bg-primary/10 text-primary font-bold" : "border-muted hover:border-muted-foreground/30"
                      }`}
                    >
                      {languageLabels[lang].flag} {languageLabels[lang].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme toggle */}
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-base font-medium">{t.header.theme}</span>
                <Button variant="outline" size="sm" onClick={toggleTheme} className="gap-2">
                  {theme === "light" ? <><Moon className="h-4 w-4" /> {t.header.dark}</> : <><Sun className="h-4 w-4" /> {t.header.light}</>}
                </Button>
              </div>

              {/* Currency (mobile) */}
              <div className="px-4 py-3 flex items-center justify-between sm:hidden">
                <span className="text-base font-medium">{t.header.currency}</span>
                <CurrencySwitcher />
              </div>

              {isLoggedIn ? (
                <>
                  <div className="border-t my-4 dark:border-gray-700" />
                  <div className="px-4 py-3 flex items-center gap-3 bg-accent/50 rounded-xl mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-3 text-base font-medium hover:bg-accent rounded-xl transition-colors">
                    <LayoutDashboard className="h-5 w-5 mr-3" />
                    {t.nav.myAccount}
                  </Link>
                  <Link href="/dashboard/messages" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-3 text-base font-medium hover:bg-accent rounded-xl transition-colors">
                    <MessageCircle className="h-5 w-5 mr-3" />
                    {t.nav.messages}
                  </Link>
                  <Link href="/settings" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-3 text-base font-medium hover:bg-accent rounded-xl transition-colors">
                    <Settings className="h-5 w-5 mr-3" />
                    {t.nav.settings}
                  </Link>
                  {user?.role === "admin" && (
                    <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-3 text-base font-medium hover:bg-accent rounded-xl transition-colors">
                      <Settings className="h-5 w-5 mr-3" />
                      {t.nav.adminPanel}
                    </Link>
                  )}
                  {(user?.role === "partner" || user?.role === "staff") && (
                    <Link href="/partner" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-3 text-base font-medium hover:bg-accent rounded-xl transition-colors">
                      <Settings className="h-5 w-5 mr-3" />
                      {t.nav.partnerDashboard}
                    </Link>
                  )}
                  <div className="border-t my-4 dark:border-gray-700" />
                  <button
                    onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                    className="flex items-center w-full px-4 py-3 text-base font-medium hover:bg-destructive/10 rounded-xl text-destructive transition-colors"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    {t.nav.logout}
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t my-4 dark:border-gray-700" />
                  <div className="space-y-3 px-4">
                    <Button className="w-full py-6 text-base" asChild>
                      <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                        {t.nav.createAccount}
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full py-6 text-base" asChild>
                      <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                        {t.nav.login}
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
