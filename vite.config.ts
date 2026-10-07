import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { site } from "./site.config";
import { industryMeta } from "./src/content/industry-meta";

/* ──────────────────────────────────────────────────────────────────────────
 * SEO plugin
 * - Injects title / description / Open Graph / JSON-LD from site.config.ts.
 * - On build, writes a copy of index.html for every route with that page's
 *   own tags, so link previews on WhatsApp/Facebook show the right title and
 *   image (they don't run JavaScript). Also writes sitemap.xml and robots.txt.
 * ────────────────────────────────────────────────────────────────────────── */

type RouteMeta = { path: string; title: string; description: string; image: string };

const routes: RouteMeta[] = [
  { path: "/", title: site.seo.title, description: site.seo.description, image: site.seo.ogImage },
  ...industryMeta.map((m) => ({
    path: `/for/${m.slug}`,
    title: m.seoTitle,
    description: m.seoDescription,
    image: `/og/${m.slug}.jpg`,
  })),
  {
    path: "/privacy",
    title: `Privacy policy — ${site.brand.name}`,
    description: `How ${site.brand.name} collects, uses and protects the details you share with us.`,
    image: site.seo.ogImage,
  },
];

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function headTags(r: RouteMeta) {
  const url = site.brand.url + (r.path === "/" ? "/" : r.path);
  const img = site.brand.url + r.image;
  return [
    `<title>${esc(r.title)}</title>`,
    `<meta name="description" content="${esc(r.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(site.brand.name)}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:title" content="${esc(r.title)}" />`,
    `<meta property="og:description" content="${esc(r.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(r.title)}" />`,
    `<meta name="twitter:description" content="${esc(r.description)}" />`,
    `<meta name="twitter:image" content="${img}" />`,
  ].join("\n    ");
}

function jsonLd() {
  const sameAs = Object.values(site.socials).filter(Boolean);
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.brand.name,
    url: site.brand.url,
    description: site.brand.description,
    slogan: site.brand.tagline,
    telephone: site.contact.phone,
    email: site.contact.email,
    image: site.brand.url + site.seo.ogImage,
    logo: site.brand.url + "/favicon.svg",
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.address,
      addressLocality: site.brand.city,
      addressRegion: site.brand.region,
      addressCountry: "IN",
    },
    areaServed: [{ "@type": "City", name: site.brand.city }, { "@type": "State", name: site.brand.region }],
    knowsAbout: ["Website design", "Web app development", "WhatsApp AI assistants", "Business automation", "Local SEO"],
    ...(sameAs.length ? { sameAs } : {}),
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

const block = (r: RouteMeta) => `<!--seo:start-->\n    ${headTags(r)}\n    <!--seo:end-->`;

function seoPlugin(): Plugin {
  let outDir = "dist";
  return {
    name: "xhibit-seo",
    configResolved(cfg) {
      outDir = path.resolve(cfg.root, cfg.build.outDir);
    },
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        return html.replace("<!--app-seo-->", `${block(routes[0])}\n    ${jsonLd()}`);
      },
    },
    closeBundle() {
      const indexPath = path.join(outDir, "index.html");
      if (!fs.existsSync(indexPath)) return; // dev server — nothing to write
      const html = fs.readFileSync(indexPath, "utf8");
      for (const r of routes.slice(1)) {
        const page = html.replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, block(r));
        const dir = path.join(outDir, r.path);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "index.html"), page);
      }
      // Many static hosts serve 404.html for unknown paths — make it the app.
      fs.writeFileSync(path.join(outDir, "404.html"), html);
      const today = new Date().toISOString().slice(0, 10);
      const urls = routes
        .map((r) => `  <url><loc>${site.brand.url}${r.path}</loc><lastmod>${today}</lastmod></url>`)
        .join("\n");
      fs.writeFileSync(
        path.join(outDir, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      );
      fs.writeFileSync(
        path.join(outDir, "robots.txt"),
        `User-agent: *\nAllow: /\n\nSitemap: ${site.brand.url}/sitemap.xml\n`,
      );
    },
  };
}

// Where the FastAPI server runs in development (docker compose / uvicorn).
const API_TARGET = process.env.API_PROXY_TARGET ?? "http://127.0.0.1:8010";

/** Preloads the two fonts the hero needs first (build only — the file names are hashed). */
function fontPreloadPlugin(): Plugin {
  return {
    name: "xhibit-font-preload",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        if (!ctx.bundle) return html;
        const fonts = Object.keys(ctx.bundle).filter(
          (f) => /fraunces-latin-opsz-normal.*\.woff2$/.test(f) || /plus-jakarta-sans-latin-wght-normal.*\.woff2$/.test(f),
        );
        const links = fonts.map((f) => `<link rel="preload" href="/${f}" as="font" type="font/woff2" crossorigin />`).join("\n    ");
        return html.replace("</head>", `  ${links}\n  </head>`);
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seoPlugin(), fontPreloadPlugin()],
  server: {
    port: 5173,
    proxy: { "/api": API_TARGET },
  },
  preview: {
    port: 4173,
    proxy: { "/api": API_TARGET },
  },
  build: {
    target: "es2022",
    assetsInlineLimit: 2048,
    chunkSizeWarningLimit: 300,
    rolldownOptions: {
      output: {
        // Libraries change rarely — separate chunks stay cached between deploys.
        codeSplitting: {
          groups: [
            { name: "react", test: /node_modules[\\/](react|react-dom|scheduler|react-router)[\\/]/, priority: 20 },
            { name: "motion", test: /node_modules[\\/](motion|framer-motion|motion-dom|motion-utils)[\\/]/, priority: 10 },
          ],
        },
      },
    },
  },
});
