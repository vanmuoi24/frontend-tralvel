"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check, Clock3, MapPin, Search, Users } from "lucide-react";
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

export function KtvHotspots({ serviceId }: { serviceId: string }) {
  const { language } = useLanguage();
  const [activeType, setActiveType] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const copy = {
    zh: {
      eyebrow: "KTV 與娛樂預约",
      title: "選擇適合團隊的 KTV 房型",
      subtitle: "按人數、區域和時間推薦包廂，客服會先確認空房與安排。",
      search: "搜尋名稱、區域或房型...",
      all: "全部",
      privateRoom: "私人包廂",
      groupRoom: "團隊包廂",
      lounge: "KTV Lounge",
      massage: "按摩放鬆",
      hours: "营业時間",
      recommended: "適合人數",
      includes: "服務说明",
      cta: "聯繫諮詢",
      result: "{count} 個可選項目",
      pax: "人",
      emptyTitle: "沒有找到合適項目",
      emptyText: "试试更換關鍵词或分類。",
      previous: "上一頁",
      next: "下一頁",
      page: "頁",
    },
    en: {
      eyebrow: "KTV and Entertainment Booking",
      title: "Choose a KTV Room for Your Group",
      subtitle: "We match rooms by group size, area, and time, then confirm availability before booking.",
      search: "Search name, area, or room type...",
      all: "All",
      privateRoom: "Private room",
      groupRoom: "Group room",
      lounge: "KTV lounge",
      massage: "Massage",
      hours: "Hours",
      recommended: "Best for",
      includes: "Service notes",
      cta: "Contact us",
      result: "{count} options",
      pax: "Pax",
      emptyTitle: "No matching option",
      emptyText: "Try another keyword or category.",
      previous: "Previous",
      next: "Next",
      page: "Page",
    },
  }[language];
  const venues = [
    {
      image: "/kara1.jpeg",
      name: "Supreme KTV",
      typeKey: "private",
      category: { zh: "私人包廂", en: "Private room" },
      place: { zh: "胡志明市中心", en: "Central Ho Chi Minh City" },
      time: "17:00 - 02:00",
      pax: "3-6",
      bullets: { zh: ["適合小團體", "可提前確認包廂", "飲品套餐可諮詢"], en: ["Good for small groups", "Room availability confirmed first", "Drink packages by request"] },
    },
    {
      image: "/kara2.jpeg",
      name: "Velvet Room",
      typeKey: "private",
      category: { zh: "私人包廂", en: "Private room" },
      place: { zh: "第一區 / 酒店附近", en: "District 1 / near hotels" },
      time: "18:00 - 01:00",
      pax: "2-8",
      bullets: { zh: ["環境安静", "適合商務接待", "可安排預訂"], en: ["Quiet setting", "Good for hosting", "Advance booking available"] },
    },
    {
      image: "/kara3.jpeg",
      name: "Pub 28",
      typeKey: "lounge",
      category: { zh: "KTV Lounge", en: "KTV lounge" },
      place: { zh: "市中心娛樂區", en: "Central nightlife area" },
      time: "17:00 - 03:00",
      pax: "3-6",
      bullets: { zh: ["唱歌與飲品", "適合朋友聚會", "位置方便"], en: ["Karaoke and drinks", "Good for friends", "Convenient area"] },
    },
    {
      image: "/kara4.jpeg",
      name: "Iconic KTV",
      typeKey: "group",
      category: { zh: "團隊包廂", en: "Group room" },
      place: { zh: "第三區", en: "District 3" },
      time: "16:00 - Late",
      pax: "4-10",
      bullets: { zh: ["音響設備好", "適合團隊", "可諮詢飲品套餐"], en: ["Good sound system", "Fits groups", "Drink packages by request"] },
    },
    {
      image: "/kara5.jpeg",
      name: "Galaxy Karaoke",
      typeKey: "group",
      category: { zh: "團隊包廂", en: "Group room" },
      place: { zh: "第一區", en: "District 1" },
      time: "18:00 - 02:00",
      pax: "4-8",
      bullets: { zh: ["適合朋友聚會", "房型選擇多", "可提前訂位"], en: ["Great for friend groups", "Multiple room sizes", "Advance booking"] },
    },
    {
      image: "/kara6.jpeg",
      name: "Relax Massage",
      typeKey: "massage",
      category: { zh: "按摩放鬆", en: "Massage" },
      place: { zh: "酒店附近", en: "Near hotel" },
      time: "12:00 - 23:00",
      pax: "1-4",
      bullets: { zh: ["足部 / 全身可選", "按區域推薦", "先確認時段"], en: ["Foot or body options", "Matched by area", "Time slot confirmed first"] },
    },
    {
      image: "/kara7.jpeg",
      name: "Moonlight KTV",
      typeKey: "lounge",
      category: { zh: "KTV Lounge", en: "KTV lounge" },
      place: { zh: "阮惠街附近", en: "Near Nguyen Hue" },
      time: "7 PM - Late",
      pax: "5-10",
      bullets: { zh: ["氣氛活跃", "團隊首選", "適合續摊"], en: ["Lively atmosphere", "Group friendly", "Good after-dinner option"] },
    },
    {
      image: "/kara8.jpeg",
      name: "Neon Club",
      typeKey: "lounge",
      category: { zh: "Pub & KTV", en: "Pub and KTV" },
      place: { zh: "裴援街", en: "Bui Vien" },
      time: "18:00 - 04:00",
      pax: "2-6",
      bullets: { zh: ["位置熱鬧", "飲品選擇多", "適合小團體"], en: ["Busy central location", "Many drink options", "Small group friendly"] },
    },
  ];
  const types = [
    { key: "all", label: copy.all },
    { key: "private", label: copy.privateRoom },
    { key: "group", label: copy.groupRoom },
    { key: "lounge", label: copy.lounge },
    { key: "massage", label: copy.massage },
  ];
  const normalizedQuery = normalize(query);
  const visibleVenues = venues.filter((venue) => {
    const text = normalize([
      venue.name,
      venue.category.zh,
      venue.category.en,
      venue.place.zh,
      venue.place.en,
      venue.time,
      venue.pax,
      venue.bullets.zh.join(" "),
      venue.bullets.en.join(" "),
    ].join(" "));
    return (activeType === "all" || venue.typeKey === activeType) && (!normalizedQuery || text.includes(normalizedQuery));
  });
  const pageSize = 4;
  const pageCount = Math.max(1, Math.ceil(visibleVenues.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const currentVenues = visibleVenues.slice(currentPage * pageSize, currentPage * pageSize + pageSize);
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
    <section className="mx-auto max-w-7xl bg-white text-slate-950">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="grid gap-5 p-5 md:grid-cols-[1fr_360px] md:items-center">
          <div>
            <p className="text-sm font-semibold text-[#7c3aed]">{copy.eyebrow}</p>
            <h1 className="mt-2 text-2xl font-bold tracking-normal text-slate-950 md:text-4xl">{copy.title}</h1>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-600">{copy.subtitle}</p>
          </div>
          <div className="relative h-44 overflow-hidden rounded-lg bg-slate-100">
            <Image src="/anhnenkaraok.png" alt={copy.title} fill priority className="object-cover" sizes="360px" />
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <label className="flex h-11 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 transition focus-within:border-[#7c3aed] focus-within:ring-2 focus-within:ring-violet-100">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(0);
              }}
              placeholder={copy.search}
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <button
                key={type.key}
                type="button"
                onClick={() => {
                  setActiveType(type.key);
                  setPage(0);
                }}
                className={`h-10 rounded-lg px-4 text-sm font-semibold transition ${
                  activeType === type.key ? "bg-blue-600 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-3 text-sm font-semibold text-slate-500">{copy.result.replace("{count}", String(visibleVenues.length))}</p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
        {currentVenues.map((venue) => (
          <article key={venue.name} className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
            <div className="relative h-28 overflow-hidden bg-slate-100 sm:h-44">
              <Image src={venue.image} alt={venue.name} fill className="object-cover" sizes="(min-width: 1280px) 25vw, 50vw" />
            </div>
            <div className="p-3 sm:p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#7c3aed]">{venue.category[language]}</p>
              <h2 className="mt-2 line-clamp-2 text-sm font-bold text-slate-950 sm:text-xl">{venue.name}</h2>
              <div className="mt-3 space-y-1.5 text-xs font-medium text-slate-600 sm:mt-4 sm:space-y-2 sm:text-sm">
                <p className="line-clamp-1 flex items-center gap-1.5 sm:gap-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400 sm:h-4 sm:w-4" />
                  {venue.place[language]}
                </p>
                <p className="flex items-center gap-1.5 sm:gap-2">
                  <Clock3 className="h-3.5 w-3.5 text-slate-400 sm:h-4 sm:w-4" />
                  {venue.time}
                </p>
                <p className="flex items-center gap-1.5 sm:gap-2">
                  <Users className="h-3.5 w-3.5 text-slate-400 sm:h-4 sm:w-4" />
                  {copy.recommended}: {venue.pax} {copy.pax}
                </p>
              </div>
              <div className="mt-4 hidden border-t border-slate-200 pt-4 sm:block">
                <p className="mb-2 text-sm font-semibold text-slate-950">{copy.includes}</p>
                <div className="grid gap-1.5">
                  {venue.bullets[language].map((item) => (
                    <p key={item} className="flex items-start gap-2 text-xs font-medium leading-5 text-slate-600">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
              <Link href={`/contact?service=${serviceId}&item=${slugify(venue.name)}`} className="mt-4 flex h-9 items-center justify-center rounded-[3px] bg-blue-600 px-2 text-xs font-semibold text-white transition hover:bg-blue-700 sm:h-10 sm:text-sm">
                {copy.cta}
              </Link>
              <Link href={`/services/${serviceId}/${slugify(venue.name)}`} className="mt-3 flex h-9 items-center justify-center rounded-md border border-slate-950 px-2 text-xs font-semibold text-slate-950 transition hover:bg-slate-50 sm:h-10 sm:text-sm">
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
        tone="blue"
      />

      {visibleVenues.length === 0 ? (
        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-lg font-bold text-slate-950">{copy.emptyTitle}</p>
          <p className="mt-2 text-sm font-medium text-slate-500">{copy.emptyText}</p>
        </div>
      ) : null}
    </section>
  );
}
