"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Clock, MessageCircle, Phone, QrCode, Send, ShieldCheck } from "lucide-react";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useLanguage } from "@/providers/language-provider";
import { useSiteConfig } from "@/providers/site-provider";

type ContactCopy = {
  breadcrumb: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  directTitle: string;
  directText: string;
  phoneTitle: string;
  phoneText: string;
  webchatTitle: string;
  webchatText: string;
  telegramTitle: string;
  telegramText: string;
  lineTitle: string;
  lineText: string;
  open: string;
  call: string;
  qrTitle: string;
  qrSubtitle: string;
  webchatQrTitle: string;
  lineQrTitle: string;
  qrHint: string;
  noQr: string;
  missingAppLink: string;
  responseTitle: string;
  responseText: string;
  privateTitle: string;
  privateText: string;
};

const contactCopy: Record<"zh" | "en", ContactCopy> = {
	  zh: {
	    breadcrumb: "聯繫",
	    eyebrow: "An Khai Travel 聯繫方式",
	    title: "聯繫諮詢，快速選擇合適服務",
	    subtitle: "酒店、用車、接送機、簽證、SPA、餐廳、導遊等服務都可直接聯繫我们確認。我们不做線上付款流程，客服會通過電話或二維碼快速協助您選擇服務。",
	    directTitle: "告诉我们您的需求",
	    directText: "請發送想預訂的服務、出行日期、人數和目的地，客服會幫您確認合適方案並安排下一步。",
	    phoneTitle: "電話熱線",
	    phoneText: "適合當天服務、機場接送、用車和需要馬上確認的行程。",
	    webchatTitle: "WeChat",
	    webchatText: "適合發送行程截圖、酒店名稱、簽證資料或服務需求。",
	    telegramTitle: "Telegram",
	    telegramText: "適合發送文件、確認多人行程和後續服務细节。",
	    lineTitle: "Line",
	    lineText: "扫碼添加客服後，可直接諮詢越南旅遊服務。",
	    open: "打開",
	    call: "撥打",
	    qrTitle: "扫碼聯繫，選擇您的服務",
	    qrSubtitle: "扫描 LINE 或 WeChat，把想要的服務發给我们，客服會儘快回復確認。",
	    webchatQrTitle: "WeChat QR",
	    lineQrTitle: "LINE QR",
	    qrHint: "扫碼添加客服",
	    noQr: "等待替換真實二維碼",
	    missingAppLink: "請在後臺添加打開 App 的連結",
	    responseTitle: "快速確認服務",
	    responseText: "收到您的需求後，我们會優先確認服務類型、時間、人數和接送地點。",
	    privateTitle: "直接沟通",
	    privateText: "網站不做複雜預訂流程，客戶通過電話或二維碼與客服確認服務。",
	  },
	  en: {
	    breadcrumb: "Contact",
	    eyebrow: "An Khai Travel Contact",
	    title: "Contact Us to Choose Your Service Quickly",
	    subtitle: "For hotels, cars, airport transfers, visas, spa, restaurants, guides, and other Vietnam travel services, contact us directly. This website does not use online checkout; our team helps you confirm the right service by phone or QR chat.",
	    directTitle: "Tell Us What You Need",
	    directText: "Send the service you want, travel date, group size, and destination. Our team will help confirm the best option and next step.",
	    phoneTitle: "Phone Hotlines",
	    phoneText: "Best for same-day services, airport transfers, private cars, and urgent confirmation.",
	    webchatTitle: "WeChat",
	    webchatText: "Best for sending itinerary screenshots, hotel names, visa documents, or service requests.",
	    telegramTitle: "Telegram",
	    telegramText: "Best for files, group travel details, and follow-up service confirmation.",
	    lineTitle: "Line",
	    lineText: "Scan to add our support team and chat about Vietnam travel services.",
	    open: "Open",
	    call: "Call",
	    qrTitle: "Scan to Contact and Choose a Service",
	    qrSubtitle: "Scan LINE or WeChat, send us the service you need, and our team will reply as soon as possible.",
	    webchatQrTitle: "WeChat QR",
	    lineQrTitle: "LINE QR",
	    qrHint: "Scan to add support",
	    noQr: "Ready for real QR code",
	    missingAppLink: "Add app link in admin",
	    responseTitle: "Fast Service Confirmation",
	    responseText: "After receiving your request, we confirm service type, time, group size, and pickup or meeting details.",
	    privateTitle: "Direct Communication",
	    privateText: "No complicated booking flow here. Customers confirm services directly with our team by phone or QR chat.",
	  },
};

function cleanPhoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function QrFallback({ label, hint }: { label: string; hint: string }) {
  const filledCells = new Set([0, 1, 2, 4, 7, 8, 9, 11, 16, 18, 21, 22, 24, 27, 29, 30, 32, 35, 36, 37, 39, 43, 45, 47, 48, 50, 53, 54, 55, 56, 58, 61, 63]);

  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-[220px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid h-full w-full grid-cols-8 gap-1">
        {Array.from({ length: 64 }).map((_, index) => (
          <span
            key={index}
            className={`rounded-[3px] ${filledCells.has(index) ? "bg-slate-950" : "bg-slate-100"}`}
          />
        ))}
      </div>
      <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 rounded-lg bg-white/95 px-3 py-2 text-center shadow-sm">
        <p className="text-xs font-black uppercase tracking-wide text-slate-950">{label}</p>
        <p className="mt-0.5 text-[10px] font-semibold text-slate-500">{hint}</p>
      </div>
    </div>
  );
}

function QrCard({
  title,
  subtitle,
  image,
  href,
  copy,
}: {
  title: string;
  subtitle?: string;
  image: string;
  href: string;
  copy: ContactCopy;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(image) && !imageFailed;
  const content = hasImage ? (
    <Image
      src={image}
      alt={title}
      width={260}
      height={260}
      className="mx-auto aspect-square w-full max-w-[220px] rounded-2xl border border-slate-200 bg-white object-cover p-3 shadow-sm"
      onError={() => setImageFailed(true)}
    />
  ) : (
    <QrFallback label={title} hint={copy.qrHint} />
  );

  return (
    <div className="rounded-2xl border border-border bg-white p-5 text-center shadow-sm">
      {content}
      <h3 className="mt-4 text-lg font-black text-slate-950">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{subtitle || (hasImage ? copy.qrHint : copy.noQr)}</p>
      {href ? (
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
          className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-amber-500 hover:text-slate-950"
        >
          <QrCode className="h-4 w-4" />
          {copy.open} {title}
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="mt-4 inline-flex h-10 cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-slate-200 px-4 text-sm font-black text-slate-500"
        >
          <QrCode className="h-4 w-4" />
          {copy.missingAppLink}
        </button>
      )}
    </div>
  );
}

export default function ContactPage() {
  const { language } = useLanguage();
  const siteConfig = useSiteConfig();
  const copy = contactCopy[language];
  const primaryPhone = siteConfig.phones[0]?.value ?? siteConfig.phone;
  const lineHref = siteConfig.lineHref || "";
  const contactQrCodes = siteConfig.contactQrCodes ?? [
    {
      title: copy.webchatQrTitle,
      subtitle: "",
      image: siteConfig.webchatQrImage,
      href: siteConfig.webchatHref,
    },
    {
      title: copy.lineQrTitle,
      subtitle: "",
      image: siteConfig.lineQrImage,
      href: lineHref,
    },
  ];

  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden bg-[#071725] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,158,11,0.18),transparent_34%),linear-gradient(120deg,rgba(10,31,51,0.96),rgba(3,12,23,0.94))]" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 md:py-14">
          <Breadcrumb items={[{ label: copy.breadcrumb }]} className="mb-8 text-white/80" />
          <ScrollReveal>
            <div className="max-w-3xl">
              <span className="text-sm font-black uppercase tracking-widest text-amber-300">{copy.eyebrow}</span>
              <h1 className="mt-4 text-4xl font-black tracking-normal md:text-6xl">{copy.title}</h1>
              <p className="mt-5 text-base leading-relaxed text-slate-200 md:text-lg">{copy.subtitle}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        <div className="grid gap-8">
          <ScrollReveal>
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-sm font-black uppercase tracking-widest text-amber-500">QR CONTACT</span>
                  <h2 className="mt-2 text-2xl font-black text-slate-950 md:text-3xl">{copy.qrTitle}</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{copy.qrSubtitle}</p>
                </div>
                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white sm:flex">
                  <QrCode className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-7 grid gap-5 md:grid-cols-2">
                {contactQrCodes.map((qr) => (
                  <QrCard
                    key={qr.title}
                    title={qr.title}
                    subtitle={qr.subtitle}
                    image={qr.image}
                    href={qr.href ?? ""}
                    copy={copy}
                  />
                ))}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-5">
                  <Clock className="h-5 w-5 text-amber-500" />
                  <h3 className="mt-3 font-black text-slate-950">{copy.responseTitle}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{copy.responseText}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-5">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  <h3 className="mt-3 font-black text-slate-950">{copy.privateTitle}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{copy.privateText}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-950">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-950">{copy.directTitle}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{copy.directText}</p>
                </div>
              </div>

              <div className="mt-7 grid gap-4 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-amber-500" />
                    <h3 className="font-black text-slate-950">{copy.phoneTitle}</h3>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{copy.phoneText}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {siteConfig.phones.map((phone) => (
                      <a
                        key={phone.value}
                        href={cleanPhoneHref(phone.value)}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-amber-400 px-4 text-sm font-black text-slate-950 transition hover:bg-amber-300"
                      >
                        <Phone className="h-4 w-4" />
                        {copy.call} {phone.value}
                      </a>
                    ))}
                  </div>
                </div>

                <Link
                  href={siteConfig.webchatHref}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-amber-300 hover:shadow-md"
                >
                  <MessageCircle className="h-6 w-6 text-amber-500" />
                  <h3 className="mt-4 font-black text-slate-950">{copy.webchatTitle}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{copy.webchatText}</p>
                  <span className="mt-4 inline-flex text-sm font-black text-amber-600">{copy.open}</span>
                </Link>

                <a
                  href={siteConfig.telegramHref}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-300 hover:shadow-md"
                >
                  <Send className="h-6 w-6 text-sky-500" />
                  <h3 className="mt-4 font-black text-slate-950">{copy.telegramTitle}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{copy.telegramText}</p>
                  <span className="mt-4 inline-flex text-sm font-black text-sky-600">{copy.open}</span>
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.12}>
          <div className="mt-8 rounded-2xl bg-slate-950 p-6 text-white shadow-sm md:flex md:items-center md:justify-between md:gap-6 md:p-8">
            <div>
              <h2 className="text-2xl font-black">{siteConfig.name}</h2>
              <p className="mt-2 text-sm text-slate-300">{siteConfig.address}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3 md:mt-0">
              <a
                href={cleanPhoneHref(primaryPhone)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-amber-400 px-5 text-sm font-black text-slate-950 transition hover:bg-amber-300"
              >
                <Phone className="h-4 w-4" />
                {primaryPhone}
              </a>
              <Link
                href={siteConfig.webchatHref}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/20 px-5 text-sm font-black text-white transition hover:border-amber-300 hover:text-amber-200"
              >
                <MessageCircle className="h-4 w-4" />
                WeChat
              </Link>
              <a
                href={siteConfig.telegramHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/20 px-5 text-sm font-black text-white transition hover:border-sky-300 hover:text-sky-200"
              >
                <Send className="h-4 w-4" />
                Telegram
              </a>
            </div>
          </div>
        </ScrollReveal>
      </main>
    </div>
  );
}
