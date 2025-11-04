"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load all orders (admin can see everything)
    setLoading(true);
    // TODO: Create admin endpoint for all orders
    setOrders([]);
    setLoading(false);
  }, []);

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
          <h1 className="text-4xl font-bold mb-2">Orders & Payments</h1>
          <p className="text-lg opacity-90">Review transactions and process refunds</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card className="bg-white">
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">No orders yet</p>
            <p className="text-sm text-gray-500 mt-2">Orders will appear here when users make purchases</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

