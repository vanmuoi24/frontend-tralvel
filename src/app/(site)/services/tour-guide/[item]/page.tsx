import { GenericServiceItemDetailView } from "@/components/services/generic-service-item-detail-view";
import { getServiceItemDetail } from "@/data/service-item-detail";
import { staticGenericItemParams } from "@/data/static-route-params";
import { titleFromSlug } from "@/lib/slugify";

type PageProps = {
  params: Promise<{ item: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return staticGenericItemParams["tour-guide"];
}

export async function generateMetadata({ params }: PageProps) {
  const { item } = await params;
  const slug = decodeURIComponent(item);
  const detail = getServiceItemDetail("tour-guide", slug);

  return { title: `${detail.option?.name ?? titleFromSlug(slug)} | An Khai Travel` };
}

export default async function TourGuideItemPage({ params }: PageProps) {
  const { item } = await params;
  const slug = decodeURIComponent(item);
  const detail = getServiceItemDetail("tour-guide", slug);

  return <GenericServiceItemDetailView serviceId="tour-guide" itemSlug={slug} option={detail.option} serviceLabel="Tour guide" />;
}
