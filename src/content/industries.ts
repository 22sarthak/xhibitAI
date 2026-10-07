import type { LucideIcon } from "lucide-react";
import {
  BedDouble,
  BookOpen,
  CalendarCheck,
  Calculator,
  ChartColumn,
  ClipboardList,
  Clock,
  Dumbbell,
  FileText,
  FlaskConical,
  GalleryHorizontal,
  GraduationCap,
  HeartPulse,
  LayoutDashboard,
  Languages,
  MapPin,
  Megaphone,
  MessageCircle,
  Mountain,
  Package,
  PartyPopper,
  Receipt,
  Scissors,
  ShoppingBag,
  Siren,
  Sparkles,
  Star,
  Store,
  Tag,
  Ticket,
  Trophy,
  Users,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import type { PlanId } from "../../site.config";
import { industryMeta, type IndustrySlug } from "./industry-meta";
import type { CurtainSpec } from "../lib/transition";

export type { IndustrySlug };

export interface IndustryTheme {
  /** Soft background tint for the industry page. */
  tint: string;
  /** Deep brand colour: curtain, accents, buttons. */
  deep: string;
  /** Text colour on top of `deep`. */
  onDeep: string;
  /** Four colours the hero silk flows through (light → deep). */
  silk: [string, string, string, string];
}

export interface Industry {
  slug: IndustrySlug;
  no: string;
  name: string;
  seoTitle: string;
  seoDescription: string;
  /** Singular noun, e.g. "Restaurant". */
  kind: string;
  /** Word used in the rotating hero line. */
  word: string;
  icon: LucideIcon;
  tagline: string;
  alsoFor: string;
  demo: { name: string; area: string };
  theme: IndustryTheme;
  headline: string;
  intro: string;
  features: { id: string; title: string; text: string; icon: LucideIcon }[];
  studioPoints: string[];
  automations: { title: string; trigger: string; steps: string[] }[];
  outcomes: { title: string; text: string }[];
  plan: PlanId;
  timeline: string;
  faqs: { q: string; a: string }[];
  /** The little "this is what customers do" toast in the hero. */
  notification: { title: string; meta: string; icon: LucideIcon };
}

const meta = (slug: IndustrySlug) => industryMeta.find((m) => m.slug === slug)!;

export const industries: Industry[] = [
  {
    ...meta("restaurants"),
    kind: "Restaurant",
    word: "restaurant",
    icon: UtensilsCrossed,
    tagline: "Menus, table bookings and orders on WhatsApp",
    alsoFor: "cafés, bakeries, cloud kitchens, sweet shops, pubs and bars",
    demo: { name: "Kesar Kitchen", area: "Lalpur" },
    theme: { tint: "#f6e7d7", deep: "#7a2420", onDeep: "#fbefe2", silk: ["#fbf1e6", "#f4c28d", "#dd6b3d", "#8e2f28"] },
    headline: "A website that fills your tables.",
    intro:
      "Show your menu with photos, take table bookings and receive orders straight on WhatsApp — without paying an app commission on every bill.",
    features: [
      { id: "menu", title: "Menu with photos and prices", text: "Customers see what you serve before they arrive. Change prices whenever you like.", icon: BookOpen },
      { id: "menu", title: "Orders on WhatsApp", text: "They pick dishes, tap once, and the whole order lands in your WhatsApp. No commission.", icon: MessageCircle },
      { id: "booking", title: "Table bookings", text: "Guests choose the day, time and number of people. You get a message instantly.", icon: CalendarCheck },
      { id: "reviews", title: "Your best reviews up front", text: "Your Google rating and happiest guests, right where new customers look.", icon: Star },
      { id: "visit", title: "Timings, map and one-tap call", text: "“Are you open?” is answered before anyone has to ask.", icon: MapPin },
    ],
    studioPoints: ["Menu with photos and veg/non-veg marks", "Orders straight to your WhatsApp", "Table booking in two taps", "Open-now timings and directions"],
    automations: [
      {
        title: "Booking confirmations",
        trigger: "A guest books a table",
        steps: ["Instant confirmation on WhatsApp", "A reminder two hours before", "A thank-you and review request the next morning"],
      },
      {
        title: "Instant replies",
        trigger: "Someone messages “Menu?” or “Are you open?”",
        steps: ["Menu link sent in seconds", "Today's timings and location", "Anything else goes to your staff"],
      },
      {
        title: "Festive offers",
        trigger: "Diwali, Holi or a new dish",
        steps: ["Offer banner appears on your site", "A message to customers who opted in", "See how many orders it brought"],
      },
    ],
    outcomes: [
      { title: "Fewer “are you open?” calls", text: "Your timings, menu and location answer themselves." },
      { title: "More direct orders", text: "Orders on WhatsApp mean no commission cut from every bill." },
      { title: "Fuller weekends", text: "Easy bookings and reminders mean fewer no-shows." },
    ],
    plan: "growth",
    timeline: "Live in about 10 days",
    faqs: [
      {
        q: "Can I still use Zomato and Swiggy?",
        a: "Of course. Your website works alongside them — it simply gives customers a direct way to order from you too, so you keep more of every bill.",
      },
      {
        q: "Can I change menu prices myself?",
        a: "Yes. We set up a simple way for you to update dishes and prices — or just WhatsApp us the changes and we'll do it for you.",
      },
      {
        q: "Do I need online payments?",
        a: "Not to start. Most restaurants begin with orders on WhatsApp and payment by UPI or cash. We can add online payments whenever you're ready.",
      },
    ],
    notification: { title: "New table booking", meta: "4 guests · Today, 8:30 PM", icon: CalendarCheck },
  },
  {
    ...meta("clinics"),
    kind: "Clinic",
    word: "clinic",
    icon: HeartPulse,
    tagline: "Appointments, doctors' timings and health packages",
    alsoFor: "hospitals, dental clinics, diagnostic labs, physiotherapy centres and pharmacies",
    demo: { name: "Arogya Clinic", area: "Bariatu" },
    theme: { tint: "#dcefea", deep: "#0e5e5d", onDeep: "#e9f7f3", silk: ["#eff8f5", "#bde3d8", "#6cbdad", "#2c7a80"] },
    headline: "Patients find you, book you, and arrive on time.",
    intro:
      "Let patients see your doctors and timings, book appointments online and get reminders — so your reception spends less time on the phone and more time with people.",
    features: [
      { id: "doctors", title: "Doctors and timings", text: "Each doctor's speciality, days and fees — always up to date.", icon: Users },
      { id: "doctors", title: "Appointments with token numbers", text: "Patients pick a slot and get a token. No crowded waiting room.", icon: Ticket },
      { id: "packages", title: "Health check-up packages", text: "Show packages and prices. Patients book home sample collection in a tap.", icon: FlaskConical },
      { id: "emergency", title: "One-tap emergency call", text: "In an emergency, your number is never more than one tap away.", icon: Siren },
      { id: "top", title: "English and Hindi", text: "Patients switch language in one tap. Try the toggle at the top of the demo.", icon: Languages },
    ],
    studioPoints: ["Doctors, days and fees", "Appointments with token numbers", "Health packages and home collection", "Emergency call button"],
    automations: [
      {
        title: "Appointment reminders",
        trigger: "A patient books a slot",
        steps: ["Confirmation with their token number", "A reminder two hours before", "A follow-up message after the visit"],
      },
      {
        title: "Reports on WhatsApp",
        trigger: "A lab report is ready",
        steps: ["The patient gets a private download link", "Saved as a PDF on their phone", "The doctor's note attached"],
      },
      {
        title: "Reception assistant",
        trigger: "“Is Dr. Sinha in today?”",
        steps: ["Answers instantly with timings", "Offers the next free slot", "Books it — no phone call needed"],
      },
    ],
    outcomes: [
      { title: "A calmer reception", text: "Far fewer calls asking the same questions." },
      { title: "Fewer no-shows", text: "Reminders bring patients in on time." },
      { title: "More trust", text: "A professional site helps new patients feel safe choosing you." },
    ],
    plan: "growth",
    timeline: "Live in about 10 days",
    faqs: [
      {
        q: "Is patient information kept private?",
        a: "Yes. Appointment details go only to your clinic, are stored securely and are never shared or sold. We also add a clear privacy notice for patients.",
      },
      {
        q: "Can it work for a hospital with many departments?",
        a: "Yes. We build department pages, doctor rosters, OPD schedules and online report downloads for larger hospitals.",
      },
      {
        q: "Will this replace my billing software?",
        a: "It doesn't need to. Your website and bookings work alongside whatever you use today.",
      },
    ],
    notification: { title: "Appointment booked", meta: "Token A-14 · Tomorrow, 10:30 AM", icon: Ticket },
  },
  {
    ...meta("schools"),
    kind: "School",
    word: "school",
    icon: GraduationCap,
    tagline: "Admissions, notices and a parent portal",
    alsoFor: "coaching institutes, play schools, colleges, tuition centres and music or dance academies",
    demo: { name: "Sal Valley School", area: "Kanke Road" },
    theme: { tint: "#e1e9fa", deep: "#1b2a4e", onDeep: "#f6c445", silk: ["#eef3fe", "#c4d5fa", "#f2cc6a", "#4a68bd"] },
    headline: "One trusted place for admissions, notices and parents.",
    intro:
      "Give parents one trusted place for admissions, fees, notices and results — and give your office fewer phone calls and fewer piles of paper.",
    features: [
      { id: "admissions", title: "Online admission enquiries", text: "Parents apply from their phone. Every enquiry lands in one list.", icon: ClipboardList },
      { id: "notices", title: "Notice board", text: "Holidays, PTMs and circulars — posted once, seen by every parent.", icon: Megaphone },
      { id: "results", title: "Results and toppers", text: "Celebrate your students. Nothing builds trust like results.", icon: Trophy },
      { id: "portal", title: "Parent portal", text: "Attendance, homework and fee dues — parents can check anytime.", icon: LayoutDashboard },
      { id: "facilities", title: "Facilities and transport", text: "Labs, library, sports and bus routes, shown beautifully.", icon: BookOpen },
    ],
    studioPoints: ["Admission enquiry form", "Notice board for parents", "Results and toppers", "Parent portal for attendance and fees"],
    automations: [
      {
        title: "Fee reminders",
        trigger: "Fees are due next week",
        steps: ["A polite WhatsApp reminder to parents", "A UPI payment link included", "Receipt sent automatically"],
      },
      {
        title: "Admission follow-ups",
        trigger: "A parent fills in the enquiry form",
        steps: ["An instant thank-you with your brochure", "A call scheduled for your office", "A reminder if there's no reply in two days"],
      },
      {
        title: "Daily updates",
        trigger: "A teacher marks attendance",
        steps: ["Absence alert to the parent", "Homework shared on the portal", "Monthly progress summary"],
      },
    ],
    outcomes: [
      { title: "More admissions", text: "Parents who can apply online, do." },
      { title: "A quieter office", text: "Notices and fee questions answered without calls." },
      { title: "Happier parents", text: "Everything they need, in one trusted place." },
    ],
    plan: "growth",
    timeline: "Live in about 2 weeks",
    faqs: [
      {
        q: "We're a coaching institute, not a school. Does this work?",
        a: "Absolutely. We build for coaching centres too — batches, timings, fee plans, toppers and demo-class bookings.",
      },
      {
        q: "Can parents pay fees online?",
        a: "Yes, we can add UPI and card payments with automatic receipts. Many schools start with reminders and add payments later.",
      },
      {
        q: "Who updates the notices?",
        a: "Your office posts notices in a minute from a simple dashboard. No technical skills needed.",
      },
    ],
    notification: { title: "New admission enquiry", meta: "Class 1 · 2027–28 session", icon: ClipboardList },
  },
  {
    ...meta("salons"),
    kind: "Salon",
    word: "salon",
    icon: Scissors,
    tagline: "Service menu, stylist booking and bridal packages",
    alsoFor: "beauty parlours, spas, barbershops, makeup artists and nail studios",
    demo: { name: "Aura Salon", area: "Harmu" },
    theme: { tint: "#f5e1e0", deep: "#6e3349", onDeep: "#f9e9e6", silk: ["#fbefed", "#f1c7c2", "#d795a3", "#8c506b"] },
    headline: "Beautiful bookings, without the phone tag.",
    intro:
      "Show your services and prices, let clients choose a stylist and a time, and fill your calendar while you're busy with the client in your chair.",
    features: [
      { id: "services", title: "Service menu with prices", text: "Every service, its price and how long it takes — no awkward questions.", icon: Sparkles },
      { id: "services", title: "Choose a stylist and time", text: "Clients pick who and when. You get a message, not a missed call.", icon: CalendarCheck },
      { id: "bridal", title: "Bridal packages", text: "Your most valuable service, presented the way it deserves.", icon: PartyPopper },
      { id: "lookbook", title: "Lookbook gallery", text: "Your best work, beautifully shown — straight from your Instagram.", icon: GalleryHorizontal },
      { id: "team", title: "Meet the stylists", text: "People book people they trust. Let them meet your team.", icon: Users },
    ],
    studioPoints: ["Service menu with prices and time", "Pick a stylist and a slot", "Bridal packages", "Lookbook gallery"],
    automations: [
      {
        title: "Appointment reminders",
        trigger: "A client books a slot",
        steps: ["Instant confirmation", "A reminder three hours before", "“How was it?” plus a review request"],
      },
      {
        title: "Win-back messages",
        trigger: "A client hasn't visited in six weeks",
        steps: ["A friendly “we miss you” message", "A small offer just for them", "A booking link included"],
      },
      {
        title: "Wedding season",
        trigger: "Wedding season begins",
        steps: ["Bridal banner goes live on your site", "A message to past bridal enquiries", "Free trial bookings tracked"],
      },
    ],
    outcomes: [
      { title: "A fuller calendar", text: "Bookings come in even while you're working." },
      { title: "Fewer no-shows", text: "Reminders bring clients in on time." },
      { title: "Bigger bills", text: "Packages and add-ons sell themselves online." },
    ],
    plan: "growth",
    timeline: "Live in about 10 days",
    faqs: [
      { q: "Can clients book a specific stylist?", a: "Yes. Each stylist can have their own days and timings, and clients choose who they want." },
      { q: "Can I show my Instagram work?", a: "Yes. We bring your best Instagram posts into a beautiful gallery on your site." },
      { q: "Can it take an advance for bridal bookings?", a: "Yes. We can add UPI or card payments for advances, with automatic receipts." },
    ],
    notification: { title: "New booking", meta: "Bridal trial · Saturday, 11:00 AM", icon: Sparkles },
  },
  {
    ...meta("gyms"),
    kind: "Gym",
    word: "gym",
    icon: Dumbbell,
    tagline: "Membership plans, class timetable and free trials",
    alsoFor: "yoga studios, CrossFit boxes, dance studios, martial arts and sports academies",
    demo: { name: "Pulse Fitness", area: "Morabadi" },
    theme: { tint: "#e8efd6", deep: "#111111", onDeep: "#c8f031", silk: ["#f3f5ea", "#d9e9a4", "#a8c84e", "#36421c"] },
    headline: "Turn walk-ins into members.",
    intro:
      "Show your plans and prices, let people book a free trial and see the class timetable — then keep members coming back with reminders.",
    features: [
      { id: "plans", title: "Plans and prices", text: "Monthly, quarterly, yearly — clear prices, no haggling at the desk.", icon: Wallet },
      { id: "classes", title: "Class timetable", text: "Yoga, Zumba, HIIT — members see what's on and book a spot.", icon: Clock },
      { id: "trial", title: "Free trial pass", text: "Visitors book a free trial and get a pass on their phone.", icon: Ticket },
      { id: "bmi", title: "BMI calculator", text: "A handy tool that gets people thinking about their goals.", icon: Calculator },
      { id: "trainers", title: "Your trainers", text: "Show off your coaches and what each one is best at.", icon: Users },
    ],
    studioPoints: ["Monthly and yearly plans", "Class timetable with booking", "Free trial pass", "BMI calculator"],
    automations: [
      {
        title: "Renewal reminders",
        trigger: "A membership ends in seven days",
        steps: ["A friendly renewal reminder", "A UPI payment link", "Receipt and a “welcome back”"],
      },
      {
        title: "Trial to member",
        trigger: "Someone books a free trial",
        steps: ["Their pass sent on WhatsApp", "A reminder the evening before", "A follow-up with a joining offer"],
      },
      {
        title: "We missed you",
        trigger: "A member hasn't checked in for ten days",
        steps: ["A motivating nudge", "Their trainer is told", "Class suggestions for the week"],
      },
    ],
    outcomes: [
      { title: "More trial sign-ups", text: "Free trials booked online, any time of day." },
      { title: "Better renewals", text: "Members renew on time with reminders." },
      { title: "Less desk work", text: "Plans and timetable answer the common questions." },
    ],
    plan: "growth",
    timeline: "Live in about 10 days",
    faqs: [
      { q: "Can members pay online?", a: "Yes. We can add UPI and card payments for memberships, with automatic receipts and renewal reminders." },
      { q: "Can we track attendance?", a: "Yes — with the Automate plan we add check-ins, attendance and renewal tracking in a simple dashboard." },
      { q: "Will this work for a yoga or dance studio?", a: "Definitely. Plans, timetables and trial bookings work for any fitness studio." },
    ],
    notification: { title: "Free trial booked", meta: "Rohit · Tomorrow, 6:30 AM", icon: Ticket },
  },
  {
    ...meta("hotels"),
    kind: "Hotel",
    word: "hotel",
    icon: BedDouble,
    tagline: "Direct room bookings, banquets and a local guide",
    alsoFor: "homestays, resorts, guest houses, banquet halls and wedding venues",
    demo: { name: "Palash Residency", area: "Hinoo" },
    theme: { tint: "#e3ebe3", deep: "#1e3a2f", onDeep: "#f2e3c6", silk: ["#f6f2e8", "#e8d2a4", "#e07d4c", "#2e5040"] },
    headline: "More direct bookings. Less commission.",
    intro:
      "Let guests see your rooms, check dates and book directly with you — and show off your banquet halls in time for Ranchi's wedding season.",
    features: [
      { id: "top", title: "Check dates and book direct", text: "Guests choose dates and rooms right on your site. No middleman.", icon: CalendarCheck },
      { id: "rooms", title: "Rooms with photos and prices", text: "Every room, beautifully shown, with a clear price per night.", icon: BedDouble },
      { id: "banquets", title: "Banquets and weddings", text: "Show your halls, capacity and packages — and collect event enquiries.", icon: PartyPopper },
      { id: "explore", title: "Explore Ranchi", text: "Hundru Falls, Patratu Valley and more — help guests plan their stay.", icon: Mountain },
      { id: "reviews", title: "Guest reviews", text: "Happy guests convince new ones better than any advert.", icon: Star },
    ],
    studioPoints: ["Date picker and direct booking", "Rooms with prices", "Banquet and wedding enquiries", "Nearby places guide"],
    automations: [
      {
        title: "Booking confirmations",
        trigger: "A guest books a room",
        steps: ["Instant confirmation with invoice", "Directions and check-in details a day before", "A review request after check-out"],
      },
      {
        title: "Event enquiries",
        trigger: "Someone asks about a wedding",
        steps: ["Brochure and packages sent instantly", "A site visit scheduled", "A follow-up if there's no reply"],
      },
      {
        title: "Repeat guests",
        trigger: "A past guest's next season",
        steps: ["A personal “welcome back” offer", "A direct booking link", "Loyalty discount applied"],
      },
    ],
    outcomes: [
      { title: "Lower commissions", text: "Every direct booking keeps more money with you." },
      { title: "A full banquet calendar", text: "Wedding enquiries captured and followed up." },
      { title: "A better first impression", text: "Guests trust what they can see clearly." },
    ],
    plan: "growth",
    timeline: "Live in about 2 weeks",
    faqs: [
      {
        q: "Can it work with MakeMyTrip or Booking.com?",
        a: "Yes. We can work with your channel manager so availability stays in sync — or start simple with direct enquiries and grow from there.",
      },
      { q: "Can guests pay online?", a: "Yes, by UPI or card — or take a small advance online and collect the rest at check-in." },
      { q: "We're a small homestay. Is this too much?", a: "Not at all. Our Get Online package suits homestays perfectly: beautiful photos, rooms and a WhatsApp booking button." },
    ],
    notification: { title: "Direct booking", meta: "Deluxe room · 2 nights · ₹6,998", icon: BedDouble },
  },
  {
    ...meta("retail"),
    kind: "Shop",
    word: "shop",
    icon: ShoppingBag,
    tagline: "Product catalogue, WhatsApp orders and store visits",
    alsoFor: "boutiques, electronics, sweet shops, hardware, furniture, gift and grocery stores",
    demo: { name: "Tana Bana", area: "Main Road" },
    theme: { tint: "#ece6f4", deep: "#22305b", onDeep: "#f7d7e6", silk: ["#f7eff5", "#eab9d0", "#c9588b", "#3b407c"] },
    headline: "Your shop, open 24 hours — online.",
    intro:
      "Put your products online with photos and prices. Customers browse from home, ask on WhatsApp, and walk in ready to buy.",
    features: [
      { id: "products", title: "Catalogue with prices", text: "Your products with photos, prices and sizes — browse anytime.", icon: Tag },
      { id: "products", title: "Ask and order on WhatsApp", text: "One tap sends the product straight to your WhatsApp.", icon: MessageCircle },
      { id: "products", title: "Reserve in store", text: "Customers hold an item and pick it up. No lost sales.", icon: Store },
      { id: "visit", title: "Store visits and video shopping", text: "Directions, timings and live video-call shopping.", icon: MapPin },
      { id: "categories", title: "Collections and offers", text: "Festive edits, new arrivals and sale banners.", icon: Sparkles },
    ],
    studioPoints: ["Product catalogue with prices", "Order on WhatsApp", "Reserve and pick up in store", "Offers and new arrivals"],
    automations: [
      {
        title: "New arrivals",
        trigger: "You add new stock",
        steps: ["It appears on your website", "An update to interested customers", "See who asked about it"],
      },
      {
        title: "Order updates",
        trigger: "Someone places an order",
        steps: ["Instant confirmation", "Packed and out-for-delivery updates", "A thank-you and review request"],
      },
      {
        title: "Festive sale",
        trigger: "Diwali, Eid or wedding season",
        steps: ["Sale banner goes live", "A message to past customers", "Coupon codes tracked"],
      },
    ],
    outcomes: [
      { title: "Sales after closing time", text: "Customers browse and order even at night." },
      { title: "Fewer “what's the price?” calls", text: "Prices and sizes are right there." },
      { title: "More walk-ins", text: "People arrive knowing exactly what they want." },
    ],
    plan: "growth",
    timeline: "Live in about 10 days",
    faqs: [
      { q: "I have hundreds of products. Is that okay?", a: "Yes. We import your products from a spreadsheet and give you an easy way to add new ones." },
      {
        q: "Do I need online payments and delivery?",
        a: "Not necessarily. Many shops start with WhatsApp orders and store pick-up, then add payments and delivery later.",
      },
      { q: "Will it work for my kind of shop?", a: "Clothing, electronics, sweets, hardware, gifts, pharmacy — if you sell it, we can showcase it." },
    ],
    notification: { title: "Item reserved", meta: "Tussar silk saree · Pick-up today", icon: Package },
  },
  {
    ...meta("business"),
    kind: "Business",
    word: "business",
    icon: LayoutDashboard,
    tagline: "Orders, stock, invoices and dues in one dashboard",
    alsoFor: "distributors, wholesalers, manufacturers, CA firms, real estate and service companies",
    demo: { name: "Shree Traders", area: "Upper Bazar" },
    theme: { tint: "#e2e8f2", deep: "#14213d", onDeep: "#e8eef8", silk: ["#eef2f8", "#c7d5ea", "#7d9ccb", "#33507e"] },
    headline: "Run your whole business from one screen.",
    intro:
      "Orders, stock, invoices and customer dues — in a simple app built around how you already work, with WhatsApp reminders that collect payments for you.",
    features: [
      { id: "home", title: "Today at a glance", text: "Sales, orders and alerts the moment you open it.", icon: ChartColumn },
      { id: "orders", title: "Orders and GST invoices", text: "Create invoices in seconds and send them on WhatsApp.", icon: Receipt },
      { id: "stock", title: "Low-stock alerts", text: "Know what's running out before your customers do.", icon: Package },
      { id: "dues", title: "Customer dues (khata)", text: "See who owes what — and send a polite reminder in one tap.", icon: Wallet },
      { id: "reports", title: "Reports for your CA", text: "A monthly GST summary, ready to download.", icon: FileText },
    ],
    studioPoints: ["Sales and orders dashboard", "GST invoices on WhatsApp", "Low-stock alerts", "Dues with one-tap reminders"],
    automations: [
      {
        title: "Payment reminders",
        trigger: "A bill is seven days overdue",
        steps: ["A polite WhatsApp reminder with a UPI link", "A second nudge after three days", "You're alerted if it's still unpaid"],
      },
      {
        title: "Reorder alerts",
        trigger: "Stock falls below your limit",
        steps: ["An alert on your phone", "A purchase order drafted for you", "Sent to your supplier in one tap"],
      },
      {
        title: "Daily summary",
        trigger: "Every evening at 9 PM",
        steps: ["Today's sales and collections", "Pending orders for tomorrow", "Sent to the owners on WhatsApp"],
      },
    ],
    outcomes: [
      { title: "Faster payments", text: "Reminders collect dues without awkward calls." },
      { title: "No more stock-outs", text: "Alerts arrive before you run out." },
      { title: "Peace of mind", text: "Your whole business, on your phone." },
    ],
    plan: "automate",
    timeline: "3–6 weeks",
    faqs: [
      {
        q: "We already use Tally and Excel. Will this replace them?",
        a: "It doesn't have to. We import from Excel and keep your accountant's Tally workflow — the app simply makes daily work faster.",
      },
      { q: "Is our business data safe?", a: "Your data is stored securely with daily backups, and only people you approve can log in." },
      { q: "Can we also get a company website?", a: "Yes. Many businesses start with a professional website and add the app when they're ready." },
    ],
    notification: { title: "Payment received", meta: "Gupta Stores · ₹12,400 via UPI", icon: Wallet },
  },
];

export const industryBySlug = (slug: string | undefined) => industries.find((i) => i.slug === slug);

export const curtainFor = (i: Industry): CurtainSpec => ({
  color: i.theme.deep,
  ink: i.theme.onDeep,
  eyebrow: `Exhibit ${i.no}`,
  title: i.name,
});

/** The default silk palette — ivory, peach, clay and a whisper of plum. */
export const baseSilk: [string, string, string, string] = ["#fbf3e8", "#f5c79d", "#e07a52", "#8a5470"];
