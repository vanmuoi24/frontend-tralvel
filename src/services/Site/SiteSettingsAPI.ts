import instance from "@/services/Axios/Axios";
import type { AxiosResponse } from "@/types/ResponseAPI";

export type BackendSiteSetting = {
  id?: string;
  language: "zh" | "en";
  siteName?: string;
  tagline?: string;
  description?: string;
  url?: string;
  email?: string;
  address?: string;
  phones?: Record<string, unknown>[];
  socialLinks?: Record<string, unknown>;
  contactLinks?: Record<string, unknown>;
  qrImages?: Record<string, unknown>;
  statistics?: Record<string, unknown>[];
  navigationLinks?: Record<string, unknown>[];
};

export type BackendSiteSettingRequest = {
  language: "zh" | "en";
  siteName: string;
  tagline: string;
  description: string;
  url: string;
  email: string;
  address: string;
  phones: Record<string, unknown>[];
  socialLinks: Record<string, unknown>;
  contactLinks: Record<string, unknown>;
  qrImages: Record<string, unknown>;
  statistics: Record<string, unknown>[];
  navigationLinks: Record<string, unknown>[];
};

const GetSiteSetting = (language = "zh"): Promise<{ data: AxiosResponse<BackendSiteSetting> }> => {
  return instance.get(`/site-settings?lang=${language}`);
};

const GetAdminSiteSettings = (): Promise<{ data: AxiosResponse<BackendSiteSetting[]> }> => {
  return instance.get("/admin/site-settings");
};

const UpdateAdminSiteSetting = (
  data: BackendSiteSettingRequest,
): Promise<{ data: AxiosResponse<BackendSiteSetting> }> => {
  return instance.put("/admin/site-settings", data);
};

export { GetSiteSetting, GetAdminSiteSettings, UpdateAdminSiteSetting };
