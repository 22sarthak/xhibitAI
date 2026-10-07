import "@fontsource-variable/cormorant-garamond";
import "@fontsource-variable/cormorant-garamond/wght-italic.css";
import "@fontsource-variable/jost";
import { AnimatePresence, motion } from "motion/react";
import { useState, type CSSProperties } from "react";
import { useScreen } from "../../components/device/DeviceScreen";
import { cn } from "../../lib/utils";
import { Avatar, DemoImg, Sheet, Stars, SuccessTick, Toast, realSiteNote, useToast, type DemoProps } from "../kit";

/* ── Aura Salon & Spa · hair, skin, nails, spa and bridal ───────────────── */

const C = { blush: "#f7ece8", rose: "#f1d9d3", mauve: "#7d3c55", deep: "#4f2335", ink: "#2b1d22", gold: "#b98f5e", line: "rgba(43,29,34,.1)" };
const serif: CSSProperties = { fontFamily: '"Cormorant Garamond Variable", Georgia, serif' };
const font: CSSProperties = { fontFamily: '"Jost Variable", system-ui, sans-serif', color: C.ink };
const img = (n: string) => `/demos/salons/${n}.webp`;

type Service = { name: string; mins: number; price: number; from?: boolean };
const MENU: Record<string, Service[]> = {
  Hair: [
    { name: "Haircut & styling", mins: 45, price: 350 },
    { name: "Hair spa ritual", mins: 60, price: 1200 },
    { name: "Global colour", mins: 120, price: 2499, from: true },
    { name: "Keratin smoothening", mins: 180, price: 4999, from: true },
  ],
  Skin: [
    { name: "Classic clean-up", mins: 40, price: 699 },
    { name: "Hydra facial", mins: 60, price: 2499 },
    { name: "Gold facial", mins: 75, price: 1999 },
    { name: "De-tan treatment", mins: 30, price: 599 },
  ],
  Nails: [
    { name: "Gel polish", mins: 45, price: 799 },
    { name: "Nail art (both hands)", mins: 60, price: 1199 },
    { name: "Spa manicure", mins: 40, price: 699 },
    { name: "Spa pedicure", mins: 50, price: 899 },
  ],
  Spa: [
    { name: "Swedish massage", mins: 60, price: 2199 },
    { name: "Head & shoulder massage", mins: 30, price: 599 },
    { name: "Body polish", mins: 75, price: 2999 },
  ],
};

const STYLISTS = [
  { name: "Priya Sharma", role: "Senior stylist · 9 yrs", c: ["#7d3c55", "#c97b97"] },
  { name: "Rehan Ali", role: "Hair colour expert", c: ["#5b4636", "#b98f5e"] },
  { name: "Sana Khan", role: "Bridal makeup artist", c: ["#8c506b", "#e0a3b9"] },
  { name: "Any available", role: "Earliest slot", c: ["#9b8a90", "#cbbcc1"] },
];

const DAYS = ["Today", "Tomorrow", "Sat", "Sun"];
const TIMES = ["11:00 AM", "12:30 PM", "2:00 PM", "4:30 PM", "6:00 PM", "7:30 PM"];

const fmt = (m: number) => (m >= 60 ? `${Math.floor(m / 60)} hr${m % 60 ? ` ${m % 60} min` : ""}` : `${m} min`);

export default function SalonSite({ name, area }: DemoProps) {
  const { mode, scrollToSection } = useScreen();
  const desktop = mode === "desktop";
  const [tab, setTab] = useState("Hair");
  const [picked, setPicked] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [stylist, setStylist] = useState(0);
  const [day, setDay] = useState(0);
  const [time, setTime] = useState("6:00 PM");
  const [done, setDone] = useState(false);
  const [toast, showToast] = useToast(3400);

  const all = Object.values(MENU).flat();
  const chosen = all.filter((s) => picked.includes(s.name));
  const total = chosen.reduce((a, s) => a + s.price, 0);
  const mins = chosen.reduce((a, s) => a + s.mins, 0);
  const toggle = (n: string) => setPicked((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));
  const openBooking = () => {
    if (!picked.length) setPicked(["Haircut & styling"]);
    setDone(false);
    setOpen(true);
  };

  return (
    <div className="relative min-h-full" style={{ ...font, background: C.blush }}>
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 @3xl:px-12" style={{ background: "rgba(247,236,232,.94)", backdropFilter: "blur(10px)" }}>
        <div className="min-w-0">
          <p className="truncate text-[25px] font-semibold uppercase leading-none tracking-[0.18em]" style={{ ...serif, color: C.deep }}>
            {name.replace(/\b(salon|spa|and|&)\b/gi, "").trim() || name}
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-black/45">Salon & Spa · {area}</p>
        </div>
        <nav className="hidden items-center gap-9 text-[14px] uppercase tracking-[0.12em] text-black/65 @3xl:flex" aria-label="Demo menu">
          {[
            ["services", "Services"],
            ["bridal", "Bridal"],
            ["lookbook", "Lookbook"],
            ["team", "Team"],
          ].map(([id, l]) => (
            <button key={id} type="button" onClick={() => scrollToSection(id)} className="hover:text-black">
              {l}
            </button>
          ))}
        </nav>
        <button type="button" onClick={openBooking} className="rounded-full px-5 py-2.5 text-[13px] font-medium uppercase tracking-[0.1em] text-white" style={{ background: C.mauve }}>
          Book
        </button>
      </header>

      {/* Hero */}
      <section data-section="top" className="px-4 pb-4 @3xl:px-12">
        <div className="relative h-[520px] overflow-hidden rounded-[30px] @3xl:h-[580px]">
          <DemoImg src={img("hero")} alt="Airy salon with styling chairs and mirrors" eager />
          <div className="absolute inset-0 bg-linear-to-t from-[#2b1d22]/85 via-[#2b1d22]/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white @3xl:p-12">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1.5 text-[12px] tracking-[0.04em] backdrop-blur">Festive Glow package · ₹1,999</span>
            <h1 className="mt-4 text-[46px] font-medium italic leading-[0.98] @3xl:max-w-[640px] @3xl:text-[78px]" style={serif}>
              Look like your best day, every day.
            </h1>
            <div className="mt-6 flex items-center gap-3">
              <button type="button" onClick={openBooking} className="whitespace-nowrap rounded-full bg-white px-6 py-3.5 text-[14px] font-medium uppercase tracking-[0.1em]" style={{ color: C.deep }}>
                Book a visit
              </button>
              <span className="flex items-center gap-1.5 text-[13px] text-white/85">
                <Stars value={5} size={12} color="#f2c38b" /> 4.9
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section data-section="services" className="px-5 pt-10 @3xl:px-12 @3xl:pt-16">
        <div className="@3xl:flex @3xl:items-end @3xl:justify-between">
          <h2 className="text-[40px] font-medium leading-none @3xl:text-[56px]" style={serif}>
            Our <em>services</em>
          </h2>
          <p className="mt-2 text-[14px] text-black/55">Tap to add · prices include taxes</p>
        </div>
        <div className="no-scrollbar -mx-5 mt-5 flex gap-1 overflow-x-auto px-5 @3xl:mx-0 @3xl:px-0" role="tablist" aria-label="Service categories">
          {Object.keys(MENU).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn("relative shrink-0 px-4 py-2 text-[14px] uppercase tracking-[0.12em] transition-colors", tab === t ? "" : "text-black/45")}
            >
              {t}
              {tab === t && <motion.span layoutId={`salon-tab-${mode}`} className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full" style={{ background: C.mauve }} />}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.ul key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="mt-3 divide-y @3xl:grid @3xl:grid-cols-2 @3xl:gap-x-12 @3xl:divide-y-0" style={{ borderColor: C.line }}>
            {MENU[tab].map((s) => {
              const on = picked.includes(s.name);
              return (
                <li key={s.name} className="@3xl:border-b" style={{ borderColor: C.line }}>
                  <button type="button" onClick={() => toggle(s.name)} aria-pressed={on} className="flex w-full items-center gap-4 py-4 text-left">
                    <span className="min-w-0 flex-1">
                      <span className="block text-[17px] font-medium">{s.name}</span>
                      <span className="text-[13px] text-black/50">{fmt(s.mins)}</span>
                    </span>
                    <span className="text-[16px]">
                      {s.from && <span className="text-[12px] text-black/45">from </span>}₹{s.price.toLocaleString("en-IN")}
                    </span>
                    <span
                      className={cn("grid size-8 shrink-0 place-items-center rounded-full text-[18px] transition-colors", on ? "text-white" : "ring-1")}
                      style={on ? { background: C.mauve } : { ["--tw-ring-color" as string]: C.line, color: C.mauve }}
                    >
                      {on ? "✓" : "+"}
                    </span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        </AnimatePresence>
      </section>

      {/* Bridal */}
      <section data-section="bridal" className="mt-12 @3xl:mt-20 @3xl:grid @3xl:grid-cols-2" style={{ background: C.deep }}>
        <div className="relative h-[420px] @3xl:h-auto">
          <DemoImg src={img("bridal")} alt="Bride in red and gold bridal look" />
        </div>
        <div className="p-6 text-white @3xl:p-14">
          <p className="text-[11px] uppercase tracking-[0.3em]" style={{ color: "#f2c38b" }}>
            Bridal studio
          </p>
          <h2 className="mt-3 text-[42px] font-medium italic leading-[1] @3xl:text-[60px]" style={serif}>
            Your wedding. Your look.
          </h2>
          <p className="mt-3 text-[14.5px] leading-relaxed text-white/70">HD, airbrush and traditional bridal looks — with hair, draping and a free trial session.</p>
          <ul className="mt-6 divide-y divide-white/10 border-y border-white/10">
            {[
              ["Engagement look", "₹7,999"],
              ["Bridal HD makeup", "₹14,999"],
              ["Bridal airbrush", "₹21,999"],
            ].map(([n, p]) => (
              <li key={n} className="flex justify-between py-3.5 text-[15px]">
                <span>{n}</span>
                <span style={{ color: "#f2c38b" }}>{p}</span>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => showToast(realSiteNote("brides book a free trial and pay an advance online."))} className="mt-7 w-full rounded-full bg-white py-3.5 text-[13.5px] font-medium uppercase tracking-[0.12em] @3xl:w-auto @3xl:px-8" style={{ color: C.deep }}>
            Book a free trial
          </button>
        </div>
      </section>

      {/* Lookbook */}
      <section data-section="lookbook" className="px-5 pt-12 @3xl:px-12 @3xl:pt-20">
        <div className="flex items-end justify-between">
          <h2 className="text-[40px] font-medium leading-none @3xl:text-[56px]" style={serif}>
            <em>Lookbook</em>
          </h2>
          <span className="text-[12.5px] uppercase tracking-[0.14em] text-black/45">From our Instagram</span>
        </div>
        <div className="mt-5 columns-2 gap-2.5 @3xl:columns-4 @3xl:gap-4">
          {[
            ["hair", "h-[200px]"],
            ["nails", "h-[150px]"],
            ["bridal-2", "h-[230px]"],
            ["makeup", "h-[160px]"],
            ["spa", "h-[170px]"],
            ["facial", "h-[200px]"],
            ["mens", "h-[160px]"],
            ["interior", "h-[150px]"],
          ].map(([src, h]) => (
            <div key={src} className={cn("mb-2.5 overflow-hidden rounded-[18px] @3xl:mb-4", h)}>
              <DemoImg src={img(src)} alt="" />
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section data-section="team" className="px-5 pt-10 @3xl:px-12 @3xl:pt-16">
        <h2 className="text-[34px] font-medium leading-none @3xl:text-[48px]" style={serif}>
          Meet the <em>artists</em>
        </h2>
        <div className="mt-5 grid grid-cols-3 gap-3 @3xl:max-w-[720px]">
          {STYLISTS.slice(0, 3).map((s) => (
            <div key={s.name} className="text-center">
              <Avatar name={s.name} from={s.c[0]} to={s.c[1]} size={desktop ? 96 : 76} className="mx-auto" />
              <p className="mt-2 text-[14.5px] font-medium">{s.name.split(" ")[0]}</p>
              <p className="text-[11.5px] text-black/50">{s.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Visit */}
      <section className="px-5 pb-32 pt-12 @3xl:px-12 @3xl:pb-16 @3xl:pt-20">
        <div className="rounded-[26px] p-6 @3xl:flex @3xl:items-center @3xl:justify-between @3xl:p-10" style={{ background: C.rose }}>
          <div>
            <p className="text-[30px] font-medium leading-tight @3xl:text-[40px]" style={serif}>
              Open all 7 days
            </p>
            <p className="mt-1 text-[14.5px] text-black/60">10 AM – 8:30 PM · Main Road, {area}, Ranchi</p>
          </div>
          <div className="mt-5 flex gap-2.5 @3xl:mt-0">
            <button type="button" onClick={() => showToast(realSiteNote("this opens Google Maps with directions."))} className="flex-1 rounded-full px-5 py-3 text-[13.5px] font-medium uppercase tracking-[0.08em] text-white" style={{ background: C.mauve }}>
              Directions
            </button>
            <button type="button" onClick={() => showToast(realSiteNote("this starts a WhatsApp chat with the salon."))} className="flex-1 rounded-full bg-white px-5 py-3 text-[13.5px] font-medium uppercase tracking-[0.08em]" style={{ color: C.deep }}>
              WhatsApp
            </button>
          </div>
        </div>
        <p className="mt-8 text-center text-[12px] text-black/45">© 2026 {name} · Website by Xhibit AI</p>
      </section>

      {/* Selection bar */}
      <AnimatePresence>
        {picked.length > 0 && !open && (
          <motion.div initial={{ y: 90 }} animate={{ y: 0 }} exit={{ y: 90 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className={cn("sticky bottom-0 z-30 px-4 pb-6 pt-2", desktop && "flex justify-end px-12 pb-8")}>
            <button type="button" onClick={openBooking} className="flex w-full items-center justify-between rounded-full py-2 pl-5 pr-2 text-left text-white shadow-[0_18px_40px_-14px_rgba(79,35,53,.7)] @3xl:w-[440px]" style={{ background: C.deep }}>
              <span className="text-[14px]">
                {picked.length} service{picked.length > 1 ? "s" : ""} · ₹{total.toLocaleString("en-IN")} · {fmt(mins)}
              </span>
              <span className="rounded-full bg-white px-4 py-2.5 text-[12.5px] font-medium uppercase tracking-[0.08em]" style={{ color: C.deep }}>
                Choose time
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Sheet open={open} onClose={() => setOpen(false)} title="Book your appointment" style={font}>
        <AnimatePresence mode="wait" initial={false}>
          {!done ? (
            <motion.div key="pick" exit={{ opacity: 0, x: -16 }}>
              <p className="pr-8 text-[30px] font-medium leading-none" style={serif}>
                Choose your <em>artist</em>
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {STYLISTS.map((s, i) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => setStylist(i)}
                    className="flex items-center gap-2.5 rounded-2xl p-2.5 text-left ring-1"
                    style={stylist === i ? { background: C.blush, ["--tw-ring-color" as string]: C.mauve } : { ["--tw-ring-color" as string]: C.line }}
                  >
                    <Avatar name={s.name} from={s.c[0]} to={s.c[1]} size={36} />
                    <span className="min-w-0">
                      <span className="block truncate text-[14px] font-medium">{s.name.split(" ")[0]}</span>
                      <span className="block truncate text-[11px] text-black/50">{s.role}</span>
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-5 text-[11px] uppercase tracking-[0.16em] text-black/45">Day</p>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {DAYS.map((d, i) => (
                  <button key={d} type="button" onClick={() => setDay(i)} className="rounded-xl py-2.5 text-[13.5px] ring-1" style={day === i ? { background: C.mauve, color: "#fff", ["--tw-ring-color" as string]: C.mauve } : { ["--tw-ring-color" as string]: C.line }}>
                    {d}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-black/45">Time</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {TIMES.map((t) => (
                  <button key={t} type="button" onClick={() => setTime(t)} className="rounded-xl py-2.5 text-[13.5px] ring-1" style={time === t ? { background: C.mauve, color: "#fff", ["--tw-ring-color" as string]: C.mauve } : { ["--tw-ring-color" as string]: C.line }}>
                    {t}
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => setDone(true)} className="mt-6 w-full rounded-full py-4 text-[13.5px] font-medium uppercase tracking-[0.12em] text-white" style={{ background: C.deep }}>
                Confirm · ₹{total.toLocaleString("en-IN")}
              </button>
            </motion.div>
          ) : (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-3 text-center">
              <SuccessTick color={C.mauve} />
              <p className="mt-4 text-[34px] font-medium italic leading-none" style={serif}>
                See you soon!
              </p>
              <p className="mt-3 text-[14.5px] text-black/60">
                {DAYS[day]}, {time} with {STYLISTS[stylist].name.split(" ")[0]}
              </p>
              <p className="mt-1 text-[13px] text-black/45">{chosen.map((c) => c.name).join(" · ")}</p>
              <p className="mt-5 rounded-2xl p-3.5 text-[12.5px] leading-relaxed" style={{ background: C.blush }}>
                {realSiteNote("the salon gets this booking on WhatsApp, and the client gets a reminder three hours before.")}
              </p>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setPicked([]);
                }}
                className="mt-5 w-full rounded-full py-3.5 text-[13.5px] font-medium uppercase tracking-[0.12em] text-white"
                style={{ background: C.deep }}
              >
                Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </Sheet>
      <Toast message={toast} />
    </div>
  );
}
