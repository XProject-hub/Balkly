"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Settings as SettingsIcon, Save, Loader2 } from "lucide-react";
import { toast } from "@/lib/toast";

interface PlatformSettings {
  site_name: string;
  default_currency: string;
  default_language: string;
  maintenance_mode: boolean;
  allow_registration: boolean;
  require_email_verification: boolean;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>({
    site_name: "Balkly",
    default_currency: "EUR",
    default_language: "en",
    maintenance_mode: false,
    allow_registration: true,
    require_email_verification: true,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("auth_token");
        const response = await fetch("/api/v1/admin/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setSettings(data.settings);
        }
      } catch {
        const saved = localStorage.getItem("platform_settings");
        if (saved) {
          try { setSettings(JSON.parse(saved)); } catch {}
        }
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/v1/admin/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
        localStorage.setItem("platform_settings", JSON.stringify(data.settings));
        toast.success("Settings saved successfully");
      } else {
        toast.error("Failed to save settings");
      }
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof PlatformSettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <Link href="/admin">
            <Button variant="secondary" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Admin Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Platform Settings</h1>
          <p className="text-lg opacity-90">Configure platform preferences</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Site Name</label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) => handleChange("site_name", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Default Currency</label>
              <select
                value={settings.default_currency}
                onChange={(e) => handleChange("default_currency", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-background"
              >
                <option value="EUR">EUR (€)</option>
                <option value="AED">AED (د.إ)</option>
                <option value="GBP">GBP (£)</option>
                <option value="BAM">BAM (KM)</option>
                <option value="RSD">RSD (din)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Default Language</label>
              <select
                value={settings.default_language}
                onChange={(e) => handleChange("default_language", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-background"
              >
                <option value="en">English</option>
                <option value="sr">Serbian</option>
                <option value="hr">Croatian</option>
                <option value="bs">Bosnian</option>
                <option value="ar">Arabic</option>
              </select>
            </div>

            <div className="border-t pt-6 mt-6">
              <h3 className="font-medium mb-4">Feature Toggles</h3>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allow_registration}
                    onChange={(e) => handleChange("allow_registration", e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                  <div>
                    <p className="font-medium">Allow New Registrations</p>
                    <p className="text-sm text-muted-foreground">New users can create accounts</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.require_email_verification}
                    onChange={(e) => handleChange("require_email_verification", e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                  <div>
                    <p className="font-medium">Require Email Verification</p>
                    <p className="text-sm text-muted-foreground">Users must verify email before logging in</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenance_mode}
                    onChange={(e) => handleChange("maintenance_mode", e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                  <div>
                    <p className="font-medium">Maintenance Mode</p>
                    <p className="text-sm text-muted-foreground">Only admins can access the site</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Developer Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Pricing and category management is currently done via database seeders.
              A visual pricing manager will be added in a future update.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              To change prices now, edit: <code className="bg-muted px-1 rounded">balkly-api/database/seeders/PlanSeeder.php</code>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
