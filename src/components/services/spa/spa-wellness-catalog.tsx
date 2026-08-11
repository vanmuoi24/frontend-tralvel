"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Flower2, Sparkles } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { slugify } from "@/lib/slugify";
import { ServicePagination } from "@/components/services/service-pagination";

const spaPackages = [
  {
    image: "/spa1.jpeg",
    title: { zh: "足部舒缓按摩", en: "Foot Relief Massage" },
    category: { zh: "足療", en: "Foot therapy" },
    duration: "60 min",
    description: {
      zh: "適合逛街、飞行後放鬆腿部，包含足底、肩颈和熱毛巾護理。",
      en: "Ideal after flights or city walks, with foot pressure work, neck relief, and warm towel care.",
    },
    highlights: { zh: ["酒店附近推薦", "可安排雙人房", "適合當天預约"], en: ["Near-hotel options", "Couple rooms available", "Same-day booking"] },
  },
  {
    image: "/spa2.jpeg",
    title: { zh: "全身精油按摩", en: "Aroma Body Massage" },
    category: { zh: "全身按摩", en: "Body massage" },
    duration: "90 min",
    description: {
      zh: "舒缓肩颈、背部和腰腿疲劳，適合旅行中需要深度放鬆的客人。",
      en: "Relieves shoulder, back, and leg fatigue for travelers who want deeper relaxation.",
    },
    highlights: { zh: ["精油護理", "安静包間", "可選力度"], en: ["Aroma oils", "Quiet private rooms", "Pressure choice"] },
  },
  {
    image: "/spa3.jpeg",
    title: { zh: "熱石深層護理", en: "Hot Stone Deep Care" },
    category: { zh: "深層放鬆", en: "Deep relaxation" },
    duration: "120 min",
    description: {
      zh: "熱石配合全身護理，適合長途飞行、商務行程後的恢復。",
      en: "Hot stone therapy with full-body care, suited for recovery after long flights or business days.",
    },
    highlights: { zh: ["熱石護理", "高級門店", "適合贵賓"], en: ["Hot stone care", "Premium venues", "VIP friendly"] },
  },
  {
    image: "/spa4.jpeg",
    title: { zh: "雙人情侶套餐", en: "Couple Spa Package" },
    category: { zh: "雙人套餐", en: "Couple package" },
    duration: "100 min",
    description: {
      zh: "雙人同房護理，可搭配精油、足療或輕面部護理，適合情侶和朋友。",
      en: "Shared room treatment with aroma, foot therapy, or light facial care for couples and friends.",
    },
    highlights: { zh: ["雙人房", "套餐組合", "可提前訂位"], en: ["Couple room", "Flexible bundle", "Advance booking"] },
  },
  {
    image: "/spa5.jpeg",
    title: { zh: "越式草本護理", en: "Vietnamese Herbal Ritual" },
    category: { zh: "特色護理", en: "Signature ritual" },
    duration: "120 min",
    description: {
      zh: "融合草本熱敷、身體按摩和放鬆護理，體驗更有越南特色。",
      en: "A Vietnamese-inspired ritual with herbal compress, body massage, and calming care.",
    },
    highlights: { zh: ["草本熱敷", "特色體驗", "適合遊客"], en: ["Herbal compress", "Local signature", "Traveler favorite"] },
  },
  {
    image: "/spa6.jpeg",
    title: { zh: "面部补水護理", en: "Hydrating Facial Care" },
    category: { zh: "面部護理", en: "Facial care" },
    duration: "75 min",
    description: {
      zh: "清潔、补水和舒缓肌肤，適合晒後、熬夜或行程密集的客人。",
      en: "Cleanses, hydrates, and calms skin after sun exposure, late nights, or packed schedules.",
    },
    highlights: { zh: ["补水舒缓", "晒後護理", "輕鬆恢復"], en: ["Hydrating care", "After-sun support", "Easy recovery"] },
  },
];

export function SpaWellnessCatalog({ serviceId }: { serviceId: string }) {
  const { language } = useLanguage();
  const [activeType, setActiveType] = useState("all");
  const [page, setPage] = useState(0);
  const copy = {
    zh: {
      eyebrow: "SPA 水療與按摩",
      title: "旅行中的放鬆護理，一站安排好",
      description: "從足療、全身按摩、熱石護理到雙人套餐，我们按區域、預算和時間幫你推薦合適門店。",
      book: "聯繫",
      view: "查看套餐",
      duration: "時長",
      includes: "包含亮点",
      all: "全部",
      foot: "足療",
      body: "全身按摩",
      premium: "高級護理",
      couple: "雙人套餐",
      whyTitle: "為什么通過 An Khai Travel 預约",
      why: ["按酒店位置推薦附近門店", "提前確認價格、時長和房型", "支援個人、情侶和團隊預约"],
      previous: "上一頁",
      next: "下一頁",
      page: "頁",
    },
    en: {
      eyebrow: "Spa, Wellness, and Massage",
      title: "Relaxing treatments arranged around your trip",
      description: "From foot therapy and body massage to hot stone care and couple packages, we match venues by area, budget, and timing.",
      book: "Contact",
      view: "View packages",
      duration: "Duration",
      includes: "Highlights",
      all: "All",
      foot: "Foot",
      body: "Body massage",
      premium: "Premium care",
      couple: "Couple package",
      whyTitle: "Why book with An Khai Travel",
      why: ["Nearby venues matched to your hotel", "Duration and room type checked in advance", "Bookings for solo guests, couples, and groups"],
      previous: "Previous",
      next: "Next",
      page: "Page",
    },
  }[language];
  const filters = [
    { key: "all", label: copy.all },
    { key: "foot", label: copy.foot },
    { key: "body", label: copy.body },
    { key: "premium", label: copy.premium },
    { key: "couple", label: copy.couple },
  ];
  const packageTypes = ["foot", "body", "premium", "couple", "premium", "body"];
  const visiblePackages = spaPackages.filter((_, index) => activeType === "all" || packageTypes[index] === activeType);
  const pageSize = 4;
  const pageCount = Math.max(1, Math.ceil(visiblePackages.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const currentPackages = visiblePackages.slice(currentPage * pageSize, currentPage * pageSize + pageSize);
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
      <div className="relative overflow-hidden rounded-lg bg-[#11251f] text-white shadow-xl">
        <div className="absolute inset-0">
          <Image src="/spa5.jpeg" alt={copy.title} fill className="object-cover opacity-55" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d211b]/95 via-[#0d211b]/70 to-[#6d2d4b]/35" />
        </div>
        <div className="relative grid gap-8 px-5 py-10 md:px-8 lg:grid-cols-[1fr_360px] lg:py-14">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-black text-emerald-100">
              <Sparkles className="h-4 w-4 text-[#f7d88a]" />
              {copy.eyebrow}
            </p>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-normal md:text-5xl">{copy.title}</h1>
            <p className="mt-5 max-w-2xl text-base font-semibold leading-relaxed text-white/82">{copy.description}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={`/contact?service=${serviceId}`} className="inline-flex h-12 items-center rounded-md bg-[#f7d88a] px-6 text-sm font-black text-[#17251e] transition hover:bg-[#ffe6a6]">
                {copy.book} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a href="#spa-packages" className="inline-flex h-12 items-center rounded border border-white/45 px-6 text-sm font-black text-white transition hover:bg-white/10">
                {copy.view}
              </a>
            </div>
          </div>
          <div className="grid gap-3 rounded-lg bg-white/12 p-4 backdrop-blur">
            {copy.why.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded bg-white/10 p-3">
                <Flower2 className="mt-0.5 h-5 w-5 shrink-0 text-[#f7d88a]" />
                <p className="text-sm font-bold leading-relaxed text-white/88">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="spa-packages" className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase text-[#b0567d]">{copy.eyebrow}</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">{copy.whyTitle}</h2>
          </div>
          <div className="flex max-w-full gap-2 overflow-x-auto rounded-[4px] bg-white p-1 shadow-sm">
            {filters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={() => {
                  setActiveType(filter.key);
                  setPage(0);
                }}
                className={`h-9 whitespace-nowrap rounded-[3px] px-3 text-xs font-black transition sm:px-4 sm:text-sm ${
                  activeType === filter.key ? "bg-[#143d32] text-white" : "text-slate-600 hover:bg-emerald-50 hover:text-[#143d32]"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {currentPackages.map((item) => (
            <article key={item.title.en} className="group overflow-hidden rounded-[4px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#b0567d] hover:shadow-md">
              <div className="relative aspect-[4/2.35] overflow-hidden">
                <Image src={item.image} alt={item.title[language]} fill className="object-cover transition duration-700 group-hover:scale-[1.03]" sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 50vw" />
                <div className="absolute left-2 top-2 rounded-[3px] bg-white/95 px-2 py-0.5 text-[10px] font-black text-[#143d32] shadow sm:text-xs">{item.category[language]}</div>
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="line-clamp-2 min-h-[38px] text-sm font-black leading-tight text-slate-950 sm:text-base">{item.title[language]}</h3>
                <p className="mt-2 line-clamp-2 text-xs font-semibold leading-relaxed text-slate-600">{item.description[language]}</p>
                <div className="mt-3 grid gap-2">
                  <div className="rounded-[3px] bg-emerald-50 p-2">
                    <p className="text-xs font-bold text-slate-500">{copy.duration}</p>
                    <p className="mt-0.5 text-xs font-black text-[#143d32] sm:text-sm">{item.duration}</p>
                  </div>
                </div>
                <div className="mt-3 hidden sm:block">
                  <p className="text-xs font-black uppercase text-slate-500">{copy.includes}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.highlights[language].slice(0, 2).map((highlight) => (
                      <span key={highlight} className="rounded-[3px] bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-700">{highlight}</span>
                    ))}
                  </div>
                </div>
                <Link href={`/contact?service=${serviceId}&item=${slugify(item.title.en)}`} className="mt-3 flex h-9 items-center justify-center rounded-[3px] bg-[#143d32] px-2 text-xs font-black text-white transition hover:bg-[#0f2f27] sm:px-4 sm:text-sm">
                  {copy.book}
                </Link>
                <Link href={`/services/${serviceId}/${slugify(item.title.en)}`} className="mt-2 flex h-9 items-center justify-center rounded-[3px] border border-[#143d32] px-2 text-xs font-black text-[#143d32] transition hover:bg-emerald-50 sm:px-4 sm:text-sm">
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
          tone="emerald"
        />
      </div>
    </section>
  );
}
