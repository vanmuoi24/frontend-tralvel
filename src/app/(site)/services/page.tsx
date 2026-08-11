import { ServiceDirectory } from "@/components/services/service-directory";
import { getBackendServices } from "@/data/backend-services";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await getBackendServices("zh");

  return (
    <div className="bg-[#f3f4f6] py-6 md:py-8">
      <div className="mx-auto max-w-7xl px-4">
        <ServiceDirectory services={services} />
      </div>
    </div>
  );
}
