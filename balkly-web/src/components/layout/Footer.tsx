import Link from "next/link";
import { Instagram, Mail } from "lucide-react";

// TikTok icon component (not available in lucide-react)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-8 sm:mt-12 lg:mt-16">
      <div className="container mx-auto px-4 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 sm:block">
              <img 
                src="/logo-icon.png" 
                alt="Balkly" 
                width={96}
                height={96}
                className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 brightness-110 sm:mb-4 lg:mb-6"
              />
              <div className="sm:hidden">
                <div className="inline-flex items-center gap-2 px-2 py-1 bg-gray-800 rounded-full mb-1">
                  <span className="text-[10px] font-bold text-teal-glow">UAE</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-[10px] font-bold text-white">Balkly</span>
                </div>
                <p className="text-xs text-gray-400">United Balkans in the Emirates</p>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full mb-3 sm:mb-4">
                <span className="text-xs font-bold text-teal-glow">UAE</span>
                <span className="text-gray-600">•</span>
                <span className="text-xs font-bold text-white">Balkly Community</span>
              </div>
              <p className="text-sm text-gray-400">
                United Balkans in the Emirates
              </p>
              <p className="text-xs text-gray-400 mt-2">
                One community. One platform. No borders.
              </p>
            </div>
            <div className="flex gap-3 mt-3 sm:mt-4">
              <a href="https://www.tiktok.com/@balkly.ae" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 -ml-2 sm:p-0 sm:ml-0" aria-label="Follow us on TikTok">
                <TikTokIcon className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/balkly_dxb" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 sm:p-0" aria-label="Follow us on Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="mailto:info@balkly.live" className="text-gray-400 hover:text-white transition-colors p-2 sm:p-0" aria-label="Email us at info@balkly.live">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="font-bold mb-3 sm:mb-4 text-white text-sm sm:text-base">Marketplace</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/listings" className="text-gray-400 hover:text-white transition-colors">
                  View Ads
                </Link>
              </li>
              <li>
                <Link href="/listings/create" className="text-gray-400 hover:text-white transition-colors">
                  Post an Ad
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-400 hover:text-white transition-colors">
                  Find Events
                </Link>
              </li>
              <li>
                <Link href="/forum" className="text-gray-400 hover:text-white transition-colors">
                  Community Forum
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-3 sm:mb-4 text-white text-sm sm:text-base">Support</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/knowledge-base" className="text-gray-400 hover:text-white transition-colors">
                  Knowledge Base
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-gray-400 hover:text-white transition-colors">
                  Safety Tips
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-3 sm:mb-4 text-white text-sm sm:text-base">Legal</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-gray-400 hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Balkly. All rights reserved.</p>
          <p className="mt-2">
            Built with ❤️ by NLD | Secure payments powered by PayPal
          </p>
        </div>
      </div>
    </footer>
  );
}

