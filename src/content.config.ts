import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const stepSchema = z.object({
  step: z.string(),
  minutes: z.number(),
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
    automation: z.array(
      z.enum(["pdf", "excel", "mail", "sales", "backoffice", "search"]),
    ),
    before: z.array(stepSchema),
    after: z.array(stepSchema),
    // 削減時間は before/after から算出する（手入力しない）
    tech: z.array(z.string()),
    period: z.string(),
    price_range: z.string().optional(),
    is_model_case: z.boolean().default(true),
    published: z.boolean().default(true),
    date: z.coerce.date(),
  }),
});

export const collections = { automation, industries, cases };
