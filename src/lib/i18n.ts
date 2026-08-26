import { AUTOMATION_LABELS, INDUSTRY_LABELS, NAV_ITEMS } from "./site";

export type Locale = "ja" | "en";

export const LOCALES: Locale[] = ["ja", "en"];

type NavItem = { href: string; label: string };

const NAV_ITEMS_EN: NavItem[] = [
  { href: "/en/services/", label: "Services" },
  { href: "/en/cases/", label: "Case Studies" },
  { href: "/en/pricing/", label: "Pricing" },
  { href: "/en/about/", label: "About" },
];

export const NAV_ITEMS_BY_LOCALE: Record<Locale, readonly NavItem[]> = {
  ja: NAV_ITEMS,
  en: NAV_ITEMS_EN,
};

const INDUSTRY_LABELS_EN: Record<string, string> = {
  trade: "Trade & Import/Export",
  manufacturing: "Manufacturing",
  medical: "Clinics & Medical Corporations",
  sales: "Sales",
  other: "Other",
};

export const INDUSTRY_LABELS_BY_LOCALE: Record<
  Locale,
  Record<string, string>
> = {
  ja: INDUSTRY_LABELS,
  en: INDUSTRY_LABELS_EN,
};

const AUTOMATION_LABELS_EN: Record<string, string> = {
  pdf: "PDF & Documents",
  excel: "Excel & Admin Work",
  mail: "Email",
  sales: "Sales",
  backoffice: "Back Office",
  search: "Internal AI Search",
};

export const AUTOMATION_LABELS_BY_LOCALE: Record<
  Locale,
  Record<string, string>
> = {
  ja: AUTOMATION_LABELS,
  en: AUTOMATION_LABELS_EN,
};

type Dict = {
  home: string;
  breadcrumbAriaLabel: string;
  beforeLabel: string;
  afterLabel: string;
  totalLabel: string;
  savedTimeUnit: string;
  savedTimeLine: (unit: string) => string;
  reductionLine: (rate: number) => string;
  modelCaseNote: string;
  footerTagline: string;
  ctaTitle: string;
  ctaLead: string;
  ctaButton: string;
  consultCta: string;
};

const ja: Dict = {
  home: "ホーム",
  breadcrumbAriaLabel: "パンくずリスト",
  beforeLabel: "Before（手作業）",
  afterLabel: "After（自動化後）",
  totalLabel: "合計",
  savedTimeUnit: "1回あたり",
  savedTimeLine: (unit) => `${unit}の削減時間`,
  reductionLine: (rate) => `（${rate}%削減）`,
  modelCaseNote:
    "※導入効果のモデルケースです。実際の削減時間は業務内容・データ量により変動します。",
  footerTagline:
    "毎月くり返す手作業を、AIで自動化。相談した本人が設計して作ります。",
  ctaTitle: "その手作業、なくせるか無料で診断します",
  ctaLead:
    "「うちの業務でもできる？」の段階で大丈夫です。現状の手作業を伺い、自動化できるか・いくらかかるかをお答えします。",
  ctaButton: "無料相談する（1営業日以内に返信）",
  consultCta: "無料相談",
};

const en: Dict = {
  home: "Home",
  breadcrumbAriaLabel: "Breadcrumb",
  beforeLabel: "Before (Manual)",
  afterLabel: "After (Automated)",
  totalLabel: "Total",
  savedTimeUnit: "per run",
  savedTimeLine: (unit) => `Time saved ${unit}`,
  reductionLine: (rate) => `(${rate}% reduction)`,
  modelCaseNote:
    "*These are illustrative model cases, not actual client engagements. Real-world time savings vary by workload and data volume.",
  footerTagline:
    "We automate the manual work you repeat every month with AI — designed and built by the person you talk to.",
  ctaTitle: "Get a free assessment of what can be automated",
  ctaLead:
    "It's fine to start with \"could this work for us?\". Tell us about your current manual process and we'll tell you what's automatable and roughly what it costs.",
  ctaButton: "Book a free consultation (reply within 1 business day)",
  consultCta: "Free Consultation",
};

export const dict: Record<Locale, Dict> = { ja, en };

export function t(locale: Locale): Dict {
  return dict[locale];
}

/** Content Collections のエントリID（"en/xxx" 規約）からロケールを判定する */
export function localeOfId(id: string): Locale {
  return id.startsWith("en/") ? "en" : "ja";
}

/** "en/xxx" → "xxx"（ja側の id はそのまま返す） */
export function stripLocalePrefix(id: string): string {
  return id.startsWith("en/") ? id.slice(3) : id;
}
