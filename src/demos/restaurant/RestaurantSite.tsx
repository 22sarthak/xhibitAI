import "@fontsource/dm-serif-display/400.css";
import "@fontsource/dm-serif-display/400-italic.css";
import "@fontsource-variable/dm-sans";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState, type CSSProperties } from "react";
import { DemoImg, Sheet, Stars, SuccessTick, Toast, realSiteNote, useToast, type DemoProps } from "../kit";
import { useScreen } from "../../components/device/DeviceScreen";
import { cn, inr } from "../../lib/utils";

/* ── Kesar Kitchen · North Indian & Mughlai ─────────────────────────────── */

const C = {
  cream: "#fff8ef",
  paper: "#f8ecdc",
  ink: "#2b1613",
  maroon: "#7a2420",
  deep: "#4e1512",
  saffron: "#e9a23b",
  veg: "#1b8a3a",
  nonveg: "#b3261e",
};
const serif: CSSProperties = { fontFamily: '"DM Serif Display", Georgia, serif', fontWeight: 400 };
const theme: CSSProperties = { fontFamily: '"DM Sans Variable", system-ui, sans-serif', color: C.ink };
const img = (n: string) => `/demos/restaurants/${n}.webp`;

type Item = { name: string; desc: string; price: number; veg: boolean; img?: string; tag?: string };

const MENU: Record<string, Item[]> = {
  Biryani: [
    { name: "Hyderabadi Dum Biryani", desc: "Chicken, saffron rice, sealed and slow-cooked", price: 249, veg: false, img: "biryani", tag: "Today's special" },
    { name: "Veg Dum Biryani", desc: "Seasonal vegetables, fried onions, mint", price: 199, veg: true },
    { name: "Mutton Biryani", desc: "Tender mutton, whole spices, kewra", price: 349, veg: false },
  ],
  Starters: [
    { name: "Paneer Tikka", desc: "Char-grilled cottage cheese, mint chutney", price: 249, veg: true, img: "paneer-tikka" },
    { name: "Chicken Seekh Kebab", desc: "Minced chicken, smoked in the tandoor", price: 299, veg: false, img: "kebab" },
    { name: "Hara Bhara Kebab", desc: "Spinach and green-pea patties", price: 199, veg: true },
  ],
  Mains: [
    { name: "Butter Chicken", desc: "Our signature makhani gravy", price: 329, veg: false, img: "butter-chicken", tag: "Bestseller" },
    { name: "Dal Makhani", desc: "Black lentils, simmered overnight", price: 229, veg: true, img: "dal-makhani" },
    { name: "Kesar Veg Thali", desc: "2 sabzi, dal, rice, 3 rotis, raita and a sweet", price: 199, veg: true, img: "thali" },
  ],
  Breads: [
    { name: "Butter Naan", desc: "Fresh from the tandoor", price: 49, veg: true, img: "naan" },
    { name: "Garlic Naan", desc: "Roasted garlic and coriander", price: 69, veg: true },
    { name: "Lachha Paratha", desc: "Flaky, layered, buttery", price: 59, veg: true },
  ],
  Desserts: [
    { name: "Malai Chamcham", desc: "Two pieces, served chilled", price: 99, veg: true, img: "dessert" },
    { name: "Kesar Phirni", desc: "Saffron rice pudding in a clay pot", price: 109, veg: true },
    { name: "Gulab Jamun", desc: "Warm, with rabri on request", price: 89, veg: true },
  ],
};

const DAYS = ["Today", "Tomorrow", "Saturday"];
const TIMES = ["7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM"];

function VegMark({ veg }: { veg: boolean }) {
  const c = veg ? C.veg : C.nonveg;
  return (
    <span
      title={veg ? "Vegetarian" : "Non-vegetarian"}
      className="grid size-[15px] shrink-0 place-items-center rounded-[3px] border-[1.5px]"
      style={{ borderColor: c }}
    >
      {veg ? (
        <span className="size-[7px] rounded-full" style={{ background: c }} />
      ) : (
        <span className="h-0 w-0 border-x-[4.5px] border-b-[7px] border-x-transparent" style={{ borderBottomColor: c }} />
      )}
    </span>
  );
}

export default function RestaurantSite({ name, area }: DemoProps) {
  const { mode, scrollToSection } = useScreen();
  const desktop = mode === "desktop";
  const [tab, setTab] = useState("Biryani");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [day, setDay] = useState(0);
  const [time, setTime] = useState("8:30 PM");
  const [guests, setGuests] = useState(4);
  const [booked, setBooked] = useState(false);
  const [toast, showToast] = useToast(3400);

  const items = useMemo(() => Object.values(MENU).flat(), []);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = Object.entries(cart).reduce((sum, [n, q]) => sum + (items.find((i) => i.name === n)?.price ?? 0) * q, 0);
  const add = (n: string, d: number) =>
    setCart((c) => {
      const next = { ...c, [n]: Math.max(0, (c[n] ?? 0) + d) };
      if (!next[n]) delete next[n];
      return next;
    });

  const orderOnWhatsApp = () =>
    showToast(
      count
        ? realSiteNote(`this opens WhatsApp with your order ready to send — ${count} item${count > 1 ? "s" : ""}, ₹${inr(total)}.`)
        : realSiteNote("this opens a WhatsApp chat with the restaurant."),
    );

  const initial = name.trim()[0]?.toUpperCase() ?? "K";

  return (
    <div className="relative min-h-full" style={{ ...theme, background: C.cream }}>
      {/* Header */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between px-5 py-3 @3xl:px-12 @3xl:py-4"
        style={{ background: C.deep, color: "#fbefe2" }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full text-[20px]" style={{ ...serif, background: C.saffron, color: C.deep }}>
            {initial}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[20px] leading-none" style={serif}>
              {name}
            </p>
            <p className="mt-1 text-[10.5px] uppercase tracking-[0.16em] opacity-70">{area}, Ranchi</p>
          </div>
        </div>
        <nav className="hidden items-center gap-9 text-[15px] @3xl:flex" aria-label="Demo menu">
          {[
            ["menu", "Menu"],
            ["booking", "Book a table"],
            ["gallery", "Gallery"],
            ["visit", "Visit us"],
          ].map(([id, label]) => (
            <button key={id} type="button" onClick={() => scrollToSection(id)} className="opacity-85 transition-opacity hover:opacity-100">
              {label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          onClick={orderOnWhatsApp}
          className="rounded-full px-4 py-2 text-[14px] font-semibold"
          style={{ background: C.saffron, color: C.deep }}
        >
          Order
        </button>
      </header>

      {/* Hero */}
      <section data-section="top" className="relative h-[500px] overflow-hidden @3xl:h-[600px]">
        <DemoImg src={img("hero")} eager alt="Biryani being served from a handi" className="scale-105" />
        <div className="absolute inset-0 bg-linear-to-t from-[#1d0c0a] via-[#1d0c0a]/45 to-[#1d0c0a]/5 @3xl:bg-linear-to-r @3xl:from-[#1d0c0a]/90 @3xl:via-[#1d0c0a]/45 @3xl:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 text-[#fbefe2] @3xl:inset-y-0 @3xl:flex @3xl:max-w-[660px] @3xl:flex-col @3xl:justify-center @3xl:p-14">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[12.5px] backdrop-blur-md">
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#4ade80] opacity-70" />
              <span className="relative size-2 rounded-full bg-[#4ade80]" />
            </span>
            Open now · till 11 PM
          </span>
          <h1 className="mt-4 text-[42px] leading-[1.02] @3xl:text-[68px]" style={serif}>
            Slow-cooked biryani. <em className="not-italic" style={{ color: C.saffron }}>Fresh</em> from the tandoor.
          </h1>
          <p className="mt-4 flex items-center gap-2 text-[14px] opacity-90">
            <Stars value={5} size={13} />
            <span>
              <b className="font-semibold">4.6</b> · 1,240 Google reviews
            </span>
          </p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => scrollToSection("booking")}
              className="flex-1 whitespace-nowrap rounded-full px-4 py-3.5 text-center text-[15px] font-semibold @3xl:flex-none @3xl:px-7"
              style={{ background: C.saffron, color: C.deep }}
            >
              Book a table
            </button>
            <button
              type="button"
              onClick={orderOnWhatsApp}
              className="flex-1 whitespace-nowrap rounded-full bg-white/12 px-3 py-3.5 text-[14.5px] font-semibold ring-1 ring-white/35 backdrop-blur-md @3xl:flex-none @3xl:px-7 @3xl:text-[15px]"
            >
              Order on WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* Quick facts */}
      <div tabIndex={0} role="region" aria-label="Quick facts" className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-5 @3xl:justify-center @3xl:gap-3 @3xl:py-7">
        {["Dine-in", "Takeaway", "Home delivery", "Pure-veg kitchen", "Free parking", "Family seating"].map((f) => (
          <span key={f} className="shrink-0 rounded-full px-3.5 py-2 text-[13px] font-medium" style={{ background: C.paper }}>
            {f}
          </span>
        ))}
      </div>

      {/* Today's special */}
      <section className="px-5 @3xl:px-12">
        <div className="overflow-hidden rounded-[26px] @3xl:grid @3xl:grid-cols-2" style={{ background: C.maroon, color: "#fbefe2" }}>
          <div className="relative h-[220px] @3xl:h-auto">
            <DemoImg src={img("biryani")} alt="Hyderabadi dum biryani" />
            <span className="absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em]" style={{ background: C.saffron, color: C.deep }}>
              Today's special
            </span>
          </div>
          <div className="p-6 @3xl:p-12">
            <p className="text-[30px] leading-tight @3xl:text-[44px]" style={serif}>
              Hyderabadi Dum Biryani
            </p>
            <p className="mt-2 text-[14.5px] opacity-80 @3xl:text-[16px]">Sealed with dough and slow-cooked on dum for two hours. Served with salan and raita.</p>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-[26px]" style={serif}>
                ₹249
              </span>
              <button
                type="button"
                onClick={() => add("Hyderabadi Dum Biryani", 1)}
                className="rounded-full px-5 py-2.5 text-[14px] font-semibold"
                style={{ background: C.saffron, color: C.deep }}
              >
                {cart["Hyderabadi Dum Biryani"] ? `Added · ${cart["Hyderabadi Dum Biryani"]}` : "Add to order"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section data-section="menu" className="px-5 pb-6 pt-12 @3xl:px-12 @3xl:pt-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: C.maroon }}>
              Our menu
            </p>
            <h2 className="mt-1 text-[34px] leading-none @3xl:text-[48px]" style={serif}>
              Made fresh, every day
            </h2>
          </div>
          <span className="hidden items-center gap-4 text-[13px] @3xl:flex">
            <span className="flex items-center gap-1.5">
              <VegMark veg /> Veg
            </span>
            <span className="flex items-center gap-1.5">
              <VegMark veg={false} /> Non-veg
            </span>
          </span>
        </div>
        <div role="tablist" aria-label="Menu categories" className="no-scrollbar -mx-5 mt-5 flex gap-2 overflow-x-auto px-5 @3xl:mx-0 @3xl:px-0">
          {Object.keys(MENU).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              type="button"
              onClick={() => setTab(t)}
              className="relative shrink-0 rounded-full px-4 py-2 text-[14px] font-semibold transition-colors"
              style={{ color: tab === t ? "#fbefe2" : C.ink }}
            >
              {tab === t && (
                <motion.span layoutId={`menu-pill-${mode}`} className="absolute inset-0 rounded-full" style={{ background: C.maroon }} transition={{ type: "spring", stiffness: 420, damping: 34 }} />
              )}
              <span className="relative">{t}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.ul
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28 }}
            className="mt-5 grid gap-3 @3xl:grid-cols-3 @3xl:gap-5"
          >
            {MENU[tab].map((it) => {
              const q = cart[it.name] ?? 0;
              return (
                <li key={it.name} className="flex gap-4 rounded-[22px] bg-white p-3 shadow-[0_1px_2px_rgba(60,20,10,.05),0_8px_24px_-12px_rgba(60,20,10,.15)] @3xl:flex-col @3xl:p-4">
                  {it.img ? (
                    <div className="size-[92px] shrink-0 overflow-hidden rounded-[16px] bg-[#f3e2cc] @3xl:h-[170px] @3xl:w-full">
                      <DemoImg src={img(it.img)} alt={it.name} />
                    </div>
                  ) : (
                    <div className="grid size-[92px] shrink-0 place-items-center rounded-[16px] @3xl:hidden" style={{ background: C.paper }}>
                      <span className="text-[30px]" style={{ ...serif, color: C.maroon }}>
                        {it.name[0]}
                      </span>
                    </div>
                  )}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-center gap-2">
                      <VegMark veg={it.veg} />
                      {it.tag && (
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em]" style={{ background: "#fbe7c4", color: C.maroon }}>
                          {it.tag}
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-[16px] font-semibold leading-snug">{it.name}</p>
                    <p className="mt-0.5 line-clamp-2 text-[12.5px] leading-snug text-black/55">{it.desc}</p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <span className="text-[15.5px] font-semibold">₹{it.price}</span>
                      {q === 0 ? (
                        <button
                          type="button"
                          onClick={() => add(it.name, 1)}
                          className="rounded-full px-4 py-1.5 text-[13px] font-bold ring-1"
                          style={{ color: C.maroon, background: "#fff4e3", ["--tw-ring-color" as string]: "#e8c9a0" }}
                          aria-label={`Add ${it.name}`}
                        >
                          ADD +
                        </button>
                      ) : (
                        <span className="flex items-center gap-3 rounded-full px-1.5 py-1 text-[14px] font-bold text-white" style={{ background: C.maroon }}>
                          <button type="button" aria-label={`Remove one ${it.name}`} onClick={() => add(it.name, -1)} className="grid size-6 place-items-center rounded-full bg-white/15">
                            −
                          </button>
                          <span className="tabular min-w-3 text-center">{q}</span>
                          <button type="button" aria-label={`Add one more ${it.name}`} onClick={() => add(it.name, 1)} className="grid size-6 place-items-center rounded-full bg-white/15">
                            +
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </motion.ul>
        </AnimatePresence>
      </section>

      {/* Book a table */}
      <section data-section="booking" className="mt-8 px-5 py-12 @3xl:mt-14 @3xl:px-12 @3xl:py-20" style={{ background: C.deep, color: "#fbefe2" }}>
        <div className="@3xl:grid @3xl:grid-cols-2 @3xl:items-center @3xl:gap-16">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: C.saffron }}>
              Reserve
            </p>
            <h2 className="mt-1 text-[34px] leading-[1.05] @3xl:text-[52px]" style={serif}>
              Book a table in two taps
            </h2>
            <p className="mt-3 max-w-[40ch] text-[14.5px] opacity-75">Birthdays, family dinners or a quiet date — we'll keep your table ready.</p>
          </div>
          <div className="mt-7 rounded-[24px] bg-white/[0.07] p-5 ring-1 ring-white/10 @3xl:mt-0 @3xl:p-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] opacity-60">Day</p>
            <div className="mt-2 flex gap-2">
              {DAYS.map((d, i) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDay(i)}
                  className={cn("flex-1 rounded-2xl py-2.5 text-[14px] font-semibold transition-colors", day === i ? "" : "bg-white/[0.06]")}
                  style={day === i ? { background: C.saffron, color: C.deep } : undefined}
                >
                  {d}
                </button>
              ))}
            </div>
            <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.14em] opacity-60">Time</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {TIMES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTime(t)}
                  className={cn("rounded-2xl py-2.5 text-[13.5px] font-semibold transition-colors", time === t ? "" : "bg-white/[0.06]")}
                  style={time === t ? { background: C.saffron, color: C.deep } : undefined}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] opacity-60">Guests</p>
                <p className="mt-1 text-[15px]">{guests} people</p>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" aria-label="Fewer guests" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="grid size-10 place-items-center rounded-full bg-white/10 text-[20px]">
                  −
                </button>
                <span className="tabular w-6 text-center text-[20px]" style={serif}>
                  {guests}
                </span>
                <button type="button" aria-label="More guests" onClick={() => setGuests((g) => Math.min(20, g + 1))} className="grid size-10 place-items-center rounded-full bg-white/10 text-[20px]">
                  +
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBooked(true)}
              className="mt-6 w-full rounded-full py-4 text-[15px] font-bold"
              style={{ background: C.saffron, color: C.deep }}
            >
              Request booking
            </button>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section data-section="gallery" className="py-12 @3xl:py-20">
        <div className="flex items-end justify-between px-5 @3xl:px-12">
          <h2 className="text-[32px] leading-none @3xl:text-[46px]" style={serif}>
            The Kesar experience
          </h2>
          <span className="text-[13px] font-semibold" style={{ color: C.maroon }}>
            @{name.toLowerCase().replace(/[^a-z0-9]/g, "")}
          </span>
        </div>
        <div tabIndex={0} role="region" aria-label="Photo gallery" className="no-scrollbar mt-6 flex snap-x gap-3 overflow-x-auto px-5 @3xl:grid @3xl:grid-cols-4 @3xl:px-12">
          {[
            ["interior", "Our dining room"],
            ["festive", "Festive specials"],
            ["thali", "The Kesar thali"],
            ["ambience", "Family dinners"],
          ].map(([src, caption], i) => (
            <figure key={src} className={cn("relative h-[260px] w-[230px] shrink-0 snap-start overflow-hidden rounded-[22px] @3xl:w-auto", i % 2 && "@3xl:mt-10")}>
              <DemoImg src={img(src)} alt={caption} />
              <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-4 text-[13px] font-medium text-white">{caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section data-section="reviews" className="px-5 pb-12 @3xl:px-12 @3xl:pb-20">
        <div className="rounded-[26px] p-6 @3xl:grid @3xl:grid-cols-[280px_1fr] @3xl:gap-10 @3xl:p-10" style={{ background: C.paper }}>
          <div>
            <p className="text-[64px] leading-none" style={serif}>
              4.6
            </p>
            <Stars value={5} size={16} />
            <p className="mt-2 text-[13px] text-black/60">1,240 reviews on Google</p>
          </div>
          <div className="mt-6 grid gap-3 @3xl:mt-0 @3xl:grid-cols-3">
            {[
              ["Priya S.", "The best dum biryani in Ranchi. They even remembered our order from last time!"],
              ["Rahul K.", "Booked a table for eight in under a minute. Butter chicken was perfect."],
              ["Ananya M.", "Lovely for family dinners — clean, quick, and the phirni is a must."],
            ].map(([who, text]) => (
              <figure key={who} className="rounded-[20px] bg-white p-4">
                <Stars value={5} size={12} />
                <blockquote className="mt-2 text-[14px] leading-relaxed">“{text}”</blockquote>
                <figcaption className="mt-3 text-[12.5px] font-semibold text-black/55">{who}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Visit */}
      <section data-section="visit" className="px-5 pb-16 @3xl:grid @3xl:grid-cols-2 @3xl:gap-10 @3xl:px-12 @3xl:pb-24">
        <div className="relative h-[220px] overflow-hidden rounded-[26px] @3xl:h-auto" style={{ background: "#f0e2cd" }} aria-hidden="true">
          <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
            <rect width="400" height="240" fill="#efe0c9" />
            <path d="M-10 170 C 80 150, 140 190, 230 160 S 360 120, 420 140" stroke="#cfe0e8" strokeWidth="18" fill="none" />
            <path d="M0 60 H400 M0 120 H400 M90 0 V240 M210 0 V240 M320 0 V240" stroke="#fff" strokeWidth="9" />
            <path d="M0 200 L400 30" stroke="#fff" strokeWidth="13" />
            <rect x="230" y="70" width="70" height="38" rx="6" fill="#d9e7c9" />
            <rect x="20" y="130" width="54" height="34" rx="6" fill="#d9e7c9" />
          </svg>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
            <span className="absolute left-1/2 top-full size-5 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full" style={{ background: `${C.maroon}55` }} />
            <svg width="38" height="48" viewBox="0 0 38 48" className="relative drop-shadow-lg">
              <path d="M19 47s17-15.6 17-28A17 17 0 0 0 2 19c0 12.4 17 28 17 28z" fill={C.maroon} />
              <circle cx="19" cy="19" r="7" fill={C.saffron} />
            </svg>
          </div>
        </div>
        <div className="mt-6 @3xl:mt-0">
          <h2 className="text-[32px] leading-none @3xl:text-[46px]" style={serif}>
            Visit us
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-black/70">
            Main Road, {area}, Ranchi, Jharkhand
            <br />
            Free parking for 20 cars
          </p>
          <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[14px]">
            <dt className="text-black/55">Mon – Fri</dt>
            <dd className="font-medium">11:30 AM – 11:00 PM</dd>
            <dt className="text-black/55">Sat – Sun</dt>
            <dd className="font-medium">11:00 AM – 11:30 PM</dd>
          </dl>
          <div className="mt-6 flex gap-3">
            <button type="button" onClick={() => showToast(realSiteNote("this opens Google Maps with directions."))} className="flex-1 rounded-full py-3 text-[14.5px] font-semibold text-white @3xl:flex-none @3xl:px-7" style={{ background: C.maroon }}>
              Get directions
            </button>
            <button type="button" onClick={() => showToast(realSiteNote("this calls the restaurant in one tap."))} className="flex-1 rounded-full py-3 text-[14.5px] font-semibold ring-1 @3xl:flex-none @3xl:px-7" style={{ ["--tw-ring-color" as string]: `${C.maroon}55`, color: C.maroon }}>
              Call now
            </button>
          </div>
        </div>
      </section>

      <footer className="px-5 pb-28 pt-10 text-center @3xl:pb-12" style={{ background: C.paper }}>
        <p className="text-[26px]" style={serif}>
          {name}
        </p>
        <p className="mt-2 text-[12.5px] text-black/50">© 2026 {name} · Website by Xhibit AI</p>
      </footer>

      {/* Sticky order bar */}
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            className={cn("sticky bottom-0 z-30 px-4 pb-6 pt-2", desktop && "pointer-events-none flex justify-end px-10 pb-8")}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <button
              type="button"
              onClick={orderOnWhatsApp}
              className="pointer-events-auto flex w-full items-center justify-between rounded-full py-2 pl-5 pr-2 text-left text-white shadow-[0_18px_40px_-12px_rgba(40,10,5,.55)] @3xl:w-[420px]"
              style={{ background: "#1f9d55" }}
            >
              <span className="text-[14px] font-semibold">
                {count} item{count > 1 ? "s" : ""} · ₹{inr(total)}
              </span>
              <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13.5px] font-bold text-[#145c33]">
                Order on WhatsApp
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Sheet open={booked} onClose={() => setBooked(false)} title="Booking confirmed" style={theme}>
        <div className="flex flex-col items-center pb-2 pt-4 text-center">
          <SuccessTick color={C.maroon} />
          <p className="mt-4 text-[28px] leading-tight" style={serif}>
            Table requested!
          </p>
          <p className="mt-2 text-[15px] text-black/65">
            {guests} guests · {DAYS[day]}, {time}
          </p>
          <p className="mt-5 rounded-2xl px-4 py-3 text-[13px] leading-relaxed" style={{ background: C.paper }}>
            {realSiteNote(`this booking reaches ${name} on WhatsApp instantly, and the guest gets a confirmation and a reminder.`)}
          </p>
          <button type="button" onClick={() => setBooked(false)} className="mt-6 w-full rounded-full py-3.5 text-[15px] font-bold text-white" style={{ background: C.maroon }}>
            Done
          </button>
        </div>
      </Sheet>
      <Toast message={toast} />
    </div>
  );
}
