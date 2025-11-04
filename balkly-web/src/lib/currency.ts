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
    'USD': '$',
    'BAM': 'KM',
  };
  
  return symbols[curr] || '€';
}

export function formatPrice(amount: number, currency?: string): string {
  const curr = currency || getCurrency();
  const symbol = getCurrencySymbol(curr);
  
  return `${symbol}${amount.toLocaleString()}`;
}

