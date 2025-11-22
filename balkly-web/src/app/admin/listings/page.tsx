"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, Check, X } from "lucide-react";
import PriceDisplay from "@/components/PriceDisplay";

export default function AdminListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadListings();
  }, [filter]);

  const loadListings = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/listings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      const data = await response.json();
      setListings(data.data || []);
    } catch (error) {
      console.error("Failed to load listings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mist-50">
      <div className="text-white py-8" style={{background: 'linear-gradient(135deg, #0F172A 0%, #111827 100%)'}}>
        <div className="container mx-auto px-4">
          <Link href="/admin">
            <Button variant="secondary" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Admin Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">All Listings</h1>
          <p className="text-lg opacity-90">View and manage platform listings</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
            All ({listings.length})
          </Button>
          <Button variant={filter === "active" ? "default" : "outline"} onClick={() => setFilter("active")}>
            Active ({listings.filter(l => l.status === 'active').length})
          </Button>
          <Button variant={filter === "pending" ? "default" : "outline"} onClick={() => setFilter("pending")}>
            Pending ({listings.filter(l => l.status === 'pending_review').length})
          </Button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : listings.length === 0 ? (
          <Card className="bg-white">
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">No listings yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {listings.filter(l => filter === "all" || l.status === filter || (filter === "pending" && l.status === "pending_review")).map((listing) => (
              <Card key={listing.id} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-32 h-32 bg-gray-100 rounded-lg flex-shrink-0">
                      {listing.media?.[0] && (
                        <img src={listing.media[0].url} alt={listing.title} className="w-full h-full object-cover rounded-lg" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">{listing.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{listing.description}</p>
                      <div className="flex gap-4 mt-3 text-sm">
                        {listing.price ? (
                          <PriceDisplay
                            amount={listing.price}
                            currency={listing.currency || 'EUR'}
                            className="font-bold text-balkly-blue"
                          />
                        ) : (
                          <span className="font-bold text-balkly-blue">Contact</span>
                        )}
                        <span className="text-gray-500">{listing.city}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          listing.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {listing.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/listings/${listing.id}`}><Eye className="h-4 w-4" /></Link>
                      </Button>
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

