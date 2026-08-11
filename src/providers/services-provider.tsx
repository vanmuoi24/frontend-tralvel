"use client";

import { createContext, useContext } from "react";
import type { TravelService } from "@/data/services";
import type { Language } from "@/providers/language-provider";

type ServicesByLanguage = Record<Language, TravelService[]>;

const ServicesContext = createContext<ServicesByLanguage>({
  zh: [],
  en: [],
});

export function ServicesProvider({
  services,
  children,
}: {
  services: ServicesByLanguage;
  children: React.ReactNode;
}) {
  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}

export function useBackendServices(language: Language) {
  return useContext(ServicesContext)[language] ?? [];
}
