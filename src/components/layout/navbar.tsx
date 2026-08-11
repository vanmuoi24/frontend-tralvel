"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  BedDouble,
  Car,
  CarTaxiFront,
  Languages,
  MapPinned,
  Menu,
  MessageCircle,
  MicVocal,
  Moon,
  Phone,
  Plane,
  PlaneTakeoff,
  Search,
  Send,
  Sparkles,
  Smartphone,
  Sun,
  Utensils,
  X,
} from "lucide-react";
import { LOGO_SRC } from "@/data/assets";
import { navCopy } from "@/data/localized-content";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/language-provider";
import { useBackendServices } from "@/providers/services-provider";
import { useSiteConfig } from "@/providers/site-provider";

const serviceIconMap: Record<string, React.ElementType> = {
  BadgeCheck,
  BedDouble,
  Car,
  CarTaxiFront,
  MapPinned,
  MicVocal,
  Plane,
  PlaneTakeoff,
  Sparkles,
  Smartphone,
  Utensils,
};

const searchKeywordsByService: Record<string, string> = {
  hotel: "khach san dat phong hotel booking 酒店 住宿",
  visa: "visa thi thuc ho chieu passport 簽證",
  "car-rental": "thue xe xe rieng car rental 租車 包車",
  "ktv-massage": "ktv massage giai tri karaoke nightlife 按摩 娛樂",
  "airport-transfer": "san bay dua don airport transfer pickup 接機 送機 機場",
  spa: "spa cham soc thu gian massage wellness 水療 放鬆",
  sim: "sim dien thoai data 4g 5g phone card 電話卡 流量",
  "flight-ticket": "ve may bay chuyen bay flight ticket airfare 機票 航班",
  "tour-guide": "tour huong dan vien lich trinh guide custom tours 導遊 旅遊 行程",
  restaurant: "nha hang an uong am thuc food restaurant 美食 餐廳",
};

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, setTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const siteConfig = useSiteConfig();
  const copy = navCopy[language];
  const travelServices = useBackendServices(language);
  const marqueeServices = [...travelServices, ...travelServices];
  const normalizedSearchQuery = normalizeSearch(searchQuery);
  const filteredServices = normalizedSearchQuery
    ? travelServices.filter((service) => {
        const haystack = normalizeSearch(
          [
            service.id,
            service.label,
            service.shortLabel,
            service.caption,
            searchKeywordsByService[service.id],
          ].join(" ")
        );

        return haystack.includes(normalizedSearchQuery);
      })
    : travelServices.slice(0, 5);
  const searchPlaceholder = language === "zh" ? "搜尋服務..." : "Search services...";

  useEffect(() => {
    const mountedFrame = requestAnimationFrame(() => setMounted(true));
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      cancelAnimationFrame(mountedFrame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const showSearchResults = searchQuery.trim().length > 0;

  return (
    <header className="sticky top-0 z-50 border-b border-amber-400/20 bg-[#031425]/95 text-white shadow-[0_10px_30px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-300">
      <div
        className={cn(
          "w-full transition-all duration-300",
          isScrolled && "bg-[#031425]/98 shadow-[0_16px_45px_rgba(0,0,0,0.3)]"
        )}
      >
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          {/* LOGO BRAND */}
          <Link href="/" className="group flex min-w-0 items-center gap-2 sm:gap-3">
            {LOGO_SRC && (
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-20">
                <Image
                  src={LOGO_SRC}
                  alt="An Khai Travel logo"
                  fill
                  priority
                  sizes="100px"
                  className="object-contain"
                />
              </div>
            )}
            <div className="min-w-0">
              <span className="block truncate text-base font-black tracking-tight text-white sm:text-xl">
                An Khai<span className="text-amber-500"> Travel</span>
              </span>
              <span className="block truncate text-[0.7rem] font-black text-[#ffdf7a] sm:text-xs">
                {siteConfig.legalNameZh}
              </span>
              <span className="hidden items-center gap-2 text-[0.62rem] font-bold uppercase tracking-widest text-amber-500 sm:flex">
                {copy.tagline}
                <span className="relative h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px] shadow-sm ">
                  <Image
                    src="/anhlacotoquoc.png"
                    alt="Vietnam flag"
                    fill
                    sizes="20px"
                    className="object-cover"
                  />
                </span>
              </span>
            </div>
          </Link>
          <div className="relative hidden max-w-sm flex-1 lg:block">
            <label htmlFor="service-search" className="sr-only">
              {searchPlaceholder}
            </label>
            <div className="flex h-10 items-center gap-2 rounded border border-white/15 bg-white/[0.06] px-3 text-white transition focus-within:border-amber-400 focus-within:bg-white/[0.09]">
              <Search className="h-4 w-4 shrink-0 text-amber-400" />
              <input
                id="service-search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={searchPlaceholder}
                className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-white/45"
              />
            </div>
            {showSearchResults && (
              <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded border border-amber-400/25 bg-[#041a31] shadow-2xl">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => {
                    const Icon = serviceIconMap[service.icon] || Plane;
                    return (
                      <Link
                        key={service.id}
                        href={`/services/${service.id}`}
                        onClick={() => setSearchQuery("")}
                        className="flex items-center gap-3 border-b border-white/10 px-3 py-2.5 text-white transition last:border-b-0 hover:bg-amber-400 hover:text-slate-950"
                      >
                        <Icon className="h-5 w-5 shrink-0 text-amber-400" />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-black">{service.label}</span>
                          <span className="block truncate text-xs font-semibold text-white/65">{service.caption}</span>
                        </span>
                      </Link>
                    );
                  })
                ) : (
                  <p className="px-3 py-3 text-sm font-semibold text-white/65">
                    {language === "zh" ? "沒有找到服務" : "No service found"}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* QUICK ACTIONS RIGHT */}
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={`tel:${siteConfig.phones[0]?.value ?? siteConfig.phone}`}
              className="hidden items-center gap-2 rounded-xl bg-amber-400 px-3.5 py-2 text-xs font-black text-slate-950 shadow-md transition hover:bg-amber-300 md:inline-flex"
            >
              <Phone className="h-4 w-4" />
              {copy.hotline} {siteConfig.phones[0]?.value ?? siteConfig.phone}
            </a>
            <Link
              href={siteConfig.webchatHref}
                className="hidden items-center gap-2 rounded border border-amber-400/40 bg-white/[0.04] px-3.5 py-2 text-xs font-bold text-white transition hover:border-amber-400 hover:bg-amber-400/10 hover:text-amber-300 sm:inline-flex"
            >
              <MessageCircle className="h-4 w-4 text-amber-400" />
              {copy.chat}
            </Link>
            <a
              href={siteConfig.telegramHref}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded border border-sky-400/40 bg-white/[0.04] px-3.5 py-2 text-xs font-bold text-white transition hover:border-sky-400 hover:bg-sky-400/10 hover:text-sky-300 sm:inline-flex"
            >
              <Send className="h-4 w-4 text-sky-400" />
              Telegram
            </a>

            {mounted && (
              <button
                onClick={toggleLanguage}
                className="inline-flex p-[6.5px] items-center gap-1.5 rounded border border-white/15 bg-white/[0.04] px-2.5  font-black text-white transition hover:border-amber-400 hover:text-amber-300"
                aria-label={copy.languageLabel}
              >
                <Languages className="h-4 w-4 text-amber-400" />
                {copy.languageButton}
              </button>
            )}

            {mounted && (
              <button
                onClick={toggleTheme}
                className="rounded border border-white/15 bg-white/[0.04] p-2.5 text-white transition hover:border-amber-400 hover:text-amber-300"
                aria-label={copy.themeLabel}
              >
                {theme === "dark" ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
              </button>
            )}

            <button
              onClick={() => setIsOpen((open) => !open)}
              className="rounded border border-white/15 bg-white/[0.04] p-2.5 text-white transition hover:border-amber-400 hover:text-amber-300 lg:hidden"
              aria-label={copy.menuLabel}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <nav className="border-t border-white/10 bg-[#041a31]" aria-label={copy.servicesLabel}>
          <div className="mx-auto max-w-7xl overflow-hidden px-4 py-2 sm:px-6 lg:px-8">
            <div className="service-marquee flex w-max hover:[animation-play-state:paused]">
              {marqueeServices.map((service, index) => {
                const Icon = serviceIconMap[service.icon] || Plane;
                return (
                  <Link
                    key={`${service.id}-${index}`}
                    href={`/services/${service.id}`}
                    className={cn(
                      "group relative flex min-h-20 min-w-[128px] shrink-0 flex-col items-center justify-center px-4 text-center text-[#ffda68] transition hover:-translate-y-0.5 hover:text-white"
                    )}
                  >
                    {index > 0 && (
                      <span className="absolute left-0 top-1/2 h-11 w-px -translate-y-1/2 bg-[#ffce3c]/35" aria-hidden="true" />
                    )}
                    <Icon className="mb-1.5 h-6 w-6 shrink-0 stroke-[1.9] transition group-hover:scale-105 sm:h-7 sm:w-7" />
                    <span className="block min-w-0">
                      <span className="block max-w-[104px] truncate text-xs font-black uppercase leading-tight tracking-normal">
                        {service.shortLabel}
                      </span>
                      <span className="mt-0.5 block max-w-[104px] truncate text-[0.62rem] font-semibold leading-tight tracking-normal text-white/65 group-hover:text-white/80">
                        {service.caption}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* MOBILE MENU DROPDOWN */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-white/10 bg-[#041a31] lg:hidden"
            >
              <div className="p-3 sm:p-4">
                <label htmlFor="mobile-service-search" className="sr-only">
                  {searchPlaceholder}
                </label>
                <div className="mb-3 flex h-11 items-center gap-2 rounded border border-white/15 bg-white/[0.06] px-3 text-white focus-within:border-amber-400">
                  <Search className="h-4 w-4 shrink-0 text-amber-400" />
                  <input
                    id="mobile-service-search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={searchPlaceholder}
                    className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-white/45"
                  />
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {(showSearchResults ? filteredServices : travelServices).map((service) => {
                  const Icon = serviceIconMap[service.icon] || Plane;
                  return (
                    <Link
                      key={service.label}
                      href={`/services/${service.id}`}
                      onClick={() => {
                        setIsOpen(false);
                        setSearchQuery("");
                      }}
                      className={cn(
                        "flex min-h-14 items-center gap-3 rounded border p-3",
                        service.featured ? "border-amber-400 bg-amber-400 text-slate-950" : "border-white/10 bg-white/[0.05] text-white"
                      )}
                    >
                      <Icon className={cn("h-5 w-5 shrink-0", service.featured ? "text-slate-950" : "text-amber-400")} />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-black">{service.label}</span>
                        <span className={cn("block truncate text-xs font-semibold", service.featured ? "text-slate-800" : "text-white/65")}>
                          {service.caption}
                        </span>
                      </span>
                    </Link>
                  );
                  })}
                  {showSearchResults && filteredServices.length === 0 && (
                    <p className="rounded border border-white/10 bg-white/[0.05] px-3 py-3 text-sm font-semibold text-white/65 sm:col-span-2">
                      {language === "zh" ? "沒有找到服務" : "No service found"}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
