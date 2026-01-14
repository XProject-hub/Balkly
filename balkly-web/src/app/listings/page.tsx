"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, MapPin, Plus, Map } from "lucide-react";
import { listingsAPI, categoriesAPI } from "@/lib/api";
import PriceDisplay from "@/components/PriceDisplay";
import AdBanner from "@/components/AdBanner";

export default function ListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category_id: "",
    city: "",
    min_price: "",
    max_price: "",
    sort_by: "created_at",
    sort_order: "desc",
    vehicle_type: "",
    brand: "",
    year: "",
  });

  const carBrands = [
    "Audi", "BMW", "Mercedes-Benz", "Volkswagen", "Porsche", "Opel", "Ford",
    "Toyota", "Honda", "Nissan", "Mazda", "Hyundai", "Kia", "Suzuki",
    "Renault", "Peugeot", "Citroën", "Fiat", "Alfa Romeo", "Lancia",
    "Volvo", "Saab", "Seat", "Skoda", "Dacia", "Chevrolet", "Jeep",
    "Dodge", "Chrysler", "Cadillac", "Buick", "GMC", "Tesla", "Lexus",
    "Infiniti", "Acura", "Subaru", "Mitsubishi", "Isuzu", "Land Rover",
    "Jaguar", "Mini", "Smart", "Aston Martin", "Bentley", "Rolls-Royce",
    "Ferrari", "Lamborghini", "Maserati", "Bugatti", "McLaren",
  ].sort((a, b) => a.localeCompare(b));

  const [realEstateFilters, setRealEstateFilters] = useState({
    listing_type: "",
    property_type: "",
    bedrooms: "",
    bathrooms: "",
    area_min: "",
    area_max: "",
  });

  useEffect(() => {
    loadCategories();
    loadListings();
  }, [filters]);

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const loadListings = async () => {
    setLoading(true);
    try {
      const response = await listingsAPI.getAll(filters);
      setListings(response.data.data || []);
    } catch (error) {
      console.error("Failed to load listings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Browse Listings</h1>
              <p className="text-lg opacity-90">
                Find amazing deals on cars, real estate, and more
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/listings-map">
                  <Map className="mr-2 h-5 w-5" />
                  Map View
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/listings/create">
                  <Plus className="mr-2 h-5 w-5" />
                  Post Listing
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Ad Banner - Listings Top */}
      <AdBanner position="listings_top" className="container mx-auto px-4 py-4" />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="mr-2 h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={filters.category_id}
                    onChange={(e) => setFilters({ ...filters, category_id: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Real Estate specific filters */}
                {categories.find(c => c.id == filters.category_id)?.slug === "real-estate" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Listing Type</label>
                      <select
                        value={realEstateFilters.listing_type}
                        onChange={(e) => setRealEstateFilters({ ...realEstateFilters, listing_type: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="">All</option>
                        <option value="rent">For Rent</option>
                        <option value="buy">For Sale</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Property Type</label>
                      <select
                        value={realEstateFilters.property_type}
                        onChange={(e) => setRealEstateFilters({ ...realEstateFilters, property_type: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
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

                    <div>
                      <label className="block text-sm font-medium mb-2">Bedrooms</label>
                      <select
                        value={realEstateFilters.bedrooms}
                        onChange={(e) => setRealEstateFilters({ ...realEstateFilters, bedrooms: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="">Any</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                        <option value="5">5+</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Bathrooms</label>
                      <select
                        value={realEstateFilters.bathrooms}
                        onChange={(e) => setRealEstateFilters({ ...realEstateFilters, bathrooms: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="">Any</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Area (m²)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          value={realEstateFilters.area_min}
                          onChange={(e) => setRealEstateFilters({ ...realEstateFilters, area_min: e.target.value })}
                          placeholder="Min m²"
                          className="px-3 py-2 border rounded-lg"
                        />
                        <input
                          type="number"
                          value={realEstateFilters.area_max}
                          onChange={(e) => setRealEstateFilters({ ...realEstateFilters, area_max: e.target.value })}
                          placeholder="Max m²"
                          className="px-3 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Car/Auto specific filters */}
                {categories.find(c => c.id == filters.category_id)?.slug === "auto" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Vehicle Type</label>
                      <select
                        value={filters.vehicle_type}
                        onChange={(e) => setFilters({ ...filters, vehicle_type: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="">All Types</option>
                        <option value="car">Cars</option>
                        <option value="motorcycle">Motorcycles</option>
                        <option value="truck">Trucks</option>
                        <option value="van">Vans</option>
                        <option value="suv">SUVs</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Brand</label>
                      <select
                        value={filters.brand}
                        onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="">All Brands</option>
                        {carBrands.map((brand) => (
                          <option key={brand} value={brand}>
                            {brand}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Year</label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={filters.year}
                          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          <option value="">Any Year</option>
                          {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                    placeholder="e.g., Dubai"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price Range</label>
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

                <div>
                  <label className="block text-sm font-medium mb-2">Sort By</label>
                  <select
                    value={filters.sort_by}
                    onChange={(e) => setFilters({ ...filters, sort_by: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="created_at">Newest First</option>
                    <option value="price">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="views_count">Most Viewed</option>
                  </select>
                </div>

                <Button
                  onClick={() => {
                    setFilters({
                      category_id: "",
                      city: "",
                      min_price: "",
                      max_price: "",
                      sort_by: "created_at",
                      sort_order: "desc",
                      vehicle_type: "",
                      brand: "",
                      year: "",
                    });
                    setRealEstateFilters({
                      listing_type: "",
                      property_type: "",
                      bedrooms: "",
                      bathrooms: "",
                      area_min: "",
                      area_max: "",
                    });
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
            
            {/* Sidebar Ad Banner */}
            <AdBanner position="listings_sidebar" className="hidden lg:block" />
          </div>

          {/* Listings Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <p className="text-muted-foreground">
                Showing {listings.length} listings
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted" />
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded mb-2" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : listings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    No listings found matching your criteria
                  </p>
                  <Button asChild>
                    <Link href="/listings/create">Post the First Listing</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <Link key={listing.id} href={`/listings/${listing.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <div className="aspect-video bg-muted relative overflow-hidden">
                        {listing.media?.[0] ? (
                          <img
                            src={listing.media[0].url}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-6xl">📦</span>
                          </div>
                        )}
                        {listing.status === "featured" && (
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-bold">
                            FEATURED
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-1">{listing.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {listing.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between items-center">
                          {listing.price ? (
                            <PriceDisplay
                              amount={listing.price}
                              currency={listing.currency || 'EUR'}
                              className="text-2xl font-bold text-primary"
                            />
                          ) : (
                            <span className="text-2xl font-bold text-primary">Contact for price</span>
                          )}
                          <span className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {listing.city}
                          </span>
                        </div>
                        {listing.user && (
                          <div className="pt-2 border-t flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                              {listing.user.name?.[0]?.toUpperCase()}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {listing.user.name}
                            </span>
                          </div>
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

