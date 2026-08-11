import instance from "@/services/Axios/Axios";
import type { BackendSiteSetting } from "@/services/Site/SiteSettingsAPI";
import type { AxiosResponse } from "@/types/ResponseAPI";

const GetContactInformation = (language = "zh"): Promise<{ data: AxiosResponse<BackendSiteSetting> }> => {
  return instance.get(`/site-settings?lang=${language}`);
};

export { GetContactInformation };
