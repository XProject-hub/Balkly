"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Package, MapPin } from "lucide-react";
import { listingsAPI } from "@/lib/api";
import PriceDisplay from "@/components/PriceDisplay";

interface CategoryListingsPageProps {
  slug: string;
  title: string;
  subtitle: string;
  gradient?: string;
  conditions?: string[];
  extraFilters?: { label: string; key: string; options: { value: string; label: string }[] }[];
}

export default function CategoryListingsPage({
  slug,
  title,
  subtitle,
  gradient = "linear-gradient(135deg, #0F172A 0%, #111827 100%)",
  conditions = ["New", "Like New", "Good", "Used"],
  extraFilters = [],
}: CategoryListingsPageProps) {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({
    condition: "",
    min_price: "",
    max_price: "",
    city: "",
    ...Object.fromEntries(extraFilters.map((f) => [f.key, ""])),
  });

  // Fetch category ID by slug then load listings
  useEffect(() => {
    fetch("/api/v1/categories", {
      headers: { Accept: "application/json" },
    })
      .then((r) => r.json())
      .then((data) => {
        const cats: any[] = data.data || data || [];
        const found = cats.find((c: any) => c.slug === slug);
        if (found) setCategoryId(found.id);
      })
      .catch(() => {});
  }, [slug]);

  useEffect(() => {
    loadListings();
  }, [categoryId, filters]);

  const loadListings = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { ...filters };
      if (categoryId) params.category_id = categoryId;

      const response = await listingsAPI.getAll(params);
      setListings(response.data?.data || []);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const setFilter = (key: string, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const clearFilters = () =>
    setFilters({
      condition: "",
      min_price: "",
      max_price: "",
      city: "",
      ...Object.fromEntries(extraFilters.map((f) => [f.key, ""])),
    });

  return (
    <div className="min-h-screen bg-mist-50">
      {/* Header */}
      <div className="text-white py-12" style={{ background: gradient }}>
        <div className="container mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">{title}</h1>
          <p className="text-lg opacity-90">{subtitle}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="bg-white sticky top-20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-gray-900 text-base">Filteri</CardTitle>
                <button
                  onClick={clearFilters}
                  className="text-xs text-balkly-blue hover:underline"
                >
                  Resetuj
                </button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Extra category-specific filters */}
                {extraFilters.map((f) => (
                  <div key={f.key}>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">
                      {f.label}
                    </label>
                    <select
                      value={filters[f.key]}
                      onChange={(e) => setFilter(f.key, e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    >
                      <option value="">Sve</option>
                      {f.options.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                {/* Condition */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">
                    Stanje
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {conditions.map((c) => (
                      <button
                        key={c}
                        onClick={() =>
                          setFilter(
                            "condition",
                            filters.condition === c.toLowerCase() ? "" : c.toLowerCase()
                          )
                        }
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border-2 transition-colors ${
                          filters.condition === c.toLowerCase()
                            ? "border-balkly-blue bg-blue-50 text-balkly-blue"
                            : "border-gray-200 hover:border-balkly-blue"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price range */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">
                    Cijena (EUR)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={filters.min_price}
                      onChange={(e) => setFilter("min_price", e.target.value)}
                      placeholder="Min"
                      className="px-3 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      value={filters.max_price}
                      onChange={(e) => setFilter("max_price", e.target.value)}
                      placeholder="Max"
                      className="px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">
                    Grad
                  </label>
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) => setFilter("city", e.target.value)}
                    placeholder="npr. Dubai"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-balkly-blue to-iris-purple text-white"
                  asChild
                >
                  <Link href={`/listings/create?category=${slug}`}>
                    <Plus className="mr-2 h-4 w-4" /> Postavi oglas
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Listings */}
          <div className="lg:col-span-3">
            <p className="text-gray-500 mb-4 text-sm">
              {loading ? "Učitavanje..." : `${listings.length} oglasa`}
            </p>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : listings.length === 0 ? (
              <Card className="bg-white">
                <CardContent className="py-16 text-center">
                  <Package className="h-14 w-14 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 mb-2 font-medium">Nema oglasa u ovoj kategoriji</p>
                  <p className="text-gray-400 text-sm mb-6">Budi prvi koji objavljuje oglas!</p>
                  <Button asChild>
                    <Link href={`/listings/create?category=${slug}`}>
                      <Plus className="mr-2 h-4 w-4" /> Postavi oglas
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <Link key={listing.id} href={`/listings/${listing.id}`}>
                    <Card className="hover:shadow-xl transition-all bg-white group">
                      <div className="aspect-video bg-gray-100 overflow-hidden rounded-t-xl">
                        {listing.media?.[0] ? (
                          <img
                            src={listing.media[0].url}
                            alt={listing.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-14 w-14 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <CardHeader className="p-4 pb-1">
                        <CardTitle className="text-base line-clamp-1 group-hover:text-balkly-blue">
                          {listing.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 flex items-center justify-between">
                        {listing.price ? (
                          <PriceDisplay
                            amount={listing.price}
                            currency={listing.currency || "EUR"}
                            className="text-xl font-bold text-balkly-blue"
                          />
                        ) : (
                          <span className="text-xl font-bold text-balkly-blue">Kontakt</span>
                        )}
                        {listing.city && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <MapPin className="h-3 w-3" />
                            {listing.city}
                          </span>
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
