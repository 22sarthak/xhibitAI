import { site } from "../../site.config";

const { promises, contact } = site;

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
  "Startups",
  "D2C brands",
  "Consultants",
];

/** What we build — the second line of the strip under the hero. */
export const buildTypes = [
  "Websites",
  "Landing pages",
  "Web apps",
  "Online stores",
  "Dashboards",
  "Booking systems",
  "Customer portals",
  "AI assistants",
  "WhatsApp automations",
  "Internal tools",
];

/* ── Search story ── */
export const searchScenes = [
  { query: "best family restaurant near me", slug: "restaurants", category: "Restaurant · North Indian", rating: "4.6", reviews: "1,240", status: "Open now · Closes 11 PM" },
  { query: "child specialist open now", slug: "clinics", category: "Clinic · Paediatrics", rating: "4.8", reviews: "386", status: "Open now · OPD till 8 PM" },
  { query: "bridal makeup salon nearby", slug: "salons", category: "Salon & Spa · Bridal", rating: "4.7", reviews: "512", status: "Open now · Closes 8:30 PM" },
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
        a: "Our Full Body Check-up is ₹1,499 and covers 68 tests. Home sample collection is free anywhere in the city. Shall I book a slot?",
      },
    ],
  },
  {
    slug: "restaurants",
    label: "Restaurant",
    business: "Kesar Kitchen",
    turns: [
      {
        q: "Do you deliver to Koramangala?",
        a: "Yes, we deliver to Koramangala in about 35 minutes. Today's special is Hyderabadi Dum Biryani at ₹249 — want the full menu?",
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
    day: "Step 1",
    title: "We listen",
    text: "A call or video chat about your business or your idea, in your own words. No tech talk, no sales script.",
  },
  {
    day: "Step 2",
    title: "You see your design",
    text: promises.freeDesignPreview
      ? "We design your key screens and show them to you. You pay only when you like what you see."
      : "We design your key screens and walk you through them, one by one.",
  },
  {
    day: "Step 3",
    title: "We build it with you",
    text: "Short build cycles with a live preview link, so you see progress every few days and can change course early.",
  },
  {
    day: "Step 4",
    title: "You go live",
    text: "We launch, show you how everything works and stay a WhatsApp message away for changes and care.",
  },
];

/** For startups and bigger products: prove the idea early, then build in short, visible steps. */
export const productSteps = [
  {
    day: "Step 1",
    title: "Discovery",
    text: "We map the problem, the people who'll use it and the smallest version worth building. You get a one-page plan and a written quote.",
  },
  {
    day: "Step 2",
    title: "Clickable prototype",
    text: "Real screens you can tap through on your phone and show to users or investors, before any code is written.",
  },
  {
    day: "Step 3",
    title: "Weekly builds",
    text: "A working build on a private link every week. You test it, we adjust. Scope and changes stay in writing.",
  },
  {
    day: "Step 4",
    title: "Launch and grow",
    text: "We launch, set up analytics and error alerts, and keep shipping improvements with you as real users arrive.",
  },
];

/* ── FAQ ── */
export const faqs: { q: string; a: string }[] = [
  {
    q: "What can you build?",
    a: "Anything that runs in a browser: websites, landing pages, online stores, web apps, dashboards, booking systems, customer portals and AI assistants. Everything works beautifully on phones. We don't build native Android or iOS apps.",
  },
  {
    q: "How much does it cost?",
    a: "It depends on what you need, so we don't publish a price list. After a short call you get a clear, written quote within a day, and the price doesn't change unless you change the scope.",
  },
  {
    q: "How long does it take?",
    a: "Most websites go live in days, not months. Web apps and larger projects take a few weeks. You'll get a date in writing before we begin.",
  },
  promises.freeDesignPreview
    ? {
        q: "Do I pay before I see anything?",
        a: "No. We design your key screens first and show them to you. You pay only when you're happy with the direction.",
      }
    : { q: "How do payments work?", a: "In clear milestones, agreed in writing before we start." },
  {
    q: "I'm not technical. Is that okay?",
    a: "Completely. Tell us about your business or your idea in your own words; we handle everything technical and explain the few things you need to know.",
  },
  {
    q: "Do you work with clients outside your city?",
    a: "Yes. We work with businesses and founders across India over calls, video and WhatsApp. Most of our work happens remotely, with a live preview link you can open anytime.",
  },
  {
    q: "Who owns the website and the code?",
    a: "You do. Your domain, code and data are registered in your name. No lock-ins, ever.",
  },
  {
    q: "Will my business show up on Google?",
    a: "We set up your Google Business Profile, connect it to your website and follow Google's guidelines so people can find you. Nobody can honestly promise the #1 spot, but we make sure you're properly listed and easy to find.",
  },
  {
    q: "What is a WhatsApp AI assistant?",
    a: "A smart assistant on your WhatsApp Business number. It answers common questions about timings, prices and availability, and can take bookings at any hour. You can read every chat and step in whenever you like.",
  },
  {
    q: "What happens after launch?",
    a: `We stay with you: hosting, security, backups, updates and new features. Just WhatsApp us${contact.hours ? ` (${contact.hours})` : ""}.`,
  },
];
