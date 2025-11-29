"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check, X, MessageCircle } from "lucide-react";

export default function OffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/offers/my", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      const data = await response.json();
      setOffers(data.offers || []);
    } catch (error) {
      console.error("Failed to load offers:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'countered': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <Link href="/dashboard">
            <Button variant="secondary" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">My Offers</h1>
          <p className="text-lg opacity-90">Offers you've made on listings</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : offers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No offers made yet</p>
              <Button asChild>
                <Link href="/listings">Browse Listings</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {offers.map((offer) => (
              <Card key={offer.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        <Link href={`/listings/${offer.listing_id}`} className="hover:text-primary">
                          {offer.listing?.title}
                        </Link>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Offered: €{parseFloat(offer.amount).toLocaleString('de-DE', {minimumFractionDigits: 2})} | 
                        Original: €{parseFloat(offer.listing?.price || 0).toLocaleString('de-DE', {minimumFractionDigits: 2})}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(offer.status)}`}>
                      {offer.status.toUpperCase()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  {offer.message && (
                    <div className="mb-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm">{offer.message}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>To: {offer.seller?.name}</span>
                    <span>•</span>
                    <span>{new Date(offer.created_at).toLocaleDateString()}</span>
                    {offer.expires_at && offer.status === 'pending' && (
                      <>
                        <span>•</span>
                        <span>Expires: {new Date(offer.expires_at).toLocaleDateString()}</span>
                      </>
                    )}
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

