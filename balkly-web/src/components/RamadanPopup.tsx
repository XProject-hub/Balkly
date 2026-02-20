"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function RamadanPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("ramadan_popup_dismissed");
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  const handleClose = () => {
    setVisible(false);
    sessionStorage.setItem("ramadan_popup_dismissed", "1");
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(15, 23, 42, 0.88)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative w-full max-w-[680px] max-h-[90vh] overflow-y-auto rounded-3xl bg-[#111827] p-8 sm:p-10 text-center text-gray-100 shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-5 text-gray-400 hover:text-white text-2xl leading-none transition-colors"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-5">
          <Image
            src="/images/marengo-logo.png"
            alt="Bosnian Marengo"
            width={170}
            height={60}
            className="object-contain"
            priority
          />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold mb-5">
          🌙 Ramazanska Iftar Akcija
        </h2>

        <p className="text-base leading-7 text-gray-200 mb-5">
          Tokom Ramazana želimo vas počastiti malim znakom pažnje.
          Registrujte se na Balkly i dobijte svoj lični kod za{" "}
          <strong>besplatnu domaću kafu ili čorbu</strong>{" "}
          u Bosnian Marengo Restaurant tokom iftara.
        </p>

        <ul className="list-none p-0 mb-6 text-[0.95rem] text-gray-300 space-y-2">
          <li>✅ Registrujte se na Balkly</li>
          <li>📧 Nakon registracije dobijate kod na email</li>
          <li>📱 Pokažete kod prilikom dolaska</li>
        </ul>

        <Link
          href="/auth/register"
          onClick={handleClose}
          className="block w-full py-4 rounded-xl bg-[#8b1c2d] hover:bg-[#a32439] text-white font-semibold text-base transition-colors no-underline"
        >
          REGISTRUJ SE I PREUZMI KOD
        </Link>

        <small className="block mt-4 text-sm text-gray-400">
          Ponuda važi samo tokom Ramazana. Jedan poklon po osobi.
        </small>

        <div className="mt-6 text-[0.95rem] text-gray-200">
          📍 Bosnian Marengo Restaurant<br />
          Jumeirah Beach, Jumeirah 1, Dubai
        </div>

        <div className="mt-5">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7218.967163914383!2d55.25016062688164!3d25.22063232001067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f430079731b57%3A0x3ce07741c0473fac!2sBosnian%20Marengo%20Restaurant!5e0!3m2!1sen!2sat!4v1771578745836!5m2!1sen!2sat"
            loading="lazy"
            allowFullScreen
            className="w-full h-[130px] border-0 rounded-xl block"
            title="Bosnian Marengo Restaurant Location"
          />
        </div>
      </div>
    </div>
  );
}
