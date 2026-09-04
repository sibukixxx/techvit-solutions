import { PDF_VERSION } from "@/lib/downloads";
import { SITE_URL } from "@/lib/site";
import {
  WEBMCP_BADGE,
  WEBMCP_CONCLUSION,
  WEBMCP_CONTRACT_NOTE,
  WEBMCP_DELIVERABLES,
  WEBMCP_DESCRIPTION,
  WEBMCP_FAQ,
  WEBMCP_FINAL_CTA,
  WEBMCP_FORM_FIELDS,
  WEBMCP_HERO,
  WEBMCP_NOT_VS_SELL,
  WEBMCP_PLANS,
  WEBMCP_POC_SCOPE,
  WEBMCP_PRICE_NOTE,
  WEBMCP_PROBLEM,
  WEBMCP_PROCESS,
  WEBMCP_TITLE,
  WEBMCP_VALUE_POINTS,
} from "@/lib/webmcp";
import { Brochure, C } from "./doc";

/** WebMCP先行検証サービスの資料（A4・4ページ）。/services/webmcp/ と同じデータから組み立てる */
export async function buildWebmcpBrochure(): Promise<Buffer> {
  const b = new Brochure(
    { title: `${WEBMCP_TITLE}｜資料`, subject: WEBMCP_DESCRIPTION },
    PDF_VERSION,
  );

  b.cover({
    eyebrow: `サービス資料｜${WEBMCP_BADGE}`,
    title: WEBMCP_HERO.heading,
    lead: WEBMCP_HERO.lead,
    meta: [{ label: "まずは", value: `診断 ${WEBMCP_PLANS[0].price}` }],
  });

  b.subsection("この仕様の結論");
  b.paragraph(WEBMCP_CONCLUSION, { bold: true, color: C.brand900 });
  b.table(
    [
      { label: "売らないもの", width: 50 },
      { label: "売るもの", width: 50, bold: true },
    ],
    WEBMCP_NOT_VS_SELL.map((i) => [i.not, i.sell]),
    { size: 8.5 },
  );
  b.coverFooter();

  b.newPage();
  b.section("課題提起");
  b.paragraph(WEBMCP_PROBLEM);

  b.section("提供価値");
  b.bullets(WEBMCP_VALUE_POINTS, { marker: "number" });

  b.section(
    "進め方",
    "いきなり本導入は勧めません。診断で対象を絞り、1ツールのPoCで実際に評価してから本導入を判断します。",
  );
  b.bullets(
    WEBMCP_PROCESS.map((s) => `${s.step}　${s.name}`),
    { marker: "dot" },
  );

  b.section(
    "料金",
    "診断10〜20万円／1ツールPoC 20〜40万円／本導入50〜100万円〜／継続改善 月5〜15万円。画面数・権限・監査要件により個別見積りです。",
  );
  b.table(
    [
      { label: "プラン", width: 16, bold: true },
      { label: "範囲", width: 30 },
      { label: "成果物", width: 32 },
      { label: "価格目安", width: 22 },
    ],
    WEBMCP_PLANS.map((p) => [
      `${p.id}. ${p.name}`,
      p.scope,
      p.deliverables,
      p.price,
    ]),
    { size: 8.5 },
  );
  b.note(WEBMCP_PRICE_NOTE);

  b.section(
    "1ツールPoCの範囲",
    "「どこまでやってもらえるか」の認識をあわせるための一覧です。本導入は範囲を広げてご提案します。",
  );
  b.table(
    [
      { label: "区分", width: 18, bold: true },
      { label: "PoCで含む", width: 41 },
      { label: "PoCで含まない", width: 41 },
    ],
    WEBMCP_POC_SCOPE.map((r) => [r.area, r.included, r.excluded]),
    { size: 8.5 },
  );
  b.subsection("PoC納品物");
  b.bullets(WEBMCP_DELIVERABLES, { marker: "check" });

  b.section("よくある質問");
  b.qa(WEBMCP_FAQ);

  b.section("お問い合わせ");
  b.paragraph(WEBMCP_FINAL_CTA.lead);
  b.contact(
    [
      { label: "無料相談フォーム", value: `${SITE_URL}/contact/` },
      { label: "サービスページ", value: `${SITE_URL}/services/webmcp/` },
    ],
    `${WEBMCP_FINAL_CTA.button}。ご相談の際は次の情報をお伺いします：${WEBMCP_FORM_FIELDS.map((f) => f.label).join("／")}。`,
  );
  b.note(WEBMCP_CONTRACT_NOTE);

  return b.finish();
}
