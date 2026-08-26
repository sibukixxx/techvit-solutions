# techvit-solutions

TechVit Solutions のサービスサイト（https://solutions.techvit.me）。

「その手作業、毎月何時間かかっていますか？」— 中小企業の手作業（PDF検索・Excel転記・メール処理・請求書入力など）を AI で自動化するサービスの営業用サイト。

## 技術スタック

- [Astro](https://astro.build/)（`output: 'static'` のみ、SSR なし）
- Tailwind CSS v4（`@tailwindcss/vite` プラグイン方式、`tailwind.config` なし）
- Content Collections（MDX + zod）で 業務自動化 / 業界別LP / モデルケース をデータ管理
- 問い合わせは Google Form（バックエンドなし）
- デプロイ: Cloudflare Workers 静的アセット（GitHub 連携で `main` push → 自動デプロイ）
- Lint / Format: Biome

## 開発

```bash
pnpm install
pnpm dev        # 開発サーバー
pnpm build      # 本番ビルド → dist/
pnpm check      # 型チェック（astro check）
pnpm lint       # Biome
```

## ディレクトリ

```
src/
├── components/        # Button/Card/Section (ui/), BeforeAfter, Cta, ModelCaseNote
├── content/           # automation / industries / cases コレクション（MDX）
├── content.config.ts  # zod スキーマ
├── layouts/           # Base（head/OGP/JSON-LD）, Landing（業界別LP用）
├── pages/             # ルーティング
├── styles/global.css  # Tailwind v4（@theme でデザイントークン）
└── lib/               # seo.ts, reduction.ts（削減時間の算出）, site.ts（定数）
```

## コンテンツ運用ルール

- モデルケース（`src/content/cases/`）には「※導入効果のモデルケースです」の注記を必ず表示する（`is_model_case: true` で自動表示）。実績と誤認させる表現は使わない
- 削減時間は frontmatter の `before` / `after` から自動算出する（手入力しない）
- 技術スタック名は主役にせず、「Before → After → 削減時間」の後に「実現の根拠」として置く

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

- [ ] Google Form 作成 → `src/lib/site.ts` の `GOOGLE_FORM_URL` を本番 URL に差し替え
- [ ] `public/og-default.png` を正式デザインに差し替え（現状は無地グラデーションのプレースホルダ）
- [ ] Cloudflare ダッシュボードで GitHub 連携（ビルド: `pnpm build` / 出力: `dist`）、または `pnpm deploy` で先に手動デプロイして動作確認
- [ ] カスタムドメイン `solutions.techvit.me` の割り当て
- [ ] デプロイ後、Search Console にプロパティ登録 → `sitemap-index.xml` を送信、Analytics（GA4 など）タグを `Base.astro` に追加
- [ ] 削減時間シミュレーター island（M6、React + TanStack Form）
