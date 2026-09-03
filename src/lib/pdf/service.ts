import { getEntry } from "astro:content";
import { PDF_VERSION } from "@/lib/downloads";
import { plans } from "@/lib/plans";
import type { ServiceEntry } from "@/lib/services";
import { SERVICE_KIND_LABELS, SITE_NAME } from "@/lib/site";
import {
  type AutomationEntry,
  automationsTable,
  beforeAfterTable,
  type CaseEntry,
  casesTable,
  contactBlock,
  pricingTable,
  renderMarkdown,
  savedLabel,
} from "./blocks";
import { Brochure, C } from "./doc";

/**
 * サービス1商材ぶんの営業資料（A4・4〜6ページ）。
 * 内容は /services/<slug>/ と同じ Content Collection から組み立てるため、MDX を直せば PDF も変わる。
 */
export async function buildServiceBrochure(
  entry: ServiceEntry,
): Promise<Buffer> {
  const { data } = entry;

  const automations = (
    await Promise.all(data.automations.map((id) => getEntry("automation", id)))
  )
    .filter((a): a is AutomationEntry => Boolean(a?.data.published))
    .sort((a, b) => a.data.order - b.data.order);
  const relatedCases = (
    await Promise.all(data.related_cases.map((id) => getEntry("cases", id)))
  ).filter((c): c is CaseEntry => Boolean(c?.data.published));

  const hasBeforeAfter = data.before.length > 0 && data.after.length > 0;
  const unit = data.unit ?? "1回あたり";

  const b = new Brochure(
    {
      title: `${data.title}｜${SITE_NAME} サービス資料`,
      subject: data.description,
    },
    PDF_VERSION,
  );

  // ---- 表紙 ----
  const meta: { label: string; value: string }[] = [];
  if (data.price) meta.push({ label: "料金", value: data.price });
  if (data.period) meta.push({ label: "期間の目安", value: data.period });
  if (!data.price && data.kind === "core") {
    const first = plans("ja")[0];
    meta.push({ label: "まずは", value: `${first.name} ${first.price}` });
  }
  b.cover({
    eyebrow: `サービス資料｜${SERVICE_KIND_LABELS[data.kind]}`,
    badge: data.badge,
    title: data.title,
    lead: data.lead,
    meta,
  });

  b.subsection("こんな会社・部門に");
  b.boxes(data.audience, { cols: 1, fill: C.brand50, border: C.brand100 });
  if (hasBeforeAfter) {
    b.highlight(
      `${unit}の削減時間の目安`,
      savedLabel(data.before, data.after),
      "手作業の合計と自動化後の合計の差です。内訳は次ページの Before → After をご覧ください。",
    );
  }
  b.subsection("こんな状態に心当たりはありませんか？");
  b.boxes(data.pains, { cols: 2 });
  b.coverFooter();

  // ---- 本文 ----
  b.newPage();
  if (hasBeforeAfter) {
    b.section(
      "Before → After（作業時間の例）",
      "導入した場合の作業時間のイメージです。実際の診断では、貴社の業務で試算します。",
    );
    beforeAfterTable(b, data.before, data.after, unit);
  }

  b.section("できるようになること・お渡しするもの");
  b.bullets(data.outcomes, { marker: "check" });

  if (entry.body?.trim()) {
    b.section("サービスの詳細");
    renderMarkdown(b, entry.body);
  }

  if (automations.length > 0) {
    b.section(
      "対象となる業務",
      "このサービスで自動化する業務と、業務ごとの削減時間の目安です。",
    );
    automationsTable(b, automations);
  }

  b.section(
    "進め方と料金",
    data.kind === "entry"
      ? "このサービスは入口です。効果が見えたら、PoC → 本開発 → 運用・改善へ同じ担当者が引き継ぎます。各段階の金額を先に提示し、次に進むかはその都度ご判断ください。"
      : "診断 → PoC → 本開発 → 運用・改善の4ステップで進めます。各段階の金額を先に提示し、次に進むかはその都度ご判断ください。",
  );
  pricingTable(b);

  if (relatedCases.length > 0) {
    b.section("関連するモデルケース");
    casesTable(b, relatedCases);
  }

  if (data.faq.length > 0) {
    b.section("よくある質問");
    b.qa(data.faq);
  }

  contactBlock(b);
  return b.finish();
}
