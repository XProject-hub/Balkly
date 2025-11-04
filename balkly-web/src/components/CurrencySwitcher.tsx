"use client";

import { useState, useEffect } from "react";

const currencies = [
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
];

export default function CurrencySwitcher() {
  const [currentCurrency, setCurrentCurrency] = useState('EUR');

  useEffect(() => {
    const saved = localStorage.getItem('currency');
    if (saved) {
      setCurrentCurrency(saved);
    }
  }, []);

  const handleCurrencyChange = (code: string) => {
    setCurrentCurrency(code);
    localStorage.setItem('currency', code);
    window.location.reload();
  };

  const current = currencies.find(c => c.code === currentCurrency) || currencies[0];

  return (
    <select
      value={currentCurrency}
      onChange={(e) => handleCurrencyChange(e.target.value)}
      className="px-3 py-1 border rounded-lg text-sm bg-white"
    >
      {currencies.map((currency) => (
        <option key={currency.code} value={currency.code}>
          {currency.symbol} {currency.code}
        </option>
      ))}
    </select>
  );
}

export function getCurrency() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('currency') || 'EUR';
  }
  return 'EUR';
}

export function getCurrencySymbol() {
  const code = getCurrency();
  const currency = currencies.find(c => c.code === code);
  return currency?.symbol || '€';
}

