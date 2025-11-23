"use client";

import { useState, useEffect } from "react";
import { getPreferredCurrency, getCurrencySymbol, convertCurrency } from "@/lib/currency";

interface PriceDisplayProps {
  amount: number;
  currency: string;
  className?: string;
  showOriginal?: boolean;
}

export default function PriceDisplay({
  amount,
  currency,
  className = "",
  showOriginal = false,
}: PriceDisplayProps) {
  const [displayPrice, setDisplayPrice] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPrice = async () => {
      const preferredCurrency = getPreferredCurrency();
      
      // Convert if needed
      let finalAmount = amount;
      if (currency !== preferredCurrency) {
        finalAmount = await convertCurrency(amount, currency, preferredCurrency);
      }
      
      // Get symbol
      const symbol = getCurrencySymbol(preferredCurrency);
      
      // FORCE de-DE format: 1.000.000,00
      const formatted = new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(finalAmount);
      
      // Build price string
      const priceString = preferredCurrency === 'AED' 
        ? `${symbol} ${formatted}` 
        : `${symbol}${formatted}`;
      
      setDisplayPrice(priceString);
      setLoading(false);
    };

    loadPrice();

    const handleCurrencyChange = () => {
      setLoading(true);
      loadPrice();
    };

    window.addEventListener('currency-change', handleCurrencyChange);
    return () => window.removeEventListener('currency-change', handleCurrencyChange);
  }, [amount, currency]);

  if (loading) {
    // Loading state - also use de-DE format
    const symbol = getCurrencySymbol(currency);
    const formatted = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    
    return (
      <span className={className}>
        {currency === 'AED' ? `${symbol} ${formatted}` : `${symbol}${formatted}`}
      </span>
    );
  }

  return <span className={className}>{displayPrice}</span>;
}
