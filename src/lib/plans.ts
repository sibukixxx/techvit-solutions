import type { Locale } from "./i18n";

/**
 * 進め方と料金の4ステップ（診断 → PoC → 本開発 → 運用・改善）。
 * トップ・料金・サービス各ページで同じデータを参照する（数字の二重管理をしない）。
 */
export type Plan = {
  step: string;
  name: string;
  price: string;
  period: string;
  /** 1〜2文の要約（トップ・サービスページのカード用） */
  summary: string;
  /** 含まれるもの（料金ページ用） */
  items: string[];
  /** 補足（料金ページ用） */
  note: string;
  /** 月額など継続型のプラン */
  recurring?: boolean;
};

const PLANS_JA: Plan[] = [
  {
    step: "STEP 1",
    name: "AI業務診断",
    price: "3〜5万円",
    period: "1〜2週間",
    summary:
      "業務を2時間ほど見せていただき、AI化できる業務の洗い出し・優先順位・削減時間と費用の試算をレポートにまとめます。",
    items: [
      "現状の手作業のヒアリングと棚卸し（訪問またはオンライン）",
      "AI化できる業務・できない業務の切り分けと優先順位",
      "削減時間と費用の試算、最初に試す業務を選んだPoC提案書",
    ],
    note: "レポートだけ受け取って社内検討に使っていただいても構いません。",
  },
  {
    step: "STEP 2",
    name: "PoC（お試し導入）",
    price: "10〜30万円",
    period: "2週間〜1ヶ月",
    summary:
      "効果が大きい業務を1つ選び、実データで動く試作品を作って削減時間を実測します。",
    items: [
      "診断で選んだ業務1つに絞って構築",
      "実データで動く試作品を作り、現場で使ってもらう",
      "削減時間の実測と本開発の見積り",
    ],
    note: "「思ったより効果がない」と分かるのもPoCの成果です。ここで止めるのも自由です。",
  },
  {
    step: "STEP 3",
    name: "本開発",
    price: "30万円〜",
    period: "1〜3ヶ月",
    summary:
      "PoCで効果を確認した仕組みを、日常業務で使える形に仕上げて導入します。既存ツールの改修も対応。",
    items: [
      "PoCで確認した仕組みを日常業務で使える形に",
      "エラー処理・人が確認するフロー・引き継ぎ資料まで含む",
      "導入後1ヶ月の調整期間つき",
    ],
    note: "規模により変動します。PoCの結果をもとに固定金額でお見積りします。",
  },
  {
    step: "STEP 4",
    name: "運用・改善",
    price: "5〜20万円/月",
    period: "月額・任意",
    summary:
      "導入後の保守と、AIの回答精度の定期評価、業務の変化に合わせた改善を月額で続けます。設計した本人が担当します。",
    items: [
      "不具合対応と、AIモデルの更新・仕様変更への追随",
      "回答精度の定期評価（実際の質問セットで正答率を測定）",
      "業務の変化に合わせた機能追加・チューニング",
    ],
    note: "本開発が完了した仕組みが対象です。月単位のご契約で、範囲に応じて金額を決めます。",
    recurring: true,
  },
];

const PLANS_EN: Plan[] = [
  {
    step: "STEP 1",
    name: "AI Workflow Assessment",
    price: "$250–450",
    period: "1–2 weeks",
    summary:
      "We spend about two hours watching how your team works, then report what can be automated, in what order, and for roughly what cost.",
    items: [
      "Interview and map out your current manual work (on-site or remote)",
      "Separate what can be automated from what can't, and prioritize",
      "A report estimating time saved and cost, plus a proposal for the first pilot",
    ],
    note: "You're welcome to take just the report and use it for internal discussion.",
  },
  {
    step: "STEP 2",
    name: "PoC (Pilot)",
    price: "$850–2,600",
    period: "2 weeks – 1 month",
    summary:
      "We pick the one task with the biggest payoff and build a working prototype against your real data to measure the actual time saved.",
    items: [
      "Focus on the single task chosen in the assessment",
      "Build a working prototype against real data and let your team use it",
      "Measure actual time saved and quote the full build",
    ],
    note: "Learning “it saves less than we thought” is a valid PoC outcome too — stopping here is fine.",
  },
  {
    step: "STEP 3",
    name: "Full Build",
    price: "From $2,600",
    period: "1–3 months",
    summary:
      "We turn the validated PoC into something your team uses daily, including existing-tool upgrades.",
    items: [
      "Turn the validated PoC into something used daily",
      "Includes error handling, a human review flow, and handoff docs",
      "One month of post-launch tuning included",
    ],
    note: "Varies with scope. Quoted as a fixed price based on the PoC results.",
  },
  {
    step: "STEP 4",
    name: "Ongoing Support & Improvement",
    price: "$450–1,700 / mo",
    period: "Monthly, optional",
    summary:
      "After launch: maintenance, periodic accuracy evaluation of the AI, and improvements as your workflow changes — handled by the person who built it.",
    items: [
      "Bug fixes and keeping up with AI model updates and spec changes",
      "Periodic accuracy evaluation against a real question set",
      "Feature additions and tuning as your workflow evolves",
    ],
    note: "Applies to systems delivered through a full build. Month-to-month, priced by scope.",
    recurring: true,
  },
];

export const PLANS_BY_LOCALE: Record<Locale, Plan[]> = {
  ja: PLANS_JA,
  en: PLANS_EN,
};

export function plans(locale: Locale = "ja"): Plan[] {
  return PLANS_BY_LOCALE[locale];
}
