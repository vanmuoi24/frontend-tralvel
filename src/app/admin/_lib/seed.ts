import { serviceDetailCatalog } from "@/data/service-detail-catalog";
import { travelServices } from "@/data/services";
import { groupByService } from "./business";
import type { AdminService } from "./types";

export function seedServices(): AdminService[] {
  return travelServices.map((service, index) => ({
    id: service.id,
    label: service.label,
    shortLabel: service.shortLabel,
    caption: service.caption,
    description: service.description,
    icon: service.icon,
    image: service.image,
    groupCode: groupByService[service.id] ?? "Other",
    featured: Boolean(service.featured),
    active: true,
    sortOrder: index + 1,
    highlights: [...service.highlights],
  }));
}

export function seedOptions() {
  return Object.fromEntries(
    serviceDetailCatalog.map((item) => {
      const service = travelServices.find((entry) => entry.id === item.serviceId);
      return [item.serviceId, item.options.map((option) => ({ image: service?.image ?? "", ...option }))];
    })
  );
}
