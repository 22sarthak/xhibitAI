import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Bot, Clock, Hand, Languages } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { chatScripts, type ChatScript, type ChatTurn } from "../../content/home";
import { track } from "../../lib/api";
import { ease } from "../../lib/motion";
import { cn, initials } from "../../lib/utils";
import { waHref, waMessage } from "../../lib/whatsapp";
import { PHONE, PhoneFrame } from "../device/frames";
import { Scaled } from "../device/Scaled";
import { ButtonLink } from "../ui/Button";
import { Eyebrow } from "../ui/Eyebrow";
import { WhatsAppDisc } from "../ui/icons";
import { Reveal, RevealHeading } from "../ui/Reveal";

type Msg = { id: number; bot: boolean; text: string; actions?: ChatTurn["actions"]; time: string };

const AVATAR: Record<ChatScript["slug"], string> = {
  clinics: "#0e5e5d",
  restaurants: "#7a2420",
  schools: "#1b2a4e",
  salons: "#6e3349",
};

const now = () => {
  const d = new Date();
  return `${((d.getHours() + 11) % 12) + 1}:${String(d.getMinutes()).padStart(2, "0")} ${d.getHours() >= 12 ? "PM" : "AM"}`;
};

let uid = 0;

function useChat(script: ChatScript) {
  const reduced = useReducedMotion();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [asked, setAsked] = useState<Set<string>>(new Set());
  const timers = useRef<number[]>([]);

  const reset = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setTyping(false);
    setAsked(new Set());
    setMessages([
      {
        id: ++uid,
        bot: true,
        time: now(),
        text: `Namaste! I'm the ${script.business} assistant. Ask me about timings, prices or bookings — any time of day.`,
      },
    ]);
  }, [script.business]);

  useEffect(() => {
    reset();
    return () => timers.current.forEach(window.clearTimeout);
  }, [reset]);

  const reply = useCallback(
    (userText: string, botText: string, actions?: ChatTurn["actions"]) => {
      setMessages((m) => [...m.map((x) => ({ ...x, actions: undefined })), { id: ++uid, bot: false, text: userText, time: now() }]);
      const delay = reduced ? 150 : 900 + Math.min(1300, botText.length * 11);
      timers.current.push(window.setTimeout(() => setTyping(true), reduced ? 0 : 350));
      timers.current.push(
        window.setTimeout(() => {
          setTyping(false);
          setMessages((m) => [...m, { id: ++uid, bot: true, text: botText, actions, time: now() }]);
        }, delay),
      );
    },
    [reduced],
  );

  const ask = useCallback(
    (turn: ChatTurn) => {
      if (typing) return;
      setAsked((s) => new Set(s).add(turn.q));
      reply(turn.q, turn.a, turn.actions);
    },
    [reply, typing],
  );

  return { messages, typing, asked, ask, reply, reset };
}

function ChatPhone({ script, chat }: { script: ChatScript; chat: ReturnType<typeof useChat> }) {
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [chat.messages, chat.typing]);

  return (
    <Scaled width={PHONE.w} height={PHONE.h}>
      <PhoneFrame chrome={{ bar: "#f7f5f2", tone: "dark" }}>
        <div className="flex h-full flex-col" style={{ fontFamily: '"Plus Jakarta Sans Variable", system-ui, sans-serif' }}>
          {/* chat header */}
          <div className="flex items-center gap-3 border-b border-black/[0.06] bg-[#f7f5f2] px-4 pb-3 pt-1">
            <svg width="11" height="18" viewBox="0 0 11 18" fill="none" stroke="#1d1a16" strokeWidth="2.2" aria-hidden="true">
              <path d="M9 2 2 9l7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="grid size-10 place-items-center rounded-full text-[15px] font-bold text-white" style={{ background: AVATAR[script.slug] }}>
              {initials(script.business)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 truncate text-[16px] font-semibold text-[#111]">
                {script.business}
                <svg width="15" height="15" viewBox="0 0 24 24" aria-label="Verified business">
                  <path d="M12 1.5 14.6 4l3.6-.4.9 3.5 3.1 1.9-1.4 3.4 1.4 3.4-3.1 1.9-.9 3.5-3.6-.4L12 22.5 9.4 20l-3.6.4-.9-3.5-3.1-1.9L3.2 12 1.8 8.6l3.1-1.9.9-3.5 3.6.4z" fill="#1fa855" />
                  <path d="m8 12.3 2.6 2.6L16.2 9" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </p>
              <p className="text-[12.5px] text-[#667]">{chat.typing ? "typing…" : "online · replies instantly"}</p>
            </div>
          </div>

          {/* messages */}
          <div
            ref={scroller}
            data-lenis-prevent
            className="no-scrollbar flex-1 overflow-y-auto overscroll-contain px-3 py-4"
            style={{
              background: "#efe9df",
              backgroundImage: "radial-gradient(rgba(120,100,70,.08) 1px, transparent 1px)",
              backgroundSize: "14px 14px",
            }}
          >
            <p className="mx-auto mb-3 w-fit rounded-lg bg-white/80 px-3 py-1 text-[11.5px] font-medium text-[#556]">Today</p>
            <div className="flex flex-col gap-2">
              <AnimatePresence initial={false}>
                {chat.messages.map((m) => (
                  <motion.div
                    key={m.id}
                    layout
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.35, ease }}
                    className={cn(
                      "max-w-[82%] rounded-2xl px-3 pb-1.5 pt-2 text-[14.5px] leading-snug text-[#111] shadow-[0_1px_1px_rgba(0,0,0,.08)]",
                      m.bot ? "self-start rounded-tl-sm bg-white" : "self-end rounded-tr-sm bg-[#d9fdd3]",
                    )}
                  >
                    <p>{m.text}</p>
                    <p className="mt-0.5 flex items-center justify-end gap-1 text-[10.5px] text-[#667]">
                      {m.time}
                      {!m.bot && (
                        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="#3b9ae1" strokeWidth="1.6" aria-hidden="true">
                          <path d="m1 5.5 3 3L10 1.5M6.5 8.5 7.5 9.5 14.5 1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </p>
                    {m.actions && (
                      <div className="-mx-3 mt-2 grid border-t border-black/[0.07]">
                        {m.actions.map((a) => (
                          <button
                            key={a.label}
                            type="button"
                            onClick={() => chat.reply(a.label, a.reply)}
                            className="border-b border-black/[0.05] py-2.5 text-center text-[14px] font-semibold text-[#0f8a6c] last:border-b-0"
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
                {chat.typing && (
                  <motion.div
                    key="typing"
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex w-fit gap-1 self-start rounded-2xl rounded-tl-sm bg-white px-3.5 py-3 shadow-[0_1px_1px_rgba(0,0,0,.08)]"
                  >
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="size-2 rounded-full bg-black/30"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: d * 0.15 }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* input */}
          <div className="flex items-center gap-2 bg-[#f7f5f2] px-3 pb-7 pt-2.5">
            <div className="flex h-11 flex-1 items-center rounded-full bg-white px-4 text-[14.5px] text-[#99a]">Message</div>
            <span className="grid size-11 place-items-center rounded-full bg-[#1fa855] text-white" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-2.1A7 7 0 0 0 19 12h-2Z" />
              </svg>
            </span>
          </div>
        </div>
      </PhoneFrame>
    </Scaled>
  );
}

const perks = [
  { icon: Clock, title: "Replies in seconds", text: "At 2 PM or 2 AM, every customer gets an answer." },
  { icon: Languages, title: "Hindi, English, Hinglish", text: "It understands how Ranchi actually types." },
  { icon: Bot, title: "Books and reminds", text: "Takes bookings and sends reminders on its own." },
  { icon: Hand, title: "You're in control", text: "Read every chat and step in whenever you like." },
];

export function AIAssistant() {
  const [index, setIndex] = useState(0);
  const script = chatScripts[index];
  const chat = useChat(script);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const reduced = useReducedMotion();

  // Play the first question once, when the section comes into view.
  useEffect(() => {
    if (!inView || reduced) return;
    const t = window.setTimeout(() => chat.ask(chatScripts[0].turns[0]), 900);
    return () => window.clearTimeout(t);
  }, [inView]); // play once on first view only

  return (
    <section id="ai" aria-labelledby="ai-title" className="relative px-2 sm:px-3">
      <div className="grain-light relative overflow-hidden rounded-[28px] bg-dusk text-ivory sm:rounded-[36px] lg:rounded-[44px]">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-10 size-[30rem] rounded-full bg-clay/25 blur-[110px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 bottom-0 size-[26rem] rounded-full bg-sal/30 blur-[110px]" />

        <div className="container-x section-y relative grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <Eyebrow no="04" tone="light">
              AI assistants
            </Eyebrow>
            <RevealHeading id="ai-title" text="Meet your new *24×7* assistant." className="mt-6 text-display" emClass="italic text-ochre" />
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[34rem] text-lead text-ivory/70">
                It answers the questions your staff hears fifty times a day — timings, prices, availability — and books customers in, right inside
                WhatsApp. Try it: pick a business and tap a question.
              </p>
            </Reveal>

            <Reveal delay={0.15} className="mt-9">
              <div role="tablist" aria-label="Choose a business" className="flex flex-wrap gap-2">
                {chatScripts.map((s, i) => (
                  <button
                    key={s.slug}
                    role="tab"
                    type="button"
                    aria-selected={i === index}
                    onClick={() => {
                      setIndex(i);
                      track("ai_demo_tab", { industry: s.slug });
                    }}
                    className={cn(
                      "relative rounded-full px-4 py-2 text-[0.9rem] font-semibold transition-colors",
                      i === index ? "text-ink" : "text-ivory/75 ring-1 ring-ivory/15 hover:text-ivory",
                    )}
                  >
                    {i === index && (
                      <motion.span layoutId="ai-tab" className="absolute inset-0 rounded-full bg-ivory" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                    )}
                    <span className="relative">{s.label}</span>
                  </button>
                ))}
              </div>
              <p className="mt-7 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-ivory/50">Try asking</p>
              <div className="mt-3 flex flex-col items-start gap-2">
                {script.turns.map((t) => (
                  <button
                    key={t.q}
                    type="button"
                    disabled={chat.typing}
                    onClick={() => chat.ask(t)}
                    className={cn(
                      "group flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-[0.95rem] ring-1 transition-[background-color,color] duration-300",
                      chat.asked.has(t.q) ? "bg-ivory/[0.04] text-ivory/45 ring-ivory/10" : "bg-ivory/[0.07] text-ivory ring-ivory/15 hover:bg-ivory/[0.12]",
                    )}
                  >
                    <span aria-hidden="true" className="text-ochre transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                    {t.q}
                  </button>
                ))}
                <button type="button" onClick={chat.reset} className="mt-1 text-[0.8125rem] font-medium text-ivory/50 underline-offset-4 hover:text-ivory hover:underline">
                  Restart chat
                </button>
              </div>
            </Reveal>
          </div>

          <div ref={ref} className="lg:col-span-5 lg:col-start-8">
            <motion.div
              className="mx-auto w-full max-w-[20rem] sm:max-w-[21rem]"
              initial={{ opacity: 0, y: 40, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.1, ease }}
            >
              <ChatPhone script={script} chat={chat} />
            </motion.div>
          </div>
        </div>

        <div className="container-x relative pb-16 sm:pb-20">
          <div className="grid gap-6 border-t border-ivory/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((p) => (
              <div key={p.title} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ivory/[0.07] text-ochre ring-1 ring-ivory/10">
                  <p.icon className="size-5" strokeWidth={1.7} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-sans text-[0.95rem] font-bold">{p.title}</h3>
                  <p className="mt-1 text-[0.875rem] text-ivory/60">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-3xl bg-ivory/[0.05] p-6 ring-1 ring-ivory/10 sm:flex-row sm:items-center">
            <p className="max-w-[46rem] text-[0.875rem] text-ivory/60">
              Built on the official WhatsApp Business Platform. Meta charges small fees for some messages (like reminders) — we include them clearly in
              your quote, so there are no surprises.
            </p>
            <ButtonLink
              href={waHref(waMessage({ topic: "a WhatsApp AI assistant" }))}
              external
              variant="light"
              icon={<WhatsAppDisc className="-ml-2 size-8" />}
              className="shrink-0 pl-2"
              onClick={() => track("whatsapp_click", { location: "ai" })}
            >
              Get an assistant
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
