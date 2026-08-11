import { getServiceDetailCatalog } from "@/data/service-detail-catalog";
import { slugify } from "@/lib/slugify";

export function getServiceItemDetail(serviceId: string, itemSlug: string) {
  const catalog = getServiceDetailCatalog(serviceId);
  const option = catalog?.options.find((entry) => slugify(entry.name) === itemSlug);

  return {
    catalog,
    option,
  };
}
