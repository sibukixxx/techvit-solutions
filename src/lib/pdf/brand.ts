import path from "node:path";

/**
 * PDF の表紙・フッターに入れるブランドマーク（カプセル＋葉）。
 * サイトの favicon・OG 画像と同じ素材の 192px 版（public/icon-192.png）を使う。
 * 表紙の 30pt に対して 400dpi 相当あれば印刷にも十分で、512px 版より PDF が数百 KB 軽くなる。
 * pdfkit にはパス文字列で渡す。Buffer で渡すと呼び出しごとに画像を埋め込み直すが、
 * パスなら同じ画像を 1 回だけ埋め込んで各ページから参照する。
 */
export const BRAND_MARK_PATH = path.resolve(
  process.cwd(),
  "public/icon-192.png",
);
