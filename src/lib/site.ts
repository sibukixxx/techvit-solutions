export const SITE_NAME = "TechVit Solutions";
export const SITE_URL = "https://solutions.techvit.me";
export const SITE_DESCRIPTION =
  "社内ナレッジ検索・営業支援・ドキュメント作成など、毎月くり返す手作業をAIとソフトウェアで省力化。AI業務診断3〜5万円から、相談した本人が設計して作る業務自動化サービス。";

export const GOOGLE_FORM_URL_JA =
  "https://docs.google.com/forms/d/e/1FAIpQLSfKUnH6DRmqjD-_uugEAxOPNLU1s7j1ELpgqvJeMDBwQ7pUpQ/viewform";
export const GOOGLE_FORM_EMBED_URL_JA = `${GOOGLE_FORM_URL_JA}?embedded=true`;

export const GOOGLE_FORM_URL_EN =
  "https://docs.google.com/forms/d/e/1FAIpQLSetPISiw14cUgju86XyJcpVFrnNW8vv8Vc2EeSCN7f2xufadQ/viewform";
export const GOOGLE_FORM_EMBED_URL_EN = `${GOOGLE_FORM_URL_EN}?embedded=true`;

export const NAV_ITEMS = [
  { href: "/services/", label: "サービス" },
  { href: "/automation/", label: "業務自動化" },
  { href: "/cases/", label: "モデルケース" },
  { href: "/pricing/", label: "料金" },
  { href: "/about/", label: "開発者について" },
] as const;

export const INDUSTRY_LABELS: Record<string, string> = {
  trade: "貿易・輸出入",
  manufacturing: "製造業",
  medical: "クリニック・医療法人",
  sales: "営業部門",
  other: "その他",
};

/** 自動化できる業務（/automation/）のスラッグ一覧。content.config.ts の enum と一致させる */
export const AUTOMATION_SLUGS = [
  "pdf",
  "excel",
  "mail",
  "sales",
  "backoffice",
  "search",
] as const;
export type AutomationSlug = (typeof AUTOMATION_SLUGS)[number];

export const AUTOMATION_LABELS: Record<string, string> = {
  pdf: "PDF・文書",
  excel: "Excel・事務",
  mail: "メール",
  sales: "営業",
  backoffice: "バックオフィス",
  search: "社内AI検索",
};

/** サービス（/services/）の種別ラベル。core = 主力3商材、entry = 入口（診断・小さなツール） */
export const SERVICE_KIND_LABELS: Record<"core" | "entry", string> = {
  core: "主力サービス",
  entry: "まず小さく始める",
};
