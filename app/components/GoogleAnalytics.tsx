"use client";
import { useEffect } from "react";

export function GoogleAnalytics({ gaId }: { gaId: string }) {
  useEffect(() => {
    if (document.getElementById("_ga-script")) return;

    const script = document.createElement("script");
    script.id = "_ga-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    const init = document.createElement("script");
    init.id = "_ga-init";
    init.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    `;
    document.head.appendChild(init);
  }, [gaId]);

  return null;
}
