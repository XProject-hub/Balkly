"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScanLine, Keyboard, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { toast } from "@/lib/toast";

export default function PartnerScanPage() {
  const [mode, setMode] = useState<"choose" | "camera" | "manual">("choose");
  const [code, setCode] = useState("");
  const [voucher, setVoucher] = useState<any>(null);
  const [loadingVoucher, setLoadingVoucher] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemResult, setRedeemResult] = useState<any>(null);
  const [redeemForm, setRedeemForm] = useState({ amount: "", benefit_applied: "", notes: "" });
  const scannerRef = useRef<any>(null);
  const scannerContainerId = "qr-reader";

  const getToken = () => localStorage.getItem("auth_token");

  const lookupVoucher = useCallback(async (voucherCode: string) => {
    const cleanCode = voucherCode.trim().toUpperCase();
    if (!cleanCode) return;
    setLoadingVoucher(true);
    setVoucher(null);
    setRedeemResult(null);
    try {
      const res = await fetch(`/api/v1/staff/vouchers/${cleanCode}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        setVoucher(data.voucher);
      } else {
        const data = await res.json();
        toast.error(data.message || "Voucher not found");
      }
    } catch {
      toast.error("Failed to lookup voucher");
    } finally {
      setLoadingVoucher(false);
    }
  }, []);

  const handleRedeem = async () => {
    if (!voucher) return;
    setRedeeming(true);
    try {
      const res = await fetch(`/api/v1/staff/vouchers/${voucher.code}/redeem`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
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

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
    }
  }, []);

  const extractCodeFromUrl = (text: string): string => {
    const match = text.match(/\/v\/([A-Za-z0-9_-]+)/);
    if (match) return match[1].toUpperCase();
    return text.trim().toUpperCase();
  };

  const startCamera = async () => {
    setMode("camera");
    setTimeout(async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        const scanner = new Html5Qrcode(scannerContainerId);
        scannerRef.current = scanner;
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            const voucherCode = extractCodeFromUrl(decodedText);
            if (voucherCode) {
              stopScanner();
              setCode(voucherCode);
              lookupVoucher(voucherCode);
            }
          },
          () => {}
        );
      } catch {
        toast.error("Camera access denied or not available");
        setMode("manual");
      }
    }, 100);
  };

  useEffect(() => {
    return () => { stopScanner(); };
  }, [stopScanner]);

  const reset = () => {
    setVoucher(null);
    setRedeemResult(null);
    setCode("");
    setRedeemForm({ amount: "", benefit_applied: "", notes: "" });
    stopScanner();
    setMode("choose");
  };

  if (redeemResult) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <Card className="border-green-500">
          <CardContent className="py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Redeemed!</h2>
            <p className="text-muted-foreground mb-4">Voucher confirmed successfully.</p>
            <div className="bg-muted rounded-lg p-4 mb-6 text-sm text-left space-y-2">
              <div className="flex justify-between"><span>Receipt ID:</span><span className="font-mono">{redeemResult.redemption_id}</span></div>
              <div className="flex justify-between"><span>Commission:</span><span className="font-semibold text-green-600">€{Number(redeemResult.commission || 0).toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Time:</span><span>{new Date(redeemResult.timestamp).toLocaleString()}</span></div>
            </div>
            <Button onClick={reset} className="w-full">Scan Next Voucher</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (voucher) {
    const isRedeemable = voucher.status === "issued" && !voucher.is_expired && new Date(voucher.expires_at) > new Date();
    return (
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isRedeemable ? <Clock className="h-5 w-5 text-amber-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
              Voucher: {voucher.code}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span>Status:</span>
                <span className={`font-semibold ${voucher.status === "issued" ? "text-green-600" : "text-red-600"}`}>
                  {voucher.status.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between"><span>Offer:</span><span>{voucher.offer?.title || "-"}</span></div>
              <div className="flex justify-between"><span>Guest:</span><span>{voucher.user?.name || "-"}</span></div>
              <div className="flex justify-between"><span>Expires:</span>
                <span>{new Date(voucher.expires_at).toLocaleString()}</span>
              </div>
            </div>

            {isRedeemable ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Bill Amount (EUR)</label>
                  <input type="number" step="0.01" min="0" value={redeemForm.amount}
                    onChange={(e) => setRedeemForm({ ...redeemForm, amount: e.target.value })}
                    placeholder="e.g. 45.00"
                    className="w-full px-4 py-2 border rounded-lg bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Benefit Applied</label>
                  <input type="text" value={redeemForm.benefit_applied}
                    onChange={(e) => setRedeemForm({ ...redeemForm, benefit_applied: e.target.value })}
                    placeholder="e.g. Free drink, 10% off"
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
              </>
            ) : (
              <div className="text-center py-4">
                <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="font-semibold text-red-600">
                  {voucher.status === "redeemed" ? "Already redeemed" :
                   voucher.status === "expired" ? "Expired" : `Status: ${voucher.status}`}
                </p>
              </div>
            )}

            <Button variant="outline" onClick={reset} className="w-full">Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-3xl font-bold mb-2">Scan Voucher</h1>
      <p className="text-muted-foreground mb-6">Scan a QR code or enter the voucher code manually.</p>

      {mode === "choose" && (
        <div className="grid grid-cols-1 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition" onClick={startCamera}>
            <CardContent className="py-8 text-center">
              <ScanLine className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold text-lg">Scan QR Code</h3>
              <p className="text-sm text-muted-foreground">Use camera to scan</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-lg transition" onClick={() => setMode("manual")}>
            <CardContent className="py-8 text-center">
              <Keyboard className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold text-lg">Enter Code</h3>
              <p className="text-sm text-muted-foreground">Type the voucher code</p>
            </CardContent>
          </Card>
        </div>
      )}

      {mode === "camera" && (
        <Card>
          <CardContent className="py-4">
            <div id={scannerContainerId} className="w-full rounded-lg overflow-hidden mb-4" />
            <p className="text-sm text-muted-foreground text-center mb-4">
              Point camera at the QR code. Or enter code manually:
            </p>
            <div className="flex gap-2">
              <input type="text" value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="BLK-XXXXXX"
                className="flex-1 px-4 py-2 border rounded-lg bg-background font-mono uppercase"
                onKeyDown={(e) => e.key === "Enter" && lookupVoucher(code)}
              />
              <Button onClick={() => lookupVoucher(code)} disabled={loadingVoucher}>
                {loadingVoucher ? <Loader2 className="h-4 w-4 animate-spin" /> : "Look Up"}
              </Button>
            </div>
            <Button variant="outline" onClick={reset} className="w-full mt-3">Cancel</Button>
          </CardContent>
        </Card>
      )}

      {mode === "manual" && (
        <Card>
          <CardContent className="py-6">
            <label className="block text-sm font-medium mb-2">Voucher Code</label>
            <div className="flex gap-2">
              <input type="text" value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="BLK-XXXXXX"
                className="flex-1 px-4 py-3 border rounded-lg bg-background font-mono uppercase text-lg"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && lookupVoucher(code)}
              />
              <Button onClick={() => lookupVoucher(code)} disabled={loadingVoucher} size="lg">
                {loadingVoucher ? <Loader2 className="h-4 w-4 animate-spin" /> : "Look Up"}
              </Button>
            </div>
            <Button variant="outline" onClick={reset} className="w-full mt-4">Back</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
