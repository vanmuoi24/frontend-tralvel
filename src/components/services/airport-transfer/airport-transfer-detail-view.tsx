"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, Check, Clock3, Images, Luggage, MapPin, MessageCircle, PlaneTakeoff, ShieldCheck, Users, X } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import type { AirportTransferVehicle } from "@/data/airport-transfer";
import { ServiceBookingModal } from "@/components/services/service-booking-modal";

type AirportTransferDetailViewProps = {
  vehicle: AirportTransferVehicle;
};

function uniqueGallery(images: string[]) {
  return images.filter((image, index, array) => array.indexOf(image) === index);
}

export function AirportTransferDetailView({ vehicle }: AirportTransferDetailViewProps) {
  const { language } = useLanguage();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const images = uniqueGallery([vehicle.image, ...vehicle.gallery]);
  const copy = {
    zh: {
      back: "返回機場接送",
      gallery: "車輛與服務圖片",
      viewAllPhotos: "查看全部圖片",
      closePhotos: "關閉圖片",
      contact: "聯繫",
      booking: "預訂服務",
      overview: "車輛資訊",
      routeTitle: "接送資訊",
      serviceTitle: "服務包含",
      passengers: "乘客",
      luggage: "行李",
      airport: "機場接機",
      waiting: "航班跟踪",
      cancel: "靈活取消",
      support: "預訂支援",
      pickupTime: "按航班時間或預约時間確認",
      pickupPlace: "機場、酒店或市區地址",
      note: "提交預訂後，An Khai Travel 將確認接車点、人數、行李和合適車型。",
      includes: ["司機跟踪航班狀態", "接客時協助行李", "可為家庭或團體安排專車", "提供中文和英文諮詢"],
    },
    en: {
      back: "Back to airport transfers",
      gallery: "Vehicle and service photos",
      viewAllPhotos: "View all photos",
      closePhotos: "Close photos",
      contact: "Contact",
      booking: "Book service",
      overview: "Vehicle information",
      routeTitle: "Pickup and drop-off",
      serviceTitle: "Service includes",
      passengers: "Passengers",
      luggage: "Luggage",
      airport: "Airport pickup",
      waiting: "Flight tracking",
      cancel: "Flexible cancellation",
      support: "Booking support",
      pickupTime: "Confirmed by flight time or requested pickup time",
      pickupPlace: "Airport, hotel, or city address",
      note: "After booking, An Khai Travel will confirm pickup point, guests, luggage, and a suitable vehicle type.",
      includes: ["Driver tracks flight status", "Luggage support at pickup", "Private vehicle can be arranged for families or groups", "Chinese and English consultation support"],
    },
  }[language];
  const specs = [
    { icon: Users, label: copy.passengers, value: String(vehicle.seats) },
    { icon: Luggage, label: copy.luggage, value: String(vehicle.bags) },
    { icon: PlaneTakeoff, label: copy.airport, value: vehicle.name[language] },
    { icon: Clock3, label: copy.waiting, value: copy.pickupTime },
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
    <main className="bg-[#f5f7fb] py-5 text-slate-950">
      <div className="mx-auto max-w-7xl px-4">
        <Link href="/services/airport-transfer" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950">
          <ArrowLeft className="h-4 w-4" />
          {copy.back}
        </Link>

        <section className="mt-4 grid gap-5 lg:grid-cols-[1fr_330px]">
          <div className="space-y-5">
            <section className="overflow-hidden rounded-xl bg-white">
              <div className="grid gap-1 md:grid-cols-[1.2fr_0.8fr]">
                <button type="button" onClick={() => setGalleryOpen(true)} className="relative min-h-[280px] bg-slate-100 md:min-h-[360px]">
                  <Image src={images[0]} alt={vehicle.name[language]} fill priority className="object-cover" sizes="(min-width: 768px) 60vw, 100vw" />
                </button>
                <div className="grid grid-cols-2 gap-1">
                  {images.slice(1, 5).map((image, index) => (
                    <button key={image} type="button" onClick={() => setGalleryOpen(true)} className="relative min-h-[135px] bg-slate-100 md:min-h-0">
                      <Image src={image} alt={`${copy.gallery} ${index + 2}`} fill className="object-cover" sizes="25vw" />
                      {index === 3 ? (
                        <span className="absolute inset-0 flex items-center justify-center bg-slate-950/45 text-sm font-black text-white">
                          <Images className="mr-2 h-5 w-5" />
                          {copy.viewAllPhotos} {images.length}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-xl bg-white p-5">
              <span className="inline-flex rounded bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">{vehicle.model[language]}</span>
              <h1 className="mt-3 text-3xl font-black leading-tight text-slate-950">{vehicle.name[language]}</h1>
              <p className="mt-3 max-w-3xl text-base font-semibold leading-7 text-slate-600">{vehicle.route[language]}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {specs.map((spec) => {
                  const Icon = spec.icon;
                  return (
                    <div key={spec.label} className="rounded-lg border border-slate-200 p-3">
                      <Icon className="h-5 w-5 text-blue-600" />
                      <p className="mt-2 text-xs font-bold uppercase text-slate-400">{spec.label}</p>
                      <p className="mt-1 text-sm font-bold text-slate-950">{spec.value}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-xl bg-white p-5">
              <h2 className="text-2xl font-black text-slate-950">{copy.routeTitle}</h2>
              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-1 h-5 w-5 text-slate-500" />
                  <div>
                    <p className="font-bold text-slate-950">{copy.pickupTime}</p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">{copy.note}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-slate-500" />
                  <div>
                    <p className="font-bold text-slate-950">{copy.pickupPlace}</p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">{vehicle.pickup[language]}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl bg-white p-5">
              <h2 className="text-2xl font-black text-slate-950">{copy.serviceTitle}</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {copy.includes.map((item) => (
                  <p key={item} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 text-sm font-semibold leading-6 text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {item}
                  </p>
                ))}
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-xl bg-white p-5 lg:sticky lg:top-28">
            <h2 className="text-xl font-black text-slate-950">{copy.overview}</h2>
            <div className="mt-4 space-y-3">
              {specs.slice(0, 3).map((spec) => {
                const Icon = spec.icon;
                return (
                  <div key={spec.label} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 text-sm">
                    <span className="inline-flex items-center gap-2 font-semibold text-slate-600">
                      <Icon className="h-4 w-4" />
                      {spec.label}
                    </span>
                    <span className="font-bold text-slate-950">{spec.value}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm font-semibold leading-6 text-slate-700">
              <ShieldCheck className="mb-2 h-5 w-5 text-blue-600" />
              {copy.cancel}
            </div>
            <div className="mt-6 grid gap-4">
              <Link href={`/contact?service=airport-transfer&vehicle=${vehicle.slug}`} className="flex h-12 items-center justify-center gap-2 rounded border border-blue-600 px-5 text-sm font-black text-blue-600 transition hover:bg-blue-50">
                <MessageCircle className="h-4 w-4" />
                {copy.contact}
              </Link>
              <ServiceBookingModal
                language={language}
                serviceName="Airport transfer"
                itemName={vehicle.name[language]}
                triggerClassName="flex h-12 w-full items-center justify-center gap-2 rounded bg-blue-600 px-5 text-sm font-black !text-white shadow-sm transition hover:bg-blue-700"
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
                <p className="text-xs font-bold uppercase text-blue-600">{copy.gallery}</p>
                <h2 className="text-xl font-black text-slate-950 md:text-2xl">{vehicle.name[language]}</h2>
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
