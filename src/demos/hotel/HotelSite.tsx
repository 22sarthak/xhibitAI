import "@fontsource/marcellus/400.css";
import "@fontsource-variable/manrope";
import { BedDouble, Car, Coffee, Ruler, Tv, Users, Wifi, Wind } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState, type CSSProperties } from "react";
import { useScreen } from "../../components/device/DeviceScreen";
import { cn } from "../../lib/utils";
import { DemoImg, Sheet, Stars, SuccessTick, Toast, realSiteNote, useToast, type DemoProps } from "../kit";

/* ── Palash Residency · hotel, banquets & dining ───────────────────────── */

const C = { ivory: "#f8f4ec", paper: "#efe8da", forest: "#1e3a2f", deep: "#142a21", palash: "#e0592a", gold: "#b8925a", ink: "#1b1f1c", line: "rgba(27,31,28,.1)" };
const serif: CSSProperties = { fontFamily: '"Marcellus", Georgia, serif', fontWeight: 400 };
const font: CSSProperties = { fontFamily: '"Manrope Variable", system-ui, sans-serif', color: C.ink };
const img = (n: string) => `/demos/hotels/${n}.webp`;

const ROOMS = [
  { id: "deluxe", name: "Deluxe Room", price: 3499, size: "260 sq ft", bed: "Queen bed", guests: 2, img: "room-deluxe" },
  { id: "exec", name: "Executive Room", price: 4999, size: "320 sq ft", bed: "King bed", guests: 3, img: "room-executive" },
  { id: "suite", name: "Palash Suite", price: 7999, size: "520 sq ft", bed: "King bed + living room", guests: 4, img: "room-suite" },
];

function PalashFlower({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      {[0, 72, 144, 216, 288].map((r) => (
        <path key={r} d="M16 16c-2.5-4-2.5-9 0-13 2.5 4 2.5 9 0 13z" fill={C.palash} transform={`rotate(${r} 16 16)`} />
      ))}
      <circle cx="16" cy="16" r="2.6" fill={C.gold} />
    </svg>
  );
}

const iso = (d: Date) => d.toISOString().slice(0, 10);

export default function HotelSite({ name, area }: DemoProps) {
  const { mode, scrollToSection } = useScreen();
  const desktop = mode === "desktop";
  const today = useMemo(() => new Date(), []);
  const [checkIn, setCheckIn] = useState(iso(new Date(today.getTime() + 86400000 * 7)));
  const [checkOut, setCheckOut] = useState(iso(new Date(today.getTime() + 86400000 * 9)));
  const [guests, setGuests] = useState(2);
  const [checked, setChecked] = useState(false);
  const [room, setRoom] = useState<(typeof ROOMS)[number] | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [toast, showToast] = useToast(3400);

  const nights = Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000));
  const fmtDate = (s: string) => new Date(s).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const brand = name.replace(/\b(residency|hotel|resort)\b/gi, "").trim() || name;

  return (
    <div className="relative min-h-full" style={{ ...font, background: C.ivory }}>
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b px-5 py-3 @3xl:px-12" style={{ background: "rgba(248,244,236,.94)", borderColor: C.line, backdropFilter: "blur(10px)" }}>
        <div className="flex min-w-0 items-center gap-2.5">
          <PalashFlower />
          <div className="min-w-0">
            <p className="truncate text-[21px] uppercase leading-none tracking-[0.2em]" style={{ ...serif, color: C.forest }}>
              {brand}
            </p>
            <p className="mt-1 text-[9.5px] font-semibold uppercase tracking-[0.32em] text-black/45">Residency · Ranchi</p>
          </div>
        </div>
        <nav className="hidden items-center gap-8 text-[13.5px] font-semibold text-black/60 @3xl:flex" aria-label="Demo menu">
          {[
            ["rooms", "Rooms"],
            ["banquets", "Weddings & events"],
            ["explore", "Explore Ranchi"],
            ["reviews", "Reviews"],
          ].map(([id, l]) => (
            <button key={id} type="button" onClick={() => scrollToSection(id)} className="hover:text-black">
              {l}
            </button>
          ))}
        </nav>
        <button type="button" onClick={() => scrollToSection("rooms")} className="rounded-full px-4 py-2.5 text-[13px] font-bold text-white" style={{ background: C.forest }}>
          Book now
        </button>
      </header>

      {/* Hero + booking widget */}
      <section data-section="top" className="relative">
        <div className="relative h-[430px] overflow-hidden @3xl:h-[560px]">
          <DemoImg src={img("hero")} alt="Hotel lit up at dusk among trees" eager />
          <div className="absolute inset-0 bg-linear-to-t from-[#142a21]/90 via-[#142a21]/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-20 px-6 text-white @3xl:bottom-28 @3xl:px-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/75">Near Birsa Munda Airport · {area}</p>
            <h1 className="mt-3 text-[38px] leading-[1.06] @3xl:max-w-[720px] @3xl:text-[64px]" style={serif}>
              Your calm stay in the heart of Ranchi.
            </h1>
          </div>
        </div>
        <div className="relative -mt-14 px-4 @3xl:-mt-16 @3xl:px-12">
          <div className="rounded-[24px] bg-white p-4 shadow-[0_24px_50px_-20px_rgba(20,42,33,.45)] @3xl:flex @3xl:items-end @3xl:gap-4 @3xl:p-5">
            <div className="grid grid-cols-2 gap-2 @3xl:flex-1 @3xl:grid-cols-3 @3xl:gap-4">
              <label className="rounded-xl px-3 py-2 ring-1" style={{ ["--tw-ring-color" as string]: C.line }}>
                <span className="block text-[10.5px] font-bold uppercase tracking-[0.14em] text-black/45">Check-in</span>
                <input type="date" value={checkIn} min={iso(today)} onChange={(e) => setCheckIn(e.target.value)} className="w-full bg-transparent text-[14px] font-semibold focus:outline-none" />
              </label>
              <label className="rounded-xl px-3 py-2 ring-1" style={{ ["--tw-ring-color" as string]: C.line }}>
                <span className="block text-[10.5px] font-bold uppercase tracking-[0.14em] text-black/45">Check-out</span>
                <input type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} className="w-full bg-transparent text-[14px] font-semibold focus:outline-none" />
              </label>
              <div className="col-span-2 flex items-center justify-between rounded-xl px-3 py-2 ring-1 @3xl:col-span-1" style={{ ["--tw-ring-color" as string]: C.line }}>
                <span>
                  <span className="block text-[10.5px] font-bold uppercase tracking-[0.14em] text-black/45">Guests</span>
                  <span className="text-[14px] font-semibold">{guests} adults</span>
                </span>
                <span className="flex gap-1.5">
                  <button type="button" aria-label="Fewer guests" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="grid size-8 place-items-center rounded-full bg-black/5">
                    −
                  </button>
                  <button type="button" aria-label="More guests" onClick={() => setGuests((g) => Math.min(6, g + 1))} className="grid size-8 place-items-center rounded-full bg-black/5">
                    +
                  </button>
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setChecked(true);
                scrollToSection("rooms");
              }}
              className="mt-3 w-full rounded-xl py-3.5 text-[14.5px] font-bold text-white @3xl:mt-0 @3xl:w-auto @3xl:px-8"
              style={{ background: C.palash }}
            >
              Check availability
            </button>
          </div>
        </div>
      </section>

      {/* Perks */}
      <div tabIndex={0} role="region" aria-label="Why book direct" className="no-scrollbar mt-6 flex gap-2 overflow-x-auto px-5 @3xl:justify-center @3xl:px-12">
        {["Best price when you book direct", "Free breakfast", "Free cancellation (24 hrs)", "Airport pick-up"].map((p) => (
          <span key={p} className="shrink-0 rounded-full px-3.5 py-2 text-[12.5px] font-semibold" style={{ background: C.paper, color: C.forest }}>
            ✓ {p}
          </span>
        ))}
      </div>

      {/* Rooms */}
      <section data-section="rooms" className="px-5 pt-12 @3xl:px-12 @3xl:pt-20">
        <div className="@3xl:flex @3xl:items-end @3xl:justify-between">
          <h2 className="text-[34px] leading-none @3xl:text-[48px]" style={serif}>
            Rooms & suites
          </h2>
          <AnimatePresence>
            {checked && (
              <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-[13.5px] font-semibold" style={{ color: C.forest }}>
                {fmtDate(checkIn)} – {fmtDate(checkOut)} · {nights} night{nights > 1 ? "s" : ""} · all rooms available
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <div className="mt-5 grid gap-4 @3xl:grid-cols-3 @3xl:gap-5">
          {ROOMS.map((r) => (
            <article key={r.id} className="overflow-hidden rounded-[22px] bg-white ring-1" style={{ ["--tw-ring-color" as string]: C.line }}>
              <div className="relative h-[190px]">
                <DemoImg src={img(r.img)} alt={r.name} />
                {checked && (
                  <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold" style={{ color: C.forest }}>
                    ● Available
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-[21px] leading-tight" style={serif}>
                  {r.name}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12.5px] text-black/55">
                  <span className="flex items-center gap-1">
                    <Ruler className="size-3.5" /> {r.size}
                  </span>
                  <span className="flex items-center gap-1">
                    <BedDouble className="size-3.5" /> {r.bed}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="size-3.5" /> {r.guests}
                  </span>
                </div>
                <div className="mt-3 flex gap-2.5 text-black/45">
                  {[Wifi, Coffee, Tv, Wind].map((I, i) => (
                    <I key={i} className="size-4" />
                  ))}
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <p>
                    <span className="text-[24px] font-bold">₹{r.price.toLocaleString("en-IN")}</span>
                    <span className="text-[12.5px] text-black/50"> / night</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setRoom(r);
                      setConfirmed(false);
                    }}
                    className="rounded-full px-4 py-2.5 text-[13px] font-bold text-white"
                    style={{ background: C.forest }}
                  >
                    Select
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Banquets */}
      <section data-section="banquets" className="mt-12 px-5 py-12 text-white @3xl:mt-20 @3xl:grid @3xl:grid-cols-2 @3xl:items-center @3xl:gap-12 @3xl:px-12 @3xl:py-20" style={{ background: C.forest }}>
        <div className="grid grid-cols-5 gap-2">
          <div className="col-span-3 h-[230px] overflow-hidden rounded-[20px] @3xl:h-[340px]">
            <DemoImg src={img("wedding")} alt="Wedding stage with chandeliers" />
          </div>
          <div className="col-span-2 h-[230px] overflow-hidden rounded-[20px] @3xl:h-[340px]">
            <DemoImg src={img("hall")} alt="Banquet hall laid out for dinner" />
          </div>
        </div>
        <div className="mt-6 @3xl:mt-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: "#f2c9a2" }}>
            Weddings & events
          </p>
          <h2 className="mt-3 text-[34px] leading-[1.08] @3xl:text-[48px]" style={serif}>
            Celebrations for 50 to 600 guests.
          </h2>
          <p className="mt-3 text-[14.5px] leading-relaxed text-white/70">Two banquet halls, a lawn, in-house catering and décor, and parking for 150 cars.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["Weddings", "Receptions", "Birthdays", "Corporate"].map((t) => (
              <span key={t} className="rounded-full bg-white/10 px-3 py-1.5 text-[12.5px] font-semibold">
                {t}
              </span>
            ))}
          </div>
          <button type="button" onClick={() => showToast(realSiteNote("the events team gets the enquiry and sends the brochure on WhatsApp."))} className="mt-6 w-full rounded-full py-3.5 text-[14px] font-bold @3xl:w-auto @3xl:px-8" style={{ background: C.palash }}>
            Plan your event
          </button>
        </div>
      </section>

      {/* Dining */}
      <section className="px-5 pt-12 @3xl:px-12 @3xl:pt-20">
        <div className="overflow-hidden rounded-[24px] bg-white ring-1 @3xl:grid @3xl:grid-cols-[1.2fr_1fr]" style={{ ["--tw-ring-color" as string]: C.line }}>
          <div className="h-[200px] @3xl:h-[300px]">
            <DemoImg src={img("dining")} alt="Warmly lit hotel restaurant" />
          </div>
          <div className="p-6 @3xl:p-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-black/45">Dining</p>
            <p className="mt-2 text-[28px] leading-tight" style={serif}>
              Saffron Leaf
            </p>
            <p className="mt-2 text-[14px] text-black/60">Multi-cuisine restaurant with Jharkhandi specials, open 7 AM – 11 PM. Room service 24×7.</p>
          </div>
        </div>
      </section>

      {/* Explore */}
      <section data-section="explore" className="px-5 pt-12 @3xl:px-12 @3xl:pt-20">
        <h2 className="text-[34px] leading-none @3xl:text-[48px]" style={serif}>
          Explore Ranchi
        </h2>
        <p className="mt-2 text-[14px] text-black/55">Our concierge plans day trips with a car and driver.</p>
        <div className="mt-5 grid gap-3 @3xl:grid-cols-2 @3xl:gap-5">
          <div className="relative h-[220px] overflow-hidden rounded-[22px] @3xl:h-[280px]">
            <DemoImg src={img("nature")} alt="Green hills and a flowing stream" />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/75">Day trips</p>
              <p className="mt-1 text-[22px] leading-tight" style={serif}>
                Hundru, Dassam & Jonha falls · Patratu Valley
              </p>
            </div>
          </div>
          <ul className="grid content-start gap-2">
            {[
              ["Pahari Mandir", "Hilltop temple with city views"],
              ["Rock Garden & Kanke Dam", "Evening walks by the water"],
              ["Jagannath Temple", "17th-century temple, Dhurwa"],
              ["Tagore Hill", "Sunrise point in Morabadi"],
            ].map(([n, d]) => (
              <li key={n} className="flex items-center justify-between rounded-2xl bg-white p-4 ring-1" style={{ ["--tw-ring-color" as string]: C.line }}>
                <span>
                  <span className="block text-[15px] font-bold">{n}</span>
                  <span className="text-[12.5px] text-black/50">{d}</span>
                </span>
                <Car className="size-4 text-black/35" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Reviews */}
      <section data-section="reviews" className="px-5 pb-32 pt-12 @3xl:px-12 @3xl:pb-16 @3xl:pt-20">
        <div className="rounded-[24px] p-6 @3xl:grid @3xl:grid-cols-[240px_1fr] @3xl:gap-10 @3xl:p-10" style={{ background: C.paper }}>
          <div>
            <p className="text-[56px] leading-none" style={serif}>
              4.6
            </p>
            <Stars value={5} size={15} color={C.gold} />
            <p className="mt-2 text-[13px] text-black/55">from 820 guest reviews</p>
          </div>
          <div className="mt-5 grid gap-3 @3xl:mt-0 @3xl:grid-cols-2">
            {[
              ["Ankit & Pooja", "We held our reception here — the team handled everything. Guests still talk about the food."],
              ["Sanjay R.", "Ten minutes from the airport, spotless rooms and the best breakfast in Ranchi."],
            ].map(([w, t]) => (
              <figure key={w} className="rounded-2xl bg-white p-4">
                <blockquote className="text-[14px] leading-relaxed">“{t}”</blockquote>
                <figcaption className="mt-2 text-[12.5px] font-bold text-black/45">{w}</figcaption>
              </figure>
            ))}
          </div>
        </div>
        <p className="mt-8 text-center text-[12px] text-black/45">
          {name} · Hinoo, Ranchi · © 2026 · Website by Xhibit AI
        </p>
      </section>

      {!desktop && (
        <div className="sticky bottom-0 z-30 flex items-center gap-3 border-t bg-white/95 px-4 pb-7 pt-3 backdrop-blur" style={{ borderColor: C.line }}>
          <div className="flex-1">
            <p className="text-[11px] font-semibold text-black/45">From</p>
            <p className="text-[17px] font-bold">₹3,499 / night</p>
          </div>
          <button type="button" onClick={() => scrollToSection("rooms")} className="rounded-full px-6 py-3 text-[14px] font-bold text-white" style={{ background: C.palash }}>
            Book direct
          </button>
        </div>
      )}

      <Sheet open={!!room} onClose={() => setRoom(null)} title="Your booking" style={font}>
        {room && (
          <AnimatePresence mode="wait" initial={false}>
            {!confirmed ? (
              <motion.div key="sum" exit={{ opacity: 0 }}>
                <p className="pr-8 text-[26px] leading-tight" style={serif}>
                  {room.name}
                </p>
                <div className="mt-4 overflow-hidden rounded-2xl">
                  <div className="h-[130px]">
                    <DemoImg src={img(room.img)} alt="" />
                  </div>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-y-2 text-[14px]">
                  <dt className="text-black/50">Dates</dt>
                  <dd className="text-right font-semibold">
                    {fmtDate(checkIn)} – {fmtDate(checkOut)}
                  </dd>
                  <dt className="text-black/50">Guests</dt>
                  <dd className="text-right font-semibold">{guests} adults</dd>
                  <dt className="text-black/50">
                    ₹{room.price.toLocaleString("en-IN")} × {nights} night{nights > 1 ? "s" : ""}
                  </dt>
                  <dd className="text-right font-semibold">₹{(room.price * nights).toLocaleString("en-IN")}</dd>
                  <dt className="font-semibold" style={{ color: C.forest }}>
                    Direct booking saving
                  </dt>
                  <dd className="text-right font-semibold" style={{ color: C.forest }}>
                    −₹{Math.round(room.price * nights * 0.1).toLocaleString("en-IN")}
                  </dd>
                </dl>
                <div className="mt-3 flex items-center justify-between border-t pt-3" style={{ borderColor: C.line }}>
                  <span className="text-[14px] font-bold">Total</span>
                  <span className="text-[24px] font-bold">₹{Math.round(room.price * nights * 0.9).toLocaleString("en-IN")}</span>
                </div>
                <button type="button" onClick={() => setConfirmed(true)} className="mt-5 w-full rounded-full py-4 text-[15px] font-bold text-white" style={{ background: C.palash }}>
                  Confirm booking
                </button>
                <p className="mt-2 text-center text-[11.5px] text-black/45">Pay at the hotel or by UPI · free cancellation till 24 hrs before</p>
              </motion.div>
            ) : (
              <motion.div key="ok" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-3 text-center">
                <SuccessTick color={C.forest} />
                <p className="mt-4 text-[28px] leading-tight" style={serif}>
                  You're booked!
                </p>
                <p className="mt-2 text-[14px] text-black/60">
                  Booking ID <b className="text-black">PR-2611-0347</b>
                </p>
                <p className={cn("mt-4 rounded-2xl p-3.5 text-[12.5px] leading-relaxed")} style={{ background: C.paper }}>
                  {realSiteNote("the guest gets a confirmation with invoice on WhatsApp, and directions a day before arrival.")}
                </p>
                <button type="button" onClick={() => setRoom(null)} className="mt-5 w-full rounded-full py-3.5 text-[15px] font-bold text-white" style={{ background: C.forest }}>
                  Done
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </Sheet>
      <Toast message={toast} />
    </div>
  );
}
