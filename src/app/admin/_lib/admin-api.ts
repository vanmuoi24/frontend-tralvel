import { apiClient, type ApiResponse } from "@/lib/api-client";

export type BackendServiceResponse = {
  id: string;
  slug: string;
  groupCode: string;
  icon: string;
  imageUrl: string;
  featured: boolean;
  sortOrder: number;
  active: boolean;
  translation?: {
    label?: string;
    shortLabel?: string;
    caption?: string;
    description?: string;
    highlights?: string[];
  } | null;
};

export type BackendServiceRequest = {
  sourceLanguage: "zh" | "en";
  service: {
    slug: string;
    groupCode: string;
    icon: string;
    imageUrl: string;
    featured: boolean;
    sortOrder: number;
    active: boolean;
  };
  translation: {
    label: string;
    shortLabel?: string;
    caption?: string;
    description?: string;
    highlights: string[];
    seoTitle?: string;
    seoDescription?: string;
  };
  catalog?: unknown;
  pricing?: unknown;
};

export type BackendCatalogItemRequest = {
  sourceLanguage: "zh" | "en";
  slug: string;
  imageUrl: string;
  gallery: string[];
  price: string;
  oldPrice?: string;
  unit?: string;
  tags: Record<string, string>;
  attributes: Record<string, string>;
  sortOrder: number;
  active: boolean;
  translation: {
    title: string;
    badge?: string;
    location?: string;
    duration?: string;
    type?: string;
    description?: string;
    fields: { label: string; value: string }[];
    includes: string[];
    content: Record<string, unknown>;
  };
};

export type BackendCatalogItemResponse = {
  id: string;
  slug: string;
  imageUrl: string;
  gallery?: string[];
  price: string;
  oldPrice?: string;
  unit?: string;
  tags?: Record<string, unknown>;
  attributes?: Record<string, unknown>;
  sortOrder?: number;
  active?: boolean;
  translation?: {
    title?: string;
    badge?: string;
    location?: string;
    duration?: string;
    type?: string;
    description?: string;
    fields?: Record<string, unknown>[];
    includes?: string[];
    content?: Record<string, unknown>;
  } | null;
};

export type ImageUploadResponse = {
  secureUrl: string;
  publicId: string;
  originalFilename?: string;
  bytes?: number;
  format?: string;
  width?: number;
  height?: number;
};

export const adminServicesApi = {
  async list() {
    const response = await apiClient.get<ApiResponse<BackendServiceResponse[]>>("/admin/services");
    return response.data.data;
  },

  async delete(id: string) {
    await apiClient.delete<ApiResponse<null>>(`/admin/services/${id}`);
  },

  async setActive(id: string, active: boolean) {
    const response = await apiClient.patch<ApiResponse<BackendServiceResponse>>(`/admin/services/${id}/active`, { active });
    return response.data.data;
  },

  async update(id: string, payload: BackendServiceRequest) {
    const response = await apiClient.put<ApiResponse<BackendServiceResponse>>(`/admin/services/${id}`, payload);
    return response.data.data;
  },
};

export const adminUploadsApi = {
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<ApiResponse<ImageUploadResponse>>("/admin/uploads/images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
    });
    return response.data.data;
  },
};

export const adminCatalogItemsApi = {
  async list(serviceId: string) {
    const response = await apiClient.get<ApiResponse<BackendCatalogItemResponse[]>>(`/admin/services/${serviceId}/items`);
    return response.data.data;
  },

  async create(serviceId: string, payload: BackendCatalogItemRequest) {
    const response = await apiClient.post<ApiResponse<BackendCatalogItemResponse>>(`/admin/services/${serviceId}/items`, payload);
    return response.data.data;
  },

  async update(serviceId: string, itemId: string, payload: BackendCatalogItemRequest) {
    const response = await apiClient.put<ApiResponse<BackendCatalogItemResponse>>(`/admin/services/${serviceId}/items/${itemId}`, payload);
    return response.data.data;
  },

  async delete(serviceId: string, itemId: string) {
    await apiClient.delete<ApiResponse<null>>(`/admin/services/${serviceId}/items/${itemId}`);
  },
};

export const adminSiteSettingsApi = {
  async get(language = "zh") {
    const response = await apiClient.get<ApiResponse<unknown>>(`/admin/site-settings?lang=${language}`);
    return response.data.data;
  },

  async upsert(payload: unknown) {
    const response = await apiClient.put<ApiResponse<unknown>>("/admin/site-settings", payload);
    return response.data.data;
  },
};
