"use client";

import { createContext, useContext } from "react";
import { navLinks, siteConfig, statistics, type NavLink, type SiteConfig, type SiteStatistic } from "@/data/site";
import type { Language } from "@/providers/language-provider";
import { useLanguage } from "@/providers/language-provider";

export type SiteData = {
  site: SiteConfig;
  statistics: SiteStatistic[];
  navLinks: NavLink[];
};

type SiteDataByLanguage = Record<Language, SiteData>;

const fallbackSiteData: SiteData = {
  site: siteConfig,
  statistics,
  navLinks,
};

const SiteContext = createContext<SiteDataByLanguage>({
  zh: fallbackSiteData,
  en: fallbackSiteData,
});

export function SiteProvider({
  siteData,
  children,
}: {
  siteData: SiteDataByLanguage;
  children: React.ReactNode;
}) {
  return <SiteContext.Provider value={siteData}>{children}</SiteContext.Provider>;
}

export function useSiteData() {
  const { language } = useLanguage();
  return useContext(SiteContext)[language] ?? fallbackSiteData;
}

export function useSiteConfig() {
  return useSiteData().site;
}
