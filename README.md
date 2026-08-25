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
- [ ] Cloudflare ダッシュボードで GitHub 連携（ビルド: `pnpm build` / 出力: `dist`）
- [ ] カスタムドメイン `solutions.techvit.me` の割り当て
- [ ] Search Console / Analytics 導入（M7）
- [ ] 削減時間シミュレーター island（M6、React + TanStack Form）
