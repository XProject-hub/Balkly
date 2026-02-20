"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft, MousePointerClick, Users, DollarSign, Ticket,
  ExternalLink, Copy, CheckCheck, Calendar, TrendingUp, Clock,
} from "lucide-react";
import { toast } from "@/lib/toast";

const COMMISSION_LABELS: Record<string, string> = {
  percent_of_bill:          "% od računa",
  fixed_per_client:         "Fiksno EUR/klijent",
  digital_referral_percent: "Digitalni referral %",
};

export default function AdminPartnerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  const getToken = () => localStorage.getItem("auth_token");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/v1/admin/partners/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then((d) => setPartner(d.partner))
      .catch(() => toast.error("Greška pri učitavanju"))
      .finally(() => setLoading(false));
  }, [id]);

  const copyCode = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

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

  const commissionRate = Number(partner.commission_rate);
  const totalCommission = Number(partner.total_commission ?? 0);
  const pendingCommission = Number(partner.total_commission_pending ?? 0);

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

        {/* Key stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <MousePointerClick className="h-5 w-5 text-blue-500" />, label: "Web Klikovi", value: partner.clicks_count ?? 0, sub: "Ukupno" },
            { icon: <Ticket className="h-5 w-5 text-orange-500" />, label: "Voucheri", value: partner.vouchers_count ?? 0, sub: `${partner.redemptions_count ?? 0} iskorišteno` },
            { icon: <TrendingUp className="h-5 w-5 text-purple-500" />, label: "Konverzije", value: partner.conversions_count ?? 0, sub: "Potvrđeno" },
            { icon: <DollarSign className="h-5 w-5 text-green-600" />, label: "Komisija (potvrđena)", value: `€${totalCommission.toFixed(2)}`, sub: `Na čekanju: €${pendingCommission.toFixed(2)}`, valueClass: "text-green-600" },
          ].map((s, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  {s.icon} {s.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-3xl font-bold ${(s as any).valueClass || ""}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Partner info */}
          <Card>
            <CardHeader>
              <CardTitle>Informacije o partneru</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                ["Komisija", `${COMMISSION_LABELS[partner.commission_type]} — ${commissionRate}${partner.commission_type === "fixed_per_client" ? " EUR" : "%"}`],
                ["Trajanje vouchera", `${partner.default_voucher_duration_days ?? 0}d ${partner.default_voucher_duration_hours ?? 0}h`],
                ["Grad", partner.city || "—"],
                ["Adresa", partner.address || "—"],
                ["Telefon", partner.phone || "—"],
                ["Kontakt email", partner.contact_email || "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b pb-2 last:border-0">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}

              {partner.website_url && (
                <a href={partner.website_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline text-sm mt-1">
                  <ExternalLink className="h-4 w-4" /> {partner.website_url}
                </a>
              )}

              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">Tracking link</span>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded text-xs">
                    /go/{partner.tracking_code}
                  </code>
                  <button
                    onClick={() => copyCode(`https://balkly.net/go/${partner.tracking_code}`)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {copiedCode ? <CheckCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly commission summary */}
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
                <p className="text-muted-foreground text-center py-8">Nema podataka o konverzijama</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Offers */}
        {partner.offers?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Aktivne ponude</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {partner.offers.map((o: any) => (
                  <div key={o.id} className={`p-3 rounded-lg border ${!o.is_active ? "opacity-50 border-dashed" : "border-primary/20 bg-primary/5"}`}>
                    <p className="font-medium text-sm">{o.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{o.description}</p>
                    <p className="text-xs font-semibold text-primary mt-1">
                      {o.benefit_type === "percent_off" && `${o.benefit_value}% popust`}
                      {o.benefit_type === "fixed_off" && `€${o.benefit_value} popust`}
                      {o.benefit_type === "free_item" && "Besplatna stavka"}
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
            <CardHeader>
              <CardTitle>Osoblje</CardTitle>
            </CardHeader>
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
