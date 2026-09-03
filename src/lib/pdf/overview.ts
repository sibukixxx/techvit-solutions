import { getCollection } from "astro:content";
import {
  OVERVIEW_PDF_TITLE,
  PDF_VERSION,
  servicePdfPath,
} from "@/lib/downloads";
import { getServicesByKind } from "@/lib/services";
import {
  SERVICE_KIND_LABELS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";
import {
  automationsTable,
  casesTable,
  contactBlock,
  pricingTable,
  savedLabel,
} from "./blocks";
import { Brochure, C } from "./doc";

const PRINCIPLES = [
  {
    title: "技術ではなく、業務の時間で提案します",
    body: "「AIを作ります」ではなく「御社のこの業務を、これだけ減らします」の単位でご提案します。RAG や LLM といった技術名は手段で、お約束するのは削減時間です。",
  },
  {
    title: "小さく始めて、数字を見てから広げます",
    body: "いきなり大きな開発は勧めません。3〜5万円の AI業務診断か、1〜2週間で作る小さなツール1つから始め、効果を数字で確認してから本開発に進みます。",
  },
  {
    title: "相談した本人が、設計して、作って、運用します",
    body: "営業・設計・実装・クラウド導入・効果測定・改善まで一人で担当します。伝言ゲームがなく、大人数の体制費用が乗らないので、話が早く価格を抑えられます。",
  },
];

/** 全サービスをまとめた総合資料（初回の提案・社内共有用） */
export async function buildOverviewBrochure(): Promise<Buffer> {
  const { core, entry } = await getServicesByKind();
  const automations = (
    await getCollection("automation", (e) => e.data.published)
  ).sort((a, b) => a.data.order - b.data.order);
  const cases = (
    await getCollection(
      "cases",
      (e) => e.data.published && !e.id.startsWith("en/"),
    )
  ).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const b = new Brochure(
    { title: `${SITE_NAME} ${OVERVIEW_PDF_TITLE}`, subject: SITE_DESCRIPTION },
    PDF_VERSION,
  );

  b.cover({
    eyebrow: OVERVIEW_PDF_TITLE,
    title: "その手作業、毎月何時間かかっていますか？",
    lead: "社内資料の検索、営業前の調査、報告書の作成、請求書の入力。毎月くり返す手作業を AI とソフトウェアで省力化します。営業から設計・開発・運用まで、相談した本人が一人で担当するから、話が早く、余計な費用がかかりません。",
    meta: [
      { label: "AI業務診断", value: "3〜5万円〜" },
      { label: "小さな業務ツール", value: "1〜2週間" },
    ],
  });

  b.subsection("この資料の内容");
  b.bullets([
    "考え方 — 技術ではなく、業務の時間で提案する理由",
    `サービス一覧 — 入口の2商材（${entry.map((s) => s.data.short).join("・")}）と主力の3商材（${core.map((s) => s.data.short).join("・")}）`,
    "自動化できる業務 — 6つの業務と削減時間の目安",
    "進め方と料金 — 診断 → PoC → 本開発 → 運用・改善の4ステップ",
    "モデルケース — 業種別の導入イメージ",
  ]);
  b.coverFooter();

  b.newPage();
  b.section("考え方");
  for (const p of PRINCIPLES) {
    b.subsection(p.title);
    b.paragraph(p.body);
  }

  b.section(
    "サービス一覧",
    "まず小さく始める入口の2商材と、業務を変える主力の3商材。どのサービスも同じ4ステップで進めます。",
  );
  for (const s of [...entry, ...core]) {
    const { data } = s;
    b.subsection(
      `${data.title}（${SERVICE_KIND_LABELS[data.kind]}${data.badge ? `・${data.badge}` : ""}）`,
    );
    b.paragraph(data.lead);
    const facts: string[] = [];
    if (data.price) facts.push(`料金：${data.price}`);
    if (data.period) facts.push(`期間の目安：${data.period}`);
    if (data.before.length > 0 && data.after.length > 0) {
      facts.push(
        `削減時間の目安：${data.unit ?? "1回あたり"} ${savedLabel(data.before, data.after)}`,
      );
    }
    if (facts.length > 0)
      b.paragraph(facts.join("　／　"), {
        size: 9,
        color: C.brand700,
        bold: true,
      });
    b.bullets(data.audience, { size: 9 });
    b.paragraph(`詳しい資料：${SITE_URL}${servicePdfPath(s.id)}`, {
      size: 8,
      color: C.slate500,
    });
  }

  b.section(
    "自動化できる業務",
    "サービスは「何を売るか」、業務は「どの作業が軽くなるか」の単位です。心当たりのある作業から、対応するサービスにたどり着けます。",
  );
  automationsTable(b, automations);

  b.section(
    "進め方と料金",
    "診断 → PoC → 本開発 → 運用・改善の4ステップで進めます。各段階の金額を先に提示し、次に進むかはその都度ご判断ください。",
  );
  pricingTable(b);

  b.section("モデルケース");
  casesTable(b, cases);

  contactBlock(b);
  return b.finish();
}
