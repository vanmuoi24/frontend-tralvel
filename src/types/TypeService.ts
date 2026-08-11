export type IServiceTranslation = {
  label?: string;
  shortLabel?: string;
  caption?: string;
  description?: string;
  highlights?: string[];
};

export type IServiceCatalogItemTranslation = {
  title?: string;
  badge?: string;
  location?: string;
  duration?: string;
  type?: string;
  description?: string;
  fields?: Record<string, unknown>[];
  includes?: string[];
  content?: Record<string, unknown>;
};

export type IServiceCatalogItem = {
  id: string;
  serviceId: string;
  slug: string;
  imageUrl: string;
  gallery: string[];
  price: string;
  oldPrice?: string;
  unit?: string;
  tags?: Record<string, unknown>;
  attributes?: Record<string, unknown>;
  sortOrder?: number;
  active?: boolean;
  translation?: IServiceCatalogItemTranslation | null;
};

export type IService = {
  id: string;
  slug: string;
  groupCode: string;
  icon: string;
  imageUrl: string;
  featured: boolean;
  sortOrder: number;
  active: boolean;
  translation?: IServiceTranslation | null;
  catalogItems?: IServiceCatalogItem[];
};
