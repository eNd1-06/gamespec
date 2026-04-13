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
import { VS_PAIRS } from "@/app/mice/vs/[pair]/page";
import { VS_PAIRS as MONITOR_VS_PAIRS } from "@/app/monitors/vs/[pair]/page";
import { VS_PAIRS as KEYBOARD_VS_PAIRS } from "@/app/keyboards/vs/[pair]/page";
import { VS_PAIRS as HEADSET_VS_PAIRS } from "@/app/headsets/vs/[pair]/page";

const BASE_URL = "https://gamespec.vercel.app"; // updated 2026-04-10

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

  const miceVsPages = VS_PAIRS.map(([a, b]) => ({
    url: `${BASE_URL}/mice/vs/${a}-vs-${b}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const monitorVsPages = MONITOR_VS_PAIRS.filter(([a, b]) =>
    monitors.find((m) => m.slug === a) && monitors.find((m) => m.slug === b)
  ).map(([a, b]) => ({
    url: `${BASE_URL}/monitors/vs/${a}-vs-${b}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const keyboardVsPages = KEYBOARD_VS_PAIRS.filter(([a, b]) =>
    keyboards.find((k) => k.slug === a) && keyboards.find((k) => k.slug === b)
  ).map(([a, b]) => ({
    url: `${BASE_URL}/keyboards/vs/${a}-vs-${b}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const headsetVsPages = HEADSET_VS_PAIRS.filter(([a, b]) =>
    headsets.find((h) => h.slug === a) && headsets.find((h) => h.slug === b)
  ).map(([a, b]) => ({
    url: `${BASE_URL}/headsets/vs/${a}-vs-${b}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/mice`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/mice/ranking`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/mice/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/mice/vs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/mice/apex`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/mice/lightweight`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/mice/wireless`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/mice/cospa`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/monitors`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/monitors/ranking`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/monitors/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/monitors/vs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/monitors/fps`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/monitors/1440p`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/monitors/oled`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/monitors/budget`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/keyboards`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/keyboards/ranking`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/keyboards/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/keyboards/vs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/keyboards/tkl`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/keyboards/wireless`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/keyboards/60percent`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/headsets`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/headsets/ranking`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/headsets/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/headsets/vs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/headsets/fps`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/headsets/wireless`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/mousepads`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/mousepads/ranking`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/mousepads/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/mousepads/fps`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/gpus`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/gpus/ranking`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/gpus/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/gpus/midrange`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/gpus/nvidia`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/gpus/amd`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/controllers`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/controllers/ranking`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/controllers/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/controllers/fps`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/earphones`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/earphones/ranking`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/earphones/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/earphones/gaming`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/chairs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/chairs/ranking`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/chairs/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/chairs/ergonomic`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    ...miceVsPages,
    ...monitorVsPages,
    ...keyboardVsPages,
    ...headsetVsPages,
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
