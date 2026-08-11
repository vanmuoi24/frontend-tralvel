import type { ServiceOption } from "@/data/service-detail-catalog";

export type AdminLanguage = "zh" | "en";

export type AdminService = {
  backendId?: string;
  id: string;
  label: string;
  shortLabel: string;
  caption: string;
  description: string;
  icon: string;
  image: string;
  groupCode: string;
  featured: boolean;
  active: boolean;
  sortOrder: number;
  highlights: string[];
};

export type AdminServiceForm = Omit<AdminService, "highlights"> & {
  highlightsText?: string;
};

export type AdminSiteForm = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  email: string;
  phone: string;
  phonesText?: string;
  webchatHref?: string;
  telegramHref?: string;
  lineHref?: string;
  webchatQrImage?: string;
  webchatQrName?: string;
  lineQrImage?: string;
  lineQrName?: string;
  address?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  statisticsText?: string;
};

export type ServiceOptionForm = {
  image: string;
  galleryText?: string;
  name: string;
  price: string;
  oldPrice?: string;
  unit: string;
  tags?: Record<string, string>;
  fields?: Record<string, string>;
  includesText?: string;
};

export type AdminServiceOption = ServiceOption & {
  backendId?: string;
  image: string;
  gallery?: string[];
  oldPrice?: string;
  attributes?: Record<string, string>;
};

export type BusinessField = {
  key: string;
  label: string;
  placeholder: string;
  table?: boolean;
};

export type BusinessFieldPreset = {
  filterFields: BusinessField[];
  detailFields: BusinessField[];
};

export type AdminCopy = Record<string, string>;
