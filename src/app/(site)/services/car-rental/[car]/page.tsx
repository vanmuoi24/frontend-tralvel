import { notFound } from "next/navigation";
import { CarRentalDetailView } from "@/components/services/car-rental/car-rental-detail-view";
import { carRentalPosts } from "@/data/car-rental";
import { staticCarRentalParams } from "@/data/static-route-params";

type CarRentalDetailPageProps = {
  params: Promise<{ car: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return staticCarRentalParams;
}

function getCar(slug: string) {
  return carRentalPosts.find((car) => car.slug === slug);
}

export async function generateMetadata({ params }: CarRentalDetailPageProps) {
  const { car } = await params;
  const item = getCar(decodeURIComponent(car));

  return {
    title: `${item?.title.en ?? "Rental car"} | An Khai Travel`,
    description: item ? `${item.title.en} rental vehicle information.` : undefined,
  };
}

export default async function CarRentalDetailPage({ params }: CarRentalDetailPageProps) {
  const { car } = await params;
  const item = getCar(decodeURIComponent(car));

  if (!item) {
    notFound();
  }

  return <CarRentalDetailView car={item} />;
}
