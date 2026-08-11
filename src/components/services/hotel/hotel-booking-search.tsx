"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BadgeCheck, MapPin, Search, SlidersHorizontal, Star } from "lucide-react";
import type { IServiceCatalogItem } from "@/types/TypeService";
import { useLanguage } from "@/providers/language-provider";
import { ServicePagination } from "@/components/services/service-pagination";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

type HotelResult = {
  slug: string;
  image: string;
  name: string;
  stars?: number;
  area: { zh: string; en: string };
  distance: { zh: string; en: string };
  room: { zh: string; en: string };
  amenities: { zh: string[]; en: string[] };
  perks: { zh: string[]; en: string[] };
  score: string;
  scoreLabel: { zh: string; en: string };
  reviews: { zh: string; en: string };
  badge: { zh: string; en: string };
  filterText: string;
};

function hotelField(item: IServiceCatalogItem, labels: string[]) {
  const fields = item.translation?.fields ?? [];
  const normalizedLabels = labels.map((label) => normalize(label));
  const found = fields.find((field) => normalizedLabels.includes(normalize(String(field.label ?? ""))));
  return String(found?.value ?? "");
}

function hotelContent(item: IServiceCatalogItem, key: string) {
  const value = item.translation?.content?.[key];
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

function listFromText(value: string) {
  return value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function backendHotelToResult(item: IServiceCatalogItem): HotelResult {
  const location = item.translation?.location || hotelField(item, ["Khu vực", "Area", "區域"]) || String(item.tags?.area ?? item.attributes?.area ?? "");
  const distance = hotelField(item, ["Khoảng cách", "Distance", "距離"]);
  const room = item.translation?.type || hotelField(item, ["Loại phòng", "Room type", "房型"]);
  const starsText = String(item.tags?.tier ?? item.attributes?.tier ?? hotelField(item, ["Hạng sao", "Stars", "星級"]));
  const stars = Number.parseInt(starsText.match(/\d+/)?.[0] ?? "0", 10);
  const amenities = listFromText(hotelField(item, ["Tiện ích", "Amenities", "設施"]));
  const perks = listFromText(hotelField(item, ["Ưu đãi", "Perks", "優惠"]));
  const score = hotelContent(item, "score") || hotelField(item, ["Điểm đánh giá", "Score", "評分"]) || "9,0";
  const reviews = hotelContent(item, "reviews") || hotelField(item, ["Số review", "Reviews", "評價數"]) || (item.translation?.content?.scoreLabel ? String(item.translation.content.scoreLabel) : "");
  const badge = item.translation?.badge || hotelField(item, ["Badge"]) || "";
  const filterText = [
    item.slug,
    item.translation?.title,
    location,
    distance,
    room,
    starsText,
    badge,
    item.translation?.description,
    Object.values(item.tags ?? {}).join(" "),
    Object.values(item.attributes ?? {}).join(" "),
  ].join(" ");

  return {
    slug: item.slug,
    image: item.imageUrl || item.gallery?.[0] || "/anhnenhotel.png",
    name: item.translation?.title || item.slug,
    stars,
    area: { zh: location, en: location },
    distance: { zh: distance, en: distance },
    room: { zh: room, en: room },
    amenities: { zh: amenities, en: amenities },
    perks: { zh: perks, en: perks },
    score,
    scoreLabel: { zh: hotelContent(item, "scoreLabel"), en: hotelContent(item, "scoreLabel") },
    reviews: { zh: reviews, en: reviews },
    badge: { zh: badge, en: badge },
    filterText,
  };
}

export function HotelBookingSearch({ catalogItems = [], serviceId }: { catalogItems?: IServiceCatalogItem[]; serviceId: string }) {
  const { language } = useLanguage();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "center" | "airport" | "high-rating" | "four-star" | "hostel">("all");
  const [activeLocation, setActiveLocation] = useState("all");
  const [page, setPage] = useState(0);
  const copy = {
    zh: {
      contactNow: "聯繫",
      detail: "詳情",
      title: "推薦酒店列表",
      subtitle: "可按酒店名稱、地址或住宿需求快速篩選。",
      search: "搜尋酒店或地址...",
      location: "地點",
      allLocations: "所有地點",
      all: "全部",
      center: "靠近市中心",
      airport: "靠近機場",
      highRating: "評分 8.5+",
      fourStar: "4-5 sao",
      hostel: "Hostel",
      result: "{count} 家酒店匹配",
      emptyTitle: "未找到匹配酒店",
      emptyText: "請嘗试更換關鍵词或選擇其他篩選条件。",
      previous: "上一頁",
      next: "下一頁",
      page: "頁",
    },
    en: {
      contactNow: "Contact",
      detail: "View details",
      title: "Recommended Hotel List",
      subtitle: "Search by hotel name, address, or filter by stay preference.",
      search: "Search hotel or address...",
      location: "Location",
      allLocations: "All locations",
      all: "All",
      center: "Near center",
      airport: "Near airport",
      highRating: "Rating 8.5+",
      fourStar: "4-5 stars",
      hostel: "Hostel",
      result: "{count} matching hotels",
      emptyTitle: "No matching hotel found",
      emptyText: "Try another keyword or filter.",
      previous: "Previous",
      next: "Next",
      page: "Page",
    },
  }[language];
  const filterItems = [
    { key: "all", label: copy.all },
    { key: "center", label: copy.center },
    { key: "airport", label: copy.airport },
    { key: "high-rating", label: copy.highRating },
    { key: "four-star", label: copy.fourStar },
    { key: "hostel", label: copy.hostel },
  ] as const;
  const pageSize = 4;

  const hotels = useMemo(() => {
    const backendHotels = catalogItems.filter((item) => item.active !== false).map(backendHotelToResult);
    return backendHotels;
  }, [catalogItems]);
  const locationOptions = useMemo(() => {
    const values = new Set<string>();
    hotels.forEach((hotel) => {
      const address = hotel.area[language] || hotel.area.en;
      const location = address.split(",").slice(-1)[0]?.trim() || address.split(",")[0]?.trim();
      if (location) values.add(location);
    });
    return Array.from(values);
  }, [hotels, language]);

  const visibleHotels = useMemo(() => {
    const normalizedQuery = normalize(query);

    return hotels.filter((hotel) => {
      const text = normalize([
        hotel.name,
        hotel.area.zh,
        hotel.area.en,
        hotel.distance.zh,
        hotel.distance.en,
        hotel.badge.zh,
        hotel.badge.en,
        hotel.filterText,
      ].join(" "));
      const matchesSearch = !normalizedQuery || text.includes(normalizedQuery);
      const matchesLocation = activeLocation === "all" || text.includes(normalize(activeLocation));
      const score = Number.parseFloat(hotel.score.replace(",", ".")) || 0;
      const distance = Number.parseFloat((hotel.distance.en || hotel.distance.zh).match(/[\d.]+/)?.[0] ?? "999");
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "center" && distance <= 2.5) ||
        (activeFilter === "airport" && text.includes("airport")) ||
        (activeFilter === "high-rating" && score >= 8.5) ||
        (activeFilter === "four-star" && (hotel.stars ?? 0) >= 4) ||
        (activeFilter === "hostel" && text.includes("hostel"));

      return matchesSearch && matchesLocation && matchesFilter;
    });
  }, [activeFilter, activeLocation, hotels, query]);
  const pageCount = Math.max(1, Math.ceil(visibleHotels.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const currentHotels = visibleHotels.slice(currentPage * pageSize, currentPage * pageSize + pageSize);
  const goToPage = (nextPage: number) => setPage(Math.max(0, Math.min(nextPage, pageCount - 1)));
  const resetPage = () => setPage(0);

  return (
    <section className="relative mx-auto max-w-7xl py-2">
      <div className="mb-5 border border-slate-200 bg-white p-4 text-slate-950 shadow-sm">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#193cb8]">Hotel stays</p>
            <h1 className="text-2xl font-black tracking-normal text-slate-950 md:text-3xl">{copy.title}</h1>
            <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">{copy.subtitle}</p>
          </div>
          <div className="text-sm font-black text-slate-600">{copy.result.replace("{count}", String(visibleHotels.length))}</div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_220px_180px]">
          <label className="flex h-11 items-center gap-3 rounded-[3px] border border-slate-200 bg-slate-50 px-4 transition focus-within:border-[#193cb8] focus-within:bg-white">
            <Search className="h-4 w-4 shrink-0 text-[#193cb8]" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                resetPage();
              }}
              placeholder={copy.search}
              className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-950 outline-none placeholder:text-slate-500"
            />
          </label>
          <label className="flex h-11 items-center gap-2 rounded-[3px] border border-slate-200 bg-slate-50 px-3 transition focus-within:border-[#193cb8] focus-within:bg-white">
            <MapPin className="h-4 w-4 text-[#193cb8]" />
            <span className="sr-only">{copy.location}</span>
            <select
              value={activeLocation}
              onChange={(event) => {
                setActiveLocation(event.target.value);
                resetPage();
              }}
              className="min-w-0 flex-1 bg-transparent text-sm font-black text-slate-950 outline-none"
            >
              <option value="all">{copy.allLocations}</option>
              {locationOptions.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </label>
          <label className="flex h-11 items-center gap-2 rounded-[3px] border border-slate-200 bg-slate-50 px-3 transition focus-within:border-[#193cb8] focus-within:bg-white">
            <SlidersHorizontal className="h-4 w-4 text-[#193cb8]" />
            <span className="sr-only">Filter</span>
            <select
              value={activeFilter}
              onChange={(event) => {
                setActiveFilter(event.target.value as typeof activeFilter);
                resetPage();
              }}
              className="min-w-0 flex-1 bg-transparent text-sm font-black text-slate-950 outline-none"
            >
              {filterItems.map((filter) => (
                <option key={filter.key} value={filter.key}>
                  {filter.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="relative">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {currentHotels.map((hotel) => (
            <article
              key={hotel.slug + hotel.name}
              className="group flex min-h-[280px] flex-col overflow-hidden rounded-[4px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#193cb8] hover:shadow-md dark:border-slate-600 dark:bg-slate-800 dark:shadow-none dark:hover:border-blue-300"
            >
              <div className="relative">
                <div className="relative aspect-[4/2.45] w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
                  <Link href={`/services/${serviceId}/${hotel.slug}`} className="block h-full w-full">
                    <Image
                      src={hotel.image || "/anh1.png"}
                      alt={hotel.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                    />
                  </Link>
                </div>
                {(hotel.score || hotel.reviews[language] || hotel.reviews.en) ? (
                  <div className="absolute bottom-2 left-2 flex items-center overflow-hidden rounded-[3px] border border-[#193cb8] bg-white shadow-sm">
                    <span className="bg-[#193cb8] px-2 py-1 text-xs font-black text-white">{hotel.score}</span>
                    <span className="px-2 py-1 text-xs font-black text-[#193cb8]">{hotel.scoreLabel[language] || hotel.reviews[language] || hotel.reviews.en || "Good"}</span>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col p-3 sm:p-4">
                <Link href={`/services/${serviceId}/${hotel.slug}`} className="transition-colors group-hover:text-[#193cb8] dark:group-hover:text-blue-300">
                  <h3 className="line-clamp-2 min-h-[38px] text-sm font-black leading-tight tracking-normal text-slate-950 sm:text-base dark:text-white">
                    {hotel.name}
                    {hotel.stars && hotel.stars > 0 ? (
                      <span className="ml-1.5 inline-flex items-center gap-0.5 align-baseline text-[#ffb000]">
                        {Array.from({ length: hotel.stars }).map((_, i) => (
                          <Star key={i} className="inline h-3 w-3 shrink-0 fill-[#ffb000] text-[#ffb000]" />
                        ))}
                      </span>
                    ) : null}
                  </h3>
                </Link>

                <div className="mt-2 min-h-[46px]">
                  <p className="line-clamp-2 text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-200">
                    <MapPin className="mr-1 inline h-3.5 w-3.5 text-[#193cb8]" />
                    {hotel.area[language] || hotel.area.en}
                    {(hotel.distance[language] || hotel.distance.en) ? (
                      <span> | {hotel.distance[language] || hotel.distance.en}</span>
                    ) : null}
                  </p>
                </div>

                {(hotel.room[language] || hotel.room.en || hotel.badge[language] || hotel.badge.en) ? (
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                    <BadgeCheck className="h-3.5 w-3.5 shrink-0" />
                    <span className="line-clamp-1">{hotel.room[language] || hotel.room.en || hotel.badge[language] || hotel.badge.en}</span>
                  </div>
                ) : null}

                <div className="mt-auto grid grid-cols-1 gap-2 pt-3 sm:grid-cols-2">
                  <Link href={`/contact?service=${serviceId}&item=${hotel.slug}`} className="flex h-9 items-center justify-center rounded-[3px] border border-[#193cb8] px-2 text-xs font-black text-[#193cb8] transition hover:bg-sky-50 dark:border-blue-400/70 dark:text-blue-300 dark:hover:bg-blue-950/40">
                    {copy.contactNow}
                  </Link>
                  <Link href={`/services/${serviceId}/${hotel.slug}`} className="flex h-9 items-center justify-center rounded-[3px] bg-[#193cb8] px-2 text-xs font-black text-white transition hover:bg-[#122e90]">
                    {copy.detail}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>

      {visibleHotels.length > 0 ? (
        <ServicePagination
          currentPage={currentPage}
          pageCount={pageCount}
          previousLabel={copy.previous}
          nextLabel={copy.next}
          pageLabel={copy.page}
          tone="blue"
          onPageChange={goToPage}
          onPrevious={() => goToPage(currentPage - 1)}
          onNext={() => goToPage(currentPage + 1)}
        />
      ) : null}

      {visibleHotels.length === 0 && (
        <div className="mt-6 rounded-[4px] border border-slate-200 bg-white p-8 text-center text-slate-950 shadow-sm">
          <p className="text-lg font-black">{copy.emptyTitle}</p>
          <p className="mt-2 text-sm text-slate-600">{copy.emptyText}</p>
        </div>
      )}
    </section>
  );
}
