import { navLinks, siteConfig, statistics, type NavLink, type SiteConfig, type SiteStatistic } from "@/data/site";
import { GetContactInformation } from "@/services/Contact/ContactAPI";
import type { BackendSiteSetting, BackendSiteSettingRequest } from "@/services/Site/SiteSettingsAPI";

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function numberValue(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : Number(value) || fallback;
}

function firstStringValue(...values: unknown[]) {
  for (const value of values) {
    const nextValue = stringValue(value);
    if (nextValue) return nextValue;
  }

  return "";
}

function appContactHref(...values: unknown[]) {
  const href = firstStringValue(...values);
  if (!href || href.startsWith("/contact")) return "";

  return href;
}

function mapQrCodes(qrImages: Record<string, unknown>, contactLinks: Record<string, unknown>) {
  const rawQrCodes = Array.isArray(qrImages.contactQrCodes) ? qrImages.contactQrCodes : [];
  const firstQrCode = typeof rawQrCodes[0] === "object" && rawQrCodes[0] ? rawQrCodes[0] as Record<string, unknown> : {};
  const secondQrCode = typeof rawQrCodes[1] === "object" && rawQrCodes[1] ? rawQrCodes[1] as Record<string, unknown> : {};
  const wechatQrImage = firstStringValue(
    qrImages.wechat,
    qrImages.webchat,
    qrImages.wechatQr,
    qrImages.webchatQr,
    qrImages.wechatQrImage,
    qrImages.webchatQrImage,
    firstQrCode.image,
    siteConfig.webchatQrImage,
  );
  const lineQrImage = firstStringValue(
    qrImages.line,
    qrImages.lineQr,
    qrImages.lineQrImage,
    secondQrCode.image,
    siteConfig.lineQrImage,
  );
  const wechatName = firstStringValue(qrImages.wechatName, qrImages.webchatName, firstQrCode.subtitle, firstQrCode.name, "今晚打老虎");
  const lineName = firstStringValue(qrImages.lineName, secondQrCode.subtitle, secondQrCode.name, "LINE support");

  return {
    wechatQrImage,
    lineQrImage,
    qrCodes: [
      {
        title: "WeChat",
        subtitle: wechatName,
        image: wechatQrImage,
        href: appContactHref(contactLinks.wechatApp, contactLinks.wechatUrl, contactLinks.wechatDeepLink, contactLinks.wechat, contactLinks.webchat, firstQrCode.href),
      },
      {
        title: "LINE",
        subtitle: lineName,
        image: lineQrImage,
        href: appContactHref(contactLinks.lineApp, contactLinks.lineUrl, contactLinks.lineDeepLink, contactLinks.line, secondQrCode.href),
      },
    ],
  };
}

function mapPhones(value: Record<string, unknown>[] | undefined) {
  const phones = value
    ?.map((phone, index) => ({
      label: stringValue(phone.label, `Hotline ${index + 1}`),
      value: stringValue(phone.value),
    }))
    .filter((phone) => phone.value);

  return phones?.length ? phones : siteConfig.phones;
}

function mapStatistics(value: Record<string, unknown>[] | undefined): SiteStatistic[] {
  const nextStatistics = value
    ?.map((item) => ({
      label: stringValue(item.label),
      value: numberValue(item.value),
      suffix: stringValue(item.suffix),
    }))
    .filter((item) => item.label);

  return nextStatistics?.length ? nextStatistics : statistics;
}

function mapNavigationLinks(value: Record<string, unknown>[] | undefined): NavLink[] {
  const nextLinks = value
    ?.map((item) => ({
      label: stringValue(item.label),
      href: stringValue(item.href),
    }))
    .filter((item) => item.label && item.href);

  return nextLinks?.length ? nextLinks : navLinks;
}

export function mapBackendSiteSetting(setting?: BackendSiteSetting | null) {
  if (!setting) {
    return { site: siteConfig, statistics, navLinks };
  }

  const contactLinks = setting.contactLinks ?? {};
  const qrImages = setting.qrImages ?? {};
  const socialLinks = setting.socialLinks ?? {};
  const { wechatQrImage, lineQrImage, qrCodes } = mapQrCodes(qrImages, contactLinks);

  const site: SiteConfig = {
    ...siteConfig,
    name: stringValue(setting.siteName, siteConfig.name),
    tagline: stringValue(setting.tagline, siteConfig.tagline),
    description: stringValue(setting.description, siteConfig.description),
    url: stringValue(setting.url, siteConfig.url),
    email: stringValue(setting.email, siteConfig.email),
    address: stringValue(setting.address, siteConfig.address),
    phone: stringValue(setting.phones?.[0]?.value, siteConfig.phone),
    phones: mapPhones(setting.phones),
    webchatHref: stringValue(contactLinks.wechat, stringValue(contactLinks.webchat, siteConfig.webchatHref)),
    telegramHref: stringValue(contactLinks.telegram, siteConfig.telegramHref),
    lineHref: stringValue(contactLinks.line, siteConfig.lineHref),
    webchatQrImage: wechatQrImage,
    lineQrImage,
    contactQrCodes: qrCodes,
    social: {
      facebook: stringValue(socialLinks.facebook, siteConfig.social.facebook),
      instagram: stringValue(socialLinks.instagram, siteConfig.social.instagram),
      youtube: stringValue(socialLinks.youtube, siteConfig.social.youtube),
    },
  };

  return {
    site,
    statistics: mapStatistics(setting.statistics),
    navLinks: mapNavigationLinks(setting.navigationLinks),
  };
}

export async function getBackendSiteData(language = "zh") {
  try {
    const response = await GetContactInformation(language);
    return mapBackendSiteSetting(response.data.data);
  } catch {
    if (language !== "zh") {
      try {
        const fallbackResponse = await GetContactInformation("zh");
        return mapBackendSiteSetting(fallbackResponse.data.data);
      } catch {
        return { site: siteConfig, statistics, navLinks };
      }
    }

    return { site: siteConfig, statistics, navLinks };
  }
}

export function buildSiteSettingPayload(
  site: SiteConfig,
  nextStatistics: SiteStatistic[],
  nextNavLinks: NavLink[],
  language: "zh" | "en",
): BackendSiteSettingRequest {
  return {
    language,
    siteName: site.name,
    tagline: site.tagline,
    description: site.description,
    url: site.url,
    email: site.email,
    address: site.address,
    phones: site.phones,
    socialLinks: site.social,
    contactLinks: {
      wechat: site.webchatHref,
      wechatApp: site.contactQrCodes[0]?.href ?? site.webchatHref,
      telegram: site.telegramHref,
      line: site.lineHref,
      lineApp: site.contactQrCodes[1]?.href ?? site.lineHref,
    },
    qrImages: {
      wechat: site.webchatQrImage,
      wechatName: site.contactQrCodes[0]?.subtitle ?? "",
      line: site.lineQrImage,
      lineName: site.contactQrCodes[1]?.subtitle ?? "",
    },
    statistics: nextStatistics,
    navigationLinks: nextNavLinks,
  };
}
