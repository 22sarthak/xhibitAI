import { lazy, type ComponentType } from "react";
import type { Chrome } from "../components/device/frames";
import type { IndustrySlug } from "../content/industry-meta";
import type { DemoProps } from "./kit";

type Loader = () => Promise<{ default: ComponentType<DemoProps> }>;

/** Each demo website is its own lazy chunk (with its own fonts and photos). */
export const demoLoaders: Record<IndustrySlug, Loader> = {
  restaurants: () => import("./restaurant/RestaurantSite"),
  clinics: () => import("./clinic/ClinicSite"),
  schools: () => import("./school/SchoolSite"),
  salons: () => import("./salon/SalonSite"),
  gyms: () => import("./gym/GymSite"),
  hotels: () => import("./hotel/HotelSite"),
  retail: () => import("./retail/RetailSite"),
  business: () => import("./business/BusinessApp"),
};

export const demoComponents = Object.fromEntries(
  Object.entries(demoLoaders).map(([slug, loader]) => [slug, lazy(loader)]),
) as unknown as Record<IndustrySlug, ComponentType<DemoProps>>;

/** Status bar / browser colours that match each demo's header. */
export const demoChrome: Record<IndustrySlug, Chrome> = {
  restaurants: { bar: "#4e1512", tone: "light" },
  clinics: { bar: "#ffffff", tone: "dark" },
  schools: { bar: "#13213f", tone: "light" },
  salons: { bar: "#f7ece8", tone: "dark" },
  gyms: { bar: "#0b0b0b", tone: "light" },
  hotels: { bar: "#f8f4ec", tone: "dark" },
  retail: { bar: "#22305b", tone: "light" },
  business: { bar: "#ffffff", tone: "dark" },
};

/** The first photo each demo shows, preloaded with its code so the phone never flashes an empty hero. */
const heroPhoto: Partial<Record<IndustrySlug, string>> = {
  restaurants: "/demos/restaurants/hero.webp",
  clinics: "/demos/clinics/hero.webp",
  schools: "/demos/schools/hero.webp",
  salons: "/demos/salons/interior.webp",
  gyms: "/demos/gyms/hero.webp",
  hotels: "/demos/hotels/hero.webp",
  retail: "/demos/retail/hero.webp",
};

const prefetched = new Set<string>();
export function prefetchDemo(slug: IndustrySlug) {
  if (prefetched.has(slug)) return;
  prefetched.add(slug);
  void demoLoaders[slug]().catch(() => prefetched.delete(slug));
  const photo = heroPhoto[slug];
  if (photo) new Image().src = photo;
}
