import "@fontsource-variable/lexend";
import "@fontsource-variable/dm-sans";
import { Bell, CalendarDays, Camera, Check, Clock, IndianRupee, Plane, Search, UserCheck, X, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, type CSSProperties, type ReactNode } from "react";
import { useDemoNav, useScreen } from "../../components/device/DeviceScreen";
import { cn, initials, inr } from "../../lib/utils";
import { Sheet, SuccessTick, Toast, useToast, type DemoProps } from "../kit";

/* ── ShiftSaathi · the product: attendance, rosters, leave and payroll for shift teams ── */

const C = {
  bg: "#f6f5f0",
  ink: "#141414",
  mute: "#6b6a64",
  line: "rgba(20,20,20,.08)",
  sun: "#ffcf3f",
  sunSoft: "#fff3c9",
  blue: "#2f5bff",
  blueSoft: "#e8edff",
  green: "#11865a",
  greenSoft: "#e5f5ec",
  red: "#c0392b",
  redSoft: "#fdecea",
  amber: "#9a6200",
  amberSoft: "#fdf1d8",
};
const body: CSSProperties = { fontFamily: '"DM Sans Variable", system-ui, sans-serif', color: C.ink };
const display: CSSProperties = { fontFamily: '"Lexend Variable", system-ui, sans-serif' };

type Tab = "today" | "roster" | "leave" | "payroll";
const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "today", label: "Today", icon: UserCheck },
  { id: "roster", label: "Roster", icon: CalendarDays },
  { id: "leave", label: "Leave", icon: Plane },
  { id: "payroll", label: "Payroll", icon: IndianRupee },
];

const TEAM = [
  { name: "Ravi Kumar", role: "Cook", rate: 850 },
  { name: "Priya Nair", role: "Cashier", rate: 700 },
  { name: "Imran Shaikh", role: "Delivery", rate: 650 },
  { name: "Sunita Devi", role: "Housekeeping", rate: 600 },
  { name: "Arjun Rao", role: "Waiter", rate: 650 },
  { name: "Meena Gowda", role: "Cashier", rate: 700 },
  { name: "Karthik S", role: "Chef", rate: 1100 },
];

const CHECKINS = [
  { name: "Karthik S", time: "8:51 AM", late: false },
  { name: "Ravi Kumar", time: "9:02 AM", late: false },
  { name: "Sunita Devi", time: "9:04 AM", late: false },
  { name: "Meena Gowda", time: "9:22 AM", late: true },
];
const ABSENT = ["Arjun Rao"];

type Shift = "M" | "E" | "N" | "off";
const CYCLE: Shift[] = ["off", "M", "E", "N"];
const SHIFT: Record<Shift, { label: string; bg: string; fg: string }> = {
  M: { label: "9–5", bg: "#fff3c9", fg: "#7a5a00" },
  E: { label: "2–10", bg: "#e5ebff", fg: "#2442b8" },
  N: { label: "10–6", bg: "#ece7ff", fg: "#5a3fc0" },
  off: { label: "Off", bg: "#f1f0eb", fg: "#9a988f" },
};
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ROSTER: Shift[][] = [
  ["M", "M", "E", "M", "off", "E", "E"],
  ["E", "E", "off", "E", "E", "M", "M"],
  ["N", "off", "N", "N", "N", "E", "off"],
  ["M", "M", "M", "off", "M", "M", "E"],
  ["off", "E", "E", "E", "M", "E", "E"],
  ["M", "off", "M", "M", "E", "E", "M"],
  ["M", "M", "M", "M", "M", "off", "off"],
];

type LeaveStatus = "Pending" | "Approved" | "Declined";
const LEAVES = [
  { name: "Priya Nair", dates: "14 – 15 Nov", reason: "Sister's wedding in Mysuru" },
  { name: "Imran Shaikh", dates: "18 Nov", reason: "Bike service, back by 2 PM" },
  { name: "Sunita Devi", dates: "21 – 23 Nov", reason: "Going home to Ranchi" },
];

const PAY = TEAM.map((t, i) => {
  const days = [26, 25, 24, 26, 22, 25, 26][i];
  const ot = [6, 0, 4, 2, 0, 3, 8][i];
  const advance = [0, 2000, 0, 1500, 0, 0, 0][i];
  const net = days * t.rate + Math.round((ot * t.rate) / 8) - advance;
  return { ...t, days, ot, advance, net };
});

function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-[18px] bg-white p-4 ring-1", className)} style={{ ["--tw-ring-color" as string]: C.line }}>
      {children}
    </div>
  );
}

function Face({ name, size = 36 }: { name: string; size?: number }) {
  const hues = ["#ffcf3f", "#b9c8ff", "#c8b6ff", "#a8e6c8", "#ffc2b0"];
  const h = hues[name.length % hues.length];
  return (
    <span className="grid shrink-0 place-items-center rounded-full text-[12px] font-bold" style={{ width: size, height: size, background: h }}>
      {initials(name)}
    </span>
  );
}

export default function SaasApp({ name, area, city }: DemoProps) {
  const { mode, scrollToSection } = useScreen();
  const desktop = mode === "desktop";
  const [tab, setTab] = useState<Tab>("today");
  const [roster, setRoster] = useState(ROSTER);
  const [day, setDay] = useState(0);
  const [leaves, setLeaves] = useState<LeaveStatus[]>(LEAVES.map(() => "Pending"));
  const [reminded, setReminded] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [paid, setPaid] = useState(false);
  const [toast, showToast] = useToast(3000);

  const go = (t: Tab) => {
    setTab(t);
    scrollToSection("top");
  };
  useDemoNav((id) => {
    if (TABS.some((t) => t.id === id)) {
      go(id as Tab);
      return true;
    }
    return false;
  });

  const cycle = (p: number, d: number) => {
    setRoster((r) => r.map((row, i) => (i === p ? row.map((s, j) => (j === d ? CYCLE[(CYCLE.indexOf(s) + 1) % CYCLE.length] : s)) : row)));
    showToast(`${TEAM[p].name.split(" ")[0]} gets the new shift on WhatsApp`);
  };
  const decide = (i: number, s: LeaveStatus) => {
    setLeaves((l) => l.map((x, j) => (j === i ? s : x)));
    showToast(`${LEAVES[i].name.split(" ")[0]} has been told on WhatsApp`);
  };
  const pending = leaves.filter((l) => l === "Pending").length;
  const total = PAY.reduce((a, p) => a + p.net, 0);

  const content = (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="grid gap-3 @3xl:gap-4">
        {tab === "today" && (
          <>
            <div>
              <p className="text-[13px] font-medium" style={{ color: C.mute }}>
                {area} outlet · {city}
              </p>
              <h1 className="text-[24px] font-semibold tracking-[-0.03em] @3xl:text-[28px]" style={display}>
                Today's team
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-3 @3xl:grid-cols-4 @3xl:gap-4">
              {[
                { label: "Present", value: `${CHECKINS.length + 2} / ${TEAM.length}`, color: C.green, sub: "5 on time" },
                { label: "Late", value: "1", color: C.amber, sub: "Meena, 22 min" },
                { label: "Absent", value: String(ABSENT.length), color: C.red, sub: "not checked in" },
                { label: "Leave requests", value: String(pending), color: C.blue, sub: "need your OK", go: "leave" as Tab },
              ].map((k) => (
                <button
                  key={k.label}
                  type="button"
                  onClick={() => k.go && go(k.go)}
                  className="rounded-[18px] bg-white p-4 text-left ring-1"
                  style={{ ["--tw-ring-color" as string]: C.line, cursor: k.go ? "pointer" : "default" }}
                >
                  <p className="text-[12.5px] font-medium" style={{ color: C.mute }}>
                    {k.label}
                  </p>
                  <p className="mt-1 text-[24px] font-semibold tracking-[-0.03em]" style={display}>
                    {k.value}
                  </p>
                  <p className="text-[11.5px] font-semibold" style={{ color: k.color }}>
                    {k.sub}
                  </p>
                </button>
              ))}
            </div>
            <div className="grid gap-3 @3xl:grid-cols-[1.4fr_1fr] @3xl:gap-4">
              <Card>
                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-bold">Latest check-ins</p>
                  <span className="flex items-center gap-1.5 text-[11.5px] font-semibold" style={{ color: C.green }}>
                    <span className="size-1.5 rounded-full" style={{ background: C.green }} /> Live from WhatsApp
                  </span>
                </div>
                <ul className="mt-2 divide-y" style={{ borderColor: C.line }}>
                  {CHECKINS.map((c) => (
                    <li key={c.name} className="flex items-center gap-3 py-2.5" style={{ borderColor: C.line }}>
                      <Face name={c.name} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-semibold">{c.name}</span>
                        <span className="flex items-center gap-1 text-[11.5px]" style={{ color: C.mute }}>
                          <Camera className="size-3" /> Selfie verified · at outlet
                        </span>
                      </span>
                      <span className="text-right">
                        <span className="block text-[13px] font-bold">{c.time}</span>
                        <span className="text-[11px] font-semibold" style={{ color: c.late ? C.amber : C.green }}>
                          {c.late ? "22 min late" : "On time"}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card>
                <p className="text-[14px] font-bold">Not in yet</p>
                {ABSENT.map((a) => (
                  <div key={a} className="mt-3 flex items-center gap-3">
                    <Face name={a} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13.5px] font-semibold">{a}</span>
                      <span className="text-[11.5px]" style={{ color: C.mute }}>
                        Shift started 9:00 AM
                      </span>
                    </span>
                  </div>
                ))}
                <button
                  type="button"
                  disabled={reminded}
                  onClick={() => {
                    setReminded(true);
                    showToast("Reminder sent to Arjun on WhatsApp");
                  }}
                  className="mt-4 w-full rounded-[12px] py-2.5 text-[13px] font-bold"
                  style={reminded ? { background: C.greenSoft, color: C.green } : { background: C.ink, color: "#fff" }}
                >
                  {reminded ? "Reminder sent ✓" : "Send a WhatsApp reminder"}
                </button>
                <div className="mt-4 rounded-[12px] p-3 text-[12px]" style={{ background: C.sunSoft }}>
                  <p className="font-bold">Open shift tonight</p>
                  <p style={{ color: C.mute }}>2–10 PM waiter. 3 people have offered to cover.</p>
                </div>
              </Card>
            </div>
          </>
        )}

        {tab === "roster" && (
          <>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[13px] font-medium" style={{ color: C.mute }}>
                  10 – 16 November
                </p>
                <h1 className="text-[24px] font-semibold tracking-[-0.03em]" style={display}>
                  Roster
                </h1>
              </div>
              <p className="text-[12px] font-medium" style={{ color: C.mute }}>
                Tap a shift to change it
              </p>
            </div>
            {desktop ? (
              <Card className="overflow-hidden p-0">
                <table className="w-full border-collapse text-[13px]">
                  <thead>
                    <tr style={{ color: C.mute }}>
                      <th className="px-4 py-3 text-left font-semibold">Team</th>
                      {DAYS.map((d) => (
                        <th key={d} className="px-1 py-3 font-semibold">
                          {d}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TEAM.map((t, p) => (
                      <tr key={t.name} className="border-t" style={{ borderColor: C.line }}>
                        <td className="px-4 py-2">
                          <span className="flex items-center gap-2.5">
                            <Face name={t.name} size={30} />
                            <span>
                              <span className="block font-semibold">{t.name}</span>
                              <span className="text-[11.5px]" style={{ color: C.mute }}>
                                {t.role}
                              </span>
                            </span>
                          </span>
                        </td>
                        {roster[p].map((s, d) => (
                          <td key={d} className="px-1 py-2">
                            <button
                              type="button"
                              onClick={() => cycle(p, d)}
                              className="w-full rounded-[9px] py-2 text-[12px] font-bold transition-transform hover:scale-[1.04]"
                              style={{ background: SHIFT[s].bg, color: SHIFT[s].fg }}
                            >
                              {SHIFT[s].label}
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            ) : (
              <>
                <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
                  {DAYS.map((d, i) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDay(i)}
                      className="shrink-0 rounded-full px-4 py-2 text-[13px] font-bold"
                      style={day === i ? { background: C.ink, color: "#fff" } : { background: "#fff", color: C.mute }}
                    >
                      {d} {10 + i}
                    </button>
                  ))}
                </div>
                <Card className="p-0">
                  <ul className="divide-y" style={{ borderColor: C.line }}>
                    {TEAM.map((t, p) => {
                      const s = roster[p][day];
                      return (
                        <li key={t.name} className="flex items-center gap-3 px-4 py-3" style={{ borderColor: C.line }}>
                          <Face name={t.name} size={34} />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[14px] font-semibold">{t.name}</span>
                            <span className="text-[11.5px]" style={{ color: C.mute }}>
                              {t.role}
                            </span>
                          </span>
                          <button type="button" onClick={() => cycle(p, day)} className="rounded-[9px] px-3 py-2 text-[12.5px] font-bold" style={{ background: SHIFT[s].bg, color: SHIFT[s].fg }}>
                            {SHIFT[s].label}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </Card>
              </>
            )}
            <div className="flex flex-wrap gap-3 text-[12px]" style={{ color: C.mute }}>
              {(["M", "E", "N"] as Shift[]).map((k) => (
                <span key={k} className="flex items-center gap-1.5">
                  <span className="size-3 rounded" style={{ background: SHIFT[k].bg, boxShadow: `inset 0 0 0 1px ${SHIFT[k].fg}33` }} />
                  {k === "M" ? "Morning" : k === "E" ? "Evening" : "Night"} {SHIFT[k].label}
                </span>
              ))}
            </div>
          </>
        )}

        {tab === "leave" && (
          <>
            <h1 className="text-[24px] font-semibold tracking-[-0.03em]" style={display}>
              Leave requests
            </h1>
            {LEAVES.map((l, i) => (
              <Card key={l.name}>
                <div className="flex items-start gap-3">
                  <Face name={l.name} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold">{l.name}</p>
                    <p className="text-[12.5px]" style={{ color: C.mute }}>
                      {l.dates} · "{l.reason}"
                    </p>
                  </div>
                  {leaves[i] !== "Pending" && (
                    <span
                      className="rounded-full px-2.5 py-1 text-[11.5px] font-bold"
                      style={leaves[i] === "Approved" ? { background: C.greenSoft, color: C.green } : { background: C.redSoft, color: C.red }}
                    >
                      {leaves[i]}
                    </span>
                  )}
                </div>
                {leaves[i] === "Pending" && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => decide(i, "Declined")} className="flex items-center justify-center gap-1.5 rounded-[11px] py-2.5 text-[13px] font-bold ring-1" style={{ ["--tw-ring-color" as string]: C.line }}>
                      <X className="size-4" /> Decline
                    </button>
                    <button type="button" onClick={() => decide(i, "Approved")} className="flex items-center justify-center gap-1.5 rounded-[11px] py-2.5 text-[13px] font-bold text-white" style={{ background: C.green }}>
                      <Check className="size-4" /> Approve
                    </button>
                  </div>
                )}
              </Card>
            ))}
            <p className="text-[12.5px]" style={{ color: C.mute }}>
              Staff ask for leave on WhatsApp. When you approve, the roster updates and cover is found for open shifts.
            </p>
          </>
        )}

        {tab === "payroll" && (
          <>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[13px] font-medium" style={{ color: C.mute }}>
                  October 2026 · {TEAM.length} people
                </p>
                <h1 className="text-[24px] font-semibold tracking-[-0.03em]" style={display}>
                  Payroll
                </h1>
              </div>
              <p className="text-right">
                <span className="block text-[12px]" style={{ color: C.mute }}>
                  Total to pay
                </span>
                <span className="text-[22px] font-semibold" style={display}>
                  ₹{inr(total)}
                </span>
              </p>
            </div>
            <Card className="p-0">
              <div className="hidden grid-cols-[1.6fr_repeat(4,1fr)] gap-2 border-b px-4 py-2.5 text-[12px] font-semibold @3xl:grid" style={{ borderColor: C.line, color: C.mute }}>
                <span>Team</span>
                <span className="text-right">Days</span>
                <span className="text-right">Overtime</span>
                <span className="text-right">Advance</span>
                <span className="text-right">Net pay</span>
              </div>
              <ul className="divide-y" style={{ borderColor: C.line }}>
                {PAY.map((p) => (
                  <li key={p.name} className="grid grid-cols-[1fr_auto] items-center gap-2 px-4 py-3 text-[13px] @3xl:grid-cols-[1.6fr_repeat(4,1fr)]" style={{ borderColor: C.line }}>
                    <span className="flex min-w-0 items-center gap-2.5">
                      <Face name={p.name} size={30} />
                      <span className="min-w-0">
                        <span className="block truncate font-semibold">{p.name}</span>
                        <span className="text-[11.5px] @3xl:hidden" style={{ color: C.mute }}>
                          {p.days} days{p.ot ? ` · ${p.ot}h OT` : ""}
                          {p.advance ? ` · −₹${inr(p.advance)} advance` : ""}
                        </span>
                      </span>
                    </span>
                    <span className="hidden text-right @3xl:block">{p.days}</span>
                    <span className="hidden text-right @3xl:block">{p.ot ? `${p.ot} h` : "—"}</span>
                    <span className="hidden text-right @3xl:block" style={{ color: p.advance ? C.red : C.mute }}>
                      {p.advance ? `−₹${inr(p.advance)}` : "—"}
                    </span>
                    <span className="text-right font-bold">₹{inr(p.net)}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <button
              type="button"
              onClick={() => setPayOpen(true)}
              disabled={paid}
              className="flex items-center justify-center gap-2 rounded-[14px] py-3.5 text-[14px] font-bold"
              style={paid ? { background: C.greenSoft, color: C.green } : { background: C.ink, color: "#fff" }}
            >
              {paid ? (
                <>
                  <Check className="size-4" /> Salaries paid
                </>
              ) : (
                <>
                  <IndianRupee className="size-4" /> Pay everyone by UPI
                </>
              )}
            </button>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className="relative min-h-full @3xl:grid @3xl:grid-cols-[232px_1fr]" style={{ ...body, background: C.bg }}>
      <aside className="hidden border-r bg-white @3xl:sticky @3xl:top-0 @3xl:flex @3xl:h-[768px] @3xl:flex-col @3xl:p-5" style={{ borderColor: C.line }}>
        <span className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-[10px] text-[12px] font-bold" style={{ background: C.sun, ...display }}>
            {initials(name)}
          </span>
          <span className="text-[16px] font-semibold tracking-[-0.02em]" style={display}>
            {name}
          </span>
        </span>
        <nav className="mt-8 grid gap-1" aria-label="App">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => go(t.id)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] font-semibold transition-colors"
              style={tab === t.id ? { background: C.sunSoft, color: C.ink } : { color: C.mute }}
            >
              <t.icon className="size-[18px]" /> {t.label}
              {t.id === "leave" && pending > 0 && (
                <span className="ml-auto rounded-full px-2 text-[11px] font-bold text-white" style={{ background: C.blue }}>
                  {pending}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="mt-auto rounded-xl p-3 text-[12px]" style={{ background: C.bg, color: C.mute }}>
          <p className="flex items-center gap-1.5 font-bold" style={{ color: C.ink }}>
            <Clock className="size-3.5" /> Daily report
          </p>
          Attendance summary on WhatsApp every day at 11 AM.
        </div>
      </aside>

      <div className="min-w-0">
        <header data-section="top" className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b bg-white/95 px-4 py-3 backdrop-blur @3xl:px-8" style={{ borderColor: C.line }}>
          <span className="flex items-center gap-2 @3xl:hidden">
            <span className="grid size-8 place-items-center rounded-[10px] text-[12px] font-bold" style={{ background: C.sun, ...display }}>
              {initials(name)}
            </span>
            <span className="text-[16px] font-semibold" style={display}>
              {name}
            </span>
          </span>
          <div className="hidden h-10 w-[340px] items-center gap-2 rounded-xl px-3 text-[13.5px] @3xl:flex" style={{ background: C.bg, color: C.mute }}>
            <Search className="size-4" /> Search people, shifts, dates…
          </div>
          <div className="flex items-center gap-3">
            <span className="relative">
              <Bell className="size-5" style={{ color: C.mute }} />
              <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full" style={{ background: C.blue }} />
            </span>
            <span className="hidden items-center gap-2 @3xl:flex">
              <Face name="Anjali Verma" size={30} />
              <span className="text-[13px] font-semibold">Anjali · Manager</span>
            </span>
          </div>
        </header>
        <main className="p-4 pb-28 @3xl:p-8">{content}</main>
      </div>

      {!desktop && (
        <nav className="sticky bottom-0 z-30 grid grid-cols-4 border-t bg-white px-2 pb-6 pt-2" style={{ borderColor: C.line }} aria-label="App">
          {TABS.map((t) => (
            <button key={t.id} type="button" onClick={() => go(t.id)} className="flex flex-col items-center gap-1 py-1 text-[11px] font-semibold" style={{ color: tab === t.id ? C.ink : C.mute }}>
              <span className="grid h-7 w-12 place-items-center rounded-full" style={tab === t.id ? { background: C.sunSoft } : undefined}>
                <t.icon className="size-[18px]" />
              </span>
              {t.label}
            </button>
          ))}
        </nav>
      )}

      <Sheet open={payOpen} onClose={() => setPayOpen(false)} title="Pay salaries" style={body}>
        {paid ? (
          <div className="flex flex-col items-center py-6 text-center">
            <SuccessTick color={C.green} size={64} />
            <p className="mt-4 text-[18px] font-semibold" style={display}>
              ₹{inr(total)} sent
            </p>
            <p className="mt-1 text-[13.5px]" style={{ color: C.mute }}>
              {TEAM.length} people paid by UPI. Each got a payslip on WhatsApp.
            </p>
            <button type="button" onClick={() => setPayOpen(false)} className="mt-6 w-full rounded-[14px] py-3 text-[14px] font-bold text-white" style={{ background: C.ink }}>
              Done
            </button>
          </div>
        ) : (
          <div>
            <p className="text-[14px]" style={{ color: C.mute }}>
              You're paying {TEAM.length} people for October, after overtime and advances.
            </p>
            <p className="mt-4 text-[30px] font-semibold tracking-[-0.03em]" style={display}>
              ₹{inr(total)}
            </p>
            <p className="mt-1 text-[12.5px]" style={{ color: C.mute }}>
              From your business account ••4821
            </p>
            <button type="button" onClick={() => setPaid(true)} className="mt-6 w-full rounded-[14px] py-3.5 text-[14px] font-bold text-white" style={{ background: C.ink }}>
              Confirm and pay
            </button>
          </div>
        )}
      </Sheet>
      <Toast message={toast} style={body} />
    </div>
  );
}
