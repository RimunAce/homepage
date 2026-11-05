import type { MetadataRoute } from "next";

const routes = ["", "/gallery", "/anilist", "/music"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({
    url: `https://respire.my${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
