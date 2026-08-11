"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CalendarDays, Globe2, MapPin, MessageCircle, Users } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { slugify } from "@/lib/slugify";
import { ServicePagination } from "@/components/services/service-pagination";

type TourGuideListProps = {
  serviceId: string;
};

const tourGuideOptions = [
  {
    image: "/anh1.png",
    title: { zh: "半日中文導遊", en: "Half-day Chinese Guide" },
    location: { zh: "胡志明市 / 河內", en: "Ho Chi Minh City / Hanoi" },
    duration: { zh: "4 小時", en: "4 hours" },
    guests: { zh: "私人 / 小團", en: "Private / small group" },
    note: { zh: "適合城市观光、商務接待和輕鬆行程。", en: "Good for city visits, business hosting, and easy itineraries." },
  },
  {
    image: "/anh3.png",
    title: { zh: "一日導遊服務", en: "Full-day Guide Service" },
    location: { zh: "主要城市", en: "Major cities" },
    duration: { zh: "8 小時", en: "8 hours" },
    guests: { zh: "家庭 / 團隊", en: "Family / group" },
    note: { zh: "按景點、餐廳、購物或會议行程安排。", en: "Arranged around attractions, dining, shopping, or meeting schedules." },
  },
  {
    image: "/anh4.png",
    title: { zh: "私人定製旅遊", en: "Private Custom Tour" },
    location: { zh: "按行程安排", en: "By itinerary" },
    duration: { zh: "1 天起", en: "From 1 day" },
    guests: { zh: "車 + 導遊", en: "Car + guide" },
    note: { zh: "可搭配車輛、機場接送和酒店安排。", en: "Can be combined with vehicle, airport transfer, and hotel plans." },
  },
];

export function TourGuideList({ serviceId }: TourGuideListProps) {
  const { language } = useLanguage();
  const [page, setPage] = useState(0);
  const copy = {
    zh: {
      eyebrow: "導遊服務",
      title: "中文 / 英文導遊安排",
      subtitle: "根據人數、語言和路線安排合適導遊，先確認需求後报價。",
      contact: "聯繫",
      language: "語言支援",
      languageValue: "中文 / English",
      previous: "上一頁",
      next: "下一頁",
      page: "頁",
    },
    en: {
      eyebrow: "Tour Guide",
      title: "Chinese / English Guide Service",
      subtitle: "We arrange a suitable guide by group size, language, and route, then confirm the quote.",
      contact: "Contact",
      language: "Language",
      languageValue: "Chinese / English",
      previous: "Previous",
      next: "Next",
      page: "Page",
    },
  }[language];
  const pageSize = 4;
  const pageCount = Math.max(1, Math.ceil(tourGuideOptions.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const currentOptions = tourGuideOptions.slice(currentPage * pageSize, currentPage * pageSize + pageSize);
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
      <div className="rounded-[4px] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <p className="text-xs font-black uppercase tracking-wide text-blue-600">{copy.eyebrow}</p>
        <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-normal text-slate-950 md:text-3xl">{copy.title}</h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-600">{copy.subtitle}</p>
          </div>
          <div className="rounded-[3px] bg-blue-50 px-4 py-3 text-sm font-black text-blue-700">
            {copy.language}: {copy.languageValue}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {currentOptions.map((option) => (
          <article key={option.title.en} className="overflow-hidden rounded-[4px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-600 hover:shadow-md">
            <div className="relative aspect-[4/2.35] bg-slate-100">
              <Image src={option.image} alt={option.title[language]} fill className="object-cover transition duration-700 hover:scale-[1.03]" sizes="(min-width: 768px) 33vw, 50vw" />
            </div>
            <div className="p-3 sm:p-4">
              <h2 className="line-clamp-2 min-h-[38px] text-sm font-black leading-tight text-slate-950 sm:text-base">{option.title[language]}</h2>
              <div className="mt-2 space-y-1.5 text-xs font-semibold text-slate-600 sm:text-sm">
                <p className="line-clamp-1 flex items-center gap-1.5 sm:gap-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-600 sm:h-4 sm:w-4" />
                  {option.location[language]}
                </p>
                <p className="flex items-center gap-1.5 sm:gap-2">
                  <CalendarDays className="h-3.5 w-3.5 text-blue-600 sm:h-4 sm:w-4" />
                  {option.duration[language]}
                </p>
                <p className="flex items-center gap-1.5 sm:gap-2">
                  <Users className="h-3.5 w-3.5 text-blue-600 sm:h-4 sm:w-4" />
                  {option.guests[language]}
                </p>
                <p className="hidden items-start gap-2 leading-5 sm:flex">
                  <Globe2 className="mt-1 h-4 w-4 shrink-0 text-blue-600" />
                  {option.note[language]}
                </p>
              </div>
              <Link href={`/contact?service=${serviceId}&item=${slugify(option.title.en)}`} className="mt-3 flex h-9 items-center justify-center gap-1.5 rounded-[3px] bg-blue-600 px-2 text-xs font-black text-white transition hover:bg-blue-700 sm:gap-2 sm:text-sm">
                <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {copy.contact}
              </Link>
              <Link href={`/services/${serviceId}/${slugify(option.title.en)}`} className="mt-2 flex h-9 items-center justify-center rounded-[3px] border border-blue-600 px-2 text-xs font-black text-blue-600 transition hover:bg-blue-50 sm:text-sm">
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
    </section>
  );
}
