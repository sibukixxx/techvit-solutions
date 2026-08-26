# 英語ページ（/en/）導入プラン

対象ブランチ: `claude/en-pages-01fsud`
前提: 日本語サイト（M0〜M5相当 + SEO強化）が `main` にデプロイ済みであること。

## 0. 目的 — なぜ英語ページか

営業チャネルの拡張。具体的には次の3つを狙う。

1. **海外クライアント向けの実績ページ** — Upwork / Contra などの海外フリーランスプラットフォームで提案する際、ポートフォリオURLとして提示できる英語の実績・サービスページが必須になる
2. **貿易・輸出入LPとの相性** — 第1弾LPの題材（HSコード・輸出入書類）は、日本と取引する海外側の商社・フォワーダーにも刺さるテーマ。英語化の費用対効果が最も高いページ
3. **単一ドメインへのSEO資産集約** — `solutions.techvit.me` に日英両方を置き、ドメイン評価を分散させない

逆に「日本語ページの全訳」は目的ではない。**海外から案件を取るのに必要なページだけ**を英語化する。

## 1. アーキテクチャ決定

| 論点 | 決定 | 理由 / 却下した代案 |
|---|---|---|
| URL構造 | サブディレクトリ `/en/`。日本語はルート直下のまま（プレフィックスなし） | 別ドメイン・サブドメイン案は SEO資産が分散するため却下。既存日本語URLを一切動かさないことが最優先（デプロイ済み・被リンクを壊さない） |
| ルーティング | Astro 組み込み i18n（`i18n: { defaultLocale: 'ja', locales: ['ja','en'], routing: { prefixDefaultLocale: false } }`） | 自前実装より、`getRelativeLocaleUrl` 等のヘルパーと将来の第3言語追加が楽。※実装時に Astro 7 での API 名を公式ドキュメントで要確認 |
| 言語判定 | しない（自動リダイレクトなし）。ヘッダーに手動の言語スイッチャーのみ | Accept-Language による自動リダイレクトはクローラビリティを壊しがち＆Cloudflare静的配信では Worker ロジックが必要になり「SSRゼロ」の方針に反する |
| 翻訳の生成 | ビルド時の機械翻訳はしない。英語コンテンツも MDX として人が管理する | 営業文書なので品質最優先。件数も少ない（Phase 1 で7ページ程度） |
| フォールバック | 未翻訳ページに `/en/` URL を作らない | 「英語URLなのに日本語が出る」ページは信頼を落とす。hreflang も対になるページがある場合のみ出す |

## 2. コンテンツ構造 — ロケールをどう持つか

### Content Collections: ロケールサブフォルダ方式

```
src/content/
├── automation/
│   ├── pdf.mdx            # 日本語（既存、動かさない）
│   └── en/
│       └── pdf.mdx        # 英語版。entry.id = "en/pdf"
├── industries/
│   ├── trade.mdx
│   └── en/trade.mdx
└── cases/
    ├── trade-hs-code.mdx
    └── en/trade-hs-code.mdx
```

- **既存の日本語ファイルは1バイトも動かさない**（`entry.id` が変わると全ルートが変わるため）
- 英語版は `en/` サブフォルダに**同名ファイル**で置く。この「同名規約」が言語ペアの対応表を兼ねる:
  - `id` が `en/` で始まる → 英語エントリ、スラッグは `id.slice(3)`
  - 対応する日本語エントリが存在するかは同名ファイルの有無で機械的に判定でき、hreflang の相互リンクを自動生成できる
- スキーマは日英共通（zod は変更不要）。`before/after` の step 文字列・title 等が英語になるだけ

却下した代案: frontmatter に `locale` フィールドを足す方式。フィルタ条件が全ページに散らばり、書き忘れ事故が起きやすい。フォルダで分ける方が構造が目に見える。

### UI文字列: `src/lib/i18n.ts` 辞書

コンポーネント内の固定文言（「無料相談する」「削減時間」「合計」…）を辞書化する。

```ts
export type Locale = "ja" | "en";

const dict = {
  ja: { consult: "無料相談する", savedPerRun: "1回あたりの削減時間", ... },
  en: { consult: "Book a free consultation", savedPerRun: "Time saved per run", ... },
} as const;

export const t = (locale: Locale, key: keyof typeof dict.ja) => dict[locale][key];
```

- `NAV_ITEMS` / `INDUSTRY_LABELS` / `AUTOMATION_LABELS`（site.ts）もロケール別に持つ
- `formatMinutes`（reduction.ts）に locale 引数を追加: ja「1時間30分」/ en「1h 30m」
- 辞書キーが約30〜40個で収まる規模なので i18n ライブラリは入れない

### コンポーネントの改修方針

共通コンポーネント（BeforeAfter / Cta / Breadcrumb / Header / Footer / ModelCaseNote / Base）に `locale` prop（デフォルト `"ja"`）を追加し、**既存の日本語ページは無改修で動く**ようにする。ハードコードされた日本語文言を `t()` 呼び出しに置換する。

## 3. Phase 1 で作る英語ページ（7ページ）

営業に必要な最小構成。**自動化6ページの個別翻訳はやらない**（Phase 2）。

```
/en/                      TOP（"How many hours does that manual work cost you every month?"）
/en/services/             業務自動化6分野を1ページに集約したサービス概要（日本語の /automation/* 6ページ分のダイジェスト）
/en/cases/                モデルケース一覧
/en/cases/<slug>/         モデルケース詳細 ×3（既存3件を翻訳）
/en/pricing/              料金（JPY表記 + 参考USD併記。"Prices in JPY; approx. USD shown for reference"）
/en/about/                開発者について
/en/contact/              問い合わせ
```

- モデルケース注記の英訳を必ず表示: *"These are illustrative model cases, not client engagements."* — 日本語版と同じ誠実さ基準を維持する
- `/en/contact/` は当面 **メールリンク or 英語版 Google Form**。日本語フォームの埋め込み流用は不可（フォーム項目が日本語のため）。→ §7 残タスク
- 貿易LP `/en/industry/trade/` は Phase 2 の先頭。Phase 1 のスコープからは外すが、構造上はフォルダを掘るだけで追加できる

## 4. レイアウト / SEO の変更点

`Base.astro`:

- `locale` prop → `<html lang={locale}>`、`og:locale`（`ja_JP` / `en_US`）
- **hreflang alternate リンク**: 言語ペアが存在するページのみ、`ja` / `en` / `x-default`（=ja）の3本を出す。ペアの解決は §2 の同名規約から `lib/i18n.ts` のヘルパーで導出
- `<title>` / description は英語ページでは英語で個別指定（buildTitle のサフィックスは共通の "TechVit Solutions" のままで良い）

`Header.astro`:

- 言語スイッチャー（「EN / 日本語」）。**対応ページがあればそのページの相手言語版へ、なければ相手言語のトップへ**リンク

サイトマップ:

- `/en/` 配下は自動で入る。`@astrojs/sitemap` の `i18n` オプションで sitemap 側にも hreflang を出す（実装時に要検証）
- 優先度: `/en/` トップ 0.8、その他 en ページ 0.6（日本語が主戦場のため日本語より一段下げる）

## 5. ローカライズ上の表記ルール

- 通貨: JPY を正とし、`Diagnosis from ¥30,000 (approx. $200)` のように参考換算を併記。換算レートはページに書かず「approx.」に留める（レート変動で嘘にならない）
- 屋号: "TechVit Solutions" 表記は日英共通
- 日付・数値: 英語ページでは `1h 30m` / `Aug 2026` 形式
- トーン: 直訳しない。「あ、それ毎月うちでやってる」のような日本語の話法は、英語では "Sound familiar?" 系の定型に置き換える。各ページ翻訳時にコピーとして書き直す

## 6. 実装ステップ（マイルストーン）

| # | 内容 | 完了条件 |
|---|---|---|
| E1 | i18n 基盤: astro.config の i18n 設定、`lib/i18n.ts` 辞書、共通コンポーネントの locale 対応（既存日本語ページの出力が**ビルド差分ゼロ**であること） | `pnpm build` で既存17ページのHTMLが実質不変 + 全チェック green |
| E2 | `/en/` トップ + `/en/services/` + `/en/about/` + `/en/pricing/` + `/en/contact/` | 5ページ生成、hreflang 相互リンク、言語スイッチャー動作 |
| E3 | 英語モデルケース3件 + `/en/cases/` | cases コレクション `en/` サブフォルダ運用の確立 |
| E4 | sitemap i18n 対応・Search Console で `/en/` の登録確認 | デプロイ後の確認作業 |

E1 の「ビルド差分ゼロ」が品質ゲート。i18n 基盤の導入で既存ページを壊していないことを `diff -r` で機械的に確認してから英語ページに進む。

## 7. 残タスク（コード外・要ユーザー判断）

- [ ] 英語版 Google Form を作るか、`/en/contact/` はメールリンク（`mailto:`）で始めるか
- [ ] 参考USD併記の要否（併記しない選択もあり）
- [ ] Phase 2 の優先順位確認: `/en/industry/trade/`（貿易LP英語版）を先にやるか、automation 6ページ翻訳を先にやるか
- [ ] Upwork 等のプロフィールに貼るURL（`/en/` トップ or `/en/cases/`）の決定

## 8. 運用ルール（翻訳ドリフト防止）

- 日本語コンテンツを更新したら、同名の `en/` ファイルの有無を確認し、あれば同じPRで更新する（レビュー観点としてREADMEに追記する）
- 英語ページを持つのは「海外営業に使うページだけ」。全ページ対訳を維持しようとしない — 維持コストが利益を超えたら英語ページは減らしてよい
