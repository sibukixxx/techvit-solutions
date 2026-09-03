import type { APIRoute } from "astro";
import { buildServiceBrochure } from "@/lib/pdf/service";
import { getServices, type ServiceEntry } from "@/lib/services";

/** サービス別の営業資料 PDF（ビルド時に生成 → /downloads/services/<slug>.pdf） */
export async function getStaticPaths() {
  const services = await getServices();
  return services.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { entry } = props as { entry: ServiceEntry };
  const pdf = await buildServiceBrochure(entry);
  return new Response(new Uint8Array(pdf), {
    headers: { "Content-Type": "application/pdf" },
  });
};
