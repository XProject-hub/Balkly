"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, MapPin, AlertCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PartnerInfo {
  id: number;
  company_name: string;
  company_logo: string | null;
  company_description: string | null;
  address: string | null;
  city: string | null;
  tracking_code: string;
}

export default function CheckInPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const [partner, setPartner] = useState<PartnerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [done, setDone] = useState(false);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {
    loadPartner();
  }, [code]);

  const loadPartner = async () => {
    try {
      const res = await fetch(`/api/v1/checkin/${code}`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        setError("Partner nije pronađen ili je neaktivan.");
        return;
      }
      const data = await res.json();
      setPartner(data.partner);
    } catch {
      setError("Greška pri učitavanju partnera.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

    if (!token) {
      router.push(`/auth/login?redirect=/checkin/${code}`);
      return;
    }

    setChecking(true);
    setError(null);

    try {
      const res = await fetch(`/api/v1/checkin/${code}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        router.push(`/auth/login?redirect=/checkin/${code}`);
        return;
      }

      if (!res.ok) {
        const d = await res.json();
        setError(d.message || "Greška pri check-in-u.");
        return;
      }

      const data = await res.json();
      setCheckedAt(data.checked_in_at);
      setDone(true);
    } catch {
      setError("Mrežna greška. Pokušaj ponovo.");
    } finally {
      setChecking(false);
    }
  };

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("bs-BA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !partner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center max-w-sm">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Greška</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="w-full max-w-sm">
        {!done ? (
          <div className="bg-card border rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-primary px-6 py-8 text-center text-primary-foreground">
              {partner?.company_logo ? (
                <img
                  src={partner.company_logo}
                  alt={partner?.company_name}
                  className="h-16 w-16 rounded-full mx-auto mb-3 object-cover border-2 border-white/30"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold">
                    {partner?.company_name?.charAt(0)}
                  </span>
                </div>
              )}
              <h1 className="text-xl font-bold">{partner?.company_name}</h1>
              {partner?.city && (
                <div className="flex items-center justify-center gap-1 mt-1 text-primary-foreground/80 text-sm">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{partner.city}</span>
                </div>
              )}
            </div>

            {/* Body */}
            <div className="p-6 text-center">
              <h2 className="text-lg font-semibold mb-2">Potvrdi posjet</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Pritisnite dugme ispod da zabilježite vaš posjet kod{" "}
                <strong>{partner?.company_name}</strong>. Ovo se automatski
                snima na balkly.live.
              </p>

              {error && (
                <div className="bg-destructive/10 text-destructive text-sm rounded-lg px-4 py-3 mb-4">
                  {error}
                </div>
              )}

              <Button
                className="w-full h-12 text-base font-semibold"
                onClick={handleCheckIn}
                disabled={checking}
              >
                {checking ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Snima se...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Potvrdi posjet
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground mt-4">
                Morate biti prijavljeni na balkly.live
              </p>
            </div>
          </div>
        ) : (
          /* Success screen */
          <div className="bg-card border rounded-2xl shadow-xl p-8 text-center">
            <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-1">Posjet zabilježen!</h1>
            <p className="text-muted-foreground mb-4">
              Vaš posjet kod <strong>{partner?.company_name}</strong> je uspješno
              snimljen.
            </p>
            {checkedAt && (
              <div className="bg-muted rounded-lg px-4 py-3 text-sm font-mono mb-6">
                {formatDateTime(checkedAt)}
              </div>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/")}
            >
              Idi na početnu
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
