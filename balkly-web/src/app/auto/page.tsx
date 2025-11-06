"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, MapPin, Eye, Star } from "lucide-react";
import { listingsAPI } from "@/lib/api";

export default function AutoPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    vehicle_type: "",
    brand: "",
    year_from: "",
    year_to: "",
    fuel_type: "",
    transmission: "",
    mileage_max: "",
    min_price: "",
    max_price: "",
    city: "",
  });

  const carBrands = [
    "Audi", "BMW", "Mercedes-Benz", "Volkswagen", "Porsche", "Opel", "Ford",
    "Toyota", "Honda", "Nissan", "Mazda", "Hyundai", "Kia", "Suzuki",
    "Renault", "Peugeot", "Citroën", "Fiat", "Alfa Romeo", "Lancia",
    "Volvo", "Seat", "Skoda", "Dacia", "Chevrolet", "Jeep", "Tesla",
    "Ferrari", "Lamborghini", "Porsche", "Bugatti", "McLaren", "Aston Martin",
  ].sort();

  useEffect(() => {
    loadListings();
  }, [filters]);

  const loadListings = async () => {
    setLoading(true);
    try {
      const response = await listingsAPI.getAll({ category_id: 1, ...filters });
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
          <h1 className="text-5xl font-bold mb-4">Auto & Vehicles</h1>
          <p className="text-xl opacity-90">
            Find your perfect car, motorcycle, or truck
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
                {/* Vehicle Type */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Vehicle Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Cars', 'Motors', 'Trucks'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilters({ ...filters, vehicle_type: type.toLowerCase() })}
                        className={`px-3 py-2 text-xs font-medium rounded-lg border-2 transition-all ${
                          filters.vehicle_type === type.toLowerCase()
                            ? 'border-balkly-blue bg-blue-50 text-balkly-blue'
                            : 'border-gray-200 hover:border-balkly-blue'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Brand</label>
                  <select
                    value={filters.brand}
                    onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">All Brands</option>
                    {carBrands.map((brand) => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                {/* Year Range */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Year</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={filters.year_from}
                      onChange={(e) => setFilters({ ...filters, year_from: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-sm"
                    >
                      <option value="">From</option>
                      {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <select
                      value={filters.year_to}
                      onChange={(e) => setFilters({ ...filters, year_to: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-sm"
                    >
                      <option value="">To</option>
                      {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Fuel Type */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Fuel Type</label>
                  <select
                    value={filters.fuel_type}
                    onChange={(e) => setFilters({ ...filters, fuel_type: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">Any</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="lpg">LPG</option>
                  </select>
                </div>

                {/* Transmission */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Transmission</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Manual', 'Automatic'].map((trans) => (
                      <button
                        key={trans}
                        onClick={() => setFilters({ ...filters, transmission: trans.toLowerCase() })}
                        className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                          filters.transmission === trans.toLowerCase()
                            ? 'border-balkly-blue bg-blue-50 text-balkly-blue'
                            : 'border-gray-200 hover:border-balkly-blue'
                        }`}
                      >
                        {trans}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mileage */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Max Mileage (km)</label>
                  <input
                    type="number"
                    value={filters.mileage_max}
                    onChange={(e) => setFilters({ ...filters, mileage_max: e.target.value })}
                    placeholder="e.g., 100000"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
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

                {/* Clear Filters */}
                <Button
                  onClick={() => setFilters({
                    vehicle_type: "",
                    brand: "",
                    year_from: "",
                    year_to: "",
                    fuel_type: "",
                    transmission: "",
                    mileage_max: "",
                    min_price: "",
                    max_price: "",
                    city: "",
                  })}
                  variant="outline"
                  className="w-full"
                >
                  Clear All Filters
                </Button>

                <Button
                  className="w-full bg-gradient-to-r from-balkly-blue to-iris-purple text-white"
                  asChild
                >
                  <Link href="/listings/create?category=auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Post Auto Listing
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Listings Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Showing {listings.length} vehicles
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/auto-map">
                  <MapPin className="mr-2 h-4 w-4" />
                  Map View
                </Link>
              </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse bg-white">
                    <div className="h-48 bg-gray-200" />
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : listings.length === 0 ? (
              <Card className="bg-white">
                <CardContent className="py-16 text-center">
                  <p className="text-gray-600 mb-4">No vehicles found</p>
                  <Button className="bg-gradient-to-r from-balkly-blue to-iris-purple text-white" asChild>
                    <Link href="/listings/create?category=auto">Post the First Vehicle</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <Link key={listing.id} href={`/listings/${listing.id}`}>
                    <Card className="hover:shadow-xl transition-all cursor-pointer h-full bg-white group">
                      <div className="aspect-video bg-gray-100 relative overflow-hidden">
                        {listing.media?.[0] ? (
                          <img
                            src={listing.media[0].url}
                            alt={listing.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-16 w-16 text-gray-300" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-balkly-blue text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current" />
                          FEATURED
                        </div>
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg line-clamp-1 group-hover:text-balkly-blue transition-colors">
                          {listing.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-xs">
                          {listing.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-balkly-blue">
                            €{listing.price?.toLocaleString() || "Contact"}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {listing.city}
                          </span>
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

