import type { IServiceCatalogItem } from "@/types/TypeService";

export type TravelService = {
  backendId?: string;
  id: string;
  label: string;
  shortLabel: string;
  caption: string;
  icon: string;
  image: string;
  description: string;
  highlights: string[];
  featured?: boolean;
  active?: boolean;
  sortOrder?: number;
  catalogItems?: IServiceCatalogItem[];
};

export const travelServices: TravelService[] = [
  {
    id: "hotel",
    label: "酒店預訂",
    shortLabel: "酒店",
    caption: "酒店預訂",
    icon: "BedDouble",
    image: "/anhnenhotel.png",
    description: "根據區域、預算、人數和行程安排推薦並預訂合適酒店。",
    highlights: ["推薦便利位置", "支援家庭與團隊", "按需求匹配房型"],
  },
  {
    id: "visa",
    label: "簽證服務",
    shortLabel: "簽證",
    caption: "簽證協助",
    icon: "BadgeCheck",
    image: "/anhnenvisa.png",
    description: "協助準備旅遊簽證所需的資訊、行程與基礎資料。",
    highlights: ["檢查資料資訊", "規劃合適行程", "提醒所需文件"],
  },
  {
    id: "car-rental",
    label: "越南租車",
    shortLabel: "租車",
    caption: "各類車型租賃",
    icon: "Car",
    image: "/anhnendichvuthuexe.png",
    description: "提供按小時、按天、市內與跨省用車，適合家庭、商務與團隊出行。",
    highlights: ["4/7/16座車型", "行程靈活安排", "熟悉旅遊線路司機"],
  },
  {
    id: "ktv-massage",
    label: "KTV 與按摩",
    shortLabel: "KTV 按摩",
    caption: "娛樂與放鬆",
    icon: "MicVocal",
    image: "/anhnenkaraok.png",
    description: "根據人數、位置與預算推薦適合的KTV、娛樂和按摩場所。",
    highlights: ["推薦合適地點", "協助提前預訂", "按區域諮詢"],
  },
  {
    id: "airport-transfer",
    label: "機場接送",
    shortLabel: "機場接送",
    caption: "電話或在線快速預訂",
    icon: "CarTaxiFront",
    image: "/anhnendichvudonkhachsanbay.png",
    description: "快速安排機場接送，明確接送點，可通過電話或在線客服直接聯繫。",
    highlights: ["快速預訂", "跟進航班時間", "協助新到旅客"],
    featured: true,
  },
  {
    id: "spa",
    label: "SPA 水療",
    shortLabel: "SPA",
    caption: "放鬆護理服務",
    icon: "Sparkles",
    image: "/anhnenspa.png",
    description: "推薦適合遊客的放鬆、養生與護理套餐。",
    highlights: ["推薦可靠場所", "按時間段預訂", "適合個人或團隊"],
  },
  {
    id: "sim",
    label: "旅遊電話卡",
    shortLabel: "電話卡",
    caption: "越南流量卡",
    icon: "Smartphone",
    image: "/dichvuthuesim.png",
    description: "提供越南電話卡、旅遊流量與適合停留天數的通訊方案。",
    highlights: ["旅遊流量套餐", "快速激活", "按天數推薦"],
  },
  {
    id: "flight-ticket",
    label: "機票預訂",
    shortLabel: "機票",
    caption: "航班諮詢",
    icon: "PlaneTakeoff",
    image: "/anhnendichvubanvemaybay.png",
    description: "根據行程、目的地與轉機需求提供機票諮詢。",
    highlights: ["航班時間諮詢", "協助改期", "推薦合適時段"],
  },
  {
    id: "tour-guide",
    label: "旅遊團與導遊",
    shortLabel: "旅遊導遊",
    caption: "行程與中文導遊",
    icon: "MapPinned",
    image: "/anh1.png",
    description: "按語言、人數與行程需求推薦景點路線並安排本地導遊。",
    highlights: ["規劃參觀路線", "本地導遊服務", "優化交通時間"],
  },
  {
    id: "restaurant",
    label: "餐廳推薦",
    shortLabel: "餐廳",
    caption: "美食與訂位",
    icon: "Utensils",
    image: "/anhnennhahangdoan.png",
    description: "推薦餐廳、小吃、當地特色美食，並協助團隊訂位。",
    highlights: ["當地特色菜", "團隊訂位", "按口味推薦"],
  },
];

export const fixedServiceIds = travelServices.map((service) => service.id);

export function getServiceById(id?: string | null) {
  return travelServices.find((service) => service.id === id) ?? travelServices[0];
}
