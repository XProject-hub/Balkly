"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Settings as SettingsIcon } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-mist-50">
      <div className="text-white py-8" style={{background: 'linear-gradient(135deg, #0F172A 0%, #111827 100%)'}}>
        <div className="container mx-auto px-4">
          <Link href="/admin">
            <Button variant="secondary" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Admin Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Platform Settings</h1>
          <p className="text-lg opacity-90">Configure pricing, categories, and features</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-white mb-6">
          <CardHeader>
            <CardTitle className="text-gray-900">General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Site Name</label>
              <input type="text" defaultValue="Balkly" className="w-full px-4 py-2 border rounded-lg" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Default Currency</label>
              <select className="w-full px-4 py-2 border rounded-lg">
                <option value="EUR">EUR (€)</option>
                <option value="AED">AED (د.إ)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Default Language</label>
              <select className="w-full px-4 py-2 border rounded-lg">
                <option value="en">English</option>
                <option value="sr">Serbian</option>
                <option value="hr">Croatian</option>
                <option value="bs">Bosnian</option>
                <option value="ar">Arabic</option>
              </select>
            </div>

            <Button className="bg-gradient-to-r from-balkly-blue to-iris-purple text-white">
              Save Settings
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900">Note</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Pricing and category management is currently done via database seeders.
              A visual pricing manager will be added in a future update.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              To change prices now, edit: <code>balkly-api/database/seeders/PlanSeeder.php</code>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

