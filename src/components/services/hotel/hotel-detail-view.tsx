"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, BadgeCheck, BedDouble, CalendarDays, Check, Images, MapPin, MessageCircle, ShieldCheck, Sparkles, Star, Users, Wifi, X } from "lucide-react";
import type { IServiceCatalogItem } from "@/types/TypeService";
import { useLanguage } from "@/providers/language-provider";
import { ServiceBookingModal } from "@/components/services/service-booking-modal";

type HotelDetailViewProps = {
  items: {
    zh: IServiceCatalogItem;
    en: IServiceCatalogItem;
  };
};

const fallbackGallery = ["/anhnenhotel.png", "/anh1.png", "/anh2.png", "/anh3.png", "/anh4.png", "/anh5.png", "/anh6.png", "/anh7.png", "/anh8.png"];

function textValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function fieldValue(item: IServiceCatalogItem, keys: string[]) {
  const fields = item.translation?.fields ?? [];
  const normalizedKeys = keys.map((key) => key.toLowerCase());
  const found = fields.find((field) => normalizedKeys.includes(textValue(field.label).toLowerCase()));
  return textValue(found?.value);
}

function uniqueImages(item: IServiceCatalogItem) {
  return [item.imageUrl, ...(item.gallery ?? []), ...fallbackGallery].filter(Boolean).filter((image, index, array) => array.indexOf(image) === index);
}

export function HotelDetailView({ items }: HotelDetailViewProps) {
  const { language } = useLanguage();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const item = items[language] ?? items.zh;
  const translation = item.translation;
  const images = uniqueImages(item);
  const name = translation?.title || item.slug;
  const location = translation?.location || textValue(item.attributes?.location) || textValue(item.tags?.area);
  const room = translation?.type || fieldValue(item, ["Loại phòng", "Room type", "房型"]) || textValue(item.attributes?.room);
  const score = textValue(translation?.content?.score) || "9.0";
  const reviews = textValue(translation?.content?.reviews) || (language === "zh" ? "真實客戶評價" : "Guest reviews");
  const includes = translation?.includes?.length ? translation.includes : [
    language === "zh" ? "乾淨舒適的客房" : "Clean and comfortable room",
    language === "zh" ? "中文 / 英文諮詢支援" : "Chinese / English booking support",
    language === "zh" ? "適合自由行、商務與家庭客人" : "Good for leisure, business, and family stays",
  ];
  const detailFields = [
    { icon: MapPin, label: language === "zh" ? "位置" : "Location", value: location || (language === "zh" ? "胡志明市中心區域" : "Central Ho Chi Minh City") },
    { icon: BedDouble, label: language === "zh" ? "房型" : "Room", value: room || (language === "zh" ? "按需求安排" : "Arranged by request") },
    { icon: CalendarDays, label: language === "zh" ? "入住" : "Stay", value: item.unit || translation?.duration || (language === "zh" ? "按晚計價" : "Per night") },
    { icon: Users, label: language === "zh" ? "適合客人" : "Best for", value: textValue(item.tags?.guest) || (language === "zh" ? "個人 / 家庭 / 團隊" : "Solo / family / group") },
  ];
  const copy = {
    zh: {
      back: "返回酒店列表",
      badge: translation?.badge || "精選酒店",
      gallery: "酒店圖片",
      viewAllPhotos: "查看全部圖片",
      closePhotos: "關閉圖片",
      overview: "酒店簡介",
      amenities: "包含服務",
      highlights: "為什么選擇這里",
	      bookingLabel: "Booking",
	      tax: "入住日期、房型與空房情況會由客服確認",
	      contact: "聯繫",
	      bookService: "預訂服務",
      trust1: "清楚確認",
      trust2: "快速確認",
      trust3: "中英雙語服務",
      note: "把入住日期、人數和房型需求發给我们，我们會確認可訂房源與最终报價。",
    },
    en: {
      back: "Back to hotel list",
      badge: translation?.badge || "Selected hotel",
      gallery: "Hotel photos",
      viewAllPhotos: "View all photos",
      closePhotos: "Close photos",
      overview: "Overview",
      amenities: "Included",
      highlights: "Why stay here",
	      bookingLabel: "Booking",
	      tax: "Dates, room type, and availability are confirmed by our team",
	      contact: "Contact",
	      bookService: "Book service",
      trust1: "Clear confirmation",
      trust2: "Fast confirmation",
      trust3: "Chinese and English support",
      note: "Send your dates, guests, and preferred room type. We will confirm availability and the final quote.",
    },
  }[language];

  useEffect(() => {
    if (!galleryOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [galleryOpen]);

  return (
    <main className="bg-white pb-10 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5">
          <Link href="/services/hotel" className="inline-flex items-center gap-2 text-sm font-black text-[#193cb8] transition hover:text-[#0f2b88]">
            <ArrowLeft className="h-4 w-4" />
            {copy.back}
          </Link>
          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_300px] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md bg-sky-50 px-3 py-1 text-xs font-black text-[#193cb8]">
                <BadgeCheck className="h-4 w-4" />
                {copy.badge}
              </div>
              <h1 className="mt-3 max-w-4xl text-2xl font-black leading-tight text-slate-950 md:text-4xl">{name}</h1>
              <p className="mt-3 flex flex-wrap items-center gap-2 text-sm font-bold text-slate-700">
                <MapPin className="h-4 w-4 text-[#193cb8]" />
                {location || (language === "zh" ? "越南酒店服務" : "Vietnam hotel service")}
                <span className="text-amber-300">★★★★★</span>
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-slate-950 shadow-sm">
              <p className="text-xs font-black uppercase text-slate-500">{copy.bookingLabel}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{copy.tax}</p>
              <div className="mt-5 grid gap-4">
                <Link href={`/contact?service=hotel&item=${item.slug}`} className="flex h-11 items-center justify-center gap-2 rounded border border-[#006ce4] bg-white px-4 text-sm font-black text-[#006ce4] transition hover:bg-sky-50">
                  <MessageCircle className="h-4 w-4" />
                  {copy.contact}
                </Link>
                <ServiceBookingModal
                  language={language}
                  serviceName="Hotel"
                  itemName={name}
                  triggerClassName="flex h-11 w-full items-center justify-center gap-2 rounded bg-[#006ce4] px-4 text-sm font-black !text-white shadow-sm transition hover:bg-[#0057b8]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-5">
        <div className="grid gap-2 overflow-hidden rounded-lg border border-slate-200 md:grid-cols-[1.25fr_1fr] lg:grid-cols-[1.35fr_1fr]">
          <button type="button" onClick={() => setGalleryOpen(true)} className="relative min-h-[300px] overflow-hidden bg-slate-100 text-left md:min-h-[500px]">
            <Image src={images[0]} alt={name} fill priority className="object-contain p-2 transition duration-500 hover:scale-[1.02]" sizes="(min-width: 1024px) 58vw, 100vw" />
          </button>
          <div className="grid grid-cols-2 gap-2">
            {images.slice(1, 5).map((image, index) => (
              <button key={image} type="button" onClick={() => setGalleryOpen(true)} className="relative min-h-36 overflow-hidden bg-slate-100 text-left md:min-h-[246px]">
                <Image src={image} alt={`${copy.gallery} ${index + 1}`} fill className="object-contain p-2 transition duration-500 hover:scale-[1.02]" sizes="(min-width: 1024px) 22vw, 50vw" />
                {index === 3 ? (
                  <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950/55 px-3 text-center text-sm font-black text-white md:text-base">
                    <Images className="h-8 w-8" />
                    {copy.viewAllPhotos} {images.length}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_300px]">
          <div className="space-y-5">
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">{copy.overview}</h2>
              <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-slate-600">
                {translation?.description || copy.note}
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-4">
                {detailFields.map((field) => {
                  const Icon = field.icon;
                  return (
                    <div key={field.label} className="rounded border border-slate-200 bg-slate-50 p-3">
                      <Icon className="h-5 w-5 text-[#006ce4]" />
                      <p className="mt-3 text-xs font-black uppercase text-slate-500">{field.label}</p>
                      <p className="mt-1 text-sm font-black">{field.value}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">{copy.amenities}</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {includes.map((itemText) => (
                  <p key={itemText} className="flex items-start gap-3 rounded border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {itemText}
                  </p>
                ))}
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-28">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-slate-950">{copy.highlights}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">{reviews}</p>
              </div>
              <div className="rounded bg-[#003b95] px-3 py-2 text-xl font-black text-white">{score}</div>
            </div>
            <div className="mt-5 space-y-3">
              {[
                { icon: ShieldCheck, text: copy.trust1 },
                { icon: Sparkles, text: copy.trust2 },
                { icon: Wifi, text: copy.trust3 },
              ].map((trust) => {
                const Icon = trust.icon;
                return (
                  <div key={trust.text} className="flex items-center gap-3 rounded bg-sky-50 p-3 text-sm font-black text-slate-800">
                    <Icon className="h-5 w-5 text-[#006ce4]" />
                    {trust.text}
                  </div>
                );
              })}
            </div>
            <div className="mt-5 rounded bg-amber-50 p-4">
              <div className="flex gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">{copy.note}</p>
            </div>
          </aside>
        </div>
      </section>

      {galleryOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/55 px-4 py-5 text-slate-950">
          <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4">
              <div>
                <p className="text-xs font-black uppercase text-[#193cb8]">{copy.gallery}</p>
                <h2 className="text-xl font-black text-slate-950 md:text-2xl">{name}</h2>
              </div>
              <button type="button" onClick={() => setGalleryOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-950 transition hover:bg-slate-100" aria-label={copy.closePhotos}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid flex-1 gap-3 overflow-y-auto bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image, index) => (
                <div key={`${image}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                  <Image src={image} alt={`${copy.gallery} ${index + 1}`} fill className="object-cover" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
