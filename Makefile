SHELL := /bin/sh

PNPM ?= pnpm

.DEFAULT_GOAL := help

.PHONY: help doctor setup install dev build preview lint format format-check typecheck check ci clean

help: ## 利用できるコマンドを表示
	@awk 'BEGIN { FS = ":.*## "; printf "Usage: make <target>\n\nTargets:\n" } /^[a-zA-Z_-]+:.*## / { printf "  %-14s %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

doctor: ## Node.js と pnpm の開発環境を確認
	@command -v node >/dev/null 2>&1 || { echo "Error: Node.js 22 または 24 が必要です。" >&2; exit 1; }
	@command -v $(PNPM) >/dev/null 2>&1 || { echo "Error: pnpm が必要です。corepack enable を実行してください。" >&2; exit 1; }
	@node -e 'const major = Number(process.versions.node.split(".")[0]); if (![22, 24].includes(major)) { console.error(`Error: Node.js 22 または 24 が必要です（現在: $${process.version}）。`); process.exit(1) }'
	@$(PNPM) --version | awk -F. '{ if ($$1 != 10) { printf "Error: pnpm 10 が必要です（現在: %s）。\n", $$0 > "/dev/stderr"; exit 1 } }'
	@echo "Node.js $$(node --version) / pnpm $$($(PNPM) --version)"

setup: doctor install ## 開発環境をセットアップ

install: ## lockfile に従って依存関係をインストール
	$(PNPM) install --frozen-lockfile

dev: ## 開発サーバーを起動
	$(PNPM) dev

build: ## 本番用の静的サイトをビルド
	$(PNPM) build

preview: build ## 本番ビルドをローカルで確認
	$(PNPM) preview

lint: ## Biome の lint を実行
	$(PNPM) lint

format: ## Biome でファイルを整形
	$(PNPM) format

format-check: ## フォーマット差分がないか確認
	$(PNPM) format:check

typecheck: ## Astro/TypeScript の型を確認
	$(PNPM) check

check: lint typecheck format-check ## lint・型・フォーマットを確認

ci: install check build ## CI と同じ検証をローカルで実行

clean: ## 生成物と Astro キャッシュを削除
	rm -rf -- dist .astro
