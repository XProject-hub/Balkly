"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, MapPin, Briefcase } from "lucide-react";
import { listingsAPI } from "@/lib/api";

export default function JobsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    job_type: "",
    category: "",
    experience: "",
    salary_min: "",
    salary_max: "",
    city: "",
  });

  useEffect(() => { loadListings(); }, [filters]);

  const loadListings = async () => {
    setLoading(true);
    try {
      const response = await listingsAPI.getAll({ category_id: 8, ...filters });
      setListings(response.data.data || []);
    } catch (error) {}
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-mist-50">
      <div className="text-white py-12" style={{background: 'linear-gradient(135deg, #0F172A 0%, #111827 100%)'}}>
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Jobs & Careers</h1>
          <p className="text-xl opacity-90">Find your next opportunity</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="bg-white lg:col-span-1 h-fit sticky top-20">
            <CardHeader><CardTitle className="text-gray-900">Filters</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Job Type</label>
                <select value={filters.job_type} onChange={(e) => setFilters({ ...filters, job_type: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Category</label>
                <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">All Categories</option>
                  <option value="it">IT & Software</option>
                  <option value="sales">Sales & Marketing</option>
                  <option value="finance">Finance & Accounting</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="hospitality">Hospitality</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Experience</label>
                <select value={filters.experience} onChange={(e) => setFilters({ ...filters, experience: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Any</option>
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (3-5 years)</option>
                  <option value="senior">Senior (5+ years)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Salary Range (Monthly)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" value={filters.salary_min} onChange={(e) => setFilters({ ...filters, salary_min: e.target.value })} placeholder="Min" className="px-3 py-2 border rounded-lg" />
                  <input type="number" value={filters.salary_max} onChange={(e) => setFilters({ ...filters, salary_max: e.target.value })} placeholder="Max" className="px-3 py-2 border rounded-lg" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">City</label>
                <input type="text" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} placeholder="e.g., Dubai" className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <Button className="w-full bg-gradient-to-r from-balkly-blue to-iris-purple text-white" asChild>
                <Link href="/listings/create?category=jobs"><Plus className="mr-2 h-4 w-4" />Post Job</Link>
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-3">
            <p className="text-gray-600 mb-6">Showing {listings.length} jobs</p>
            {loading ? <p>Loading...</p> : listings.length === 0 ? (
              <Card className="bg-white"><CardContent className="py-16 text-center"><Button className="bg-gradient-to-r from-balkly-blue to-iris-purple text-white" asChild><Link href="/listings/create?category=jobs">Post First Job</Link></Button></CardContent></Card>
            ) : (
              <div className="space-y-4">
                {listings.map((listing) => (
                  <Link key={listing.id} href={`/listings/${listing.id}`}><Card className="hover:shadow-lg bg-white"><CardContent className="p-6"><h3 className="font-bold text-xl text-gray-900 hover:text-balkly-blue">{listing.title}</h3><p className="text-sm text-gray-600 mt-2">{listing.description}</p><div className="flex gap-4 mt-4 text-sm"><span className="font-bold text-balkly-blue text-lg">€{listing.price}/month</span><span className="text-gray-500">{listing.city}</span></div></CardContent></Card></Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

