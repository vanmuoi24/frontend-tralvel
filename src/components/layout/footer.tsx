"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MessageCircle, Phone, MapPin, Send } from "lucide-react";
import { LOGO_SRC } from "@/data/assets";
import { useLanguage } from "@/providers/language-provider";
import { useBackendServices } from "@/providers/services-provider";
import { useSiteData } from "@/providers/site-provider";

type FooterCopy = {
  description: string;
  links: string;
  services: string;
  contact: string;
  support: string;
  callNow: string;
  navLinks: { label: string; href: string }[];
  serviceNames: Record<string, string>;
};

export function Footer() {
  const { language } = useLanguage();
  const { site: siteConfig } = useSiteData();
  const travelServices = useBackendServices(language);
  const copy = footerCopy[language];
  const socialLinks = [
    { name: "Facebook", href: siteConfig.social.facebook },
    { name: "Instagram", href: siteConfig.social.instagram },
    { name: "Youtube", href: siteConfig.social.youtube },
  ].filter((item) => item.href);

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr_1fr_1.2fr] lg:gap-10">
          <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 sm:p-5 lg:border-0 lg:bg-transparent lg:p-0">
            <Link href="/" className="flex items-center gap-3">
              {LOGO_SRC && (
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded border border-[#ffce3c]/45 bg-[#3a2708]">
                  <Image src={LOGO_SRC} alt="An Khai Travel logo" fill sizes="44px" className="object-contain" />
                </div>
              )}
              <span className="min-w-0">
                <span className="block truncate text-lg font-black sm:text-xl">{siteConfig.name}</span>
                <span className="block text-xs font-black text-amber-500">{siteConfig.legalNameZh}</span>
              </span>
            </Link>
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {copy.description}
            </p>
            <div className="mt-4 flex gap-2.5">
              {socialLinks.map(({ name, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={name}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-xs font-bold text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground sm:h-10 sm:w-10"
                >
                  {name.slice(0, 2).toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:contents">
            <div>
            <h3 className="mb-3 text-base font-black sm:text-lg">{copy.links}</h3>
            <ul className="space-y-2">
              {copy.navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            </div>

            <div>
            <h3 className="mb-3 text-base font-black sm:text-lg">{copy.services}</h3>
            <ul className="grid gap-2">
              {travelServices.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <Link href={`/services/${service.id}`} className="line-clamp-1 text-sm text-muted-foreground transition-colors hover:text-primary">
                    {copy.serviceNames[service.id] ?? service.label}
                  </Link>
                </li>
              ))}
            </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
            <h3 className="mb-3 text-base font-black sm:text-lg">{copy.contact}</h3>
            <ul className="grid gap-2.5 rounded-2xl border border-border/70 bg-muted/30 p-4 lg:border-0 lg:bg-transparent lg:p-0">
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="line-clamp-2">{siteConfig.address}</span>
              </li>
              {siteConfig.phones.map((phone) => (
                <li key={phone.value} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  {phone.label}: {phone.value}
                </li>
              ))}
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <MessageCircle className="h-4 w-4 shrink-0 text-primary" />
                <Link href={siteConfig.webchatHref} className="hover:text-primary">WeChat</Link>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Send className="h-4 w-4 shrink-0 text-primary" />
                <a href={siteConfig.telegramHref} target="_blank" rel="noreferrer" className="hover:text-primary">Telegram</a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <span className="min-w-0 break-all">{siteConfig.email}</span>
              </li>
            </ul>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col items-center justify-between gap-3 border-t border-border pt-5 text-center sm:mt-10 sm:pt-7 md:flex-row md:text-left">
          <p className="text-xs text-muted-foreground sm:text-sm">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground sm:text-sm">
            <Link href="/services" className="hover:text-primary">Services</Link>
            <Link href="/contact" className="hover:text-primary">{copy.support}</Link>
            <a href={`tel:${siteConfig.phones[0]?.value ?? siteConfig.phone}`} className="hover:text-primary">{copy.callNow}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

const footerCopy: Record<"zh" | "en", FooterCopy> = {
  zh: {
    description: "An Khai Travel 提供越南酒店、簽證、租車、機場接送、SPA、電話卡、機票、導遊與餐廳諮詢服務。",
    links: "連結",
    services: "服務",
    contact: "聯繫方式",
    support: "客服支援",
    callNow: "立即撥打",
    navLinks: [
      { label: "首頁", href: "/" },
      { label: "服務", href: "/services" },
      { label: "聯繫", href: "/contact" },
    ],
    serviceNames: {
      hotel: "酒店預訂",
      visa: "簽證服務",
      "car-rental": "越南租車",
      "airport-transfer": "機場接送",
      "flight-ticket": "機票預訂",
      sim: "旅遊電話卡",
      spa: "SPA 水療",
      "ktv-massage": "KTV 與按摩",
      "tour-guide": "旅遊團與導遊",
      restaurant: "餐廳推薦",
    },
  },
  en: {
    description: "An Khai Travel helps with Vietnam hotels, visa support, car rental, airport transfers, spa, SIM cards, flight tickets, guides, and restaurant recommendations.",
    links: "Links",
    services: "Services",
    contact: "Contact",
    support: "Support",
    callNow: "Call now",
    navLinks: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: "Contact", href: "/contact" },
    ],
    serviceNames: {
      hotel: "Hotel reservation",
      visa: "Visa service",
      "car-rental": "Car rental",
      "airport-transfer": "Airport transfers",
      "flight-ticket": "Flight tickets",
      sim: "Travel SIM",
      spa: "Spa",
      "ktv-massage": "KTV & massage",
      "tour-guide": "Tour guide",
      restaurant: "Restaurants",
    },
  },
};
