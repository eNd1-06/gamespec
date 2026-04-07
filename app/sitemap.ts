import type { MetadataRoute } from "next";
import { mice } from "@/data/mice";

const BASE_URL = "https://gamespec.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const mousePages = mice.map((m) => ({
    url: `${BASE_URL}/mice/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/mice`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    ...mousePages,
  ];
}
