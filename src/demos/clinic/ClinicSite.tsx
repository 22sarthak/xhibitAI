import "@fontsource-variable/manrope";
import "@fontsource/mukta/devanagari-400.css";
import "@fontsource/mukta/devanagari-600.css";
import "@fontsource/mukta/devanagari-700.css";
import {
  Baby,
  Bone,
  CalendarCheck,
  FileText,
  FlaskConical,
  HeartPulse,
  Microscope,
  Phone,
  Pill,
  Stethoscope,
  Syringe,
  Video,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState, type CSSProperties } from "react";
import { useScreen } from "../../components/device/DeviceScreen";
import { cn } from "../../lib/utils";
import { Avatar, DemoImg, Sheet, Stars, SuccessTick, Toast, realSiteNote, useToast, type DemoProps } from "../kit";

/* ── Arogya Clinic · multispeciality clinic with a working English/Hindi toggle ── */

const C = { bg: "#f4f9f8", ink: "#0f2a2e", teal: "#0e6f6e", deep: "#0b4f4f", mint: "#ddf2ec", coral: "#e5484d", line: "rgba(15,42,46,.08)" };
const font: CSSProperties = { fontFamily: '"Manrope Variable", "Mukta", system-ui, sans-serif', color: C.ink };
const img = (n: string) => `/demos/clinics/${n}.webp`;

type Lang = "en" | "hi";
const T = {
  en: {
    tagline: "Your family's health, in trusted hands.",
    sub: "Multispeciality clinic · In-house lab · Pharmacy",
    book: "Book appointment",
    video: "Video consult",
    emergency: "24×7 Emergency",
    call: "Call now",
    quick: ["Book appointment", "Lab reports", "Video consult", "Health packages"],
    doctors: "Our doctors",
    doctorsSub: "Experienced specialists, all under one roof.",
    services: "Specialities",
    packages: "Health check-up packages",
    packagesSub: "Free home sample collection anywhere in Ranchi.",
    visit: "Visit the clinic",
    next: "Next available",
    bookShort: "Book",
    navPackages: "Packages",
    navContact: "Contact",
  },
  hi: {
    tagline: "आपके परिवार की सेहत, भरोसेमंद हाथों में।",
    sub: "मल्टीस्पेशलिटी क्लिनिक · लैब · फार्मेसी",
    book: "अपॉइंटमेंट बुक करें",
    video: "वीडियो परामर्श",
    emergency: "24×7 इमरजेंसी",
    call: "कॉल करें",
    quick: ["अपॉइंटमेंट", "लैब रिपोर्ट", "वीडियो परामर्श", "हेल्थ पैकेज"],
    doctors: "हमारे डॉक्टर",
    doctorsSub: "अनुभवी विशेषज्ञ, एक ही छत के नीचे।",
    services: "विशेषताएँ",
    packages: "हेल्थ चेक-अप पैकेज",
    packagesSub: "रांची में कहीं भी घर से सैंपल कलेक्शन मुफ़्त।",
    visit: "क्लिनिक आएँ",
    next: "अगला उपलब्ध समय",
    bookShort: "बुक करें",
    navPackages: "पैकेज",
    navContact: "संपर्क",
  },
} as const;

const DOCTORS = [
  { name: "Dr. Ananya Sinha", spec: "Gynaecologist & Obstetrician", exp: "14 yrs", days: "Mon – Sat · 10 AM – 2 PM", fee: 600, c: ["#0e6f6e", "#56b3a3"] },
  { name: "Dr. Rakesh Kumar", spec: "General Physician", exp: "18 yrs", days: "Daily · 5 PM – 9 PM", fee: 400, c: ["#1d4e89", "#5b8fd1"] },
  { name: "Dr. Meera Oraon", spec: "Paediatrician", exp: "9 yrs", days: "Mon – Fri · 11 AM – 3 PM", fee: 500, c: ["#a3478a", "#e08ab8"] },
  { name: "Dr. Sameer Ahmed", spec: "Orthopaedics", exp: "12 yrs", days: "Tue, Thu, Sat · 4 – 8 PM", fee: 700, c: ["#9a5b13", "#e0a24b"] },
];

const SPECIALITIES = [
  { icon: Stethoscope, name: "General medicine" },
  { icon: Baby, name: "Child care" },
  { icon: HeartPulse, name: "Women's health" },
  { icon: Bone, name: "Orthopaedics" },
  { icon: Microscope, name: "Diagnostics" },
  { icon: Syringe, name: "Vaccination" },
  { icon: Pill, name: "Pharmacy" },
  { icon: Video, name: "Teleconsult" },
];

const PACKAGES = [
  { name: "Basic Health Check", tests: 32, price: 799, items: ["Blood sugar", "CBC", "Lipid profile"] },
  { name: "Full Body Check-up", tests: 68, price: 1499, items: ["Liver & kidney", "Thyroid", "Vitamin D & B12"], popular: true },
  { name: "Senior Citizen Care", tests: 84, price: 2499, items: ["Cardiac risk", "Bone health", "Doctor consult"] },
];

function useDays() {
  return useMemo(() => {
    const out: { label: string; date: string }[] = [];
    const d = new Date();
    for (let i = 0; i < 5; i++) {
      const x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
      out.push({
        label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : x.toLocaleDateString("en-IN", { weekday: "short" }),
        date: x.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      });
    }
    return out;
  }, []);
}

const SLOTS = ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM"];
const FULL = new Set(["10:00 AM", "11:30 AM", "5:00 PM"]);

export default function ClinicSite({ name, area }: DemoProps) {
  const { mode, scrollToSection } = useScreen();
  const desktop = mode === "desktop";
  const [lang, setLang] = useState<Lang>("en");
  const t = T[lang];
  const [toast, showToast] = useToast(3400);
  const days = useDays();

  const [doctor, setDoctor] = useState<(typeof DOCTORS)[number] | null>(null);
  const [step, setStep] = useState(0);
  const [day, setDay] = useState(1);
  const [slot, setSlot] = useState("10:30 AM");

  const openBooking = (d = DOCTORS[0]) => {
    setDoctor(d);
    setStep(0);
  };

  return (
    <div className="relative min-h-full pb-24 @3xl:pb-0" style={{ ...font, background: C.bg }} lang={lang === "hi" ? "hi" : "en"}>
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b bg-white/95 px-5 py-3 backdrop-blur @3xl:px-12" style={{ borderColor: C.line }}>
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl text-white" style={{ background: C.teal }}>
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M7.5 2h5v5.5H18v5h-5.5V18h-5v-5.5H2v-5h5.5z" fill="currentColor" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="truncate text-[17px] font-extrabold leading-tight tracking-[-0.01em]">{name}</p>
            <p className="text-[11px] font-semibold text-black/45">Multispeciality · {area}</p>
          </div>
        </div>
        <nav className="hidden items-center gap-8 text-[14.5px] font-semibold text-black/70 @3xl:flex" aria-label="Demo menu">
          {[
            ["doctors", t.doctors],
            ["services", t.services],
            ["packages", t.navPackages],
            ["visit", t.navContact],
          ].map(([id, label]) => (
            <button key={id} type="button" onClick={() => scrollToSection(id)} className="hover:text-black">
              {label}
            </button>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex rounded-full p-0.5 text-[12.5px] font-bold" style={{ background: C.mint }} role="group" aria-label="Language">
            {(["en", "hi"] as const).map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={lang === l}
                onClick={() => setLang(l)}
                className={cn("rounded-full px-2.5 py-1 transition-colors", lang === l ? "text-white" : "")}
                style={lang === l ? { background: C.teal } : { color: C.deep }}
              >
                {l === "en" ? "EN" : "हिं"}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => openBooking()} className="hidden rounded-full px-5 py-2.5 text-[14px] font-bold text-white @3xl:block" style={{ background: C.teal }}>
            {t.book}
          </button>
        </div>
      </header>

      {/* Emergency */}
      <div data-section="emergency" className="flex items-center justify-between gap-3 px-5 py-2.5 text-white @3xl:px-12" style={{ background: C.coral }}>
        <p className="flex items-center gap-2 text-[13.5px] font-bold">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-white/80" />
            <span className="relative size-2 rounded-full bg-white" />
          </span>
          {t.emergency} · 0651-000-0000
        </p>
        <button type="button" onClick={() => showToast(realSiteNote("this calls the emergency line in one tap."))} className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12.5px] font-bold" style={{ color: C.coral }}>
          <Phone className="size-3.5" /> {t.call}
        </button>
      </div>

      {/* Hero */}
      <section data-section="top" className="px-5 pt-6 @3xl:grid @3xl:grid-cols-2 @3xl:items-center @3xl:gap-12 @3xl:px-12 @3xl:py-14">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[12px] font-bold shadow-sm" style={{ color: C.teal }}>
            <Stars value={5} size={11} /> 4.8 · 2,100+ patients reviewed
          </p>
          <h1 className={cn("mt-4 font-extrabold tracking-[-0.03em]", lang === "hi" ? "text-[30px] leading-[1.3] @3xl:text-[48px]" : "text-[34px] leading-[1.08] @3xl:text-[54px]")}>{t.tagline}</h1>
          <p className="mt-3 text-[15px] text-black/55 @3xl:text-[17px]">{t.sub}</p>
          <div className="mt-6 flex gap-2.5">
            <button type="button" onClick={() => openBooking()} className="flex-1 rounded-2xl px-4 py-3.5 text-[15px] font-bold text-white shadow-[0_10px_24px_-10px_rgba(14,111,110,.7)] @3xl:flex-none @3xl:px-7" style={{ background: C.teal }}>
              {t.book}
            </button>
            <button type="button" onClick={() => showToast(realSiteNote("patients join a secure video call with the doctor."))} className="flex-1 rounded-2xl bg-white px-4 py-3.5 text-[15px] font-bold ring-1 @3xl:flex-none @3xl:px-7" style={{ color: C.deep, ["--tw-ring-color" as string]: C.line }}>
              {t.video}
            </button>
          </div>
        </div>
        <div className="relative mt-6 @3xl:mt-0">
          <div className="h-[220px] overflow-hidden rounded-[26px] @3xl:h-[400px]">
            <DemoImg src={img("hero")} alt="Bright clinic reception with teal sofas" eager />
          </div>
          <div className="absolute -bottom-5 left-4 right-4 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-[0_16px_40px_-14px_rgba(15,42,46,.35)] @3xl:-left-8 @3xl:right-auto @3xl:w-[300px]">
            <Avatar name="Rakesh Kumar" from="#1d4e89" to="#5b8fd1" size={42} />
            <div className="min-w-0 flex-1">
              <p className="text-[11.5px] font-semibold text-black/45">{t.next}</p>
              <p className="truncate text-[14px] font-bold">Today, 5:30 PM · Dr. Rakesh Kumar</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="mt-10 grid grid-cols-2 gap-3 px-5 @3xl:mt-4 @3xl:grid-cols-4 @3xl:px-12">
        {[CalendarCheck, FileText, Video, FlaskConical].map((Icon, i) => (
          <button
            key={i}
            type="button"
            onClick={() =>
              i === 0
                ? openBooking()
                : i === 3
                  ? scrollToSection("packages")
                  : showToast(realSiteNote(i === 1 ? "patients download their lab reports as a PDF." : "patients join a secure video call."))
            }
            className="flex items-center gap-3 rounded-2xl bg-white p-4 text-left text-[14px] font-bold shadow-[0_1px_2px_rgba(15,42,46,.05)] ring-1"
            style={{ ["--tw-ring-color" as string]: C.line }}
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl" style={{ background: C.mint, color: C.teal }}>
              <Icon className="size-5" strokeWidth={2} />
            </span>
            {t.quick[i]}
          </button>
        ))}
      </section>

      {/* Doctors */}
      <section data-section="doctors" className="px-5 pt-12 @3xl:px-12 @3xl:pt-20">
        <h2 className="text-[26px] font-extrabold tracking-[-0.02em] @3xl:text-[36px]">{t.doctors}</h2>
        <p className="mt-1 text-[14.5px] text-black/55">{t.doctorsSub}</p>
        <div className="mt-5 grid gap-3 @3xl:grid-cols-4 @3xl:gap-5">
          {DOCTORS.map((d) => (
            <article key={d.name} className="flex gap-4 rounded-[22px] bg-white p-4 ring-1 @3xl:flex-col" style={{ ["--tw-ring-color" as string]: C.line }}>
              <Avatar name={d.name} from={d.c[0]} to={d.c[1]} size={desktop ? 64 : 56} />
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-extrabold leading-tight">{d.name}</p>
                <p className="mt-0.5 text-[13px] font-semibold" style={{ color: C.teal }}>
                  {d.spec}
                </p>
                <p className="mt-1.5 text-[12.5px] text-black/55">
                  {d.exp} experience · ₹{d.fee}
                </p>
                <p className="text-[12.5px] text-black/55">{d.days}</p>
                <button type="button" onClick={() => openBooking(d)} className="mt-3 rounded-full px-4 py-2 text-[13px] font-bold text-white" style={{ background: C.teal }}>
                  {t.bookShort}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Specialities */}
      <section data-section="services" className="px-5 pt-12 @3xl:px-12 @3xl:pt-20">
        <h2 className="text-[26px] font-extrabold tracking-[-0.02em] @3xl:text-[36px]">{t.services}</h2>
        <div className="mt-5 grid grid-cols-4 gap-2.5 @3xl:grid-cols-8 @3xl:gap-4">
          {SPECIALITIES.map((s) => (
            <div key={s.name} className="flex flex-col items-center gap-2 rounded-2xl bg-white px-1 py-3.5 text-center ring-1" style={{ ["--tw-ring-color" as string]: C.line }}>
              <span className="grid size-10 place-items-center rounded-full" style={{ background: C.mint, color: C.teal }}>
                <s.icon className="size-5" strokeWidth={1.9} />
              </span>
              <span className="text-[11.5px] font-bold leading-tight">{s.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section data-section="packages" className="px-5 pt-12 @3xl:px-12 @3xl:pt-20">
        <h2 className="text-[26px] font-extrabold tracking-[-0.02em] @3xl:text-[36px]">{t.packages}</h2>
        <p className="mt-1 text-[14.5px] text-black/55">{t.packagesSub}</p>
        <div className="no-scrollbar -mx-5 mt-5 flex snap-x gap-3 overflow-x-auto px-5 @3xl:mx-0 @3xl:grid @3xl:grid-cols-3 @3xl:gap-5 @3xl:px-0">
          {PACKAGES.map((p) => (
            <article
              key={p.name}
              className={cn("relative w-[78%] shrink-0 snap-start rounded-[24px] p-5 @3xl:w-auto", p.popular ? "text-white" : "bg-white ring-1")}
              style={p.popular ? { background: `linear-gradient(150deg, ${C.teal}, ${C.deep})` } : { ["--tw-ring-color" as string]: C.line }}
            >
              {p.popular && <span className="absolute right-4 top-4 rounded-full bg-white/20 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.08em]">Popular</span>}
              <p className="text-[17px] font-extrabold">{p.name}</p>
              <p className={cn("text-[13px]", p.popular ? "text-white/70" : "text-black/50")}>{p.tests} tests</p>
              <p className="mt-4 text-[32px] font-extrabold tracking-[-0.02em]">₹{p.price.toLocaleString("en-IN")}</p>
              <ul className={cn("mt-3 grid gap-1.5 text-[13px]", p.popular ? "text-white/85" : "text-black/65")}>
                {p.items.map((it) => (
                  <li key={it}>✓ {it}</li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => showToast(realSiteNote(`patients book the ${p.name} and choose a home-collection slot.`))}
                className={cn("mt-5 w-full rounded-xl py-3 text-[14px] font-bold", p.popular ? "bg-white" : "text-white")}
                style={p.popular ? { color: C.deep } : { background: C.teal }}
              >
                {t.bookShort}
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Lab */}
      <section className="px-5 pt-12 @3xl:px-12 @3xl:pt-20">
        <div className="overflow-hidden rounded-[26px] bg-white ring-1 @3xl:grid @3xl:grid-cols-2" style={{ ["--tw-ring-color" as string]: C.line }}>
          <div className="h-[190px] @3xl:h-auto">
            <DemoImg src={img("lab")} alt="In-house pathology lab" />
          </div>
          <div className="p-6 @3xl:p-10">
            <p className="text-[12px] font-bold uppercase tracking-[0.14em]" style={{ color: C.teal }}>
              In-house lab
            </p>
            <h3 className="mt-2 text-[22px] font-extrabold leading-snug @3xl:text-[30px]">Reports on WhatsApp, usually the same day.</h3>
            <p className="mt-2 text-[14px] text-black/55">Modern equipment, trained technicians and secure digital reports your doctor can see instantly.</p>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="px-5 pt-12 @3xl:px-12 @3xl:pt-20">
        <div className="grid gap-3 @3xl:grid-cols-3 @3xl:gap-5">
          {[
            ["Kavita P.", "Booked online, got token A-07 and was seen in ten minutes. No more waiting for hours!"],
            ["Arun T.", "Dr. Meera is wonderful with kids. The reminder message on WhatsApp really helps."],
            ["Seema D.", "Home sample collection was on time and reports came the same evening."],
          ].map(([who, text]) => (
            <figure key={who} className="rounded-[22px] bg-white p-5 ring-1" style={{ ["--tw-ring-color" as string]: C.line }}>
              <Stars value={5} size={12} />
              <blockquote className="mt-2 text-[14px] leading-relaxed">“{text}”</blockquote>
              <figcaption className="mt-3 text-[12.5px] font-bold text-black/45">{who}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Visit */}
      <section data-section="visit" className="px-5 pb-10 pt-12 @3xl:grid @3xl:grid-cols-2 @3xl:gap-10 @3xl:px-12 @3xl:pb-20 @3xl:pt-20">
        <div>
          <h2 className="text-[26px] font-extrabold tracking-[-0.02em] @3xl:text-[36px]">{t.visit}</h2>
          <p className="mt-2 text-[14.5px] text-black/60">
            Main Road, {area}, Ranchi, Jharkhand
            <br />
            Wheelchair access · Parking available
          </p>
          <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 rounded-2xl bg-white p-4 text-[14px] ring-1" style={{ ["--tw-ring-color" as string]: C.line }}>
            <dt className="text-black/50">OPD (Mon – Sat)</dt>
            <dd className="font-bold">9 AM – 9 PM</dd>
            <dt className="text-black/50">Sunday</dt>
            <dd className="font-bold">9 AM – 1 PM</dd>
            <dt className="text-black/50">Emergency</dt>
            <dd className="font-bold" style={{ color: C.coral }}>
              24×7
            </dd>
          </dl>
        </div>
        <div className="mt-6 h-[180px] overflow-hidden rounded-[24px] @3xl:mt-0 @3xl:h-auto">
          <DemoImg src={img("waiting")} alt="Clean, calm waiting area" />
        </div>
      </section>

      <footer className="px-5 py-8 text-center text-[12.5px] text-black/45 @3xl:px-12">
        © 2026 {name} · Website by Xhibit AI
      </footer>

      {/* Sticky actions (phone) */}
      {!desktop && (
        <div className="sticky bottom-0 z-30 flex gap-2.5 border-t bg-white/95 px-4 pb-7 pt-3 backdrop-blur" style={{ borderColor: C.line }}>
          <button type="button" onClick={() => showToast(realSiteNote("patients call the reception in one tap."))} className="grid size-[50px] shrink-0 place-items-center rounded-2xl" style={{ background: C.mint, color: C.teal }} aria-label="Call clinic">
            <Phone className="size-5" />
          </button>
          <button type="button" onClick={() => openBooking()} className="flex-1 rounded-2xl text-[15px] font-bold text-white" style={{ background: C.teal }}>
            {t.book}
          </button>
        </div>
      )}

      {/* Booking flow */}
      <Sheet open={!!doctor} onClose={() => setDoctor(null)} title="Book an appointment" style={font}>
        {doctor && (
          <div className="pt-2">
            <AnimatePresence mode="wait" initial={false}>
              {step < 2 ? (
                <motion.div key="pick" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="flex items-center gap-3 pr-8">
                    <Avatar name={doctor.name} from={doctor.c[0]} to={doctor.c[1]} size={48} />
                    <div>
                      <p className="text-[17px] font-extrabold leading-tight">{doctor.name}</p>
                      <p className="text-[13px] font-semibold" style={{ color: C.teal }}>
                        {doctor.spec} · ₹{doctor.fee}
                      </p>
                    </div>
                  </div>
                  <p className="mt-5 text-[12px] font-bold uppercase tracking-[0.12em] text-black/45">Choose a day</p>
                  <div className="no-scrollbar -mx-1 mt-2 flex gap-2 overflow-x-auto px-1 pb-1">
                    {days.map((d, i) => (
                      <button
                        key={d.date}
                        type="button"
                        onClick={() => setDay(i)}
                        className={cn("min-w-[72px] rounded-2xl px-2 py-2.5 text-center ring-1", day === i && "text-white")}
                        style={day === i ? { background: C.teal, ["--tw-ring-color" as string]: C.teal } : { ["--tw-ring-color" as string]: C.line }}
                      >
                        <span className="block text-[12px] font-semibold opacity-75">{d.label}</span>
                        <span className="block text-[15px] font-extrabold">{d.date}</span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-5 text-[12px] font-bold uppercase tracking-[0.12em] text-black/45">Choose a time</p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {SLOTS.map((s) => {
                      const full = FULL.has(s) && day < 2;
                      return (
                        <button
                          key={s}
                          type="button"
                          disabled={full}
                          onClick={() => setSlot(s)}
                          className={cn("rounded-xl py-2.5 text-[13px] font-bold ring-1 disabled:cursor-not-allowed disabled:opacity-35", slot === s && !full && "text-white")}
                          style={slot === s && !full ? { background: C.teal, ["--tw-ring-color" as string]: C.teal } : { ["--tw-ring-color" as string]: C.line }}
                        >
                          {full ? "Full" : s}
                        </button>
                      );
                    })}
                  </div>
                  <button type="button" onClick={() => setStep(2)} className="mt-6 w-full rounded-2xl py-4 text-[15px] font-bold text-white" style={{ background: C.teal }}>
                    Confirm {days[day].label.toLowerCase()}, {slot}
                  </button>
                </motion.div>
              ) : (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center pb-2 pt-3 text-center">
                  <SuccessTick color={C.teal} />
                  <p className="mt-4 text-[22px] font-extrabold">Appointment confirmed</p>
                  <div className="mt-4 w-full rounded-2xl p-4" style={{ background: C.mint }}>
                    <p className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: C.teal }}>
                      Your token
                    </p>
                    <p className="text-[44px] font-extrabold leading-none tracking-[-0.03em]" style={{ color: C.deep }}>
                      A-14
                    </p>
                    <p className="mt-2 text-[13.5px] font-semibold">
                      {doctor.name} · {days[day].label}, {slot}
                    </p>
                  </div>
                  <p className="mt-4 text-[13px] leading-relaxed text-black/55">{realSiteNote("the patient gets this token on WhatsApp, plus a reminder two hours before.")}</p>
                  <button type="button" onClick={() => setDoctor(null)} className="mt-5 w-full rounded-2xl py-3.5 text-[15px] font-bold text-white" style={{ background: C.teal }}>
                    Done
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </Sheet>
      <Toast message={toast} />
    </div>
  );
}
