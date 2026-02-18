"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldAlert, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { toast } from "@/lib/toast";

export default function PublicRedeemPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const [voucher, setVoucher] = useState<any>(null);
  const [staffVoucher, setStaffVoucher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isStaff, setIsStaff] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemResult, setRedeemResult] = useState<any>(null);
  const [redeemForm, setRedeemForm] = useState({ amount: "", benefit_applied: "", notes: "" });

  useEffect(() => {
    checkAndLoad();
  }, [code]);

  const checkAndLoad = async () => {
    try {
      const token = localStorage.getItem("auth_token");

      const publicRes = await fetch(`/api/v1/vouchers/${code}`);
      if (publicRes.ok) {
        const data = await publicRes.json();
        setVoucher(data.voucher);
      }

      if (token) {
        try {
          const staffRes = await fetch(`/api/v1/staff/vouchers/${code}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (staffRes.ok) {
            const data = await staffRes.json();
            setStaffVoucher(data.voucher);
            setIsStaff(true);
          }
        } catch {}
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    const token = localStorage.getItem("auth_token");
    setRedeeming(true);
    try {
      const res = await fetch(`/api/v1/staff/vouchers/${code}/redeem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: redeemForm.amount ? parseFloat(redeemForm.amount) : null,
          benefit_applied: redeemForm.benefit_applied || null,
          notes: redeemForm.notes || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setRedeemResult(data);
        toast.success("Voucher redeemed!");
      } else {
        toast.error(data.message || "Failed to redeem");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!voucher) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-8 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Voucher Not Found</h2>
            <p className="text-muted-foreground">This voucher code is invalid.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (redeemResult) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-green-500">
          <CardContent className="py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Redeemed!</h2>
            <p className="text-muted-foreground mb-4">Voucher {code} confirmed.</p>
            <div className="bg-muted rounded-lg p-4 text-sm text-left space-y-2 mb-6">
              <div className="flex justify-between"><span>Receipt:</span><span className="font-mono">{redeemResult.redemption_id}</span></div>
              <div className="flex justify-between"><span>Commission:</span><span className="font-semibold text-green-600">€{Number(redeemResult.commission || 0).toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Time:</span><span>{new Date(redeemResult.timestamp).toLocaleString()}</span></div>
            </div>
            <Button onClick={() => router.push("/partner/scan")} className="w-full">
              Scan Next Voucher
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (voucher.is_redeemed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-8 text-center">
            <CheckCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Already Redeemed</h2>
            <p className="text-muted-foreground">This voucher has already been used.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (voucher.is_expired || voucher.status === "expired") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-8 text-center">
            <Clock className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Voucher Expired</h2>
            <p className="text-muted-foreground">This voucher has expired and can no longer be used.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Staff view - can redeem
  if (isStaff && staffVoucher && staffVoucher.status === "issued") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-6">
            <h2 className="text-xl font-bold mb-4 text-center">Redeem Voucher</h2>

            <div className="bg-muted rounded-lg p-4 mb-4 space-y-2 text-sm">
              <div className="flex justify-between"><span>Code:</span><span className="font-mono font-bold">{staffVoucher.code}</span></div>
              <div className="flex justify-between"><span>Offer:</span><span>{staffVoucher.offer?.title || "-"}</span></div>
              <div className="flex justify-between"><span>Guest:</span><span>{staffVoucher.user?.name || "-"}</span></div>
              <div className="flex justify-between"><span>Expires:</span><span>{new Date(staffVoucher.expires_at).toLocaleString()}</span></div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Bill Amount (EUR)</label>
                <input type="number" step="0.01" min="0" value={redeemForm.amount}
                  onChange={(e) => setRedeemForm({ ...redeemForm, amount: e.target.value })}
                  placeholder="45.00"
                  className="w-full px-4 py-2 border rounded-lg bg-background" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Benefit Applied</label>
                <input type="text" value={redeemForm.benefit_applied}
                  onChange={(e) => setRedeemForm({ ...redeemForm, benefit_applied: e.target.value })}
                  placeholder="e.g. 10% off"
                  className="w-full px-4 py-2 border rounded-lg bg-background" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea value={redeemForm.notes}
                  onChange={(e) => setRedeemForm({ ...redeemForm, notes: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg bg-background h-16" />
              </div>
              <Button onClick={handleRedeem} disabled={redeeming} className="w-full" size="lg">
                {redeeming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                CONFIRM REDEMPTION
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Guest view - cannot redeem
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="py-8 text-center">
          <ShieldAlert className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Staff Confirmation Required</h2>
          <p className="text-muted-foreground mb-4">
            This voucher must be confirmed by restaurant staff. Please show this QR code to staff at <strong>{voucher.partner_name}</strong>.
          </p>
          <div className="bg-muted rounded-lg p-4 text-sm space-y-2 mb-4">
            <div className="flex justify-between"><span>Code:</span><span className="font-mono font-bold">{voucher.code}</span></div>
            <div className="flex justify-between"><span>Offer:</span><span>{voucher.offer_title || "-"}</span></div>
            <div className="flex justify-between"><span>Expires:</span><span>{new Date(voucher.expires_at).toLocaleString()}</span></div>
          </div>
          <p className="text-xs text-muted-foreground">
            Only authorized staff can confirm this voucher.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
