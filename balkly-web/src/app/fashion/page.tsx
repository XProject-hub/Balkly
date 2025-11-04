"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Package } from "lucide-react";
import { listingsAPI } from "@/lib/api";

export default function FashionPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category_type: "",
    size: "",
    gender: "",
    condition: "",
    min_price: "",
    max_price: "",
    city: "",
  });

  useEffect(() => { loadListings(); }, [filters]);

  const loadListings = async () => {
    setLoading(true);
    try {
      const response = await listingsAPI.getAll({ category_id: 5, ...filters });
      setListings(response.data.data || []);
    } catch (error) {}
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-white py-12" style={{background: 'linear-gradient(135deg, #0F172A 0%, #111827 100%)'}}>
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Fashion & Clothing</h1>
          <p className="text-xl opacity-90">Clothing, shoes, and accessories</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="bg-white lg:col-span-1 h-fit sticky top-20">
            <CardHeader><CardTitle className="text-gray-900">Filters</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Category</label>
                <select value={filters.category_type} onChange={(e) => setFilters({ ...filters, category_type: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">All</option>
                  <option value="clothing">Clothing</option>
                  <option value="shoes">Shoes</option>
                  <option value="bags">Bags</option>
                  <option value="accessories">Accessories</option>
                  <option value="watches">Watches</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Gender</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Men', 'Women', 'Kids'].map((g) => (
                    <button key={g} onClick={() => setFilters({ ...filters, gender: g.toLowerCase() })} className={`px-3 py-2 text-xs font-medium rounded-lg border-2 ${filters.gender === g.toLowerCase() ? 'border-balkly-blue bg-blue-50 text-balkly-blue' : 'border-gray-200'}`}>{g}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Condition</label>
                <div className="grid grid-cols-2 gap-2">
                  {['New', 'Used'].map((c) => (
                    <button key={c} onClick={() => setFilters({ ...filters, condition: c.toLowerCase() })} className={`px-4 py-2 text-sm font-medium rounded-lg border-2 ${filters.condition === c.toLowerCase() ? 'border-balkly-blue bg-blue-50 text-balkly-blue' : 'border-gray-200'}`}>{c}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Price Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" value={filters.min_price} onChange={(e) => setFilters({ ...filters, min_price: e.target.value })} placeholder="Min" className="px-3 py-2 border rounded-lg" />
                  <input type="number" value={filters.max_price} onChange={(e) => setFilters({ ...filters, max_price: e.target.value })} placeholder="Max" className="px-3 py-2 border rounded-lg" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">City</label>
                <input type="text" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} placeholder="e.g., Dubai" className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <Button className="w-full bg-gradient-to-r from-balkly-blue to-iris-purple text-white" asChild>
                <Link href="/listings/create?category=fashion"><Plus className="mr-2 h-4 w-4" />Post Fashion Item</Link>
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-3">
            <p className="text-gray-600 mb-6">Showing {listings.length} items</p>
            {loading ? <p>Loading...</p> : listings.length === 0 ? (
              <Card className="bg-white"><CardContent className="py-16 text-center"><Button className="bg-gradient-to-r from-balkly-blue to-iris-purple text-white" asChild><Link href="/listings/create?category=fashion">Post First Item</Link></Button></CardContent></Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <Link key={listing.id} href={`/listings/${listing.id}`}><Card className="hover:shadow-xl bg-white group"><div className="aspect-video bg-gray-100">{listing.media?.[0] && <img src={listing.media[0].url} alt={listing.title} className="w-full h-full object-cover" />}</div><CardHeader className="p-4"><CardTitle className="text-lg group-hover:text-balkly-blue">{listing.title}</CardTitle></CardHeader><CardContent className="px-4 pb-4"><span className="text-2xl font-bold text-balkly-blue">€{listing.price?.toLocaleString()}</span></CardContent></Card></Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

