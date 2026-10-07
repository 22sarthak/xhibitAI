import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useRef, useState, type ReactNode } from "react";
import { useInterval } from "../../lib/hooks";
import { ease } from "../../lib/motion";
import { cn } from "../../lib/utils";
import { Eyebrow } from "../ui/Eyebrow";
import { Marquee } from "../ui/Marquee";
import { Reveal, RevealHeading } from "../ui/Reveal";

/* ── Tile shell with a soft spotlight that follows the cursor ── */
function Tile({ className, visual, title, text, tag }: { className?: string; visual: ReactNode; title: string; text: string; tag: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <motion.article
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r || !ref.current) return;
        ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
        ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[28px] bg-linen p-6 ring-1 ring-ink/[0.07] transition-[box-shadow,transform] duration-500 ease-(--ease-soft) hover:-translate-y-1 hover:shadow-lift sm:p-7",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), rgb(233 162 59 / 0.12), transparent 60%)" }}
      />
      <div className="relative min-h-[11rem] flex-1">{visual}</div>
      <div className="relative mt-6">
        <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-clay-deep">{tag}</p>
        <h3 className="mt-2 text-title text-ink">{title}</h3>
        <p className="mt-2 max-w-[44ch] text-ink-soft">{text}</p>
      </div>
    </motion.article>
  );
}

/* ── Visual 1: a website assembling itself in a browser and on a phone ── */
function WebsiteVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const block = (delay: number) => ({
    initial: { opacity: 0, scale: 0.92 },
    animate: inView ? { opacity: 1, scale: 1 } : {},
    transition: { duration: 0.7, ease, delay },
  });
  return (
    <div ref={ref} className="relative h-full min-h-[13rem]" aria-hidden="true">
      <div className="absolute inset-y-0 left-0 right-[18%] overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-ink/[0.06]">
        <div className="flex h-7 items-center gap-1.5 border-b border-ink/[0.06] bg-sand/60 px-3">
          <span className="size-2 rounded-full bg-[#ff5f57]" />
          <span className="size-2 rounded-full bg-[#febc2e]" />
          <span className="size-2 rounded-full bg-[#28c840]" />
          <span className="ml-3 h-3.5 w-36 rounded-full bg-white" />
        </div>
        <div className="grid grid-cols-5 gap-3 p-4">
          <motion.div {...block(0.1)} className="col-span-3 h-24 rounded-xl bg-linear-to-br from-clay to-ochre" />
          <div className="col-span-2 space-y-2 pt-2">
            <motion.div {...block(0.25)} className="h-3 w-full rounded-full bg-ink/80" />
            <motion.div {...block(0.32)} className="h-3 w-4/5 rounded-full bg-ink/80" />
            <motion.div {...block(0.4)} className="h-2 w-full rounded-full bg-ink/15" />
            <motion.div {...block(0.45)} className="h-2 w-3/4 rounded-full bg-ink/15" />
            <motion.div {...block(0.55)} className="mt-3 h-6 w-20 rounded-full bg-ink" />
          </div>
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div key={i} {...block(0.6 + i * 0.07)} className="col-span-1 h-14 rounded-lg bg-sand" />
          ))}
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: 6 }}
        animate={inView ? { opacity: 1, y: 0, rotate: 3 } : {}}
        transition={{ duration: 1, ease, delay: 0.5 }}
        className="absolute bottom-[-8%] right-0 w-[30%] min-w-[7.5rem] rounded-[22px] bg-ink p-1.5 shadow-lift"
      >
        <div className="overflow-hidden rounded-[17px] bg-white">
          <div className="h-16 bg-linear-to-br from-sal to-[#4f7a63]" />
          <div className="space-y-1.5 p-2.5">
            <div className="h-2 w-4/5 rounded-full bg-ink/80" />
            <div className="h-1.5 w-full rounded-full bg-ink/15" />
            <div className="h-1.5 w-2/3 rounded-full bg-ink/15" />
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              <div className="h-5 rounded-full bg-wa" />
              <div className="h-5 rounded-full bg-ink" />
            </div>
            <div className="h-10 rounded-lg bg-sand" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Visual 2: a WhatsApp conversation that plays on a loop ── */
const CHAT = [
  { bot: false, text: "Kal subah 10 baje slot hai?" },
  { bot: true, text: "Yes! 10:30 AM is free with Dr. Sinha. Shall I book it?" },
  { bot: false, text: "Haan, book kar do" },
  { bot: true, text: "Done ✓ Token A-14. I'll remind you at 8:30." },
];
function ChatVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduced = useReducedMotion();
  const [step, setStep] = useState(reduced ? CHAT.length : 0);
  useInterval(() => setStep((s) => (s >= CHAT.length + 2 ? 0 : s + 1)), inView && !reduced ? 1300 : null);
  const typing = step < CHAT.length && step % 2 === 1;
  return (
    <div ref={ref} className="flex h-full min-h-[12rem] flex-col justify-end gap-2 rounded-2xl bg-[#efe9df] p-4" aria-hidden="true">
      <AnimatePresence initial={false}>
        {CHAT.slice(0, Math.min(step, CHAT.length)).map((m, i) => (
          <motion.p
            key={i}
            layout
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className={cn(
              "max-w-[85%] rounded-2xl px-3 py-2 text-[0.8125rem] leading-snug shadow-[0_1px_1px_rgba(0,0,0,.06)]",
              m.bot ? "self-start rounded-tl-md bg-white text-ink" : "self-end rounded-tr-md bg-[#d9fdd3] text-ink",
            )}
          >
            {m.text}
          </motion.p>
        ))}
        {typing && (
          <motion.span
            key="typing"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex w-fit gap-1 self-start rounded-2xl rounded-tl-md bg-white px-3 py-2.5"
          >
            {[0, 1, 2].map((d) => (
              <motion.span
                key={d}
                className="size-1.5 rounded-full bg-ink/40"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: d * 0.15 }}
              />
            ))}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Visual 3: a week of slots filling up ── */
const SLOTS = [3, 8, 10, 14, 17, 19, 22, 25, 1, 12, 27, 6];
function CalendarVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduced = useReducedMotion();
  const [filled, setFilled] = useState(reduced ? SLOTS.length : 0);
  useInterval(() => setFilled((f) => (f >= SLOTS.length + 3 ? 0 : f + 1)), inView && !reduced ? 600 : null);
  const booked = new Set(SLOTS.slice(0, Math.min(filled, SLOTS.length)));
  return (
    <div ref={ref} className="h-full min-h-[12rem] rounded-2xl bg-white p-4 ring-1 ring-ink/[0.06]" aria-hidden="true">
      <div className="flex items-center justify-between">
        <p className="text-[0.8125rem] font-semibold">This week</p>
        <p className="tabular rounded-full bg-sal-soft px-2.5 py-1 text-[0.75rem] font-semibold text-sal">{booked.size} bookings</p>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1.5 text-center text-[0.625rem] font-semibold text-ink-mute">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
        {Array.from({ length: 28 }, (_, i) => (
          <motion.span
            key={i}
            className="h-5 rounded-md"
            animate={{ backgroundColor: booked.has(i) ? "#c4532d" : "rgba(29,26,22,0.06)", scale: booked.has(i) ? [1, 1.15, 1] : 1 }}
            transition={{ duration: 0.4 }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Visual 4: an automation flow with a travelling pulse ── */
function FlowVisual() {
  const reduced = useReducedMotion();
  const nodes = ["New booking", "WhatsApp confirmation", "Reminder 2 hrs before"];
  return (
    <div className="relative flex h-full min-h-[12rem] flex-col justify-center gap-3 rounded-2xl bg-dusk p-4 text-ivory" aria-hidden="true">
      <span className="absolute bottom-8 left-[1.85rem] top-8 w-px bg-ivory/15" />
      {!reduced && (
        <motion.span
          className="absolute left-[1.6rem] size-2.5 rounded-full bg-ochre shadow-[0_0_14px_4px_rgb(233_162_59/0.6)]"
          animate={{ top: ["2rem", "calc(100% - 2.6rem)"] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
        />
      )}
      {nodes.map((n, i) => (
        <div key={n} className="relative flex items-center gap-3">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-dusk-2 text-[0.6875rem] font-bold text-ochre ring-1 ring-ivory/15">
            {i + 1}
          </span>
          <span className="rounded-xl bg-ivory/[0.07] px-3 py-2 text-[0.8125rem] ring-1 ring-ivory/10">{n}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Visual 5: a map pin dropping onto your shop ── */
function MapVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <div ref={ref} className="relative h-full min-h-[12rem] overflow-hidden rounded-2xl bg-[#ece4d6]" aria-hidden="true">
      <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <path d="M-10 130 C 60 110, 110 150, 180 120 S 280 90, 320 100" stroke="#cfe0e6" strokeWidth="14" fill="none" />
        <path d="M0 50 H300 M0 95 H300 M70 0 V180 M160 0 V180 M240 0 V180" stroke="#fbf7f0" strokeWidth="7" />
        <path d="M0 165 L300 20" stroke="#fbf7f0" strokeWidth="10" />
        <rect x="175" y="58" width="52" height="28" rx="5" fill="#d6e3c6" />
        <rect x="16" y="104" width="44" height="26" rx="5" fill="#d6e3c6" />
        <circle cx="98" cy="72" r="4" fill="#b9b1a4" />
        <circle cx="205" cy="138" r="4" fill="#b9b1a4" />
        <circle cx="262" cy="64" r="4" fill="#b9b1a4" />
      </svg>
      <motion.div
        className="absolute left-[46%] top-[34%]"
        initial={{ y: -60, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ type: "spring", stiffness: 260, damping: 13, delay: 0.3 }}
      >
        <svg width="30" height="38" viewBox="0 0 38 48" className="drop-shadow-md">
          <path d="M19 47s17-15.6 17-28A17 17 0 0 0 2 19c0 12.4 17 28 17 28z" fill="#c4532d" />
          <circle cx="19" cy="19" r="7" fill="#fbf7f0" />
        </svg>
      </motion.div>
      <motion.div
        className="absolute bottom-3 left-3 right-3 flex items-center gap-3 rounded-xl bg-white/95 p-2.5 shadow-soft"
        initial={{ y: 30, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.7, ease, delay: 0.9 }}
      >
        <span className="size-9 shrink-0 rounded-lg bg-linear-to-br from-clay to-ochre" />
        <span className="min-w-0 text-[0.75rem] leading-tight">
          <b className="block truncate text-[0.8125rem] text-ink">Your business</b>
          <span className="text-ink-soft">★ 4.8 · 212 reviews · </span>
          <span className="font-semibold text-sal">Open now</span>
        </span>
      </motion.div>
    </div>
  );
}

const careItems = ["Festive offer banners", "New photos", "Price changes", "Daily backups", "Security updates", "Speed checks", "Google posts", "Menu updates"];

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="section-y">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow no="03">What we do</Eyebrow>
            <RevealHeading id="services-title" text="Everything your business needs to *grow* online." className="mt-6 text-display" />
          </div>
          <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.1}>
            <p className="text-lead text-ink-soft">One team for your website, your apps and your AI — explained in plain language and priced honestly.</p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-6 lg:gap-5">
          <Tile
            className="md:col-span-2 lg:col-span-4"
            tag="Websites"
            title="A website that works beautifully on every phone."
            text="Fast, lovely and easy to find on Google — your photos, services, prices and timings, with WhatsApp and call buttons right where thumbs expect them."
            visual={<WebsiteVisual />}
          />
          <Tile
            className="lg:col-span-2"
            tag="AI assistants"
            title="A WhatsApp assistant that never sleeps."
            text="Answers the questions you hear fifty times a day, books customers in, and hands over to you anytime."
            visual={<ChatVisual />}
          />
          <Tile
            className="lg:col-span-2"
            tag="Booking & web apps"
            title="Bookings, orders and records in one place."
            text="Appointment systems, order dashboards, student portals and billing tools — built around how you already work."
            visual={<CalendarVisual />}
          />
          <Tile
            className="lg:col-span-2"
            tag="Automations"
            title="Reminders that send themselves."
            text="Confirmations, reminders, payment nudges and review requests — on time, every time, without anyone remembering."
            visual={<FlowVisual />}
          />
          <Tile
            className="lg:col-span-2"
            tag="Google presence"
            title="Show up when Ranchi searches."
            text="We set up and polish your Google Maps listing, connect it to your site and help you collect genuine reviews."
            visual={<MapVisual />}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease }}
          className="mt-5 grid items-center gap-6 overflow-hidden rounded-[28px] bg-ink p-6 text-ivory sm:p-8 lg:grid-cols-12"
        >
          <div className="min-w-0 lg:col-span-5">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-ochre">Care plan</p>
            <h3 className="mt-2 text-title">We don't disappear after launch.</h3>
            <p className="mt-2 text-ivory/70">Need a Diwali banner or a new price list? Just send us a WhatsApp — we'll handle it.</p>
          </div>
          <div className="mask-fade-x min-w-0 lg:col-span-7" aria-hidden="true">
            <Marquee duration={36} gap="0.75rem">
              {careItems.map((c) => (
                <span key={c} className="whitespace-nowrap rounded-full bg-ivory/[0.08] px-4 py-2.5 text-[0.875rem] ring-1 ring-ivory/10">
                  {c}
                </span>
              ))}
            </Marquee>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
