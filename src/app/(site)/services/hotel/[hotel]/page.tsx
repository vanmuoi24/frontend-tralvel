import { notFound } from "next/navigation";
import { HotelDetailView } from "@/components/services/hotel/hotel-detail-view";
import { getLocalizedServiceById } from "@/data/localized-content";
import type { IServiceCatalogItem } from "@/types/TypeService";

type HotelDetailPageProps = {
  params: Promise<{ hotel: string }>;
};

const fallbackHotel: IServiceCatalogItem = {
  id: "static-hotel",
  serviceId: "hotel",
  slug: "selected-vietnam-hotel",
  imageUrl: "/anhnenhotel.png",
  gallery: ["/hotel1.jpeg", "/hotel2.jpeg", "/hotel3.jpeg", "/hotel4.jpeg"].filter(Boolean),
  price: "",
  unit: "",
  tags: { area: "Central Vietnam", guest: "Solo / family / group" },
  attributes: { location: "Vietnam city center", room: "Arranged by request" },
  active: true,
  translation: {
    title: "Selected Vietnam Hotel",
    badge: "Selected hotel",
    location: "Vietnam city center",
    type: "Arranged by request",
    description: "Contact An Khai Travel to confirm a suitable hotel by travel date, guest count, and room needs.",
    includes: ["Clean and comfortable room", "Chinese / English booking support", "Arranged by real availability"],
    content: { score: "9.0", reviews: "Guest reviews" },
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  const zhService = getLocalizedServiceById("hotel", "zh");
  const enService = getLocalizedServiceById("hotel", "en");
  const slugs = new Set([
    ...(zhService?.catalogItems ?? []).map((item) => item.slug),
    ...(enService?.catalogItems ?? []).map((item) => item.slug),
  ]);

  const hotelSlugs = Array.from(slugs).filter(Boolean);
  return (hotelSlugs.length ? hotelSlugs : [fallbackHotel.slug]).map((hotel) => ({ hotel }));
}

function getHotelItems(slug: string) {
  const zhService = getLocalizedServiceById("hotel", "zh");
  const enService = getLocalizedServiceById("hotel", "en");
  const zhItem = zhService?.catalogItems?.find((item) => item.slug === slug);
  const enItem = enService?.catalogItems?.find((item) => item.slug === slug);
  const item = zhItem ?? enItem;

  return { zh: zhItem ?? item ?? fallbackHotel, en: enItem ?? item ?? fallbackHotel };
}

export async function generateMetadata({ params }: HotelDetailPageProps) {
  const { hotel } = await params;
  const items = getHotelItems(decodeURIComponent(hotel));

  return {
    title: `${items?.zh.translation?.title ?? "Hotel"} | An Khai Travel`,
    description: items?.zh.translation?.description,
  };
}

export default async function HotelDetailPage({ params }: HotelDetailPageProps) {
  const { hotel } = await params;
  const items = getHotelItems(decodeURIComponent(hotel));

  if (!items) {
    notFound();
  }

  return <HotelDetailView items={items} />;
}
