import type { APIRoute } from "astro";
import { buildWebmcpBrochure } from "@/lib/pdf/webmcp";

/** WebMCP先行検証サービスの資料 PDF（ビルド時に生成 → /downloads/webmcp.pdf） */
export const GET: APIRoute = async () => {
  const pdf = await buildWebmcpBrochure();
  return new Response(new Uint8Array(pdf), {
    headers: { "Content-Type": "application/pdf" },
  });
};
