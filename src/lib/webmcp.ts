/**
 * WebMCP先行検証サービスのコンテンツ。
 * LP（/services/webmcp/）と営業資料PDF（/downloads/webmcp.pdf）の両方から同じデータを参照する
 * （社内docx「WebMCP先行検証サービス LP仕様書・制作指示書」の確定コピーに準拠）。
 *
 * 他の5サービスと違い、対象読者（SaaS事業責任者・PdM・開発/セキュリティ担当）・料金体系・
 * コンプライアンス上の注記が独自のため、services コレクションではなくこのモジュール + 専用ページで管理する。
 */

export const WEBMCP_TITLE = "WebMCP先行検証サービス";
export const WEBMCP_SHORT = "WebMCP先行検証";
export const WEBMCP_BADGE = "先行検証・PoC";

export const WEBMCP_DESCRIPTION =
  "SaaS管理画面にWebMCP対応を試験導入し、AIが操作候補を適切に選べるか、安全に確認を挟めるか、非対応環境で既存機能を壊さないかを検証する先行実験サービス。1画面・1ツールのPoCから、診断・本導入・継続改善まで4ステップで進めます。";

export const WEBMCP_DISCLAIMER =
  "試験段階のWeb APIを用いる先行検証サービスです。対応環境は限定され、将来仕様が変更される場合があります。";

export const WEBMCP_HERO = {
  heading: "あなたのSaaS管理画面を、ブラウザAI時代に備える。",
  lead: "WebMCPを使い、まず1つの操作から「AIが正しく選べるか」「安全に実行できるか」を検証します。",
  cta: "先行検証について相談する",
};

/** 「この仕様の結論」。売らないもの／売るものの対比（誤解によるクレームを防ぐための核） */
export const WEBMCP_CONCLUSION =
  "「問い合わせ削減」を約束しません。ブラウザAI普及前の準備、問い合わせ上位10件の構造化、1操作の安全なPoC、AIによるツール選択精度の評価を販売します。";

export const WEBMCP_NOT_VS_SELL: { not: string; sell: string }[] = [
  {
    not: "今すぐ問い合わせが減る保証",
    sell: "将来のブラウザAI普及に備えた対応可能性の検証",
  },
  {
    not: "ChatGPTを含む全AIでの動作保証",
    sell: "検証日時点で明示した対応環境での再現可能なデモ",
  },
  {
    not: "管理画面全体の実装",
    sell: "1画面・1ツールに限定した有償PoC",
  },
  {
    not: "属性を追加するだけの実装代行",
    sell: "似た操作の選択・確認・失敗復旧まで含む評価設計",
  },
];

export const WEBMCP_PROBLEM =
  "AIが画面を操作する時代は近づいています。ただし、現時点ですべてのお客様がChatGPT等から利用できる状態ではありません。だから今は、全面導入ではなく、小さく試し、問い合わせと操作を構造化し、評価データを持つ段階です。";

export const WEBMCP_VALUE_POINTS = [
  "問い合わせ上位10件からAI向け操作候補を整理",
  "1画面・1ツールでPoC",
  "正しいツール選択、確認、失敗復旧を評価",
  "非対応環境では既存画面が通常どおり動く設計",
];

export const WEBMCP_DEMO_NOTE =
  "デモ動画は準備中です。公開時は、対応ブラウザ・AI・実施日・バージョンを併記し、曖昧な依頼に確認を求める例も含めます。動画下には「この環境での検証結果であり、全環境を保証しません」と明記します。";

export type ProcessStep = { step: string; name: string };
export const WEBMCP_PROCESS: ProcessStep[] = [
  { step: "STEP 1", name: "適合性診断" },
  { step: "STEP 2", name: "1ツールPoC" },
  { step: "STEP 3", name: "評価・改善" },
  { step: "STEP 4", name: "本導入判断" },
];

export type WebmcpPlan = {
  id: "A" | "B" | "C" | "D";
  name: string;
  scope: string;
  deliverables: string;
  price: string;
  recurring?: boolean;
};

export const WEBMCP_PLANS: WebmcpPlan[] = [
  {
    id: "A",
    name: "診断",
    scope: "画面・問い合わせ上位10件・候補操作の整理",
    deliverables: "適合性診断、操作カタログ、リスク分類、PoC提案",
    price: "10〜20万円",
  },
  {
    id: "B",
    name: "1ツールPoC",
    scope: "1画面、1ツール、1対応環境。確認・フォールバック・評価を含む",
    deliverables: "動作デモ、実装差分、10〜20評価ケース、結果レポート",
    price: "20〜40万円",
  },
  {
    id: "C",
    name: "本導入",
    scope: "3〜5ツール、権限・計測・運用設計",
    deliverables: "本番実装、評価スイート、運用手順、研修",
    price: "50〜100万円〜",
  },
  {
    id: "D",
    name: "継続改善",
    scope: "仕様変更追従、回帰評価、ツール説明改善",
    deliverables: "月次評価、更新対応、改善バックログ",
    price: "月5〜15万円",
    recurring: true,
  },
];

export const WEBMCP_PRICE_NOTE =
  "画面数・権限・監査要件により個別見積りとなります。10〜20万円は診断（A）の価格で、3〜5ツールの本導入（C）を含む金額ではありません。";

/** PoC（B）に含む／含まないの範囲。誤解によるクレームを防ぐための期待値調整 */
export const WEBMCP_POC_SCOPE: {
  area: string;
  included: string;
  excluded: string;
}[] = [
  {
    area: "画面",
    included: "既存管理画面1画面",
    excluded: "複数プロダクト横断",
  },
  { area: "ツール", included: "1ツール", excluded: "3〜5ツールの本番展開" },
  {
    area: "環境",
    included: "合意した1ブラウザ／1エージェント",
    excluded: "全ブラウザ・全AI保証",
  },
  {
    area: "認証",
    included: "既存ログイン後のセッション利用",
    excluded: "認証基盤刷新",
  },
  {
    area: "計測",
    included: "評価ケース単位の結果記録",
    excluded: "全ユーザー行動分析",
  },
  { area: "運用", included: "手動実行可能な回帰評価", excluded: "24時間SLA" },
];

/** PoC（B）の納品物 */
export const WEBMCP_DELIVERABLES = [
  "実装差分またはサンプルコード",
  "ツール定義書",
  "評価ケース一覧（10〜20件）",
  "評価結果レポート",
  "対応環境表・既知制約",
  "無効化・ロールバック手順",
  "本導入見積り",
];

export const WEBMCP_FAQ = [
  {
    question: "今すぐ問い合わせは減りますか？",
    answer:
      "削減を保証するサービスではありません。現時点では対応環境が限定的なため、準備と評価を成果にします。",
  },
  {
    question: "ChatGPTで使えますか？",
    answer:
      "検証日時点の対応状況を個別に提示します。AI名だけで一律保証しません。",
  },
  {
    question: "本番画面が壊れませんか？",
    answer:
      "機能検出と段階的有効化を行い、非対応環境では通常画面として動作させます。",
  },
  {
    question: "変更操作は勝手に実行されませんか？",
    answer:
      "変更系は確認必須を原則とし、対象・影響・実行内容を画面で示します。",
  },
];

export const WEBMCP_FINAL_CTA = {
  lead: "まずは、問い合わせ上位10件と管理画面1つから。先行検証の対象になるか30分で整理します。",
  button: "検証対象を相談する",
};

/** 相談前に準備いただきたい情報（専用フォーム未整備のため、現状は無料相談フォームでお伺いする） */
export const WEBMCP_FORM_FIELDS: { label: string; required: boolean }[] = [
  { label: "会社名", required: true },
  { label: "担当者名・メールアドレス", required: true },
  { label: "SaaS のURL", required: true },
  { label: "対象の管理画面", required: true },
  { label: "問い合わせ上位3件（任意）", required: false },
  { label: "希望する操作（情報取得／変更／画面遷移）", required: false },
  { label: "利用中の認証方式（任意）", required: false },
];

/** 契約上の注記案（PDF資料の末尾に掲載） */
export const WEBMCP_CONTRACT_NOTE =
  "本サービスは試験段階のブラウザAPIを利用する検証支援です。特定AI・ブラウザへの恒久対応、仕様変更の不発生、問い合わせ削減その他の事業成果を保証するものではありません。対応環境・検証範囲・受入条件は個別契約で定めます。";
