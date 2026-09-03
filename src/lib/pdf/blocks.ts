import type { CollectionEntry } from "astro:content";
import { t } from "@/lib/i18n";
import { type Plan, plans } from "@/lib/plans";
import {
  formatMinutes,
  reductionRate,
  type Step,
  savedMinutes,
  totalMinutes,
} from "@/lib/reduction";
import { INDUSTRY_LABELS, SITE_URL } from "@/lib/site";
import type { Brochure } from "./doc";
import { parseMarkdown } from "./markdown";

/**
 * サービス資料・総合資料で共通して使うブロック。
 * Web の各セクション（PricingLadder / BeforeAfter / モデルケース）と同じデータを同じ言葉で並べる。
 */

export type AutomationEntry = CollectionEntry<"automation">;
export type CaseEntry = CollectionEntry<"cases">;

export function savedLabel(before: Step[], after: Step[]): string {
  return `−${formatMinutes(savedMinutes(before, after))}（${reductionRate(before, after)}%削減）`;
}

export function renderMarkdown(b: Brochure, src: string | undefined): void {
  for (const block of parseMarkdown(src)) {
    switch (block.type) {
      case "heading":
        b.subsection(block.text);
        break;
      case "paragraph":
        b.paragraph(block.text);
        break;
      case "list":
        b.bullets(block.items, { marker: block.ordered ? "number" : "dot" });
        break;
    }
  }
}

export function beforeAfterTable(
  b: Brochure,
  before: Step[],
  after: Step[],
  unit = "1回あたり",
): void {
  const rows: string[][] = [
    ...before.map((s, i) => [
      i === 0 ? "Before\n（手作業）" : "",
      s.step,
      `${s.minutes}分`,
    ]),
    ["", "合計", formatMinutes(totalMinutes(before))],
    ...after.map((s, i) => [
      i === 0 ? "After\n（自動化後）" : "",
      s.step,
      `${s.minutes}分`,
    ]),
    ["", "合計", formatMinutes(totalMinutes(after))],
  ];
  b.table(
    [
      { label: "", width: 16, bold: true },
      { label: "作業", width: 64 },
      { label: "時間", width: 16, align: "right" },
    ],
    rows,
    { boldRows: [before.length, before.length + 1 + after.length] },
  );
  b.highlight(
    `${unit}の削減時間`,
    savedLabel(before, after),
    "実際の削減時間は業務内容・データ量により変動します。診断では貴社の業務で試算します。",
  );
}

export function pricingTable(b: Brochure, items: Plan[] = plans("ja")): void {
  b.table(
    [
      { label: "STEP", width: 10, bold: true },
      { label: "内容", width: 20, bold: true },
      { label: "含まれるもの", width: 40 },
      { label: "料金", width: 15 },
      { label: "期間の目安", width: 15 },
    ],
    items.map((p) => [
      p.step,
      p.name,
      p.items.map((i) => `・${i}`).join("\n"),
      p.price,
      p.period,
    ]),
    { size: 8.5 },
  );
  b.bullets(
    items.map((p) => `${p.name}：${p.note}`),
    { size: 8.5 },
  );
}

export function automationsTable(
  b: Brochure,
  automations: AutomationEntry[],
): void {
  b.table(
    [
      { label: "業務", width: 20, bold: true },
      { label: "内容", width: 54 },
      { label: "削減時間の目安", width: 26 },
    ],
    automations.map((a) => [
      a.data.title,
      a.data.lead,
      `1回あたり\n${savedLabel(a.data.before, a.data.after)}`,
    ]),
    { size: 8.5 },
  );
}

export function casesTable(b: Brochure, cases: CaseEntry[]): void {
  b.table(
    [
      { label: "業種", width: 14, bold: true },
      { label: "内容", width: 38 },
      { label: "Before → After", width: 22 },
      { label: "削減時間", width: 26 },
    ],
    cases.map((c) => [
      INDUSTRY_LABELS[c.data.industry] ?? c.data.industry,
      `${c.data.title}\n（${c.data.period}${c.data.price_range ? `・${c.data.price_range}` : ""}）`,
      `${formatMinutes(totalMinutes(c.data.before))} → ${formatMinutes(totalMinutes(c.data.after))}`,
      `1回あたり\n${savedLabel(c.data.before, c.data.after)}`,
    ]),
    { size: 8.5 },
  );
  b.note(t("ja").modelCaseNote);
}

export function contactBlock(b: Brochure): void {
  b.section("お問い合わせ");
  b.contact(
    [
      { label: "無料相談フォーム", value: `${SITE_URL}/contact/` },
      { label: "サービス一覧", value: `${SITE_URL}/services/` },
      { label: "開発者について", value: `${SITE_URL}/about/` },
    ],
    "「うちの業務でもできる？」の段階で大丈夫です。現状の手作業を伺い、自動化できるか・いくらかかるかをお答えします（1営業日以内に返信）。相談から設計・開発・導入後の改善まで、同じ担当者が対応します。",
  );
}
