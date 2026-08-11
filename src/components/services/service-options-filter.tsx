"use client";

import type { ServiceDetailCatalogItem } from "@/data/service-detail-catalog";
import type { TravelService } from "@/data/services";
import { useLanguage } from "@/providers/language-provider";
import { AirportTransferList } from "@/components/services/airport-transfer/airport-transfer-list";
import { CarRentalDirectory } from "@/components/services/car-rental/car-rental-directory";
import { FlightTicketSearch } from "@/components/services/flight-ticket/flight-ticket-search";
import { HotelBookingSearch } from "@/components/services/hotel/hotel-booking-search";
import { KtvHotspots } from "@/components/services/ktv-massage/ktv-hotspots";
import { RestaurantDiningCatalog } from "@/components/services/restaurant/restaurant-dining-catalog";
import { SpaWellnessCatalog } from "@/components/services/spa/spa-wellness-catalog";
import { TravelSimCatalog } from "@/components/services/sim/travel-sim-catalog";
import { TourGuideList } from "@/components/services/tour-guide/tour-guide-list";
import { SimpleVisaIntro } from "@/components/services/visa/simple-visa-intro";

type ServiceOptionsFilterProps = {
  catalog: ServiceDetailCatalogItem;
  service?: TravelService;
  services?: {
    zh: TravelService;
    en: TravelService;
  };
  serviceId: string;
};

export function ServiceOptionsFilter({ service: fallbackService, services, serviceId }: ServiceOptionsFilterProps) {
  const { language } = useLanguage();
  const service = services?.[language] ?? services?.zh ?? fallbackService;

  if (serviceId === "hotel") {
    return <HotelBookingSearch catalogItems={service?.catalogItems ?? []} serviceId={serviceId} />;
  }

  if (serviceId === "visa") {
    return <SimpleVisaIntro serviceId={serviceId} />;
  }

  if (serviceId === "car-rental") {
    return <CarRentalDirectory serviceId={serviceId} />;
  }

  if (serviceId === "ktv-massage") {
    return <KtvHotspots serviceId={serviceId} />;
  }

  if (serviceId === "airport-transfer") {
    return <AirportTransferList serviceId={serviceId} />;
  }

  if (serviceId === "spa") {
    return <SpaWellnessCatalog serviceId={serviceId} />;
  }

  if (serviceId === "sim") {
    return <TravelSimCatalog serviceId={serviceId} />;
  }

  if (serviceId === "flight-ticket") {
    return <FlightTicketSearch serviceId={serviceId} />;
  }

  if (serviceId === "tour-guide") {
    return <TourGuideList serviceId={serviceId} />;
  }

  if (serviceId === "restaurant") {
    return <RestaurantDiningCatalog serviceId={serviceId} />;
  }

  return null;
}
