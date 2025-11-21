export function getCurrency(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('currency') || 'EUR';
  }
  return 'EUR';
}

export function getCurrencySymbol(currency?: string): string {
  const curr = currency || getCurrency();
  
  const symbols: Record<string, string> = {
    'EUR': '€',
    'AED': 'د.إ',
    'USD': '€', // Changed to € as requested
  };
  
  return symbols[curr] || '€';
}

export function formatPrice(amount: number, currency?: string): string {
  const curr = currency || getCurrency();
  const symbol = getCurrencySymbol(curr);
  
  // European format: 1.000.000,00 (dots for thousands, comma for decimals)
  const formatted = amount.toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return `${symbol}${formatted}`;
}

