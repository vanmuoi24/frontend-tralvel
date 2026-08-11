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
  const detail = getServiceItemDetail("ktv-massage", slug);

  return { title: `${detail.option?.name ?? titleFromSlug(slug)} | An Khai Travel` };
}

export default async function KtvMassageItemPage({ params }: PageProps) {
  const { item } = await params;
  const slug = decodeURIComponent(item);
  const detail = getServiceItemDetail("ktv-massage", slug);

  return <GenericServiceItemDetailView serviceId="ktv-massage" itemSlug={slug} option={detail.option} serviceLabel="KTV Karaoke" />;
}
