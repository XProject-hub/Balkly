"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft, MousePointerClick, Euro, Ticket,
  ExternalLink, Copy, CheckCheck, Calendar, TrendingUp,
  QrCode, Download, Users2, MapPin,
} from "lucide-react";
import { toast } from "@/lib/toast";
import { generateBalklyQR } from "@/lib/balklyQr";

const COMMISSION_LABELS: Record<string, string> = {
  percent_of_bill:          "% od računa",
  fixed_per_client:         "Fiksno EUR/klijent",
  digital_referral_percent: "Digitalni referral %",
};

const SITE_BASE =
  typeof window !== "undefined" ? window.location.origin : "https://balkly.live";

export default function AdminPartnerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [partner, setPartner]   = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [visits, setVisits]     = useState<any[]>([]);
  const [visitsLoading, setVisitsLoading] = useState(false);
  const [copiedCode, setCopiedCode]   = useState(false);
  const [copiedCheckin, setCopiedCheckin] = useState(false);
  const [qrDataUrl, setQrDataUrl]     = useState<string | null>(null);
  const qrRef = useRef<HTMLImageElement>(null);

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : "";

  useEffect(() => {
    if (!id) return;
    fetch(`/api/v1/admin/partners/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
    })
      .then((r) => r.json())
      .then((d) => {
        setPartner(d.partner);
        if (d.partner?.tracking_code) generateQR(d.partner.tracking_code);
        loadVisits(d.partner?.id);
      })
      .catch(() => toast.error("Greška pri učitavanju"))
      .finally(() => setLoading(false));
  }, [id]);

  const generateQR = async (trackingCode: string) => {
    try {
      const dataUrl = await generateBalklyQR(
        `${SITE_BASE}/checkin/${trackingCode}`,
        500
      );
      setQrDataUrl(dataUrl);
    } catch {}
  };

  const loadVisits = async (partnerId?: number) => {
    if (!partnerId) return;
    setVisitsLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/partners/${partnerId}/visits`, {
        headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
      });
      if (res.ok) {
        const d = await res.json();
        setVisits(d.data || []);
      }
    } catch {} finally {
      setVisitsLoading(false);
    }
  };

  const copyCode = async (text: string, type: "code" | "checkin") => {
    await navigator.clipboard.writeText(text);
    if (type === "code") { setCopiedCode(true); setTimeout(() => setCopiedCode(false), 2000); }
    else { setCopiedCheckin(true); setTimeout(() => setCopiedCheckin(false), 2000); }
    toast.success("Kopirano!");
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `${partner?.company_name?.replace(/\s+/g, "-")}-checkin-qr.png`;
    a.click();
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString("bs-BA", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Partner nije pronađen.</p>
          <Link href="/admin/partners"><Button variant="outline">Nazad</Button></Link>
        </div>
      </div>
    );
  }

  const commissionRate    = Number(partner.commission_rate);
  const totalCommission   = Number(partner.total_commission ?? 0);
  const pendingCommission = Number(partner.total_commission_pending ?? 0);
  const checkinUrl        = `${SITE_BASE}/checkin/${partner.tracking_code}`;
  const trackingUrl       = `${SITE_BASE}/go/${partner.tracking_code}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <Link href="/admin/partners">
            <Button variant="secondary" size="sm" className="mb-3">
              <ArrowLeft className="mr-2 h-4 w-4" /> Partneri
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold text-2xl">
              {partner.company_name[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{partner.company_name}</h1>
              <p className="opacity-85 mt-0.5">
                {partner.user?.name} · {partner.user?.email}
                {!partner.is_active && (
                  <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">NEAKTIVAN</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { icon: <MousePointerClick className="h-5 w-5 text-blue-500" />,  label: "Web klikovi",   value: partner.clicks_count ?? 0,      sub: "Ukupno" },
            { icon: <Users2 className="h-5 w-5 text-cyan-500" />,             label: "QR posjete",    value: partner.visits_count ?? 0,       sub: "Check-in skeniranja" },
            { icon: <Ticket className="h-5 w-5 text-orange-500" />,           label: "Voucheri",      value: partner.vouchers_count ?? 0,     sub: `${partner.redemptions_count ?? 0} iskorišteno` },
            { icon: <TrendingUp className="h-5 w-5 text-purple-500" />,       label: "Konverzije",    value: partner.conversions_count ?? 0,  sub: "Sve" },
            { icon: <Euro className="h-5 w-5 text-green-600" />,              label: "Komisija",      value: `€${totalCommission.toFixed(2)}`, sub: `Na čekanju: €${pendingCommission.toFixed(2)}`, valueClass: "text-green-600" },
          ].map((s, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  {s.icon} {s.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-2xl font-bold ${(s as any).valueClass || ""}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Partner info */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Informacije o partneru</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                ["Komisija", `${COMMISSION_LABELS[partner.commission_type]} — ${commissionRate}${partner.commission_type === "fixed_per_client" ? " EUR" : "%"}`],
                ["Grad", partner.city || "—"],
                ["Adresa", partner.address || "—"],
                ["Telefon", partner.phone || "—"],
                ["Kontakt email", partner.contact_email || "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b pb-2 last:border-0">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium text-right max-w-[60%] break-words">{v}</span>
                </div>
              ))}

              {partner.website_url && (
                <a href={partner.website_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline text-sm mt-1">
                  <ExternalLink className="h-4 w-4" /> {partner.website_url}
                </a>
              )}

              {/* Tracking link */}
              <div className="pt-2 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Linkovi za praćenje</p>
                <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Digitalni link (web klikovi)</p>
                    <code className="text-xs">/go/{partner.tracking_code}</code>
                  </div>
                  <button onClick={() => copyCode(trackingUrl, "code")}
                    className="text-muted-foreground hover:text-foreground ml-2 flex-shrink-0">
                    {copiedCode ? <CheckCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Check-in link (QR kod)</p>
                    <code className="text-xs">/checkin/{partner.tracking_code}</code>
                  </div>
                  <button onClick={() => copyCode(checkinUrl, "checkin")}
                    className="text-muted-foreground hover:text-foreground ml-2 flex-shrink-0">
                    {copiedCheckin ? <CheckCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partner QR Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-muted-foreground" />
                QR Kod za Check-In
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              {qrDataUrl ? (
                <>
                  <div className="rounded-2xl p-2 bg-[#0f172a]"
                    style={{ boxShadow: "0 0 24px 6px rgba(0,229,255,0.25), 0 0 60px 10px rgba(124,58,237,0.15)" }}>
                    <img
                      ref={qrRef}
                      src={qrDataUrl}
                      alt="Check-in QR"
                      className="w-52 h-52 rounded-xl"
                      style={{ filter: "drop-shadow(0 0 6px rgba(0,229,255,0.5))" }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center leading-relaxed">
                    Partner štampa ovaj QR i izloži u lokalu.<br />
                    Klijent skenira telefonom → posjet se automatski bilježi.
                  </p>
                  <Button onClick={downloadQR} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white" size="sm">
                    <Download className="mr-2 h-4 w-4" /> Preuzmi QR kod
                  </Button>
                </>
              ) : (
                <div className="h-52 w-52 bg-[#0f172a] rounded-2xl flex items-center justify-center border border-cyan-900/40">
                  <QrCode className="h-10 w-10 text-cyan-700" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Monthly commission */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              Komisija po mjesecima
            </CardTitle>
          </CardHeader>
          <CardContent>
            {partner.monthly_summary?.length > 0 ? (
              <div className="space-y-2">
                {partner.monthly_summary.map((m: any) => (
                  <div key={m.month} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{m.month}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">{m.count} konverzija</span>
                      <span className="font-bold text-green-600">€{Number(m.commission).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between pt-2 font-bold">
                  <span>Ukupno (potvrđeno)</span>
                  <span className="text-green-600">€{totalCommission.toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-6">Nema podataka o konverzijama</p>
            )}
          </CardContent>
        </Card>

        {/* QR Check-In visits log */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users2 className="h-5 w-5 text-cyan-500" />
              QR Check-In posjete
            </CardTitle>
          </CardHeader>
          <CardContent>
            {visitsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : visits.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">Nema zabilježenih posjeta</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-2 px-3">Korisnik</th>
                      <th className="text-left py-2 px-3">Email</th>
                      <th className="text-left py-2 px-3">Datum i vrijeme</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.map((v: any) => (
                      <tr key={v.id} className="border-b last:border-0">
                        <td className="py-2 px-3 font-medium">{v.user?.name || "—"}</td>
                        <td className="py-2 px-3 text-muted-foreground">{v.user?.email || "—"}</td>
                        <td className="py-2 px-3 text-muted-foreground font-mono text-xs">{fmt(v.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Offers */}
        {partner.offers?.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Aktivne ponude</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {partner.offers.map((o: any) => (
                  <div key={o.id} className={`p-3 rounded-lg border ${!o.is_active ? "opacity-50 border-dashed" : "border-primary/20 bg-primary/5"}`}>
                    <p className="font-medium text-sm">{o.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{o.description}</p>
                    <p className="text-xs font-semibold text-primary mt-1">
                      {o.benefit_type === "percent_off" && `${o.benefit_value}% popust`}
                      {o.benefit_type === "fixed_off"   && `€${o.benefit_value} popust`}
                      {o.benefit_type === "free_item"   && "Besplatna stavka"}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Staff */}
        {partner.staff?.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Osoblje</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {partner.staff.map((s: any) => (
                  <div key={s.id} className="flex items-center justify-between py-2 border-b last:border-0 text-sm">
                    <div>
                      <span className="font-medium">{s.user?.name || "—"}</span>
                      <span className="text-muted-foreground ml-2">{s.user?.email}</span>
                    </div>
                    <span className="capitalize text-xs px-2 py-0.5 rounded-full bg-muted">{s.role}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
