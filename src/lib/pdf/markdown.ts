/**
 * MDX 本文を PDF に落とすための最小限の Markdown パーサ。
 * 見出し（##/###）・段落・箇条書き・番号付きリストだけを扱い、
 * 強調・リンク・コードなどのインライン記法はプレーンテキストにする。
 */
export type Block =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] };

export function inlineToText(src: string): string {
  return src
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(\*|_)(.+?)\1/g, "$2")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/<[^>]+>/g, "")
    .trim();
}

export function parseMarkdown(src: string | undefined): Block[] {
  if (!src) return [];
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | undefined;

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({
        type: "paragraph",
        text: inlineToText(paragraph.join("")),
      });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push({ type: "list", ...list });
      list = undefined;
    }
  };

  for (const raw of src.split(/\r?\n/)) {
    const line = raw.trimEnd();
    if (line.trim() === "") {
      flushParagraph();
      flushList();
      continue;
    }
    if (/^(import|export)\s/.test(line)) continue;

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length <= 2 ? 2 : 3;
      blocks.push({ type: "heading", level, text: inlineToText(heading[2]) });
      continue;
    }

    const bullet = /^\s*[-*+]\s+(.*)$/.exec(line);
    const numbered = /^\s*\d+[.)]\s+(.*)$/.exec(line);
    if (bullet || numbered) {
      flushParagraph();
      const ordered = Boolean(numbered);
      const text = inlineToText((bullet ?? numbered)?.[1] ?? "");
      if (!list || list.ordered !== ordered) {
        flushList();
        list = { ordered, items: [] };
      }
      list.items.push(text);
      continue;
    }

    if (list) {
      // リスト項目の継続行
      list.items[list.items.length - 1] += inlineToText(line);
      continue;
    }
    paragraph.push(line.trim());
  }
  flushParagraph();
  flushList();
  return blocks;
}
