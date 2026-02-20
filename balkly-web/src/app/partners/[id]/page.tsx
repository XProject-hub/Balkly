"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft, QrCode, Download, Copy, CheckCheck,
  MapPin, Phone, Globe, Clock, Loader2, RefreshCw,
  Shield,
} from "lucide-react";
import { toast } from "@/lib/toast";

export default function PartnerVisitPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [partner, setPartner] = useState<any>(null);
  const [loadingPartner, setLoadingPartner] = useState(true);
  const [voucher, setVoucher] = useState<any>(null);
  const [generatingQR, setGeneratingQR] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push(`/auth/login?redirect=/partners/${id}`);
      return;
    }
    setIsLoggedIn(true);
    loadPartner();
  }, [id]);

  useEffect(() => {
    if (voucher?.code) {
      generateQrImage(`https://balkly.net/v/${voucher.code}`);
    }
  }, [voucher]);

  const loadPartner = async () => {
    try {
      const res = await fetch(`/api/v1/partners/${id}/offers`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setPartner(data.partner || data);
    } catch {
      toast.error("Partner nije pronađen");
    } finally {
      setLoadingPartner(false);
    }
  };

  const generateQrImage = async (url: string) => {
    try {
      const QRCode = (await import("qrcode")).default;
      const dataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: { dark: "#0f172a", light: "#ffffff" },
      });
      setQrDataUrl(dataUrl);
    } catch {}
  };

  const handleGetCode = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push(`/auth/login?redirect=/partners/${id}`);
      return;
    }

    setGeneratingQR(true);
    try {
      const res = await fetch("/api/v1/vouchers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ partner_id: Number(id) }),
      });

      const data = await res.json();

      if (res.ok || res.status === 200) {
        setVoucher(data.voucher);
        if (data.existing) {
          toast.success("Tvoj aktivni kod je prikazan ispod.");
        } else {
          toast.success("Kod generiran! Pokaži ga partneru.");
        }
      } else {
        toast.error(data.message || "Greška pri generisanju koda");
      }
    } catch {
      toast.error("Mrežna greška");
    } finally {
      setGeneratingQR(false);
    }
  };

  const copyCode = async () => {
    if (!voucher?.code) return;
    await navigator.clipboard.writeText(voucher.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    toast.success("Kod kopiran!");
  };

  const downloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `balkly-visit-${voucher?.code}.png`;
    a.click();
  };

  const expiresIn = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return "Istekao";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    if (h > 24) return `${Math.floor(h / 24)}d ${h % 24}h`;
    return `${h}h ${m}m`;
  };

  if (loadingPartner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <Link href="/partners" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Svi partneri
        </Link>

        {partner && (
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                {partner.company_name?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{partner.company_name}</h1>
                {partner.city && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {partner.city}
                  </p>
                )}
              </div>
            </div>
            {partner.company_description && (
              <p className="text-muted-foreground text-sm mb-3">{partner.company_description}</p>
            )}
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {partner.phone && (
                <a href={`tel:${partner.phone}`} className="flex items-center gap-1 hover:text-foreground">
                  <Phone className="h-3.5 w-3.5" /> {partner.phone}
                </a>
              )}
              {partner.website_url && (
                <a href={partner.website_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-foreground">
                  <Globe className="h-3.5 w-3.5" /> Posjeti website
                </a>
              )}
              {partner.address && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {partner.address}
                </span>
              )}
            </div>
          </div>
        )}

        {/* QR Code section */}
        {!voucher ? (
          <Card className="border-2 border-primary/20">
            <CardContent className="py-8 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <QrCode className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Generiši posjetni kod</h2>
                <p className="text-muted-foreground text-sm">
                  Dobij QR kod koji ćeš pokazati kod partnera pri dolasku.
                  Partner ga skenira i tvoja posjeta se bilježi.
                </p>
              </div>

              {!isLoggedIn && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-400">
                  <Shield className="h-4 w-4 flex-shrink-0" />
                  Morate biti prijavljeni da biste dobili kod.
                </div>
              )}

              <Button
                onClick={handleGetCode}
                disabled={generatingQR}
                size="lg"
                className="w-full"
              >
                {generatingQR
                  ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generisanje...</>
                  : <><QrCode className="mr-2 h-5 w-5" /> Generiši QR kod</>
                }
              </Button>

              <p className="text-xs text-muted-foreground">
                Besplatno · Jedan aktivni kod po partneru
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-green-500/40">
            <CardContent className="py-6 space-y-5">
              {/* Status badge */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg">Tvoj posjetni kod</h2>
                  <p className="text-sm text-muted-foreground">
                    {voucher.offer?.title || "Opći posjet"}
                  </p>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  AKTIVAN
                </div>
              </div>

              {/* QR Code */}
              {qrDataUrl ? (
                <div className="flex justify-center">
                  <div className="p-3 bg-white rounded-2xl shadow-lg">
                    <img src={qrDataUrl} alt="QR kod" className="w-56 h-56" />
                  </div>
                </div>
              ) : (
                <div className="h-56 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}

              {/* Code text */}
              <div className="bg-muted rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Kod vouchera</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl font-bold font-mono tracking-widest">
                    {voucher.code}
                  </span>
                  <button onClick={copyCode} className="text-muted-foreground hover:text-foreground">
                    {copied ? <CheckCheck className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Expiry */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  Ističe za: <strong>{expiresIn(voucher.expires_at)}</strong>
                  {" "}({new Date(voucher.expires_at).toLocaleString("bs-BA")})
                </span>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-400">
                <p className="font-medium mb-1">Kako koristiti:</p>
                <ol className="list-decimal list-inside space-y-0.5 text-xs">
                  <li>Idi kod partnera: <strong>{partner?.company_name}</strong></li>
                  <li>Pokaži ovaj QR kod ili kod osoblju</li>
                  <li>Osoblje skenira i potvrđuje tvoj dolazak</li>
                </ol>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                {qrDataUrl && (
                  <Button variant="outline" onClick={downloadQr} className="gap-2">
                    <Download className="h-4 w-4" /> Preuzmi QR
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => { setVoucher(null); setQrDataUrl(null); handleGetCode(); }}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" /> Osvježi
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
