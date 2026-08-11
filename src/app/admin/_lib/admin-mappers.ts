import {
  type BackendCatalogItemRequest,
  type BackendCatalogItemResponse,
  type BackendServiceRequest,
  type BackendServiceResponse,
} from "./admin-api";
import { businessFieldPresets } from "./business";
import { seedServices } from "./seed";
import type { AdminLanguage, AdminService, AdminServiceForm, AdminServiceOption, ServiceOptionForm } from "./types";

export const fixedSeedServices = seedServices();
export const fixedServiceIds = new Set(fixedSeedServices.map((service) => service.id));
const fixedServiceById = new Map(fixedSeedServices.map((service) => [service.id, service]));

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function recordToStringRecord(record?: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(record ?? {})
      .map(([key, value]) => [key, stringValue(value)])
      .filter(([, value]) => Boolean(value))
  ) as Record<string, string>;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

export function getSourceLanguage(adminLanguage: AdminLanguage): "zh" | "en" {
  return adminLanguage === "en" ? "en" : "zh";
}

export function backendItemToAdminOption(item: BackendCatalogItemResponse): AdminServiceOption {
  const fields = item.translation?.fields?.map((field) => ({
    label: stringValue(field.label),
    value: stringValue(field.value),
  })).filter((field) => field.label && field.value) ?? [];

  return {
    backendId: item.id,
    image: item.imageUrl,
    gallery: item.gallery ?? [],
    name: item.translation?.title ?? item.slug,
    price: item.price,
    oldPrice: item.oldPrice,
    unit: item.unit ?? item.translation?.duration ?? "",
    tags: recordToStringRecord(item.tags),
    fields,
    attributes: recordToStringRecord(item.attributes),
    includes: item.translation?.includes ?? [],
  };
}

export function backendServiceToAdminService(service: BackendServiceResponse): AdminService {
  const baseService = fixedServiceById.get(service.slug);

  return {
    backendId: service.id,
    id: service.slug,
    label: service.translation?.label ?? baseService?.label ?? service.slug,
    shortLabel: service.translation?.shortLabel ?? service.translation?.label ?? baseService?.shortLabel ?? service.slug,
    caption: service.translation?.caption ?? baseService?.caption ?? "",
    description: service.translation?.description ?? baseService?.description ?? "",
    icon: service.icon || baseService?.icon || "Sparkles",
    image: service.imageUrl || baseService?.image || "",
    groupCode: service.groupCode,
    featured: service.featured,
    active: service.active,
    sortOrder: service.sortOrder ?? baseService?.sortOrder ?? 0,
    highlights: service.translation?.highlights ?? baseService?.highlights ?? [],
  };
}

export function serviceFormToAdminService(values: AdminServiceForm): AdminService {
  return {
    ...values,
    highlights: values.highlightsText
      ?.split("\n")
      .map((item) => item.trim())
      .filter(Boolean) ?? [],
  };
}

export function buildServicePayload(service: AdminService, sourceLanguage: "zh" | "en"): BackendServiceRequest {
  return {
    sourceLanguage,
    service: {
      slug: service.id,
      groupCode: service.groupCode,
      icon: service.icon,
      imageUrl: service.image,
      featured: service.featured,
      sortOrder: service.sortOrder,
      active: service.active,
    },
    translation: {
      label: service.label,
      shortLabel: service.shortLabel,
      caption: service.caption,
      description: service.description,
      highlights: service.highlights,
    },
  };
}

export function optionToFormValues(option: AdminServiceOption | null, fallbackImage = ""): Partial<ServiceOptionForm> {
  return {
    image: option?.image ?? fallbackImage,
    galleryText: option?.gallery?.join("\n") ?? "",
    name: option?.name ?? "",
    price: option?.price ?? "",
    oldPrice: option?.oldPrice ?? "",
    unit: option?.unit ?? "",
    tags: option ? option.tags : {},
    fields: option ? Object.fromEntries(option.fields.map((field) => [field.label, field.value])) : {},
    includesText: option?.includes.join("\n") ?? "",
  };
}

export function optionFormToAdminOption(
  values: ServiceOptionForm,
  selectedServiceId: string,
  editingOptionIndex: number | null,
  selectedOptions: AdminServiceOption[]
): AdminServiceOption {
  const selectedPreset = businessFieldPresets[selectedServiceId] ?? businessFieldPresets.hotel;
  const tags = Object.fromEntries(
    selectedPreset.filterFields
      .map((field) => [field.key, values.tags?.[field.key]?.trim()])
      .filter(([, value]) => Boolean(value))
  ) as Record<string, string>;
  const fields = selectedPreset.detailFields
    .map((field) => ({ label: field.label, value: values.fields?.[field.label]?.trim() }))
    .filter((field): field is { label: string; value: string } => Boolean(field.value));

  return {
    backendId: editingOptionIndex === null ? undefined : selectedOptions[editingOptionIndex]?.backendId,
    image: values.image,
    gallery: values.galleryText
      ?.split("\n")
      .map((item) => item.trim())
      .filter(Boolean) ?? [],
    name: values.name,
    price: values.price,
    oldPrice: values.oldPrice,
    unit: values.unit,
    tags,
    fields,
    attributes: tags,
    includes: values.includesText
      ?.split("\n")
      .map((item) => item.trim())
      .filter(Boolean) ?? [],
  };
}

export function buildCatalogItemPayload(
  option: AdminServiceOption,
  selectedServiceId: string,
  sortOrder: number,
  sourceLanguage: "zh" | "en"
): BackendCatalogItemRequest {
  const content = Object.fromEntries(option.fields.map((field) => [slugify(field.label) || field.label, field.value]));

  return {
    sourceLanguage,
    slug: option.backendId ? slugify(option.name) || `${selectedServiceId}-item` : `${selectedServiceId}-${slugify(option.name) || "item"}-${Date.now()}`,
    imageUrl: option.image,
    gallery: option.gallery ?? [],
    price: option.price,
    oldPrice: option.oldPrice,
    unit: option.unit,
    tags: option.tags,
    attributes: option.attributes ?? option.tags,
    sortOrder,
    active: true,
    translation: {
      title: option.name,
      badge: option.fields.find((field) => field.label === "Badge")?.value,
      location: option.fields.find((field) => ["Khu vực", "Tuyến chạy", "Thành phố"].includes(field.label))?.value,
      duration: option.unit,
      type: Object.values(option.tags)[0],
      description: option.fields.find((field) => field.label === "Mô tả")?.value,
      fields: option.fields,
      includes: option.includes,
      content,
    },
  };
}
