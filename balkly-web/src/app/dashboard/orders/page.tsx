"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Package, X } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : {};
      
      // Load orders
      const ordersRes = await fetch("/api/v1/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ordersData = await ordersRes.json();
      setOrders(ordersData.data || []);
      
      // Load user's listings
      const listingsRes = await fetch("/api/v1/listings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const listingsData = await listingsRes.json();
      const userListings = (listingsData.data || []).filter((l: any) => l.user_id === user.id);
      setMyListings(userListings);
      
      // Load plans
      const plansRes = await fetch("/api/v1/plans");
      const plansData = await plansRes.json();
      setPlans(plansData.plans || []);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = (listing: any) => {
    setSelectedListing(listing);
    setShowPromoteModal(true);
  };

  const handleSelectPlan = async (planId: number) => {
    try {
      const response = await fetch("/api/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          listing_id: selectedListing.id,
          plan_id: planId,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.checkout_url) {
          window.location.href = data.checkout_url;
        }
      } else {
        alert("Failed to create order");
      }
    } catch (error) {
      alert("Failed to create order");
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
          <h1 className="text-4xl font-bold mb-2">My Orders</h1>
          <p className="text-lg opacity-90">Promotions & transaction history</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
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
        ) : (
          <>
            {/* Promote Your Listings */}
            {myListings.length > 0 && (
              <Card className="mb-6 border-2 border-primary/20">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Promote Your Listings
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Boost visibility with premium plans
                  </p>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid gap-4">
                    {myListings.map((listing) => (
                      <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg hover:border-primary transition">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{listing.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {listing.status} • {listing.views_count} views
                          </p>
                        </div>
                        <Button onClick={() => handlePromote(listing)}>
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Promote
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Past Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="py-12 text-center">
                    <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No promotion orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">Order #{order.id}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Promote Modal */}
      {showPromoteModal && selectedListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-3xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Promote: {selectedListing.title}</h2>
              <button onClick={() => setShowPromoteModal(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid gap-4">
              {plans.map((plan) => (
                <div key={plan.id} className="border-2 rounded-lg p-6 hover:border-primary transition cursor-pointer"
                     onClick={() => handleSelectPlan(plan.id)}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">€{plan.price}</p>
                      <p className="text-xs text-muted-foreground">{plan.duration_days} days</p>
                    </div>
                  </div>
                  <ul className="text-sm space-y-1 mt-4">
                    <li>✓ Featured placement</li>
                    <li>✓ Higher visibility</li>
                    <li>✓ More views</li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
