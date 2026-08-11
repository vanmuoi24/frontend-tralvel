import { notFound } from "next/navigation";
import { ServiceOptionsFilter } from "@/components/services/service-options-filter";
import { getLocalizedServiceById } from "@/data/localized-content";
import { getServiceDetailCatalog } from "@/data/service-detail-catalog";
import { staticServiceParams } from "@/data/static-route-params";

type ServicePageProps = {
  params: Promise<{ service: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return staticServiceParams;
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { service: serviceId } = await params;
  const service = getLocalizedServiceById(serviceId, "zh");

  return {
    title: `${service?.label ?? "Service"} | An Khai Travel`,
    description: service?.description,
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { service: serviceId } = await params;
  const zhService = getLocalizedServiceById(serviceId, "zh");
  const enService = getLocalizedServiceById(serviceId, "en");
  const catalog = getServiceDetailCatalog(serviceId);

  if (!zhService || !enService || !catalog) {
    notFound();
  }

  return (
    <div className="bg-[#f3f4f6] py-6 md:py-8">
      <div className="mx-auto max-w-7xl px-4">
        <ServiceOptionsFilter catalog={catalog} services={{ zh: zhService, en: enService }} serviceId={zhService.id} />
      </div>
    </div>
  );
}
