import { ShieldCheck } from "lucide-react";

interface VerifiedBadgeProps {
  isVerified: boolean;
  size?: "sm" | "md" | "lg";
}

export default function VerifiedBadge({ isVerified, size = "md" }: VerifiedBadgeProps) {
  if (!isVerified) return null;

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
      <ShieldCheck className={sizeClasses[size]} />
      <span>VERIFIED</span>
    </div>
  );
}

