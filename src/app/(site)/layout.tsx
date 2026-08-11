import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingContactWidget } from "@/components/layout/floating-contact-widget";
import { getLocalizedServices, getLocalizedSiteData } from "@/data/localized-content";
import { ServicesProvider } from "@/providers/services-provider";
import { SiteProvider } from "@/providers/site-provider";

export const dynamic = "force-static";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const zhServices = getLocalizedServices("zh");
  const enServices = getLocalizedServices("en");
  const zhSiteData = getLocalizedSiteData("zh");
  const enSiteData = getLocalizedSiteData("en");

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
