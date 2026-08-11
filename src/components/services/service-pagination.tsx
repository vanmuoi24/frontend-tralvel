"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

type PaginationTone = "blue" | "emerald" | "sky" | "orange" | "slate";

type ServicePaginationProps = {
  currentPage: number;
  pageCount: number;
  previousLabel: string;
  nextLabel: string;
  pageLabel?: string;
  tone?: PaginationTone;
  onPageChange: (page: number) => void;
  onPrevious: () => void;
  onNext: () => void;
};

const toneClass: Record<PaginationTone, string> = {
  blue: "border-blue-600 bg-blue-600 text-white",
  emerald: "border-emerald-700 bg-emerald-700 text-white",
  sky: "border-sky-700 bg-sky-700 text-white",
  orange: "border-orange-800 bg-orange-800 text-white",
  slate: "border-blue-600 bg-blue-600 text-white",
};

export function ServicePagination({
  currentPage,
  nextLabel,
  onNext,
  onPageChange,
  onPrevious,
  pageCount,
  pageLabel = "Page",
  previousLabel,
  tone = "blue",
}: ServicePaginationProps) {
  return (
    <nav className="mt-6 flex flex-wrap items-center justify-center gap-3" aria-label={pageLabel}>
      <button
        type="button"
        onClick={onPrevious}
        className="inline-flex h-10 items-center gap-2 rounded-[3px] border border-slate-300 bg-white px-4 text-sm font-black text-slate-800 transition hover:border-slate-950 hover:text-slate-950 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-300 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        {previousLabel}
      </button>

      {Array.from({ length: pageCount }).map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onPageChange(index)}
          className={`h-10 min-w-10 rounded-[3px] border px-3 text-sm font-black transition ${
            index === currentPage
              ? toneClass[tone]
              : "border-slate-300 bg-white text-slate-800 hover:border-slate-950 hover:text-slate-950 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-300 dark:hover:text-white"
          }`}
          aria-label={`${pageLabel} ${index + 1}`}
          aria-current={index === currentPage ? "page" : undefined}
        >
          {index + 1}
        </button>
      ))}

      <button
        type="button"
        onClick={onNext}
        className="inline-flex h-10 items-center gap-2 rounded-[3px] border border-slate-300 bg-white px-4 text-sm font-black text-slate-800 transition hover:border-slate-950 hover:text-slate-950 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-300 dark:hover:text-white"
      >
        {nextLabel}
        <ArrowRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
