import "@fontsource-variable/lexend";
import "@fontsource-variable/dm-sans";
import { ArrowRight, CalendarDays, Camera, Check, ChevronDown, IndianRupee, MessageCircle, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, type CSSProperties, type FormEvent } from "react";
import { useScreen } from "../../components/device/DeviceScreen";
import { cn, initials } from "../../lib/utils";
import { type DemoProps } from "../kit";

/* ── ShiftSaathi · a startup's launch page: one goal, the waitlist ── */

const C = {
  bg: "#fffdf6",
  ink: "#141414",
  mute: "#5f5d57",
  line: "rgba(20,20,20,.09)",
  sun: "#ffcf3f",
  sunSoft: "#fff3c9",
  blue: "#2f5bff",
  green: "#13a06b",
};
const body: CSSProperties = { fontFamily: '"DM Sans Variable", system-ui, sans-serif', color: C.ink };
const display: CSSProperties = { fontFamily: '"Lexend Variable", system-ui, sans-serif' };

const STAFF = [
  { name: "Ravi K.", role: "Cook", shifts: ["M", "M", "E", "M", "off", "E", "E"] },
  { name: "Priya N.", role: "Cashier", shifts: ["E", "E", "off", "E", "E", "M", "M"] },
  { name: "Imran S.", role: "Delivery", shifts: ["N", "off", "N", "N", "N", "E", "off"] },
  { name: "Sunita D.", role: "Housekeeping", shifts: ["M", "M", "M", "off", "M", "M", "E"] },
  { name: "Arjun R.", role: "Waiter", shifts: ["off", "E", "E", "E", "M", "E", "E"] },
];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SHIFT: Record<string, { label: string; bg: string; fg: string }> = {
  M: { label: "9–5", bg: "#fff3c9", fg: "#7a5a00" },
  E: { label: "2–10", bg: "#e5ebff", fg: "#2442b8" },
  N: { label: "10–6", bg: "#ece7ff", fg: "#5a3fc0" },
  off: { label: "Off", bg: "transparent", fg: "#a3a19a" },
};

const FAQS = [
  { q: "Do my staff need to install an app?", a: "No. Staff get their shifts and mark attendance on WhatsApp. Only managers use the web dashboard." },
  { q: "How does selfie attendance work?", a: "Staff send a selfie on WhatsApp when they arrive. We check the face and location, then mark them present." },
  { q: "Is it free?", a: "Free for every team during early access. We'll share simple monthly plans before we launch." },
];

function RosterPreview({ city }: { city: string }) {
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_30px_60px_-30px_rgba(20,20,20,.35)] ring-1" style={{ ["--tw-ring-color" as string]: C.line }}>
        <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: C.line }}>
          <div>
            <p className="text-[13px] font-bold">This week</p>
            <p className="text-[11px]" style={{ color: C.mute }}>
              Indiranagar outlet · {city}
            </p>
          </div>
          <span className="rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: "#e7f6ef", color: C.green }}>
            18 / 22 present
          </span>
        </div>
        <div className="overflow-hidden px-3 pb-3 pt-2">
          <div className="grid grid-cols-[86px_repeat(7,1fr)] gap-1 text-[10.5px]">
            <span />
            {DAYS.map((d) => (
              <span key={d} className="py-1 text-center font-semibold" style={{ color: C.mute }}>
                {d}
              </span>
            ))}
            {STAFF.map((s) => (
              <div key={s.name} className="contents">
                <span className="truncate py-1.5 pr-1 font-semibold">{s.name}</span>
                {s.shifts.map((k, i) => (
                  <span key={i} className="rounded-md py-1.5 text-center font-semibold" style={{ background: SHIFT[k].bg, color: SHIFT[k].fg }}>
                    {SHIFT[k].label}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* the WhatsApp side: what staff actually see */}
      <div className="absolute -bottom-6 -left-3 w-[230px] rounded-[16px] bg-[#e7ffdb] p-3 text-[12px] leading-snug shadow-[0_16px_30px_-12px_rgba(20,20,20,.35)] @3xl:-left-10">
        <p className="flex items-center gap-1.5 text-[11px] font-bold" style={{ color: "#128c4b" }}>
          <MessageCircle className="size-3.5" /> ShiftSaathi on WhatsApp
        </p>
        <p className="mt-1">Ravi checked in at 9:02 AM. Selfie verified ✓</p>
      </div>
    </div>
  );
}

export default function StartupLanding({ name, city }: DemoProps) {
  const { scrollToSection } = useScreen();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [joined, setJoined] = useState<number | null>(null);
  const [open, setOpen] = useState(0);

  const join = (e: FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(digits)) {
      setError("Enter a 10-digit WhatsApp number");
      return;
    }
    setError("");
    setJoined(1248 + Math.floor(Math.random() * 40));
  };

  const form = (
    <AnimatePresence mode="wait" initial={false}>
      {joined ? (
        <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 rounded-[18px] p-4" style={{ background: "#e7f6ef" }}>
          <span className="grid size-9 shrink-0 place-items-center rounded-full text-white" style={{ background: C.green }}>
            <Check className="size-5" strokeWidth={3} />
          </span>
          <span>
            <span className="block text-[15px] font-bold">You're #{joined.toLocaleString("en-IN")} on the list</span>
            <span className="block text-[13.5px]" style={{ color: C.mute }}>
              We'll WhatsApp you the day we open in {city}.
            </span>
          </span>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={join} exit={{ opacity: 0 }} noValidate>
          <div className="flex flex-col gap-2 @md:flex-row">
            <label className="flex h-[52px] w-full items-center gap-2 @md:flex-1 rounded-[14px] bg-white px-4 ring-1" style={{ ["--tw-ring-color" as string]: error ? "#d93025" : C.line }}>
              <span className="text-[15px] font-semibold" style={{ color: C.mute }}>
                +91
              </span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                placeholder="Your WhatsApp number"
                aria-label="Your WhatsApp number"
                className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[#a3a19a]"
              />
            </label>
            <button type="submit" className="flex h-[52px] items-center justify-center gap-2 rounded-[14px] px-6 text-[15px] font-bold text-white transition-transform active:scale-[.98]" style={{ background: C.ink }}>
              Join the waitlist <ArrowRight className="size-4" />
            </button>
          </div>
          <p className="mt-2 text-[12.5px]" style={{ color: error ? "#d93025" : C.mute }}>
            {error || "Free during early access. No card, no spam."}
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-full" style={{ ...body, background: C.bg }}>
      {/* Nav */}
      <header data-section="top" className="sticky top-0 z-20 border-b bg-[#fffdf6]/90 backdrop-blur" style={{ borderColor: C.line }}>
        <div className="mx-auto flex max-w-[1120px] items-center justify-between px-5 py-3.5 @3xl:px-8">
          <span className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-[10px] text-[12px] font-bold" style={{ background: C.sun, ...display }}>
              {initials(name)}
            </span>
            <span className="text-[17px] font-semibold tracking-[-0.02em]" style={display}>
              {name}
            </span>
          </span>
          <nav className="hidden items-center gap-7 text-[14px] font-medium @3xl:flex" style={{ color: C.mute }} aria-label="Site">
            {[
              ["features", "Product"],
              ["how", "How it works"],
              ["faq", "FAQ"],
            ].map(([id, label]) => (
              <button key={id} type="button" onClick={() => scrollToSection(id)} className="hover:text-[#141414]">
                {label}
              </button>
            ))}
          </nav>
          <button type="button" onClick={() => scrollToSection("top")} className="rounded-full px-4 py-2 text-[13px] font-bold" style={{ background: C.sun }}>
            Get early access
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-[1120px] gap-12 px-5 pb-16 pt-10 @3xl:grid-cols-[1.05fr_1fr] @3xl:items-center @3xl:gap-14 @3xl:px-8 @3xl:pb-24 @3xl:pt-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[12.5px] font-semibold ring-1" style={{ ["--tw-ring-color" as string]: C.line }}>
            <Sparkles className="size-3.5" style={{ color: C.blue }} /> Early access · launching in {city}
          </span>
          <h1 className="mt-5 text-[38px] font-semibold leading-[1.04] tracking-[-0.035em] @3xl:text-[58px]" style={display}>
            Shifts, attendance and salaries,{" "}
            <span className="box-decoration-clone" style={{ backgroundImage: `linear-gradient(transparent 64%, ${C.sun} 64%, ${C.sun} 92%, transparent 92%)` }}>
              sorted on WhatsApp.
            </span>
          </h1>
          <p className="mt-5 max-w-[520px] text-[16.5px] leading-relaxed @3xl:text-[18px]" style={{ color: C.mute }}>
            Plan the week's roster in minutes, let staff check in with a selfie, and pay the right salary every month. Built for restaurants, stores and clinics. Nothing for your staff to install.
          </p>
          <div className="mt-7 max-w-[520px]">{form}</div>
        </div>
        <div className="pb-6 @3xl:pb-0">
          <RosterPreview city={city} />
        </div>
      </section>

      {/* Proof points */}
      <section className="border-y bg-white" style={{ borderColor: C.line }}>
        <div className="mx-auto grid max-w-[1120px] gap-6 px-5 py-8 @3xl:grid-cols-3 @3xl:px-8">
          {[
            ["5 min", "to plan a week of shifts"],
            ["0 apps", "for your staff to download"],
            ["1 tap", "to pay everyone on payday"],
          ].map(([big, small]) => (
            <div key={big} className="flex items-baseline gap-3">
              <span className="text-[30px] font-semibold tracking-[-0.03em]" style={display}>
                {big}
              </span>
              <span className="text-[14.5px]" style={{ color: C.mute }}>
                {small}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section data-section="features" className="mx-auto max-w-[1120px] px-5 py-16 @3xl:px-8 @3xl:py-24">
        <p className="text-[13px] font-bold uppercase tracking-[0.14em]" style={{ color: C.blue }}>
          What it does
        </p>
        <h2 className="mt-3 max-w-[640px] text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] @3xl:text-[42px]" style={display}>
          The whole shift team, in one simple dashboard.
        </h2>
        <div className="mt-10 grid gap-4 @3xl:grid-cols-3">
          {[
            { icon: CalendarDays, title: "Rosters in minutes", text: "Drag shifts into the week, copy last week, and every person gets their schedule on WhatsApp." },
            { icon: Camera, title: "Selfie attendance", text: "Staff check in with a selfie from the outlet. Late, absent and overtime are counted for you." },
            { icon: IndianRupee, title: "Salaries without spreadsheets", text: "Days worked, overtime and advances add up on their own. Pay everyone by UPI in one go." },
          ].map((f) => (
            <div key={f.title} className="rounded-[20px] bg-white p-6 ring-1" style={{ ["--tw-ring-color" as string]: C.line }}>
              <span className="grid size-11 place-items-center rounded-[12px]" style={{ background: C.sunSoft }}>
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-5 text-[19px] font-semibold tracking-[-0.02em]" style={display}>
                {f.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed" style={{ color: C.mute }}>
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section data-section="how" className="bg-white">
        <div className="mx-auto max-w-[1120px] px-5 py-16 @3xl:px-8 @3xl:py-24">
          <h2 className="text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] @3xl:text-[42px]" style={display}>
            Up and running before lunch.
          </h2>
          <ol className="mt-10 grid gap-6 @3xl:grid-cols-3">
            {[
              ["Add your team", "Upload a list or type names and numbers. Takes ten minutes for most outlets."],
              ["Set the week", "Pick shifts for each person. ShiftSaathi sends everyone their schedule."],
              ["Let it run", "Check-ins, leave requests and salary maths come in on their own."],
            ].map(([t, d], i) => (
              <li key={t} className="border-t-2 pt-5" style={{ borderColor: C.ink }}>
                <span className="text-[13px] font-bold" style={{ color: C.mute }}>
                  0{i + 1}
                </span>
                <h3 className="mt-2 text-[19px] font-semibold" style={display}>
                  {t}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed" style={{ color: C.mute }}>
                  {d}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section data-section="faq" className="mx-auto max-w-[760px] px-5 py-16 @3xl:py-24">
        <h2 className="text-[28px] font-semibold tracking-[-0.03em] @3xl:text-[36px]" style={display}>
          Questions
        </h2>
        <div className="mt-6 divide-y border-y" style={{ borderColor: C.line }}>
          {FAQS.map((f, i) => (
            <div key={f.q} style={{ borderColor: C.line }}>
              <button type="button" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 py-4 text-left text-[16px] font-semibold">
                {f.q}
                <ChevronDown className={cn("size-5 shrink-0 transition-transform", open === i && "rotate-180")} />
              </button>
              {open === i && (
                <p className="pb-4 text-[15px] leading-relaxed" style={{ color: C.mute }}>
                  {f.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final call to action */}
      <section className="px-4 pb-10 @3xl:px-8">
        <div className="mx-auto max-w-[1120px] rounded-[26px] px-6 py-12 text-center text-white @3xl:py-16" style={{ background: C.ink }}>
          <h2 className="text-[30px] font-semibold tracking-[-0.03em] @3xl:text-[44px]" style={display}>
            Be one of the first teams in {city}.
          </h2>
          <p className="mx-auto mt-3 max-w-[460px] text-[15.5px] text-white/70">Early teams get ShiftSaathi free while we build it with them.</p>
          <button type="button" onClick={() => scrollToSection("top")} className="mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-bold" style={{ background: C.sun, color: C.ink }}>
            Join the waitlist <ArrowRight className="size-4" />
          </button>
        </div>
        <p className="mt-8 text-center text-[12.5px]" style={{ color: C.mute }}>
          © {new Date().getFullYear()} {name} · HSR Layout, {city}
        </p>
      </section>
    </div>
  );
}
