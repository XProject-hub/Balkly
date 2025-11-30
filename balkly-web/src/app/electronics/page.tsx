"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, MapPin, Package } from "lucide-react";
import { listingsAPI } from "@/lib/api";
import PriceDisplay from "@/components/PriceDisplay";

export default function ElectronicsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    device_type: "",
    brand: "",
    condition: "",
    min_price: "",
    max_price: "",
    city: "",
  });

  const electronicsBrands = ["Apple", "Samsung", "Huawei", "Xiaomi", "OnePlus", "Sony", "LG", "Google", "Nokia", "Motorola", "Asus", "Dell", "HP", "Lenovo", "Acer", "MSI"].sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    loadListings();
  }, [filters]);

  const loadListings = async () => {
    setLoading(true);
    try {
      const response = await listingsAPI.getAll({ category_id: 4, ...filters });
      setListings(response.data.data || []);
    } catch (error) {
      console.error("Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mist-50">
      <div className="text-white py-12" style={{background: 'linear-gradient(135deg, #0F172A 0%, #111827 100%)'}}>
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Electronics & Gadgets</h1>
          <p className="text-xl opacity-90">Phones, computers, and tech devices</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="bg-white sticky top-20">
              <CardHeader><CardTitle className="text-gray-900">Filters</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Device Type</label>
                  <select value={filters.device_type} onChange={(e) => setFilters({ ...filters, device_type: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
                    <option value="">All Types</option>
                    <option value="phone">Mobile Phones</option>
                    <option value="laptop">Laptops</option>
                    <option value="tablet">Tablets</option>
                    <option value="desktop">Desktops</option>
                    <option value="camera">Cameras</option>
                    <option value="tv">TVs</option>
                    <option value="audio">Audio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Brand</label>
                  <select value={filters.brand} onChange={(e) => setFilters({ ...filters, brand: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
                    <option value="">All Brands</option>
                    {electronicsBrands.map((brand) => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Condition</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['New', 'Used'].map((cond) => (
                      <button
                        key={cond}
                        onClick={() => setFilters({ ...filters, condition: cond.toLowerCase() })}
                        className={`px-4 py-2 text-sm font-medium rounded-lg border-2 ${filters.condition === cond.toLowerCase() ? 'border-balkly-blue bg-blue-50 text-balkly-blue' : 'border-gray-200 hover:border-balkly-blue'}`}
                      >
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Price Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" value={filters.min_price} onChange={(e) => setFilters({ ...filters, min_price: e.target.value })} placeholder="Min" className="px-3 py-2 border rounded-lg" />
                    <input type="number" value={filters.max_price} onChange={(e) => setFilters({ ...filters, max_price: e.target.value })} placeholder="Max" className="px-3 py-2 border rounded-lg" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">City</label>
                  <input type="text" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} placeholder="e.g., Dubai" className="w-full px-4 py-2 border rounded-lg" />
                </div>

                <Button className="w-full bg-gradient-to-r from-balkly-blue to-iris-purple text-white" asChild>
                  <Link href="/listings/create?category=electronics"><Plus className="mr-2 h-4 w-4" />Post Electronics</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <p className="text-gray-600 mb-6">Showing {listings.length} items</p>
            {loading ? <p>Loading...</p> : listings.length === 0 ? (
              <Card className="bg-white"><CardContent className="py-16 text-center"><p className="text-gray-600 mb-4">No items found</p></CardContent></Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <Link key={listing.id} href={`/listings/${listing.id}`}>
                    <Card className="hover:shadow-xl transition-all bg-white group">
                      <div className="aspect-video bg-gray-100 overflow-hidden">
                        {listing.media?.[0] ? <img src={listing.media[0].url} alt={listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" /> : <div className="w-full h-full flex items-center justify-center"><Package className="h-16 w-16 text-gray-300" /></div>}
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg line-clamp-1 group-hover:text-balkly-blue">{listing.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        {listing.price ? (
                          <PriceDisplay
                            amount={listing.price}
                            currency={listing.currency || 'EUR'}
                            className="text-2xl font-bold text-balkly-blue"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-balkly-blue">Contact</span>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

