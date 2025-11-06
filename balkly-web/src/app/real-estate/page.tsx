"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, MapPin, Star, Home as HomeIcon, Package } from "lucide-react";
import { listingsAPI } from "@/lib/api";

export default function RealEstatePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    listing_type: "",
    property_type: "",
    bedrooms: "",
    bathrooms: "",
    area_min: "",
    area_max: "",
    min_price: "",
    max_price: "",
    city: "",
  });

  useEffect(() => {
    loadListings();
  }, [filters]);

  const loadListings = async () => {
    setLoading(true);
    try {
      const response = await listingsAPI.getAll({ category_id: 2, ...filters });
      setListings(response.data.data || []);
    } catch (error) {
      console.error("Failed to load listings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mist-50">
      {/* Header */}
      <div className="text-white py-12" style={{background: 'linear-gradient(135deg, #0F172A 0%, #111827 100%)'}}>
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Real Estate</h1>
          <p className="text-xl opacity-90">
            Find your dream home or perfect investment
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white sticky top-20">
              <CardHeader>
                <CardTitle className="text-gray-900">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Rent or Buy */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Listing Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Rent', 'Buy'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilters({ ...filters, listing_type: type.toLowerCase() })}
                        className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                          filters.listing_type === type.toLowerCase()
                            ? 'border-balkly-blue bg-blue-50 text-balkly-blue'
                            : 'border-gray-200 hover:border-balkly-blue'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Property Type</label>
                  <select
                    value={filters.property_type}
                    onChange={(e) => setFilters({ ...filters, property_type: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="land">Land</option>
                    <option value="commercial">Commercial</option>
                    <option value="office">Office</option>
                  </select>
                </div>

                {/* Bedrooms & Bathrooms */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">Bedrooms</label>
                    <select
                      value={filters.bedrooms}
                      onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    >
                      <option value="">Any</option>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>{num}+</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">Bathrooms</label>
                    <select
                      value={filters.bathrooms}
                      onChange={(e) => setFilters({ ...filters, bathrooms: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    >
                      <option value="">Any</option>
                      {[1, 2, 3, 4].map((num) => (
                        <option key={num} value={num}>{num}+</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Area Range */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Area (m²)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={filters.area_min}
                      onChange={(e) => setFilters({ ...filters, area_min: e.target.value })}
                      placeholder="Min"
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="number"
                      value={filters.area_max}
                      onChange={(e) => setFilters({ ...filters, area_max: e.target.value })}
                      placeholder="Max"
                      className="px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Price Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={filters.min_price}
                      onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
                      placeholder="Min"
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="number"
                      value={filters.max_price}
                      onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
                      placeholder="Max"
                      className="px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">City</label>
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                    placeholder="e.g., Dubai"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-balkly-blue to-iris-purple text-white"
                  asChild
                >
                  <Link href="/listings/create?category=real-estate">
                    <Plus className="mr-2 h-4 w-4" />
                    Post Property
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Listings Grid - Same as auto */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <p className="text-gray-600">Showing {listings.length} properties</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse bg-white">
                    <div className="h-48 bg-gray-200" />
                  </Card>
                ))}
              </div>
            ) : listings.length === 0 ? (
              <Card className="bg-white">
                <CardContent className="py-16 text-center">
                  <p className="text-gray-600 mb-4">No properties found</p>
                  <Button className="bg-gradient-to-r from-balkly-blue to-iris-purple text-white" asChild>
                    <Link href="/listings/create?category=real-estate">Post First Property</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <Link key={listing.id} href={`/listings/${listing.id}`}>
                    <Card className="hover:shadow-xl transition-all bg-white group">
                      <div className="aspect-video bg-gray-100 overflow-hidden">
                        {listing.media?.[0] ? (
                          <img src={listing.media[0].url} alt={listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <HomeIcon className="h-16 w-16 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg line-clamp-1 group-hover:text-balkly-blue">{listing.title}</CardTitle>
                        <CardDescription className="line-clamp-2 text-xs">{listing.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-balkly-blue">€{listing.price?.toLocaleString()}</span>
                          <span className="text-sm text-gray-500">{listing.city}</span>
                        </div>
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

