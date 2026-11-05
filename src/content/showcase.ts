import type { IndustrySlug } from "./industry-meta";
import { industryBySlug } from "./industries";
import type { ServiceSlug } from "./service-meta";

/* Demos that aren't tied to an industry page: products we'd build for founders. */

export type ShowcaseSlug = "startup" | "saas" | "aitool";
export type DemoSlug = IndustrySlug | ShowcaseSlug;

/** The bits of a demo the device frames need. Industries satisfy this too. */
export interface DemoSpec {
  slug: DemoSlug;
  kind: string;
  demo: { name: string; area: string; city: string };
  theme: { deep: string };
}

export interface Showcase extends DemoSpec {
  slug: ShowcaseSlug;
  /** Which service page explains this kind of product. */
  service: ServiceSlug;
}

export const showcase: Showcase[] = [
  { slug: "startup", kind: "Landing page", demo: { name: "ShiftSaathi", area: "HSR Layout", city: "Bengaluru" }, theme: { deep: "#141414" }, service: "landing-pages" },
  { slug: "saas", kind: "SaaS app", demo: { name: "ShiftSaathi", area: "Indiranagar", city: "Bengaluru" }, theme: { deep: "#141414" }, service: "web-apps" },
  { slug: "aitool", kind: "AI tool", demo: { name: "Likho", area: "Koregaon Park", city: "Pune" }, theme: { deep: "#5b3ff2" }, service: "ai-automation" },
];

export const showcaseBySlug = (slug?: string) => showcase.find((s) => s.slug === slug);

/** Any demo, by slug: an industry's or a showcase product's. */
export const demoSpec = (slug: DemoSlug): DemoSpec => (industryBySlug(slug) ?? showcaseBySlug(slug))!;
