import { type CollectionEntry, getCollection } from "astro:content";
import type { AutomationSlug } from "./site";

export type ServiceEntry = CollectionEntry<"services">;

/** 公開中のサービスを order 順で返す */
export async function getServices(): Promise<ServiceEntry[]> {
  const entries = await getCollection("services", (e) => e.data.published);
  return entries.sort((a, b) => a.data.order - b.data.order);
}

/** 主力（core）と入口（entry）に分けて返す */
export async function getServicesByKind(): Promise<{
  core: ServiceEntry[];
  entry: ServiceEntry[];
}> {
  const all = await getServices();
  return {
    core: all.filter((s) => s.data.kind === "core"),
    entry: all.filter((s) => s.data.kind === "entry"),
  };
}

/**
 * 業務（/automation/<slug>/）が属する親サービスを逆引きする。
 * 親子関係は services 側の automations だけで管理する（automation 側には持たせない）。
 */
export async function serviceOfAutomation(
  slug: AutomationSlug | string,
): Promise<ServiceEntry | undefined> {
  const all = await getServices();
  return all.find((s) =>
    (s.data.automations as readonly string[]).includes(slug),
  );
}

/** 業務スラッグ → 親サービス のマップ（一覧ページ用） */
export async function serviceMapByAutomation(): Promise<
  Map<string, ServiceEntry>
> {
  const all = await getServices();
  const map = new Map<string, ServiceEntry>();
  for (const s of all) {
    for (const a of s.data.automations) {
      if (!map.has(a)) map.set(a, s);
    }
  }
  return map;
}
