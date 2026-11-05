import {
  BadgePercent,
  BarChart3,
  BellRing,
  Bot,
  BookOpen,
  CalendarCheck,
  CreditCard,
  FlaskConical,
  Gauge,
  Hand,
  Inbox,
  LayoutDashboard,
  Megaphone,
  MessageCircle,
  MonitorSmartphone,
  Palette,
  PenLine,
  Plug,
  Rocket,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Target,
  Truck,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { CurtainSpec } from "../lib/transition";
import type { IndustrySlug } from "./industries";
import { serviceMeta, type ServiceSlug } from "./service-meta";

export type { ServiceSlug };

export interface Service {
  slug: ServiceSlug;
  name: string;
  seoTitle: string;
  seoDescription: string;
  /** Short label for links and chips. */
  short: string;
  /** Matches the contact form's "What do you want to build?" values. */
  project: "website" | "landing" | "webapp" | "store" | "ai";
  /** What the WhatsApp message says the visitor wants. */
  topic: string;
  headline: string;
  intro: string;
  /** Accent: Tailwind text class for italics, plus soft / deep hex for surfaces. */
  accent: string;
  soft: string;
  deep: string;
  /** Which live demo plays on the laptop + phone. Omitted for AI, which shows the live chat. */
  demo?: IndustrySlug;
  /** Short note under the devices. */
  demoNote: string;
  features: { icon: LucideIcon; title: string; text: string }[];
  goodFor: string[];
  related: IndustrySlug[];
  faqs: { q: string; a: string }[];
}

const meta = (slug: ServiceSlug) => serviceMeta.find((m) => m.slug === slug)!;

export const services: Service[] = [
  {
    ...meta("websites"),
    short: "Websites",
    project: "website",
    topic: "a new website",
    headline: "A website that makes people *stop scrolling*.",
    intro: "Fast, beautiful websites that work on every screen, show up on Google and turn visitors into calls, bookings and orders.",
    accent: "text-clay-deep",
    soft: "#fbe4d8",
    deep: "#b33a12",
    demo: "restaurants",
    demoNote: "A live restaurant website we built. Scroll and click around.",
    features: [
      { icon: Palette, title: "Designed around your brand", text: "Built from your story, photos and colours. No templates, no lookalikes." },
      { icon: MonitorSmartphone, title: "Right on every screen", text: "Looks and works properly on phones, tablets, laptops and big monitors." },
      { icon: Search, title: "Found on Google", text: "Clean code, proper page titles, a sitemap and your Google Business Profile, set up from day one." },
      { icon: Gauge, title: "Fast, even on patchy data", text: "Light pages and optimised images, so visitors don't give up before it loads." },
      { icon: MessageCircle, title: "Calls, WhatsApp and bookings", text: "Tap-to-call, WhatsApp buttons, enquiry forms and bookings that reach you instantly." },
      { icon: PenLine, title: "Easy to keep fresh", text: "Change text, photos and offers yourself, or send us a WhatsApp and we'll do it." },
    ],
    goodFor: ["Restaurants & cafés", "Clinics", "Schools & coaching", "Salons", "Hotels & homestays", "Consultants", "Startups", "Local shops"],
    related: ["restaurants", "clinics", "schools", "hotels"],
    faqs: [
      {
        q: "How long does a website take?",
        a: "Days, not months. A simple site can be ready in a week or two; bigger ones take longer. You'll get a clear timeline in your written quote.",
      },
      {
        q: "Do I need to give you the content and photos?",
        a: "Whatever you have helps. We'll write the words with you, and suggest or arrange photos if you don't have good ones yet.",
      },
      {
        q: "Will it show up on Google?",
        a: "Every site we build is made to be found: fast pages, proper titles, a sitemap and a connected Google Business Profile. Ranking also depends on reviews and competition, and we'll guide you on both.",
      },
      { q: "Who owns the website?", a: "You do. The domain, code and data are registered in your name." },
    ],
  },
  {
    ...meta("landing-pages"),
    short: "Landing pages",
    project: "landing",
    topic: "a landing page",
    headline: "One page. One goal. *More sign-ups.*",
    intro: "Focused pages for a launch, an ad campaign or a single offer, designed to turn visitors into leads, sign-ups or orders.",
    accent: "text-rose-deep",
    soft: "#fbe2ea",
    deep: "#b4245a",
    demo: "salons",
    demoNote: "A live single-page site with one clear action: book. Try it.",
    features: [
      { icon: Target, title: "Built for one action", text: "Every section leads to one button: book, buy, sign up or WhatsApp." },
      { icon: PenLine, title: "Words that persuade", text: "Clear headlines and short sections, written with you in plain language." },
      { icon: Megaphone, title: "Ready for ads", text: "Tracking for Google, Meta and Instagram ads, so you see what each rupee brings in." },
      { icon: Inbox, title: "Leads straight to you", text: "Sign-ups arrive on WhatsApp, email or a simple sheet within seconds." },
      { icon: Rocket, title: "Quick to launch", text: "A focused scope means we can go live fast, often within days." },
      { icon: FlaskConical, title: "Test and improve", text: "Try two headlines or offers side by side and keep the one that works better." },
    ],
    goodFor: ["Product launches", "Startup waitlists", "Events & workshops", "Festive offers", "Ad campaigns", "Courses & coaching", "Real estate projects", "New branches"],
    related: ["salons", "gyms", "hotels"],
    faqs: [
      {
        q: "How is a landing page different from a website?",
        a: "A website explains everything about you. A landing page does one job, like sign-ups for a launch or bookings for an offer, so it has fewer distractions and usually converts better.",
      },
      { q: "Can you connect it to my ads?", a: "Yes. We set up the tracking and analytics for Google and Meta ads so you can see which ads bring you leads." },
      { q: "Can it sit on my existing website?", a: "Yes, as a page on your current domain (like yoursite.in/offer) or on its own address." },
      { q: "How fast can it go live?", a: "Landing pages are our quickest projects. Once the content is agreed, they can often launch within days." },
    ],
  },
  {
    ...meta("web-apps"),
    short: "Web apps",
    project: "webapp",
    topic: "a web app",
    headline: "Software for *how you actually work*.",
    intro: "Booking systems, dashboards, customer portals, startup MVPs and internal tools that run in the browser, on any laptop or phone, with nothing to install.",
    accent: "text-cobalt",
    soft: "#e3e8fc",
    deep: "#1b34b5",
    demo: "business",
    demoNote: "A live sales and stock dashboard we built. Click through it.",
    features: [
      { icon: Workflow, title: "Built around your workflow", text: "We map how your team works today, then build screens that fit it, not the other way round." },
      { icon: LayoutDashboard, title: "Dashboards that make sense", text: "Sales, orders, stock and dues at a glance, with reports you can download." },
      { icon: Users, title: "Logins and roles", text: "Separate access for owners, staff, customers or parents, each seeing only what they should." },
      { icon: MonitorSmartphone, title: "Works on any device", text: "Runs in the browser on laptops, tablets and phones. No app store, no installs." },
      { icon: Plug, title: "Connected to your tools", text: "WhatsApp, UPI payments, Google Sheets, Excel exports, email and more." },
      { icon: ShieldCheck, title: "Secure and backed up", text: "Encrypted connections and daily backups, and your data stays yours." },
    ],
    goodFor: ["Startup MVPs", "Distributors & traders", "Clinics & labs", "Schools & coaching", "Agencies & studios", "Field & delivery teams", "Manufacturers", "Teams living in spreadsheets"],
    related: ["business", "schools", "clinics"],
    faqs: [
      { q: "Do my staff need to install anything?", a: "No. A web app runs in the browser. Open a link, log in, and it works on laptops, tablets and phones." },
      {
        q: "Can you build an MVP for my startup?",
        a: "Yes. We start with the smallest version that proves your idea, ship it quickly, and grow it in short build cycles as you learn from real users.",
      },
      { q: "Can it replace our spreadsheets?", a: "Usually, yes. We can bring in your existing data and keep exports to Excel or Google Sheets for whoever still needs them." },
      { q: "What happens after launch?", a: "We stay on for fixes, new features and improvements. You'll always have someone to WhatsApp." },
    ],
  },
  {
    ...meta("online-stores"),
    short: "Online stores",
    project: "store",
    topic: "an online store",
    headline: "Your shop, *open all night*.",
    intro: "Your own online store with UPI and card payments, delivery and WhatsApp order updates, without a marketplace taking a cut of every sale.",
    accent: "text-sal",
    soft: "#dcefe5",
    deep: "#0e7a55",
    demo: "retail",
    demoNote: "A live boutique store we built. Add something to the bag.",
    features: [
      { icon: ShoppingBag, title: "A catalogue that sells", text: "Product pages with photos, sizes, colours and stock, easy for you to update." },
      { icon: CreditCard, title: "UPI, cards and COD", text: "Payments through trusted Indian gateways, with cash on delivery if you want it." },
      { icon: MessageCircle, title: "Order updates on WhatsApp", text: "Confirmations, shipping and delivery messages sent to customers automatically." },
      { icon: Truck, title: "Shipping made simple", text: "Delivery charges by pin code, and courier tie-ups when you need them." },
      { icon: BadgePercent, title: "Offers and coupons", text: "Festive sales, coupon codes and free-shipping thresholds you control." },
      { icon: BarChart3, title: "Know what sells", text: "Orders, revenue and best sellers in one simple dashboard." },
    ],
    goodFor: ["Boutiques & fashion", "Handloom & crafts", "Home bakers", "Sweet shops", "Electronics & mobiles", "D2C brands", "Pharmacies", "Wholesale & B2B"],
    related: ["retail", "restaurants", "business"],
    faqs: [
      {
        q: "Do I pay a commission on every sale?",
        a: "Not to us. You only pay the payment gateway's standard fee, which is usually far less than marketplace commissions.",
      },
      {
        q: "Which payments can I accept?",
        a: "UPI, debit and credit cards, net banking and wallets through a trusted Indian payment gateway. Cash on delivery is optional.",
      },
      { q: "Can I manage products myself?", a: "Yes. You get a simple admin to add products, change prices and mark items out of stock, right from your phone." },
      { q: "Can it work with Instagram and WhatsApp?", a: "Yes. We can link your store to Instagram and your WhatsApp catalogue so customers can browse and order where they already are." },
    ],
  },
  {
    ...meta("ai-automation"),
    short: "AI & automation",
    project: "ai",
    topic: "an AI assistant or automation",
    headline: "An assistant that *never sleeps*.",
    intro: "AI assistants on WhatsApp and your website that answer questions and take bookings, plus automations that send the right message at the right time.",
    accent: "text-violet",
    soft: "#ece6fb",
    deep: "#6a46d9",
    demoNote: "Both screens are live: a customer chatting with an assistant, and messages that send themselves.",
    features: [
      { icon: Bot, title: "WhatsApp assistant", text: "Answers prices, timings and FAQs in seconds, in English, Hindi or Hinglish." },
      { icon: CalendarCheck, title: "Bookings and orders", text: "Takes appointments, table bookings and orders, then confirms them automatically." },
      { icon: Hand, title: "Hands over to you", text: "Any chat can be passed to a real person, and you can read every conversation." },
      { icon: BellRing, title: "Reminders and follow-ups", text: "Appointment reminders, payment nudges and review requests, sent on time." },
      { icon: BookOpen, title: "Trained on your business", text: "Set up with your menu, prices, policies and tone, and kept up to date." },
      { icon: Sparkles, title: "AI on your website", text: "Smart search, chat and forms on your site, or a custom AI tool for your team." },
    ],
    goodFor: ["Clinics & hospitals", "Restaurants & cloud kitchens", "Coaching institutes", "Salons & spas", "Real estate", "Online stores", "Service businesses", "Startups adding AI"],
    related: ["clinics", "restaurants", "salons"],
    faqs: [
      {
        q: "Will the assistant give wrong answers?",
        a: "It only answers from the information we set up with you, like your prices, timings and policies. When it isn't sure, it hands the chat to you.",
      },
      {
        q: "Does it work on my existing WhatsApp number?",
        a: "It runs on the official WhatsApp Business Platform. You can move your current number or use a new one, and we'll explain the trade-offs before you decide.",
      },
      { q: "Can it reply in Hindi?", a: "Yes. It understands and replies in English, Hindi and Hinglish, the way customers actually type." },
      {
        q: "Are there running costs?",
        a: "Yes. WhatsApp charges small per-conversation fees and AI usage has a cost. Both are spelled out in your written quote before we start.",
      },
    ],
  },
];

export const serviceBySlug = (slug?: string) => services.find((s) => s.slug === slug);

export const curtainForService = (s: Service): CurtainSpec => ({ color: s.deep, ink: "#ffffff", eyebrow: "Services", title: s.name });
