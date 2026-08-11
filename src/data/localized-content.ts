import { navLinks, siteConfig, statistics, type SiteConfig } from "@/data/site";
import { travelServices } from "@/data/services";
import type { Language } from "@/providers/language-provider";
import type { IServiceCatalogItem } from "@/types/TypeService";

export const heroCopy = {
  zh: {
    tagline: "越南旅遊服務專家",
    description: "酒店、簽證、租車、機場接送、電話卡、機票、導遊與餐廳推薦，一站式中文諮詢服務。",
    traits: ["專业服務", "優质體驗", "安全可靠", "值得信赖"],
    call: "立即撥打",
    chat: "在線諮詢",
    slideLabel: "選擇横幅圖片",
    hotline: "熱線",
    alts: ["越南旅行横幅 1", "越南旅行横幅 2", "越南旅行横幅 3", "越南旅行横幅 4", "越南旅行横幅 5", "越南旅行横幅 6", "越南旅行横幅 7", "越南旅行横幅 8"],
  },
  en: {
    tagline: "Vietnam Travel Service Expert",
    description: "Hotels, visas, car rental, airport transfers, SIM cards, flights, guides, and restaurant recommendations in one advisory channel.",
    traits: ["Professional Service", "Quality Experience", "Safe & Reliable", "Trustworthy"],
    call: "Call Now",
    chat: "Online Consultation",
    slideLabel: "Select banner image",
    hotline: "Hotline",
    alts: ["Vietnam travel banner 1", "Vietnam travel banner 2", "Vietnam travel banner 3", "Vietnam travel banner 4", "Vietnam travel banner 5", "Vietnam travel banner 6", "Vietnam travel banner 7", "Vietnam travel banner 8"],
  },
} satisfies Record<Language, Record<string, string | string[]>>;

export const navCopy = {
  zh: {
    tagline: "越南旅遊服務專家",
    hotline: "熱線",
    chat: "在線諮詢",
    themeLabel: "切換明暗主題",
    menuLabel: "切換菜單",
    servicesLabel: "主要服務",
    languageLabel: "切換為英文",
    languageButton: "EN",
  },
  en: {
    tagline: "Vietnam Travel Service Expert",
    hotline: "Hotline",
    chat: "Webchat",
    themeLabel: "Toggle theme",
    menuLabel: "Toggle menu",
    servicesLabel: "Main services",
    languageLabel: "Switch to Chinese",
    languageButton: "中文",
  },
} satisfies Record<Language, Record<string, string>>;

export const homeCopy = {
  zh: {
    servicesEyebrow: "An Khai Travel 服務",
    servicesTitle: "您需要的越南旅遊服務，一站配齐",
    servicesDescription: "從抵達機場、用車、入住、遊覽、餐飲到娛樂安排，An Khai Travel 提供 24/7 快速協助。",
    viewAll: "查看全部服務",
    consultNow: "立即諮詢",
    airportEyebrow: "緊急接送優先服務",
    airportTitle: "抵達機場，即有專車與接機人員等候",
    airportDescription: "An Khai Travel 優先安排新山一、內排、峴港等機場接送。您可撥打熱線或通過在線客服立即確認車輛。",
    callHotline: "撥打熱線",
    chatNow: "立即在線諮詢",
    processEyebrow: "簡潔流程",
    processTitle: "4 個簡單步驟完成服務預訂",
    whyEyebrow: "為什么選擇 An Khai Travel",
    whyTitle: "整趟旅程，只需一個服務入口",
    whyDescription: "您無需分別寻找不同供應商。An Khai Travel 提供酒店、接送車、簽證、機票、旅遊電話卡、導遊和餐飲推薦等完整服務。",
    finalTitle: "今天需要越南旅遊服務諮詢吗？",
    finalDescription: "留下您的需求、人數與出發日期，An Khai Travel 團隊將儘快聯繫並提供優惠报價。",
    submitRequest: "提交諮詢需求",
    callNow: "立即撥打熱線",
    steps: [
      { title: "1. 選擇服務", description: "酒店、簽證、租車、機場接送、旅遊團、SPA、電話卡、導遊等服務。" },
      { title: "2. 提交資訊", description: "提供出行時間、人數、接送地點和具體需求。" },
      { title: "3. 快速获取方案", description: "An Khai Travel 團隊將通過電話或在線客服為您諮詢报價。" },
      { title: "4. 確認並出行", description: "收到清晰的票據或服務確認，安心享受貼心旅程。" },
    ],
    airportFeatures: [
      { title: "快速響應", text: "優先處理航班延誤、抵達時間变化等緊急用車需求。" },
      { title: "多種車型", text: "4座、7座、16座新車，車况乾淨，司機服務周到。" },
      { title: "接送點清晰", text: "司機举牌接機或按時在航站楼出口等候。" },
      { title: "24/7 支援", text: "熱線與在線客服全程跟進行程。" },
    ],
    bullets: [
      "根據實際行程規劃路線，優化預算",
      "24/7 快速響應與緊急服務支援",
      "適合個人、家庭與大型旅遊團隊",
      "提供越南語與中文多語言諮詢",
    ],
  },
  en: {
    servicesEyebrow: "An Khai Travel Services",
    servicesTitle: "Every Vietnam travel service you need, in one place",
    servicesDescription: "From airport arrival, transport, stays, sightseeing, dining, and entertainment, An Khai Travel provides fast 24/7 support.",
    viewAll: "View All Services",
    consultNow: "Consult Now",
    airportEyebrow: "Priority Urgent Pickup",
    airportTitle: "Arrive at the airport with a car and greeter ready",
    airportDescription: "An Khai Travel prioritizes airport transfers for Tan Son Nhat, Noi Bai, Da Nang, and more. Call the hotline or message webchat to confirm your car quickly.",
    callHotline: "Call Hotline",
    chatNow: "Chat Now",
    processEyebrow: "Simple Process",
    processTitle: "Book services in 4 simple steps",
    whyEyebrow: "Why Choose An Khai Travel",
    whyTitle: "One contact point for the whole trip",
    whyDescription: "No need to search provider by provider. An Khai Travel covers hotels, transfers, visas, flights, travel SIMs, guides, and dining recommendations.",
    finalTitle: "Need travel service advice today?",
    finalDescription: "Leave your needs, group size, and departure date. The An Khai Travel team will contact you with a fast preferred quote.",
    submitRequest: "Send Consultation Request",
    callNow: "Call Hotline Now",
    steps: [
      { title: "1. Choose a Service", description: "Hotels, visas, car rental, airport transfers, tours, spa, SIM cards, guides, and more." },
      { title: "2. Send Details", description: "Share your timing, group size, pickup point, and specific needs." },
      { title: "3. Get Fast Advice", description: "The An Khai Travel team will contact you by phone or webchat with options and pricing." },
      { title: "4. Confirm & Travel", description: "Receive clear tickets or service confirmation, then enjoy a well-supported trip." },
    ],
    airportFeatures: [
      { title: "Fast Response", text: "Priority handling for late arrivals, flight delays, or changed pickup times." },
      { title: "Vehicle Options", text: "Clean modern 4, 7, and 16-seat vehicles with attentive drivers." },
      { title: "Clear Pickup Point", text: "Drivers can hold a pickup sign or wait at the terminal exit on time." },
      { title: "24/7 Support", text: "Hotline and online chat keep following your journey." },
    ],
    bullets: [
      "Practical itinerary planning with budget optimization",
      "24/7 response and urgent service support",
      "Suitable for solo travelers, families, and large groups",
      "Multilingual consultation in Vietnamese and Chinese",
    ],
  },
};

const serviceTextByLanguage = {
  zh: {
    hotel: {
      label: "酒店預訂",
      shortLabel: "酒店",
      caption: "酒店預訂",
      description: "根據區域、預算、人數和行程安排推薦並預訂合適酒店。",
      highlights: ["推薦便利位置", "支援家庭與團隊", "按需求匹配房型"],
    },
    visa: {
      label: "簽證服務",
      shortLabel: "簽證",
      caption: "簽證協助",
      description: "協助準備旅遊簽證所需的資訊、行程與基礎資料。",
      highlights: ["檢查資料資訊", "規劃合適行程", "提醒所需文件"],
    },
    "car-rental": {
      label: "越南租車",
      shortLabel: "租車",
      caption: "各類車型租賃",
      description: "提供按小時、按天、市內與跨省用車，適合家庭、商務與團隊出行。",
      highlights: ["4/7/16座車型", "行程靈活安排", "熟悉旅遊線路司機"],
    },
    "ktv-massage": {
      label: "KTV 與按摩",
      shortLabel: "KTV 按摩",
      caption: "娛樂與放鬆",
      description: "根據人數、位置與預算推薦適合的KTV、娛樂和按摩場所。",
      highlights: ["推薦合適地點", "協助提前預訂", "按區域諮詢"],
    },
    "airport-transfer": {
      label: "機場接送",
      shortLabel: "機場接送",
      caption: "電話或在線快速預訂",
      description: "快速安排機場接送，明確接送點，可通過電話或在線客服直接聯繫。",
      highlights: ["快速預訂", "跟進航班時間", "協助新到旅客"],
    },
    spa: {
      label: "SPA 水療",
      shortLabel: "SPA",
      caption: "放鬆護理服務",
      description: "推薦適合遊客的放鬆、養生與護理套餐。",
      highlights: ["推薦可靠場所", "按時間段預訂", "適合個人或團隊"],
    },
    sim: {
      label: "旅遊電話卡",
      shortLabel: "電話卡",
      caption: "越南流量卡",
      description: "提供越南電話卡、旅遊流量與適合停留天數的通訊方案。",
      highlights: ["旅遊流量套餐", "快速激活", "按天數推薦"],
    },
    "flight-ticket": {
      label: "機票預訂",
      shortLabel: "機票",
      caption: "航班諮詢",
      description: "根據行程、目的地與轉機需求提供機票諮詢。",
      highlights: ["航班時間諮詢", "協助改期", "推薦合適時段"],
    },
    "tour-guide": {
      label: "旅遊團與導遊",
      shortLabel: "旅遊導遊",
      caption: "行程與中文導遊",
      description: "按語言、人數與行程需求推薦景點路線並安排本地導遊。",
      highlights: ["規劃參觀路線", "本地導遊服務", "優化交通時間"],
    },
    restaurant: {
      label: "餐廳推薦",
      shortLabel: "餐廳",
      caption: "美食與訂位",
      description: "推薦餐廳、小吃、當地特色美食，並協助團隊訂位。",
      highlights: ["當地特色菜", "團隊訂位", "按口味推薦"],
    },
  },
  en: {
    hotel: {
      label: "Hotel Booking",
      shortLabel: "Hotel",
      caption: "Hotel booking",
      description: "Consult and book hotels by area, budget, group size, and travel schedule.",
      highlights: ["Convenient locations", "Family and group support", "Room advice by need"],
    },
    visa: {
      label: "Visa Support",
      shortLabel: "Visa",
      caption: "Visa support",
      description: "Support for basic information, itinerary, and document preparation for travel visa needs.",
      highlights: ["Document info check", "Suitable itinerary advice", "Document reminders"],
    },
    "car-rental": {
      label: "Car Rental",
      shortLabel: "Car Rental",
      caption: "All vehicle rental",
      description: "Hourly, daily, city, province, private family, and group car rental services.",
      highlights: ["4/7/16-seat cars", "Flexible schedules", "Tour-route drivers"],
    },
    "ktv-massage": {
      label: "KTV & Massage",
      shortLabel: "KTV Massage",
      caption: "Karaoke and massage",
      description: "Recommendations for entertainment, KTV, and massage by group, location, and budget.",
      highlights: ["Suitable venues", "Booking support", "Area-based advice"],
    },
    "airport-transfer": {
      label: "Airport Transfer",
      shortLabel: "Airport Transfer",
      caption: "Fast phone or webchat booking",
      description: "Fast airport transfers with clear pickup points and direct phone or webchat support.",
      highlights: ["Fast booking", "Flight tracking", "New arrival support"],
    },
    spa: {
      label: "Spa Service",
      shortLabel: "Spa",
      caption: "Relaxation care",
      description: "Advice for relaxing spa, wellness care, and packages suitable for travelers.",
      highlights: ["Trusted places", "Timed booking", "Solo or group friendly"],
    },
    sim: {
      label: "Travel SIM",
      shortLabel: "Travel SIM",
      caption: "Vietnam data SIM",
      description: "Support for phone SIMs, travel data, and communication packages by length of stay.",
      highlights: ["Travel data", "Quick activation", "Advice by days"],
    },
    "flight-ticket": {
      label: "Flight Tickets",
      shortLabel: "Flights",
      caption: "Flight advice",
      description: "Flight ticket advice by itinerary, destination, and connection needs.",
      highlights: ["Flight schedule advice", "Change support", "Good time suggestions"],
    },
    "tour-guide": {
      label: "Tours & Guides",
      shortLabel: "Tours Guides",
      caption: "Tours and guides",
      description: "Sightseeing advice and guide matching by language, group type, and itinerary.",
      highlights: ["Sightseeing routes", "Local guides", "Optimized travel time"],
    },
    restaurant: {
      label: "Restaurant Picks",
      shortLabel: "Restaurant",
      caption: "Food and booking",
      description: "Restaurant, local food, and specialty recommendations with table booking support.",
      highlights: ["Local dishes", "Group booking", "Taste-based picks"],
    },
  },
} satisfies Record<Language, Record<string, {
  label: string;
  shortLabel: string;
  caption: string;
  description: string;
  highlights: string[];
}>>;

type LocalizedServiceId = keyof (typeof serviceTextByLanguage)["zh"];

const localizedNavLinks = {
  zh: navLinks,
  en: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ],
} satisfies Record<Language, typeof navLinks>;

const localizedSiteConfig: Record<Language, SiteConfig> = {
  zh: siteConfig,
  en: {
    ...siteConfig,
    tagline: "Vietnam Travel Service Expert",
    description:
      "An Khai Travel provides Vietnam travel services: hotels, visas, car rental, airport transfers, spa, SIM cards, flight tickets, guides, and restaurant recommendations.",
  },
};

const hotelCatalogItemsByLanguage = {
  zh: [
    {
      id: "fake-hotel-1",
      title: "胡志明市河畔酒店",
      badge: "熱門推薦",
      location: "第 1 郡，胡志明市",
      distance: "距市中心 1.2km",
      room: "高級雙人房 / 家庭房",
      amenities: "早餐, 泳池, 健身房, 中文協助",
      perks: "可安排接機, 適合家庭",
      score: "9.1",
      reviews: "1,286 則評價",
      image: "/hotel1.jpeg",
      gallery: ["/hotel1.jpeg", "/hotel2.jpeg", "/hotel3.jpeg", "/hotel4.jpeg"],
      stars: "5 stars",
    },
    {
      id: "fake-hotel-2",
      title: "峴港海景度假酒店",
      badge: "海邊住宿",
      location: "美溪海灘，峴港",
      distance: "距海灘 300m",
      room: "海景房 / 連通房",
      amenities: "海景, 早餐, 親子友好, SPA",
      perks: "靠近海灘, 適合度假",
      score: "8.9",
      reviews: "954 則評價",
      image: "/hotel2.jpeg",
      gallery: ["/hotel2.jpeg", "/hotel3.jpeg", "/hotel5.jpeg", "/hotel6.jpeg"],
      stars: "4 stars",
    },
    {
      id: "fake-hotel-3",
      title: "河內老城精品酒店",
      badge: "市中心",
      location: "還劍湖，河內",
      distance: "距市中心 0.8km",
      room: "精品客房 / 雙床房",
      amenities: "早餐, 步行方便, 機場接送",
      perks: "適合首次到訪, 餐廳多",
      score: "8.7",
      reviews: "732 則評價",
      image: "/hotel3.jpeg",
      gallery: ["/hotel3.jpeg", "/hotel1.jpeg", "/hotel4.jpeg", "/hotel6.jpeg"],
      stars: "4 stars",
    },
    {
      id: "fake-hotel-4",
      title: "新山一機場商務酒店",
      badge: "近機場",
      location: "新平郡，胡志明市",
      distance: "距機場 1.5km",
      room: "商務房 / 短住休息",
      amenities: "24 小時前台, 接送方便, 快速入住",
      perks: "適合轉機, 近機場",
      score: "8.5",
      reviews: "618 則評價",
      image: "/hotel4.jpeg",
      gallery: ["/hotel4.jpeg", "/hotel5.jpeg", "/hotel1.jpeg", "/hotel2.jpeg"],
      stars: "3 stars",
    },
  ],
  en: [
    {
      id: "fake-hotel-1",
      title: "Ho Chi Minh Riverside Hotel",
      badge: "Popular pick",
      location: "District 1, Ho Chi Minh City",
      distance: "1.2km from city center",
      room: "Superior double / family room",
      amenities: "Breakfast, pool, gym, Chinese support",
      perks: "Airport transfer available, family friendly",
      score: "9.1",
      reviews: "1,286 reviews",
      image: "/hotel1.jpeg",
      gallery: ["/hotel1.jpeg", "/hotel2.jpeg", "/hotel3.jpeg", "/hotel4.jpeg"],
      stars: "5 stars",
    },
    {
      id: "fake-hotel-2",
      title: "Da Nang Sea View Resort",
      badge: "Beach stay",
      location: "My Khe Beach, Da Nang",
      distance: "300m from beach",
      room: "Sea-view room / connecting room",
      amenities: "Sea view, breakfast, family friendly, spa",
      perks: "Near beach, good for holidays",
      score: "8.9",
      reviews: "954 reviews",
      image: "/hotel2.jpeg",
      gallery: ["/hotel2.jpeg", "/hotel3.jpeg", "/hotel5.jpeg", "/hotel6.jpeg"],
      stars: "4 stars",
    },
    {
      id: "fake-hotel-3",
      title: "Hanoi Old Quarter Boutique Hotel",
      badge: "Downtown",
      location: "Hoan Kiem Lake, Hanoi",
      distance: "0.8km from city center",
      room: "Boutique room / twin room",
      amenities: "Breakfast, walkable area, airport transfer",
      perks: "First-visit friendly, many restaurants nearby",
      score: "8.7",
      reviews: "732 reviews",
      image: "/hotel3.jpeg",
      gallery: ["/hotel3.jpeg", "/hotel1.jpeg", "/hotel4.jpeg", "/hotel6.jpeg"],
      stars: "4 stars",
    },
    {
      id: "fake-hotel-4",
      title: "Tan Son Nhat Airport Business Hotel",
      badge: "Near airport",
      location: "Tan Binh District, Ho Chi Minh City",
      distance: "1.5km from airport",
      room: "Business room / short stay",
      amenities: "24-hour front desk, easy transfer, fast check-in",
      perks: "Good for transit, near airport",
      score: "8.5",
      reviews: "618 reviews",
      image: "/hotel4.jpeg",
      gallery: ["/hotel4.jpeg", "/hotel5.jpeg", "/hotel1.jpeg", "/hotel2.jpeg"],
      stars: "3 stars",
    },
  ],
};

function buildHotelCatalogItems(language: Language): IServiceCatalogItem[] {
  return hotelCatalogItemsByLanguage[language].map((hotel, index) => ({
    id: hotel.id,
    serviceId: "hotel",
    slug: hotel.id.replace("fake-", ""),
    imageUrl: hotel.image,
    gallery: hotel.gallery,
    price: "",
    unit: "",
    sortOrder: index + 1,
    active: true,
    tags: {
      area: hotel.location,
      tier: hotel.stars,
      guest: index === 3 ? "Transit" : "Family",
    },
    attributes: {
      area: hotel.location,
      room: hotel.room,
      tier: hotel.stars,
    },
    translation: {
      title: hotel.title,
      badge: hotel.badge,
      location: hotel.location,
      type: hotel.room,
      description: `${hotel.location} | ${hotel.distance}`,
      fields: [
        { label: "Distance", value: hotel.distance },
        { label: "Amenities", value: hotel.amenities },
        { label: "Perks", value: hotel.perks },
        { label: "Stars", value: hotel.stars },
      ],
      includes: hotel.amenities.split(",").map((item) => item.trim()),
      content: {
        score: hotel.score,
        scoreLabel: hotel.reviews,
        reviews: hotel.reviews,
      },
    },
  }));
}

export function getLocalizedServices(language: Language) {
  const translations = serviceTextByLanguage[language];

  return travelServices.map((service) => ({
    ...service,
    ...translations[service.id as LocalizedServiceId],
    catalogItems: service.id === "hotel" ? buildHotelCatalogItems(language) : service.catalogItems,
  }));
}

export function getLocalizedServiceById(id: string, language: Language) {
  return getLocalizedServices(language).find((service) => service.id === id) ?? null;
}

export function getLocalizedSiteData(language: Language) {
  return {
    site: localizedSiteConfig[language],
    statistics: getLocalizedStatistics(language),
    navLinks: localizedNavLinks[language],
  };
}

export function getLocalizedStatistics(language: Language) {
  const labels =
    language === "zh"
      ? ["已服務客戶", "旅遊服務", "本地合作伙伴", "快速支援"]
      : ["Guests Served", "Travel Services", "Local Partners", "Fast Support"];

  return statistics.map((stat, index) => ({
    ...stat,
    label: labels[index] ?? stat.label,
  }));
}
