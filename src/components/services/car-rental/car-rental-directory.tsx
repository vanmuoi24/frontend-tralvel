"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Car, Check, Luggage, MapPin, ShieldCheck, Users } from "lucide-react";
import { carRentalPosts } from "@/data/car-rental";
import { useLanguage } from "@/providers/language-provider";
import { ServicePagination } from "@/components/services/service-pagination";

type CarRentalDirectoryProps = {
  serviceId: string;
};

export function CarRentalDirectory({ serviceId }: CarRentalDirectoryProps) {
  const { language } = useLanguage();
  const [activeType, setActiveType] = useState("all");
  const [page, setPage] = useState(0);
  const copy = {
    zh: {
      title: "租車車型",
      contact: "聯繫",
      details: "詳情",
      found: "{count} 個車型",
      filters: "篩選",
      vehicleType: "車型",
      infoNote: "選擇車型後，我们會根據人數、行李和行程確認適合車輛。",
      previous: "上一頁",
      next: "下一頁",
      page: "頁",
      categories: [
        { key: "all", label: "全部車型" },
        { key: "sedan", label: "轿車" },
        { key: "suv", label: "SUV" },
        { key: "minivan", label: "商務 MPV" },
        { key: "premium", label: "高端車型" },
      ],
    },
    en: {
      title: "Rental Vehicles",
      contact: "Contact",
      details: "View details",
      found: "{count} vehicle options",
      filters: "Filters",
      vehicleType: "Vehicle type",
      infoNote: "Choose a vehicle type and we will confirm the right option by guests, luggage, and itinerary.",
      previous: "Previous",
      next: "Next",
      page: "Page",
      categories: [
        { key: "all", label: "All vehicles" },
        { key: "sedan", label: "Sedan" },
        { key: "suv", label: "SUV" },
        { key: "minivan", label: "Minivan" },
        { key: "premium", label: "Premium" },
      ],
    },
  }[language];
  const currentPosts = carRentalPosts.filter((post) => activeType === "all" || post.typeKey === activeType);
  const pageSize = 4;
  const pageCount = Math.max(1, Math.ceil(currentPosts.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const pagedPosts = currentPosts.slice(currentPage * pageSize, currentPage * pageSize + pageSize);
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
      <div className="mb-5 flex flex-col gap-2 border-b border-slate-200 pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-normal text-slate-950 md:text-3xl">{copy.title}</h2>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-600">{copy.infoNote}</p>
        </div>
        <p className="text-sm font-semibold text-slate-500">{copy.found.replace("{count}", String(currentPosts.length))}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <aside className="h-fit rounded-lg border border-slate-200 bg-white lg:sticky lg:top-28">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-lg font-bold text-slate-950">{copy.filters}</h2>
          </div>
          <div className="p-5">
            <p className="mb-3 text-sm font-bold text-slate-950">{copy.vehicleType}</p>
            <div className="space-y-2">
              {copy.categories.map((category) => (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => {
                    setActiveType(category.key);
                    setPage(0);
                  }}
                  className={`flex h-10 w-full items-center justify-between rounded-md px-3 text-left text-sm font-semibold transition ${
                    activeType === category.key ? "bg-blue-600 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <span>{category.label}</span>
                  {activeType === category.key ? <Check className="h-4 w-4" /> : null}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-5 overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="flex overflow-x-auto">
              {copy.categories.map((category) => {
                const preview = carRentalPosts.find((post) => category.key === "all" || post.typeKey === category.key) ?? carRentalPosts[0];
                return (
                  <button
                    key={category.key}
                    type="button"
                    onClick={() => {
                      setActiveType(category.key);
                      setPage(0);
                    }}
                    className={`min-w-[155px] border-r border-slate-200 px-4 py-3 text-center transition last:border-r-0 ${
                      activeType === category.key ? "bg-slate-100 text-slate-950" : "bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <p className="truncate text-sm font-semibold">{category.label}</p>
                    <div className="relative mx-auto mt-2 h-14 w-28">
                      <Image src={preview.image} alt={category.label} fill className="object-cover object-bottom" sizes="112px" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:block md:space-y-5">
            {pagedPosts.map((post) => (
              <article key={post.title.en} className="grid gap-3 rounded-lg border border-slate-200 bg-white p-3 md:grid-cols-[220px_1fr_160px] md:items-center md:gap-5 md:p-5">
                <div>
                  <div className="relative h-24 overflow-hidden rounded-lg bg-slate-50 sm:h-32">
                    <Image src={post.image} alt={post.title[language]} fill className="object-cover object-bottom" sizes="(min-width: 768px) 210px, 50vw" />
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="line-clamp-2 text-sm font-bold leading-tight text-slate-950 sm:text-xl md:text-2xl">{post.title[language]}</h3>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 sm:px-3 sm:py-1 sm:text-xs">{post.type[language]}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600 sm:gap-4 sm:text-sm">
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      {post.seats}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Luggage className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      {post.luggage}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Car className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      {post.transmission[language]}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 flex items-start gap-1.5 text-xs font-semibold text-slate-700 sm:gap-2 sm:text-sm">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500 sm:h-4 sm:w-4" />
                    {post.pickup[language]}
                  </p>
                  <div className="mt-4 hidden border-t border-slate-200 pt-4 sm:block">
                    <p className="text-sm font-semibold text-slate-600">
                      <ShieldCheck className="mr-2 inline h-4 w-4 text-emerald-600" />
                      {language === "zh" ? "客服將確認車輛與行程安排" : "Our team will confirm vehicle availability and itinerary"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 md:flex md:justify-end">
                  <Link href={`/contact?service=${serviceId}&item=${post.slug}`} className="inline-flex h-9 w-full items-center justify-center rounded-md border border-slate-950 bg-white px-2 text-xs font-semibold text-slate-950 transition hover:bg-slate-50 sm:h-11 sm:w-auto sm:px-5 sm:text-sm">
                    {copy.contact}
                  </Link>
                  <Link href={`/services/${serviceId}/${post.slug}`} className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-[3px] bg-blue-600 px-2 text-xs font-semibold text-white transition hover:bg-blue-700 sm:h-11 sm:w-auto sm:gap-2 sm:px-5 sm:text-sm">
                    {copy.details}
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
        </div>
      </div>
    </section>
  );
}
