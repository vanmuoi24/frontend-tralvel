import { notFound } from "next/navigation";
import { HotelDetailView } from "@/components/services/hotel/hotel-detail-view";
import { getBackendServiceBySlug } from "@/data/backend-services";

type HotelDetailPageProps = {
  params: Promise<{ hotel: string }>;
};

export const dynamic = "force-dynamic";

async function getHotelItems(slug: string) {
  const [zhService, enService] = await Promise.all([
    getBackendServiceBySlug("hotel", "zh"),
    getBackendServiceBySlug("hotel", "en"),
  ]);
  const zhItem = zhService?.catalogItems?.find((item) => item.slug === slug);
  const enItem = enService?.catalogItems?.find((item) => item.slug === slug);
  const item = zhItem ?? enItem;

  if (!item) {
    return null;
  }

  return { zh: zhItem ?? item, en: enItem ?? item };
}

export async function generateMetadata({ params }: HotelDetailPageProps) {
  const { hotel } = await params;
  const items = await getHotelItems(decodeURIComponent(hotel));

  return {
    title: `${items?.zh.translation?.title ?? "Hotel"} | An Khai Travel`,
    description: items?.zh.translation?.description,
  };
}

export default async function HotelDetailPage({ params }: HotelDetailPageProps) {
  const { hotel } = await params;
  const items = await getHotelItems(decodeURIComponent(hotel));

  if (!items) {
    notFound();
  }

  return <HotelDetailView items={items} />;
}
