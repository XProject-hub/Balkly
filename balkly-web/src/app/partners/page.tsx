"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Search, MapPin, Globe, QrCode, ExternalLink, Loader2, ChevronRight, Star,
} from "lucide-react";

export default function PartnersPage() {
  const router = useRouter();
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/auth/login?redirect=/partners");
      return;
    }
    loadPartners();
  }, []);

  const loadPartners = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/v1/partners", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setPartners(data.data || data || []);
      }
    } catch {}
    setLoading(false);
  };

  const filtered = partners.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.company_name?.toLowerCase().includes(q) ||
      p.city?.toLowerCase().includes(q) ||
      p.company_description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground py-16">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="container mx-auto px-4 text-center max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Star className="h-3.5 w-3.5" /> Ekskluzivni partneri
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">Balkly Partneri</h1>
          <p className="text-lg opacity-90 mb-8">
            Posjeti naše partnere, dobij ekskluzivne pogodnosti i prati svoje posjete.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/50" />
            <input
              type="text"
              placeholder="Pretraži partnere po imenu ili gradu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-foreground bg-background shadow-xl focus:ring-2 focus:ring-white/30 outline-none text-sm"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
              <Search className="h-10 w-10 text-muted-foreground opacity-40" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {search ? "Nema rezultata za ovu pretragu" : "Nema aktivnih partnera"}
            </h3>
            {search && (
              <Button variant="outline" onClick={() => setSearch("")}>Prikaži sve</Button>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">{filtered.length} partner{filtered.length !== 1 ? "a" : ""}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <PartnerCard key={p.id} partner={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PartnerCard({ partner: p }: { partner: any }) {
  const initials = p.company_name
    ?.split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase() || "?";

  return (
    <div className="group relative flex flex-col bg-card rounded-2xl border border-border/60 overflow-hidden hover:border-primary/40 hover:shadow-xl transition-all duration-300">
      {/* Top banner / logo area */}
      <div className="relative h-36 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)", backgroundSize: "12px 12px" }} />
        {p.company_logo ? (
          <img
            src={p.company_logo}
            alt={p.company_name}
            className="h-20 w-20 object-contain rounded-2xl shadow-lg bg-background p-1"
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              t.style.display = "none";
              t.nextElementSibling?.classList.remove("hidden");
            }}
          />
        ) : null}
        <div className={`${p.company_logo ? "hidden" : ""} w-20 h-20 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-black shadow-lg`}>
          {initials}
        </div>
        {p.website_url && (
          <a
            href={p.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors shadow"
            title="Website"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </a>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h2 className="font-bold text-lg leading-tight mb-1 group-hover:text-primary transition-colors">
          {p.company_name}
        </h2>

        {p.city && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
            <MapPin className="h-3 w-3 shrink-0" />
            {p.city}{p.address ? ` · ${p.address}` : ""}
          </p>
        )}

        {p.company_description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
            {p.company_description}
          </p>
        )}

        {/* Offer tags */}
        {p.offers?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {p.offers.slice(0, 2).map((o: any) => (
              <span key={o.id} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                {o.title}
              </span>
            ))}
            {p.offers.length > 2 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                +{p.offers.length - 2}
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <Link href={`/partners/${p.id}`} className="mt-auto">
          <Button className="w-full gap-2 rounded-xl font-semibold group-hover:shadow-md transition-shadow">
            <QrCode className="h-4 w-4" />
            Dobij posjetni kod
            <ChevronRight className="h-4 w-4 ml-auto opacity-60" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
