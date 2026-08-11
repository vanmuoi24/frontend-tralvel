import type { IService } from "@/types/TypeService";
import instance from "@/services/Axios/Axios";
import type { AxiosResponse } from "@/types/ResponseAPI";

const GetServices = (language = "zh"): Promise<{ data: AxiosResponse<IService[]> }> => {
  return instance.get(`/services?lang=${language}`);
};

const GetServiceBySlug = (slug: string, language = "zh"): Promise<{ data: AxiosResponse<IService> }> => {
  return instance.get(`/services/${slug}?lang=${language}`);
};

export { GetServices, GetServiceBySlug };
