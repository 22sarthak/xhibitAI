import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePageVisible } from "../../lib/hooks";
import { cn } from "../../lib/utils";
import { WhatsAppIcon } from "../ui/icons";

/* Two self-playing phone screens for the Services bento:
   a WhatsApp chat where a customer talks to the AI assistant, and an iPhone lock screen receiving automated messages.
   Both only run while on screen and the tab is visible, and stay still for reduced motion. */

const SYS_FONT = { fontFamily: '"Plus Jakarta Sans Variable", system-ui, -apple-system, sans-serif' };

/** Resolves after `ms`, or rejects once the run is cancelled, so a script can be written as straight-line async code. */
function useRunner(active: boolean, run: (wait: (ms: number) => Promise<void>) => Promise<void>) {
  const runRef = useRef(run);
  useLayoutEffect(() => {
    runRef.current = run;
  });
  useEffect(() => {
    if (!active) return;
    let alive = true;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve, reject) => {
        timers.push(window.setTimeout(() => (alive ? resolve() : reject(new Error("stopped"))), ms));
      });
    runRef.current(wait).catch(() => {});
    return () => {
      alive = false;
      timers.forEach(window.clearTimeout);
    };
  }, [active]);
}

function StatusBar({ time, light }: { time: string; light?: boolean }) {
  const c = light ? "#fff" : "#0b0b0c";
  return (
    <div className="relative flex h-9 shrink-0 items-center justify-between px-6 text-[13px] font-semibold" style={{ color: c }}>
      <span>{time}</span>
      <span className="absolute left-1/2 top-2 h-[22px] w-[78px] -translate-x-1/2 rounded-full bg-black" />
      <span className="flex items-center gap-1.5">
        <svg width="16" height="10" viewBox="0 0 17 11" fill={c} aria-hidden="true">
          <rect x="0" y="7" width="3" height="4" rx="1" />
          <rect x="4.5" y="5" width="3" height="6" rx="1" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
          <rect x="13.5" y="0" width="3" height="11" rx="1" />
        </svg>
        <svg width="22" height="11" viewBox="0 0 25 12" fill="none" aria-hidden="true">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.2" stroke={c} strokeOpacity=".4" />
          <rect x="2" y="2" width="16" height="8" rx="2" fill={c} />
          <path d="M23 4v4c.8-.3 1.3-1 1.3-2s-.5-1.7-1.3-2Z" fill={c} fillOpacity=".4" />
        </svg>
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------- live chat */

type Step = { type: string; text: string; chips?: string[] } | { tap: string; text: string };
type Convo = { business: string; initials: string; color: string; steps: Step[] };

const CONVOS: Convo[] = [
  {
    business: "Arogya Clinic",
    initials: "AC",
    color: "#0e5e5d",
    steps: [
      { type: "Is Dr. Sinha available tomorrow?", text: "Yes! Dr. Ananya Sinha has slots tomorrow at 10:30 AM and 4:00 PM. Which one should I book?", chips: ["10:30 AM", "4:00 PM"] },
      { tap: "10:30 AM", text: "Done ✓ You're booked for 10:30 AM tomorrow. Token A-14. I'll remind you two hours before." },
    ],
  },
  {
    business: "Kesar Kitchen",
    initials: "KK",
    color: "#7a2420",
    steps: [
      { type: "Aaj raat 4 logon ke liye table milega?", text: "Haan ji! Tonight we have 8:00 PM and 8:30 PM free for 4. Which one works?", chips: ["8:00 PM", "8:30 PM"] },
      { tap: "8:30 PM", text: "Table for 4 at 8:30 PM is confirmed. See you tonight! 🙂" },
    ],
  },
  {
    business: "Aura Salon",
    initials: "AS",
    color: "#6e3349",
    steps: [
      { type: "Can I book a bridal trial this Saturday?", text: "Of course! Saturday has 11:00 AM and 3:30 PM open with our senior stylist. Shall I hold one?", chips: ["11:00 AM", "3:30 PM"] },
      { tap: "11:00 AM", text: "Booked for Saturday, 11:00 AM ✓ Please come 10 minutes early. We'll send a reminder." },
    ],
  },
];

type Msg = { id: number; bot: boolean; text: string; time: string; chips?: string[] };
let mid = 0;

const greeting = (c: Convo): Msg => ({
  id: ++mid,
  bot: true,
  time: "9:41 AM",
  text: `Namaste! I'm the ${c.business} assistant. Ask me about timings, prices or bookings.`,
});

export function LiveChat() {
  const reduced = useReducedMotion();
  const visible = usePageVisible();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const convoIndex = useRef(0);

  const first = CONVOS[0];
  const [convo, setConvo] = useState(first);
  const [msgs, setMsgs] = useState<Msg[]>(() => [
    greeting(first),
    { id: ++mid, bot: false, time: "9:41 AM", text: (first.steps[0] as { type: string }).type },
    { id: ++mid, bot: true, time: "9:41 AM", text: first.steps[0].text, chips: (first.steps[0] as { chips?: string[] }).chips },
  ]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [pressed, setPressed] = useState<string | null>(null);

  useRunner(inView && visible && !reduced, async (wait) => {
    for (;;) {
      const c = CONVOS[convoIndex.current % CONVOS.length];
      setConvo(c);
      setMsgs([greeting(c)]);
      setDraft("");
      setPressed(null);
      setTyping(false);
      await wait(1400);

      for (const step of c.steps) {
        let said: string;
        if ("type" in step) {
          for (let i = 1; i <= step.type.length; i++) {
            setDraft(step.type.slice(0, i));
            await wait(38 + Math.random() * 55);
          }
          await wait(420);
          said = step.type;
          setDraft("");
        } else {
          await wait(900);
          setPressed(step.tap);
          await wait(380);
          said = step.tap;
          setPressed(null);
        }
        setMsgs((m) => [...m.map((x) => ({ ...x, chips: undefined })), { id: ++mid, bot: false, time: "9:42 AM", text: said }]);
        await wait(550);
        setTyping(true);
        await wait(1100 + Math.min(900, step.text.length * 9));
        setTyping(false);
        setMsgs((m) => [...m, { id: ++mid, bot: true, time: "9:42 AM", text: step.text, chips: "chips" in step ? step.chips : undefined }]);
      }
      await wait(3600);
      convoIndex.current++;
    }
  });

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 flex flex-col overflow-hidden rounded-[22px] bg-[#efe9df] ring-1 ring-ink/[0.06]" style={SYS_FONT}>
      <div className="shrink-0 bg-[#f7f5f2]">
        <StatusBar time="9:41" />
        <div className="flex items-center gap-2.5 border-b border-black/[0.06] px-3.5 pb-2.5 pt-1">
          <svg width="9" height="15" viewBox="0 0 11 18" fill="none" stroke="#0b0b0c" strokeWidth="2.2">
            <path d="M9 2 2 9l7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="grid size-9 shrink-0 place-items-center rounded-full text-[12.5px] font-bold text-white transition-colors duration-500" style={{ background: convo.color }}>
            {convo.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 truncate text-[14.5px] font-semibold text-[#111]">
              {convo.business}
              <svg width="13" height="13" viewBox="0 0 24 24">
                <path d="M12 1.5 14.6 4l3.6-.4.9 3.5 3.1 1.9-1.4 3.4 1.4 3.4-3.1 1.9-.9 3.5-3.6-.4L12 22.5 9.4 20l-3.6.4-.9-3.5-3.1-1.9L3.2 12 1.8 8.6l3.1-1.9.9-3.5 3.6.4z" fill="#1fa855" />
                <path d="m8 12.3 2.6 2.6L16.2 9" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </p>
            <p className={cn("text-[11.5px]", typing ? "text-[#1fa855]" : "text-[#667]")}>{typing ? "typing…" : "online"}</p>
          </div>
        </div>
      </div>

      <div
        className="flex min-h-0 flex-1 flex-col justify-end gap-1.5 overflow-hidden px-2.5 pb-2.5"
        style={{ backgroundImage: "radial-gradient(rgba(120,100,70,.08) 1px, transparent 1px)", backgroundSize: "14px 14px" }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.p key={`today-${convo.business}`} layout="position" className="mx-auto mb-1 w-fit shrink-0 rounded-md bg-white/85 px-2.5 py-0.5 text-[10.5px] font-medium text-[#556]">
            Today
          </motion.p>
          {msgs.map((m) => (
            <motion.div
              key={m.id}
              layout="position"
              initial={{ opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "max-w-[84%] shrink-0 rounded-[14px] px-2.5 pb-1 pt-1.5 text-[13px] leading-snug text-[#111] shadow-[0_1px_1px_rgba(0,0,0,.08)]",
                m.bot ? "self-start rounded-tl-[4px] bg-white" : "self-end rounded-tr-[4px] bg-[#d9fdd3]",
              )}
            >
              <p>{m.text}</p>
              <p className="mt-0.5 flex items-center justify-end gap-1 text-[9.5px] text-[#667]">
                {m.time}
                {!m.bot && (
                  <svg width="14" height="9" viewBox="0 0 16 10" fill="none" stroke="#3b9ae1" strokeWidth="1.6">
                    <path d="m1 5.5 3 3L10 1.5M6.5 8.5 7.5 9.5 14.5 1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </p>
              {m.chips && (
                <div className="-mx-2.5 mt-1.5 grid grid-cols-2 border-t border-black/[0.07]">
                  {m.chips.map((chip) => (
                    <span
                      key={chip}
                      className={cn(
                        "py-2 text-center text-[12.5px] font-semibold text-[#0f8a6c] transition-colors duration-150 first:border-r first:border-black/[0.07]",
                        pressed === chip && "bg-[#0f8a6c]/12",
                      )}
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
          {typing && (
            <motion.div
              key="typing"
              layout="position"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              className="flex w-fit shrink-0 gap-1 self-start rounded-[14px] rounded-tl-[4px] bg-white px-3 py-2.5 shadow-[0_1px_1px_rgba(0,0,0,.08)]"
            >
              {[0, 1, 2].map((d) => (
                <motion.span key={d} className="size-1.5 rounded-full bg-black/35" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: d * 0.15 }} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex shrink-0 items-center gap-2 bg-[#f7f5f2] px-2.5 py-2">
        <div className="flex h-9 min-w-0 flex-1 items-center rounded-full bg-white px-3.5 text-[13px]">
          {draft ? (
            <span className="truncate text-[#111]">
              {draft}
              <span className="ml-px inline-block h-[1.05em] w-[1.5px] translate-y-[2px] animate-pulse bg-[#1fa855]" />
            </span>
          ) : (
            <span className="text-[#99a]">Message</span>
          )}
        </div>
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#1fa855] text-white">
          {draft ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2z" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-2.1A7 7 0 0 0 19 12h-2Z" />
            </svg>
          )}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------- live notifications */

const NOTES = [
  { from: "Kesar Kitchen", text: "Your table for 4 is confirmed for 8:30 PM tonight. See you soon!" },
  { from: "Arogya Clinic", text: "Reminder: your appointment with Dr. Sinha is at 10:30 AM tomorrow. Token A-14." },
  { from: "Shree Traders", text: "Payment of ₹12,400 received from Gupta Stores via UPI. Thank you!" },
  { from: "Aura Salon", text: "How was your visit today? Tap to leave us a quick review ⭐" },
  { from: "Sal Valley School", text: "Term 2 fee of ₹18,500 is due on 10 Nov. Pay securely via UPI here." },
  { from: "Tana Bana", text: "Your order #TB-2041 has shipped! It should reach you by Monday." },
  { from: "Pulse Fitness", text: "Your 7:00 AM HIIT class is booked for tomorrow. Bring water! 💪" },
  { from: "Palash Residency", text: "Check-in from 12 PM tomorrow. Room 204 is ready for you." },
];

type Note = { key: number; i: number; at: number };
const START_MIN = 9 * 60 + 41;
const clock = (m: number) => `${((Math.floor(m / 60) + 11) % 12) + 1}:${String(m % 60).padStart(2, "0")}`;

export function LiveNotifications() {
  const reduced = useReducedMotion();
  const visible = usePageVisible();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const next = useRef(3);
  const keyRef = useRef(3);

  const [minute, setMinute] = useState(START_MIN);
  const [notes, setNotes] = useState<Note[]>([
    { key: 2, i: 2, at: START_MIN - 9 },
    { key: 1, i: 1, at: START_MIN - 2 },
    { key: 0, i: 0, at: START_MIN },
  ]);

  useRunner(inView && visible && !reduced, async (wait) => {
    let now = minute;
    for (;;) {
      await wait(2600 + Math.random() * 1200);
      now += 1 + Math.floor(Math.random() * 3);
      const i = next.current++ % NOTES.length;
      const at = now;
      setMinute(at);
      setNotes((n) => [...n.slice(-3), { key: ++keyRef.current, i, at }]);
    }
  });

  const shown = [...notes].reverse().slice(0, 3);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 flex flex-col overflow-hidden rounded-[22px]"
      style={{ ...SYS_FONT, background: "radial-gradient(120% 80% at 15% 0%, #4361f0 0%, transparent 60%), radial-gradient(100% 90% at 100% 100%, #e0467a 0%, transparent 60%), linear-gradient(160deg, #2a3fd8 0%, #6a46d9 55%, #b8378f 100%)" }}
    >
      <StatusBar time={clock(minute)} light />
      <div className="mt-1 shrink-0 text-center text-white">
        <p className="text-[13px] font-medium text-white/85">Friday, 6 November</p>
        <p className="mt-0.5 text-[3.4rem] font-semibold leading-none tracking-[-0.03em] tabular-nums">{clock(minute)}</p>
      </div>

      <div
        className="relative mt-4 flex min-h-0 flex-1 flex-col gap-2 px-2.5"
        style={{ maskImage: "linear-gradient(to bottom, #000 72%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, #000 72%, transparent)" }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {shown.map((n) => {
            const note = NOTES[n.i];
            const age = minute - n.at;
            return (
              <motion.div
                key={n.key}
                layout="position"
                initial={{ opacity: 0, y: -18, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.25 } }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="flex shrink-0 gap-2.5 rounded-[18px] bg-white/[0.78] p-2.5 shadow-[0_6px_18px_-10px_rgb(0_0_0/0.45)] backdrop-blur-xl"
              >
                <span className="grid size-[34px] shrink-0 place-items-center rounded-[9px] bg-[#25d366] text-white">
                  <WhatsAppIcon className="size-[19px]" />
                </span>
                <span className="min-w-0 flex-1 text-[12.5px] leading-snug text-[#111]">
                  <span className="flex items-baseline justify-between gap-2">
                    <b className="truncate font-semibold">{note.from}</b>
                    <span className="shrink-0 text-[11px] text-black/45">{age === 0 ? "now" : `${age}m ago`}</span>
                  </span>
                  <span className="line-clamp-2 text-black/75">{note.text}</span>
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
