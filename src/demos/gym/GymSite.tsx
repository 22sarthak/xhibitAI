import "@fontsource/anton/400.css";
import "@fontsource-variable/inter";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState, type CSSProperties } from "react";
import { useScreen } from "../../components/device/DeviceScreen";
import { cn } from "../../lib/utils";
import { Avatar, DemoImg, Toast, realSiteNote, useToast, type DemoProps } from "../kit";

/* ── Pulse Fitness · gym & classes ──────────────────────────────────────── */

const C = { bg: "#0b0b0b", card: "#151515", line: "rgba(255,255,255,.09)", lime: "#c8f031", text: "#f4f4f2", mute: "rgba(244,244,242,.6)" };
const display: CSSProperties = { fontFamily: '"Anton", Impact, sans-serif', fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.01em" };
const font: CSSProperties = { fontFamily: '"Inter Variable", system-ui, sans-serif', color: C.text };
const img = (n: string) => `/demos/gyms/${n}.webp`;

type Period = "Monthly" | "Quarterly" | "Yearly";
const PLANS: { name: string; perks: string[]; price: Record<Period, number>; hot?: boolean }[] = [
  { name: "Basic", perks: ["Full gym floor", "Locker & shower", "Fitness assessment"], price: { Monthly: 1499, Quarterly: 3999, Yearly: 12999 } },
  { name: "Pro", perks: ["Everything in Basic", "All group classes", "Diet consultation"], price: { Monthly: 2199, Quarterly: 5999, Yearly: 19999 }, hot: true },
  { name: "Elite", perks: ["Everything in Pro", "Personal trainer 3× a week", "Monthly body scan"], price: { Monthly: 4999, Quarterly: 13999, Yearly: 47999 } },
];

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const CLASSES: Record<string, { time: string; name: string; coach: string; level: number; left: number }[]> = {
  default: [
    { time: "6:00 AM", name: "Power Yoga", coach: "Neha", level: 1, left: 6 },
    { time: "7:00 AM", name: "HIIT Burn", coach: "Vikram", level: 3, left: 2 },
    { time: "6:00 PM", name: "Zumba", coach: "Riya", level: 2, left: 9 },
    { time: "7:30 PM", name: "Strength Lab", coach: "Arjun", level: 3, left: 4 },
  ],
  SAT: [
    { time: "7:00 AM", name: "Bootcamp (outdoor)", coach: "Vikram", level: 3, left: 5 },
    { time: "9:00 AM", name: "Boxing Basics", coach: "Arjun", level: 2, left: 3 },
    { time: "5:00 PM", name: "Zumba Party", coach: "Riya", level: 1, left: 12 },
  ],
  SUN: [
    { time: "8:00 AM", name: "Stretch & Mobility", coach: "Neha", level: 1, left: 10 },
    { time: "10:00 AM", name: "Couples Workout", coach: "Vikram", level: 2, left: 4 },
  ],
};

const TRAINERS = [
  { name: "Vikram Singh", spec: "Strength & HIIT", c: ["#3d5a00", "#c8f031"] },
  { name: "Neha Ekka", spec: "Yoga & mobility", c: ["#1e3a5f", "#5aa9e6"] },
  { name: "Arjun Mehta", spec: "Boxing & conditioning", c: ["#5a1f1f", "#e05a4f"] },
  { name: "Riya Das", spec: "Zumba & dance fitness", c: ["#5b2a6e", "#c27be0"] },
];

/** A deterministic, QR-looking pattern for the trial pass. */
function PassCode({ seed }: { seed: string }) {
  const cells = useMemo(() => {
    let h = 0;
    for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return Array.from({ length: 21 * 21 }, (_, i) => {
      const x = i % 21;
      const y = Math.floor(i / 21);
      const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
      if (finder) {
        const fx = x > 13 ? x - 14 : x;
        const fy = y > 13 ? y - 14 : y;
        return fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4);
      }
      h = (h * 1103515245 + 12345) >>> 0;
      return (h >> 16) % 2 === 0;
    });
  }, [seed]);
  return (
    <svg viewBox="0 0 21 21" className="size-[112px] rounded-lg bg-white p-1.5" shapeRendering="crispEdges" aria-label="Trial pass code">
      {cells.map((on, i) => (on ? <rect key={i} x={i % 21} y={Math.floor(i / 21)} width="1" height="1" fill="#0b0b0b" /> : null))}
    </svg>
  );
}

function bmiInfo(b: number) {
  if (b < 18.5) return { label: "Underweight", color: "#5aa9e6" };
  if (b < 25) return { label: "Healthy", color: "#c8f031" };
  if (b < 30) return { label: "Overweight", color: "#f5a524" };
  return { label: "Obese", color: "#e05a4f" };
}

export default function GymSite({ name, area }: DemoProps) {
  const { mode, scrollToSection } = useScreen();
  const desktop = mode === "desktop";
  const [period, setPeriod] = useState<Period>("Monthly");
  const [day, setDay] = useState("MON");
  const [booked, setBooked] = useState<Set<string>>(new Set());
  const [pass, setPass] = useState(false);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(72);
  const [toast, showToast] = useToast(3400);

  const bmi = weight / (height / 100) ** 2;
  const info = bmiInfo(bmi);
  const bmiPos = Math.min(100, Math.max(0, ((bmi - 14) / (36 - 14)) * 100));
  const classes = CLASSES[day] ?? CLASSES.default;
  const brand = name.replace(/\b(fitness|gym|club)\b/gi, "").trim() || name;

  return (
    <div className="relative min-h-full" style={{ ...font, background: C.bg }}>
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b px-5 py-3 @3xl:px-12" style={{ background: "rgba(11,11,11,.92)", borderColor: C.line, backdropFilter: "blur(10px)" }}>
        <div className="min-w-0">
          <p className="truncate text-[26px] leading-none" style={display}>
            {brand}
            <span style={{ color: C.lime }}>.</span>
          </p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em]" style={{ color: C.mute }}>
            Fitness · {area}
          </p>
        </div>
        <nav className="hidden items-center gap-8 text-[13px] font-semibold uppercase tracking-[0.12em] @3xl:flex" style={{ color: C.mute }} aria-label="Demo menu">
          {[
            ["plans", "Plans"],
            ["classes", "Classes"],
            ["bmi", "BMI"],
            ["trainers", "Coaches"],
          ].map(([id, l]) => (
            <button key={id} type="button" onClick={() => scrollToSection(id)} className="hover:text-white">
              {l}
            </button>
          ))}
        </nav>
        <button type="button" onClick={() => scrollToSection("trial")} className="rounded-full px-4 py-2.5 text-[13px] font-extrabold uppercase tracking-[0.06em] text-black" style={{ background: C.lime }}>
          Free trial
        </button>
      </header>

      {/* Hero */}
      <section data-section="top" className="relative h-[560px] overflow-hidden @3xl:h-[620px]">
        <DemoImg src={img("hero")} alt="Athlete training with a weight plate" eager className="object-[60%_center]" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-black/10 @3xl:bg-linear-to-r @3xl:from-black @3xl:via-black/50 @3xl:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 @3xl:inset-y-0 @3xl:flex @3xl:max-w-[640px] @3xl:flex-col @3xl:justify-center @3xl:p-14">
          <p className="text-[12px] font-bold uppercase tracking-[0.24em]" style={{ color: C.lime }}>
            Open 5 AM – 11 PM · {area}
          </p>
          <h1 className="mt-3 text-[64px] leading-[0.92] @3xl:text-[104px]" style={display}>
            Stronger <span style={{ color: C.lime }}>every</span> day.
          </h1>
          <p className="mt-4 max-w-[30ch] text-[15px]" style={{ color: C.mute }}>
            Modern equipment, certified coaches and a crew that keeps you showing up.
          </p>
          <div className="mt-6 flex gap-2.5">
            <button type="button" onClick={() => scrollToSection("trial")} className="flex-1 rounded-full py-3.5 text-[14px] font-extrabold uppercase tracking-[0.04em] text-black @3xl:flex-none @3xl:px-7" style={{ background: C.lime }}>
              3-day free trial
            </button>
            <button type="button" onClick={() => scrollToSection("plans")} className="flex-1 rounded-full py-3.5 text-[14px] font-bold uppercase tracking-[0.04em] ring-1 ring-white/30 @3xl:flex-none @3xl:px-7">
              See plans
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 border-b @3xl:grid-cols-4" style={{ borderColor: C.line }}>
        {[
          ["12", "Certified coaches"],
          ["18", "Classes a week"],
          ["6,000", "Sq ft floor"],
          ["4.8★", "Google rating"],
        ].map(([n, l], i) => (
          <div key={l} className={cn("px-5 py-5 @3xl:px-12", i % 2 === 0 && "border-r", "border-b @3xl:border-b-0 @3xl:border-r")} style={{ borderColor: C.line }}>
            <p className="text-[34px] leading-none" style={display}>
              {n}
            </p>
            <p className="mt-1 text-[12px] uppercase tracking-[0.12em]" style={{ color: C.mute }}>
              {l}
            </p>
          </div>
        ))}
      </div>

      {/* Plans */}
      <section data-section="plans" className="px-5 pt-12 @3xl:px-12 @3xl:pt-20">
        <div className="@3xl:flex @3xl:items-end @3xl:justify-between">
          <h2 className="text-[44px] leading-none @3xl:text-[64px]" style={display}>
            Pick your <span style={{ color: C.lime }}>plan</span>
          </h2>
          <div className="mt-4 flex w-fit rounded-full p-1 ring-1 @3xl:mt-0" style={{ ["--tw-ring-color" as string]: C.line }}>
            {(["Monthly", "Quarterly", "Yearly"] as Period[]).map((p) => (
              <button key={p} type="button" onClick={() => setPeriod(p)} className={cn("relative rounded-full px-3.5 py-2 text-[12.5px] font-bold", period === p ? "text-black" : "")} style={period === p ? undefined : { color: C.mute }}>
                {period === p && <motion.span layoutId={`gym-period-${mode}`} className="absolute inset-0 rounded-full" style={{ background: C.lime }} transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span className="relative">{p}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 grid gap-3 @3xl:grid-cols-3 @3xl:gap-5">
          {PLANS.map((p) => (
            <article key={p.name} className="relative rounded-[24px] p-5 @3xl:p-7" style={p.hot ? { background: C.lime, color: "#0b0b0b" } : { background: C.card, boxShadow: `inset 0 0 0 1px ${C.line}` }}>
              {p.hot && <span className="absolute right-5 top-5 rounded-full bg-black px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.1em] text-white">Most popular</span>}
              <p className="text-[28px] leading-none" style={display}>
                {p.name}
              </p>
              <div className="mt-4 flex h-[46px] items-baseline gap-1.5 overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span key={`${p.name}-${period}`} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} className="text-[42px] leading-none" style={display}>
                    ₹{p.price[period].toLocaleString("en-IN")}
                  </motion.span>
                </AnimatePresence>
                <span className="text-[13px] font-semibold opacity-60">/{period === "Monthly" ? "month" : period === "Quarterly" ? "3 months" : "year"}</span>
              </div>
              <ul className="mt-4 grid gap-2 text-[14px]">
                {p.perks.map((k) => (
                  <li key={k} className="flex gap-2">
                    <span style={{ color: p.hot ? "#0b0b0b" : C.lime }}>✓</span> {k}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => showToast(realSiteNote(`members join the ${p.name} plan and pay by UPI — with a renewal reminder before it ends.`))}
                className="mt-5 w-full rounded-full py-3 text-[13.5px] font-extrabold uppercase tracking-[0.04em]"
                style={p.hot ? { background: "#0b0b0b", color: "#fff" } : { background: "#fff", color: "#0b0b0b" }}
              >
                Join {p.name}
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Classes */}
      <section data-section="classes" className="px-5 pt-12 @3xl:px-12 @3xl:pt-20">
        <h2 className="text-[44px] leading-none @3xl:text-[64px]" style={display}>
          Class <span style={{ color: C.lime }}>timetable</span>
        </h2>
        <div className="no-scrollbar -mx-5 mt-5 flex gap-1.5 overflow-x-auto px-5 @3xl:mx-0 @3xl:px-0">
          {DAYS.map((d) => (
            <button key={d} type="button" onClick={() => setDay(d)} className="min-w-[52px] rounded-xl py-2.5 text-[12.5px] font-extrabold tracking-[0.06em]" style={day === d ? { background: C.lime, color: "#0b0b0b" } : { background: C.card, color: C.mute }}>
              {d}
            </button>
          ))}
        </div>
        <ul className="mt-4 grid gap-2 @3xl:grid-cols-2 @3xl:gap-3">
          {classes.map((c) => {
            const key = `${day}-${c.time}`;
            const isBooked = booked.has(key);
            return (
              <li key={key} className="flex items-center gap-4 rounded-2xl p-4" style={{ background: C.card, boxShadow: `inset 0 0 0 1px ${C.line}` }}>
                <span className="w-[62px] shrink-0 text-[13px] font-bold">{c.time}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-bold">{c.name}</span>
                  <span className="mt-0.5 flex items-center gap-2 text-[12px]" style={{ color: C.mute }}>
                    with {c.coach}
                    <span role="img" className="flex gap-0.5" aria-label={`Intensity ${c.level} of 3`}>
                      {[1, 2, 3].map((l) => (
                        <span key={l} className="h-2.5 w-1 rounded-full" style={{ background: l <= c.level ? C.lime : "rgba(255,255,255,.15)" }} />
                      ))}
                    </span>
                    · {isBooked ? c.left - 1 : c.left} spots
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setBooked((b) => new Set(b).add(key))}
                  disabled={isBooked}
                  className="rounded-full px-4 py-2 text-[12.5px] font-extrabold uppercase"
                  style={isBooked ? { background: "rgba(200,240,49,.15)", color: C.lime } : { background: "#fff", color: "#0b0b0b" }}
                >
                  {isBooked ? "Booked ✓" : "Book"}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Trial + BMI */}
      <div className="px-5 pt-12 @3xl:grid @3xl:grid-cols-2 @3xl:gap-5 @3xl:px-12 @3xl:pt-20">
        <section data-section="trial" className="rounded-[26px] p-6 text-black @3xl:p-8" style={{ background: C.lime }}>
          <AnimatePresence mode="wait" initial={false}>
            {!pass ? (
              <motion.div key="form" exit={{ opacity: 0, y: -10 }}>
                <h2 className="text-[40px] leading-none" style={display}>
                  3 days free.
                  <br />
                  No catch.
                </h2>
                <p className="mt-2 text-[14px] font-medium opacity-75">Try the gym and any class. Your pass arrives on WhatsApp.</p>
                <input defaultValue="Rohit Kumar" aria-label="Your name" className="mt-5 w-full rounded-xl bg-white/70 px-4 py-3 text-[15px] font-semibold placeholder:text-black/40 focus:outline-none" />
                <input defaultValue="98765 43210" aria-label="Mobile number" inputMode="tel" className="mt-2 w-full rounded-xl bg-white/70 px-4 py-3 text-[15px] font-semibold focus:outline-none" />
                <button type="button" onClick={() => setPass(true)} className="mt-4 w-full rounded-full bg-black py-3.5 text-[14px] font-extrabold uppercase tracking-[0.06em] text-white">
                  Get my free pass
                </button>
              </motion.div>
            ) : (
              <motion.div key="pass" initial={{ opacity: 0, rotateX: 40 }} animate={{ opacity: 1, rotateX: 0 }} transition={{ duration: 0.6 }} className="rounded-[20px] bg-black p-5 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: C.lime }}>
                      Free trial pass
                    </p>
                    <p className="mt-2 text-[30px] leading-none" style={display}>
                      Rohit Kumar
                    </p>
                    <p className="mt-2 text-[12.5px] text-white/60">Valid for 3 days from your first visit · {brand}</p>
                  </div>
                  <PassCode seed={name + "Rohit"} />
                </div>
                <p className="mt-4 rounded-xl bg-white/10 p-3 text-[12px] leading-relaxed text-white/75">{realSiteNote("this pass is sent on WhatsApp, with a reminder the evening before.")}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section data-section="bmi" className="mt-4 rounded-[26px] p-6 @3xl:mt-0 @3xl:p-8" style={{ background: C.card, boxShadow: `inset 0 0 0 1px ${C.line}` }}>
          <h2 className="text-[34px] leading-none" style={display}>
            Check your <span style={{ color: C.lime }}>BMI</span>
          </h2>
          <div className="mt-5 flex items-end gap-3">
            <span className="text-[56px] leading-none tabular-nums" style={{ ...display, color: info.color }}>
              {bmi.toFixed(1)}
            </span>
            <span className="pb-1.5 text-[15px] font-bold" style={{ color: info.color }}>
              {info.label}
            </span>
          </div>
          <div className="relative mt-4 h-2.5 rounded-full" style={{ background: "linear-gradient(90deg,#5aa9e6 0%,#5aa9e6 20%,#c8f031 20%,#c8f031 50%,#f5a524 50%,#f5a524 72%,#e05a4f 72%)" }}>
            <motion.span className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-black bg-white" animate={{ left: `${bmiPos}%` }} transition={{ type: "spring", stiffness: 200, damping: 22 }} />
          </div>
          {[
            { label: "Height", value: height, set: setHeight, min: 140, max: 200, unit: "cm" },
            { label: "Weight", value: weight, set: setWeight, min: 40, max: 130, unit: "kg" },
          ].map((s) => (
            <label key={s.label} className="mt-5 block">
              <span className="flex justify-between text-[13px] font-semibold" style={{ color: C.mute }}>
                {s.label}
                <span className="text-white">
                  {s.value} {s.unit}
                </span>
              </span>
              <input type="range" min={s.min} max={s.max} value={s.value} onChange={(e) => s.set(Number(e.target.value))} className="mt-2 w-full accent-[#c8f031]" />
            </label>
          ))}
        </section>
      </div>

      {/* Trainers */}
      <section data-section="trainers" className="px-5 pt-12 @3xl:px-12 @3xl:pt-20">
        <h2 className="text-[44px] leading-none @3xl:text-[64px]" style={display}>
          Your <span style={{ color: C.lime }}>coaches</span>
        </h2>
        <div tabIndex={0} role="region" aria-label="Coaches" className="no-scrollbar -mx-5 mt-5 flex gap-3 overflow-x-auto px-5 @3xl:mx-0 @3xl:grid @3xl:grid-cols-4 @3xl:px-0">
          {TRAINERS.map((t) => (
            <div key={t.name} className="w-[160px] shrink-0 rounded-[22px] p-4 @3xl:w-auto" style={{ background: C.card, boxShadow: `inset 0 0 0 1px ${C.line}` }}>
              <Avatar name={t.name} from={t.c[0]} to={t.c[1]} size={56} />
              <p className="mt-3 text-[15px] font-bold">{t.name}</p>
              <p className="text-[12.5px]" style={{ color: C.mute }}>
                {t.spec}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="pt-12 @3xl:pt-20">
        <div tabIndex={0} role="region" aria-label="Gym photos" className="no-scrollbar flex gap-2 overflow-x-auto px-5 @3xl:grid @3xl:grid-cols-5 @3xl:px-12">
          {["floor", "weights", "yoga", "boxing", "kettlebell"].map((s) => (
            <div key={s} className="h-[200px] w-[150px] shrink-0 overflow-hidden rounded-[18px] @3xl:h-[260px] @3xl:w-auto">
              <DemoImg src={img(s)} alt="" className="grayscale-[30%]" />
            </div>
          ))}
        </div>
      </section>

      <footer className="px-5 pb-32 pt-12 @3xl:px-12 @3xl:pb-14">
        <p className="text-[34px] leading-none" style={display}>
          Main Road, {area}, Ranchi
        </p>
        <p className="mt-2 text-[13px]" style={{ color: C.mute }}>
          Mon – Sat 5 AM – 11 PM · Sun 6 AM – 12 PM · © 2026 {name} · Website by Xhibit AI
        </p>
      </footer>

      {!desktop && (
        <div className="sticky bottom-0 z-30 px-4 pb-7 pt-2">
          <button type="button" onClick={() => scrollToSection("trial")} className="w-full rounded-full py-3.5 text-[14px] font-extrabold uppercase tracking-[0.06em] text-black shadow-[0_14px_30px_-12px_rgba(200,240,49,.55)]" style={{ background: C.lime }}>
            Claim your free trial
          </button>
        </div>
      )}
      <Toast message={toast} />
    </div>
  );
}
