"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'sr', name: 'Serbian', flag: '🇷🇸', dir: 'ltr' },
  { code: 'hr', name: 'Croatian', flag: '🇭🇷', dir: 'ltr' },
  { code: 'bs', name: 'Bosnian', flag: '🇧🇦', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', flag: '🇦🇪', dir: 'rtl' },
];

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState('en');
  const [isOpen, setIsOpen] = useState(false);

  // Load saved language on mount
  useEffect(() => {
    const saved = localStorage.getItem('language');
    if (saved) {
      setCurrentLang(saved);
    }
  }, []);

  const handleLanguageChange = (langCode: string) => {
    const lang = languages.find(l => l.code === langCode);
    if (!lang) return;

    // Set language
    setCurrentLang(langCode);
    localStorage.setItem('language', langCode);
    
    // Set RTL if Arabic
    if (lang.dir === 'rtl') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = langCode;
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = langCode;
    }
    
    // Close dropdown
    setIsOpen(false);
    
    // Reload page to apply language
    window.location.reload();
  };

  const currentLanguage = languages.find(l => l.code === currentLang) || languages[0];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1"
      >
        <span className="text-2xl">{currentLanguage.flag}</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                currentLang === lang.code ? 'bg-gray-50' : ''
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <span className="text-sm font-medium">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

