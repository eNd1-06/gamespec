import type { MetadataRoute } from "next";
import { mice } from "@/data/mice";
import { monitors } from "@/data/monitors";
import { keyboards } from "@/data/keyboards";
import { headsets } from "@/data/headsets";
import { mousepads } from "@/data/mousepads";
import { gpus } from "@/data/gpus";
import { controllers } from "@/data/controllers";
import { earphones } from "@/data/earphones";
import { chairs } from "@/data/chairs";

const BASE_URL = "https://gamespec.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const mousePages = mice.map((m) => ({
    url: `${BASE_URL}/mice/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const monitorPages = monitors.map((m) => ({
    url: `${BASE_URL}/monitors/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const keyboardPages = keyboards.map((k) => ({
    url: `${BASE_URL}/keyboards/${k.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const headsetPages = headsets.map((h) => ({
    url: `${BASE_URL}/headsets/${h.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const mousepadPages = mousepads.map((p) => ({
    url: `${BASE_URL}/mousepads/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const gpuPages = gpus.map((g) => ({
    url: `${BASE_URL}/gpus/${g.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const controllerPages = controllers.map((c) => ({
    url: `${BASE_URL}/controllers/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const earphonePages = earphones.map((e) => ({
    url: `${BASE_URL}/earphones/${e.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const chairPages = chairs.map((c) => ({
    url: `${BASE_URL}/chairs/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/mice`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/mice/ranking`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/mice/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/monitors`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/monitors/ranking`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/monitors/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/keyboards`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/keyboards/ranking`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/keyboards/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/headsets`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/headsets/ranking`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/headsets/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/mousepads`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/mousepads/ranking`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/mousepads/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/gpus`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/gpus/ranking`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/gpus/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/controllers`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/controllers/ranking`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/controllers/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/earphones`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/earphones/ranking`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/earphones/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/chairs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/chairs/ranking`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/chairs/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...mousePages,
    ...monitorPages,
    ...keyboardPages,
    ...headsetPages,
    ...mousepadPages,
    ...gpuPages,
    ...controllerPages,
    ...earphonePages,
    ...chairPages,
  ];
}
