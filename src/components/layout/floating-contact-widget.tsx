"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, Phone, ArrowUp, Send } from "lucide-react";
import { useSiteConfig } from "@/providers/site-provider";

export function FloatingContactWidget() {
  const siteConfig = useSiteConfig();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 items-end">
      {/* Quick Webchat / Zalo trigger */}
      <Link
        href={siteConfig.webchatHref}
        className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 text-white shadow-xl hover:scale-105 transition duration-300"
        title="WebChat support"
      >
        <MessageCircle className="h-5 w-5 animate-pulse" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-bold transition-all duration-300 group-hover:max-w-xs">
          WebChat Support
        </span>
      </Link>

      <a
        href={siteConfig.telegramHref}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-sky-600 px-4 py-3 text-white shadow-xl hover:scale-105 transition duration-300"
        title="Telegram"
      >
        <Send className="h-5 w-5" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-bold transition-all duration-300 group-hover:max-w-xs">
          Telegram
        </span>
      </a>

      {/* Phone Hotline Button */}
      {siteConfig.phones.map((phone) => (
        <a
          key={phone.value}
          href={`tel:${phone.value}`}
          className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-3 text-slate-950 font-black shadow-xl hover:scale-105 transition duration-300"
          title={phone.label}
        >
          <Phone className="h-5 w-5" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-black transition-all duration-300 group-hover:max-w-xs">
            {phone.label}: {phone.value}
          </span>
        </a>
      ))}

      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/40 bg-slate-900/90 text-amber-400 shadow-xl backdrop-blur-md transition duration-300 hover:bg-amber-400 hover:text-slate-950"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
