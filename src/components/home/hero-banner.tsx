"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2,
  CarTaxiFront,
  ConciergeBell,
  Headphones,
  MessageCircle,
  MicVocal,
  Phone,
  Send,
  Trees,
} from "lucide-react";
import { LOGO_SRC } from "@/data/assets";
import { heroCopy } from "@/data/localized-content";
import { useLanguage } from "@/providers/language-provider";
import { useBackendServices } from "@/providers/services-provider";
import { useSiteConfig } from "@/providers/site-provider";

const heroImages = {
  image1: "/anh1.png",
  image2: "/anh2.png",
  image3: "/anh3.png",
  image4: "/anh4.png",
  image5: "/anh5.png",
  image6: "/anh6.png",
  image7: "/anh7.png",
  image8: "/anh8.png",
};

const heroSlides = [
  { src: heroImages.image1, position: "object-[42%_50%]" },
  { src: heroImages.image2, position: "object-[58%_50%]" },
  { src: heroImages.image3, position: "object-center" },
  { src: heroImages.image4, position: "object-[64%_50%]" },
  { src: heroImages.image5, position: "object-center" },
  { src: heroImages.image6, position: "object-[52%_50%]" },
  { src: heroImages.image7, position: "object-[48%_50%]" },
  { src: heroImages.image8, position: "object-center" },
];

const serviceIconMap: Record<string, React.ElementType> = {
  BedDouble: Building2,
  CarTaxiFront,
  MicVocal,
  MapPinned: Trees,
  Utensils: ConciergeBell,
};

export function HeroBanner() {
  const { language } = useLanguage();
  const siteConfig = useSiteConfig();
  const copy = heroCopy[language];
  const heroServiceTiles = useBackendServices(language).slice(0, 6);
  const [activeSlide, setActiveSlide] = useState(0);
  const sideSlides = [
    heroSlides[(activeSlide + 1) % heroSlides.length],
    heroSlides[(activeSlide + 2) % heroSlides.length],
    heroSlides[(activeSlide + 3) % heroSlides.length],
  ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#031425] text-white">
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <motion.div
            key={slide.src}
            animate={{
              opacity: activeSlide === index ? 1 : 0,
              scale: 1,
            }}
            transition={{ duration: 1.05, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={slide.src}
              alt={copy.alts[index]}
              fill
              priority={index === 0}
              sizes="100vw"
              className={`object-cover ${slide.position}`}
            />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,20,37,0.18),rgba(3,20,37,0.86)_48%,rgba(3,20,37,0.46)),linear-gradient(180deg,rgba(3,20,37,0.5),rgba(3,20,37,0.16)_36%,#031425_92%)]" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[820px] max-w-7xl gap-8 px-4 pb-8 pt-14 sm:px-6 lg:grid-cols-[1fr_0.82fr] lg:px-8 lg:pb-12 lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="flex flex-col justify-center text-center lg:text-left"
        >
          {LOGO_SRC && (
            <div className="mx-auto flex h-25 w-full max-w-64 items-center justify-center lg:mx-0 lg:h-10 lg:max-w-200">
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl lg:h-40 lg:w-56">
                <Image
                  src={LOGO_SRC}
                  alt="An Khai Travel logo"
                  fill
                  priority
                  sizes="1000px"
                  className="object-contain"
                />
              </div>
            </div>
          )}

          <h4 className="mt-4 flex flex-nowrap items-center justify-center gap-2 whitespace-nowrap text-[clamp(1.85rem,8.5vw,5rem)] font-black uppercase leading-none tracking-normal lg:justify-start">
            <span className="bg-gradient-to-b from-[#fff5a8] via-[#ffce3c] to-[#d88700] bg-clip-text text-transparent drop-shadow-[0_10px_28px_rgba(0,0,0,0.48)]">
              An Khai
            </span>
            <span className="inline-flex items-center gap-2 text-white drop-shadow-[0_10px_28px_rgba(0,0,0,0.58)]">
              Travel
              <span className="relative inline-block h-[1.2em] w-[1.5em] shrink-0 overflow-hidden  ">
                <Image
                  src="/anhlacotoquoc.png"
                  alt="Vietnam flag"
                  fill
                  sizes="100px"
                  className="object-cover"
                />
              </span>
            </span>
          </h4>


          <div className="mx-auto flex w-full max-w-3xl items-center gap-4 lg:mx-0">
            <span className="h-px flex-1 bg-[#ffce3c]" />
            <p className="text-[clamp(1.35rem,3.5vw,2.55rem)] font-bold tracking-[0.16em] text-[#ffe070]">
              {copy.tagline}
            </p>
            <span className="h-px flex-1 bg-[#ffce3c]" />
          </div>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/82 lg:mx-0 lg:text-lg">
            {copy.description}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-white/88 lg:justify-start">
            {copy.traits.map((trait, index) => (
              <span key={trait} className="contents">
                <span>{trait}</span>
                {index < copy.traits.length - 1 && <span className="text-[#ffce3c]">|</span>}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            {siteConfig.phones.map((phone) => (
              <a
                key={phone.value}
                href={`tel:${phone.value}`}
                className="inline-flex min-h-12 items-center gap-2 rounded bg-[#ffce3c] px-5 text-sm font-black text-[#041528] shadow-lg shadow-black/20 transition hover:bg-[#ffe070]"
              >
                <Phone className="h-4 w-4" />
                {phone.label}
              </a>
            ))}
            <Link
              href={siteConfig.webchatHref}
              className="inline-flex min-h-12 items-center gap-2 rounded border border-[#ffce3c]/55 bg-black/20 px-5 text-sm font-black text-white backdrop-blur transition hover:bg-[#ffce3c] hover:text-[#041528]"
            >
              <MessageCircle className="h-4 w-4" />
              {copy.chat}
            </Link>
            <a
              href={siteConfig.telegramHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded border border-[#ffce3c]/55 bg-black/20 px-5 text-sm font-black text-white backdrop-blur transition hover:bg-[#ffce3c] hover:text-[#041528]"
            >
              <Send className="h-4 w-4" />
              Telegram
            </a>
          </div>

          <div className="mt-8 flex justify-center gap-2 lg:justify-start">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.src}
                onClick={() => setActiveSlide(index)}
                className={`h-2.5 rounded-full transition-all ${activeSlide === index ? "w-9 bg-[#ffce3c]" : "w-2.5 bg-white/45 hover:bg-white/80"
                  }`}
                aria-label={`${copy.slideLabel} ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="flex items-end"
        >
          <div className="grid w-full grid-cols-2 gap-3">
            <div className="relative h-44 overflow-hidden rounded border border-white/15 shadow-2xl sm:h-64 lg:h-80">
              <Image key={sideSlides[0].src} src={sideSlides[0].src} alt={copy.alts[(activeSlide + 1) % heroSlides.length]} fill className={`object-cover ${sideSlides[0].position}`} sizes="(min-width: 1024px) 24vw, 50vw" />
            </div>
            <div className="relative mt-10 h-44 overflow-hidden rounded border border-white/15 shadow-2xl sm:h-64 lg:h-80">
              <Image key={sideSlides[1].src} src={sideSlides[1].src} alt={copy.alts[(activeSlide + 2) % heroSlides.length]} fill className={`object-cover ${sideSlides[1].position}`} sizes="(min-width: 1024px) 24vw, 50vw" />
            </div>
            <div className="relative col-span-2 h-36 overflow-hidden rounded border border-[#ffce3c]/45 shadow-2xl sm:h-48 lg:h-56">
              <Image key={sideSlides[2].src} src={sideSlides[2].src} alt={copy.alts[(activeSlide + 3) % heroSlides.length]} fill className={`object-cover ${sideSlides[2].position}`} sizes="(min-width: 1024px) 48vw, 100vw" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#041528]/74 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffda68]">{copy.hotline}</p>
                <p className="mt-1 text-xl font-black">{siteConfig.phones[0]?.value ?? siteConfig.phone}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative z-20 border-y border-[#ffce3c]/35 bg-[#031425]/96 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:overflow-visible">
          {heroServiceTiles.map((service, index) => {
            const Icon = serviceIconMap[service.icon] || Headphones;
            return (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="group relative flex min-h-28 min-w-[168px] shrink-0 flex-col items-center justify-center px-5 text-center text-[#ffda68] transition hover:text-white lg:min-w-0 lg:flex-1"
              >
                {index > 0 && (
                  <span className="absolute left-0 top-1/2 h-14 w-px -translate-y-1/2 bg-[#ffce3c]/45" aria-hidden="true" />
                )}
                <Icon className="mb-2 h-10 w-10 stroke-[1.9] transition group-hover:-translate-y-0.5 sm:h-12 sm:w-12" />
                <span className="block w-full">
                  <span className="block whitespace-nowrap text-lg font-black leading-tight tracking-normal sm:text-xl">{service.label}</span>
                  <span className="mt-0.5 block whitespace-nowrap text-[0.68rem] font-black uppercase leading-tight tracking-normal text-white/82 sm:text-xs">
                    {service.caption}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
