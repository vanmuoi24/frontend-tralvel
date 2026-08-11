"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, Mail, MessageCircle, Phone, Send, Users, X } from "lucide-react";
import type { Language } from "@/providers/language-provider";
import { CreateBooking } from "@/services/Booking/BookingAPI";

type ServiceBookingModalProps = {
  language: Language;
  serviceName: string;
  itemName: string;
  triggerClassName: string;
};

const bookingCopy = {
  zh: {
    trigger: "預訂服務",
    title: "預訂服務",
    subtitle: "請留下需求資訊，客服會通過電話、WeChat、Telegram 或 email 與您確認。",
    service: "服務",
    time: "時間",
    people: "人數",
    phone: "電話號碼",
    email: "Email",
    webchat: "WeChat",
    telegram: "Telegram",
    note: "补充資訊",
    notePlaceholder: "例如：接送地點、酒店、特殊需求...",
    submit: "提交需求",
    close: "關閉",
	    success: "已收到資訊，客服會聯繫您確認服務。",
	    error: "提交失败，請稍後再试或直接聯繫客服。",
	  },
  en: {
    trigger: "Book service",
    title: "Book Service",
    subtitle: "Leave your request and our team will confirm by phone, WeChat, Telegram, or email.",
    service: "Service",
    time: "Time",
    people: "Number of people",
    phone: "Phone number",
    email: "Email",
    webchat: "WeChat",
    telegram: "Telegram",
    note: "Additional notes",
    notePlaceholder: "Example: pickup point, hotel, special requests...",
    submit: "Send request",
    close: "Close",
	    success: "Request received. Our team will contact you to confirm the service.",
	    error: "Could not send request. Please try again or contact us directly.",
	  },
	};

export function ServiceBookingModal({ language, serviceName, itemName, triggerClassName }: ServiceBookingModalProps) {
	  const copy = bookingCopy[language];
	  const [open, setOpen] = useState(false);
	  const [submitted, setSubmitted] = useState(false);
	  const [submitting, setSubmitting] = useState(false);
	  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

	  const submitBooking = async (event: FormEvent<HTMLFormElement>) => {
	    event.preventDefault();
	    setSubmitted(false);
	    setErrorMessage("");
	    setSubmitting(true);

	    const formData = new FormData(event.currentTarget);

	    try {
	      await CreateBooking({
	        serviceName,
	        itemName,
	        requestedTime: String(formData.get("requestedTime") ?? ""),
	        people: Number(formData.get("people") ?? 1),
	        phone: String(formData.get("phone") ?? ""),
	        email: String(formData.get("email") ?? ""),
	        wechat: String(formData.get("wechat") ?? ""),
	        telegram: String(formData.get("telegram") ?? ""),
	        note: String(formData.get("note") ?? ""),
	      });
	      event.currentTarget.reset();
	      setSubmitted(true);
	    } catch (error) {
	      setErrorMessage(error instanceof Error ? error.message : copy.error);
	    } finally {
	      setSubmitting(false);
	    }
	  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={triggerClassName}>
        {copy.trigger}
      </button>

      {open ? createPortal(
        <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-slate-950/70 px-4 py-28 text-slate-950 sm:items-center sm:py-8">
          <div className="relative z-[10000] w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-blue-600">{copy.service}: {serviceName}</p>
                <h2 className="mt-1 text-2xl font-black text-slate-950">{copy.title}</h2>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">{copy.subtitle}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 transition hover:bg-slate-50" aria-label={copy.close}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={submitBooking} className="grid gap-4 p-5">
              <label className="grid gap-1.5">
                <span className="text-sm font-black text-slate-700">{copy.service}</span>
                <input value={itemName} readOnly className="h-11 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none" />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5">
                  <span className="inline-flex items-center gap-2 text-sm font-black text-slate-700"><CalendarDays className="h-4 w-4" /> {copy.time}</span>
	                  <input required name="requestedTime" type="datetime-local" className="h-11 rounded-md border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500" />
                </label>
                <label className="grid gap-1.5">
                  <span className="inline-flex items-center gap-2 text-sm font-black text-slate-700"><Users className="h-4 w-4" /> {copy.people}</span>
	                  <input required name="people" min={1} type="number" className="h-11 rounded-md border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500" />
                </label>
                <label className="grid gap-1.5">
                  <span className="inline-flex items-center gap-2 text-sm font-black text-slate-700"><Phone className="h-4 w-4" /> {copy.phone}</span>
	                  <input required name="phone" type="tel" className="h-11 rounded-md border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500" />
                </label>
                <label className="grid gap-1.5">
                  <span className="inline-flex items-center gap-2 text-sm font-black text-slate-700"><Mail className="h-4 w-4" /> {copy.email}</span>
	                  <input name="email" type="email" className="h-11 rounded-md border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500" />
                </label>
                <label className="grid gap-1.5">
                  <span className="inline-flex items-center gap-2 text-sm font-black text-slate-700"><MessageCircle className="h-4 w-4" /> {copy.webchat}</span>
	                  <input name="wechat" className="h-11 rounded-md border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500" />
                </label>
                <label className="grid gap-1.5">
                  <span className="inline-flex items-center gap-2 text-sm font-black text-slate-700"><Send className="h-4 w-4" /> {copy.telegram}</span>
	                  <input name="telegram" className="h-11 rounded-md border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500" />
                </label>
              </div>

              <label className="grid gap-1.5">
                <span className="text-sm font-black text-slate-700">{copy.note}</span>
	                <textarea name="note" rows={4} placeholder={copy.notePlaceholder} className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500" />
	              </label>

	              {submitted ? (
	                <p className="rounded-md bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">{copy.success}</p>
	              ) : null}
	              {errorMessage ? (
	                <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-black text-red-700">{errorMessage}</p>
	              ) : null}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setOpen(false)} className="h-11 rounded-md border border-slate-200 px-5 text-sm font-black text-slate-700 transition hover:bg-slate-50">
                  {copy.close}
                </button>
	                <button type="submit" disabled={submitting} className="h-11 rounded-md bg-blue-600 px-5 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300">
	                  {submitting ? "..." : copy.submit}
	                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body,
      ) : null}
    </>
  );
}
