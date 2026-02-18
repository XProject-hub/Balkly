"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Tag, Ticket, Loader2 } from "lucide-react";
import { toast } from "@/lib/toast";

const BENEFIT_DISPLAY: Record<string, (v: number) => string> = {
  percent_off: (v) => `${v}% Off`,
  fixed_off: (v) => `€${v} Off`,
  free_item: () => "Free Item",
};

export default function PartnerOffersPublicPage() {
  const params = useParams();
  const router = useRouter();
  const partnerId = params.partnerId as string;

  const [partner, setPartner] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<number | null>(null);

  useEffect(() => {
    loadOffers();
  }, [partnerId]);

  const loadOffers = async () => {
    try {
      const res = await fetch(`/api/v1/partners/${partnerId}/offers`);
      if (res.ok) {
        const data = await res.json();
        setPartner(data.partner);
        setOffers(data.offers || []);
      }
    } catch {
      toast.error("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  const handleGetOffer = async (offerId: number) => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    setGenerating(offerId);
    try {
      const res = await fetch("/api/v1/vouchers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ partner_id: parseInt(partnerId), offer_id: offerId }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/voucher/${data.voucher.code}`);
      } else {
        if (data.voucher) {
          router.push(`/voucher/${data.voucher.code}`);
        } else {
          toast.error(data.message || "Failed to generate voucher");
        }
      }
    } catch {
      toast.error("Network error");
    } finally {
      setGenerating(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Partner not found</h2>
          <Link href="/"><Button>Back to Home</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="secondary" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            {partner.company_logo ? (
              <img src={partner.company_logo} alt={partner.company_name} className="w-16 h-16 rounded-lg object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
                {partner.company_name[0]}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">{partner.company_name}</h1>
              {partner.company_description && (
                <p className="text-white/80 mt-1">{partner.company_description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Available Offers</h2>

        {offers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Tag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">No offers available right now</h3>
              <p className="text-muted-foreground">Check back later!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <Card key={offer.id} className="hover:shadow-lg transition overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 text-center">
                  <p className="text-3xl font-bold">
                    {BENEFIT_DISPLAY[offer.benefit_type]?.(offer.benefit_value) || offer.benefit_value}
                  </p>
                </div>
                <CardContent className="py-4">
                  <h3 className="font-semibold text-lg mb-2">{offer.title}</h3>
                  {offer.description && (
                    <p className="text-sm text-muted-foreground mb-3">{offer.description}</p>
                  )}
                  {offer.min_purchase && (
                    <p className="text-xs text-muted-foreground mb-3">Min purchase: €{offer.min_purchase}</p>
                  )}
                  {offer.terms && (
                    <p className="text-xs text-muted-foreground mb-3">{offer.terms}</p>
                  )}
                  <Button
                    onClick={() => handleGetOffer(offer.id)}
                    disabled={generating === offer.id}
                    className="w-full"
                  >
                    {generating === offer.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Ticket className="mr-2 h-4 w-4" />
                    )}
                    Get This Offer
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
