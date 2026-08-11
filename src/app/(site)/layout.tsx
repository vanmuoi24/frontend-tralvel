import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingContactWidget } from "@/components/layout/floating-contact-widget";
import { getBackendServices } from "@/data/backend-services";
import { getBackendSiteData } from "@/data/backend-site";
import { ServicesProvider } from "@/providers/services-provider";
import { SiteProvider } from "@/providers/site-provider";

export const dynamic = "force-static";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [zhServices, enServices, zhSiteData, enSiteData] = await Promise.all([
    getBackendServices("zh"),
    getBackendServices("en"),
    getBackendSiteData("zh"),
    getBackendSiteData("en"),
  ]);

  return (
    <ServicesProvider services={{ zh: zhServices, en: enServices }}>
      <SiteProvider siteData={{ zh: zhSiteData, en: enSiteData }}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingContactWidget />
      </SiteProvider>
    </ServicesProvider>
  );
}
