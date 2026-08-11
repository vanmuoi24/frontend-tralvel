"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Clock3, FileText, Luggage, MapPin, PlaneTakeoff, Search, ShieldCheck, Users } from "lucide-react";
import { airportTransferVehicles } from "@/data/airport-transfer";
import { useLanguage } from "@/providers/language-provider";
import { ServicePagination } from "@/components/services/service-pagination";

type AirportTransferListProps = {
  serviceId: string;
};

export function AirportTransferList({ serviceId }: AirportTransferListProps) {
  const { language } = useLanguage();
  const [activeCity, setActiveCity] = useState("nha-trang");
  const [page, setPage] = useState(0);
  const copy = {
    zh: {
      heroTitle: "機場接送",
      pickupTab: "機場接機",
      dropoffTab: "送客到機場",
      airportPlaceholder: "到達機場",
      destinationPlaceholder: "輸入目的地",
      passengers: "2 位乘客",
      search: "搜尋",
      title: "熱門機場接送",
      book: "聯繫",
      detail: "詳情",
      max: "最多",
      options: "選項：",
      meet: "機場接待",
      features: ["行李協助", "安静舒適"],
      reviewsTitle: "機場接送評價",
      comparisonTitle: "交通方式對比",
      comparisonNote: "比較機場接送、出租車/網约車和租車服務的主要差异。",
      vehicleCompareTitle: "車型對比",
      finalNote: "最终車型取决于接送當天車輛供應情況。",
      vehicleTableHeaders: ["車型", "乘客", "行李", "参考車型", "最適合"],
      comparisonHeaders: ["對比項目", "機場接送服務", "出租車/網约車", "租車"],
      previous: "上一頁",
      next: "下一頁",
      page: "頁",
    },
    en: {
      heroTitle: "Airport Transfer",
      pickupTab: "Airport Pickup",
      dropoffTab: "Airport Drop-off",
      airportPlaceholder: "Arrival airport",
      destinationPlaceholder: "Enter destination",
      passengers: "2 passengers",
      search: "Search",
      title: "Popular Airport Transfers",
      book: "Contact",
      detail: "View details",
      max: "Up to",
      options: "Options:",
      meet: "Airport meet and greet",
      features: ["Luggage support", "Quiet ride"],
      reviewsTitle: "Airport Transfer Reviews",
      comparisonTitle: "Transport Method Comparison",
      comparisonNote: "Compare airport transfer, taxi/ride-hailing, and car rental options.",
      vehicleCompareTitle: "Vehicle Type Comparison",
      finalNote: "Final vehicle type depends on availability at pickup.",
      vehicleTableHeaders: ["Vehicle type", "Passengers", "Luggage", "Example model", "Best for"],
      comparisonHeaders: ["Criteria", "Airport transfer", "Taxi/ride-hailing", "Car rental"],
      previous: "Previous",
      next: "Next",
      page: "Page",
    },
  }[language];
  const cities = [
    { key: "nha-trang", label: { zh: "Nha Trang", en: "Nha Trang" }, airport: "CXR" },
    { key: "da-nang", label: { zh: "峴港", en: "Da Nang" }, airport: "DAD" },
    { key: "ha-noi", label: { zh: "河內", en: "Hanoi" }, airport: "HAN" },
    { key: "hcmc", label: { zh: "胡志明市", en: "Ho Chi Minh City" }, airport: "SGN" },
    { key: "phu-quoc", label: { zh: "富國島", en: "Phu Quoc Island" }, airport: "PQC" },
  ];
  const activeCityData = cities.find((city) => city.key === activeCity) ?? cities[0];
  const pageSize = 4;
  const pageCount = Math.max(1, Math.ceil(airportTransferVehicles.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const currentVehicles = airportTransferVehicles.slice(currentPage * pageSize, currentPage * pageSize + pageSize);
  const changePage = (direction: "prev" | "next") => {
    setPage((current) => {
      const safePage = Math.min(current, pageCount - 1);

      if (direction === "prev") {
        return safePage === 0 ? pageCount - 1 : safePage - 1;
      }

      return safePage === pageCount - 1 ? 0 : safePage + 1;
    });
  };
  const reviews = [
    { user: "_TIVN******prnz1r", score: "5.0 / 5.0", text: { zh: "準時，驾驶安全。", en: "On time, safe driving." } },
    { user: "_TIVN******6elkc1", score: "5.0 / 5.0", text: { zh: "司機很好，也很熱心。", en: "Good and helpful driver." } },
  ];
  const comparisonRows = [
    { criteria: { zh: "提前確認", en: "Pre-confirmation" }, transfer: { zh: "出行前確認路線、接車時間和車型", en: "Route, pickup time, and vehicle type confirmed before travel" }, taxi: { zh: "取决于當時車輛供應", en: "Depends on current availability" }, rental: { zh: "需要自行取車並辦理手續", en: "Requires self pickup and rental paperwork" } },
    { criteria: { zh: "便利性", en: "Convenience" }, transfer: { zh: "点到点接送", en: "Door-to-door pickup" }, taxi: { zh: "随叫随到", en: "On demand" }, rental: { zh: "需要自驾和自行導航", en: "Self-drive and self-navigation" } },
    { criteria: { zh: "航班跟踪", en: "Flight tracking" }, transfer: { zh: "航班延誤時自動调整接機時間", en: "Pickup adjusted for delays" }, taxi: { zh: "需要自行通知司機", en: "You must notify the driver" }, rental: { zh: "自驾無需跟踪航班", en: "Not needed for self-drive" } },
    { criteria: { zh: "等待時間", en: "Waiting time" }, transfer: { zh: "航班延誤可享免費等待", en: "Free waiting time for flight delays" }, taxi: { zh: "5-10 分鐘後可能加收費用", en: "May charge after 5-10 minutes" }, rental: { zh: "-", en: "-" } },
    { criteria: { zh: "客戶支援", en: "Support" }, transfer: { zh: "24/7 多語言支援", en: "24/7 multilingual support" }, taxi: { zh: "本地支援有限", en: "Limited local support" }, rental: { zh: "租車柜臺按营业時間服務", en: "Rental desk during business hours" } },
  ];
  const vehicleRows = [
    { type: { zh: "经济型", en: "Economy" }, passengers: "最多 4", luggage: "最多 2", model: "Toyota Corolla", bestFor: { zh: "單人/情侶", en: "Solo/couples" } },
    { type: { zh: "SUV/小型厢車", en: "SUV/small van" }, passengers: "最多 4-6", luggage: "最多 4", model: "Toyota Innova", bestFor: { zh: "家庭/小團體", en: "Families/small groups" } },
    { type: { zh: "高級厢車", en: "Premium van" }, passengers: "最多 8", luggage: "最多 5", model: "Mercedes V-Class", bestFor: { zh: "商務/高端客人", en: "Business/luxury guests" } },
    { type: { zh: "小巴", en: "Minibus" }, passengers: "最多 9-14", luggage: "最多 6", model: "Toyota HiAce", bestFor: { zh: "多人團體", en: "Large groups" } },
  ];
  const guarantees = [
    { icon: Clock3, title: { zh: "司機遲到？我们為您處理補償。", en: "Driver late? We compensate you." }, text: { zh: "服務取消時提供協助", en: "Compensation for service cancellation" } },
    { icon: FileText, title: { zh: "未收到服務也可協助處理", en: "Compensation if service is not received" }, text: { zh: "包含司機遲到支援", en: "Late driver support included" } },
    { icon: ShieldCheck, title: { zh: "接車前 24 小時可免費取消", en: "Free cancellation 24 hours before pickup" }, text: { zh: "最多可在接客前 24 小時免費取消", en: "Cancel free up to 24 hours before pickup" } },
    { icon: PlaneTakeoff, title: { zh: "航班延誤？我们會等待。", en: "Flight delayed? We will wait." }, text: { zh: "我们會跟踪延誤並等待您", en: "We monitor delays and wait for you" } },
  ];

  return (
    <section className="mx-auto max-w-7xl bg-white text-slate-950">
      <div className="relative overflow-hidden rounded-[4px] bg-sky-500">
        <Image src="/anhnendichvudonkhachsanbay.png" alt={copy.heroTitle} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-700/92 via-sky-600/78 to-slate-900/25" />
        <div className="relative px-4 py-6 md:px-6 md:py-8">
          <h1 className="text-3xl font-black tracking-normal text-white drop-shadow-sm md:text-5xl">
            {copy.heroTitle} <span className="text-amber-400">.</span>
          </h1>
          <div className="mt-5 rounded-[4px] bg-white p-4 shadow-lg">
            <div className="flex flex-wrap gap-5 border-b border-slate-200 text-sm font-bold text-slate-950 md:text-base">
              <button type="button" className="border-b-2 border-blue-600 pb-2">{copy.pickupTab}</button>
              <button type="button" className="pb-2 font-semibold text-slate-700">{copy.dropoffTab}</button>
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-[1.1fr_1.1fr_0.9fr_170px]">
              <div className="flex h-12 items-center gap-3 rounded-[3px] border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-500">
                <PlaneTakeoff className="h-5 w-5 text-slate-700" />
                {copy.airportPlaceholder}
                <span className="ml-auto rounded-[3px] bg-white px-2 py-1 text-xs text-slate-700">{activeCityData.airport}</span>
              </div>
              <div className="flex h-12 items-center gap-3 rounded-[3px] border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-500">
                <ArrowRight className="h-5 w-5 text-slate-700" />
                <MapPin className="h-5 w-5 text-slate-700" />
                {copy.destinationPlaceholder}
              </div>
              <div className="flex h-12 items-center justify-between rounded-[3px] border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-800">
                <span className="inline-flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {copy.passengers}
                </span>
                <span className="text-xl leading-none">⌄</span>
              </div>
              <Link href={`/contact?service=${serviceId}&city=${activeCity}`} className="flex h-12 items-center justify-center gap-2 rounded-[3px] bg-blue-600 px-4 text-sm font-black text-white transition hover:bg-blue-700">
                <Search className="h-5 w-5" />
                {copy.search}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="px-0 pb-8 pt-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title.en} className="rounded-[4px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-[3px] bg-blue-50 text-blue-600">
                  <Icon className="h-5 w-5" strokeWidth={2.8} />
                </div>
                <h2 className="mt-3 line-clamp-2 text-sm font-black leading-5 text-slate-950">{item.title[language]}</h2>
                <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-slate-500">{item.text[language]}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-black tracking-normal text-slate-950">{copy.title}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {cities.map((city) => (
              <button
                key={city.key}
                type="button"
                onClick={() => {
                  setActiveCity(city.key);
                  setPage(0);
                }}
                className={`h-9 rounded-[3px] border px-4 text-sm font-bold transition ${
                  activeCity === city.key ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                {city.label[language]}
              </button>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {currentVehicles.map((vehicle) => (
              <article key={vehicle.slug} className="overflow-hidden rounded-[4px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-600 hover:shadow-md">
                <div className="relative aspect-[4/2.35] overflow-hidden bg-slate-100">
                  <Image src={vehicle.image} alt={vehicle.name[language]} fill className="object-cover transition duration-700 hover:scale-[1.03]" style={{ objectPosition: vehicle.imagePosition }} sizes="(min-width: 1024px) 25vw, 50vw" />
                </div>
                <div className="flex flex-1 flex-col p-3 sm:p-4">
                  <h3 className="line-clamp-2 min-h-[38px] text-sm font-black leading-tight text-slate-950 sm:text-base">{vehicle.name[language]}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700">
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-blue-600" />
                      {copy.max} {vehicle.seats}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Luggage className="h-3.5 w-3.5 text-blue-600" />
                      {vehicle.bags}
                    </span>
                  </div>
                  <div className="mt-3 hidden space-y-1 text-xs font-semibold leading-5 text-slate-500 sm:block">
                    {copy.features.slice(0, 2).map((feature) => (
                      <p key={feature}>{feature}</p>
                    ))}
                    <p className="line-clamp-1">{typeof vehicle.badge === "string" ? vehicle.badge : vehicle.badge[language]}</p>
                  </div>
                  <div className="mt-auto grid grid-cols-1 gap-2 pt-3 sm:grid-cols-2">
                  <Link href={`/contact?service=${serviceId}&city=${activeCity}&vehicle=${vehicle.slug}`} className="inline-flex h-9 items-center justify-center rounded-[3px] bg-blue-600 px-2 text-xs font-black text-white transition hover:bg-blue-700 sm:px-4 sm:text-sm">
                    {copy.book}
                  </Link>
                  <Link href={`/services/${serviceId}/${vehicle.slug}`} className="inline-flex h-9 items-center justify-center rounded-[3px] border border-blue-600 px-2 text-xs font-black text-blue-600 transition hover:bg-blue-50 sm:px-4 sm:text-sm">
                    {copy.detail}
                  </Link>
                  </div>
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

        <div className="mt-8 grid gap-5 lg:grid-cols-[320px_1fr]">
          <section className="rounded-[4px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">{copy.reviewsTitle}</h2>
            <div className="mt-4 space-y-3">
              {reviews.map((review) => (
                <article key={review.user} className="rounded-[3px] bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-500">{review.user}</p>
                  <p className="mt-1 text-lg font-black text-slate-950">{review.score}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">{review.text[language]}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[4px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">{copy.comparisonTitle}</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-950">
                    {copy.comparisonHeaders.map((header) => (
                      <th key={header} className="px-4 py-3 font-black">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.criteria.en} className="border-b border-slate-100 last:border-b-0">
                      <td className="px-4 py-3 font-black text-slate-950">{row.criteria[language]}</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">✓ {row.transfer[language]}</td>
                      <td className="px-4 py-3 font-semibold text-slate-600">{row.taxi[language]}</td>
                      <td className="px-4 py-3 font-semibold text-slate-600">{row.rental[language]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-500">{copy.comparisonNote}</p>
          </section>
        </div>

        <section className="mt-6 rounded-[4px] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">{copy.vehicleCompareTitle}</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-950">
                  {copy.vehicleTableHeaders.map((header) => (
                    <th key={header} className="px-4 py-3 font-black">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vehicleRows.map((row) => (
                  <tr key={row.model} className="border-b border-slate-100 last:border-b-0">
                    <td className="px-4 py-3 font-black text-slate-950">{row.type[language]}</td>
                    <td className="px-4 py-3 font-semibold text-slate-700">{row.passengers}</td>
                    <td className="px-4 py-3 font-semibold text-slate-700">{row.luggage}</td>
                    <td className="px-4 py-3 font-semibold text-slate-700">{row.model}</td>
                    <td className="px-4 py-3 font-semibold text-slate-700">{row.bestFor[language]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-500">{copy.finalNote}</p>
        </section>
      </div>
    </section>
  );
}
