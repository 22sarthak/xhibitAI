import { site } from "../../site.config";
import { inr } from "../lib/utils";

const { promises, pricing, contact } = site;
const priceOf = (id: string) => pricing.plans.find((p) => p.id === id)!;

/* ── Local strip ── */
export const businessTypes = [
  "Restaurants",
  "Clinics",
  "Schools",
  "Salons",
  "Gyms",
  "Hotels",
  "Boutiques",
  "Coaching centres",
  "Diagnostic labs",
  "Sweet shops",
  "Showrooms",
  "Homestays",
];

export const neighbourhoods = [
  "Lalpur",
  "Harmu",
  "Bariatu",
  "Kanke Road",
  "Main Road",
  "Morabadi",
  "Doranda",
  "Hinoo",
  "Ashok Nagar",
  "Argora",
  "Kokar",
  "Upper Bazar",
  "Ratu Road",
  "Hatia",
];

/* ── Search story ── */
export const searchScenes = [
  { query: "best family restaurant near Lalpur", slug: "restaurants", category: "Restaurant · North Indian", rating: "4.6", reviews: "1,240", status: "Open now · Closes 11 PM" },
  { query: "child specialist near Bariatu", slug: "clinics", category: "Clinic · Paediatrics", rating: "4.8", reviews: "386", status: "Open now · OPD till 8 PM" },
  { query: "bridal makeup salon in Harmu", slug: "salons", category: "Salon & Spa · Bridal", rating: "4.7", reviews: "512", status: "Open now · Closes 8:30 PM" },
] as const;

/* ── AI assistant demo — scripted conversations ── */
export interface ChatTurn {
  q: string;
  a: string;
  /** Optional quick replies shown inside the assistant's bubble. */
  actions?: { label: string; reply: string }[];
}
export interface ChatScript {
  slug: "clinics" | "restaurants" | "schools" | "salons";
  label: string;
  business: string;
  turns: ChatTurn[];
}

export const chatScripts: ChatScript[] = [
  {
    slug: "clinics",
    label: "Clinic",
    business: "Arogya Clinic",
    turns: [
      {
        q: "Is Dr. Sinha available tomorrow?",
        a: "Yes! Dr. Ananya Sinha has slots tomorrow at 10:30 AM and 4:00 PM. Which one should I book for you?",
        actions: [
          { label: "10:30 AM", reply: "Done ✓ You're booked for 10:30 AM tomorrow. Your token is A-14 — I'll remind you two hours before." },
          { label: "4:00 PM", reply: "Done ✓ You're booked for 4:00 PM tomorrow. Your token is B-06 — I'll remind you two hours before." },
        ],
      },
      { q: "Kal Sunday ko OPD khula hai?", a: "Haan! Sunday ko OPD subah 9 se dopahar 1 baje tak khula hai. Emergency 24×7 available hai." },
      {
        q: "How much is a full body check-up?",
        a: "Our Full Body Check-up is ₹1,499 and covers 68 tests. Home sample collection is free anywhere in Ranchi. Shall I book a slot?",
      },
    ],
  },
  {
    slug: "restaurants",
    label: "Restaurant",
    business: "Kesar Kitchen",
    turns: [
      {
        q: "Do you deliver to Kanke Road?",
        a: "Yes, we deliver to Kanke Road in about 35 minutes. Today's special is Hyderabadi Dum Biryani at ₹249 — want the full menu?",
        actions: [{ label: "Send menu", reply: "Here you go: kesarkitchen.in/menu — just reply with your dishes and address, and we'll confirm." }],
      },
      { q: "Table for 6 tonight at 8?", a: "Done ✓ A table for 6 at 8:00 PM tonight is reserved. We'll send a reminder at 6. See you soon!" },
      { q: "Veg thali milegi?", a: "Bilkul! Kesar Veg Thali ₹199 — 2 sabzi, dal, rice, 3 roti, raita aur ek sweet." },
    ],
  },
  {
    slug: "schools",
    label: "School",
    business: "Sal Valley School",
    turns: [
      {
        q: "When do Class 1 admissions open?",
        a: "Admissions for Class 1 (2027–28) are open now. Would you like the form and fee details right here on WhatsApp?",
        actions: [{ label: "Yes, send", reply: "Sent ✓ Fill in the form at your convenience — our admissions office will call you within a day." }],
      },
      { q: "Is there a school bus to Harmu?", a: "Yes, Route 4 covers Harmu. Pick-up is around 7:10 AM and drop-off around 2:15 PM." },
      { q: "What documents are needed?", a: "Birth certificate, Aadhaar of the child and a parent, four photos, and the last report card if any." },
    ],
  },
  {
    slug: "salons",
    label: "Salon",
    business: "Aura Salon",
    turns: [
      {
        q: "Any slot for a haircut this evening?",
        a: "We have 6:00 PM and 7:30 PM with Priya today. Which one works?",
        actions: [
          { label: "6:00 PM", reply: "Booked ✓ Haircut with Priya at 6:00 PM today. See you soon!" },
          { label: "7:30 PM", reply: "Booked ✓ Haircut with Priya at 7:30 PM today. See you soon!" },
        ],
      },
      { q: "Bridal makeup price?", a: "Our bridal packages start at ₹14,999 — HD makeup, hair and draping. Want to book a free trial consultation?" },
      { q: "Are you open on Monday?", a: "Yes, we're open all seven days, 10 AM to 8:30 PM." },
    ],
  },
];

/* ── How it works ── */
export const steps = [
  {
    day: "Day 1",
    title: "We meet",
    text: promises.inPersonVisits
      ? "At your shop, clinic or school — anywhere in Ranchi — or on a call. Tell us about your business in your own words. No tech talk."
      : "On a call or video chat. Tell us about your business in your own words. No tech talk.",
  },
  {
    day: "Day 2–3",
    title: "You see your design",
    text: promises.freeDesignPreview
      ? "We design your homepage and show it to you. You pay only when you like what you see."
      : "We design your homepage and walk you through it, page by page.",
  },
  {
    day: "Day 4–6",
    title: "We build and set up",
    text: "Website, Google Maps listing, WhatsApp button and forms — all built and tested on real phones.",
  },
  {
    day: promises.liveInDays ? `Day ${promises.liveInDays}` : "Launch",
    title: "You go live",
    text: "Your site goes live. We show you how everything works and stay a WhatsApp message away.",
  },
];

/* ── FAQ ── */
const starter = priceOf("starter");
const growth = priceOf("growth");

export const faqs: { q: string; a: string }[] = [
  {
    q: "How much does a website cost?",
    a: `Most small businesses start with our ${starter.name} package at ${pricing.currency}${inr(starter.price)} (one-time). Sites with bookings, menus or online orders start from ${pricing.currency}${inr(growth.price)}. You get a clear written quote before anything starts.`,
  },
  {
    q: "I don't know anything about computers. Is that okay?",
    a: "Completely. That's exactly who we build for. You tell us about your business in your own words; we handle everything technical — and we'll show you the few things you need, in person.",
  },
  {
    q: "How long does it take?",
    a: `${promises.liveInDays ? `Starter websites go live in about ${promises.liveInDays} days.` : "Starter websites go live within days."} Bigger projects take two to six weeks — you'll get a date before we begin.`,
  },
  promises.freeDesignPreview
    ? {
        q: "Do I pay before I see anything?",
        a: `No. We design your homepage first and show it to you. You pay only when you're happy with the direction. ${pricing.paymentTerms}`,
      }
    : { q: "How do payments work?", a: pricing.paymentTerms },
  {
    q: "Can I change prices, my menu or photos later?",
    a: "Yes. Send us a WhatsApp and we'll update it — small changes are included in the care plan. If you prefer, we'll also give you a simple way to update things yourself.",
  },
  {
    q: "Will my business show up on Google?",
    a: "We set up your Google Maps listing, connect it to your website and follow Google's guidelines so people nearby can find you. Nobody can honestly promise the #1 spot — but we'll make sure you're properly listed and easy to find.",
  },
  {
    q: "Do I need to buy a domain and hosting?",
    a: "We take care of it. Your domain (like yourbusiness.in) is registered in your business's name, so it always belongs to you.",
  },
  {
    q: "What is a WhatsApp AI assistant?",
    a: "A smart auto-reply for your WhatsApp Business number. It answers common questions — timings, prices, availability — and can take bookings at any hour. You can read every chat and step in whenever you like.",
  },
  {
    q: "Do you work outside Ranchi?",
    a: `Yes — we work with businesses across ${site.brand.region} and India over phone and video. But we love meeting ${site.brand.city} businesses in person.`,
  },
  {
    q: "What happens after the website is live?",
    a: `We stay with you. On the care plan we look after hosting, security, backups, updates and festive offers — just WhatsApp us${contact.hours ? ` (${contact.hours})` : ""}.`,
  },
];
