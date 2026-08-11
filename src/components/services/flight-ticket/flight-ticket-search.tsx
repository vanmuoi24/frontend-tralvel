"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeftRight, ArrowRight, BadgeCheck, Luggage, MapPin, PlaneLanding, PlaneTakeoff, Search, SlidersHorizontal, Users } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { slugify } from "@/lib/slugify";
import { ServicePagination } from "@/components/services/service-pagination";

const flightResults = [
  {
    airline: "Vietnam Airlines",
    code: "VN 218",
    from: "SGN",
    to: "HAN",
    route: { zh: "胡志明市 → 河內", en: "Ho Chi Minh City → Hanoi" },
    cabin: { zh: "经济舱", en: "Economy" },
    baggage: { zh: "含 23kg 托運行李", en: "23kg checked baggage included" },
    note: { zh: "免費選餐 · 可協助改期", en: "Meal support · Date-change assistance" },
    tag: { zh: "推薦", en: "Recommended" },
  },
  {
    airline: "Vietjet Air",
    code: "VJ 132",
    from: "SGN",
    to: "DAD",
    route: { zh: "胡志明市 → 峴港", en: "Ho Chi Minh City → Da Nang" },
    cabin: { zh: "经济舱", en: "Economy" },
    baggage: { zh: "7kg 随身行李", en: "7kg carry-on baggage" },
    note: { zh: "低價優先 · 可加購行李", en: "Best value · Baggage add-on available" },
    tag: { zh: "靈活", en: "Flexible" },
  },
  {
    airline: "Bamboo Airways",
    code: "QH 203",
    from: "HAN",
    to: "PQC",
    route: { zh: "河內 → 富國島", en: "Hanoi → Phu Quoc" },
    cabin: { zh: "含行李经济舱", en: "Economy with baggage" },
    baggage: { zh: "含 20kg 托運行李", en: "20kg checked baggage included" },
    note: { zh: "適合家庭 · 航班時間舒服", en: "Family friendly · Comfortable timing" },
    tag: { zh: "家庭", en: "Family" },
  },
  {
    airline: "Thai Airways",
    code: "TG 557",
    from: "SGN",
    to: "BKK",
    route: { zh: "胡志明市 → 曼谷", en: "Ho Chi Minh City → Bangkok" },
    cabin: { zh: "國際经济舱", en: "International economy" },
    baggage: { zh: "含 30kg 托運行李", en: "30kg checked baggage included" },
    note: { zh: "國際航線 · 可協助團隊出票", en: "International route · Group ticketing support" },
    tag: { zh: "國際", en: "International" },
  },
];

const airlineOptions = [
  { value: "Vietnam Airlines", label: { zh: "越南航空", en: "Vietnam Airlines" } },
  { value: "Vietjet Air", label: { zh: "Vietjet Air", en: "Vietjet Air" } },
  { value: "Bamboo Airways", label: { zh: "Bamboo Airways", en: "Bamboo Airways" } },
  { value: "Thai Airways", label: { zh: "國際航線", en: "International routes" } },
];

export function FlightTicketSearch({ serviceId }: { serviceId: string }) {
  const { language } = useLanguage();
  const [tripType, setTripType] = useState<"round" | "oneway">("round");
  const [fromQuery, setFromQuery] = useState("SGN - Ho Chi Minh City");
  const [toQuery, setToQuery] = useState("HAN - Hanoi");
  const [passengerValue, setPassengerValue] = useState("2 adults · Economy");
  const [checkedDirect, setCheckedDirect] = useState(true);
  const [checkedBaggage, setCheckedBaggage] = useState(false);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const copy = {
    zh: {
      round: "往返",
      oneway: "單程",
      from: "出發地",
      to: "目的地",
      passengers: "乘客 / 舱位",
      passengerValue: "2 位成人 · 经济舱",
      search: "聯繫諮詢",
      filter: "篩選航線",
      stops: "航線類型",
      direct: "直飞優先",
      baggage: "含托運行李",
      airlines: "航空公司",
      results: "推薦航線",
      sort: "按熱門路線推薦",
      select: "聯繫",
      details: "查看詳情",
      route: "胡志明市到河內",
      title: "機票路線諮詢",
      subtitle: "告诉我们出發地、目的地和人數，客服會按路線幫您確認合適航班。",
      fromValue: "SGN - 胡志明市",
      toValue: "HAN - 河內",
      support: "客服確認路線、航空公司、行李和出票方式",
      routeLabel: "航線",
      noPrice: "無線上價格，聯繫客服確認",
      noResults: "未找到合適路線。請更改出發地/目的地或减少篩選条件。",
      previous: "上一頁",
      next: "下一頁",
      page: "頁",
    },
    en: {
      round: "Round trip",
      oneway: "One way",
      from: "From",
      to: "To",
      passengers: "Passengers / Cabin",
      passengerValue: "2 adults · Economy",
      search: "Contact us",
      filter: "Filter routes",
      stops: "Route type",
      direct: "Direct preferred",
      baggage: "Checked baggage",
      airlines: "Airlines",
      results: "Recommended routes",
      sort: "Popular route suggestions",
      select: "Contact",
      details: "View details",
      route: "Ho Chi Minh City to Hanoi",
      title: "Flight Route Consultation",
      subtitle: "Send us your departure, destination, and guest count. Our team will confirm suitable flight options for your route.",
      fromValue: "SGN - Ho Chi Minh City",
      toValue: "HAN - Hanoi",
      support: "Our team confirms route, airline, baggage, and ticketing method",
      routeLabel: "Route",
      noPrice: "No online price, contact us to confirm",
      noResults: "No matching route found. Try changing From / To or clearing filters.",
      previous: "Previous",
      next: "Next",
      page: "Page",
    },
  }[language];
  const pageSize = 4;
  const visibleFlights = useMemo(() => {
    const matchesQuery = (query: string, text: string) => {
      const tokens = query
        .toLowerCase()
        .split(/[^a-z0-9\u00c0-\u1ef9]+/i)
        .filter(Boolean);

      return tokens.length === 0 || tokens.every((token) => text.includes(token));
    };

    return flightResults.filter((flight) => {
      const routeText = `${flight.from} ${flight.to} ${flight.route.zh} ${flight.route.en}`.toLowerCase();
      const matchesFrom = matchesQuery(fromQuery, routeText);
      const matchesTo = matchesQuery(toQuery, routeText);
      const matchesDirect = checkedDirect ? true : true;
      const matchesAirline = selectedAirlines.length === 0 || selectedAirlines.includes(flight.airline);
      const matchesBaggage = !checkedBaggage || /20|23|30/.test(flight.baggage.en);

      return matchesFrom && matchesTo && matchesDirect && matchesAirline && matchesBaggage;
    });
  }, [checkedBaggage, checkedDirect, fromQuery, selectedAirlines, toQuery]);
  const pageCount = Math.max(1, Math.ceil(visibleFlights.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const currentFlights = visibleFlights.slice(currentPage * pageSize, currentPage * pageSize + pageSize);
  const changePage = (nextPage: number) => setPage(Math.max(0, Math.min(nextPage, pageCount - 1)));

  const toggleAirline = (airline: string) => {
    setPage(0);
    setSelectedAirlines((current) => (
      current.includes(airline) ? current.filter((item) => item !== airline) : [...current, airline]
    ));
  };

  return (
    <section className="mx-auto max-w-7xl bg-white text-slate-950">
      <div className="border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-[#073b79] px-4 py-5 text-white sm:px-6">
          <p className="text-xs font-black uppercase tracking-wide text-sky-200">{copy.routeLabel}</p>
          <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-normal sm:text-3xl">{copy.title}</h1>
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-blue-100">{copy.subtitle}</p>
            </div>
            <div className="flex gap-2">
              {[
                ["round", copy.round],
                ["oneway", copy.oneway],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTripType(value as "round" | "oneway")}
                  className={`h-10 min-w-24 rounded-[3px] border px-4 text-sm font-black transition ${
                    tripType === value ? "border-white bg-white text-blue-950" : "border-white/25 bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-3 p-4 lg:grid-cols-[1fr_42px_1fr_1fr_auto] lg:items-stretch">
          <label className="flex min-h-16 items-center gap-3 rounded-[3px] border border-slate-200 bg-slate-50 px-4 text-left transition focus-within:border-[#006ce4] hover:border-[#006ce4] hover:bg-white">
            <PlaneTakeoff className="h-5 w-5 shrink-0 text-[#006ce4]" />
            <span className="min-w-0">
              <span className="block text-xs font-bold text-slate-500">{copy.from}</span>
	              <input value={fromQuery} onChange={(event) => { setFromQuery(event.target.value); setPage(0); }} className="block w-full bg-transparent text-sm font-black text-slate-950 outline-none" />
            </span>
          </label>
          <div className="hidden items-center justify-center text-[#006ce4] lg:flex">
            <ArrowLeftRight className="h-5 w-5" />
          </div>
          <label className="flex min-h-16 items-center gap-3 rounded-[3px] border border-slate-200 bg-slate-50 px-4 text-left transition focus-within:border-[#006ce4] hover:border-[#006ce4] hover:bg-white">
            <PlaneLanding className="h-5 w-5 shrink-0 text-[#006ce4]" />
            <span className="min-w-0">
              <span className="block text-xs font-bold text-slate-500">{copy.to}</span>
	              <input value={toQuery} onChange={(event) => { setToQuery(event.target.value); setPage(0); }} className="block w-full bg-transparent text-sm font-black text-slate-950 outline-none" />
            </span>
          </label>
          <label className="flex min-h-16 items-center gap-3 rounded-[3px] border border-slate-200 bg-slate-50 px-4 text-left transition focus-within:border-[#006ce4] hover:border-[#006ce4] hover:bg-white">
            <Users className="h-5 w-5 shrink-0 text-[#006ce4]" />
            <span className="min-w-0">
              <span className="block text-xs font-bold text-slate-500">{copy.passengers}</span>
	              <select value={passengerValue} onChange={(event) => { setPassengerValue(event.target.value); setPage(0); }} className="block w-full bg-transparent text-sm font-black text-slate-950 outline-none">
                <option>{copy.passengerValue}</option>
                <option>{language === "zh" ? "1 位成人 · 经济舱" : "1 adult · Economy"}</option>
                <option>{language === "zh" ? "3 位成人 · 经济舱" : "3 adults · Economy"}</option>
                <option>{language === "zh" ? "4 位成人 · 经济舱" : "4 adults · Economy"}</option>
              </select>
            </span>
          </label>
          <Link href={`/contact?service=${serviceId}`} className="flex min-h-16 items-center justify-center rounded-[3px] bg-[#006ce4] px-6 text-base font-black text-white transition hover:bg-[#0057b8]">
            <Search className="mr-2 h-5 w-5" />
            {copy.search}
          </Link>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit border border-slate-200 bg-white p-4 text-slate-900 shadow-sm lg:sticky lg:top-36">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
            <SlidersHorizontal className="h-5 w-5 text-[#006ce4]" />
            <h2 className="text-lg font-black">{copy.filter}</h2>
          </div>
          <div className="mt-5 space-y-5">
            <div>
              <h3 className="text-sm font-black">{copy.stops}</h3>
	              <label className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" className="h-4 w-4 rounded-none" checked={checkedDirect} onChange={(event) => { setCheckedDirect(event.target.checked); setPage(0); }} /> {copy.direct}</label>
            </div>
            <div>
              <h3 className="text-sm font-black">{copy.baggage}</h3>
	              <label className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" className="h-4 w-4 rounded-none" checked={checkedBaggage} onChange={(event) => { setCheckedBaggage(event.target.checked); setPage(0); }} /> 20kg+</label>
            </div>
            <div>
              <h3 className="text-sm font-black">{copy.airlines}</h3>
              {airlineOptions.map((item) => (
                <label key={item.value} className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input type="checkbox" className="h-4 w-4 rounded-none" checked={selectedAirlines.includes(item.value)} onChange={() => toggleAirline(item.value)} />
                  {item.label[language]}
                </label>
              ))}
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-black text-[#006ce4]">{fromQuery || copy.fromValue} → {toQuery || copy.toValue}</p>
              <h1 className="mt-1 text-2xl font-black text-slate-950">{copy.results}</h1>
            </div>
            <p className="border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600">{visibleFlights.length} · {copy.sort}</p>
          </div>

          <div className="mt-5 grid gap-4">
            {currentFlights.map((flight) => (
              <article key={flight.code} className="border border-slate-200 bg-white text-slate-950 shadow-sm transition hover:border-[#006ce4] hover:shadow-md">
                <div className="grid gap-0 md:grid-cols-[1fr_220px]">
                  <div className="p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[3px] bg-[#eaf3ff] text-[#006ce4]">
                      <PlaneTakeoff className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black">{flight.airline}</h2>
                      <p className="text-xs font-bold text-slate-500">{flight.code} · {flight.cabin[language]}</p>
                    </div>
                    <span className="rounded-[3px] bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{flight.tag[language]}</span>
                  </div>
                </div>

                <div className="mt-5 grid items-center gap-4 md:grid-cols-[1fr_auto]">
                  <div className="rounded-[3px] border border-slate-200 bg-slate-50 px-4 py-4">
                    <p className="flex items-center gap-2 text-xs font-black uppercase text-[#006ce4]">
                      <MapPin className="h-4 w-4" />
                      {copy.routeLabel}
                    </p>
                    <p className="mt-2 text-2xl font-black text-slate-950">{flight.from} → {flight.to}</p>
                    <p className="mt-1 text-sm font-bold text-slate-500">{flight.route[language]}</p>
                  </div>
                  <div className="flex flex-col items-start gap-2 md:items-end">
                    <p className="flex items-center gap-2 text-sm font-bold text-slate-600"><Luggage className="h-4 w-4 text-[#006ce4]" /> {flight.baggage[language]}</p>
                    <p className="text-sm font-semibold text-slate-500">{flight.note[language]}</p>
                  </div>
                </div>
                  </div>

                  <div className="border-t border-slate-200 bg-slate-50 p-4 md:border-l md:border-t-0">
                    <p className="flex items-start gap-2 text-sm font-bold leading-6 text-slate-700">
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      {copy.support}
                    </p>
                    <p className="mt-3 text-xs font-black uppercase text-slate-500">{copy.noPrice}</p>
                    <div className="mt-4 grid gap-3">
                      <Link href={`/contact?service=${serviceId}`} className="inline-flex h-10 items-center justify-center rounded-[3px] bg-[#006ce4] px-4 text-sm font-black text-white transition hover:bg-[#0057b8]">
                        {copy.select} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                      <Link href={`/services/${serviceId}/${slugify(`${flight.airline}-${flight.code}`)}`} className="inline-flex h-10 items-center justify-center rounded-[3px] border border-[#006ce4] bg-white px-4 text-sm font-black text-[#006ce4] transition hover:bg-sky-50">{copy.details}</Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
            {visibleFlights.length === 0 ? (
              <div className="border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-600">
                {copy.noResults}
              </div>
            ) : null}
          </div>
          {visibleFlights.length > 0 ? (
            <ServicePagination
              currentPage={currentPage}
              pageCount={pageCount}
              previousLabel={copy.previous}
              nextLabel={copy.next}
              pageLabel={copy.page}
              tone="blue"
              onPageChange={changePage}
              onPrevious={() => changePage(currentPage - 1)}
              onNext={() => changePage(currentPage + 1)}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
