import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const unsplash = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const tourTemplates = [
  { title: "Kyoto Cherry Blossom Experience", country: "Japan", region: "Asia", duration: 8, price: 2890, category: "Cultural", image: "1493976040374-85c8e568f544", featured: true, popular: true },
  { title: "Amalfi Coast Luxury Escape", country: "Italy", region: "Europe", duration: 7, price: 3490, category: "Luxury", image: "1534113416837-fbb6b8b5f1b5", featured: true, popular: true },
  { title: "Iceland Northern Lights Adventure", country: "Iceland", region: "Europe", duration: 6, price: 2790, category: "Adventure", image: "1504829857799-ddff29c27927", featured: true, popular: true },
  { title: "Santorini Sunset & Wine Tour", country: "Greece", region: "Europe", duration: 5, price: 2190, category: "Romantic", image: "1613395877344-13ef67a0d36e", featured: true, popular: false },
  { title: "Swiss Alps Hiking Expedition", country: "Switzerland", region: "Europe", duration: 9, price: 3890, category: "Adventure", image: "1530122565116-5b9e2f5c6f8e", featured: false, popular: true },
  { title: "Bali Wellness Retreat", country: "Indonesia", region: "Asia", duration: 10, price: 1990, category: "Wellness", image: "1537996195441-5c89e7b4f6b6", featured: true, popular: true },
  { title: "Moroccan Sahara Desert Safari", country: "Morocco", region: "Africa", duration: 7, price: 1890, category: "Adventure", image: "1489749798305-4fea3ae63d43", featured: false, popular: true },
  { title: "Paris & Loire Valley Discovery", country: "France", region: "Europe", duration: 8, price: 3290, category: "Cultural", image: "1502602898657-3e91760cbb34", featured: true, popular: true },
  { title: "Machu Picchu Sacred Journey", country: "Peru", region: "South America", duration: 9, price: 2590, category: "Adventure", image: "1587595431973-160a0d1124ad", featured: true, popular: true },
  { title: "Thailand Island Hopping", country: "Thailand", region: "Asia", duration: 12, price: 1790, category: "Beach", image: "1552465011-b85e271d7375", featured: false, popular: true },
  { title: "New Zealand South Island Explorer", country: "New Zealand", region: "Oceania", duration: 14, price: 4290, category: "Adventure", image: "1469521669025-364a27720071", featured: true, popular: false },
  { title: "Dubai Luxury Desert Experience", country: "UAE", region: "Middle East", duration: 5, price: 2990, category: "Luxury", image: "1512453979798-5ea266f8880c", featured: false, popular: true },
  { title: "Norwegian Fjords Cruise", country: "Norway", region: "Europe", duration: 8, price: 3690, category: "Cruise", image: "1469474968028-56623f02e42e", featured: true, popular: true },
  { title: "Vietnam Culinary Journey", country: "Vietnam", region: "Asia", duration: 10, price: 1690, category: "Food & Wine", image: "1528127159328-659a2fa084da", featured: false, popular: true },
  { title: "Kenya Wildlife Safari", country: "Kenya", region: "Africa", duration: 7, price: 3190, category: "Wildlife", image: "1516426122078-c23e76319801", featured: true, popular: true },
  { title: "Scottish Highlands Road Trip", country: "Scotland", region: "Europe", duration: 6, price: 2290, category: "Road Trip", image: "1506377580772-7b3e1ed3b276", featured: false, popular: false },
  { title: "Maldives Overwater Paradise", country: "Maldives", region: "Asia", duration: 7, price: 4990, category: "Luxury", image: "1514282401047-d79a71a590e8", featured: true, popular: true },
  { title: "Costa Rica Eco Adventure", country: "Costa Rica", region: "Central America", duration: 9, price: 2390, category: "Eco", image: "1552733407-5d217c0df089", featured: false, popular: true },
  { title: "Egypt Pyramids & Nile Cruise", country: "Egypt", region: "Africa", duration: 10, price: 2690, category: "Historical", image: "1572255196417-8e68b6b6a0b2", featured: true, popular: true },
  { title: "Barcelona & Ibiza Escape", country: "Spain", region: "Europe", duration: 8, price: 2490, category: "Beach", image: "1583422409516-28912aa35709", featured: false, popular: true },
  { title: "Canadian Rockies Expedition", country: "Canada", region: "North America", duration: 10, price: 3590, category: "Adventure", image: "1503614472-8c93d48e92ae", featured: true, popular: false },
  { title: "Tanzania Serengeti Migration", country: "Tanzania", region: "Africa", duration: 8, price: 3890, category: "Wildlife", image: "1516426122078-c23e76319801", featured: true, popular: true },
  { title: "South Korea Seoul & Jeju", country: "South Korea", region: "Asia", duration: 7, price: 2090, category: "Cultural", image: "1538485399080-85a343934fa5", featured: false, popular: true },
  { title: "Patagonia Wilderness Trek", country: "Argentina", region: "South America", duration: 12, price: 3490, category: "Adventure", image: "1551632816-79bda2197a8b", featured: false, popular: false },
  { title: "Turkish Riviera & Cappadocia", country: "Turkey", region: "Europe", duration: 9, price: 2190, category: "Cultural", image: "1524231757912-21f4fe3a7200", featured: true, popular: true },
  { title: "Australian Great Barrier Reef", country: "Australia", region: "Oceania", duration: 8, price: 3290, category: "Beach", image: "1583212292457-53606a1e0a0a", featured: false, popular: true },
  { title: "Portugal Wine & Coast Tour", country: "Portugal", region: "Europe", duration: 7, price: 1990, category: "Food & Wine", image: "1555883744-1c4a7358b6b5", featured: false, popular: true },
  { title: "Jordan Petra & Wadi Rum", country: "Jordan", region: "Middle East", duration: 6, price: 1890, category: "Historical", image: "157960794264-4c8b3e3a7115", featured: false, popular: false },
  { title: "Croatia Dalmatian Coast Sail", country: "Croatia", region: "Europe", duration: 8, price: 2690, category: "Cruise", image: "1555992336-fb0d29498b13", featured: true, popular: true },
  { title: "Mexico Riviera Maya Discovery", country: "Mexico", region: "North America", duration: 7, price: 1790, category: "Beach", image: "1518638150340-f7e589b80306", featured: false, popular: true },
];

const slugify = (t) => t.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

const tours = tourTemplates.map((t, i) => {
  const slug = slugify(t.title);
  const img = unsplash(t.image);
  const imgs = [t.image, "1469859676082-04a6c5538747", "1476514525535-07fb3b4e5fa1", "1488646953014-85cb44e25828"].map((id) => unsplash(id));
  return {
    id: String(i + 1),
    slug,
    title: t.title,
    country: t.country,
    region: t.region,
    duration: t.duration,
    price: t.price,
    originalPrice: t.price + Math.floor(t.price * 0.15),
    // rating: Math.round((4.5 + (i % 5) * 0.1) * 10) / 10,
    reviewCount: 48 + i * 17,
    image: img,
    images: imgs,
    category: t.category,
    featured: t.featured,
    popular: t.popular,
    description: `Discover the magic of ${t.country} on this unforgettable ${t.duration}-day ${t.category.toLowerCase()} journey. From iconic landmarks to hidden gems, our expert guides will lead you through authentic experiences that reveal the true spirit of the destination. Every detail is carefully curated for comfort, discovery, and lasting memories.`,
    shortDescription: `A premium ${t.duration}-day ${t.category.toLowerCase()} tour exploring the best of ${t.country}.`,
    highlights: [
      `Guided exploration of ${t.country}'s most iconic sites`,
      "Hand-picked boutique accommodations",
      "Small group experience (max 12 travelers)",
      "Expert local guides throughout",
      "All entrance fees and transfers included",
      "Authentic culinary experiences",
    ],
    itinerary: Array.from({ length: Math.min(t.duration, 5) }, (_, d) => ({
      day: d + 1,
      title: d === 0 ? `Arrival in ${t.country}` : d === 1 ? "Cultural Discovery Day" : d === 2 ? "Adventure & Exploration" : d === 3 ? "Local Immersion" : "Departure Day",
      description: d === 0
        ? `Welcome to ${t.country}! Your private transfer awaits at the airport. Check into your hotel and enjoy a welcome dinner featuring local specialties.`
        : d === 1
        ? "Explore historic neighborhoods, visit renowned museums, and enjoy a guided walking tour with insider stories from your local expert."
        : d === 2
        ? "Venture beyond the city to discover natural wonders and scenic viewpoints. Optional activities available for every fitness level."
        : d === 3
        ? "Immerse yourself in local culture through cooking classes, artisan workshops, or market visits tailored to your interests."
        : "Enjoy a leisurely morning before your transfer to the airport. Take home unforgettable memories and new friendships.",
      meals: d === 0 ? ["Dinner"] : d === t.duration - 1 ? ["Breakfast"] : ["Breakfast", "Lunch"],
      accommodation: d < t.duration - 1 ? "4-star boutique hotel" : undefined,
    })),
    included: [
      "Accommodation in selected hotels",
      "Daily breakfast and select meals",
      "Professional English-speaking guide",
      "All transportation during the tour",
      "Entrance fees to listed attractions",
      "24/7 on-ground support",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses and tips",
      "Optional activities not listed",
      "Visa fees if applicable",
    ],
    maxGroupSize: 12,
    difficulty: ["Easy", "Moderate", "Challenging"][i % 3],
    languages: ["English", "Local guide"],
    startLocation: `${t.country} International Airport`,
    endLocation: `${t.country} International Airport`,
    faqs: [
      { question: "What is the best time to visit?", answer: `The ideal season varies, but our team recommends checking weather patterns for ${t.country}. We operate year-round with seasonal highlights.` },
      { question: "Is this tour suitable for solo travelers?", answer: "Absolutely! About 40% of our guests travel solo. You'll join a friendly small group and make connections along the way." },
      { question: "Can dietary requirements be accommodated?", answer: "Yes, please inform us at booking. We work with restaurants and hotels to accommodate vegetarian, vegan, gluten-free, and other dietary needs." },
    ],
  };
});

const outDir = join(__dirname, "../src/data");
mkdirSync(outDir, { recursive: true });

const content = `import type { Tour } from "@/lib/types";

export const tours: Tour[] = ${JSON.stringify(tours, null, 2)};

export const countries = [...new Set(tours.map((t) => t.country))].sort();
export const categories = [...new Set(tours.map((t) => t.category))].sort();
export const regions = [...new Set(tours.map((t) => t.region))].sort();

export function getTourBySlug(slug: string): Tour | undefined {
  return tours.find((t) => t.slug === slug);
}

export function getFeaturedTours(): Tour[] {
  return tours.filter((t) => t.featured);
}

export function getPopularTours(): Tour[] {
  return tours.filter((t) => t.popular);
}

export function getRelatedTours(tour: Tour, limit = 4): Tour[] {
  return tours
    .filter((t) => t.id !== tour.id && (t.country === tour.country || t.category === tour.category))
    .slice(0, limit);
}
`;

writeFileSync(join(outDir, "tours.ts"), content);
console.log("Generated 30 tours");
