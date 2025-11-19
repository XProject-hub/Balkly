"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Key, Smartphone, Copy, CheckCircle } from "lucide-react";
import QRCode from "qrcode";

export default function SecuritySettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setTwoFAEnabled(!!parsed.twofa_secret);
    }
  }, []);

  const handleEnable2FA = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/auth/2fa/enable", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      const data = await response.json();
      setSecret(data.secret);
      
      // Generate QR code image from URL
      const qrCodeDataUrl = await QRCode.toDataURL(data.qr_code_url, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCode(qrCodeDataUrl);
      setShowQR(true);
    } catch (error) {
      console.error("Failed to enable 2FA:", error);
      alert("Failed to enable 2FA. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      alert("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/v1/auth/2fa/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          secret,
          code: verificationCode,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTwoFAEnabled(true);
        setShowQR(false);
        
        // Update user in localStorage
        const updatedUser = { ...user, twofa_secret: secret };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        // Get recovery codes
        getRecoveryCodes();
        
        alert("2FA enabled successfully!");
      } else {
        alert("Invalid verification code. Please try again.");
      }
    } catch (error) {
      console.error("Failed to confirm 2FA:", error);
      alert("Failed to confirm 2FA. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    const code = prompt("Enter your 2FA code to disable:");
    if (!code) return;

    setLoading(true);
    try {
      const response = await fetch("/api/v1/auth/2fa/disable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        setTwoFAEnabled(false);
        const updatedUser = { ...user, twofa_secret: null };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        alert("2FA disabled successfully");
      } else {
        alert("Invalid code. Please try again.");
      }
    } catch (error) {
      console.error("Failed to disable 2FA:", error);
      alert("Failed to disable 2FA. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRecoveryCodes = async () => {
    try {
      const response = await fetch("/api/v1/auth/2fa/recovery-codes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      const data = await response.json();
      setRecoveryCodes(data.codes || []);
    } catch (error) {
      console.error("Failed to get recovery codes:", error);
    }
  };

  const copyRecoveryCodes = () => {
    navigator.clipboard.writeText(recoveryCodes.join("\n"));
    alert("Recovery codes copied to clipboard!");
  };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert("New passwords do not match!");
      return;
    }

    if (passwordData.new_password.length < 8) {
      alert("Password must be at least 8 characters!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/v1/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password,
        }),
      });

      if (response.ok) {
        setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
        alert("Password updated successfully!");
      } else {
        const error = await response.json();
        alert(error.message || "Failed to update password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <Link href="/settings">
            <Button variant="secondary" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Settings
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Security Settings</h1>
          <p className="text-lg opacity-90">Manage your account security</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-6">
          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="mr-2 h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>Update your password regularly for security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <Button onClick={handleChangePassword} disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Smartphone className="mr-2 h-5 w-5" />
                Two-Factor Authentication (2FA)
              </CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!twoFAEnabled ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    Two-factor authentication adds an additional layer of security by requiring
                    a code from your phone in addition to your password.
                  </p>
                  <Button onClick={handleEnable2FA} disabled={loading}>
                    {loading ? "Setting up..." : "Enable 2FA"}
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Two-factor authentication is enabled
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={getRecoveryCodes}>
                      View Recovery Codes
                    </Button>
                    <Button variant="destructive" onClick={handleDisable2FA}>
                      Disable 2FA
                    </Button>
                  </div>
                </>
              )}

              {/* 2FA Setup Modal */}
              {showQR && (
                <div className="border rounded-lg p-6 space-y-4">
                  <h3 className="font-bold text-lg">Setup Two-Factor Authentication</h3>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                    </p>
                    {qrCode && (
                      <img
                        src={qrCode}
                        alt="2FA QR Code"
                        className="mx-auto border rounded-lg p-4 bg-white"
                      />
                    )}
                    <p className="text-xs text-muted-foreground mt-4">
                      Or enter this code manually: <code className="bg-muted px-2 py-1 rounded">{secret}</code>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Enter 6-digit code from your app
                    </label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="000000"
                      className="w-full px-4 py-2 border rounded-lg text-center text-2xl tracking-widest"
                      maxLength={6}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleConfirm2FA}
                      disabled={loading || verificationCode.length !== 6}
                      className="flex-1"
                    >
                      {loading ? "Verifying..." : "Verify & Enable"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowQR(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Recovery Codes */}
              {recoveryCodes.length > 0 && (
                <div className="border rounded-lg p-6 space-y-4 bg-yellow-50 dark:bg-yellow-950">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">Recovery Codes</h3>
                    <Button size="sm" variant="outline" onClick={copyRecoveryCodes}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy All
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Save these codes securely. Each can be used once if you lose access to your authenticator.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {recoveryCodes.map((code, index) => (
                      <code key={index} className="bg-background px-3 py-2 rounded border font-mono text-sm">
                        {code}
                      </code>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Active Sessions
              </CardTitle>
              <CardDescription>Manage your active login sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Current Session</p>
                    <p className="text-sm text-muted-foreground">Windows • Chrome</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    Active
                  </span>
                </div>
              </div>
              <Button variant="destructive" size="sm" className="mt-4">
                Logout All Other Sessions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

