import { useEffect } from "react";
import { site } from "../../site.config";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Keeps <title>, description, canonical and Open Graph tags in sync with the
 * current page. (The build also writes these into static HTML per route, so
 * crawlers and WhatsApp previews see them without running JavaScript.)
 */
export function useSeo({ title, description, path, image }: { title: string; description: string; path: string; image?: string }) {
  useEffect(() => {
    const url = site.brand.url + path;
    const img = site.brand.url + (image ?? site.seo.ogImage);
    document.title = title;
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", img);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", img);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description, path, image]);
}
