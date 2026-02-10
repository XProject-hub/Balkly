"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, MapPin, Building2, DollarSign, Search, Filter, ExternalLink, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { jobsAPI } from "@/lib/api";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    city: "",
    category: "",
  });

  useEffect(() => {
    loadJobs();
  }, [filters, currentPage]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page: currentPage,
        per_page: 20,
      };
      const response = await jobsAPI.getAll(params);
      setJobs(response.data.data || []);
      setTotalJobs(response.data.total || 0);
    } catch (error) {
      console.error("Failed to load jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await jobsAPI.getCategories();
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const formatSalary = (job: any) => {
    if (!job.salary_min && !job.salary_max) return null;
    const currency = job.salary_currency || 'AED';
    if (job.salary_min && job.salary_max) {
      return `${currency} ${Math.round(job.salary_min).toLocaleString()} - ${Math.round(job.salary_max).toLocaleString()}`;
    }
    if (job.salary_min) {
      return `From ${currency} ${Math.round(job.salary_min).toLocaleString()}`;
    }
    return `Up to ${currency} ${Math.round(job.salary_max).toLocaleString()}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-balkly-blue to-purple-600 text-white py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-4">
              Jobs in Dubai & UAE
            </h1>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl opacity-90 mb-6">
              Find your next career opportunity from thousands of job listings
            </p>
            
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs by title, company..."
                  value={filters.search}
                  onChange={(e) => {
                    setFilters({ ...filters, search: e.target.value });
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder:text-gray-500"
                />
              </div>
              <select
                value={filters.city}
                onChange={(e) => {
                  setFilters({ ...filters, city: e.target.value });
                  setCurrentPage(1);
                }}
                className="px-4 py-3 rounded-lg text-gray-900 bg-white"
              >
                <option value="">All Cities</option>
                <option value="Dubai">Dubai</option>
                <option value="Abu Dhabi">Abu Dhabi</option>
                <option value="Sharjah">Sharjah</option>
                <option value="Ajman">Ajman</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Stats & Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Showing {jobs.length} of {totalJobs} jobs
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={filters.category}
              onChange={(e) => {
                setFilters({ ...filters, category: e.target.value });
                setCurrentPage(1);
              }}
              className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.category} value={cat.category}>
                  {cat.category} ({cat.count})
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilters({ search: "", city: "", category: "" });
                setCurrentPage(1);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-5 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
              <p className="text-lg font-semibold mb-2">No jobs found</p>
              <p className="text-muted-foreground mb-4">Try adjusting your search filters</p>
              <Button onClick={() => setFilters({ search: "", city: "", category: "" })}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <a
                key={job.id}
                href={job.redirect_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="hover:shadow-lg hover:border-primary/50 transition-all">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Company Logo or Icon */}
                      <div className="hidden sm:flex w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-lg items-center justify-center flex-shrink-0 overflow-hidden">
                        {job.employer_logo ? (
                          <img 
                            src={job.employer_logo} 
                            alt={job.company}
                            className="w-full h-full object-contain p-1"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement?.querySelector('svg')?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <Building2 className={`h-6 w-6 text-primary ${job.employer_logo ? 'hidden' : ''}`} />
                      </div>
                      
                      {/* Job Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-bold text-foreground group-hover:text-primary line-clamp-1">
                              {job.title}
                            </h3>
                            <p className="text-primary font-medium">{job.company}</p>
                          </div>
                          {formatSalary(job) && (
                            <div className="flex items-center text-sm font-bold text-green-600 dark:text-green-400 whitespace-nowrap">
                              <DollarSign className="h-4 w-4 mr-1" />
                              {formatSalary(job)}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.city || job.location}
                          </span>
                          {job.category && (
                            <span className="bg-muted px-2 py-0.5 rounded text-xs">
                              {job.category}
                            </span>
                          )}
                          {job.contract_type && (
                            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded text-xs">
                              {job.contract_type}
                            </span>
                          )}
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatDate(job.created_date)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                          {job.description}
                        </p>
                      </div>
                      
                      {/* Apply Button */}
                      <div className="flex sm:flex-col items-center gap-2 sm:ml-4">
                        <Button size="sm" className="gap-1">
                          Apply
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalJobs > 20 && (
          <div className="mt-8 flex flex-wrap justify-center items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <ChevronLeft className="h-4 w-4 -ml-2" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <span className="px-4 py-2 text-sm">
              Page {currentPage} of {Math.ceil(totalJobs / 20)}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage >= Math.ceil(totalJobs / 20)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.ceil(totalJobs / 20))}
              disabled={currentPage >= Math.ceil(totalJobs / 20)}
            >
              <ChevronRight className="h-4 w-4" />
              <ChevronRight className="h-4 w-4 -ml-2" />
            </Button>
          </div>
        )}

        {/* Powered by Adzuna */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Job listings aggregated from top UAE job boards</p>
        </div>
      </div>
    </div>
  );
}
