import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { AUTOMATION_SLUGS } from "./lib/site";

const stepSchema = z.object({
  step: z.string(),
  minutes: z.number(),
});

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const automationSlugSchema = z.enum(AUTOMATION_SLUGS);

/**
 * サービス（売る単位）。「御社のこの業務を、これだけ省力化します」の単位で5商材を管理する。
 * 各サービスは automations で「対象となる業務（/automation/）」を持ち、業務ページ側はここから親サービスを逆引きする。
 */
const services = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/services" }),
  schema: z.object({
    title: z.string(),
    /** カード・タグ用の短い名前 */
    short: z.string(),
    lead: z.string(),
    description: z.string(),
    /** core = 主力3商材（本開発まで進む）、entry = 入口商品（診断・小さなツール） */
    kind: z.enum(["core", "entry"]),
    /** カードに付ける短いラベル（例: 「まずはここから」） */
    badge: z.string().optional(),
    /** こんな会社・部門に */
    audience: z.array(z.string()),
    pains: z.array(z.string()),
    /** できるようになること・お渡しするもの */
    outcomes: z.array(z.string()),
    before: z.array(stepSchema).default([]),
    after: z.array(stepSchema).default([]),
    /** 削減時間の単位（例: 「問い合わせ1件あたり」）。before/after がある場合に使う */
    unit: z.string().optional(),
    /** 固定価格の商材のみ（診断など）。段階的に進む商材は料金ページの4ステップを参照する */
    price: z.string().optional(),
    period: z.string().optional(),
    automations: z.array(automationSlugSchema).default([]),
    related_cases: z.array(z.string()).default([]),
    faq: z.array(faqSchema).default([]),
    order: z.number().default(99),
    published: z.boolean().default(true),
  }),
});

const automation = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/automation" }),
  schema: z.object({
    title: z.string(),
    lead: z.string(),
    description: z.string(),
    pains: z.array(z.string()),
    before: z.array(stepSchema),
    after: z.array(stepSchema),
    related_cases: z.array(z.string()).default([]),
    faq: z.array(faqSchema).default([]),
    order: z.number().default(99),
    published: z.boolean().default(true),
  }),
});

const industries = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/industries" }),
  schema: z.object({
    title: z.string(),
    lead: z.string(),
    description: z.string(),
    og_title: z.string().optional(),
    pains: z.array(z.string()),
    before: z.array(stepSchema),
    after: z.array(stepSchema),
    related_cases: z.array(z.string()).default([]),
    published: z.boolean().default(true),
  }),
});

const cases = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/cases" }),
  schema: z.object({
    title: z.string(),
    industry: z.enum(["trade", "manufacturing", "medical", "sales", "other"]),
    automation: z.array(automationSlugSchema),
    before: z.array(stepSchema),
    after: z.array(stepSchema),
    // 削減時間は before/after から算出する（手入力しない）
    tech: z.array(z.string()),
    period: z.string(),
    price_range: z.string().optional(),
    faq: z.array(faqSchema).default([]),
    is_model_case: z.boolean().default(true),
    published: z.boolean().default(true),
    date: z.coerce.date(),
  }),
});

export const collections = { services, automation, industries, cases };
