"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Copy, CheckCheck, MapPin, Moon, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface RamadanData {
  code: string;
  valid_until: string;
  restaurant: string;
  location: string;
  maps_url: string;
  benefit: string;
  already_seen: boolean;
}

export default function RamadanConfirmPage() {
  const router = useRouter();
  const [data, setData] = useState<RamadanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.replace("/auth/login?redirect=/ramadan/confirm");
      return;
    }

    const fetchCode = async () => {
      try {
        const res = await fetch("/api/v1/ramadan/confirm", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
          router.replace("/auth/login?redirect=/ramadan/confirm");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to load");
        }

        const json = await res.json();
        setData(json);
      } catch {
        setError("Desila se greška. Pokušajte ponovo.");
      } finally {
        setLoading(false);
      }
    };

    fetchCode();
  }, [router]);

  const copyCode = async () => {
    if (!data) return;
    await navigator.clipboard.writeText(data.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Moon className="h-12 w-12 text-[#8b1c2d] mx-auto animate-pulse" />
          <p className="text-slate-400 text-lg">Učitavanje vašeg koda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-lg">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Pokušaj ponovo
          </Button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#0f172a] py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">

        {/* Card */}
        <div className="bg-[#111827] rounded-3xl overflow-hidden shadow-[0_40px_90px_rgba(0,0,0,0.6)] border border-[#1f2937]">

          {/* Top crescent decoration */}
          <div className="relative h-2 bg-gradient-to-r from-[#8b1c2d] via-[#c0392b] to-[#8b1c2d]" />

          {/* Header - Balkly logo + title */}
          <div className="flex flex-col items-center pt-10 pb-6 px-8 gap-4">
            {/* Balkly logo */}
            <div className="relative w-44 h-14">
              <Image
                src="/logo.png"
                alt="Balkly"
                fill
                className="object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>

            <div className="flex items-center gap-3">
              <Moon className="h-8 w-8 text-yellow-400" />
              <h1 className="text-3xl font-bold text-white">Ramazan Mubarek</h1>
              <Moon className="h-8 w-8 text-yellow-400 scale-x-[-1]" />
            </div>

            <div className="flex items-center gap-2 px-4 py-1.5 bg-[#8b1c2d]/20 border border-[#8b1c2d]/40 rounded-full">
              <ShieldCheck className="h-4 w-4 text-[#e05c72]" />
              <span className="text-sm text-[#e05c72] font-medium">Ekskluzivno za registrovane Balkly korisnike</span>
            </div>
          </div>

          {/* Message */}
          <div className="px-10 pb-6 text-center text-[#e5e7eb] text-base leading-relaxed">
            <span className="text-slate-300">Selam,</span>
            <br /><br />
            Hvala vam što ste dio Balkly zajednice.
            <br /><br />
            Kao dio naše <span className="text-white font-semibold">Ramazanske akcije</span>, evo vaš lični kod za{" "}
            <span className="text-white font-bold">besplatnu domaću kafu ili čorbu</span> u{" "}
            <span className="text-[#e05c72] font-semibold">Bosnian Marengo Restaurant</span> tokom iftara u Dubaiu.
          </div>

          {/* Promo Code Box */}
          <div className="px-10 pb-8">
            <div className="relative bg-[#0b1220] rounded-2xl border-2 border-[#8b1c2d] p-6 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-medium">Vaš lični kod</p>
              <div className="flex items-center justify-center gap-4">
                <span className="text-4xl font-extrabold text-white tracking-[0.15em]">
                  {data.code}
                </span>
                <button
                  onClick={copyCode}
                  className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-[#1f2937]"
                  title="Kopiraj kod"
                >
                  {copied
                    ? <CheckCheck className="h-6 w-6 text-green-400" />
                    : <Copy className="h-6 w-6" />
                  }
                </button>
              </div>
              {copied && (
                <p className="text-green-400 text-sm mt-2 animate-fade-in">Kod kopiran!</p>
              )}

              {/* Decorative dots */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#0f172a] border-2 border-[#1f2937]" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#0f172a] border-2 border-[#1f2937]" />
            </div>
          </div>

          {/* After-code text + Marengo logo */}
          <div className="flex flex-col items-center px-10 pb-6 gap-4 text-center">
            <p className="text-[#cbd5e1] text-sm leading-relaxed">
              Prikažite ovaj kod prilikom dolaska na iftar i uživajte u poklonu.
            </p>
            <div className="relative w-36 h-14">
              <Image
                src="/images/marengologo-copy.png"
                alt="Bosnian Marengo Restaurant"
                fill
                className="object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="px-10 pb-8">
            <h3 className="text-white font-semibold text-center mb-4 text-sm uppercase tracking-wider">Kako iskoristiti kod?</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-4 sm:gap-2 text-sm text-slate-400">
              {[
                { num: "1", text: "Dođite na iftar u Bosnian Marengo" },
                { num: "2", text: "Pokažite ovaj kod osoblju" },
                { num: "3", text: "Uživajte u poklonu 🎁" },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#8b1c2d] flex items-center justify-center text-white text-xs font-bold">
                    {step.num}
                  </div>
                  <span>{step.text}</span>
                  {i < 2 && <ArrowRight className="hidden sm:block h-4 w-4 text-[#8b1c2d] flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="px-10 pb-6 text-center">
            <div className="flex items-center justify-center gap-2 text-slate-300 mb-4">
              <MapPin className="h-5 w-5 text-[#8b1c2d]" />
              <span className="font-medium">{data.restaurant}</span>
            </div>
            <p className="text-slate-500 text-sm mb-5">{data.location}</p>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-[#1f2937]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7218.967163914383!2d55.25016062688164!3d25.22063232001067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f430079731b57%3A0x3ce07741c0473fac!2sBosnian%20Marengo%20Restaurant!5e0!3m2!1sen!2sat!4v1771578745836!5m2!1sen!2sat"
                width="100%"
                height="180"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                allowFullScreen
              />
            </div>

            <a
              href={data.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-[#8b1c2d] hover:bg-[#a32439] text-white rounded-xl text-sm font-semibold transition-colors"
            >
              <MapPin className="h-4 w-4" />
              Otvori na Google Maps
            </a>
          </div>

          {/* Footer */}
          <div className="bg-[#0b1220] px-8 py-6 text-center space-y-1">
            <p className="text-slate-500 text-sm">
              Ponuda važi samo tokom Ramazana. Jedan poklon po osobi.
            </p>
            <p className="text-slate-400 text-sm font-medium">
              Vidimo se na iftaru 🌙 —{" "}
              <Link href="/" className="text-[#e05c72] hover:underline">
                Balkly Team
              </Link>
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
            ← Nazad na Balkly
          </Link>
        </div>
      </div>
    </div>
  );
}
