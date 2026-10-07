import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { searchScenes } from "../../content/home";
import { industryBySlug } from "../../content/industries";
import { ease } from "../../lib/motion";
import { usePersonalization } from "../../lib/personalization";
import { PHONE, PhoneFrame } from "../device/frames";
import { Scaled } from "../device/Scaled";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal, RevealGroup, RevealHeading, RevealItem } from "../ui/Reveal";

const RIVALS: Record<string, [string, string]> = {
  restaurants: ["Royal Family Restaurant", "New Taste Corner"],
  clinics: ["Sunrise Child Care", "Healthy Kids Clinic"],
  salons: ["Glamour Beauty Parlour", "Style Point Unisex"],
};

const steps = [
  { title: "They search", text: "“Biryani near me.” “Child doctor in Bariatu.” People in Ranchi search like this every single day." },
  { title: "They compare", text: "Photos, reviews, prices and timings decide who gets the visit — often in under a minute." },
  { title: "They reach out", text: "One tap to call, WhatsApp or get directions. If it's easy, they come to you." },
];

function MiniStars() {
  return (
    <span className="inline-flex gap-[1px]" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 20 20">
          <path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z" fill="#f5a524" />
        </svg>
      ))}
    </span>
  );
}

function Rival({ name, meta }: { name: string; meta: string }) {
  return (
    <div className="flex gap-3 rounded-2xl p-3 opacity-60">
      <div className="size-[58px] shrink-0 rounded-xl bg-[#ece8e2]" />
      <div className="min-w-0 pt-0.5">
        <p className="truncate text-[15px] font-semibold text-[#3c3a37]">{name}</p>
        <p className="text-[12.5px] text-[#77736d]">{meta}</p>
        <p className="mt-1 text-[12px] text-[#9b968f]">No website · No photos</p>
      </div>
    </div>
  );
}

function SearchPhone() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduced = useReducedMotion();
  const { name } = usePersonalization();
  const [scene, setScene] = useState(0);
  const [typed, setTyped] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const s = searchScenes[scene];
  const industry = industryBySlug(s.slug)!;
  const businessName = name.trim() || industry.demo.name;

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setTyped(s.query.length);
      setShowResults(true);
      return;
    }
    let cancelled = false;
    const timers: number[] = [];
    setTyped(0);
    setShowResults(false);
    for (let i = 1; i <= s.query.length; i++) {
      timers.push(window.setTimeout(() => !cancelled && setTyped(i), 350 + i * 48));
    }
    const typingDone = 350 + s.query.length * 48;
    timers.push(window.setTimeout(() => !cancelled && setShowResults(true), typingDone + 450));
    timers.push(window.setTimeout(() => !cancelled && setScene((n) => (n + 1) % searchScenes.length), typingDone + 5200));
    return () => {
      cancelled = true;
      timers.forEach(window.clearTimeout);
    };
  }, [scene, inView, reduced, s.query.length]);

  const [rivalA, rivalB] = RIVALS[s.slug];

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[20.5rem]" aria-hidden="true">
      <Scaled width={PHONE.w} height={PHONE.h}>
        <PhoneFrame chrome={{ bar: "#ffffff", tone: "dark" }}>
          <div className="h-full bg-white px-4 pt-2 font-sans" style={{ fontFamily: '"Plus Jakarta Sans Variable", system-ui, sans-serif' }}>
            {/* search bar */}
            <div className="flex h-[52px] items-center gap-3 rounded-full bg-[#f3f1ee] px-4 shadow-[inset_0_0_0_1px_rgba(0,0,0,.04)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b6660" strokeWidth="2.2">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              <p className="min-w-0 flex-1 truncate text-[16px] text-[#1d1a16]">
                {s.query.slice(0, typed)}
                <span className="ml-[1px] inline-block h-[18px] w-[2px] translate-y-[3px] animate-pulse bg-[#c4532d]" />
              </p>
            </div>
            <div className="mt-3 flex gap-2 text-[13px] font-medium">
              {["All", "Maps", "Images", "Reviews"].map((t, i) => (
                <span key={t} className={i === 1 ? "rounded-full bg-[#1d1a16] px-3 py-1.5 text-white" : "rounded-full px-3 py-1.5 text-[#6b6660]"}>
                  {t}
                </span>
              ))}
            </div>

            {/* map view */}
            <div className="relative mt-3 h-[150px] overflow-hidden rounded-[20px] bg-[#ece6dc]">
              <svg viewBox="0 0 360 150" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
                <path d="M-10 112 C 70 92, 130 132, 210 104 S 330 72, 380 84" stroke="#cfe0e6" strokeWidth="12" fill="none" />
                <path d="M0 40 H360 M0 82 H360 M80 0 V150 M190 0 V150 M285 0 V150" stroke="#faf7f2" strokeWidth="6" />
                <path d="M0 140 L360 18" stroke="#faf7f2" strokeWidth="9" />
                <rect x="200" y="48" width="52" height="24" rx="5" fill="#d6e3c6" />
                <rect x="18" y="92" width="44" height="22" rx="5" fill="#d6e3c6" />
              </svg>
              <span className="absolute left-[22%] top-[30%] size-3 rounded-full bg-[#9b958c] ring-2 ring-white" />
              <span className="absolute left-[74%] top-[62%] size-3 rounded-full bg-[#9b958c] ring-2 ring-white" />
              <motion.span
                className="absolute left-[50%] top-[22%] -translate-x-1/2"
                animate={showResults ? { y: [0, -10, 0], scale: [1, 1.15, 1] } : { y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <svg width="26" height="34" viewBox="0 0 38 48" className="drop-shadow-md">
                  <path d="M19 47s17-15.6 17-28A17 17 0 0 0 2 19c0 12.4 17 28 17 28z" fill="#c4532d" />
                  <circle cx="19" cy="19" r="7" fill="#fff" />
                </svg>
              </motion.span>
            </div>

            <AnimatePresence mode="wait">
              {showResults ? (
                <motion.div
                  key={`r-${scene}`}
                  className="mt-3 flex flex-col gap-1.5"
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18 } } }}
                >
                  <motion.div variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}>
                    <Rival name={rivalA} meta={`${s.category.split(" · ")[0]} · 1.8 km`} />
                  </motion.div>
                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 14, scale: 0.97 }, show: { opacity: 1, y: 0, scale: 1 } }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className="relative rounded-[22px] bg-white p-3 shadow-[0_0_0_2px_#c4532d,0_18px_40px_-14px_rgba(196,83,45,.55)]"
                  >
                    <span className="absolute -top-3 right-4 rounded-full bg-[#c4532d] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white">
                      That's you
                    </span>
                    <div className="flex gap-3">
                      <img src={`/demos/${s.slug}/hero.webp`} alt="" className="size-[72px] shrink-0 rounded-xl object-cover" />
                      <div className="min-w-0">
                        <p className="truncate text-[16px] font-bold text-[#1d1a16]">{businessName}</p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-[#4a4641]">
                          <b>{s.rating}</b> <MiniStars /> <span className="text-[#77736d]">({s.reviews})</span>
                        </p>
                        <p className="text-[12.5px] text-[#4a4641]">{s.category}</p>
                        <p className="text-[12.5px] font-semibold text-[#15803d]">{s.status}</p>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-4 gap-1.5">
                      {["Website", "Call", "Directions", "WhatsApp"].map((a, i) => (
                        <span
                          key={a}
                          className={
                            i === 0
                              ? "rounded-full bg-[#1d1a16] py-2 text-center text-[11.5px] font-semibold text-white"
                              : "rounded-full bg-[#f3f1ee] py-2 text-center text-[11.5px] font-semibold text-[#1d1a16]"
                          }
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                  <motion.div variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}>
                    <Rival name={rivalB} meta={`${s.category.split(" · ")[0]} · 3.2 km`} />
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div key={`l-${scene}`} className="mt-6 flex flex-col gap-4 px-1" exit={{ opacity: 0 }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex gap-3">
                      <div className="size-[58px] animate-pulse rounded-xl bg-[#f1eee9]" />
                      <div className="flex-1 space-y-2 pt-1">
                        <div className="h-3.5 w-3/4 animate-pulse rounded-full bg-[#f1eee9]" />
                        <div className="h-3 w-1/2 animate-pulse rounded-full bg-[#f1eee9]" />
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </PhoneFrame>
      </Scaled>
    </div>
  );
}

export function SearchStory() {
  return (
    <section id="why" aria-labelledby="why-title" className="section-y relative">
      <div className="container-x grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <Eyebrow no="01">Why go online</Eyebrow>
          <RevealHeading
            id="why-title"
            text="Your next customer is *searching* right now."
            className="mt-6 text-display text-ink"
          />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-[34rem] text-lead text-ink-soft">
              Before they visit a restaurant, a doctor or a salon, people check their phone. If your business isn't there — with photos, timings and
              a way to reach you — they simply choose someone who is.
            </p>
          </Reveal>
          <RevealGroup className="mt-10 grid gap-6" stagger={0.1}>
            {steps.map((st, i) => (
              <RevealItem key={st.title} className="flex gap-5">
                <span className="tabular mt-0.5 font-display text-[1.75rem] leading-none text-clay">0{i + 1}</span>
                <div>
                  <h3 className="font-sans text-[1.0625rem] font-bold">{st.title}</h3>
                  <p className="mt-1 text-ink-soft">{st.text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal delay={0.15}>
            <p className="mt-10 border-l-2 border-ochre pl-5 font-display text-[1.35rem] italic leading-snug text-ink">
              Be the one they find — and the one they trust.
            </p>
          </Reveal>
        </div>
        <div className="relative lg:col-span-6 lg:col-start-7">
          <div aria-hidden="true" className="absolute inset-x-[8%] inset-y-[6%] rounded-[48px] bg-linear-to-br from-blush via-sand to-ochre-soft/60" />
          <motion.div
            className="relative py-10 sm:py-14"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.1, ease }}
          >
            <SearchPhone />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
