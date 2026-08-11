"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, MessageCircle, Phone, Send } from "lucide-react";
import { useSiteConfig } from "@/providers/site-provider";

export function BackToTop() {
  const siteConfig = useSiteConfig();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      <a
        href={`tel:${siteConfig.phones[0]?.value ?? siteConfig.phone}`}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffce3c] text-[#041528] shadow-lg transition-transform hover:scale-110"
        aria-label="Call now"
      >
        <Phone className="h-5 w-5" />
      </a>
      <a
        href={siteConfig.webchatHref}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#041528] text-white shadow-lg transition-transform hover:scale-110"
        aria-label="Webchat"
      >
        <MessageCircle className="h-5 w-5" />
      </a>
      <a
        href={siteConfig.telegramHref}
        target="_blank"
        rel="noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg transition-transform hover:scale-110"
        aria-label="Telegram"
      >
        <Send className="h-5 w-5" />
      </a>
      <AnimatePresence>
        {visible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-110"
            aria-label="Back to top"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
