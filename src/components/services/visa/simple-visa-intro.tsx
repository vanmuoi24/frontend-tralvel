"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BadgeCheck, FileCheck2, FileText, Globe2, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { slugify } from "@/lib/slugify";
import { ServicePagination } from "@/components/services/service-pagination";

export function SimpleVisaIntro({ serviceId }: { serviceId: string }) {
  const { language } = useLanguage();
  const [page, setPage] = useState(0);
  const copy = {
    zh: {
      eyebrow: "越南 e-Visa 支援服務",
      title: "簽證服務先做簡單清楚：資料提醒與基礎協助",
      description: "如果你還不想把 visa 做成很複雜的業務，這样最合理：告诉客人需要準備什么、幫他们檢查明顯錯誤、提醒查詢結果和列印文件。官方申請和審批仍以越南 e-Visa 繫統為準。",
      officialNote: "官方参考：e-Visa 最長 90 天，可選單次或多次入境；申請與審批以越南 e-Visa 繫統為準。",
      cta: "諮詢簽證支援",
      checklistCta: "查看資料清單",
      supportTitle: "可以提供的幫助",
      supportCards: [
        { title: "資料準備提醒", text: "提醒護照、證件照、入境日期、出入口岸、酒店地址、信箱和付款方式。" },
        { title: "提交前檢查", text: "幫客人檢查姓名、護照號、日期、照片規格和口岸等明顯容易填錯的地方。" },
        { title: "出發前提醒", text: "提醒查詢結果、下载/列印 e-Visa，並核對入境資訊是否與行程一致。" },
      ],
      docsTitle: "常见需要準備",
      docs: ["護照資料頁清晰照片", "白底證件照 / 電子照片", "入境日期、停留天數、出入口岸", "在越地址、酒店或聯繫人資訊", "可用信箱與付款方式"],
      processTitle: "服務流程",
      process: ["確認客人國籍、入境日期和停留計劃", "整理護照、照片、地址和出入口岸資訊", "提醒查詢結果、下载列印並随身携帶"],
      supportFocus: "資料支援重点",
      note: "我们會先確認人數、資料複雜度和是否需要加急協助，再安排合適支援。",
      disclaimer: "簽證不是保證通過的服務。An Khai Travel 只做資料整理、檢查提醒和流程協助；是否批準由主管機關决定。",
      previous: "上一頁",
      next: "下一頁",
      page: "頁",
    },
    en: {
      eyebrow: "Vietnam e-Visa Support",
      title: "Keep visa service simple: document reminders and basic support",
      description: "If you do not want visa service to become too complex yet, this is the right shape: tell guests what to prepare, check obvious mistakes, and remind them to search results and print documents. Official submission and approval remain with the Vietnam e-Visa system.",
      officialNote: "Official reference: e-Visa can be valid up to 90 days with single or multiple entry; application and approval remain with the Vietnam e-Visa system.",
      cta: "Ask for visa support",
      checklistCta: "View checklist",
      supportTitle: "What we can help with",
      supportCards: [
        { title: "Preparation reminders", text: "Passport, portrait photo, entry date, border gates, hotel address, email, and payment method." },
        { title: "Pre-submit check", text: "Review obvious error points such as name, passport number, dates, photo format, and border gates." },
        { title: "Before-travel reminders", text: "Remind guests to check results, download/print e-Visa, and verify entry details." },
      ],
      docsTitle: "Common items to prepare",
      docs: ["Clear passport data-page photo", "White-background portrait / digital photo", "Entry date, stay length, entry and exit gates", "Vietnam address, hotel, or contact details", "Working email and payment method"],
      processTitle: "Service flow",
      process: ["Confirm nationality, entry date, and stay plan", "Organize passport, photo, address, and border-gate details", "Remind result search, download, print, and carry-on checks"],
      supportFocus: "Support focus",
      note: "We confirm headcount, document complexity, and urgent-support needs before arranging the right support.",
      disclaimer: "Visa is not a guaranteed-approval service. An Khai Travel only provides document organization, review reminders, and process support; approval is decided by the competent authority.",
      previous: "Previous",
      next: "Next",
      page: "Page",
    },
  }[language];
  const pageSize = 4;
  const pageCount = Math.max(1, Math.ceil(copy.supportCards.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const currentCards = copy.supportCards.slice(currentPage * pageSize, currentPage * pageSize + pageSize);
  const changePage = (nextPage: number) => setPage(Math.max(0, Math.min(nextPage, pageCount - 1)));

  return (
    <section className="mx-auto max-w-7xl">
      <div className="overflow-hidden rounded-lg bg-[#082f49] text-white shadow-xl">
        <div className="grid gap-8 px-5 py-10 md:px-8 lg:grid-cols-[1fr_380px] lg:py-14">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-black text-sky-100">
              <BadgeCheck className="h-4 w-4 text-[#93c5fd]" />
              {copy.eyebrow}
            </p>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-normal md:text-5xl">{copy.title}</h1>
            <p className="mt-5 max-w-2xl text-base font-semibold leading-relaxed text-white/82">{copy.description}</p>
            <p className="mt-4 max-w-2xl rounded border border-sky-200/20 bg-white/10 p-3 text-sm font-bold leading-relaxed text-sky-50">{copy.officialNote}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={`/contact?service=${serviceId}`} className="inline-flex h-12 items-center rounded-md bg-[#93c5fd] px-6 text-sm font-black text-[#082f49] transition hover:bg-[#bfdbfe]">
                {copy.cta} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a href="#visa-simple-checklist" className="inline-flex h-12 items-center rounded border border-white/45 px-6 text-sm font-black text-white transition hover:bg-white/10">
                {copy.checklistCta}
              </a>
            </div>
          </div>
          <div className="rounded-lg bg-white p-5 text-slate-950 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0ea5e9] text-white">
                <FileCheck2 className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm font-black text-[#0369a1]">{copy.supportFocus}</p>
                <p className="text-xs font-bold text-slate-500">evisa.gov.vn</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {copy.supportCards.map((card) => (
                <div key={card.title} className="rounded bg-sky-50 p-3">
                  <p className="text-sm font-black text-[#0369a1]">{card.title}</p>
                  <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{card.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs font-bold leading-relaxed text-slate-500">{copy.note}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="text-2xl font-black text-slate-950">{copy.supportTitle}</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
	            {currentCards.map((card) => (
	              <article key={card.title} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-[#0369a1] sm:h-12 sm:w-12 sm:rounded-2xl">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="mt-4 line-clamp-2 text-sm font-black text-slate-950 sm:mt-5 sm:text-lg">{card.title}</h3>
                <p className="mt-2 line-clamp-3 text-xs font-semibold leading-relaxed text-slate-600 sm:mt-3 sm:text-sm">{card.text}</p>
                <Link href={`/services/${serviceId}/${slugify(card.title)}`} className="mt-3 inline-flex text-xs font-black text-[#0369a1] hover:underline sm:mt-4 sm:text-sm">
                  {language === "zh" ? "詳情" : "View details"}
                </Link>
	              </article>
	            ))}
	          </div>
            <ServicePagination
              currentPage={currentPage}
              pageCount={pageCount}
              previousLabel={copy.previous}
              nextLabel={copy.next}
              pageLabel={copy.page}
              tone="sky"
              onPageChange={changePage}
              onPrevious={() => changePage(currentPage - 1)}
              onNext={() => changePage(currentPage + 1)}
            />

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-[#0369a1]" />
                <h2 className="text-lg font-black text-slate-950">{copy.processTitle}</h2>
              </div>
              <div className="mt-5 grid gap-3">
                {copy.process.map((step, index) => (
                  <div key={step} className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0369a1] text-sm font-black text-white">{index + 1}</span>
                    <p className="pt-1 text-sm font-bold leading-relaxed text-slate-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-950">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                <p className="text-sm font-bold leading-relaxed">{copy.disclaimer}</p>
              </div>
            </div>
          </div>
        </div>

        <aside id="visa-simple-checklist" className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-36">
          <h2 className="text-lg font-black text-slate-950">{copy.docsTitle}</h2>
          <div className="mt-5 grid gap-3">
            {copy.docs.map((doc) => (
              <p key={doc} className="flex items-start gap-2 text-sm font-bold leading-relaxed text-slate-700">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                {doc}
              </p>
            ))}
          </div>
          <Link href={`/contact?service=${serviceId}`} className="mt-5 flex h-11 items-center justify-center rounded-md bg-[#0369a1] px-4 text-sm font-black text-white transition hover:bg-[#075985]">
            {copy.cta}
          </Link>
        </aside>
      </div>
    </section>
  );
}
