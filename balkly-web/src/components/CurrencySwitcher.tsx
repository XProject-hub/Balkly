"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import {
  getSupportedCurrencies,
  getPreferredCurrency,
  setPreferredCurrency,
} from "@/lib/currency";

export default function CurrencySwitcher() {
  const [currency, setCurrency] = useState<string>('EUR');
  const [isOpen, setIsOpen] = useState(false);
  const currencies = getSupportedCurrencies();

  useEffect(() => {
    setCurrency(getPreferredCurrency());
  }, []);

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    setPreferredCurrency(newCurrency);
    setIsOpen(false);
    
    // Reload page to update all prices
    window.location.reload();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
        title="Change Currency"
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">{currency}</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-background border rounded-lg shadow-lg z-50 py-2">
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b">
              Select Currency
            </div>
            {currencies.map((curr) => (
              <button
                key={curr.code}
                onClick={() => handleCurrencyChange(curr.code)}
                className={`w-full text-left px-3 py-2 hover:bg-accent transition-colors flex items-center justify-between ${
                  currency === curr.code ? 'bg-accent' : ''
                }`}
              >
                <span className="text-sm">
                  {curr.symbol} {curr.name}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {curr.code}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
