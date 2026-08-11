export type ContactQrCode = {
  title: string;
  subtitle?: string;
  image: string;
  href?: string;
};

export type SiteConfig = {
  name: string;
  legalNameZh: string;
  tagline: string;
  description: string;
  url: string;
  email: string;
  phone: string;
  phones: { label: string; value: string }[];
  webchatHref: string;
  telegramHref: string;
  lineHref: string;
  webchatQrImage: string;
  lineQrImage: string;
  contactQrCodes: ContactQrCode[];
  address: string;
  social: {
    facebook: string;
    instagram: string;
    youtube: string;
  };
};

export type SiteStatistic = {
  label: string;
  value: number;
  suffix: string;
};

export type NavLink = {
  label: string;
  href: string;
};

export const siteConfig: SiteConfig = {
  name: "An Khai Travel",
  legalNameZh: "安凯國際旅遊有限公司",
  tagline: "越南旅遊服務專家",
  description:
    "An Khai Travel 提供越南旅遊服務：酒店、簽證、租車、機場接送、SPA、電話卡、機票、導遊與餐廳推薦。",
  url: "https://anvidtravel.vn",
  email: "contact@anvidtravel.vn",
  phone: "0933851610",
  phones: [
    { label: "Hotline 1", value: "0933851610" },
  ],
  webchatHref: "/contact?service=airport-transfer",
  telegramHref: "https://t.me/anvidtravel",
  lineHref: "",
  webchatQrImage: "/wechat-qr.jpg",
  lineQrImage: "/line-qr.jpg",
  contactQrCodes: [
    {
      title: "WeChat",
      subtitle: "今晚打老虎",
      image: "/wechat-qr.jpg",
      href: "",
    },
    {
      title: "LINE",
      subtitle: "LINE support",
      image: "/line-qr.jpg",
      href: "",
    },
  ],
  address: "越南胡志明市",
  social: {
    facebook: "https://facebook.com/anvidtravel",
    instagram: "https://instagram.com/anvidtravel",
    youtube: "https://youtube.com/@anvidtravel",
  },
};

export const statistics: SiteStatistic[] = [
  { label: "已服務客戶", value: 12000, suffix: "+" },
  { label: "旅遊服務", value: 10, suffix: "" },
  { label: "本地合作伙伴", value: 80, suffix: "+" },
  { label: "快速支援", value: 24, suffix: "/7" },
];

export const navLinks: NavLink[] = [
  { label: "首頁", href: "/" },
  { label: "服務", href: "/services" },
  { label: "聯繫", href: "/contact" },
];
