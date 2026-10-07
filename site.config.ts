/**
 * ──────────────────────────────────────────────────────────────────────────
 *  XHIBIT AI · SITE CONFIG
 *
 *  Every contact detail, price, promise and offer shown on the website lives
 *  in this one file. Edit, save, and the whole site (and its SEO tags) updates.
 *
 *  Before going live, search this file for "TODO" — those are placeholders.
 * ──────────────────────────────────────────────────────────────────────────
 */

export type PlanId = "starter" | "growth" | "automate";

export interface Plan {
  id: PlanId;
  name: string;
  forWho: string;
  price: number;
  /** Shown before the price, e.g. "from". Leave empty for a fixed price. */
  prefix: string;
  period: string;
  timeline: string;
  features: string[];
  highlight?: boolean;
}

export interface Founder {
  name: string;
  role: string;
  /** Path inside /public, e.g. "/team/aman.jpg". Leave empty to show initials. */
  photo?: string;
  note?: string;
}

export interface SiteConfig {
  brand: {
    name: string;
    shortName: string;
    tagline: string;
    description: string;
    url: string;
    city: string;
    region: string;
    foundedYear: number;
  };
  contact: {
    phone: string;
    phoneDisplay: string;
    whatsapp: string;
    email: string;
    bookingUrl: string;
    address: string;
    mapsUrl: string;
    hours: string;
  };
  socials: { instagram: string; linkedin: string; youtube: string; facebook: string };
  promises: {
    freeDesignPreview: boolean;
    liveInDays: number;
    inPersonVisits: boolean;
    whatsappReplyHours: number;
    workingHours: string;
  };
  pricing: {
    show: boolean;
    currency: string;
    paymentTerms: string;
    note: string;
    plans: Plan[];
    carePlan: { name: string; price: number; period: string; features: string[] };
  };
  foundingOffer: {
    enabled: boolean;
    spots: number;
    /** Update honestly as you sign founding clients. */
    spotsTaken: number;
    perk: string;
    ask: string;
  };
  founders: Founder[];
  seo: { title: string; description: string; ogImage: string };
  analytics: { trackEvents: boolean };
}

export const site = {
  brand: {
    name: "Xhibit AI",
    shortName: "Xhibit",
    tagline: "Your business, beautifully on display.",
    description:
      "Xhibit AI builds beautiful websites, booking apps, WhatsApp AI assistants and automations for local businesses in Ranchi — restaurants, clinics, schools, salons, gyms, hotels and shops.",
    url: "https://xhibitai.in", // TODO: your real domain, no trailing slash
    city: "Ranchi",
    region: "Jharkhand",
    foundedYear: 2026,
  },

  contact: {
    // TODO: replace ALL of these with your real details before going live.
    phone: "+910000000000", // used for tap-to-call links
    phoneDisplay: "+91 00000 00000",
    whatsapp: "910000000000", // country code + number, digits only (used for wa.me links)
    email: "hello@xhibitai.in",
    bookingUrl: "https://cal.com", // TODO: your Cal.com / Calendly link for a free 20-minute call
    address: "Lalpur, Ranchi, Jharkhand 834001",
    mapsUrl: "https://maps.google.com/?q=Lalpur,Ranchi",
    hours: "Mon – Sat · 10 AM – 8 PM",
  },

  // Leave a link empty to hide that icon.
  socials: {
    instagram: "",
    linkedin: "",
    youtube: "",
    facebook: "",
  },

  // Each promise is shown prominently. Only keep the ones you can always honour.
  promises: {
    freeDesignPreview: true,
    liveInDays: 7, // 0 hides it
    inPersonVisits: true,
    whatsappReplyHours: 2, // 0 hides it
    workingHours: "10 AM – 8 PM",
  },

  pricing: {
    show: true,
    currency: "₹",
    paymentTerms: "Half to start, half when you're happy with it.",
    note: "Every business is different. Tell us what you need and you'll get a clear, written quote within a day — no surprises later.",
    // TODO: these are placeholder prices. Set your own.
    plans: [
      {
        id: "starter",
        name: "Get Online",
        forWho: "For shops, clinics and cafés taking their first step online.",
        price: 9999,
        prefix: "",
        period: "one-time",
        timeline: "Live in 7 days",
        features: [
          "A one-page website that looks great on every phone",
          "Your photos, services, timings and location",
          "WhatsApp and tap-to-call buttons",
          "Google Maps listing set up properly",
          "Domain and hosting for the first year",
        ],
      },
      {
        id: "growth",
        name: "Grow",
        forWho: "For businesses ready to take bookings, orders and enquiries.",
        price: 24999,
        prefix: "from",
        period: "one-time",
        timeline: "Live in 10–14 days",
        highlight: true,
        features: [
          "Up to 6 pages, designed around your business",
          "Online bookings, menu or product catalogue",
          "Enquiries delivered straight to your WhatsApp",
          "Google reviews, local SEO and speed set-up",
          "A training session for you and your staff",
          "Everything in Get Online",
        ],
      },
      {
        id: "automate",
        name: "Automate",
        forWho: "For growing teams, schools, hospitals and distributors.",
        price: 49999,
        prefix: "from",
        period: "one-time",
        timeline: "3–6 weeks",
        features: [
          "A custom web app or dashboard for your team",
          "A WhatsApp AI assistant that answers 24×7",
          "Automatic reminders, follow-ups and reports",
          "Payments, invoices and staff logins",
          "Priority support from our team",
        ],
      },
    ],
    carePlan: {
      name: "Care plan",
      price: 999,
      period: "/month",
      features: [
        "Hosting, security and daily backups",
        "Small changes and festive offer banners",
        "Speed and Google health checks",
        "Priority help on WhatsApp",
      ],
    },
  },

  foundingOffer: {
    enabled: true,
    spots: 10,
    spotsTaken: 0, // update honestly as you sign founding clients
    perk: "30% off setup and 3 months of free care",
    ask: "in return for an honest Google review once you're live",
  },

  // Real faces are the biggest trust signal you have. Add yourselves here:
  // { name: "Your Name", role: "Co-founder · Design", photo: "/team/you.jpg", note: "Grew up in Harmu…" }
  founders: [] as Founder[],

  seo: {
    title: "Xhibit AI — Websites, Apps & AI for Ranchi Businesses",
    description:
      "Beautiful websites, booking apps and WhatsApp AI assistants for restaurants, clinics, schools, salons, gyms, hotels and shops in Ranchi. Free design preview. Live in 7 days.",
    ogImage: "/og/home.jpg",
  },

  // Counts WhatsApp/call taps and demo views on your own backend (no third parties).
  analytics: { trackEvents: true },
} satisfies SiteConfig;

export type Site = typeof site;
