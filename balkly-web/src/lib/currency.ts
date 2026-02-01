/**
 * Currency conversion and formatting utilities
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Cache for exchange rates
let ratesCache: { rates: Record<string, number>; timestamp: number } | null = null;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

/**
 * Fetch latest exchange rates from API
 */
export async function fetchExchangeRates(): Promise<Record<string, number>> {
  // Check cache first
  if (ratesCache && Date.now() - ratesCache.timestamp < CACHE_DURATION) {
    return ratesCache.rates;
  }

  try {
    const response = await fetch(`${API_URL}/currency/rates`);
    const data = await response.json();
    
    if (data.success && data.rates) {
      ratesCache = {
        rates: data.rates,
        timestamp: Date.now(),
      };
      return data.rates;
    }
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
  }

  // Fallback rates if API fails
  return getFallbackRates();
}

/**
 * Get fallback exchange rates (hardcoded approximations)
 */
function getFallbackRates(): Record<string, number> {
  return {
    'EUR': 1.0,
    'AED': 4.0,
    'GBP': 0.86,
    'BAM': 1.96,
    'RSD': 117.0,
    'HRK': 7.53,
  };
}

/**
 * Convert amount from one currency to another
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const rates = await fetchExchangeRates();
  
  if (!rates[fromCurrency] || !rates[toCurrency]) {
    console.warn(`Currency ${fromCurrency} or ${toCurrency} not supported`);
    return amount;
  }

  // Convert to EUR first (base currency), then to target
  const inEur = amount / rates[fromCurrency];
  const converted = inEur * rates[toCurrency];
  
  return Math.round(converted * 100) / 100; // Round to 2 decimals
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    'EUR': '€',
    'AED': 'د.إ',
    'GBP': '£',
    'BAM': 'KM',
    'RSD': 'din',
    'HRK': 'kn',
  };
  
  return symbols[currency] || currency;
}

/**
 * Format currency with symbol and proper locale
 * ALWAYS uses de-DE format: 1.000.000,00
 */
export function formatCurrency(
  amount: number,
  currency: string = 'EUR',
  showSymbol: boolean = true
): string {
  const symbol = getCurrencySymbol(currency);
  
  // FORCE de-DE locale: 1.000.000,00 (dots for thousands, comma for decimals)
  const formatted = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  if (!showSymbol) {
    return formatted;
  }

  // Add symbol
  if (currency === 'AED') {
    return `${symbol} ${formatted}`;
  }
  
  return `${symbol}${formatted}`;
}

/**
 * Format price with automatic conversion to user's preferred currency
 */
export async function formatPrice(
  amount: number,
  originalCurrency: string,
  preferredCurrency?: string
): Promise<string> {
  // Get user's preferred currency from localStorage if not provided
  const targetCurrency = preferredCurrency || getPreferredCurrency();
  
  // Convert if needed
  if (originalCurrency !== targetCurrency) {
    const converted = await convertCurrency(amount, originalCurrency, targetCurrency);
    return formatCurrency(converted, targetCurrency);
  }
  
  return formatCurrency(amount, originalCurrency);
}

/**
 * Get user's preferred currency from localStorage
 */
export function getPreferredCurrency(): string {
  if (typeof window === 'undefined') return 'EUR';
  return localStorage.getItem('preferred_currency') || 'EUR';
}

/**
 * Set user's preferred currency in localStorage
 */
export function setPreferredCurrency(currency: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('preferred_currency', currency);
  
  // Dispatch event so components can react
  window.dispatchEvent(new CustomEvent('currency-change', { detail: currency }));
}

/**
 * Get list of supported currencies
 */
export function getSupportedCurrencies() {
  return [
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  ];
}
