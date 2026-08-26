import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./site";

export function buildTitle(title?: string): string {
  if (!title) return `${SITE_NAME}｜業務自動化・AI活用支援`;
  return `${title}｜${SITE_NAME}`;
}

export function buildDescription(description?: string): string {
  return description ?? SITE_DESCRIPTION;
}

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).href;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
  };
}

export function serviceJsonLd(opts: { name: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: "JP",
  };
}

export type BreadcrumbItem = {
  name: string;
  /** サイトルートからの相対パス（例: "/automation/pdf/"）。末尾はトップ（現在地）のみ省略可 */
  path?: string;
};

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  };
}
