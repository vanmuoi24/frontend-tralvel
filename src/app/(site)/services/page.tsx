import { ServiceDirectory } from "@/components/services/service-directory";
import { getLocalizedServices } from "@/data/localized-content";

export const dynamic = "force-static";

export default function ServicesPage() {
  const services = getLocalizedServices("zh");

  return (
    <div className="bg-[#f3f4f6] py-6 md:py-8">
      <div className="mx-auto max-w-7xl px-4">
        <ServiceDirectory services={services} />
      </div>
    </div>
  );
}
