"use client";

import { useState, useEffect } from "react";
import { formatPrice, getPreferredCurrency, formatCurrency } from "@/lib/currency";

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
      
      // Format original price
      const original = formatCurrency(amount, currency);
      setOriginalPrice(original);
      
      // Format price in preferred currency (with conversion if needed)
      const formatted = await formatPrice(amount, currency, preferredCurrency);
      setDisplayPrice(formatted);
      setLoading(false);
    };

    loadPrice();

    // Listen for currency changes
    const handleCurrencyChange = () => {
      setLoading(true);
      loadPrice();
    };

    window.addEventListener('currency-change', handleCurrencyChange);
    return () => window.removeEventListener('currency-change', handleCurrencyChange);
  }, [amount, currency]);

  if (loading) {
    return <span className={className}>{formatCurrency(amount, currency)}</span>;
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

