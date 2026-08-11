export type ServiceFilterGroup = {
  key: string;
  label: string;
  options: string[];
};

export type ServiceOption = {
  name: string;
  price: string;
  unit: string;
  tags: Record<string, string>;
  fields: { label: string; value: string }[];
  includes: string[];
};

export type ServiceDetailCatalogItem = {
  serviceId: string;
  intro: string;
  searchPlaceholder: string;
  filters: ServiceFilterGroup[];
  options: ServiceOption[];
};

export const serviceDetailCatalog: ServiceDetailCatalogItem[] = [
  {
    serviceId: "hotel",
    intro: "Filter hotels by area, star level, and guest type before contacting us.",
    searchPlaceholder: "Search area, star level, family room...",
    filters: [
      { key: "area", label: "Area", options: ["Central", "Beach", "Near airport"] },
      { key: "tier", label: "Tier", options: ["3 stars", "4 stars", "5 stars"] },
      { key: "guest", label: "Guest type", options: ["Solo", "Family", "Group"] },
    ],
    options: [],
  },
  {
    serviceId: "visa",
    intro: "Choose entry type and support level so our team can confirm the right visa guidance.",
    searchPlaceholder: "Search e-visa, multiple entry, urgent document support...",
    filters: [
      { key: "entry", label: "Entry type", options: ["Single entry", "Multiple entry"] },
      { key: "support", label: "Support", options: ["Self-submit", "Document check", "Full follow-up"] },
    ],
    options: [],
  },
  {
    serviceId: "car-rental",
    intro: "Filter by vehicle type, route, and rental duration for the right private car support.",
    searchPlaceholder: "Search 4-seat car, 7-seat car, province route, full-day rental...",
    filters: [
      { key: "vehicle", label: "Vehicle", options: ["4-seat", "7-seat", "16-seat"] },
      { key: "route", label: "Route", options: ["City", "Province", "Custom itinerary"] },
      { key: "duration", label: "Duration", options: ["Hourly", "1 day", "Multi-day"] },
    ],
    options: [],
  },
  {
    serviceId: "ktv-massage",
    intro: "Filter KTV and massage options by guest group, area, duration, and room style.",
    searchPlaceholder: "Search KTV room, massage 90 min, District 1...",
    filters: [
      { key: "type", label: "Type", options: ["KTV", "Massage"] },
      { key: "group", label: "Guests", options: ["2-5 guests", "6-12 guests", "Solo"] },
      { key: "tier", label: "Level", options: ["Value", "Comfort", "Premium"] },
    ],
    options: [],
  },
  {
    serviceId: "airport-transfer",
    intro: "Choose airport, direction, and vehicle type so we can confirm pickup details.",
    searchPlaceholder: "Search 7-seat car, SGN, airport pickup...",
    filters: [
      { key: "airport", label: "Airport", options: ["SGN", "HAN", "DAD"] },
      { key: "vehicle", label: "Vehicle", options: ["4-seat", "7-seat", "16-seat"] },
      { key: "direction", label: "Direction", options: ["Airport pickup", "Airport drop-off"] },
    ],
    options: [],
  },
  {
    serviceId: "spa",
    intro: "Filter spa by treatment, duration, and level before requesting a booking.",
    searchPlaceholder: "Search foot massage, body massage, 2-hour spa...",
    filters: [
      { key: "treatment", label: "Treatment", options: ["Foot", "Body", "Package"] },
      { key: "duration", label: "Duration", options: ["60 min", "90 min", "120 min"] },
      { key: "tier", label: "Level", options: ["Mid-range", "Premium"] },
    ],
    options: [],
  },
  {
    serviceId: "sim",
    intro: "Filter SIM/eSIM by stay length, data needs, and delivery method.",
    searchPlaceholder: "Search 15-day SIM, eSIM, 5G, high data...",
    filters: [
      { key: "type", label: "SIM type", options: ["Physical SIM", "eSIM"] },
      { key: "days", label: "Validity", options: ["15 days", "30 days"] },
      { key: "data", label: "Data", options: ["3GB/day", "4-6GB/day", "Unlimited"] },
    ],
    options: [],
  },
  {
    serviceId: "flight-ticket",
    intro: "Filter by route, ticket type, and baggage needs before contacting us.",
    searchPlaceholder: "Search Hanoi, Da Nang, baggage, flexible ticket...",
    filters: [
      { key: "route", label: "Route", options: ["Domestic", "International"] },
      { key: "type", label: "Ticket type", options: ["Economy", "Flexible", "Group"] },
      { key: "baggage", label: "Baggage", options: ["Carry-on", "Checked"] },
    ],
    options: [],
  },
  {
    serviceId: "tour-guide",
    intro: "Filter tours and guides by city, language, duration, and tour style.",
    searchPlaceholder: "Search Chinese guide, city tour, private tour...",
    filters: [
      { key: "type", label: "Type", options: ["Guide", "Private tour", "Group tour"] },
      { key: "language", label: "Language", options: ["Chinese", "English"] },
      { key: "duration", label: "Duration", options: ["Half day", "1 day", "Multi-day"] },
    ],
    options: [],
  },
  {
    serviceId: "restaurant",
    intro: "Filter restaurants by cuisine, area, and table style for easy consultation.",
    searchPlaceholder: "Search Vietnamese cuisine, seafood, private room, group...",
    filters: [
      { key: "cuisine", label: "Cuisine", options: ["Vietnamese", "Seafood", "Fine dining"] },
      { key: "group", label: "Guests", options: ["Solo", "Family", "Group"] },
      { key: "room", label: "Space", options: ["Standard table", "Private room"] },
    ],
    options: [],
  },
];

export function getServiceDetailCatalog(serviceId: string) {
  return serviceDetailCatalog.find((item) => item.serviceId === serviceId);
}
