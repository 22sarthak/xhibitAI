/**
 * Plain data about each service page — no React imports, so the build
 * (vite.config.ts) can read it to write per-page SEO tags and the sitemap.
 */
export const serviceMeta = [
  {
    slug: "websites",
    name: "Websites",
    seoTitle: "Website Design & Development in India — Fast, Found on Google | Xhibit AI",
    seoDescription:
      "Custom websites that work on every screen, load fast and show up on Google. See your design before you pay. Written quotes, no surprises.",
  },
  {
    slug: "landing-pages",
    name: "Landing pages",
    seoTitle: "Landing Page Design for Launches & Ads — More Sign-ups | Xhibit AI",
    seoDescription:
      "Focused landing pages for product launches, ad campaigns and offers. Built for one goal, ready for Google and Meta ads, live in days.",
  },
  {
    slug: "web-apps",
    name: "Web apps & dashboards",
    seoTitle: "Web App & Dashboard Development — MVPs, Portals, Internal Tools | Xhibit AI",
    seoDescription:
      "Booking systems, dashboards, customer portals and startup MVPs that run in the browser on any device. Built around how your team works.",
  },
  {
    slug: "online-stores",
    name: "Online stores",
    seoTitle: "Online Store Development — UPI Payments, WhatsApp Orders | Xhibit AI",
    seoDescription:
      "Your own online store with UPI and card payments, delivery by pin code and WhatsApp order updates. No marketplace commission on your sales.",
  },
  {
    slug: "ai-automation",
    name: "AI & automation",
    seoTitle: "AI WhatsApp Assistants & Business Automation | Xhibit AI",
    seoDescription:
      "AI assistants that answer customers on WhatsApp in English, Hindi and Hinglish, take bookings and send reminders, follow-ups and review requests.",
  },
] as const;

export type ServiceSlug = (typeof serviceMeta)[number]["slug"];
