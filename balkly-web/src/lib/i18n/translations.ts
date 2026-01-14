// English-only translations for Balkly

export const translations = {
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
} as const;

type TranslationKey = keyof typeof translations;

export function getTranslation(key: TranslationKey): string {
  return translations[key] || key;
}

export function useTranslation() {
  return {
    t: (key: TranslationKey) => getTranslation(key),
    lang: 'en',
  };
}
