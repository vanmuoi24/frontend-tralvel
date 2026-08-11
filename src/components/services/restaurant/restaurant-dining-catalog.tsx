"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChefHat, MapPin, Star, Utensils, Wine } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { slugify } from "@/lib/slugify";
import { ServicePagination } from "@/components/services/service-pagination";

const restaurantVenues = [
  {
    image: "/anh3.png",
    city: "saigon",
    type: "vietnamese",
    name: { zh: "西贡越南風味餐廳", en: "Saigon Local Taste" },
    area: { zh: "第 1 郡 · 市中心", en: "District 1 · Downtown" },
    cuisine: { zh: "越南菜", en: "Vietnamese cuisine" },
    rating: "4.8",
    description: {
      zh: "適合第一次来越南的客人，经典越南菜、春卷、河粉和團隊套餐都可安排。",
      en: "Great for first-time visitors, with classic Vietnamese dishes, spring rolls, pho, and group menus.",
    },
    tags: { zh: ["本地味道", "團隊訂位", "中文協助"], en: ["Local taste", "Group booking", "Chinese support"] },
  },
  {
    image: "/anh2.png",
    city: "danang",
    type: "seafood",
    name: { zh: "峴港滨海海鲜餐廳", en: "Da Nang Coastal Seafood" },
    area: { zh: "美溪海滩 / 海邊", en: "My Khe Beach / seaside" },
    cuisine: { zh: "海鲜", en: "Seafood" },
    rating: "4.7",
    description: {
      zh: "適合家庭和團隊，海鲜套餐、包廂、大桌和接待菜單可提前確認。",
      en: "Ideal for families and groups, with seafood sets, private rooms, large tables, and hosted menus.",
    },
    tags: { zh: ["海鲜套餐", "包廂", "大桌"], en: ["Seafood sets", "Private room", "Large tables"] },
  },
  {
    image: "/nhahang3.jpeg",
    city: "hanoi",
    type: "fine",
    name: { zh: "河內高端商務晚餐", en: "Hanoi Premium Business Dinner" },
    area: { zh: "還剑湖 / 西湖", en: "Hoan Kiem / West Lake" },
    cuisine: { zh: "高端菜單", en: "Fine dining" },
    rating: "4.9",
    description: {
      zh: "適合商務接待、贵賓晚餐和纪念日，可安排安静座位、酒水和專屬菜單。",
      en: "For business hosting, VIP dinners, and anniversaries with quiet seating, drinks, and curated menus.",
    },
    tags: { zh: ["商務接待", "安静座位", "高級體驗"], en: ["Business hosting", "Quiet seating", "Premium experience"] },
  },
  {
    image: "/nhahang4.jpeg",
    city: "saigon",
    type: "hotpot",
    name: { zh: "火锅烧烤聚餐", en: "Hotpot and Grill Gathering" },
    area: { zh: "第 3 郡 / 第 7 郡", en: "District 3 / District 7" },
    cuisine: { zh: "火锅烧烤", en: "Hotpot and grill" },
    rating: "4.6",
    description: {
      zh: "適合朋友聚會和團隊晚餐，可選火锅、烧烤、飲品套餐和半私密座位。",
      en: "Good for friends and teams with hotpot, grill, drink bundles, and semi-private seating.",
    },
    tags: { zh: ["聚餐", "飲品套餐", "熱鬧氛圍"], en: ["Group meal", "Drink bundle", "Lively mood"] },
  },
  {
    image: "/nhahang5.jpeg",
    city: "dalat",
    type: "vietnamese",
    name: { zh: "大叻家庭越南菜套餐", en: "Da Lat Family Vietnamese Set" },
    area: { zh: "春香湖 / 夜市附近", en: "Xuan Huong Lake / Night Market" },
    cuisine: { zh: "家庭餐", en: "Family meal" },
    rating: "4.7",
    description: {
      zh: "按酒店位置推薦方便餐廳，適合老人、小孩和輕鬆用餐的家庭行程。",
      en: "Matched by hotel location, suitable for families with kids, seniors, and relaxed meal plans.",
    },
    tags: { zh: ["適合家庭", "酒店附近", "口味温和"], en: ["Family friendly", "Near hotel", "Mild flavors"] },
  },
  {
    image: "/nhahang6.jpeg",
    city: "saigon",
    type: "fine",
    name: { zh: "屋頂景观餐廳", en: "Rooftop View Restaurant" },
    area: { zh: "阮惠 / 西贡河", en: "Nguyen Hue / Saigon River" },
    cuisine: { zh: "景观晚餐", en: "View dinner" },
    rating: "4.8",
    description: {
      zh: "適合生日、约會和贵賓接待，可提前確認窗邊位或露臺位。",
      en: "Great for birthdays, dates, and VIP hosting with window or terrace seating checked ahead.",
    },
    tags: { zh: ["夜景", "生日", "露臺位"], en: ["Night view", "Birthday", "Terrace seats"] },
  },
  {
    image: "/nhahang7.jpeg",
    city: "phuquoc",
    type: "seafood",
    name: { zh: "富國島團體海鲜包廂", en: "Phu Quoc Seafood Private Room" },
    area: { zh: "阳東 / 海滩區", en: "Duong Dong / Beach area" },
    cuisine: { zh: "海鲜包廂", en: "Seafood private room" },
    rating: "4.7",
    description: {
      zh: "適合 8-20 人團隊，菜單、預算、上菜時間和包廂可提前確認。",
      en: "For 8-20 guests, with menu, budget, serving time, and room setup confirmed in advance.",
    },
    tags: { zh: ["8-20 人", "預算確認", "包廂"], en: ["8-20 guests", "Budget checked", "Private room"] },
  },
  {
    image: "/nhahang8.jpeg",
    city: "saigon",
    type: "hotpot",
    name: { zh: "深夜小吃與啤酒", en: "Late-night Bites and Beer" },
    area: { zh: "碧文街 / 市中心", en: "Bui Vien / Downtown" },
    cuisine: { zh: "小吃啤酒", en: "Bites and beer" },
    rating: "4.5",
    description: {
      zh: "適合夜遊後續摊，輕鬆小吃、啤酒和熱鬧氛圍，可按人數推薦。",
      en: "A relaxed after-hours option with snacks, beer, and lively venues matched by group size.",
    },
    tags: { zh: ["夜宵", "啤酒", "輕鬆"], en: ["Late night", "Beer", "Casual"] },
  },
  {
    image: "/nhahang1.jpeg",
    city: "danang",
    type: "vietnamese",
    name: { zh: "峴港本地越南菜", en: "Da Nang Local Vietnamese Table" },
    area: { zh: "韩江 / 市中心", en: "Han River / Downtown" },
    cuisine: { zh: "越南菜", en: "Vietnamese cuisine" },
    rating: "4.6",
    description: {
      zh: "適合家庭和小團體，提供中部特色菜、海鲜小炒和舒適座位。",
      en: "Good for families and small groups, with Central Vietnam dishes, seafood stir-fries, and comfortable seating.",
    },
    tags: { zh: ["中部特色", "靠近韩江", "家庭友好"], en: ["Central flavors", "Near Han River", "Family friendly"] },
  },
  {
    image: "/nhahang2.jpeg",
    city: "hanoi",
    type: "vietnamese",
    name: { zh: "河內老城特色餐廳", en: "Hanoi Old Quarter Specialties" },
    area: { zh: "老城區 / 還剑湖", en: "Old Quarter / Hoan Kiem" },
    cuisine: { zh: "北部越南菜", en: "Northern Vietnamese" },
    rating: "4.7",
    description: {
      zh: "適合想體驗河內風味的客人，可安排本地菜、米粉、烤肉和團隊菜單。",
      en: "For guests who want Hanoi flavors, with local dishes, noodles, grilled pork, and group menus.",
    },
    tags: { zh: ["老城區", "北部風味", "團隊菜單"], en: ["Old Quarter", "Northern taste", "Group menu"] },
  },
  {
    image: "/nhahang3.jpeg",
    city: "dalat",
    type: "hotpot",
    name: { zh: "大叻暖心火锅", en: "Da Lat Warm Hotpot" },
    area: { zh: "夜市 / 山景區", en: "Night Market / Hill view" },
    cuisine: { zh: "火锅", en: "Hotpot" },
    rating: "4.6",
    description: {
      zh: "大叻天氣凉爽，適合安排火锅、烧烤和朋友聚餐，可按人數訂位。",
      en: "Da Lat’s cool weather is perfect for hotpot, grill, and group dinners matched by guest count.",
    },
    tags: { zh: ["大叻夜市", "火锅", "朋友聚餐"], en: ["Da Lat night market", "Hotpot", "Friends dinner"] },
  },
  {
    image: "/nhahang4.jpeg",
    city: "phuquoc",
    type: "fine",
    name: { zh: "富國島海景晚餐", en: "Phu Quoc Ocean View Dinner" },
    area: { zh: "長滩 / 度假區", en: "Long Beach / Resort area" },
    cuisine: { zh: "海景餐廳", en: "Ocean-view dining" },
    rating: "4.8",
    description: {
      zh: "適合情侶、家庭和贵賓晚餐，可提前確認海景位、日落時間和套餐。",
      en: "For couples, families, and VIP dinners with ocean-view seats, sunset timing, and set menus confirmed.",
    },
    tags: { zh: ["海景", "日落", "度假晚餐"], en: ["Ocean view", "Sunset", "Resort dinner"] },
  },
];

export function RestaurantDiningCatalog({ serviceId }: { serviceId: string }) {
  const { language } = useLanguage();
  const [activeType, setActiveType] = useState("all");
  const [activeCity, setActiveCity] = useState("all");
  const [page, setPage] = useState(0);
  const copy = {
    zh: {
      eyebrow: "餐廳推薦與訂位",
      title: "從本地美食到商務晚餐，都幫你訂好",
      description: "按人數、預算、口味、酒店位置和用餐場景推薦餐廳，提前確認菜單、座位和價格。",
      reserve: "聯繫",
      explore: "查看餐廳",
      all: "全部",
      vietnamese: "越南菜",
      seafood: "海鲜",
      fine: "高端餐廳",
      hotpot: "火锅烧烤",
      cityLabel: "選擇區域",
      typeLabel: "選擇餐廳類型",
      saigon: "西贡",
      danang: "峴港",
      hanoi: "河內",
      dalat: "大叻",
      phuquoc: "富國島",
      area: "區域",
      cuisine: "類型",
      from: "人均 / 套餐",
      highlights: "推薦亮点",
      whyTitle: "適合這些用餐場景",
      why: ["家庭和團隊用餐", "商務接待與贵賓晚餐", "海鲜、火锅、本地特色餐"],
      previous: "上一頁",
      next: "下一頁",
      page: "頁",
    },
    en: {
      eyebrow: "Restaurant Picks and Reservations",
      title: "Local meals, seafood tables, and business dinners arranged",
      description: "We recommend restaurants by group size, budget, taste, hotel area, and dining occasion, then confirm menus, seats, and pricing.",
      reserve: "Contact",
      explore: "Explore restaurants",
      all: "All",
      vietnamese: "Vietnamese",
      seafood: "Seafood",
      fine: "Fine dining",
      hotpot: "Hotpot and grill",
      cityLabel: "Choose area",
      typeLabel: "Choose restaurant type",
      saigon: "Saigon",
      danang: "Da Nang",
      hanoi: "Hanoi",
      dalat: "Da Lat",
      phuquoc: "Phu Quoc",
      area: "Area",
      cuisine: "Cuisine",
      from: "Per person / set",
      highlights: "Highlights",
      whyTitle: "Good for these dining moments",
      why: ["Family and group meals", "Business hosting and VIP dinners", "Seafood, hotpot, and local specialties"],
      previous: "Previous",
      next: "Next",
      page: "Page",
    },
  }[language];
  const filters = [
    { key: "all", label: copy.all },
    { key: "vietnamese", label: copy.vietnamese },
    { key: "seafood", label: copy.seafood },
    { key: "fine", label: copy.fine },
    { key: "hotpot", label: copy.hotpot },
  ];
  const cityFilters = [
    { key: "all", label: copy.all },
    { key: "saigon", label: copy.saigon },
    { key: "danang", label: copy.danang },
    { key: "hanoi", label: copy.hanoi },
    { key: "dalat", label: copy.dalat },
    { key: "phuquoc", label: copy.phuquoc },
  ];
  const visibleVenues = restaurantVenues.filter((venue) => (activeType === "all" || venue.type === activeType) && (activeCity === "all" || venue.city === activeCity));
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
    <section className="mx-auto max-w-7xl">
      <div className="grid overflow-hidden rounded-lg bg-[#2b1710] text-white shadow-xl lg:grid-cols-[1fr_430px]">
        <div className="px-5 py-10 md:px-8 lg:py-14">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-[#ffd28a]">
            <Utensils className="h-4 w-4" />
            {copy.eyebrow}
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-normal md:text-5xl">{copy.title}</h1>
          <p className="mt-5 max-w-2xl text-base font-semibold leading-relaxed text-white/78">{copy.description}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={`/contact?service=${serviceId}`} className="inline-flex h-12 items-center rounded-md bg-[#ffb347] px-6 text-sm font-black text-[#2b1710] transition hover:bg-[#ffd28a]">
              {copy.reserve} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <a href="#restaurant-list" className="inline-flex h-12 items-center rounded border border-white/40 px-6 text-sm font-black text-white transition hover:bg-white/10">
              {copy.explore}
            </a>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {copy.why.map((item) => (
              <div key={item} className="rounded bg-white/10 p-4">
                <ChefHat className="h-5 w-5 text-[#ffb347]" />
                <p className="mt-3 text-sm font-bold leading-relaxed text-white/85">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative min-h-[360px]">
          <Image src="/nhahang7.jpeg" alt={copy.title} fill className="object-cover" priority sizes="430px" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2b1710] via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 rounded bg-white/92 p-4 text-slate-950 shadow-xl">
            <div className="flex items-center gap-3">
              <Wine className="h-8 w-8 text-[#b45309]" />
              <div>
                <p className="text-sm font-black text-[#b45309]">{copy.eyebrow}</p>
                <p className="text-xs font-bold text-slate-600">{copy.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="restaurant-list" className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase text-[#b45309]">{copy.eyebrow}</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">{copy.whyTitle}</h2>
          </div>
          <div className="grid w-full gap-3 xl:w-auto">
            <div>
              <p className="mb-2 text-xs font-black uppercase text-slate-500">{copy.cityLabel}</p>
              <div className="flex max-w-full gap-2 overflow-x-auto rounded-full bg-white p-1 shadow-sm">
                {cityFilters.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => {
                      setActiveCity(filter.key);
                      setPage(0);
                    }}
                    className={`h-9 whitespace-nowrap rounded-[3px] px-3 text-xs font-black transition sm:px-4 sm:text-sm ${
                      activeCity === filter.key ? "bg-[#7c2d12] text-white" : "text-slate-600 hover:bg-orange-50 hover:text-[#7c2d12]"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-black uppercase text-slate-500">{copy.typeLabel}</p>
              <div className="flex max-w-full gap-2 overflow-x-auto rounded-full bg-white p-1 shadow-sm">
                {filters.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => {
                      setActiveType(filter.key);
                      setPage(0);
                    }}
                    className={`h-10 whitespace-nowrap rounded-full px-4 text-sm font-black transition ${
                      activeType === filter.key ? "bg-[#7c2d12] text-white" : "text-slate-600 hover:bg-orange-50 hover:text-[#7c2d12]"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {currentVenues.map((venue) => (
            <article key={venue.name.en} className="group overflow-hidden rounded-[4px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#b45309] hover:shadow-md">
              <div className="relative aspect-[4/2.35] overflow-hidden">
                <Image src={venue.image} alt={venue.name[language]} fill className="object-cover transition duration-700 group-hover:scale-[1.03]" sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 50vw" />
                <div className="absolute left-2 top-2 rounded-[3px] bg-white/95 px-2 py-0.5 text-[10px] font-black text-[#7c2d12] shadow sm:text-xs">{venue.cuisine[language]}</div>
                <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-[3px] bg-[#2b1710]/90 px-2 py-0.5 text-[10px] font-black text-[#ffd28a] sm:text-xs">
                  <Star className="h-3.5 w-3.5 fill-[#ffd28a]" />
                  {venue.rating}
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="line-clamp-2 min-h-[38px] text-sm font-black leading-tight text-slate-950 sm:text-base">{venue.name[language]}</h3>
                <div className="mt-2 grid gap-1.5 text-xs font-semibold text-slate-600 sm:text-sm">
                  <p className="line-clamp-1 flex items-center gap-1.5 sm:gap-2"><MapPin className="h-3.5 w-3.5 shrink-0 text-[#b45309] sm:h-4 sm:w-4" /> {copy.area}: {venue.area[language]}</p>
                  <p className="line-clamp-1 flex items-center gap-1.5 sm:gap-2"><Utensils className="h-3.5 w-3.5 shrink-0 text-[#b45309] sm:h-4 sm:w-4" /> {copy.cuisine}: {venue.cuisine[language]}</p>
                </div>
                <p className="mt-2 line-clamp-2 text-xs font-semibold leading-relaxed text-slate-600">{venue.description[language]}</p>
                <div className="mt-3 hidden sm:block">
                  <p className="text-xs font-black uppercase text-slate-500">{copy.highlights}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {venue.tags[language].slice(0, 2).map((tag) => (
                      <span key={tag} className="rounded-[3px] bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-700">{tag}</span>
                    ))}
                  </div>
                </div>
                <Link href={`/contact?service=${serviceId}&item=${slugify(venue.name.en)}`} className="mt-3 flex h-9 items-center justify-center rounded-[3px] bg-[#7c2d12] px-2 text-xs font-black text-white transition hover:bg-[#5f220d] sm:px-4 sm:text-sm">
                  {copy.reserve}
                </Link>
                <Link href={`/services/${serviceId}/${slugify(venue.name.en)}`} className="mt-2 flex h-9 items-center justify-center rounded-[3px] border border-[#7c2d12] px-2 text-xs font-black text-[#7c2d12] transition hover:bg-orange-50 sm:px-4 sm:text-sm">
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
          tone="orange"
        />
      </div>
    </section>
  );
}
