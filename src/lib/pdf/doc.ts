import PDFDocument from "pdfkit";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { loadFonts } from "./fonts";

export const A4 = { width: 595.28, height: 841.89 } as const;
export const MARGIN = { top: 56, bottom: 64, left: 52, right: 52 } as const;
export const CONTENT_WIDTH = A4.width - MARGIN.left - MARGIN.right;

/** src/styles/global.css の @theme と同じ色 */
export const C = {
  brand950: "#172554",
  brand900: "#1e3a8a",
  brand700: "#1d4ed8",
  brand600: "#2563eb",
  brand300: "#93c5fd",
  brand200: "#bfdbfe",
  brand100: "#dbeafe",
  brand50: "#eff6ff",
  accent500: "#f59e0b",
  slate900: "#0f172a",
  slate700: "#334155",
  slate600: "#475569",
  slate500: "#64748b",
  slate400: "#94a3b8",
  slate200: "#e2e8f0",
  slate50: "#f8fafc",
  white: "#ffffff",
} as const;

const FONT = { regular: "BIZUDPGothic", bold: "BIZUDPGothic-Bold" } as const;
const GAP = 8;

export type Column = {
  label: string;
  /** 相対幅（合計で CONTENT_WIDTH に正規化する） */
  width: number;
  align?: "left" | "center" | "right";
  bold?: boolean;
};

export type CoverOptions = {
  eyebrow: string;
  badge?: string;
  title: string;
  lead: string;
  /** 料金・期間などのメタ情報（表紙の帯内に並べる） */
  meta?: { label: string; value: string }[];
};

/**
 * pdfkit の薄いラッパー。A4 縦・日本語フォント・ページ送り・フッターを共通化し、
 * 各資料（service.ts / overview.ts）は見出し・箇条書き・表などの部品を並べるだけにする。
 */
export class Brochure {
  readonly doc: PDFKit.PDFDocument;
  private readonly output: Promise<Buffer>;
  private readonly version: string;

  constructor(info: { title: string; subject: string }, version: string) {
    const fonts = loadFonts();
    const doc = new PDFDocument({
      size: "A4",
      margins: { ...MARGIN },
      bufferPages: true,
      lang: "ja",
      displayTitle: true,
      info: {
        Title: info.title,
        Subject: info.subject,
        Author: SITE_NAME,
        Creator: SITE_NAME,
      },
    });
    doc.registerFont(FONT.regular, fonts.regular);
    doc.registerFont(FONT.bold, fonts.bold);
    doc.font(FONT.regular);
    const chunks: Buffer[] = [];
    this.output = new Promise((resolve, reject) => {
      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);
    });
    this.doc = doc;
    this.version = version;
  }

  // ---- 位置 -------------------------------------------------------------

  get x(): number {
    return MARGIN.left;
  }
  get y(): number {
    return this.doc.y;
  }
  set y(value: number) {
    this.doc.y = value;
  }
  get maxY(): number {
    return A4.height - MARGIN.bottom;
  }
  remaining(): number {
    return this.maxY - this.doc.y;
  }
  /** 高さ h が残っていなければ改ページする */
  ensure(h: number): void {
    if (this.remaining() < h) this.newPage();
  }
  newPage(): void {
    this.doc.addPage();
    this.doc.x = MARGIN.left;
    this.doc.y = MARGIN.top;
  }
  space(h: number): void {
    this.doc.y += h;
  }

  // ---- テキスト ---------------------------------------------------------

  private setFont(bold: boolean, size: number, color: string): void {
    this.doc
      .font(bold ? FONT.bold : FONT.regular)
      .fontSize(size)
      .fillColor(color);
  }

  private heightOf(
    text: string,
    width: number,
    bold: boolean,
    size: number,
    lineGap = 3,
  ): number {
    this.doc.font(bold ? FONT.bold : FONT.regular).fontSize(size);
    return this.doc.heightOfString(text, { width, lineGap });
  }

  /** 大見出し（左にアクセントバー） */
  section(title: string, lead?: string): void {
    const titleH = this.heightOf(title, CONTENT_WIDTH - 14, true, 15, 2);
    const leadH = lead ? this.heightOf(lead, CONTENT_WIDTH, false, 9, 3) : 0;
    this.ensure(titleH + leadH + 60);
    const y = this.doc.y + 8;
    this.doc.rect(this.x, y, 4, titleH).fill(C.brand600);
    this.setFont(true, 15, C.brand950);
    this.doc.text(title, this.x + 14, y, {
      width: CONTENT_WIDTH - 14,
      lineGap: 2,
    });
    if (lead) {
      this.space(4);
      this.setFont(false, 9, C.slate600);
      this.doc.text(lead, this.x, this.doc.y, {
        width: CONTENT_WIDTH,
        lineGap: 3,
      });
    }
    this.space(10);
  }

  /** 小見出し */
  subsection(title: string): void {
    this.ensure(48);
    this.space(4);
    this.setFont(true, 11.5, C.brand900);
    this.doc.text(title, this.x, this.doc.y, { width: CONTENT_WIDTH });
    this.space(4);
  }

  paragraph(
    text: string,
    opts: { size?: number; color?: string; bold?: boolean } = {},
  ): void {
    const { size = 9.5, color = C.slate700, bold = false } = opts;
    this.ensure(Math.min(this.heightOf(text, CONTENT_WIDTH, bold, size), 48));
    this.setFont(bold, size, color);
    this.doc.text(text, this.x, this.doc.y, {
      width: CONTENT_WIDTH,
      lineGap: 3,
    });
    this.space(6);
  }

  /** 箇条書き。marker: "check" は ✓、"number" は 1. 2. … */
  bullets(
    items: string[],
    opts: { marker?: "dot" | "check" | "number"; size?: number } = {},
  ): void {
    const { marker = "dot", size = 9.5 } = opts;
    const indent = marker === "number" ? 18 : 14;
    const width = CONTENT_WIDTH - indent;
    items.forEach((item, i) => {
      const h = this.heightOf(item, width, false, size);
      this.ensure(h + 4);
      const y = this.doc.y;
      const mark =
        marker === "check" ? "✓" : marker === "number" ? `${i + 1}.` : "•";
      this.setFont(
        marker === "check",
        size,
        marker === "check" ? C.brand600 : C.slate500,
      );
      this.doc.text(mark, this.x, y, { width: indent, lineBreak: false });
      this.setFont(false, size, C.slate700);
      this.doc.text(item, this.x + indent, y, { width, lineGap: 3 });
      this.space(3);
    });
    this.space(4);
  }

  /** 枠付きのカードをグリッドで並べる（対象・課題など短文向け） */
  boxes(
    items: string[],
    opts: { cols?: number; fill?: string; border?: string; size?: number } = {},
  ): void {
    const { cols = 2, fill = C.slate50, border = C.slate200, size = 9 } = opts;
    const pad = 8;
    const colW = (CONTENT_WIDTH - GAP * (cols - 1)) / cols;
    for (let i = 0; i < items.length; i += cols) {
      const row = items.slice(i, i + cols);
      const rowH =
        Math.max(
          ...row.map((t) => this.heightOf(t, colW - pad * 2, false, size)),
        ) +
        pad * 2;
      this.ensure(rowH + GAP);
      const y = this.doc.y;
      row.forEach((text, j) => {
        const x = this.x + j * (colW + GAP);
        this.doc.roundedRect(x, y, colW, rowH, 4).fillAndStroke(fill, border);
        this.setFont(false, size, C.slate700);
        this.doc.text(text, x + pad, y + pad, {
          width: colW - pad * 2,
          lineGap: 3,
        });
      });
      this.doc.y = y + rowH + GAP;
    }
    this.space(4);
  }

  /** 見出し行付きの表。行がページに収まらないときは改ページして見出しを再描画する */
  table(
    columns: Column[],
    rows: string[][],
    opts: { size?: number; boldRows?: number[] } = {},
  ): void {
    const { size = 9, boldRows = [] } = opts;
    const pad = 6;
    const total = columns.reduce((s, c) => s + c.width, 0);
    const widths = columns.map((c) => (c.width / total) * CONTENT_WIDTH);

    const rowHeight = (cells: string[], bold: boolean) =>
      Math.max(
        ...cells.map((cell, i) =>
          this.heightOf(
            cell,
            widths[i] - pad * 2,
            bold || Boolean(columns[i]?.bold),
            size,
            2,
          ),
        ),
      ) +
      pad * 2;

    const drawRow = (cells: string[], header: boolean, bold = false) => {
      const h = rowHeight(cells, header || bold);
      const y = this.doc.y;
      if (header) {
        this.doc.rect(this.x, y, CONTENT_WIDTH, h).fill(C.brand50);
      } else if (bold) {
        this.doc.rect(this.x, y, CONTENT_WIDTH, h).fill(C.slate50);
      }
      let cx = this.x;
      cells.forEach((cell, i) => {
        const col = columns[i];
        this.setFont(
          header || bold || Boolean(col?.bold),
          size,
          header ? C.brand900 : C.slate700,
        );
        this.doc.text(cell, cx + pad, y + pad, {
          width: widths[i] - pad * 2,
          align: col?.align ?? "left",
          lineGap: 2,
        });
        cx += widths[i];
      });
      this.doc
        .moveTo(this.x, y + h)
        .lineTo(this.x + CONTENT_WIDTH, y + h)
        .lineWidth(0.5)
        .stroke(header ? C.brand200 : C.slate200);
      this.doc.y = y + h;
    };

    const header = columns.map((c) => c.label);
    this.ensure(rowHeight(header, true) + rowHeight(rows[0] ?? [], false) + 8);
    drawRow(header, true);
    rows.forEach((row, i) => {
      const bold = boldRows.includes(i);
      if (this.remaining() < rowHeight(row, bold)) {
        this.newPage();
        drawRow(header, true);
      }
      drawRow(row, false, bold);
    });
    this.space(10);
  }

  /** 数字を強調する帯（削減時間など） */
  highlight(label: string, value: string, note?: string): void {
    const pad = 12;
    const labelH = this.heightOf(label, CONTENT_WIDTH - pad * 2, true, 9);
    const valueH = this.heightOf(value, CONTENT_WIDTH - pad * 2, true, 20);
    const noteH = note
      ? this.heightOf(note, CONTENT_WIDTH - pad * 2, false, 8.5)
      : 0;
    const h = pad * 2 + labelH + 4 + valueH + (note ? 4 + noteH : 0);
    this.ensure(h + GAP);
    const y = this.doc.y;
    this.doc
      .roundedRect(this.x, y, CONTENT_WIDTH, h, 6)
      .fillAndStroke(C.brand50, C.brand200);
    this.setFont(true, 9, C.brand700);
    this.doc.text(label, this.x + pad, y + pad, {
      width: CONTENT_WIDTH - pad * 2,
    });
    this.setFont(true, 20, C.brand900);
    this.doc.text(value, this.x + pad, y + pad + labelH + 4, {
      width: CONTENT_WIDTH - pad * 2,
    });
    if (note) {
      this.setFont(false, 8.5, C.slate600);
      this.doc.text(note, this.x + pad, y + pad + labelH + 4 + valueH + 4, {
        width: CONTENT_WIDTH - pad * 2,
      });
    }
    this.doc.y = y + h + GAP;
    this.space(4);
  }

  /** Q&A */
  qa(items: { question: string; answer: string }[]): void {
    const pad = 10;
    const w = CONTENT_WIDTH - pad * 2 - 16;
    for (const item of items) {
      const qH = this.heightOf(item.question, w, true, 9.5);
      const aH = this.heightOf(item.answer, w, false, 9);
      const h = pad * 2 + qH + 6 + aH;
      this.ensure(h + GAP);
      const y = this.doc.y;
      this.doc
        .roundedRect(this.x, y, CONTENT_WIDTH, h, 4)
        .fillAndStroke(C.slate50, C.slate200);
      this.setFont(true, 9.5, C.brand700);
      this.doc.text("Q", this.x + pad, y + pad, {
        width: 16,
        lineBreak: false,
      });
      this.setFont(true, 9.5, C.slate900);
      this.doc.text(item.question, this.x + pad + 16, y + pad, {
        width: w,
        lineGap: 3,
      });
      this.setFont(true, 9, C.slate500);
      this.doc.text("A", this.x + pad, y + pad + qH + 6, {
        width: 16,
        lineBreak: false,
      });
      this.setFont(false, 9, C.slate700);
      this.doc.text(item.answer, this.x + pad + 16, y + pad + qH + 6, {
        width: w,
        lineGap: 3,
      });
      this.doc.y = y + h + GAP;
    }
    this.space(4);
  }

  /** 注記（モデルケースの但し書きなど） */
  note(text: string): void {
    this.ensure(24);
    this.setFont(false, 8, C.slate500);
    this.doc.text(text, this.x, this.doc.y, {
      width: CONTENT_WIDTH,
      lineGap: 2,
    });
    this.space(8);
  }

  // ---- 表紙・お問い合わせ・フッター -------------------------------------

  /** 表紙。上部にブランド色の帯、下は通常のコンテンツ領域として使える */
  cover(opts: CoverOptions): void {
    const { doc } = this;
    const bandH = 380;
    doc.rect(0, 0, A4.width, bandH).fill(C.brand950);
    doc.rect(0, bandH, A4.width, 5).fill(C.accent500);

    this.setFont(true, 10, C.white);
    doc.text(SITE_NAME, this.x, 48, { width: CONTENT_WIDTH, align: "right" });

    let y = 96;
    this.setFont(true, 10, C.brand300);
    doc.text(opts.eyebrow, this.x, y, {
      width: CONTENT_WIDTH - 120,
      lineBreak: false,
    });
    if (opts.badge) {
      const bw = doc.widthOfString(opts.badge) + 16;
      const bx = this.x + doc.widthOfString(opts.eyebrow) + 12;
      doc.roundedRect(bx, y - 4, bw, 18, 9).fill(C.accent500);
      this.setFont(true, 8.5, C.brand950);
      doc.text(opts.badge, bx + 8, y - 1, { lineBreak: false });
    }

    y += 30;
    this.setFont(true, 25, C.white);
    doc.text(opts.title, this.x, y, { width: CONTENT_WIDTH, lineGap: 4 });
    y = doc.y + 16;
    this.setFont(false, 11, C.brand100);
    doc.text(opts.lead, this.x, y, { width: CONTENT_WIDTH - 40, lineGap: 4 });
    y = doc.y + 18;

    if (opts.meta && opts.meta.length > 0) {
      let mx = this.x;
      for (const m of opts.meta) {
        this.setFont(false, 8.5, C.brand200);
        const lw = doc.widthOfString(m.label);
        this.setFont(true, 13, C.white);
        const vw = doc.widthOfString(m.value);
        const w = lw + vw + 30;
        doc.fillOpacity(0.14);
        doc.roundedRect(mx, y, w, 30, 6).fill(C.white);
        doc.fillOpacity(1);
        this.setFont(false, 8.5, C.brand200);
        doc.text(m.label, mx + 10, y + 10, { lineBreak: false });
        this.setFont(true, 13, C.white);
        doc.text(m.value, mx + 10 + lw + 8, y + 7, { lineBreak: false });
        mx += w + 8;
      }
    }

    doc.fillColor(C.slate700);
    doc.x = this.x;
    doc.y = bandH + 36;
  }

  /** 表紙下部の発行情報（1ページ目の最下部に固定。本文が2ページ目に溢れていても表紙に描く） */
  coverFooter(): void {
    const { doc } = this;
    const range = doc.bufferedPageRange();
    const current = range.start + range.count - 1;
    doc.switchToPage(0);
    // 下マージンの中に描くので、自動改ページを止める
    doc.page.margins.bottom = 0;
    const y = A4.height - 70;
    doc
      .moveTo(this.x, y)
      .lineTo(this.x + CONTENT_WIDTH, y)
      .lineWidth(0.5)
      .stroke(C.slate200);
    this.setFont(false, 8, C.slate500);
    doc.text(
      `${this.version}｜本資料の料金・内容は発行時点のものです。最新の情報は ${SITE_URL} をご覧ください。`,
      this.x,
      y + 10,
      { width: CONTENT_WIDTH, lineGap: 2 },
    );
    doc.switchToPage(current);
  }

  /** お問い合わせ枠 */
  contact(lines: { label: string; value: string }[], lead: string): void {
    const pad = 14;
    const inner = CONTENT_WIDTH - pad * 2;
    const leadH = this.heightOf(lead, inner, false, 9.5);
    const rowH = 16;
    const h = pad * 2 + leadH + 10 + lines.length * rowH;
    this.ensure(h);
    const y = this.doc.y;
    this.doc.roundedRect(this.x, y, CONTENT_WIDTH, h, 6).fill(C.brand950);
    this.setFont(false, 9.5, C.brand100);
    this.doc.text(lead, this.x + pad, y + pad, { width: inner, lineGap: 3 });
    let ly = y + pad + leadH + 10;
    for (const line of lines) {
      this.setFont(false, 8.5, C.brand300);
      this.doc.text(line.label, this.x + pad, ly, {
        width: 90,
        lineBreak: false,
      });
      this.setFont(true, 9.5, C.white);
      this.doc.text(line.value, this.x + pad + 90, ly - 1, {
        width: inner - 90,
        lineBreak: false,
      });
      ly += rowH;
    }
    this.doc.y = y + h + GAP;
  }

  /** 全ページにフッター（サイト名・URL・版・ページ番号）を入れて出力する */
  async finish(): Promise<Buffer> {
    const { doc } = this;
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      if (i === 0) continue; // 表紙は coverFooter() を使う
      // フッターは下マージンの中に描くので、自動改ページを止める
      doc.page.margins.bottom = 0;
      const y = A4.height - 40;
      doc
        .moveTo(this.x, y - 8)
        .lineTo(this.x + CONTENT_WIDTH, y - 8)
        .lineWidth(0.5)
        .stroke(C.slate200);
      this.setFont(false, 7.5, C.slate500);
      doc.text(`${SITE_NAME}｜${SITE_URL}｜${this.version}`, this.x, y, {
        width: CONTENT_WIDTH - 60,
        lineBreak: false,
      });
      doc.text(`${i + 1} / ${range.count}`, this.x + CONTENT_WIDTH - 60, y, {
        width: 60,
        align: "right",
        lineBreak: false,
      });
    }
    doc.end();
    return this.output;
  }
}
