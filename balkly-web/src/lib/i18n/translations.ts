import { useState, useEffect } from 'react';

export const translations = {
  en: {
    // Navigation
    'nav.listings': 'Listings',
    'nav.events': 'Events',
    'nav.forum': 'Forum',
    'nav.search': 'Search',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.dashboard': 'Dashboard',
    'nav.messages': 'Messages',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    
    // Homepage
    'home.welcome': 'Welcome to',
    'home.subtitle': 'Your modern marketplace for listings, events, and community discussions. Buy, sell, and connect with confidence.',
    'home.browse': 'Browse Listings',
    'home.getStarted': 'Get Started Free',
    'home.search': 'Search for cars, homes, events, or anything...',
    
    // Categories
    'cat.auto': 'Auto',
    'cat.autoDesc': 'Cars, motorcycles, and vehicles',
    'cat.realestate': 'Real Estate',
    'cat.realestateDesc': 'Houses, apartments, and properties',
    'cat.events': 'Events',
    'cat.eventsDesc': 'Concerts, sports, and entertainment',
    'cat.forum': 'Forum',
    'cat.forumDesc': 'Community discussions and topics',
    
    // Common
    'common.featured': 'Featured',
    'common.new': 'New',
    'common.trending': 'Trending',
    'common.viewAll': 'View All',
    'common.create': 'Create',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.yes': 'Yes',
    'common.no': 'No',
  },
  
  balkly: {
    // Navigation (Serbian)
    'nav.listings': 'Oglasi',
    'nav.events': 'Događaji',
    'nav.forum': 'Forum',
    'nav.search': 'Pretraga',
    'nav.login': 'Prijava',
    'nav.signup': 'Registracija',
    'nav.dashboard': 'Kontrolna tabla',
    'nav.messages': 'Poruke',
    'nav.settings': 'Podešavanja',
    'nav.logout': 'Odjava',
    
    // Homepage
    'home.welcome': 'Dobrodošli u',
    'home.subtitle': 'Vaša moderna tržnica za oglase, događaje i diskusije. Kupujte, prodavajte i povežite se sa poverenjem.',
    'home.browse': 'Pregledaj oglase',
    'home.getStarted': 'Započni besplatno',
    'home.search': 'Pretraži automobile, nekretnine, događaje...',
    
    // Categories
    'cat.auto': 'Automobili',
    'cat.autoDesc': 'Automobili, motocikli i vozila',
    'cat.realestate': 'Nekretnine',
    'cat.realestateDesc': 'Kuće, stanovi i imanja',
    'cat.events': 'Događaji',
    'cat.eventsDesc': 'Koncerti, sport i zabava',
    'cat.forum': 'Forum',
    'cat.forumDesc': 'Diskusije zajednice i teme',
    
    // Common
    'common.featured': 'Istaknuto',
    'common.new': 'Novo',
    'common.trending': 'Popularno',
    'common.viewAll': 'Pogledaj sve',
    'common.create': 'Kreiraj',
    'common.edit': 'Izmeni',
    'common.delete': 'Obriši',
    'common.save': 'Sačuvaj',
    'common.cancel': 'Otkaži',
    'common.yes': 'Da',
    'common.no': 'Ne',
  },
  
  ar: {
    // Navigation (Arabic)
    'nav.listings': 'القوائم',
    'nav.events': 'الأحداث',
    'nav.forum': 'المنتدى',
    'nav.search': 'بحث',
    'nav.login': 'تسجيل الدخول',
    'nav.signup': 'التسجيل',
    'nav.dashboard': 'لوحة التحكم',
    'nav.messages': 'الرسائل',
    'nav.settings': 'الإعدادات',
    'nav.logout': 'تسجيل الخروج',
    
    // Homepage
    'home.welcome': 'مرحبا بك في',
    'home.subtitle': 'السوق الحديث للقوائم والأحداث والمناقشات المجتمعية. شراء وبيع والتواصل بثقة.',
    'home.browse': 'تصفح القوائم',
    'home.getStarted': 'ابدأ مجانا',
    'home.search': 'ابحث عن السيارات والمنازل والأحداث...',
    
    // Categories
    'cat.auto': 'سيارات',
    'cat.autoDesc': 'السيارات والدراجات النارية والمركبات',
    'cat.realestate': 'عقارات',
    'cat.realestateDesc': 'منازل وشقق وعقارات',
    'cat.events': 'الأحداث',
    'cat.eventsDesc': 'الحفلات الموسيقية والرياضة والترفيه',
    'cat.forum': 'المنتدى',
    'cat.forumDesc': 'مناقشات المجتمع والمواضيع',
    
    // Common
    'common.featured': 'مميز',
    'common.new': 'جديد',
    'common.trending': 'رائج',
    'common.viewAll': 'عرض الكل',
    'common.create': 'إنشاء',
    'common.edit': 'تحرير',
    'common.delete': 'حذف',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.yes': 'نعم',
    'common.no': 'لا',
  },
};

export function getTranslation(key: string, lang: string = 'en'): string {
  const langCode = lang as keyof typeof translations;
  if (translations[langCode] && translations[langCode][key]) {
    return translations[langCode][key];
  }
  // Fallback to English
  return translations.en[key] || key;
}

export function useTranslation() {
  const [lang, setLang] = useState('en');
  
  // Only access localStorage after component mounts (client-side)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language') || 'en';
      setLang(savedLang);
    }
  }, []);
  
  return {
    t: (key: string) => getTranslation(key, lang),
    lang,
  };
}

