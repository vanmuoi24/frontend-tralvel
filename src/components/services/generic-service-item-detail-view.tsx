"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, CalendarDays, Check, Images, Luggage, MapPin, MessageCircle, PlaneLanding, PlaneTakeoff, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { ServiceOption } from "@/data/service-detail-catalog";
import { useLanguage } from "@/providers/language-provider";
import { slugify, titleFromSlug } from "@/lib/slugify";
import { ServiceBookingModal } from "@/components/services/service-booking-modal";

type GenericServiceItemDetailViewProps = {
  serviceId: string;
  itemSlug: string;
  option?: ServiceOption;
  serviceLabel?: string;
};

const galleryByService: Record<string, string[]> = {
  visa: ["/anhnenvisa.png", "/anh1.png", "/anh2.png", "/anh3.png", "/anh4.png", "/anh5.png"],
  "flight-ticket": ["/anhnendichvubanvemaybay.png", "/anh2.png", "/anh3.png", "/anh4.png", "/anh6.png", "/anh7.png"],
  spa: ["/anhnenspa.png", "/spa1.jpeg", "/spa2.jpeg", "/spa3.jpeg", "/spa4.jpeg", "/spa5.jpeg", "/spa6.jpeg"],
  sim: ["/dichvuthuesim.png", "/anh1.png", "/anh2.png", "/anh3.png", "/anh4.png", "/anh5.png"],
  restaurant: ["/anhnennhahangdoan.png", "/nhahang1.jpeg", "/nhahang2.jpeg", "/nhahang3.jpeg", "/nhahang4.jpeg", "/nhahang5.jpeg"],
  "ktv-massage": ["/anhnenkaraok.png", "/kara1.jpeg", "/kara2.jpeg", "/kara3.jpeg", "/kara4.jpeg", "/kara5.jpeg", "/kara7.jpeg"],
  "tour-guide": ["/anh1.png", "/anh2.png", "/anh3.png", "/anh4.png", "/anh5.png", "/anh6.png"],
};

const serviceName: Record<string, { zh: string; en: string }> = {
  visa: { zh: "Visa", en: "Visa" },
  "flight-ticket": { zh: "機票", en: "Flight ticket" },
  spa: { zh: "Spa", en: "Spa" },
  sim: { zh: "旅遊 SIM", en: "Travel SIM" },
  restaurant: { zh: "餐廳", en: "Restaurant" },
  "ktv-massage": { zh: "KTV Karaoke", en: "KTV Karaoke" },
  "tour-guide": { zh: "導遊", en: "Tour guide" },
};

type LocalizedText = { zh: string; en: string };
type DetailField = { label: LocalizedText; value: LocalizedText | string };
type DetailOverride = {
  title: LocalizedText;
  description: LocalizedText;
  fields: DetailField[];
  includes: { zh: string[]; en: string[] };
  images?: string[];
};

function field(label: LocalizedText, value: LocalizedText | string): DetailField {
  return { label, value };
}

function detail(
  title: LocalizedText,
  description: LocalizedText,
  fields: DetailField[],
  includes: { zh: string[]; en: string[] },
  images?: string[],
): DetailOverride {
  return { title, description, fields, includes, images };
}

const detailOverrides: Record<string, Record<string, DetailOverride>> = {
  "flight-ticket": Object.fromEntries([
    detail(
      { zh: "Vietnam Airlines VN 218", en: "Vietnam Airlines VN 218" },
      { zh: "胡志明市飞往河內的國內航線，適合商務或旅遊客人。", en: "Domestic route from Ho Chi Minh City to Hanoi for business or leisure guests." },
      [
        field({ zh: "航空公司", en: "Airline" }, "Vietnam Airlines"),
        field({ zh: "航班代碼", en: "Flight code" }, "VN 218"),
        field({ zh: "航線", en: "Route" }, "SGN → HAN"),
        field({ zh: "行李", en: "Baggage" }, { zh: "含 23kg 托運行李", en: "23kg checked baggage included" }),
      ],
      { zh: ["合適航線諮詢", "行李確認", "飞行前證件提醒"], en: ["Suitable route consultation", "Baggage check", "Pre-flight document reminders"] },
    ),
    detail(
      { zh: "Vietjet Air VJ 132", en: "Vietjet Air VJ 132" },
      { zh: "SGN 至峴港航線，適合海邊行程或短期商務。", en: "SGN to Da Nang route, suitable for beach trips or short business plans." },
      [
        field({ zh: "航空公司", en: "Airline" }, "Vietjet Air"),
        field({ zh: "航班代碼", en: "Flight code" }, "VJ 132"),
        field({ zh: "航線", en: "Route" }, "SGN → DAD"),
        field({ zh: "行李", en: "Baggage" }, { zh: "7kg 随身行李", en: "7kg carry-on baggage" }),
      ],
      { zh: ["可協助加購行李", "合適航空公司諮詢", "預訂資訊调整支援"], en: ["Baggage add-on support", "Suitable airline consultation", "Booking-info support"] },
    ),
    detail(
      { zh: "Bamboo Airways QH 203", en: "Bamboo Airways QH 203" },
      { zh: "河內至富國島航線，適合家庭或度假客人。", en: "Hanoi to Phu Quoc route for families or leisure guests." },
      [
        field({ zh: "航空公司", en: "Airline" }, "Bamboo Airways"),
        field({ zh: "航班代碼", en: "Flight code" }, "QH 203"),
        field({ zh: "航線", en: "Route" }, "HAN → PQC"),
        field({ zh: "行李", en: "Baggage" }, { zh: "含 20kg 托運行李", en: "20kg checked baggage included" }),
      ],
      { zh: ["適合家庭", "行李諮詢", "可搭配機場接送"], en: ["Family friendly", "Baggage consultation", "Can pair with airport transfer"] },
    ),
    detail(
      { zh: "Thai Airways TG 557", en: "Thai Airways TG 557" },
      { zh: "SGN 至曼谷國際航線，適合轉機或泰國旅行。", en: "International SGN to Bangkok route for transit or Thailand travel." },
      [
        field({ zh: "航空公司", en: "Airline" }, "Thai Airways"),
        field({ zh: "航班代碼", en: "Flight code" }, "TG 557"),
        field({ zh: "航線", en: "Route" }, "SGN → BKK"),
        field({ zh: "行李", en: "Baggage" }, { zh: "含 30kg 托運行李", en: "30kg checked baggage included" }),
      ],
      { zh: ["轉機諮詢", "國際行李確認", "團隊機票支援"], en: ["Transit consultation", "International baggage check", "Group-ticket support"] },
    ),
  ].map((item) => [slugify(item.title.en), item])),
  spa: Object.fromEntries([
    detail({ zh: "足部舒缓按摩", en: "Foot Relief Massage" }, { zh: "適合逛街、飞行後放鬆腿部，包含足底、肩颈和熱毛巾護理。", en: "Ideal after flights or city walks, with foot pressure work, neck relief, and warm towel care." }, [field({ zh: "類型", en: "Type" }, { zh: "足療", en: "Foot therapy" }), field({ zh: "時長", en: "Duration" }, "60 min"), field({ zh: "區域", en: "Area" }, { zh: "酒店附近推薦", en: "Near-hotel options" })], { zh: ["酒店附近推薦", "可安排雙人房", "適合當天預约"], en: ["Near-hotel options", "Couple rooms available", "Same-day booking"] }, ["/spa1.jpeg", "/spa2.jpeg", "/spa3.jpeg", "/spa4.jpeg"]),
    detail({ zh: "全身精油按摩", en: "Aroma Body Massage" }, { zh: "舒缓肩颈、背部和腰腿疲劳，適合旅行中需要深度放鬆的客人。", en: "Relieves shoulder, back, and leg fatigue for travelers who want deeper relaxation." }, [field({ zh: "類型", en: "Type" }, { zh: "全身按摩", en: "Body massage" }), field({ zh: "時長", en: "Duration" }, "90 min"), field({ zh: "空間", en: "Room style" }, { zh: "安静包間", en: "Quiet private rooms" })], { zh: ["精油護理", "安静包間", "可選力度"], en: ["Aroma oils", "Quiet private rooms", "Pressure choice"] }, ["/spa2.jpeg", "/spa1.jpeg", "/spa5.jpeg", "/spa6.jpeg"]),
    detail({ zh: "熱石深層護理", en: "Hot Stone Deep Care" }, { zh: "熱石配合全身護理，適合長途飞行、商務行程後的恢復。", en: "Hot stone therapy with full-body care, suited for recovery after long flights or business days." }, [field({ zh: "類型", en: "Type" }, { zh: "深層放鬆", en: "Deep relaxation" }), field({ zh: "時長", en: "Duration" }, "120 min"), field({ zh: "適合", en: "Best for" }, { zh: "長途飞行後", en: "After long flights" })], { zh: ["熱石護理", "高級門店", "適合贵賓"], en: ["Hot stone care", "Premium venues", "VIP friendly"] }, ["/spa3.jpeg", "/spa4.jpeg", "/spa5.jpeg", "/spa6.jpeg"]),
    detail({ zh: "雙人情侶套餐", en: "Couple Spa Package" }, { zh: "雙人同房護理，可搭配精油、足療或輕面部護理，適合情侶和朋友。", en: "Shared room treatment with aroma, foot therapy, or light facial care for couples and friends." }, [field({ zh: "類型", en: "Type" }, { zh: "雙人套餐", en: "Couple package" }), field({ zh: "時長", en: "Duration" }, "100 min"), field({ zh: "房間", en: "Room" }, { zh: "雙人房", en: "Couple room" })], { zh: ["雙人房", "套餐組合", "可提前訂位"], en: ["Couple room", "Flexible bundle", "Advance booking"] }, ["/spa4.jpeg", "/spa2.jpeg", "/spa1.jpeg", "/spa6.jpeg"]),
    detail({ zh: "越式草本護理", en: "Vietnamese Herbal Ritual" }, { zh: "融合草本熱敷、身體按摩和放鬆護理，體驗更有越南特色。", en: "A Vietnamese-inspired ritual with herbal compress, body massage, and calming care." }, [field({ zh: "類型", en: "Type" }, { zh: "特色護理", en: "Signature ritual" }), field({ zh: "時長", en: "Duration" }, "120 min"), field({ zh: "特点", en: "Signature" }, { zh: "草本熱敷", en: "Herbal compress" })], { zh: ["草本熱敷", "特色體驗", "適合遊客"], en: ["Herbal compress", "Local signature", "Traveler favorite"] }, ["/spa5.jpeg", "/spa3.jpeg", "/spa2.jpeg", "/spa4.jpeg"]),
    detail({ zh: "面部补水護理", en: "Hydrating Facial Care" }, { zh: "清潔、补水和舒缓肌肤，適合晒後、熬夜或行程密集的客人。", en: "Cleanses, hydrates, and calms skin after sun exposure, late nights, or packed schedules." }, [field({ zh: "類型", en: "Type" }, { zh: "面部護理", en: "Facial care" }), field({ zh: "時長", en: "Duration" }, "75 min"), field({ zh: "適合", en: "Best for" }, { zh: "晒後 / 熬夜", en: "After-sun / late nights" })], { zh: ["补水舒缓", "晒後護理", "輕鬆恢復"], en: ["Hydrating care", "After-sun support", "Easy recovery"] }, ["/spa6.jpeg", "/spa1.jpeg", "/spa4.jpeg", "/spa5.jpeg"]),
  ].map((item) => [slugify(item.title.en), item])),
  restaurant: Object.fromEntries([
    { image: "/anh3.png", title: { zh: "西贡越南風味餐廳", en: "Saigon Local Taste" }, area: { zh: "第 1 郡 · 市中心", en: "District 1 · Downtown" }, cuisine: { zh: "越南菜", en: "Vietnamese cuisine" }, rating: "4.8", desc: { zh: "適合第一次来越南的客人，经典越南菜、春卷、河粉和團隊套餐都可安排。", en: "Great for first-time visitors, with classic Vietnamese dishes, spring rolls, pho, and group menus." }, tags: { zh: ["本地味道", "團隊訂位", "中文協助"], en: ["Local taste", "Group booking", "Chinese support"] } },
    { image: "/anh2.png", title: { zh: "峴港滨海海鲜餐廳", en: "Da Nang Coastal Seafood" }, area: { zh: "美溪海滩 / 海邊", en: "My Khe Beach / seaside" }, cuisine: { zh: "海鲜", en: "Seafood" }, rating: "4.7", desc: { zh: "適合家庭和團隊，海鲜套餐、包廂、大桌和接待菜單可提前確認。", en: "Ideal for families and groups, with seafood sets, private rooms, large tables, and hosted menus." }, tags: { zh: ["海鲜套餐", "包廂", "大桌"], en: ["Seafood sets", "Private room", "Large tables"] } },
    { image: "/nhahang3.jpeg", title: { zh: "河內高端商務晚餐", en: "Hanoi Premium Business Dinner" }, area: { zh: "還剑湖 / 西湖", en: "Hoan Kiem / West Lake" }, cuisine: { zh: "高端菜單", en: "Fine dining" }, rating: "4.9", desc: { zh: "適合商務接待、贵賓晚餐和纪念日，可安排安静座位、酒水和專屬菜單。", en: "For business hosting, VIP dinners, and anniversaries with quiet seating, drinks, and curated menus." }, tags: { zh: ["商務接待", "安静座位", "高級體驗"], en: ["Business hosting", "Quiet seating", "Premium experience"] } },
    { image: "/nhahang4.jpeg", title: { zh: "火锅烧烤聚餐", en: "Hotpot and Grill Gathering" }, area: { zh: "第 3 郡 / 第 7 郡", en: "District 3 / District 7" }, cuisine: { zh: "火锅烧烤", en: "Hotpot and grill" }, rating: "4.6", desc: { zh: "適合朋友聚會和團隊晚餐，可選火锅、烧烤、飲品套餐和半私密座位。", en: "Good for friends and teams with hotpot, grill, drink bundles, and semi-private seating." }, tags: { zh: ["聚餐", "飲品套餐", "熱鬧氛圍"], en: ["Group meal", "Drink bundle", "Lively mood"] } },
    { image: "/nhahang5.jpeg", title: { zh: "大叻家庭越南菜套餐", en: "Da Lat Family Vietnamese Set" }, area: { zh: "春香湖 / 夜市附近", en: "Xuan Huong Lake / Night Market" }, cuisine: { zh: "家庭餐", en: "Family meal" }, rating: "4.7", desc: { zh: "按酒店位置推薦方便餐廳，適合老人、小孩和輕鬆用餐的家庭行程。", en: "Matched by hotel location, suitable for families with kids, seniors, and relaxed meal plans." }, tags: { zh: ["適合家庭", "酒店附近", "口味温和"], en: ["Family friendly", "Near hotel", "Mild flavors"] } },
    { image: "/nhahang6.jpeg", title: { zh: "屋頂景观餐廳", en: "Rooftop View Restaurant" }, area: { zh: "阮惠 / 西贡河", en: "Nguyen Hue / Saigon River" }, cuisine: { zh: "景观晚餐", en: "View dinner" }, rating: "4.8", desc: { zh: "適合生日、约會和贵賓接待，可提前確認窗邊位或露臺位。", en: "Great for birthdays, dates, and VIP hosting with window or terrace seating checked ahead." }, tags: { zh: ["夜景", "生日", "露臺位"], en: ["Night view", "Birthday", "Terrace seats"] } },
    { image: "/nhahang7.jpeg", title: { zh: "富國島團體海鲜包廂", en: "Phu Quoc Seafood Private Room" }, area: { zh: "阳東 / 海滩區", en: "Duong Dong / Beach area" }, cuisine: { zh: "海鲜包廂", en: "Seafood private room" }, rating: "4.7", desc: { zh: "適合 8-20 人團隊，菜單、預算、上菜時間和包廂可提前確認。", en: "For 8-20 guests, with menu, serving time, and room setup confirmed in advance." }, tags: { zh: ["8-20 人", "包廂", "團隊"], en: ["8-20 guests", "Private room", "Group friendly"] } },
    { image: "/nhahang8.jpeg", title: { zh: "深夜小吃與啤酒", en: "Late-night Bites and Beer" }, area: { zh: "碧文街 / 市中心", en: "Bui Vien / Downtown" }, cuisine: { zh: "小吃啤酒", en: "Bites and beer" }, rating: "4.5", desc: { zh: "適合夜遊後續摊，輕鬆小吃、啤酒和熱鬧氛圍，可按人數推薦。", en: "A relaxed after-hours option with snacks, beer, and lively venues matched by group size." }, tags: { zh: ["夜宵", "啤酒", "輕鬆"], en: ["Late night", "Beer", "Casual"] } },
    { image: "/nhahang1.jpeg", title: { zh: "峴港本地越南菜", en: "Da Nang Local Vietnamese Table" }, area: { zh: "韩江 / 市中心", en: "Han River / Downtown" }, cuisine: { zh: "越南菜", en: "Vietnamese cuisine" }, rating: "4.6", desc: { zh: "適合家庭和小團體，提供中部特色菜、海鲜小炒和舒適座位。", en: "Good for families and small groups, with Central Vietnam dishes, seafood stir-fries, and comfortable seating." }, tags: { zh: ["中部特色", "靠近韩江", "家庭友好"], en: ["Central flavors", "Near Han River", "Family friendly"] } },
    { image: "/nhahang2.jpeg", title: { zh: "河內老城特色餐廳", en: "Hanoi Old Quarter Specialties" }, area: { zh: "老城區 / 還剑湖", en: "Old Quarter / Hoan Kiem" }, cuisine: { zh: "北部越南菜", en: "Northern Vietnamese" }, rating: "4.7", desc: { zh: "適合想體驗河內風味的客人，可安排本地菜、米粉、烤肉和團隊菜單。", en: "For guests who want Hanoi flavors, with local dishes, noodles, grilled pork, and group menus." }, tags: { zh: ["老城區", "北部風味", "團隊菜單"], en: ["Old Quarter", "Northern taste", "Group menu"] } },
    { image: "/nhahang3.jpeg", title: { zh: "大叻暖心火锅", en: "Da Lat Warm Hotpot" }, area: { zh: "夜市 / 山景區", en: "Night Market / Hill view" }, cuisine: { zh: "火锅", en: "Hotpot" }, rating: "4.6", desc: { zh: "大叻天氣凉爽，適合安排火锅、烧烤和朋友聚餐，可按人數訂位。", en: "Da Lat’s cool weather is perfect for hotpot, grill, and group dinners matched by guest count." }, tags: { zh: ["大叻夜市", "火锅", "朋友聚餐"], en: ["Da Lat night market", "Hotpot", "Friends dinner"] } },
    { image: "/nhahang4.jpeg", title: { zh: "富國島海景晚餐", en: "Phu Quoc Ocean View Dinner" }, area: { zh: "長滩 / 度假區", en: "Long Beach / Resort area" }, cuisine: { zh: "海景餐廳", en: "Ocean-view dining" }, rating: "4.8", desc: { zh: "適合情侶、家庭和贵賓晚餐，可提前確認海景位、日落時間和套餐。", en: "For couples, families, and VIP dinners with ocean-view seats, sunset timing, and set menus confirmed." }, tags: { zh: ["海景", "日落", "度假晚餐"], en: ["Ocean view", "Sunset", "Resort dinner"] } },
  ].map((item) => [
    slugify(item.title.en),
    detail(item.title, item.desc, [
      field({ zh: "區域 / 地址", en: "Area / address" }, item.area),
      field({ zh: "菜繫", en: "Cuisine" }, item.cuisine),
      field({ zh: "評分", en: "Rating" }, item.rating),
      field({ zh: "適合", en: "Best for" }, { zh: item.tags.zh.join(", "), en: item.tags.en.join(", ") }),
    ], item.tags, [item.image, "/anhnennhahangdoan.png", "/nhahang1.jpeg", "/nhahang2.jpeg", "/nhahang3.jpeg"])
  ])),
  sim: Object.fromEntries([
    { title: { zh: "15 天旅遊 SIM", en: "15-day Travel SIM" }, data: { zh: "3GB / 天", en: "3GB / day" }, duration: { zh: "15 天", en: "15 days" }, pickup: { zh: "機場 / 酒店交付", en: "Airport / hotel delivery" }, desc: { zh: "適合短期旅行、城市遊和輕度影片使用，到達後可快速激活。", en: "Good for short trips, city travel, and light video use, with quick activation after arrival." }, tags: { zh: ["實體 SIM", "快速激活", "全國覆蓋"], en: ["Physical SIM", "Quick activation", "Nationwide coverage"] } },
    { title: { zh: "30 天高速流量 SIM", en: "30-day High-speed SIM" }, data: { zh: "5GB / 天", en: "5GB / day" }, duration: { zh: "30 天", en: "30 days" }, pickup: { zh: "酒店 / 市區交付", en: "Hotel / city delivery" }, desc: { zh: "適合越南多城市行程，導航、打車、社交和日常影片更穩定。", en: "Best for multi-city Vietnam trips, stable for maps, ride-hailing, social apps, and daily video." }, tags: { zh: ["高流量", "適合多城市", "可團隊購買"], en: ["High data", "Multi-city friendly", "Group purchase"] } },
    { title: { zh: "越南旅遊 eSIM", en: "Vietnam Travel eSIM" }, data: { zh: "每日高速流量", en: "Daily high-speed data" }, duration: { zh: "15-30 天", en: "15-30 days" }, pickup: { zh: "線上二維碼安裝", en: "Online QR setup" }, desc: { zh: "無需換卡，適合支援 eSIM 的手機，出發前即可安裝。", en: "No card swap needed. Install before departure on compatible eSIM phones." }, tags: { zh: ["無需實體卡", "出發前安裝", "二維碼開通"], en: ["No physical card", "Install before travel", "QR activation"] } },
    { title: { zh: "無限流量短期套餐", en: "Short-stay Unlimited Data" }, data: { zh: "不限量", en: "Unlimited" }, duration: { zh: "7-10 天", en: "7-10 days" }, pickup: { zh: "機場領取", en: "Airport pickup" }, desc: { zh: "適合直播、影片、辦公熱點需求較高的短期客人。", en: "For short-stay guests who need streaming, video, work apps, or hotspot-heavy use." }, tags: { zh: ["不限量", "適合熱點", "短期旅行"], en: ["Unlimited data", "Hotspot friendly", "Short-trip ready"] } },
    { title: { zh: "團隊 SIM 批量套餐", en: "Group SIM Bundle" }, data: { zh: "按人數配置", en: "Configured by group size" }, duration: { zh: "按行程天數", en: "By itinerary length" }, pickup: { zh: "機場 / 酒店統一交付", en: "Airport / hotel batch delivery" }, desc: { zh: "適合旅遊團、商務團和家庭團，可統一激活、貼標簽和分發。", en: "For tour groups, business teams, and families with batch activation, labeling, and delivery." }, tags: { zh: ["團隊交付", "統一激活", "按人數安排"], en: ["Group delivery", "Batch activation", "Arranged by headcount"] } },
    { title: { zh: "長期停留 eSIM", en: "Long-stay eSIM" }, data: { zh: "30-60 天流量", en: "30-60 day data" }, duration: { zh: "30-60 天", en: "30-60 days" }, pickup: { zh: "線上安裝支援", en: "Online setup support" }, desc: { zh: "適合商務停留、探親和長線行程，可按天數匹配方案。", en: "For business stays, family visits, and longer trips, matched by travel length." }, tags: { zh: ["長期方案", "線上支援", "無需換卡"], en: ["Long-stay plans", "Online support", "No card swap"] } },
    { title: { zh: "越南通話 + 流量 SIM", en: "Vietnam Call + Data SIM" }, data: { zh: "流量 + 本地通話", en: "Data + local calls" }, duration: { zh: "30 天", en: "30 days" }, pickup: { zh: "市區 / 酒店交付", en: "City / hotel delivery" }, desc: { zh: "適合需要聯繫司機、酒店和本地服務的客人，含基礎本地通話。", en: "Useful when calling drivers, hotels, and local services, with basic local calls included." }, tags: { zh: ["本地號碼", "含通話", "適合商務"], en: ["Local number", "Calls included", "Business friendly"] } },
    { title: { zh: "高強度辦公流量卡", en: "Heavy-use Work Data Plan" }, data: { zh: "高速大流量", en: "High-volume data" }, duration: { zh: "30 天", en: "30 days" }, pickup: { zh: "酒店交付 / 線上開通", en: "Hotel delivery / online setup" }, desc: { zh: "適合遠程辦公、熱點共享和長期影片會议使用。", en: "Designed for remote work, hotspot sharing, and longer video meeting usage." }, tags: { zh: ["辦公推薦", "熱點共享", "高強度使用"], en: ["Work-ready", "Hotspot sharing", "Heavy usage"] } },
  ].map((item) => [slugify(item.title.en), detail(item.title, item.desc, [field({ zh: "流量", en: "Data" }, item.data), field({ zh: "有效期", en: "Validity" }, item.duration), field({ zh: "領取 / 安裝", en: "Pickup / setup" }, item.pickup)], item.tags, ["/dichvuthuesim.png", "/anh1.png", "/anh2.png", "/anh3.png"])])),
  "ktv-massage": Object.fromEntries([
    { image: "/kara1.jpeg", title: { zh: "Supreme KTV", en: "Supreme KTV" }, category: { zh: "私人包廂", en: "Private room" }, place: { zh: "胡志明市中心", en: "Central Ho Chi Minh City" }, time: "17:00 - 02:00", pax: "3-6", tags: { zh: ["適合小團體", "可提前確認包廂", "飲品套餐可諮詢"], en: ["Good for small groups", "Room availability confirmed first", "Drink packages by request"] } },
    { image: "/kara2.jpeg", title: { zh: "Velvet Room", en: "Velvet Room" }, category: { zh: "私人包廂", en: "Private room" }, place: { zh: "第一區 / 酒店附近", en: "District 1 / near hotels" }, time: "18:00 - 01:00", pax: "2-8", tags: { zh: ["環境安静", "適合商務接待", "可安排預訂"], en: ["Quiet setting", "Good for hosting", "Advance booking available"] } },
    { image: "/kara3.jpeg", title: { zh: "Pub 28", en: "Pub 28" }, category: { zh: "KTV Lounge", en: "KTV lounge" }, place: { zh: "市中心娛樂區", en: "Central nightlife area" }, time: "17:00 - 03:00", pax: "3-6", tags: { zh: ["唱歌與飲品", "適合朋友聚會", "位置方便"], en: ["Karaoke and drinks", "Good for friends", "Convenient area"] } },
    { image: "/kara4.jpeg", title: { zh: "Iconic KTV", en: "Iconic KTV" }, category: { zh: "團隊包廂", en: "Group room" }, place: { zh: "第三區", en: "District 3" }, time: "16:00 - Late", pax: "4-10", tags: { zh: ["音響設備好", "適合團隊", "可諮詢飲品套餐"], en: ["Good sound system", "Fits groups", "Drink packages by request"] } },
    { image: "/kara5.jpeg", title: { zh: "Galaxy Karaoke", en: "Galaxy Karaoke" }, category: { zh: "團隊包廂", en: "Group room" }, place: { zh: "第一區", en: "District 1" }, time: "18:00 - 02:00", pax: "4-8", tags: { zh: ["適合朋友聚會", "房型選擇多", "可提前訂位"], en: ["Great for friend groups", "Multiple room sizes", "Advance booking"] } },
    { image: "/kara6.jpeg", title: { zh: "Relax Massage", en: "Relax Massage" }, category: { zh: "按摩放鬆", en: "Massage" }, place: { zh: "酒店附近", en: "Near hotel" }, time: "12:00 - 23:00", pax: "1-4", tags: { zh: ["足部 / 全身可選", "按區域推薦", "先確認時段"], en: ["Foot or body options", "Matched by area", "Time slot confirmed first"] } },
    { image: "/kara7.jpeg", title: { zh: "Moonlight KTV", en: "Moonlight KTV" }, category: { zh: "KTV Lounge", en: "KTV lounge" }, place: { zh: "阮惠街附近", en: "Near Nguyen Hue" }, time: "7 PM - Late", pax: "5-10", tags: { zh: ["氣氛活跃", "團隊首選", "適合續摊"], en: ["Lively atmosphere", "Group friendly", "Good after-dinner option"] } },
    { image: "/kara8.jpeg", title: { zh: "Neon Club", en: "Neon Club" }, category: { zh: "Pub & KTV", en: "Pub and KTV" }, place: { zh: "裴援街", en: "Bui Vien" }, time: "18:00 - 04:00", pax: "2-6", tags: { zh: ["位置熱鬧", "飲品選擇多", "適合小團體"], en: ["Busy central location", "Many drink options", "Small group friendly"] } },
  ].map((item) => [slugify(item.title.en), detail(item.title, { zh: `${item.category.zh} · ${item.place.zh}`, en: `${item.category.en} · ${item.place.en}` }, [
    field({ zh: "區域 / 地址", en: "Area / address" }, item.place),
    field({ zh: "房型", en: "Room type" }, item.category),
    field({ zh: "营业時間", en: "Hours" }, item.time),
    field({ zh: "適合人數", en: "Best for" }, item.pax),
  ], item.tags, [item.image, "/anhnenkaraok.png", "/kara1.jpeg", "/kara2.jpeg", "/kara3.jpeg"])])),
  "tour-guide": Object.fromEntries([
    { image: "/anh1.png", title: { zh: "半日中文導遊", en: "Half-day Chinese Guide" }, location: { zh: "胡志明市 / 河內", en: "Ho Chi Minh City / Hanoi" }, duration: { zh: "4 小時", en: "4 hours" }, guests: { zh: "私人 / 小團", en: "Private / small group" }, note: { zh: "適合城市观光、商務接待和輕鬆行程。", en: "Good for city visits, business hosting, and easy itineraries." } },
    { image: "/anh3.png", title: { zh: "一日導遊服務", en: "Full-day Guide Service" }, location: { zh: "主要城市", en: "Major cities" }, duration: { zh: "8 小時", en: "8 hours" }, guests: { zh: "家庭 / 團隊", en: "Family / group" }, note: { zh: "按景點、餐廳、購物或會议行程安排。", en: "Arranged around attractions, dining, shopping, or meeting schedules." } },
    { image: "/anh4.png", title: { zh: "私人定製旅遊", en: "Private Custom Tour" }, location: { zh: "按行程安排", en: "By itinerary" }, duration: { zh: "1 天起", en: "From 1 day" }, guests: { zh: "車 + 導遊", en: "Car + guide" }, note: { zh: "可搭配車輛、機場接送和酒店安排。", en: "Can be combined with vehicle, airport transfer, and hotel plans." } },
  ].map((item) => [slugify(item.title.en), detail(item.title, item.note, [
    field({ zh: "區域 / 路線", en: "Area / route" }, item.location),
    field({ zh: "時長", en: "Duration" }, item.duration),
    field({ zh: "客人類型", en: "Guests" }, item.guests),
    field({ zh: "語言", en: "Language" }, "Chinese / English"),
  ], { zh: ["行程設計", "語言支援", "可搭配專車"], en: ["Itinerary planning", "Language support", "Can pair with private car"] }, [item.image, "/anh2.png", "/anh3.png", "/anh4.png"])])),
};

const serviceTheme: Record<string, {
  accent: string;
  accentText: string;
  soft: string;
  border: string;
  button: string;
  layout: "split" | "gallery" | "timeline";
  lead: { zh: string; en: string };
}> = {
  visa: {
    accent: "bg-sky-700",
    accentText: "text-sky-700",
    soft: "bg-sky-50",
    border: "border-sky-200",
    button: "bg-sky-700 hover:bg-sky-800",
    layout: "split",
    lead: { zh: "重点檢查資料、入境日期和提交前容易填錯的資訊。", en: "Focused on document checks, entry dates, and common form mistakes before submission." },
  },
  "flight-ticket": {
    accent: "bg-blue-700",
    accentText: "text-blue-700",
    soft: "bg-blue-50",
    border: "border-blue-200",
    button: "bg-blue-700 hover:bg-blue-800",
    layout: "timeline",
    lead: { zh: "提交預訂需求前，先確認航線、行李和服務支援条件。", en: "Review route, baggage, and support conditions before sending a booking request." },
  },
  spa: {
    accent: "bg-rose-700",
    accentText: "text-rose-700",
    soft: "bg-rose-50",
    border: "border-rose-200",
    button: "bg-rose-700 hover:bg-rose-800",
    layout: "gallery",
    lead: { zh: "放鬆空間、時長和房型會按您的需求確認。", en: "Relaxation space, duration, and room type are confirmed by your needs." },
  },
  sim: {
    accent: "bg-cyan-700",
    accentText: "text-cyan-700",
    soft: "bg-cyan-50",
    border: "border-cyan-200",
    button: "bg-cyan-700 hover:bg-cyan-800",
    layout: "split",
    lead: { zh: "按手機類型、停留天數、流量需求和 SIM/eSIM 領取方式匹配。", en: "Matched by phone type, stay length, data needs, and SIM/eSIM delivery method." },
  },
  restaurant: {
    accent: "bg-amber-700",
    accentText: "text-amber-700",
    soft: "bg-amber-50",
    border: "border-amber-200",
    button: "bg-amber-700 hover:bg-amber-800",
    layout: "gallery",
    lead: { zh: "適合家庭訂位、接待客人、團隊用餐或私人餐飲體驗。", en: "Good for family dining, hosting guests, group meals, or private food experiences." },
  },
  "ktv-massage": {
    accent: "bg-fuchsia-800",
    accentText: "text-fuchsia-800",
    soft: "bg-fuchsia-50",
    border: "border-fuchsia-200",
    button: "bg-fuchsia-800 hover:bg-fuchsia-900",
    layout: "gallery",
    lead: { zh: "確認時間前可查看房型、容量和合適服務。", en: "Review room style, capacity, and matching services before confirming a time." },
  },
  "tour-guide": {
    accent: "bg-emerald-700",
    accentText: "text-emerald-700",
    soft: "bg-emerald-50",
    border: "border-emerald-200",
    button: "bg-emerald-700 hover:bg-emerald-800",
    layout: "timeline",
    lead: { zh: "按語言、人數、時長和出行方式優化行程。", en: "Optimized by language, guest count, duration, and travel style." },
  },
};

export function GenericServiceItemDetailView({ serviceId, itemSlug, option, serviceLabel }: GenericServiceItemDetailViewProps) {
  const { language } = useLanguage();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const override = detailOverrides[serviceId]?.[itemSlug];
  const images = override?.images ?? galleryByService[serviceId] ?? ["/anh1.png", "/anh2.png", "/anh3.png", "/anh4.png"];
  const theme = serviceTheme[serviceId] ?? serviceTheme.visa;
  const title = option?.name ?? override?.title[language] ?? titleFromSlug(itemSlug);
  const label = serviceLabel ?? serviceName[serviceId]?.[language] ?? serviceId;
  const copy = {
    zh: {
      back: "返回列表",
      viewAllPhotos: "查看全部圖片",
      closePhotos: "關閉圖片",
	      overview: "服務資訊",
	      includes: "包含",
	      contact: "聯繫",
	      booking: "預訂服務",
      note: "提交預訂需求後，An Khai Travel 將按出行日期、人數和實際需求確認细节。",
    },
    en: {
      back: "Back to list",
      viewAllPhotos: "View all photos",
      closePhotos: "Close photos",
	      overview: "Service details",
	      includes: "Includes",
	      contact: "Contact",
	      booking: "Book service",
      note: "Send a booking request and An Khai Travel will confirm details by travel date, guest count, and actual needs.",
    },
  }[language];
  const fields = override?.fields.map((item) => ({
    label: item.label[language],
    value: typeof item.value === "string" ? item.value : item.value[language],
  })) ?? option?.fields?.filter((field) => !/giá|price|fee|báo giá/i.test(field.label)) ?? [
    { label: language === "zh" ? "服務" : "Service", value: label },
    { label: language === "zh" ? "類型" : "Type", value: title },
  ];
  const includes = override?.includes[language] ?? (option?.includes?.length ? option.includes : [
    language === "zh" ? "合適方案諮詢" : "Suitable option consultation",
    language === "zh" ? "預訂前確認" : "Confirmation before booking",
    language === "zh" ? "中文和英文支援" : "Chinese and English support",
  ]);

  useEffect(() => {
    if (!galleryOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [galleryOpen]);

  const heroIsGallery = theme.layout === "gallery";
  const heroIsTimeline = theme.layout === "timeline";

  if (serviceId === "flight-ticket") {
    const routeValue = fields.find((field) => /route|chặng/i.test(field.label))?.value ?? title;
    const airlineValue = fields.find((field) => /airline|hãng/i.test(field.label))?.value ?? title.split(" ").slice(0, -1).join(" ");
    const flightCodeValue = fields.find((field) => /code|mã/i.test(field.label))?.value ?? title.split(" ").at(-1) ?? "";
    const baggageValue = fields.find((field) => /baggage|hành/i.test(field.label))?.value ?? (language === "zh" ? "按路線確認" : "Confirmed by route");
    const [fromCode = "FROM", toCode = "TO"] = String(routeValue).split("→").map((part) => part.trim());
    const flightCopy = {
      zh: {
        eyebrow: "航線諮詢",
        route: "航線",
        airline: "建议航空公司",
        flightCode: "参考代碼",
        baggage: "行李",
        noPrice: "不顯示線上價格，請聯繫客服按實際航線確認。",
        process: "服務流程",
        request: "發送出發地、目的地和人數",
        confirm: "工作人員確認航空公司、行李和合適条件",
        finalize: "通過電話、WeChat、Telegram 或 email 確認資訊",
        contactCard: "聯繫諮詢航線",
      },
      en: {
        eyebrow: "Flight route consultation",
        route: "Route",
        airline: "Suggested airline",
        flightCode: "Reference code",
        baggage: "Baggage",
        noPrice: "No online price is shown. Please contact us so we can confirm by the actual route.",
        process: "Support process",
        request: "Send departure, destination, and guest count",
        confirm: "Our team checks airline, baggage, and suitable conditions",
        finalize: "Confirm details by phone, WeChat, Telegram, or email",
        contactCard: "Contact us for route advice",
      },
    }[language];

    return (
      <main className="bg-[#f4f6f8] py-5 text-slate-950">
        <div className="mx-auto max-w-7xl px-4">
          <Link href={`/services/${serviceId}`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950">
            <ArrowLeft className="h-4 w-4" />
            {copy.back}
          </Link>

          <section className="mt-4 grid gap-5 lg:grid-cols-[1fr_330px]">
            <div className="space-y-5">
              <section className="border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-[#006ce4]">{flightCopy.eyebrow}</p>
                    <h1 className="mt-2 text-2xl font-black leading-tight sm:text-4xl">{title}</h1>
                    <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-slate-600">{override?.description[language] ?? theme.lead[language]}</p>
                  </div>
                  <div className="w-fit border border-slate-200 bg-slate-50 px-4 py-3 text-left">
                    <p className="text-xs font-bold uppercase text-slate-500">{flightCopy.flightCode}</p>
                    <p className="mt-1 text-lg font-black text-slate-950">{flightCodeValue}</p>
                  </div>
                </div>

                <div className="py-7">
                  <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
                    <div className="border border-slate-200 bg-slate-50 p-5">
                      <p className="flex items-center gap-2 text-xs font-black uppercase text-[#006ce4]">
                        <PlaneTakeoff className="h-4 w-4" />
                        {language === "en" ? "Departure" : "出發地"}
                      </p>
                      <p className="mt-2 text-3xl font-black text-slate-950">{fromCode}</p>
                    </div>
                    <div className="hidden min-w-32 items-center gap-2 text-[#006ce4] md:flex">
                      <span className="h-px flex-1 bg-slate-300" />
                      <PlaneTakeoff className="h-5 w-5 rotate-90" />
                      <span className="h-px flex-1 bg-slate-300" />
                    </div>
                    <div className="border border-slate-200 bg-slate-50 p-5">
                      <p className="flex items-center gap-2 text-xs font-black uppercase text-[#006ce4]">
                        <PlaneLanding className="h-4 w-4" />
                        {language === "en" ? "Arrival" : "目的地"}
                      </p>
                      <p className="mt-2 text-3xl font-black text-slate-950">{toCode}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-bold text-slate-500">{routeValue}</p>
                </div>

                <div className="grid border-t border-slate-200 pt-5 md:grid-cols-2">
                  <div className="border-b border-slate-200 pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-5">
                    <p className="flex items-center gap-2 text-xs font-black uppercase text-slate-500">
                      <PlaneLanding className="h-4 w-4 text-[#006ce4]" />
                      {flightCopy.airline}
                    </p>
                    <p className="mt-2 text-base font-black text-slate-950">{airlineValue}</p>
                  </div>
                  <div className="pt-4 md:pl-5 md:pt-0">
                    <p className="flex items-center gap-2 text-xs font-black uppercase text-slate-500">
                      <Luggage className="h-4 w-4 text-[#006ce4]" />
                      {flightCopy.baggage}
                    </p>
                    <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{baggageValue}</p>
                  </div>
                </div>
              </section>

              <section className="grid gap-5 md:grid-cols-[0.95fr_1.05fr]">
                <div className="border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-xl font-black text-slate-950">{flightCopy.process}</h2>
                  <div className="mt-5 space-y-5 border-l border-slate-200 pl-5">
                    {[flightCopy.request, flightCopy.confirm, flightCopy.finalize].map((step, index) => (
                      <div key={step} className="relative">
                        <span className="absolute -left-[34px] flex h-7 w-7 items-center justify-center bg-[#006ce4] text-xs font-black text-white">{index + 1}</span>
                        <p className="text-sm font-bold leading-6 text-slate-700">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="flex items-center gap-2 text-xl font-black text-slate-950">
                    <BadgeCheck className="h-5 w-5 text-emerald-600" />
                    {copy.includes}
                  </h2>
                  <div className="mt-4 grid gap-3">
                    {includes.map((item) => (
                      <p key={item} className="flex items-start gap-3 text-sm font-semibold leading-6 text-slate-700">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            <aside className="h-fit border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-28">
              <p className="text-xs font-black uppercase text-[#006ce4]">{flightCopy.contactCard}</p>
              <h2 className="mt-2 text-2xl font-black leading-tight text-slate-950">{flightCopy.route}</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{flightCopy.noPrice}</p>
              <div className="mt-5 border-y border-slate-200 py-4">
                <p className="text-sm font-black text-slate-950">{routeValue}</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">{airlineValue}</p>
              </div>
              <div className="mt-5 grid gap-4">
                <Link href={`/contact?service=${serviceId}&item=${itemSlug}`} className="flex h-12 items-center justify-center gap-2 rounded border border-[#006ce4] bg-white px-5 text-sm font-black text-[#006ce4] transition hover:bg-sky-50">
                  <MessageCircle className="h-4 w-4" />
                  {copy.contact}
                </Link>
                <ServiceBookingModal
                  language={language}
                  serviceName={label}
                  itemName={title}
                  triggerClassName="flex h-12 w-full items-center justify-center gap-2 rounded bg-[#006ce4] px-5 text-sm font-black !text-white shadow-sm transition hover:bg-[#0057b8]"
                />
              </div>
            </aside>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className={`${heroIsGallery ? "bg-white" : "bg-[#f5f7fb]"} py-5 text-slate-950`}>
      <div className="mx-auto max-w-7xl px-4">
        <Link href={`/services/${serviceId}`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950">
          <ArrowLeft className="h-4 w-4" />
          {copy.back}
        </Link>

        <section className={`mt-4 grid gap-5 ${heroIsTimeline ? "lg:grid-cols-[330px_1fr]" : "lg:grid-cols-[1fr_330px]"}`}>
          {heroIsTimeline ? (
            <aside className="h-fit rounded-xl bg-white p-5 shadow-sm lg:sticky lg:top-28">
              <p className={`text-xs font-black uppercase tracking-wide ${theme.accentText}`}>{label}</p>
              <h1 className="mt-3 text-3xl font-black leading-tight text-slate-950">{title}</h1>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{theme.lead[language]}</p>
              <div className="mt-5 space-y-3">
                {[copy.overview, copy.includes, copy.booking].map((step, index) => (
                  <div key={step} className="flex gap-3">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black text-white ${theme.accent}`}>{index + 1}</span>
                    <p className="pt-1 text-sm font-bold text-slate-700">{step}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid gap-4">
                <Link href={`/contact?service=${serviceId}&item=${itemSlug}`} className={`flex h-12 items-center justify-center gap-2 rounded border bg-white px-5 text-sm font-black transition ${theme.border} ${theme.accentText}`}>
                  <MessageCircle className="h-4 w-4" />
                  {copy.contact}
                </Link>
                <ServiceBookingModal
                  language={language}
                  serviceName={label}
                  itemName={title}
                  triggerClassName={`flex h-12 w-full items-center justify-center gap-2 rounded px-5 text-sm font-black !text-white shadow-sm transition ${theme.button}`}
                />
              </div>
            </aside>
          ) : null}

          <div className="space-y-5">
            <section className={`overflow-hidden rounded-xl bg-white ${heroIsGallery ? "shadow-[0_18px_44px_rgba(15,23,42,0.12)]" : ""}`}>
              <div className={`grid gap-1 ${heroIsGallery ? "md:grid-cols-[1.35fr_0.65fr]" : "md:grid-cols-[1.15fr_0.85fr]"}`}>
                <button type="button" onClick={() => setGalleryOpen(true)} className="relative min-h-[280px] bg-slate-100 md:min-h-[360px]">
                  <Image src={images[0]} alt={title} fill priority className="object-cover" sizes="(min-width: 768px) 60vw, 100vw" />
                  {heroIsGallery ? (
                    <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-4 py-2 text-sm font-black text-slate-950 shadow">
                      {label}
                    </span>
                  ) : null}
                </button>
                <div className="grid grid-cols-2 gap-1">
                  {images.slice(1, 5).map((image, index) => (
                    <button key={image} type="button" onClick={() => setGalleryOpen(true)} className="relative min-h-[135px] bg-slate-100 md:min-h-0">
                      <Image src={image} alt={`${title} ${index + 2}`} fill className="object-cover" sizes="25vw" />
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

            <section className={`rounded-xl bg-white p-5 ${theme.border} ${heroIsGallery ? "border" : ""}`}>
              <p className={`text-xs font-black uppercase tracking-wide ${theme.accentText}`}>{label}</p>
              <h1 className="mt-2 text-3xl font-black leading-tight text-slate-950">{title}</h1>
              <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-slate-600">{override?.description[language] ?? theme.lead[language]}</p>
              <p className="mt-2 max-w-3xl text-sm font-semibold leading-7 text-slate-500">{copy.note}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {fields.map((field) => (
                  <div key={`${field.label}-${field.value}`} className={`rounded-lg border p-3 ${theme.border} ${theme.soft}`}>
                    <p className="text-xs font-bold uppercase text-slate-400">{field.label}</p>
                    <p className="mt-1 text-sm font-bold text-slate-950">{field.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl bg-white p-5">
              <h2 className="flex items-center gap-2 text-2xl font-black text-slate-950">
                <Sparkles className={`h-5 w-5 ${theme.accentText}`} />
                {copy.includes}
              </h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {includes.map((item) => (
                  <p key={item} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 text-sm font-semibold leading-6 text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {item}
                  </p>
                ))}
              </div>
            </section>

            {heroIsTimeline ? (
              <section className="rounded-xl bg-white p-5">
                <h2 className="text-2xl font-black text-slate-950">{language === "zh" ? "確認流程" : "Confirmation flow"}</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {[CalendarDays, MapPin, Check].map((Icon, index) => (
                    <div key={index} className={`rounded-lg border p-4 ${theme.border} ${theme.soft}`}>
                      <Icon className={`h-5 w-5 ${theme.accentText}`} />
                      <p className="mt-3 text-sm font-bold leading-6 text-slate-700">
                        {index === 0 ? (language === "zh" ? "選擇日期和人數" : "Choose date and guests") : index === 1 ? (language === "zh" ? "確認路線/地點" : "Confirm route or place") : (language === "zh" ? "完成預訂" : "Finish booking")}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          {!heroIsTimeline ? (
          <aside className="h-fit rounded-xl bg-white p-5 lg:sticky lg:top-28">
            <h2 className="text-xl font-black text-slate-950">{copy.overview}</h2>
            <div className="mt-4 space-y-3 text-sm font-semibold text-slate-600">
              <p>{label}</p>
              <p>{title}</p>
            </div>
            <div className={`mt-5 rounded-lg p-4 text-sm font-bold leading-6 text-slate-700 ${theme.soft} ${theme.border} border`}>
              {theme.lead[language]}
            </div>
            <div className="mt-6 grid gap-4">
              <Link href={`/contact?service=${serviceId}&item=${itemSlug}`} className={`flex h-12 items-center justify-center gap-2 rounded border bg-white px-5 text-sm font-black transition ${theme.border} ${theme.accentText}`}>
                <MessageCircle className="h-4 w-4" />
                {copy.contact}
              </Link>
              <ServiceBookingModal
                language={language}
                serviceName={label}
                itemName={title}
                triggerClassName={`flex h-12 w-full items-center justify-center gap-2 rounded px-5 text-sm font-black !text-white shadow-sm transition ${theme.button}`}
              />
            </div>
          </aside>
          ) : null}
        </section>
      </div>

      {galleryOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/55 px-4 py-5 text-slate-950">
          <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4">
              <div>
                <p className={`text-xs font-bold uppercase ${theme.accentText}`}>{label}</p>
                <h2 className="text-xl font-black text-slate-950 md:text-2xl">{title}</h2>
              </div>
              <button type="button" onClick={() => setGalleryOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-950 transition hover:bg-slate-100" aria-label={copy.closePhotos}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid flex-1 gap-3 overflow-y-auto bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image, index) => (
                <div key={`${image}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <Image src={image} alt={`${title} ${index + 1}`} fill className="object-cover" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
