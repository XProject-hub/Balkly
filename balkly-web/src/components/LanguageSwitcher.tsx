"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const languages = [
  { code: 'en', name: 'English', flagCode: 'GB', flag: '🇬🇧', dir: 'ltr' },
  { code: 'sr', name: 'Serbian', flagCode: 'RS', flag: '🇷🇸', dir: 'ltr' },
  { code: 'hr', name: 'Croatian', flagCode: 'HR', flag: '🇭🇷', dir: 'ltr' },
  { code: 'bs', name: 'Bosnian', flagCode: 'BA', flag: '🇧🇦', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', flagCode: 'AE', flag: '🇦🇪', dir: 'rtl' },
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
        className="flex items-center gap-2 px-2"
      >
        <img 
          src={`https://flagcdn.com/w20/${currentLanguage.flagCode.toLowerCase()}.png`}
          alt={currentLanguage.name}
          className="w-6 h-4 object-cover rounded"
        />
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  currentLang === lang.code ? 'bg-blue-50' : ''
                }`}
              >
                <img 
                  src={`https://flagcdn.com/w40/${lang.flagCode.toLowerCase()}.png`}
                  alt={lang.name}
                  className="w-8 h-6 object-cover rounded shadow-sm"
                />
                <span className="text-sm font-medium text-gray-900">{lang.name}</span>
                {currentLang === lang.code && (
                  <span className="ml-auto text-balkly-blue font-bold">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

