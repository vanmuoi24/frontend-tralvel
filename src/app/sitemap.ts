import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { getBackendServices } from "@/data/backend-services";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const services = await getBackendServices("zh");
  const staticPaths = ["", "/services", "/contact"];
  const servicePaths = services.map((service) => `/services/${service.id}`);

  return [...staticPaths, ...servicePaths].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path.startsWith("/services/") ? 0.75 : 0.8,
  }));
}
