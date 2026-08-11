"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Search, SlidersHorizontal, Smartphone, Wifi } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { slugify } from "@/lib/slugify";
import { ServicePagination } from "@/components/services/service-pagination";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

const simPlans = [
  {
    kind: "physical",
    durationType: "short",
    title: { zh: "15 天旅遊 SIM", en: "15-day Travel SIM" },
    data: { zh: "3GB / 天", en: "3GB / day" },
    duration: { zh: "15 天", en: "15 days" },
    pickup: { zh: "機場 / 酒店交付", en: "Airport / hotel delivery" },
    description: {
      zh: "適合短期旅行、城市遊和輕度影片使用，到達後可快速激活。",
      en: "Good for short trips, city travel, and light video use, with quick activation after arrival.",
    },
    features: { zh: ["實體 SIM", "快速激活", "全國覆蓋"], en: ["Physical SIM", "Quick activation", "Nationwide coverage"] },
  },
  {
    kind: "physical",
    durationType: "standard",
    title: { zh: "30 天高速流量 SIM", en: "30-day High-speed SIM" },
    data: { zh: "5GB / 天", en: "5GB / day" },
    duration: { zh: "30 天", en: "30 days" },
    pickup: { zh: "酒店 / 市區交付", en: "Hotel / city delivery" },
    description: {
      zh: "適合越南多城市行程，導航、打車、社交和日常影片更穩定。",
      en: "Best for multi-city Vietnam trips, stable for maps, ride-hailing, social apps, and daily video.",
    },
    features: { zh: ["高流量", "適合多城市", "可團隊購買"], en: ["High data", "Multi-city friendly", "Group purchase"] },
  },
  {
    kind: "esim",
    durationType: "standard",
    title: { zh: "越南旅遊 eSIM", en: "Vietnam Travel eSIM" },
    data: { zh: "每日高速流量", en: "Daily high-speed data" },
    duration: { zh: "15-30 天", en: "15-30 days" },
    pickup: { zh: "線上二維碼安裝", en: "Online QR setup" },
    description: {
      zh: "無需換卡，適合支援 eSIM 的手機，出發前即可安裝。",
      en: "No card swap needed. Install before departure on compatible eSIM phones.",
    },
    features: { zh: ["無需實體卡", "出發前安裝", "二維碼開通"], en: ["No physical card", "Install before travel", "QR activation"] },
  },
  {
    kind: "unlimited",
    durationType: "short",
    title: { zh: "無限流量短期套餐", en: "Short-stay Unlimited Data" },
    data: { zh: "不限量", en: "Unlimited" },
    duration: { zh: "7-10 天", en: "7-10 days" },
    pickup: { zh: "機場領取", en: "Airport pickup" },
    description: {
      zh: "適合直播、影片、辦公熱點需求較高的短期客人。",
      en: "For short-stay guests who need streaming, video, work apps, or hotspot-heavy use.",
    },
    features: { zh: ["不限量", "適合熱點", "短期旅行"], en: ["Unlimited data", "Hotspot friendly", "Short-trip ready"] },
  },
  {
    kind: "physical",
    durationType: "group",
    title: { zh: "團隊 SIM 批量套餐", en: "Group SIM Bundle" },
    data: { zh: "按人數配置", en: "Configured by group size" },
    duration: { zh: "按行程天數", en: "By itinerary length" },
    pickup: { zh: "機場 / 酒店統一交付", en: "Airport / hotel batch delivery" },
    description: {
      zh: "適合旅遊團、商務團和家庭團，可統一激活、貼標簽和分發。",
      en: "For tour groups, business teams, and families with batch activation, labeling, and delivery.",
    },
    features: { zh: ["團隊交付", "統一激活", "按人數报價"], en: ["Group delivery", "Batch activation", "Quote by headcount"] },
  },
  {
    kind: "esim",
    durationType: "long",
    title: { zh: "長期停留 eSIM", en: "Long-stay eSIM" },
    data: { zh: "30-60 天流量", en: "30-60 day data" },
    duration: { zh: "30-60 天", en: "30-60 days" },
    pickup: { zh: "線上安裝支援", en: "Online setup support" },
    description: {
      zh: "適合商務停留、探親和長線行程，可按天數匹配方案。",
      en: "For business stays, family visits, and longer trips, matched by travel length.",
    },
    features: { zh: ["長期方案", "線上支援", "無需換卡"], en: ["Long-stay plans", "Online support", "No card swap"] },
  },
  {
    kind: "physical",
    durationType: "standard",
    title: { zh: "越南通話 + 流量 SIM", en: "Vietnam Call + Data SIM" },
    data: { zh: "流量 + 本地通話", en: "Data + local calls" },
    duration: { zh: "30 天", en: "30 days" },
    pickup: { zh: "市區 / 酒店交付", en: "City / hotel delivery" },
    description: {
      zh: "適合需要聯繫司機、酒店和本地服務的客人，含基礎本地通話。",
      en: "Useful when calling drivers, hotels, and local services, with basic local calls included.",
    },
    features: { zh: ["本地號碼", "含通話", "適合商務"], en: ["Local number", "Calls included", "Business friendly"] },
  },
  {
    kind: "unlimited",
    durationType: "long",
    title: { zh: "高強度辦公流量卡", en: "Heavy-use Work Data Plan" },
    data: { zh: "高速大流量", en: "High-volume data" },
    duration: { zh: "30 天", en: "30 days" },
    pickup: { zh: "酒店交付 / 線上開通", en: "Hotel delivery / online setup" },
    description: {
      zh: "適合遠程辦公、熱點共享和長期影片會议使用。",
      en: "Designed for remote work, hotspot sharing, and longer video meeting usage.",
    },
    features: { zh: ["辦公推薦", "熱點共享", "高強度使用"], en: ["Work-ready", "Hotspot sharing", "Heavy usage"] },
  },
];

export function TravelSimCatalog({ serviceId }: { serviceId: string }) {
  const { language } = useLanguage();
  const [simQuery, setSimQuery] = useState("");
  const [activeKind, setActiveKind] = useState("all");
  const [activeDuration, setActiveDuration] = useState("all");
  const [activeDelivery, setActiveDelivery] = useState("all");
  const [activeUsage, setActiveUsage] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");
  const [page, setPage] = useState(0);
  const copy = {
    zh: {
      eyebrow: "越南旅遊 SIM / eSIM",
      title: "落地就能上網，流量套餐提前安排",
      description: "按停留天數、手機類型、是否需要實體卡和團隊人數推薦 SIM/eSIM，支援機場、酒店或線上交付。",
      order: "聯繫",
      browse: "查看套餐",
      searchLabel: "快速搜尋",
      searchPlaceholder: "搜尋 eSIM、機場、團隊、無限流量...",
      kindLabel: "SIM 類型",
      durationLabel: "停留時間",
      deliveryLabel: "領取 / 開通",
      usageLabel: "使用場景",
      sortLabel: "排序",
      all: "全部",
      physical: "實體 SIM",
      esim: "eSIM",
      unlimited: "不限量",
      short: "短期",
      standard: "15-30 天",
      long: "長期",
      group: "團隊",
      airport: "機場",
      hotel: "酒店",
      online: "線上",
      light: "輕度使用",
      heavy: "高強度",
      work: "辦公",
      calls: "通話",
      recommended: "推薦優先",
      durationLong: "長期優先",
      reset: "重置篩選",
      bestFor: "適合",
      resultCount: "個套餐",
      data: "流量",
      duration: "有效期",
      pickup: "交付方式",
      features: "套餐亮点",
      whyTitle: "適合遊客的通訊方案",
      why: ["機場、酒店或線上交付", "按天數和用量推薦套餐", "支援個人、家庭和團隊批量安排"],
      previous: "上一頁",
      next: "下一頁",
      page: "頁",
    },
    en: {
      eyebrow: "Vietnam Travel SIM / eSIM",
      title: "Stay connected as soon as you arrive",
      description: "We match SIM/eSIM plans by trip length, phone type, physical-card needs, and group size, with airport, hotel, or online delivery.",
      order: "Contact",
      browse: "View plans",
      searchLabel: "Quick search",
      searchPlaceholder: "Search eSIM, airport, group, unlimited...",
      kindLabel: "SIM type",
      durationLabel: "Trip length",
      deliveryLabel: "Delivery / setup",
      usageLabel: "Use case",
      sortLabel: "Sort",
      all: "All",
      physical: "Physical SIM",
      esim: "eSIM",
      unlimited: "Unlimited",
      short: "Short stay",
      standard: "15-30 days",
      long: "Long stay",
      group: "Group",
      airport: "Airport",
      hotel: "Hotel",
      online: "Online",
      light: "Light use",
      heavy: "Heavy use",
      work: "Work",
      calls: "Calls",
      recommended: "Recommended",
      durationLong: "Longest validity",
      reset: "Reset filters",
      bestFor: "Best for",
      resultCount: "plans",
      data: "Data",
      duration: "Validity",
      pickup: "Delivery",
      features: "Plan highlights",
      whyTitle: "Connectivity plans for travelers",
      why: ["Airport, hotel, or online delivery", "Plans matched by days and data use", "Solo, family, and group bundles supported"],
      previous: "Previous",
      next: "Next",
      page: "Page",
    },
  }[language];
  const kindFilters = [
    { key: "all", label: copy.all },
    { key: "physical", label: copy.physical },
    { key: "esim", label: copy.esim },
    { key: "unlimited", label: copy.unlimited },
  ];
  const durationFilters = [
    { key: "all", label: copy.all },
    { key: "short", label: copy.short },
    { key: "standard", label: copy.standard },
    { key: "long", label: copy.long },
    { key: "group", label: copy.group },
  ];
  const deliveryFilters = [
    { key: "all", label: copy.all },
    { key: "airport", label: copy.airport },
    { key: "hotel", label: copy.hotel },
    { key: "online", label: copy.online },
  ];
  const usageFilters = [
    { key: "all", label: copy.all },
    { key: "light", label: copy.light },
    { key: "heavy", label: copy.heavy },
    { key: "work", label: copy.work },
    { key: "calls", label: copy.calls },
    { key: "group", label: copy.group },
  ];
  const sortOptions = [
    { key: "recommended", label: copy.recommended },
    { key: "duration", label: copy.durationLong },
  ];
  const enrichedPlans = simPlans.map((plan, index) => {
    const searchable = normalize([
      plan.title.zh,
      plan.title.en,
      plan.data.zh,
      plan.data.en,
      plan.duration.zh,
      plan.duration.en,
      plan.pickup.zh,
      plan.pickup.en,
      plan.description.zh,
      plan.description.en,
      plan.features.zh.join(" "),
      plan.features.en.join(" "),
    ].join(" "));
    const deliveryTypes = [
      /機場|Airport/i.test(`${plan.pickup.zh} ${plan.pickup.en}`) ? "airport" : "",
      /酒店|Hotel|市區|city/i.test(`${plan.pickup.zh} ${plan.pickup.en}`) ? "hotel" : "",
      /線上|Online|QR|二維碼/i.test(`${plan.pickup.zh} ${plan.pickup.en}`) ? "online" : "",
    ].filter(Boolean);
    const usageTypes = [
      /輕度|short|light|city/i.test(searchable) ? "light" : "",
      /不限量|unlimited|熱點|hotspot|高強度|heavy|video/i.test(searchable) ? "heavy" : "",
      /辦公|work|business|會议/i.test(searchable) ? "work" : "",
      /通話|calls|local number/i.test(searchable) ? "calls" : "",
      /團隊|group|batch|family/i.test(searchable) ? "group" : "",
    ].filter(Boolean);
    const durationValue = Number(plan.duration.en.match(/\d+/g)?.at(-1) ?? 0);

    return { ...plan, deliveryTypes, durationValue, index, searchable, usageTypes };
  });
  const visiblePlans = enrichedPlans
    .filter((plan) => {
      const matchesQuery = !simQuery || plan.searchable.includes(normalize(simQuery));

      return (
        matchesQuery &&
        (activeKind === "all" || plan.kind === activeKind) &&
        (activeDuration === "all" || plan.durationType === activeDuration) &&
        (activeDelivery === "all" || plan.deliveryTypes.includes(activeDelivery)) &&
        (activeUsage === "all" || plan.usageTypes.includes(activeUsage))
      );
    })
    .sort((a, b) => {
      if (sortBy === "duration") {
        return b.durationValue - a.durationValue;
      }

      return a.index - b.index;
    });
  const pageSize = 4;
  const pageCount = Math.max(1, Math.ceil(visiblePlans.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const currentPlans = visiblePlans.slice(currentPage * pageSize, currentPage * pageSize + pageSize);
  const changePage = (direction: "prev" | "next") => {
    setPage((current) => {
      const safePage = Math.min(current, pageCount - 1);

      if (direction === "prev") {
        return safePage === 0 ? pageCount - 1 : safePage - 1;
      }

      return safePage === pageCount - 1 ? 0 : safePage + 1;
    });
  };

  return (
    <section className="mx-auto max-w-7xl">
      <div className="overflow-hidden rounded-lg bg-gradient-to-r from-[#04233d] via-[#063c64] to-[#088a9a] text-white shadow-xl">
        <div className="grid gap-8 px-5 py-10 md:px-8 lg:grid-cols-[1fr_360px] lg:py-14">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-black text-cyan-100">
              <Wifi className="h-4 w-4 text-[#7dd3fc]" />
              {copy.eyebrow}
            </p>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-normal md:text-5xl">{copy.title}</h1>
            <p className="mt-5 max-w-2xl text-base font-semibold leading-relaxed text-white/82">{copy.description}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={`/contact?service=${serviceId}`} className="inline-flex h-12 items-center rounded-md bg-[#7dd3fc] px-6 text-sm font-black text-[#04233d] transition hover:bg-[#bae6fd]">
                {copy.order} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a href="#sim-plans" className="inline-flex h-12 items-center rounded border border-white/45 px-6 text-sm font-black text-white transition hover:bg-white/10">
                {copy.browse}
              </a>
            </div>
          </div>
          <div className="grid gap-3 rounded-lg bg-white/12 p-4 backdrop-blur">
            {copy.why.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded bg-white/10 p-3">
                <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-[#7dd3fc]" />
                <p className="text-sm font-bold leading-relaxed text-white/88">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="sim-plans" className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase text-[#0284c7]">{copy.eyebrow}</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">{copy.whyTitle}</h2>
          </div>
          <div className="grid w-full gap-3 xl:w-[760px]">
            <div className="grid gap-3 lg:grid-cols-[1fr_220px_auto]">
              <label className="flex h-12 items-center gap-2 rounded-full bg-white px-4 shadow-sm">
                <Search className="h-4 w-4 shrink-0 text-[#0369a1]" />
                <span className="sr-only">{copy.searchLabel}</span>
                <input
                  value={simQuery}
                  onChange={(event) => {
                    setSimQuery(event.target.value);
                    setPage(0);
                  }}
                  placeholder={copy.searchPlaceholder}
                  className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400"
                />
              </label>
              <label className="flex h-12 items-center gap-2 rounded-full bg-white px-4 shadow-sm">
                <SlidersHorizontal className="h-4 w-4 shrink-0 text-[#0369a1]" />
                <span className="sr-only">{copy.sortLabel}</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm font-black text-slate-700 outline-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option.key} value={option.key}>{option.label}</option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={() => {
                  setSimQuery("");
                  setActiveKind("all");
                  setActiveDuration("all");
                  setActiveDelivery("all");
                  setActiveUsage("all");
                  setSortBy("recommended");
                  setPage(0);
                }}
                className="h-12 rounded-full border border-slate-200 bg-white px-4 text-sm font-black text-slate-600 shadow-sm transition hover:border-[#0369a1] hover:text-[#0369a1]"
              >
                {copy.reset}
              </button>
            </div>
            <div>
              <p className="mb-2 text-xs font-black uppercase text-slate-500">{copy.kindLabel}</p>
              <div className="flex max-w-full gap-2 overflow-x-auto rounded-full bg-white p-1 shadow-sm">
                {kindFilters.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => {
                      setActiveKind(filter.key);
                      setPage(0);
                    }}
                    className={`h-10 whitespace-nowrap rounded-full px-4 text-sm font-black transition ${
                      activeKind === filter.key ? "bg-[#0369a1] text-white" : "text-slate-600 hover:bg-sky-50 hover:text-[#0369a1]"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-black uppercase text-slate-500">{copy.durationLabel}</p>
              <div className="flex max-w-full gap-2 overflow-x-auto rounded-full bg-white p-1 shadow-sm">
                {durationFilters.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => {
                      setActiveDuration(filter.key);
                      setPage(0);
                    }}
                    className={`h-10 whitespace-nowrap rounded-full px-4 text-sm font-black transition ${
                      activeDuration === filter.key ? "bg-[#0369a1] text-white" : "text-slate-600 hover:bg-sky-50 hover:text-[#0369a1]"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-black uppercase text-slate-500">{copy.deliveryLabel}</p>
                <div className="flex max-w-full gap-2 overflow-x-auto rounded-full bg-white p-1 shadow-sm">
                  {deliveryFilters.map((filter) => (
                    <button
                      key={filter.key}
                      type="button"
                      onClick={() => {
                        setActiveDelivery(filter.key);
                        setPage(0);
                      }}
                      className={`h-9 whitespace-nowrap rounded-[3px] px-3 text-xs font-black transition sm:px-4 sm:text-sm ${
                        activeDelivery === filter.key ? "bg-[#0369a1] text-white" : "text-slate-600 hover:bg-sky-50 hover:text-[#0369a1]"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-black uppercase text-slate-500">{copy.usageLabel}</p>
                <div className="flex max-w-full gap-2 overflow-x-auto rounded-full bg-white p-1 shadow-sm">
                  {usageFilters.map((filter) => (
                    <button
                      key={filter.key}
                      type="button"
                      onClick={() => {
                        setActiveUsage(filter.key);
                        setPage(0);
                      }}
                      className={`h-10 whitespace-nowrap rounded-full px-4 text-sm font-black transition ${
                        activeUsage === filter.key ? "bg-[#0369a1] text-white" : "text-slate-600 hover:bg-sky-50 hover:text-[#0369a1]"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-right text-xs font-black uppercase text-[#0369a1]">{visiblePlans.length} {copy.resultCount}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {currentPlans.map((plan) => (
            <article key={plan.title.en} className="group overflow-hidden rounded-[4px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#0284c7] hover:shadow-md">
              <div className="border-b border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-3 sm:p-4">
                <div className="flex items-start justify-between gap-2 sm:gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] bg-[#0369a1] text-white shadow-sm sm:h-11 sm:w-11">
                    {plan.kind === "esim" ? <Wifi className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col items-end gap-2 text-right">
                    <span className="rounded-[3px] bg-white px-2 py-0.5 text-[10px] font-black uppercase text-[#0369a1] shadow-sm sm:text-xs">{plan.kind === "physical" ? copy.physical : plan.kind === "esim" ? copy.esim : copy.unlimited}</span>
                    <div className="hidden items-end gap-1 sm:flex">
                      {[2, 3, 4, 5].map((height) => (
                        <span key={height} className="w-1.5 rounded-full bg-[#0ea5e9]" style={{ height: `${height * 5}px` }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xs font-black uppercase text-[#0284c7]">{plan.pickup[language]}</p>
                  <h3 className="mt-2 line-clamp-2 min-h-[38px] text-sm font-black leading-tight text-slate-950 sm:text-base">{plan.title[language]}</h3>
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <p className="line-clamp-2 text-xs font-semibold leading-relaxed text-slate-600">{plan.description[language]}</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-[3px] bg-sky-50 p-2">
                    <p className="text-xs font-bold text-slate-500">{copy.data}</p>
                    <p className="mt-1 text-xs font-black text-[#0369a1] sm:text-sm">{plan.data[language]}</p>
                  </div>
                  <div className="rounded-[3px] bg-cyan-50 p-2">
                    <p className="text-xs font-bold text-slate-500">{copy.duration}</p>
                    <p className="mt-1 text-xs font-black text-[#0e7490] sm:text-sm">{plan.duration[language]}</p>
                  </div>
                </div>
                <div className="mt-3 hidden sm:block">
                  <p className="text-xs font-black uppercase text-slate-500">{copy.features}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {plan.features[language].slice(0, 2).map((feature) => (
                      <span key={feature} className="rounded-[3px] bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-700">{feature}</span>
                    ))}
                  </div>
                </div>
                <Link href={`/contact?service=${serviceId}&item=${slugify(plan.title.en)}`} className="mt-3 flex h-9 items-center justify-center rounded-[3px] bg-[#0369a1] px-2 text-xs font-black text-white transition hover:bg-[#075985] sm:px-4 sm:text-sm">
                  {copy.order}
                </Link>
                <Link href={`/services/${serviceId}/${slugify(plan.title.en)}`} className="mt-2 flex h-9 items-center justify-center rounded-[3px] border border-[#0369a1] px-2 text-xs font-black text-[#0369a1] transition hover:bg-sky-50 sm:px-4 sm:text-sm">
                  {language === "zh" ? "詳情" : "View details"}
                </Link>
              </div>
            </article>
          ))}
        </div>

        <ServicePagination
          currentPage={currentPage}
          nextLabel={copy.next}
          onNext={() => changePage("next")}
          onPageChange={setPage}
          onPrevious={() => changePage("prev")}
          pageCount={pageCount}
          pageLabel={copy.page}
          previousLabel={copy.previous}
          tone="sky"
        />
      </div>
    </section>
  );
}
