import mdx from "@astrojs/mdx";
import sitemap, { ChangeFreqEnum } from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://solutions.techvit.me",
  output: "static",
  trailingSlash: "always",
  integrations: [
    mdx(),
    sitemap({
      // 隠しページ（/internal/ 配下）は sitemap に載せない。ページ側は Base の noindex を使う
      filter: (page) => !new URL(page).pathname.startsWith("/internal/"),
      serialize(item) {
        const path = new URL(item.url).pathname;
        if (path === "/") {
          return { ...item, priority: 1.0, changefreq: ChangeFreqEnum.WEEKLY };
        }
        if (
          path.startsWith("/services/") ||
          path.startsWith("/cases/") ||
          path.startsWith("/automation/")
        ) {
          return {
            ...item,
            priority: 0.8,
            changefreq: ChangeFreqEnum.MONTHLY,
          };
        }
        return { ...item, priority: 0.6, changefreq: ChangeFreqEnum.MONTHLY };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
