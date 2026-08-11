"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BedDouble,
  Car,
  CarTaxiFront,
  Check,
  Grid2X2,
  MapPinned,
  MicVocal,
  Plane,
  PlaneTakeoff,
  Search,
  SlidersHorizontal,
  Sparkles,
  Smartphone,
  Utensils,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TravelService } from "@/data/services";
import { useLanguage } from "@/providers/language-provider";
import { useBackendServices } from "@/providers/services-provider";

const iconMap: Record<string, React.ElementType> = {
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

const serviceGroups: Record<string, string> = {
  hotel: "Stay",
  visa: "Visa",
  "car-rental": "Transport",
  "airport-transfer": "Transport",
  "flight-ticket": "Transport",
  sim: "Essentials",
  spa: "Leisure",
  "ktv-massage": "Leisure",
  "tour-guide": "Tour",
  restaurant: "Food",
};

const groupOptions = ["Transport", "Stay", "Visa", "Tour", "Food", "Leisure", "Essentials"];
const groupLabel = {
  zh: {
    Transport: "交通",
    Stay: "住宿",
    Visa: "簽證",
    Tour: "旅遊",
    Food: "美食",
    Leisure: "娛樂",
    Essentials: "實用服務",
  },
  en: {
    Transport: "Transport",
    Stay: "Stay",
    Visa: "Visa",
    Tour: "Tour",
    Food: "Food",
    Leisure: "Leisure",
    Essentials: "Essentials",
  },
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

type ServiceDirectoryProps = {
  services: TravelService[];
};

export function ServiceDirectory({ services }: ServiceDirectoryProps) {
  const { language } = useLanguage();
  const backendServices = useBackendServices(language);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("");
  const activeServices = backendServices.length ? backendServices : services;
  const normalizedQuery = normalize(query);
  const filteredServices = activeServices.filter((service) => {
    const matchesGroup = !group || serviceGroups[service.id] === group;
    const matchesSearch =
      !normalizedQuery ||
      normalize([service.label, service.shortLabel, service.caption, service.description].join(" ")).includes(normalizedQuery);

    return matchesGroup && matchesSearch;
  });
  const copy = {
    zh: {
      filter: "篩選",
      reset: "重置",
      group: "服務類型",
      budget: "預算",
      category: "類型",
      departure: "出發地",
      date: "日期",
      all: "全部",
      city: "胡志明市",
      flexible: "靈活",
      search: "搜尋服務",
      results: "結果",
      services: "項服務",
      sort: "排序：推薦優先",
      quick: "快速查看",
      detail: "詳情",
      emptyTitle: "沒有找到服務",
      emptyText: "請更換關鍵词或服務類型。",
    },
    en: {
      filter: "Filter",
      reset: "Reset",
      group: "Service line",
      budget: "Budget",
      category: "Category",
      departure: "Departure",
      date: "Date",
      all: "All",
      city: "Ho Chi Minh City",
      flexible: "Flexible",
      search: "Search services",
      results: "Results",
      services: "services",
      sort: "Sort: recommended",
      quick: "Quick view",
      detail: "Details",
      emptyTitle: "No service found",
      emptyText: "Try another keyword or service line.",
    },
  }[language];

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-md border border-border bg-card p-4 shadow-sm lg:sticky lg:top-36">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            <h2 className="text-base font-black">{copy.filter}</h2>
          </div>
          {(group || query) && (
            <button type="button" onClick={() => { setGroup(""); setQuery(""); }} className="text-xs font-bold text-muted-foreground hover:text-primary">
              {copy.reset}
            </button>
          )}
        </div>

        <div className="mt-6">
          <p className="text-sm font-black">{copy.group}</p>
          <div className="mt-3 grid gap-2">
            {groupOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setGroup((current) => (current === option ? "" : option))}
                className="flex items-center justify-between rounded px-1 py-1.5 text-left text-sm font-semibold text-muted-foreground transition hover:text-foreground"
              >
                <span className="inline-flex items-center gap-2">
                  <span className={cn("flex h-5 w-5 items-center justify-center rounded border", group === option ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/50")}>
                    {group === option && <Check className="h-3.5 w-3.5" />}
                  </span>
                  {groupLabel[language][option as keyof typeof groupLabel.en]}
                </span>
                <span className="text-xs">{activeServices.filter((service) => serviceGroups[service.id] === option).length}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-5">
          <p className="text-sm font-black">{copy.budget}</p>
          <div className="mt-3 h-1.5 rounded-full bg-muted">
            <div className="h-1.5 w-2/3 rounded-full bg-primary" />
          </div>
          <div className="mt-2 flex justify-between text-xs font-bold text-muted-foreground">
            <span>{language === "zh" ? "聯繫客服" : "Contact us"}</span>
            <span>{language === "zh" ? "按需求確認" : "By request"}</span>
          </div>
        </div>
      </aside>

      <section className="min-w-0">
        <div className="rounded-md border border-border bg-card p-3 shadow-sm">
          <div className="grid gap-2 md:grid-cols-[1fr_1fr_1fr_auto]">
            {[
              { label: copy.category, value: group ? groupLabel[language][group as keyof typeof groupLabel.en] : copy.all },
              { label: copy.departure, value: copy.city },
              { label: copy.date, value: copy.flexible },
            ].map((item) => (
              <div key={item.label} className="rounded bg-muted px-4 py-3">
                <p className="text-xs font-bold text-muted-foreground">{item.label}</p>
                <p className="mt-1 truncate text-sm font-black text-primary">{item.value}</p>
              </div>
            ))}
            <label className="flex min-h-16 items-center gap-2 rounded bg-muted px-4 md:min-w-64">
              <Search className="h-5 w-5 shrink-0 text-primary" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.search}
                className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-muted-foreground"
              />
            </label>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <p className="text-sm font-black">
            {copy.results}: <span className="text-primary">{filteredServices.length} {copy.services}</span>
          </p>
          <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
            <span>{copy.sort}</span>
            <Grid2X2 className="h-5 w-5 text-primary" />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
          {filteredServices.map((service, index) => {
            const Icon = iconMap[service.icon] || Plane;
            const badge = service.featured ? (language === "zh" ? "推薦" : "Featured") : index % 3 === 0 ? (language === "zh" ? "熱門" : "Popular") : index % 3 === 1 ? (language === "zh" ? "省心" : "Easy") : (language === "zh" ? "靈活" : "Flexible");

            return (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="group overflow-hidden rounded-md border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-xl"
              >
                <div className="relative aspect-[4/2.75] overflow-hidden">
                  <Image src={service.image} alt={service.label} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width: 1280px) 25vw, (min-width: 768px) 42vw, 50vw" />
                  <div className="absolute left-2 top-2 rounded bg-white/90 px-2 py-0.5 text-[10px] font-black text-primary shadow-sm sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-xs">{badge}</div>
                  <div className="absolute bottom-2 left-2 hidden items-center gap-2 rounded bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-700 sm:flex">
                    <Icon className="h-3.5 w-3.5" />
                    {groupLabel[language][serviceGroups[service.id] as keyof typeof groupLabel.en]}
                  </div>
                  <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-bold text-[#ffda68] sm:bottom-3 sm:right-3 sm:px-3 sm:py-1 sm:text-xs">{copy.quick}</div>
                </div>

                <div className="p-3 sm:p-4">
                  <h3 className="line-clamp-2 min-h-10 text-sm font-black leading-snug sm:min-h-12 sm:text-base">{service.label}: {service.caption}</h3>
                  <p className="mt-2 line-clamp-2 text-xs font-semibold leading-relaxed text-muted-foreground">{service.description}</p>
                  <div className="mt-3 flex items-end justify-end gap-3 sm:mt-4">
                    <span className="inline-flex h-9 items-center rounded bg-primary px-3 text-xs font-bold text-primary-foreground sm:h-10 sm:px-4 sm:text-sm">
                      {copy.detail} <ArrowRight className="ml-1 h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredServices.length === 0 && (
          <div className="mt-5 rounded-md border border-border bg-card p-8 text-center">
            <p className="text-lg font-black">{copy.emptyTitle}</p>
            <p className="mt-2 text-sm text-muted-foreground">{copy.emptyText}</p>
          </div>
        )}
      </section>
    </div>
  );
}
