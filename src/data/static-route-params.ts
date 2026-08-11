import { airportTransferVehicles } from "@/data/airport-transfer";
import { carRentalPosts } from "@/data/car-rental";
import { fixedServiceIds } from "@/data/services";
import { slugify } from "@/lib/slugify";

export const staticServiceParams = fixedServiceIds.map((service) => ({ service }));

export const staticAirportTransferParams = airportTransferVehicles.map((vehicle) => ({ vehicle: vehicle.slug }));

export const staticCarRentalParams = carRentalPosts.map((car) => ({ car: car.slug }));

export const staticGenericItemParams: Record<string, { item: string }[]> = {
  visa: [
    "Vietnam e-Visa Support",
    "Document Check Support",
    "Urgent Travel Document Review",
  ].map((title) => ({ item: slugify(title) })),
  "flight-ticket": [
    "Vietnam Domestic Flight",
    "SGN - Da Nang Flight",
    "Hanoi Round-trip Ticket",
  ].map((title) => ({ item: slugify(title) })),
  sim: [
    "15-day Travel SIM",
    "30-day High-speed SIM",
    "Vietnam Travel eSIM",
    "Short-stay Unlimited Data",
    "Group SIM Bundle",
    "Long-stay eSIM",
    "Vietnam Call + Data SIM",
    "Heavy-use Work Data Plan",
  ].map((title) => ({ item: slugify(title) })),
  spa: [
    "Foot Relief Massage",
    "Aroma Body Massage",
    "Hot Stone Deep Care",
    "Couple Spa Package",
    "Vietnamese Herbal Ritual",
    "Hydrating Facial Care",
  ].map((title) => ({ item: slugify(title) })),
  "ktv-massage": [
    "Supreme KTV",
    "Velvet Room",
    "Pub 28",
    "Iconic KTV",
    "Galaxy Karaoke",
    "Relax Massage",
    "Moonlight KTV",
    "Neon Club",
  ].map((title) => ({ item: slugify(title) })),
  "tour-guide": [
    "Half-day Chinese Guide",
    "Full-day Guide Service",
    "Private Custom Tour",
  ].map((title) => ({ item: slugify(title) })),
  restaurant: [
    "Saigon Local Taste",
    "Da Nang Coastal Seafood",
    "Hanoi Premium Business Dinner",
    "Hotpot and Grill Gathering",
    "Da Lat Family Vietnamese Set",
    "Rooftop View Restaurant",
    "Phu Quoc Seafood Private Room",
    "Late-night Bites and Beer",
    "Da Nang Local Vietnamese Table",
    "Hanoi Old Quarter Specialties",
    "Da Lat Warm Hotpot",
    "Phu Quoc Ocean View Dinner",
  ].map((title) => ({ item: slugify(title) })),
};
