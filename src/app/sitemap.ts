import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about/", "/work/", "/writing/", "/contact/"];

  return routes.map((route) => ({
    url: `${site.url}${route || "/"}`,
    lastModified: new Date("2026-09-06"),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
