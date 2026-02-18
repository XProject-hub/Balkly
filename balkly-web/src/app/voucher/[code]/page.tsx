"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Ticket, Clock, CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";
import QRCode from "qrcode";

export default function VoucherPage() {
  const params = useParams();
  const code = params.code as string;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [voucher, setVoucher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    loadVoucher();
  }, [code]);

  useEffect(() => {
    if (!voucher?.expires_at) return;
    const interval = setInterval(() => {
      const diff = new Date(voucher.expires_at).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [voucher]);

  useEffect(() => {
    if (voucher && canvasRef.current) {
      const url = `${window.location.origin}/v/${voucher.code}`;
      QRCode.toCanvas(canvasRef.current, url, {
        width: 250,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      });
    }
  }, [voucher]);

  const loadVoucher = async () => {
    try {
      const res = await fetch(`/api/v1/vouchers/${code}`);
      if (res.ok) {
        const data = await res.json();
        setVoucher(data.voucher);
      }
    } catch {} finally {
      setLoading(false);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Voucher Not Found</h2>
          <p className="text-muted-foreground mb-4">This voucher code does not exist.</p>
          <Link href="/"><Button>Back to Home</Button></Link>
        </div>
      </div>
    );
  }

  const isActive = voucher.status === "issued" && !voucher.is_expired;
  const isRedeemed = voucher.is_redeemed;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="py-8 text-center">
          <Link href="/" className="inline-block mb-6">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Balkly
            </Button>
          </Link>

          {/* Partner info */}
          <div className="mb-4">
            {voucher.partner_logo ? (
              <img src={voucher.partner_logo} alt="" className="w-16 h-16 rounded-lg mx-auto mb-2 object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-primary/10 mx-auto mb-2 flex items-center justify-center text-primary font-bold text-2xl">
                {voucher.partner_name?.[0]}
              </div>
            )}
            <h2 className="text-xl font-bold">{voucher.partner_name}</h2>
          </div>

          {/* Offer */}
          {voucher.offer_title && (
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg p-4 mb-6">
              <p className="font-bold text-lg">{voucher.offer_title}</p>
              {voucher.offer_description && (
                <p className="text-white/80 text-sm mt-1">{voucher.offer_description}</p>
              )}
            </div>
          )}

          {/* QR Code */}
          {isActive && (
            <div className="mb-6">
              <canvas ref={canvasRef} className="mx-auto rounded-lg" />
              <p className="text-sm text-muted-foreground mt-2">Show this QR code to staff</p>
            </div>
          )}

          {/* Status */}
          <div className="mb-4">
            <p className="font-mono text-lg font-bold tracking-wider mb-2">{voucher.code}</p>
            {isActive && (
              <div className="flex items-center justify-center gap-2 text-amber-600">
                <Clock className="h-4 w-4" />
                <span className="font-semibold">Expires in: {timeLeft}</span>
              </div>
            )}
            {isRedeemed && (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Redeemed</span>
              </div>
            )}
            {voucher.is_expired && !isRedeemed && (
              <div className="flex items-center justify-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <span className="font-semibold">Expired</span>
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Present this voucher to staff at {voucher.partner_name} to redeem your offer.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
