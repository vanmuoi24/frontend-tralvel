export type ServicePricePlan = {
  name: string;
  price: string;
  unit: string;
  details: string[];
};

export type ServicePricing = {
  serviceId: string;
  priceFrom: string;
  note: string;
  plans: ServicePricePlan[];
};

const contactPricing = (serviceId: string, note: string): ServicePricing => ({
  serviceId,
  priceFrom: "Contact us",
  note,
  plans: [],
});

export const servicePricing: ServicePricing[] = [
  contactPricing("hotel", "Hotel options are confirmed by stay date, area, room type, and guest count."),
  contactPricing("visa", "Visa support is confirmed by nationality, entry type, document status, and urgency."),
  contactPricing("car-rental", "Car rental support is confirmed by route, duration, vehicle type, and pickup plan."),
  contactPricing("ktv-massage", "KTV and massage options are confirmed by area, room type, guest count, and time slot."),
  contactPricing("airport-transfer", "Airport transfer support is confirmed by airport, pickup/drop-off address, guest count, and luggage."),
  contactPricing("spa", "Spa service is confirmed by treatment, duration, guest count, and preferred area."),
  contactPricing("sim", "SIM/eSIM options are confirmed by stay length, data needs, device support, and delivery method."),
  contactPricing("flight-ticket", "Flight ticket support is confirmed by route, date, baggage, airline, and seat availability."),
  contactPricing("tour-guide", "Guide service is confirmed by city, language, duration, guest count, and itinerary style."),
  contactPricing("restaurant", "Restaurant support is confirmed by cuisine, area, guest count, and room/table requirements."),
];

export function getServicePricing(serviceId: string) {
  return servicePricing.find((service) => service.serviceId === serviceId);
}
