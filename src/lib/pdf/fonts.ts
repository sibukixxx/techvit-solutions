import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * PDF に埋め込む日本語フォント（BIZ UDPGothic / SIL OFL 1.1、src/assets/fonts/OFL.txt）。
 * ビルド時に Node から読むだけで、サイトには配信しない。
 * pdfkit は使った文字だけをサブセット化して埋め込むため、出力 PDF は数百 KB に収まる。
 */
const FONT_DIR = path.resolve(process.cwd(), "src/assets/fonts");

export type Fonts = { regular: Buffer; bold: Buffer };

let cached: Fonts | undefined;

export function loadFonts(): Fonts {
  cached ??= {
    regular: readFileSync(path.join(FONT_DIR, "BIZUDPGothic-Regular.ttf")),
    bold: readFileSync(path.join(FONT_DIR, "BIZUDPGothic-Bold.ttf")),
  };
  return cached;
}
