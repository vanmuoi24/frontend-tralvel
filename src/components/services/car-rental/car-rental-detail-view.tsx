"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, Car, Check, Images, Luggage, MapPin, MessageCircle, ShieldCheck, Users, X } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import type { CarRentalPost } from "@/data/car-rental";
import { ServiceBookingModal } from "@/components/services/service-booking-modal";

type CarRentalDetailViewProps = {
  car: CarRentalPost;
};

const carGallery = [
  "/anhnendichvuthuexe.png",
  "/anh1.png",
  "/anh2.png",
  "/anh3.png",
  "/anh4.png",
  "/anh5.png",
  "/anh6.png",
  "/anh7.png",
  "/anh8.png",
];

function uniqueGallery(mainImage: string) {
  return [mainImage, ...carGallery].filter((image, index, array) => array.indexOf(image) === index);
}

export function CarRentalDetailView({ car }: CarRentalDetailViewProps) {
  const { language } = useLanguage();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const images = uniqueGallery(car.image);
  const copy = {
    zh: {
      back: "返回租車列表",
      gallery: "車輛圖片",
      viewAllPhotos: "查看全部圖片",
      closePhotos: "關閉圖片",
      specModel: "指定車型",
      overview: "車輛資訊",
      pickupTitle: "取車與用車",
      includedTitle: "服務说明",
      contact: "聯繫",
      guests: "乘客",
      luggage: "行李",
      transmission: "变速箱",
      doors: "車門",
      fuel: "燃油",
      fuelText: "按車輛安排",
      pickupTime: "按行程時間確認",
      pickupPlace: "機場、酒店或市區地點",
      note: "確認人數、行李、日期和路線後，我们會安排合適車型。",
      includes: ["客服確認車輛可用情況", "可安排機場、酒店或市區接送", "適合家庭、商務和私人行程", "中英雙語諮詢支援"],
    },
    en: {
      back: "Back to rental cars",
      gallery: "Vehicle photos",
      viewAllPhotos: "View all photos",
      closePhotos: "Close photos",
      specModel: "Specified model",
      overview: "Vehicle details",
      pickupTitle: "Pickup and rental",
      includedTitle: "Service notes",
      contact: "Contact",
      guests: "Guests",
      luggage: "Luggage",
      transmission: "Transmission",
      doors: "Doors",
      fuel: "Fuel",
      fuelText: "Arranged by vehicle",
      pickupTime: "Confirmed by itinerary time",
      pickupPlace: "Airport, hotel, or city pickup point",
      note: "Send guests, luggage, dates, and route. We will arrange a suitable vehicle.",
      includes: ["Vehicle availability confirmed by our team", "Airport, hotel, and city pickup can be arranged", "Good for family, business, and private routes", "Chinese and English consultation support"],
    },
  }[language];
  const specs = [
    { icon: Users, label: copy.guests, value: String(car.seats) },
    { icon: Luggage, label: copy.luggage, value: String(car.luggage) },
    { icon: Car, label: copy.transmission, value: car.transmission[language] },
    { icon: Car, label: copy.doors, value: String(car.doors) },
    { icon: ShieldCheck, label: copy.fuel, value: copy.fuelText },
  ];

  useEffect(() => {
    if (!galleryOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [galleryOpen]);

  return (
    <main className="bg-[#f4f6fa] py-5 text-slate-950">
      <div className="mx-auto max-w-7xl px-4">
        <Link href="/services/car-rental" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950">
          <ArrowLeft className="h-4 w-4" />
          {copy.back}
        </Link>

        <section className="mt-4 grid gap-5 lg:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            <div className="rounded-xl bg-white p-5">
              <div className="grid gap-5 md:grid-cols-[280px_1fr] md:items-center">
                <div>
                  <button type="button" onClick={() => setGalleryOpen(true)} className="relative h-44 w-full overflow-hidden rounded-lg bg-slate-50">
                    <Image src={car.image} alt={car.title[language]} fill priority className="object-cover object-bottom" sizes="280px" />
                  </button>
                  <button type="button" onClick={() => setGalleryOpen(true)} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#315cff] hover:underline">
                    <Images className="h-4 w-4" />
                    {copy.viewAllPhotos} {images.length}
                  </button>
                </div>

                <div>
                  <span className="inline-flex rounded bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700">{copy.specModel}</span>
                  <h1 className="mt-3 text-3xl font-bold leading-tight text-slate-950">{car.title[language]}</h1>
                  <p className="mt-2 text-base font-medium text-slate-600">{car.type[language]}</p>
                  <div className="mt-5 flex flex-wrap gap-4">
                    {specs.map((spec) => {
                      const Icon = spec.icon;
                      return (
                        <div key={spec.label} className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                          <Icon className="h-4 w-4 text-slate-500" />
                          <span>{spec.value}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-5 border-t border-slate-200 pt-5">
                    <p className="flex items-start gap-2 text-sm font-medium leading-6 text-slate-700">
                      <MapPin className="mt-1 h-4 w-4 shrink-0 text-slate-500" />
                      {car.pickup[language]}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <section className="rounded-xl bg-white p-5">
              <h2 className="text-2xl font-bold text-slate-950">{copy.pickupTitle}</h2>
              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-1 h-5 w-5 text-slate-500" />
                  <div>
                    <p className="font-semibold text-slate-950">{copy.pickupTime}</p>
                    <p className="mt-1 text-sm font-medium text-slate-500">{copy.note}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-slate-500" />
                  <div>
                    <p className="font-semibold text-slate-950">{copy.pickupPlace}</p>
                    <p className="mt-1 text-sm font-medium text-slate-500">{car.pickup[language]}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl bg-white p-5">
              <h2 className="text-2xl font-bold text-slate-950">{copy.includedTitle}</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {copy.includes.map((item) => (
                  <p key={item} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {item}
                  </p>
                ))}
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-xl bg-white p-5 lg:sticky lg:top-28">
            <h2 className="text-xl font-bold text-slate-950">{copy.overview}</h2>
            <div className="mt-4 space-y-3">
              {specs.slice(0, 4).map((spec) => {
                const Icon = spec.icon;
                return (
                  <div key={spec.label} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 text-sm">
                    <span className="inline-flex items-center gap-2 font-medium text-slate-600">
                      <Icon className="h-4 w-4" />
                      {spec.label}
                    </span>
                    <span className="font-semibold text-slate-950">{spec.value}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 grid gap-4">
              <Link href={`/contact?service=car-rental&item=${car.slug}`} className="flex h-12 items-center justify-center gap-2 rounded border border-[#315cff] px-5 text-sm font-semibold text-[#315cff] transition hover:bg-blue-50">
                <MessageCircle className="h-4 w-4" />
                {copy.contact}
              </Link>
              <ServiceBookingModal
                language={language}
                serviceName="Car rental"
                itemName={car.title[language]}
                triggerClassName="flex h-12 w-full items-center justify-center gap-2 rounded bg-[#315cff] px-5 text-sm font-semibold !text-white shadow-sm transition hover:bg-[#2147d9]"
              />
            </div>
          </aside>
        </section>
      </div>

      {galleryOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/55 px-4 py-5 text-slate-950">
          <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4">
              <div>
                <p className="text-xs font-bold uppercase text-[#315cff]">{copy.gallery}</p>
                <h2 className="text-xl font-bold text-slate-950 md:text-2xl">{car.title[language]}</h2>
              </div>
              <button type="button" onClick={() => setGalleryOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-950 transition hover:bg-slate-100" aria-label={copy.closePhotos}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid flex-1 gap-3 overflow-y-auto bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image, index) => (
                <div key={`${image}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-slate-200 bg-white">
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
