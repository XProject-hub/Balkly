"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Globe, Monitor, Smartphone } from "lucide-react";

export default function VisitorsPage() {
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVisits();
  }, []);

  const loadVisits = async () => {
    setLoading(true);
    try {
      // Fetch recent page visits with IP addresses
      const response = await fetch("/api/v1/admin/visits?limit=100", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      const data = await response.json();
      setVisits(data.visits || []);
    } catch (error) {
      console.error("Failed to load visits:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-white py-8" style={{background: 'linear-gradient(135deg, #0F172A 0%, #111827 100%)'}}>
        <div className="container mx-auto px-4">
          <Link href="/admin">
            <Button variant="secondary" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Admin Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Visitor Details</h1>
          <p className="text-lg opacity-90">View all site visitors with IP addresses</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900">Recent Visitors ({visits.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : visits.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No visitors yet</p>
            ) : (
              <div className="space-y-2">
                {visits.map((visit, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      {visit.device_type === 'desktop' && <Monitor className="h-5 w-5 text-balkly-blue" />}
                      {visit.device_type === 'mobile' && <Smartphone className="h-5 w-5 text-teal-glow" />}
                      {!visit.device_type && <Globe className="h-5 w-5 text-gray-400" />}
                      
                      <div>
                        <p className="font-medium text-gray-900">
                          {visit.page_title || visit.page_url}
                        </p>
                        <p className="text-sm text-gray-500">
                          {visit.user?.name || 'Guest'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-mono text-sm font-medium text-gray-900">{visit.ip_address}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(visit.visited_at).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {visit.browser} • {visit.device_type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

