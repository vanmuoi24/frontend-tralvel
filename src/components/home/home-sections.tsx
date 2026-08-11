"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BedDouble,
  Car,
  CarTaxiFront,
  CheckCircle2,
  Clock,
  Headphones,
  MapPinned,
  MessageCircle,
  MicVocal,
  Phone,
  Plane,
  Send,
  ShieldCheck,
  Smartphone,
  Utensils,
  Sparkles,
  PlaneTakeoff,
} from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Button } from "@/components/ui/button";
import { getLocalizedStatistics, homeCopy } from "@/data/localized-content";
import { useLanguage } from "@/providers/language-provider";
import { useBackendServices } from "@/providers/services-provider";
import { useSiteConfig, useSiteData } from "@/providers/site-provider";

const iconMap: Record<string, React.ElementType> = {
  BadgeCheck,
  BedDouble,
  Car,
  CarTaxiFront,
  MapPinned,
  MicVocal,
  Plane,
  PlaneTakeoff,
  Smartphone,
  Utensils,
  Sparkles,
};

const airportFeatureIcons = [Clock, Car, ShieldCheck, Headphones];

export function HomeSections() {
  const { language } = useLanguage();
  const siteConfig = useSiteConfig();
  const siteData = useSiteData();
  const copy = homeCopy[language];
  const travelServices = useBackendServices(language);
  const statistics = siteData.statistics.length ? siteData.statistics : getLocalizedStatistics(language);

  return (
    <>
      {/* SERVICES GRID SECTION */}
      <section id="services" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <ScrollReveal className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-amber-500">
                {copy.servicesEyebrow}
              </span>
              <h2 className="mt-2 text-3xl font-black tracking-tight md:text-5xl">
                {copy.servicesTitle}
              </h2>
              <p className="mt-4 max-w-2xl text-muted-foreground">
                {copy.servicesDescription}
              </p>
            </div>
            <Link href="/services">
              <Button variant="outline" className="rounded-md border-amber-500/40 text-amber-500 hover:bg-amber-400 hover:text-slate-950 font-bold">
                {copy.viewAll} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-5">
            {travelServices.map((service) => {
              const Icon = iconMap[service.icon] || Plane;
              return (
                <StaggerItem key={service.id}>
                  <Link
                    href={`/services/${service.id}`}
                    className="group block h-full overflow-hidden rounded-md border border-border/70 bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:border-amber-400 hover:shadow-xl"
                  >
                    <div className="relative h-28 overflow-hidden sm:h-36">
                      <Image
                        src={service.image}
                        alt={service.label}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-110"
                        sizes="(min-width: 1024px) 20vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded bg-amber-400 text-slate-950 shadow-md">
                        <Icon className="h-5 w-5 font-bold" />
                      </div>
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="line-clamp-2 text-sm font-black text-foreground transition-colors group-hover:text-amber-500 sm:text-base">
                        {service.label}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {service.description}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-black text-amber-500 sm:mt-4">
                        {copy.consultNow} <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* AIRPORT TRANSFER PRIORITY FEATURE BANNER */}
      <section className="bg-gradient-to-b from-[#031122] via-[#04162e] to-[#020a16] py-16 text-white md:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1 text-xs font-black tracking-widest text-amber-300 uppercase">
              <Sparkles className="h-3.5 w-3.5" /> {copy.airportEyebrow}
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
              {copy.airportTitle}
            </h2>
            <p className="mt-4 max-w-xl text-slate-300 leading-relaxed">
              {copy.airportDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {siteConfig.phones.map((phone) => (
                <a key={phone.value} href={`tel:${phone.value}`}>
                  <Button variant="accent" size="lg" className="rounded-xl font-black shadow-lg">
                    <Phone className="h-4 w-4" /> {phone.label}
                  </Button>
                </a>
              ))}
              <Link href={siteConfig.webchatHref}>
                <Button variant="outline" size="lg" className="rounded-xl border-amber-400/50 bg-white/5 text-amber-200 hover:bg-amber-400 hover:text-slate-950 font-bold">
                  <MessageCircle className="h-4 w-4" /> {copy.chatNow}
                </Button>
              </Link>
              <a href={siteConfig.telegramHref} target="_blank" rel="noreferrer">
                <Button variant="outline" size="lg" className="rounded-xl border-sky-400/50 bg-white/5 text-sky-200 hover:bg-sky-400 hover:text-slate-950 font-bold">
                  <Send className="h-4 w-4" /> Telegram
                </Button>
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="grid gap-4 sm:grid-cols-2">
              {copy.airportFeatures.map(({ title, text }, index) => {
                const Icon = airportFeatureIcons[index] || Clock;
                return (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                  <Icon className="h-7 w-7 text-amber-400" />
                  <h3 className="mt-4 text-base font-black">{title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{text}</p>
                </div>
              );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 4-STEP PROCESS SECTION */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <ScrollReveal className="mb-12 text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-amber-500">{copy.processEyebrow}</span>
            <h2 className="mt-2 text-3xl font-black tracking-tight md:text-5xl">{copy.processTitle}</h2>
          </ScrollReveal>
          <div className="grid gap-5 md:grid-cols-4">
            {copy.steps.map((step, index) => (
              <ScrollReveal key={step.title} delay={index * 0.08}>
                <div className="h-full rounded-2xl border border-border/70 bg-card p-6 shadow-sm hover:border-amber-400 transition">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400 text-lg font-black text-slate-950 shadow-md">
                    {index + 1}
                  </div>
                  <h3 className="mt-5 text-lg font-black">{step.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US & STATS */}
      <section className="bg-muted/40 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <ScrollReveal>
              <span className="text-sm font-bold uppercase tracking-widest text-amber-500">{copy.whyEyebrow}</span>
              <h2 className="mt-2 text-3xl font-black tracking-tight md:text-5xl">{copy.whyTitle}</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {copy.whyDescription}
              </p>
              <div className="mt-6 space-y-3">
                {copy.bullets.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-bold">
                    <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 gap-4">
              {statistics.map((stat) => (
                <ScrollReveal key={stat.label}>
                  <div className="rounded-2xl border border-border/80 bg-card p-6 text-center shadow-sm">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} className="text-amber-500 font-black text-3xl sm:text-4xl" />
                    <p className="mt-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#030f1c] via-[#041830] to-[#020b16] border border-amber-400/40 px-6 py-12 text-center text-white shadow-2xl sm:px-12 md:py-16">
              <h2 className="text-3xl font-black tracking-tight md:text-5xl">
                {copy.finalTitle}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-300 text-sm sm:text-base">
                {copy.finalDescription}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/contact">
                  <Button variant="accent" size="lg" className="rounded-xl font-black shadow-lg">
                    {copy.submitRequest} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href={`tel:${siteConfig.phones[0]?.value ?? siteConfig.phone}`}>
                  <Button variant="outline" size="lg" className="rounded-xl border-amber-400/50 bg-white/5 text-amber-200 hover:bg-amber-400 hover:text-slate-950 font-bold">
                    <Phone className="h-4 w-4" /> {copy.callNow}
                  </Button>
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
