import { fixedServiceIds, type TravelService } from "@/data/services";
import { GetServiceBySlug, GetServices } from "@/services/Services/ServiceAPI";
import type { IService, IServiceCatalogItem, IServiceCatalogItemTranslation } from "@/types/TypeService";

const fixedServiceIdSet = new Set(fixedServiceIds);

function cleanText(value?: string | null) {
  return (value ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanRecord<T extends Record<string, unknown> | undefined>(record: T): T {
  if (!record) return record;

  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [key, typeof value === "string" ? cleanText(value) : value])
  ) as T;
}

function cleanItemTranslation(translation?: IServiceCatalogItemTranslation | null): IServiceCatalogItemTranslation | null | undefined {
  if (!translation) return translation;

  return {
    ...translation,
    title: cleanText(translation.title),
    badge: cleanText(translation.badge),
    location: cleanText(translation.location),
    duration: cleanText(translation.duration),
    type: cleanText(translation.type),
    description: cleanText(translation.description),
    fields: translation.fields?.map((field) => cleanRecord(field)),
    includes: translation.includes?.map(cleanText),
    content: cleanRecord(translation.content),
  };
}

function cleanCatalogItem(item: IServiceCatalogItem): IServiceCatalogItem {
  return {
    ...item,
    slug: cleanText(item.slug),
    imageUrl: cleanText(item.imageUrl),
    gallery: item.gallery?.map(cleanText) ?? [],
    price: cleanText(item.price),
    oldPrice: cleanText(item.oldPrice),
    unit: cleanText(item.unit),
    tags: cleanRecord(item.tags),
    attributes: cleanRecord(item.attributes),
    translation: cleanItemTranslation(item.translation),
  };
}

function toTravelService(service: IService): TravelService | null {
  if (!fixedServiceIdSet.has(service.slug) || !service.active) return null;

  return {
    backendId: service.id,
    id: service.slug,
    label: cleanText(service.translation?.label) || service.slug,
    shortLabel: cleanText(service.translation?.shortLabel) || cleanText(service.translation?.label) || service.slug,
    caption: cleanText(service.translation?.caption),
    icon: service.icon,
    image: service.imageUrl,
    description: cleanText(service.translation?.description),
    highlights: service.translation?.highlights?.map(cleanText) ?? [],
    featured: service.featured,
    active: service.active,
    sortOrder: service.sortOrder,
    catalogItems: service.catalogItems?.filter((item) => item.active !== false).map(cleanCatalogItem).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)) ?? [],
  };
}

export async function getBackendServices(language = "zh"): Promise<TravelService[]> {
  try {
    const response = await GetServices(language);
    return response.data.data
      .map(toTravelService)
      .filter((service): service is TravelService => Boolean(service))
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  } catch {
    return [];
  }
}

export async function getBackendServiceBySlug(slug: string, language = "zh") {
  if (!fixedServiceIdSet.has(slug)) return null;

  try {
    const response = await GetServiceBySlug(slug, language);
    return toTravelService(response.data.data);
  } catch {
    return null;
  }
}
