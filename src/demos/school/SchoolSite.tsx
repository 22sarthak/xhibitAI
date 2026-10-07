import "@fontsource-variable/lexend";
import { Bus, Download, FlaskConical, Library, Monitor, ShieldCheck, Trophy, Volleyball } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, type CSSProperties } from "react";
import { useScreen } from "../../components/device/DeviceScreen";
import { cn } from "../../lib/utils";
import { Avatar, DemoImg, SuccessTick, Toast, realSiteNote, useToast, type DemoProps } from "../kit";

/* ── Sal Valley Public School · CBSE, Nursery to XII ─────────────────────── */

const C = { navy: "#1b2a4e", deep: "#13213f", sun: "#f6c445", sky: "#eaf1fe", ink: "#16213b", line: "rgba(22,33,59,.09)" };
const font: CSSProperties = { fontFamily: '"Lexend Variable", system-ui, sans-serif', color: C.ink };
const img = (n: string) => `/demos/schools/${n}.webp`;

const NOTICES = [
  { d: "12", m: "Oct", title: "Parent–Teacher Meeting for Classes VI–VIII", tag: "PTM", fresh: true },
  { d: "05", m: "Oct", title: "Durga Puja holidays: 9 Oct to 14 Oct", tag: "Holiday", fresh: true },
  { d: "28", m: "Sep", title: "Inter-house science exhibition — results", tag: "Event" },
  { d: "20", m: "Sep", title: "Half-yearly exam datesheet (Classes I–XII)", tag: "Exam" },
];

const TOPPERS = [
  { name: "Ananya Kumari", score: "98.2%", stream: "Class XII · Science", c: ["#1b2a4e", "#4a68bd"] },
  { name: "Rohit Mahto", score: "97.6%", stream: "Class XII · Commerce", c: ["#9a5b13", "#e0a24b"] },
  { name: "Sneha Tirkey", score: "97.4%", stream: "Class X", c: ["#0e6f6e", "#56b3a3"] },
];

const FACILITIES = [
  { icon: Monitor, name: "Smart classrooms" },
  { icon: FlaskConical, name: "Science & computer labs" },
  { icon: Library, name: "Library, 12,000 books" },
  { icon: Volleyball, name: "Sports ground & coaching" },
  { icon: Bus, name: "12 bus routes, GPS-tracked" },
  { icon: ShieldCheck, name: "CCTV & safe campus" },
];

const CLASSES = ["Nursery", "LKG", "UKG", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "XI"];

function Crest({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <path d="M20 2 35 7v12c0 9.5-6.5 16.5-15 19C11.5 35.5 5 28.5 5 19V7z" fill={C.sun} />
      <path d="M20 5.5 32 9.6V19c0 7.8-5.1 13.7-12 16-6.9-2.3-12-8.2-12-16V9.6z" fill={C.navy} />
      <path d="M20 11c4.2 3.3 6 7 5.2 11.2-.6 3.2-2.6 5.5-5.2 6.8-2.6-1.3-4.6-3.6-5.2-6.8C14 18 15.8 14.3 20 11z" fill={C.sun} />
      <path d="M20 13v16" stroke={C.navy} strokeWidth="1.4" />
    </svg>
  );
}

export default function SchoolSite({ name, area }: DemoProps) {
  const { mode, scrollToSection } = useScreen();
  const desktop = mode === "desktop";
  const [toast, showToast] = useToast(3400);
  const [step, setStep] = useState(0);
  const [klass, setKlass] = useState("I");
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="relative min-h-full" style={{ ...font, background: "#ffffff" }}>
      {/* Ticker */}
      <div className="overflow-hidden whitespace-nowrap py-2 text-[12.5px] font-medium text-white" style={{ background: C.deep }}>
        <div className="inline-flex animate-marquee gap-10 [--marquee-duration:24s]">
          {[0, 1].map((k) => (
            <span key={k} className="inline-flex gap-10 pl-4" aria-hidden={k === 1}>
              <span>
                <b style={{ color: C.sun }}>Admissions open</b> for session 2027–28
              </span>
              <span>Annual Sports Day · 14 December</span>
              <span>PTM for Classes VI–VIII · 12 October</span>
              <span>Durga Puja holidays · 9–14 October</span>
            </span>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 px-5 py-3 text-white @3xl:px-12" style={{ background: C.navy }}>
        <div className="flex min-w-0 items-center gap-2.5">
          <Crest />
          <div className="min-w-0">
            <p className="truncate text-[16px] font-semibold leading-tight">{name}</p>
            <p className="text-[11px] text-white/60">CBSE · Nursery to XII · {area}</p>
          </div>
        </div>
        <nav className="hidden items-center gap-8 text-[14px] text-white/80 @3xl:flex" aria-label="Demo menu">
          {[
            ["admissions", "Admissions"],
            ["notices", "Notices"],
            ["results", "Results"],
            ["facilities", "Campus"],
            ["portal", "Parent portal"],
          ].map(([id, label]) => (
            <button key={id} type="button" onClick={() => scrollToSection(id)} className="hover:text-white">
              {label}
            </button>
          ))}
        </nav>
        <button type="button" onClick={() => scrollToSection("admissions")} className="shrink-0 rounded-full px-4 py-2 text-[13.5px] font-semibold" style={{ background: C.sun, color: C.navy }}>
          Apply
        </button>
      </header>

      {/* Hero */}
      <section data-section="top" className="relative h-[480px] overflow-hidden @3xl:h-[560px]">
        <DemoImg src={img("hero")} alt="Smiling students in school uniform" eager />
        <div className="absolute inset-0 bg-linear-to-t from-[#13213f] via-[#13213f]/55 to-[#13213f]/10 @3xl:bg-linear-to-r @3xl:from-[#13213f]/95 @3xl:via-[#13213f]/55 @3xl:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 text-white @3xl:inset-y-0 @3xl:flex @3xl:max-w-[640px] @3xl:flex-col @3xl:justify-center @3xl:p-14">
          <span className="w-fit rounded-full px-3 py-1 text-[12px] font-semibold" style={{ background: C.sun, color: C.navy }}>
            Admissions open · 2027–28
          </span>
          <h1 className="mt-4 text-[38px] font-semibold leading-[1.05] tracking-[-0.03em] @3xl:text-[60px]">
            Where curious minds <span style={{ color: C.sun }}>grow.</span>
          </h1>
          <p className="mt-3 text-[14.5px] text-white/80 @3xl:text-[17px]">Nurturing confident, kind and capable young people in Ranchi since 1998.</p>
          <div className="mt-6 flex gap-2.5">
            <button type="button" onClick={() => scrollToSection("admissions")} className="flex-1 rounded-full py-3.5 text-[14.5px] font-semibold @3xl:flex-none @3xl:px-7" style={{ background: C.sun, color: C.navy }}>
              Apply for admission
            </button>
            <button type="button" onClick={() => showToast(realSiteNote("parents pick a date and time for a guided campus visit."))} className="flex-1 rounded-full bg-white/10 py-3.5 text-[14.5px] font-semibold ring-1 ring-white/35 backdrop-blur @3xl:flex-none @3xl:px-7">
              Visit campus
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-px @3xl:grid-cols-4" style={{ background: C.line }}>
        {[
          ["1,800+", "Students"],
          ["95", "Teachers"],
          ["28", "Years of excellence"],
          ["100%", "Class X results"],
        ].map(([n, l]) => (
          <div key={l} className="bg-white px-5 py-5 @3xl:px-12 @3xl:py-7">
            <p className="text-[28px] font-semibold tracking-[-0.03em] @3xl:text-[38px]" style={{ color: C.navy }}>
              {n}
            </p>
            <p className="text-[12.5px] text-black/50">{l}</p>
          </div>
        ))}
      </div>

      {/* Notices */}
      <section data-section="notices" className="px-5 pt-12 @3xl:grid @3xl:grid-cols-[1fr_1.4fr] @3xl:gap-14 @3xl:px-12 @3xl:pt-20">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#b7860b" }}>
            Notice board
          </p>
          <h2 className="mt-1 text-[28px] font-semibold leading-tight tracking-[-0.02em] @3xl:text-[40px]">What's happening at school</h2>
          <p className="mt-2 text-[14px] text-black/55">Circulars, holidays and exam dates — posted once, seen by every parent.</p>
        </div>
        <ul className="mt-5 grid gap-2.5 @3xl:mt-0">
          {NOTICES.map((n) => (
            <li key={n.title}>
              <button
                type="button"
                onClick={() => showToast(realSiteNote("the circular opens as a PDF parents can save."))}
                className="flex w-full items-center gap-4 rounded-2xl p-3 text-left ring-1 transition-colors hover:bg-[#f7f9ff]"
                style={{ ["--tw-ring-color" as string]: C.line }}
              >
                <span className="grid w-[52px] shrink-0 place-items-center rounded-xl py-1.5 text-center" style={{ background: C.sky, color: C.navy }}>
                  <span className="text-[19px] font-semibold leading-none">{n.d}</span>
                  <span className="text-[11px] font-medium">{n.m}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black/45">{n.tag}</span>
                    {n.fresh && (
                      <span className="rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase" style={{ background: C.sun, color: C.navy }}>
                        New
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-[14.5px] font-medium leading-snug">{n.title}</span>
                </span>
                <Download className="size-4 shrink-0 text-black/35" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Admissions */}
      <section data-section="admissions" className="mt-12 px-5 py-12 @3xl:mt-20 @3xl:grid @3xl:grid-cols-2 @3xl:items-center @3xl:gap-14 @3xl:px-12 @3xl:py-20" style={{ background: C.sky }}>
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: C.navy }}>
            Admissions 2027–28
          </p>
          <h2 className="mt-1 text-[28px] font-semibold leading-tight tracking-[-0.02em] @3xl:text-[40px]">Three simple steps to join us</h2>
          <ol className="mt-5 grid gap-3">
            {["Send an enquiry (2 minutes)", "Campus visit & friendly interaction", "Confirm the seat & pay online"].map((s, i) => (
              <li key={s} className="flex items-center gap-3 text-[14.5px]">
                <span className="grid size-8 shrink-0 place-items-center rounded-full text-[13px] font-semibold text-white" style={{ background: C.navy }}>
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-7 rounded-[24px] bg-white p-5 shadow-[0_20px_40px_-20px_rgba(27,42,78,.35)] @3xl:mt-0 @3xl:p-7">
          <AnimatePresence mode="wait" initial={false}>
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                <p className="text-[12px] font-semibold text-black/45">Step 1 of 2 · About your child</p>
                <label className="mt-3 block text-[13px] font-medium">
                  Child's name
                  <input defaultValue="Aarav Kumar" className="mt-1.5 w-full rounded-xl px-3.5 py-3 text-[15px] ring-1 focus:outline-none focus:ring-2" style={{ ["--tw-ring-color" as string]: C.line }} />
                </label>
                <p className="mt-4 text-[13px] font-medium">Applying for class</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {CLASSES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setKlass(c)}
                      className="rounded-full px-3 py-1.5 text-[13px] font-medium ring-1"
                      style={klass === c ? { background: C.navy, color: "#fff", ["--tw-ring-color" as string]: C.navy } : { ["--tw-ring-color" as string]: C.line }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setStep(1)} className="mt-5 w-full rounded-full py-3.5 text-[15px] font-semibold" style={{ background: C.sun, color: C.navy }}>
                  Continue
                </button>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                <p className="text-[12px] font-semibold text-black/45">Step 2 of 2 · Parent details</p>
                <label className="mt-3 block text-[13px] font-medium">
                  Parent's name
                  <input defaultValue="Sunita Devi" className="mt-1.5 w-full rounded-xl px-3.5 py-3 text-[15px] ring-1 focus:outline-none focus:ring-2" style={{ ["--tw-ring-color" as string]: C.line }} />
                </label>
                <label className="mt-3 block text-[13px] font-medium">
                  Mobile number
                  <input defaultValue="98765 43210" inputMode="tel" className="mt-1.5 w-full rounded-xl px-3.5 py-3 text-[15px] ring-1 focus:outline-none focus:ring-2" style={{ ["--tw-ring-color" as string]: C.line }} />
                </label>
                <div className="mt-5 flex gap-2">
                  <button type="button" onClick={() => setStep(0)} className="rounded-full px-5 py-3.5 text-[14px] font-semibold ring-1" style={{ ["--tw-ring-color" as string]: C.line }}>
                    Back
                  </button>
                  <button type="button" onClick={() => setStep(2)} className="flex-1 rounded-full py-3.5 text-[15px] font-semibold text-white" style={{ background: C.navy }}>
                    Send enquiry
                  </button>
                </div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-2 text-center">
                <SuccessTick color={C.navy} size={58} />
                <p className="mt-3 text-[19px] font-semibold">Enquiry received!</p>
                <p className="mt-1 text-[13.5px] text-black/55">
                  Reference <b className="text-black">SV-2027-0142</b> · Class {klass}
                </p>
                <p className="mt-3 rounded-xl p-3 text-[12.5px] leading-relaxed" style={{ background: C.sky }}>
                  {realSiteNote("the admissions office gets this instantly, and the parent receives the brochure and fee details on WhatsApp.")}
                </p>
                <button type="button" onClick={() => setStep(0)} className="mt-4 text-[13px] font-semibold underline underline-offset-4">
                  Start again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Results */}
      <section data-section="results" className="px-5 pt-12 @3xl:px-12 @3xl:pt-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#b7860b" }}>
              Board results 2026
            </p>
            <h2 className="mt-1 text-[28px] font-semibold leading-tight tracking-[-0.02em] @3xl:text-[40px]">Our toppers</h2>
          </div>
          <Trophy className="size-9" style={{ color: C.sun }} />
        </div>
        <div className="mt-5 grid gap-3 @3xl:grid-cols-3 @3xl:gap-5">
          {TOPPERS.map((s) => (
            <div key={s.name} className="flex items-center gap-4 rounded-[22px] p-4 ring-1" style={{ ["--tw-ring-color" as string]: C.line }}>
              <Avatar name={s.name} from={s.c[0]} to={s.c[1]} size={52} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15.5px] font-semibold">{s.name}</p>
                <p className="text-[12.5px] text-black/50">{s.stream}</p>
              </div>
              <p className="text-[24px] font-semibold tracking-[-0.03em]" style={{ color: C.navy }}>
                {s.score}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 rounded-2xl px-4 py-3 text-[13.5px] font-medium" style={{ background: "#fff7dc" }}>
          Class X: 100% pass · 46 students scored above 90%
        </p>
      </section>

      {/* Facilities */}
      <section data-section="facilities" className="px-5 pt-12 @3xl:px-12 @3xl:pt-20">
        <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] @3xl:text-[40px]">Life on campus</h2>
        <div className="mt-5 grid grid-cols-2 gap-2.5 @3xl:grid-cols-4 @3xl:gap-4">
          {[
            ["classroom", "Smart classrooms"],
            ["library", "Library"],
            ["sports", "Morning assembly & sports"],
            ["building", "Our campus"],
          ].map(([src, cap], i) => (
            <figure key={src} className={cn("relative overflow-hidden rounded-[20px]", i === 2 ? "col-span-2 h-[150px] @3xl:col-span-1 @3xl:h-[220px]" : "h-[130px] @3xl:h-[220px]")}>
              <DemoImg src={img(src)} alt={cap} />
              <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/65 to-transparent p-3 text-[12.5px] font-medium text-white">{cap}</figcaption>
            </figure>
          ))}
        </div>
        <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 @3xl:grid-cols-6">
          {FACILITIES.map((f) => (
            <li key={f.name} className="flex items-center gap-2.5 text-[13px] font-medium">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl" style={{ background: C.sky, color: C.navy }}>
                <f.icon className="size-[18px]" strokeWidth={1.9} />
              </span>
              {f.name}
            </li>
          ))}
        </ul>
      </section>

      {/* Parent portal */}
      <section data-section="portal" className="px-5 py-12 @3xl:px-12 @3xl:py-20">
        <div className="overflow-hidden rounded-[26px] text-white @3xl:grid @3xl:grid-cols-2" style={{ background: C.navy }}>
          <div className="p-6 @3xl:p-10">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: C.sun }}>
              Parent portal
            </p>
            <h2 className="mt-1 text-[26px] font-semibold leading-tight @3xl:text-[36px]">Attendance, homework and fees — anytime.</h2>
            <p className="mt-2 text-[14px] text-white/65">No more calling the office. Parents log in with their child's ID.</p>
          </div>
          <div className="p-4 pt-0 @3xl:p-8">
            <AnimatePresence mode="wait" initial={false}>
              {!loggedIn ? (
                <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-[20px] bg-white p-5" style={{ color: C.ink }}>
                  <label className="block text-[12.5px] font-medium text-black/55">
                    Student ID
                    <input defaultValue="SV-24-0517" className="mt-1 w-full rounded-xl px-3 py-2.5 text-[15px] ring-1" style={{ ["--tw-ring-color" as string]: C.line }} />
                  </label>
                  <label className="mt-3 block text-[12.5px] font-medium text-black/55">
                    PIN
                    <input defaultValue="••••" className="mt-1 w-full rounded-xl px-3 py-2.5 text-[15px] ring-1" style={{ ["--tw-ring-color" as string]: C.line }} />
                  </label>
                  <button type="button" onClick={() => setLoggedIn(true)} className="mt-4 w-full rounded-full py-3 text-[14.5px] font-semibold" style={{ background: C.sun, color: C.navy }}>
                    Log in
                  </button>
                </motion.div>
              ) : (
                <motion.div key="dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-[20px] bg-white p-5" style={{ color: C.ink }}>
                  <div className="flex items-center gap-3">
                    <Avatar name="Aarav Kumar" from="#1b2a4e" to="#4a68bd" size={40} />
                    <div>
                      <p className="text-[15px] font-semibold">Aarav Kumar</p>
                      <p className="text-[12px] text-black/50">Class V-B · Roll no. 14</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    {[
                      ["94%", "Attendance"],
                      ["3", "Homework"],
                      ["A", "Last test"],
                    ].map(([v, l]) => (
                      <div key={l} className="rounded-xl py-2.5" style={{ background: C.sky }}>
                        <p className="text-[19px] font-semibold" style={{ color: C.navy }}>
                          {v}
                        </p>
                        <p className="text-[11px] text-black/50">{l}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between rounded-xl p-3" style={{ background: "#fff7dc" }}>
                    <div>
                      <p className="text-[12px] text-black/55">Q3 fees · due 15 Oct</p>
                      <p className="text-[17px] font-semibold">₹12,500</p>
                    </div>
                    <button type="button" onClick={() => showToast(realSiteNote("parents pay by UPI and get a receipt instantly."))} className="rounded-full px-4 py-2 text-[13px] font-semibold text-white" style={{ background: C.navy }}>
                      Pay now
                    </button>
                  </div>
                  <button type="button" onClick={() => setLoggedIn(false)} className="mt-3 text-[12px] font-medium text-black/45 underline underline-offset-4">
                    Log out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <footer className="px-5 pb-10 text-center text-[12.5px] text-black/45 @3xl:px-12">
        <p className="font-semibold text-black/70">
          {name} · {area}, Ranchi
        </p>
        <p className="mt-1">Affiliation No. 33XXXX (CBSE) · © 2026 · Website by Xhibit AI</p>
      </footer>

      {!desktop && (
        <div className="sticky bottom-0 z-30 px-4 pb-7 pt-2">
          <button type="button" onClick={() => scrollToSection("admissions")} className="w-full rounded-full py-3.5 text-[15px] font-semibold shadow-[0_14px_30px_-12px_rgba(27,42,78,.6)]" style={{ background: C.sun, color: C.navy }}>
            Admissions open — enquire now
          </button>
        </div>
      )}
      <Toast message={toast} />
    </div>
  );
}
