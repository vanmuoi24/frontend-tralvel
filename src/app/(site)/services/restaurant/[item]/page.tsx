import { GenericServiceItemDetailView } from "@/components/services/generic-service-item-detail-view";
import { getServiceItemDetail } from "@/data/service-item-detail";
import { titleFromSlug } from "@/lib/slugify";

type PageProps = {
  params: Promise<{ item: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { item } = await params;
  const slug = decodeURIComponent(item);
  const detail = getServiceItemDetail("restaurant", slug);

  return { title: `${detail.option?.name ?? titleFromSlug(slug)} | An Khai Travel` };
}

export default async function RestaurantItemPage({ params }: PageProps) {
  const { item } = await params;
  const slug = decodeURIComponent(item);
  const detail = getServiceItemDetail("restaurant", slug);

  return <GenericServiceItemDetailView serviceId="restaurant" itemSlug={slug} option={detail.option} serviceLabel="Restaurant" />;
}
