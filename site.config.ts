/**
 * ──────────────────────────────────────────────────────────────────────────
 *  XHIBIT AI · SITE CONFIG
 *
 *  Every contact detail, promise and brand line shown on the website lives
 *  in this one file. Edit, save, and the whole site (and its SEO tags) updates.
 *
 *  Before going live, search this file for "TODO".
 * ──────────────────────────────────────────────────────────────────────────
 */

export interface SiteConfig {
  brand: {
    name: string;
    shortName: string;
    /** The motto, shown in the footer and share cards. */
    tagline: string;
    description: string;
    url: string;
    /** Where we are, for the footer, contact and search data. Not used in marketing copy. */
    city: string;
    region: string;
    foundedYear: number;
    vision: string;
    mission: string;
    promises: string[];
  };
  contact: {
    phone: string;
    phoneDisplay: string;
    whatsapp: string;
    whatsappDisplay: string;
    email: string;
    /** Optional Cal.com / Calendly link. Leave empty to hide the booking card. */
    bookingUrl: string;
    hours: string;
  };
  socials: { instagram: string; linkedin: string; youtube: string; facebook: string };
  promises: {
    freeDesignPreview: boolean;
    whatsappReplyHours: number;
    workingHours: string;
  };
  seo: { title: string; description: string; ogImage: string };
  analytics: { trackEvents: boolean };
}

export const site = {
  brand: {
    name: "Xhibit AI",
    shortName: "Xhibit",
    tagline: "Made with you. Made to be seen.",
    description:
      "Xhibit AI designs and builds websites, web apps and AI tools around your idea — for businesses and founders across India.",
    url: "https://xhibitai.in", // TODO: domain not bought yet
    city: "Bengaluru",
    region: "Karnataka",
    foundedYear: 2026,
    vision: "Every good idea deserves to be seen at its best, whether it's a café in Ranchi or a startup in Bengaluru.",
    mission:
      "We listen first, then design and build websites, web apps and AI tools around the way you work. Fast, honestly priced, and looked after long after launch.",
    promises: [
      "See it before you pay",
      "Built around your idea",
      "Plain talk and written quotes",
      "Yours to keep: domain, code and data in your name",
    ],
  },

  contact: {
    phone: "+918809387090", // used for tap-to-call links
    phoneDisplay: "+91 88093 87090",
    whatsapp: "919263930093", // country code + number, digits only (used for wa.me links)
    whatsappDisplay: "+91 92639 30093",
    email: "contact.xhibitai@gmail.com",
    bookingUrl: "",
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
    whatsappReplyHours: 2, // 0 hides it
    workingHours: "10 AM – 8 PM",
  },

  seo: {
    title: "Xhibit AI — Websites, Web Apps & AI, Built Around Your Idea",
    description:
      "We design and build websites, web apps and AI tools around your idea, for businesses and founders across India. See your design before you pay. Live in days, not months.",
    ogImage: "/og/home.jpg",
  },

  // Counts WhatsApp/call taps and demo views on your own backend (no third parties).
  analytics: { trackEvents: true },
} satisfies SiteConfig;

export type Site = typeof site;
