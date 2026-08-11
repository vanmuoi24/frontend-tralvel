import { notFound } from "next/navigation";
import { AirportTransferDetailView } from "@/components/services/airport-transfer/airport-transfer-detail-view";
import { airportTransferVehicles } from "@/data/airport-transfer";

type AirportTransferDetailPageProps = {
  params: Promise<{ vehicle: string }>;
};

export const dynamic = "force-dynamic";

function getVehicle(slug: string) {
  return airportTransferVehicles.find((vehicle) => vehicle.slug === slug);
}

export async function generateMetadata({ params }: AirportTransferDetailPageProps) {
  const { vehicle } = await params;
  const item = getVehicle(decodeURIComponent(vehicle));

  return {
    title: `${item?.name.en ?? "Airport transfer"} | An Khai Travel`,
    description: item?.route.en,
  };
}

export default async function AirportTransferDetailPage({ params }: AirportTransferDetailPageProps) {
  const { vehicle } = await params;
  const item = getVehicle(decodeURIComponent(vehicle));

  if (!item) {
    notFound();
  }

  return <AirportTransferDetailView vehicle={item} />;
}
