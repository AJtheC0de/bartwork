import type { MetadataRoute } from "next";
import { publishedArtworks } from "@/content/artworks";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/works`, changeFrequency: "monthly", priority: 0.9 },
    ...publishedArtworks.map((a) => ({
      url: `${base}/works/${a.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.5 },
  ];
}
