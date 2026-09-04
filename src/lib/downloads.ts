import { SITE_NAME } from "./site";

/**
 * 営業資料（PDF）のパスとファイル名。
 * PDF はビルド時に src/pages/downloads/ 配下のエンドポイントで生成する（src/lib/pdf/）。
 */
export const DOWNLOADS_PATH = "/downloads/";
export const OVERVIEW_PDF_PATH = "/downloads/techvit-services.pdf";
export const OVERVIEW_PDF_TITLE = "サービス総合資料";

export function servicePdfPath(slug: string): string {
  return `/downloads/services/${slug}.pdf`;
}

export const WEBMCP_PDF_PATH = "/downloads/webmcp.pdf";

/** ダウンロード時のファイル名（download 属性用） */
export function pdfFilename(name: string): string {
  return `${SITE_NAME.replace(/\s+/g, "")}_${name}.pdf`;
}

const now = new Date();
/** 表紙・フッターに入れる版（ビルド時の年月） */
export const PDF_VERSION = `${now.getFullYear()}年${now.getMonth() + 1}月版`;
