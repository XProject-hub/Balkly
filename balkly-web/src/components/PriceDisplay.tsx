"use client";

import { useState, useEffect } from "react";
import { formatPrice, getPreferredCurrency, formatCurrency, convertCurrency, getCurrencySymbol } from "@/lib/currency";

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
  const [originalPrice, setOriginalPrice] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPrice = async () => {
      const preferredCurrency = getPreferredCurrency();
      
      // Convert if needed
      let displayAmount = amount;
      if (currency !== preferredCurrency) {
        displayAmount = await convertCurrency(amount, currency, preferredCurrency);
      }
      
      // Format with de-DE locale: 1.000.000,00
      const symbol = getCurrencySymbol(preferredCurrency);
      const formatted = displayAmount.toLocaleString('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      
      setDisplayPrice(preferredCurrency === 'AED' ? `${symbol} ${formatted}` : `${symbol}${formatted}`);
      
      // Original price if different currency
      if (currency !== preferredCurrency) {
        const originalFormatted = amount.toLocaleString('de-DE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        const originalSymbol = getCurrencySymbol(currency);
        setOriginalPrice(currency === 'AED' ? `${originalSymbol} ${originalFormatted}` : `${originalSymbol}${originalFormatted}`);
      }
      
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
    const symbol = getCurrencySymbol(currency);
    const formatted = amount.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return <span className={className}>{currency === 'AED' ? `${symbol} ${formatted}` : `${symbol}${formatted}`}</span>;
  }

  const preferredCurrency = getPreferredCurrency();
  const isConverted = currency !== preferredCurrency;

  return (
    <span className={className}>
      {displayPrice}
      {showOriginal && isConverted && (
        <span className="text-xs text-muted-foreground ml-2">
          (≈ {originalPrice})
        </span>
      )}
    </span>
  );
}

