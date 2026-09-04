# techvit-solutions

TechVit Solutions のサービスサイト（https://solutions.techvit.me）。

「その手作業、毎月何時間かかっていますか？」— 中小企業の手作業（社内資料の検索・営業前の調査・報告書作成・請求書入力など）を AI で省力化するサービスの営業用サイト。

「エンジニア」ではなく「御社のこの業務を、これだけ省力化します」を売る方針で、情報を次の3階層に分けている。

| 階層 | ページ | 単位 |
|---|---|---|
| サービス（何を売るか） | `/services/`（5商材: AI業務診断 / 小さな業務ツール / ナレッジ検索・問い合わせ対応 / 営業支援 / ドキュメント業務） | 商品・料金・進め方 |
| 業務自動化（どの作業が軽くなるか） | `/automation/`（6業務: PDF / Excel / メール / 営業 / バックオフィス / 社内検索） | 業務ごとの Before / After |
| モデルケース（どれだけ減るか） | `/cases/` | 削減時間の具体例 |

料金は 診断 → PoC → 本開発 → 運用・改善（月額） の4ステップで、データは `src/lib/plans.ts` に一元化している。

営業資料（PDF）は `/downloads/` から登録不要でダウンロードできる。総合資料1本 + サービス別5本を、ビルド時に上記と同じデータから自動生成する（手作業で PDF を作らない）。

上記5サービスとは別に、`/services/webmcp/`（WebMCP先行検証サービス）がある。SaaS事業者向けの実験的な取り組みで、対象読者・料金体系・コンプライアンス上の注記が独自のため、services コレクションではなく `src/lib/webmcp.ts` + 専用ページで管理している。詳細は下記「WebMCP先行検証サービス」を参照。

## 技術スタック

- [Astro](https://astro.build/)（`output: 'static'` のみ、SSR なし）
- Tailwind CSS v4（`@tailwindcss/vite` プラグイン方式、`tailwind.config` なし）
- Content Collections（MDX + zod）で サービス / 業務自動化 / 業界別LP / モデルケース をデータ管理
- 営業資料 PDF は [pdfkit](https://pdfkit.org/) でビルド時に生成（`src/lib/pdf/`、フォントは BIZ UDPGothic を同梱）
- 問い合わせは Google Form（バックエンドなし）
- デプロイ: Cloudflare Workers 静的アセット（GitHub 連携で `main` push → 自動デプロイ）
- Lint / Format: Biome

## 開発

必要なツール:

- Node.js 22 または 24（推奨バージョンは `.node-version` を参照）
- pnpm 10（`corepack enable` で有効化可能）
- GNU Make

```bash
make setup      # 環境確認 + 依存関係のインストール
make dev        # 開発サーバー
```

よく使うコマンドは Makefile にまとめています。

```bash
make help         # コマンド一覧
make check        # lint + 型チェック + フォーマット確認
make format       # 自動フォーマット
make build        # 本番ビルド → dist/
make preview      # 本番ビルドをローカルで確認
make ci           # 依存関係の再現 + 全チェック + ビルド
make clean        # dist/ と .astro/ を削除
```

個別の `pnpm dev`、`pnpm build` なども引き続き利用できます。

## ディレクトリ

```
src/
├── assets/fonts/      # PDF 埋め込み用フォント（BIZ UDPGothic, SIL OFL）。サイトには配信しない
├── components/        # Button/Card/Section (ui/), BeforeAfter, Cta, DownloadPdf, ModelCaseNote, PricingLadder, ServiceCard
├── content/           # services / automation / industries / cases コレクション（MDX）
├── content.config.ts  # zod スキーマ
├── layouts/           # Base（head/OGP/JSON-LD）, Landing（サービス・業界別LP用、Service JSON-LD 付き）
├── pages/             # ルーティング（downloads/*.pdf.ts は PDF を返す静的エンドポイント）
├── styles/global.css  # Tailwind v4（@theme でデザイントークン）
└── lib/               # seo.ts, reduction.ts（削減時間の算出）, plans.ts（料金4ステップ）, services.ts（サービス⇄業務の逆引き）, downloads.ts（PDF のパス・版）, pdf/（PDF 生成）, site.ts（定数）
```

## 営業資料（PDF）

| ファイル | 内容 | 生成元 |
|---|---|---|
| `/downloads/techvit-services.pdf` | 総合資料（考え方 / サービス一覧 / 自動化できる業務 / 料金 / モデルケース） | `src/lib/pdf/overview.ts` |
| `/downloads/services/<slug>.pdf` | サービス別資料（対象 / 課題 / Before→After / お渡しするもの / 本文 / 対象業務 / 料金 / モデルケース / FAQ） | `src/lib/pdf/service.ts` |

- `src/pages/downloads/*.pdf.ts` の静的エンドポイントが `pnpm build` 時に pdfkit で生成する。Web と同じ Content Collections / `plans.ts` を読むので、MDX や料金を直せば PDF も同時に変わる（別途 PDF を作り直さない）
- 部品（見出し・箇条書き・表・表紙・フッター）は `src/lib/pdf/doc.ts`、資料間で共通の表（料金・業務・モデルケース）は `src/lib/pdf/blocks.ts`
- 表紙とフッターに「YYYY年M月版」（ビルド時点）を入れている。渡した資料と Web の料金がずれたときの目印
- 表紙とフッターのブランドマークは `public/icon-192.png`（サイトのヘッダー・favicon・OG 画像と同じ素材）を `src/lib/pdf/brand.ts` から参照する
- ダウンロード導線: `/downloads/`（一覧）、サービス各ページのヒーローと末尾、サービス一覧のヒーロー、トップのサービス欄、フッター。`DownloadPdf.astro` を使う
- PDF は sitemap に含めない（`/downloads/` の一覧ページだけ載る）
- 英語版 PDF は未対応（Phase 2）

## WebMCP先行検証サービス（`/services/webmcp/`）

SaaS管理画面にWebMCP対応を試験導入し、AIが操作候補を適切に選べるか・安全に確認を挟めるか・非対応環境で既存機能を壊さないかを検証する実験的なサービス。他の5サービスと違い、対象読者（SaaS事業責任者・PdM・開発/セキュリティ担当）・独自の4段階料金（A診断 10〜20万円 / B 1ツールPoC 20〜40万円 / C 本導入 50〜100万円〜 / D 継続改善 月5〜15万円）を持つため、`services` コレクションではなく専用に管理する。

- コンテンツは `src/lib/webmcp.ts` に集約（LP と PDF の両方がここを参照する、単一の情報源）
- LP: `src/pages/services/webmcp.astro`。PDF: `src/lib/pdf/webmcp.ts` → `/downloads/webmcp.pdf`
- 導線: `/services/`・`/downloads/` それぞれに「SaaS事業者向け：実験的な取り組み」として独立したセクションを設置（既存5サービスの一覧・グリッドには混ぜない）。主要ナビゲーション（`NAV_ITEMS`）には追加していない
- **コンプライアンス上の注記は削らない**: ヒーロー直下の「試験段階のWeb APIを用いる」注記、「売らないもの／売るもの」の対比、料金表の個別見積り注記、FAQの非保証文言は、誇大な期待値を防ぐための必須要素（社内docx「WebMCP先行検証サービス LP仕様書・制作指示書」準拠）。コピーを変更する場合もこの方針は維持すること
- デモ動画は未制作のため「準備中」の正直なプレースホルダーを表示している。動画を追加する際は、対応ブラウザ・AI・実施日・バージョンの明記と「全環境を保証しません」の注記をセットで入れること
- 相談フォームは既存の一般用 Google Form（`/contact/`）を流用している。専用フォーム（会社名・SaaS URL・対象管理画面などの構造化フィールド）は未整備で、LP側に「ご相談の際にお伺いする情報」として一覧を表示することで代替している（残タスク参照）

## コンテンツ運用ルール

- サービス（`src/content/services/`）は「売る単位」。`kind: core`（主力3商材）/ `kind: entry`（入口: 診断・小さなツール）で分け、`automations` に対象となる業務（`/automation/` のスラッグ）を持たせる。業務ページ側は `src/lib/services.ts` で親サービスを逆引きするため、親子関係はサービス側にだけ書く
- 料金・期間・各ステップの内容は `src/lib/plans.ts` だけを編集する（トップ / 料金 / サービス各ページ / 英語ページが同じデータを参照する）。金額を変えたら `src/content/cases/` の `price_range` と `src/lib/site.ts` の `SITE_DESCRIPTION` も合わせて確認する
- 技術名（RAG・LLM など）は見出しや売り文句にしない。「探す時間」「回答を作る時間」など業務の言葉で書き、技術は FAQ や「実現の根拠」に置く
- モデルケース（`src/content/cases/`）には「※導入効果のモデルケースです」の注記を必ず表示する（`is_model_case: true` で自動表示）。実績と誤認させる表現は使わない
- 削減時間は frontmatter の `before` / `after` から自動算出する（手入力しない）
- 技術スタック名は主役にせず、「Before → After → 削減時間」の後に「実現の根拠」として置く

## 英語ページ（/en/）

海外案件・海外プラットフォーム向けの実績提示を目的に、`/en/` 配下に英語ページを追加している（全ページ対訳ではなく、海外営業に必要なページのみ）。設計の全体像は `docs/i18n-en-plan.md` を参照。

- **ルーティング**: `/en/` サブディレクトリ。日本語ページのURLは一切変更していない
- **コンテンツ**: `src/content/cases/en/<slug>.mdx` のようにロケールサブフォルダ＋同名ファイルで英語版を管理する。同名ファイルの有無が言語ペアの対応表を兼ねる（`src/lib/i18n.ts` の `localeOfId` / `stripLocalePrefix` 参照）
- **UI文字列辞書**: `src/lib/i18n.ts` の `t(locale)` に集約。共通コンポーネント（Header/Footer/Cta/ModelCaseNote/Breadcrumb/BeforeAfter/Base/Landing）は `locale?: Locale`（デフォルト `"ja"`）を受け取り、省略時は既存の日本語ページと同じ出力になる
- **hreflang**: 言語ペアが実在するページだけ `Base` に `alternates={{ ja: "...", en: "..." }}` を渡す（`src/lib/seo.ts` の `alternateLinks`）。ペアがないページ（例: `/en/services/` は日本語側が automation 6ページに分割されており1:1対応がないため）には付けない
- **`/en/services/`** は サービス5商材のメニュー（"What we offer"）と automation 6ページのダイジェスト（"What we automate"）を1ページに集約したもの（Content Collections ではなく手書きの `.astro`）。サービス個別ページ・automation 個別ページの英訳は Phase 2
- **`/en/contact/`** は英語版 Google Form（`GOOGLE_FORM_URL_EN`、`src/lib/site.ts`）を埋め込み。日本語版と同じ構成（iframe + 別タブリンク）
- **新しい日本語コンテンツを追加/更新したら**: 対応する `en/` ファイルがあれば同じPRで更新する（翻訳ドリフト防止）

## SEO

- `Base.astro`: title / description / canonical / robots / OGP（画像サイズ付き）/ Twitter Card / Organization JSON-LD を共通出力
- `Landing.astro`（業界別LP）: 上記に加えて Service JSON-LD を出力
- `Breadcrumb.astro`: トップ以外の全ページにパンくずリスト（表示 + BreadcrumbList JSON-LD）を設置。新しいページを追加する際は他ページに倣って設置すること
- `astro.config.ts`: サイトマップの優先度を自動設定（トップ 1.0 / 業務自動化・事例 0.8 / その他 0.6）。`trailingSlash: "always"` でURLを統一（`/foo` へのアクセスは Cloudflare 側で `/foo/` へ自動リダイレクト）
- ページ追加時は必ず `title` / `description` を frontmatter またはコンポーネント props で個別に設定すること（未指定時は `SITE_DESCRIPTION` にフォールバックし、重複 description になる）

## デプロイ

### Cloudflare ダッシュボード経由（推奨・継続運用向け）

1. Cloudflare ダッシュボード → Workers & Pages → Create → GitHub 連携で `sibukixxx/techvit-solutions` を選択
2. ビルドコマンド: `pnpm build` / 出力ディレクトリ: `dist`
3. 環境変数: 不要（フォームバックエンドがないため）
4. `main` に push すると自動デプロイされる。PR ごとにプレビュー URL が発行される
5. カスタムドメイン `solutions.techvit.me` をカスタムドメイン設定から割り当てる

### Wrangler CLI 経由（動作確認・初回デプロイ向け）

```bash
pnpm dlx wrangler login   # 初回のみ Cloudflare アカウント認証
pnpm deploy               # astro build && wrangler deploy
```

`wrangler.jsonc` は `dist/` を静的アセットとして配信する設定のみで、Worker スクリプト（`main`）は持ちません。`html_handling: "auto-trailing-slash"` により `/pricing` → `/pricing/` のようなリダイレクトも自動処理されます。

## CI

GitHub Actions のワークフローは `docs/github-workflows-ci.yml` に置いてあります。
（Claude の GitHub App に `workflows` 権限がなく直接 push できないため）
以下を実行して有効化してください:

```bash
mkdir -p .github/workflows
git mv docs/github-workflows-ci.yml .github/workflows/ci.yml
git commit -m "ci: enable GitHub Actions workflow" && git push
```

## 残タスク

- [x] Google Form 作成 → `src/lib/site.ts` の `GOOGLE_FORM_URL_JA` / `GOOGLE_FORM_URL_EN` を本番 URL に差し替え
- [x] `public/og-default.png` を正式デザインに差し替え（カプセル＋葉のブランドマーク。`public/logo-mark.png` / `icon-*.png` / `favicon.svg` と同じ素材）
- [x] Cloudflare ダッシュボードで GitHub 連携（ビルド: `pnpm build` / 出力: `dist`）
- [x] カスタムドメイン `solutions.techvit.me` の割り当て
- [ ] デプロイ後、Search Console にプロパティ登録 → `sitemap-index.xml` を送信、Analytics（GA4 など）タグを `Base.astro` に追加
- [ ] 削減時間シミュレーター island（M6、React + TanStack Form）
- [ ] Phase 2: `/en/industry/trade/`（貿易LP英語版）、サービス5ページ・automation 6ページの個別英訳（`docs/i18n-en-plan.md` §3, §7 参照）
- [ ] 営業資料 PDF の英語版（`/en/downloads/`）と、ダウンロード前のメール登録（Google Form 連携）でのリード獲得
- [ ] 小さな業務ツール（`/services/tools/`）に、実際に動くデモ・無料ツールへのリンクを追加する（営業先で見せるポートフォリオ兼、入口の見込み客獲得）
- [ ] 業種別LPの拡充（製造業など）。サービスページから業種別LPへ導線をつなぐ
- [ ] WebMCP先行検証サービス（`/services/webmcp/`）専用の Google Form 作成（会社名・SaaS URL・対象管理画面などの構造化フィールド、`src/lib/webmcp.ts` の `WEBMCP_FORM_FIELDS` 参照）。作成後は LP・PDF のCTAリンク先を専用フォームに差し替える
- [ ] WebMCP先行検証サービスのデモ動画制作・掲載（対応ブラウザ・AI・実施日・バージョン明記、非保証注記つき）
- [ ] WebMCP先行検証サービスの公開前チェックリスト実施（社内docx §7）と、実装時点の公式仕様（Origin Trial期限・文字数上限など）の再確認。基準日（2026年9月4日）以降に仕様が変わっていないか要確認
