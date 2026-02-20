"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search, MapPin, Globe, Phone, QrCode, ExternalLink, Loader2,
} from "lucide-react";

export default function PartnersPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/partners");
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
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h1 className="text-4xl font-bold mb-3">Balkly Partneri</h1>
          <p className="text-lg opacity-90 mb-6">
            Posjeti naše partnere, dobij ekskluzivne pogodnosti i prati svoje posjete.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
            <input
              type="text"
              placeholder="Pretraži partnere..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl text-foreground bg-background border-0 shadow-lg focus:ring-2 focus:ring-white/30 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
              <Search className="h-10 w-10 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {search ? "Nema rezultata za ovu pretragu" : "Nema aktivnih partnera"}
            </h3>
            {search && (
              <Button variant="outline" onClick={() => setSearch("")}>
                Prikaži sve
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((p) => (
              <Card key={p.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="p-5">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                        {p.company_name?.[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-bold text-lg leading-tight">{p.company_name}</h2>
                        {p.city && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" /> {p.city}
                            {p.address && ` · ${p.address}`}
                          </p>
                        )}
                      </div>
                    </div>

                    {p.company_description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {p.company_description}
                      </p>
                    )}

                    {/* Offers preview */}
                    {p.offers?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {p.offers.slice(0, 3).map((o: any) => (
                          <span key={o.id}
                            className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                            {o.title}
                          </span>
                        ))}
                        {p.offers.length > 3 && (
                          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                            +{p.offers.length - 3} više
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <Link href={`/partners/${p.id}`} className="flex-1">
                        <Button className="w-full gap-2">
                          <QrCode className="h-4 w-4" /> Dobij posjetni kod
                        </Button>
                      </Link>
                      {p.website_url && (
                        <a href={p.website_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="icon" title="Website">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
