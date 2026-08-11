import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "An Khai Travel Services",
  description: "Vietnam hotels, visa, car rental, airport transfer, spa, SIM, flight tickets, guides, restaurants, and Chinese travel support.",
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
