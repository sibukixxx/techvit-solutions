import type { APIRoute } from "astro";
import { buildOverviewBrochure } from "@/lib/pdf/overview";

/** 全サービスをまとめた総合資料 PDF（ビルド時に生成 → /downloads/techvit-services.pdf） */
export const GET: APIRoute = async () => {
  const pdf = await buildOverviewBrochure();
  return new Response(new Uint8Array(pdf), {
    headers: { "Content-Type": "application/pdf" },
  });
};
