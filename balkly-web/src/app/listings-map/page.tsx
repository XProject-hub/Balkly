"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { List, Map as MapIcon, Filter } from "lucide-react";
import { listingsAPI } from "@/lib/api";

// Dynamic import to avoid SSR issues with Leaflet
const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] bg-muted rounded-lg flex items-center justify-center">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
});

export default function ListingsMapPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"map" | "list">("map");
  const [filters, setFilters] = useState({
    category_id: "",
    min_price: "",
    max_price: "",
  });

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    setLoading(true);
    try {
      const params: any = { per_page: 100 };
      if (filters.category_id) params.category_id = filters.category_id;
      if (filters.min_price) params.min_price = filters.min_price;
      if (filters.max_price) params.max_price = filters.max_price;
      
      const response = await listingsAPI.getAll(params);
      setListings(response.data.data || []);
    } catch (error) {
      console.error("Failed to load listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    loadListings();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Map View</h1>
              <p className="text-lg opacity-90">
                Explore listings on the map
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={view === "map" ? "secondary" : "outline"}
                onClick={() => setView("map")}
              >
                <MapIcon className="mr-2 h-4 w-4" />
                Map
              </Button>
              <Button
                variant={view === "list" ? "secondary" : "outline"}
                onClick={() => setView("list")}
                asChild
              >
                <Link href="/listings">
                  <List className="mr-2 h-4 w-4" />
                  List
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h3 className="font-bold mb-4 flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Filters
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select 
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                    value={filters.category_id}
                    onChange={(e) => setFilters({ ...filters, category_id: e.target.value })}
                  >
                    <option value="">All Categories</option>
                    <option value="1">Auto</option>
                    <option value="2">Real Estate</option>
                    <option value="3">Electronics</option>
                    <option value="4">Fashion</option>
                    <option value="5">Home & Garden</option>
                    <option value="6">Sports & Hobbies</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                      value={filters.min_price}
                      onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                      value={filters.max_price}
                      onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
                    />
                  </div>
                </div>

                <Button className="w-full" onClick={applyFilters}>
                  Apply Filters
                </Button>
              </div>
            </Card>

            {/* Listing Count */}
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Showing <strong>{listings.length}</strong> listings
              </p>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="h-[600px] bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Loading listings...</p>
              </div>
            ) : (
              <Card className="overflow-hidden">
                <MapView listings={listings} height="600px" />
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

