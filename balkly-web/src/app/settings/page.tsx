"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Bell, Shield, CreditCard } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    country: "AE",
    bio: "",
    notifications_email: true,
    notifications_push: false,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Fetch fresh user data from API
      const response = await fetch("/api/v1/auth/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const userData = data.user;
        setUser(userData);
        
        // Populate form with all data including profile
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.profile?.phone || "",
          city: userData.profile?.city || "",
          country: userData.profile?.country || "AE",
          bio: userData.profile?.bio || "",
          notifications_email: true,
          notifications_push: false,
        });
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
      // Fallback to localStorage
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsed = JSON.parse(userData);
        setUser(parsed);
        setFormData({
          ...formData,
          name: parsed.name || "",
          email: parsed.email || "",
        });
      }
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/v1/profile/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone: formData.phone,
          city: formData.city,
          country: formData.country,
          bio: formData.bio,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update local storage with full user object
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        
        alert("Settings saved successfully!");
        
        // Reload data to confirm it saved
        await loadUserData();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to save settings. Please try again.");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please check your connection and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <Link href="/dashboard">
            <Button variant="secondary" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-lg opacity-90">Manage your account preferences</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+971 XX XXX XXXX"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Dubai"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-2 border rounded-lg h-24"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about your listings and messages
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.notifications_email}
                  onChange={(e) =>
                    setFormData({ ...formData, notifications_email: e.target.checked })
                  }
                  className="h-5 w-5"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Get real-time alerts in your browser
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.notifications_push}
                  onChange={(e) =>
                    setFormData({ ...formData, notifications_push: e.target.checked })
                  }
                  className="h-5 w-5"
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>Manage your password and security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline"
                onClick={() => router.push("/settings/security")}
              >
                Change Password
              </Button>
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Two-Factor Authentication
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push("/settings/security")}
                >
                  {user?.twofa_secret ? "Manage 2FA" : "Enable 2FA"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Methods
              </CardTitle>
              <CardDescription>Manage your saved payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                No payment methods saved yet
              </p>
              <Button 
                variant="outline"
                onClick={() => alert("Payment methods will be managed through Stripe during checkout. This feature is for viewing saved cards.")}
              >
                Add Payment Method
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Payment methods are securely saved during checkout
              </p>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex gap-4">
            <Button onClick={handleSave} className="flex-1">
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Cancel
            </Button>
          </div>

          {/* Danger Zone */}
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => {
                    const confirm = window.confirm(
                      "⚠️ WARNING: This will permanently delete your account and all data.\n\n" +
                      "This includes:\n" +
                      "• All your listings\n" +
                      "• Messages and chats\n" +
                      "• Orders and history\n" +
                      "• Profile information\n\n" +
                      "This action CANNOT be undone!\n\n" +
                      "Are you absolutely sure?"
                    );
                    
                    if (confirm) {
                      const doubleConfirm = window.confirm(
                        "FINAL CONFIRMATION\n\n" +
                        "Type your email in the next prompt to confirm deletion."
                      );
                      
                      if (doubleConfirm) {
                        const email = prompt("Enter your email address to confirm:");
                        if (email === user?.email) {
                          // TODO: Call API to delete account
                          alert("Account deletion requested. This feature will be implemented with admin approval.");
                        } else {
                          alert("Email does not match. Account deletion cancelled.");
                        }
                      }
                    }
                  }}
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

