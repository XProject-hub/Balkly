"use client";

const AED_EUR_RATE = 4; // 1 EUR = 4 AED

interface Props {
  price: string;
  currency: string;
}

export default function CurrencyConvert({ price, currency }: Props) {
  if (!price) return null;

  const raw = parseFloat(price.replace(/\./g, "").replace(",", "."));
  if (isNaN(raw) || raw <= 0) return null;

  let converted: string;
  let label: string;

  if (currency === "AED") {
    const eur = (raw / AED_EUR_RATE).toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    converted = `${eur} EUR`;
    label = "1 EUR = 4 AED";
  } else {
    const aed = (raw * AED_EUR_RATE).toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    converted = `${aed} AED`;
    label = "1 EUR = 4 AED";
  }

  return (
    <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
      <span className="text-green-500 font-semibold">approx. {converted}</span>
      <span className="text-xs opacity-70">({label})</span>
    </p>
  );
}
