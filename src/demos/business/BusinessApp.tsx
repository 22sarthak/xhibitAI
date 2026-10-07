import "@fontsource-variable/inter";
import { Bell, FileText, House, Package, Plus, Receipt, Search, Send, Wallet, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, type CSSProperties, type ReactNode } from "react";
import { useDemoNav, useScreen } from "../../components/device/DeviceScreen";
import { cn, initials, inr } from "../../lib/utils";
import { Sheet, SuccessTick, Toast, realSiteNote, useToast, type DemoProps } from "../kit";

/* ── Shree Traders · orders, stock, GST invoices and dues — a business web app ── */

const C = {
  bg: "#f4f6f9",
  ink: "#0f172a",
  mute: "#64748b",
  line: "rgba(15,23,42,.08)",
  blue: "#2457f5",
  blueSoft: "#e9effe",
  green: "#15803d",
  greenSoft: "#e6f5eb",
  amber: "#a15c07",
  amberSoft: "#fdf2df",
  red: "#b91c1c",
  redSoft: "#fdecec",
};
const font: CSSProperties = { fontFamily: '"Inter Variable", system-ui, sans-serif', color: C.ink };

type Tab = "home" | "orders" | "stock" | "dues" | "reports";
const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "home", label: "Home", icon: House },
  { id: "orders", label: "Orders", icon: Receipt },
  { id: "stock", label: "Stock", icon: Package },
  { id: "dues", label: "Dues", icon: Wallet },
  { id: "reports", label: "Reports", icon: FileText },
];

type Status = "Pending" | "Packed" | "Out for delivery" | "Delivered";
type Order = { id: string; customer: string; items: number; amount: number; status: Status; time: string };
const ORDERS: Order[] = [
  { id: "SO-1042", customer: "Gupta Stores", items: 12, amount: 12400, status: "Delivered", time: "10:12 AM" },
  { id: "SO-1041", customer: "Maa Tara Kirana", items: 8, amount: 8750, status: "Packed", time: "9:48 AM" },
  { id: "SO-1040", customer: "New Bharat Traders", items: 21, amount: 21300, status: "Out for delivery", time: "9:15 AM" },
  { id: "SO-1039", customer: "Sharma General Store", items: 5, amount: 4120, status: "Pending", time: "Yesterday" },
  { id: "SO-1038", customer: "Lakshmi Provisions", items: 15, amount: 15680, status: "Delivered", time: "Yesterday" },
];
const STATUS_STYLE: Record<Status, { bg: string; fg: string }> = {
  Pending: { bg: "#eef1f5", fg: "#475569" },
  Packed: { bg: C.blueSoft, fg: "#1d43c4" },
  "Out for delivery": { bg: C.amberSoft, fg: C.amber },
  Delivered: { bg: C.greenSoft, fg: C.green },
};

const STOCK = [
  { name: "Basmati Rice 25 kg", qty: 6, min: 20, unit: "bags" },
  { name: "Mustard Oil 15 L tin", qty: 11, min: 15, unit: "tins" },
  { name: "Sugar 50 kg", qty: 4, min: 10, unit: "bags" },
  { name: "Atta 10 kg", qty: 9, min: 25, unit: "bags" },
  { name: "Detergent 1 kg", qty: 15, min: 40, unit: "packs" },
  { name: "Toor Dal 30 kg", qty: 42, min: 15, unit: "bags" },
  { name: "Tea 1 kg", qty: 180, min: 60, unit: "packs" },
];

const DUES = [
  { name: "Gupta Stores", amount: 12400, days: 21, invoice: "INV-2584" },
  { name: "Sharma General Store", amount: 8900, days: 12, invoice: "INV-2590" },
  { name: "Maa Tara Kirana", amount: 46500, days: 9, invoice: "INV-2597" },
  { name: "New Bharat Traders", amount: 61200, days: 7, invoice: "INV-2601" },
  { name: "Lakshmi Provisions", amount: 23400, days: 4, invoice: "INV-2606" },
  { name: "Hari Om Stores", amount: 29800, days: 2, invoice: "INV-2609" },
];

const WEEK = [
  { day: "Mon", value: 31200 },
  { day: "Tue", value: 42800 },
  { day: "Wed", value: 38400 },
  { day: "Thu", value: 45100 },
  { day: "Fri", value: 51600 },
  { day: "Sat", value: 63900 },
  { day: "Today", value: 48250 },
];

const ITEMS = [
  { name: "Basmati Rice 25 kg", price: 2150 },
  { name: "Mustard Oil 15 L", price: 2380 },
  { name: "Toor Dal 30 kg", price: 3900 },
];

const compact = (n: number) => (n >= 100000 ? `₹${(n / 100000).toFixed(2)}L` : `₹${(n / 1000).toFixed(1)}k`);

/* Weekly sales — single series, one hue, baseline-anchored rounded bars, tooltip on hover/tap. */
function SalesChart() {
  const [active, setActive] = useState<number | null>(null);
  const W = 520;
  const H = 210;
  const pad = { l: 40, r: 8, t: 26, b: 26 };
  const max = 70000;
  const plotW = W - pad.l - pad.r;
  const plotH = H - pad.t - pad.b;
  const slot = plotW / WEEK.length;
  const barW = slot * 0.5;
  const y = (v: number) => pad.t + plotH - (v / max) * plotH;
  const bar = (x: number, top: number, w: number, bottom: number) => {
    const r = Math.min(4, w / 2, bottom - top);
    return `M${x},${bottom}V${top + r}Q${x},${top} ${x + r},${top}H${x + w - r}Q${x + w},${top} ${x + w},${top + r}V${bottom}Z`;
  };
  const shown = active ?? WEEK.length - 1;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Sales this week, bar chart. Highest on Saturday at 63,900 rupees.">
        {[0, 20000, 40000, 60000].map((g) => (
          <g key={g}>
            <line x1={pad.l} x2={W - pad.r} y1={y(g)} y2={y(g)} stroke="rgba(15,23,42,.07)" strokeWidth="1" />
            <text x={pad.l - 8} y={y(g) + 4} textAnchor="end" fontSize="11" fill={C.mute}>
              {g ? `${g / 1000}k` : "0"}
            </text>
          </g>
        ))}
        {WEEK.map((d, i) => {
          const x = pad.l + i * slot + (slot - barW) / 2;
          const isToday = i === WEEK.length - 1;
          return (
            <g key={d.day}>
              <motion.path
                d={bar(x, y(d.value), barW, y(0))}
                fill={C.blue}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.7, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
                style={{ originY: 1, transformBox: "fill-box" }}
                opacity={active === null || active === i ? 1 : 0.55}
              />
              <text x={x + barW / 2} y={H - 8} textAnchor="middle" fontSize="11" fontWeight={isToday ? 700 : 500} fill={isToday ? C.ink : C.mute}>
                {d.day}
              </text>
              {/* generous hit target */}
              <rect
                x={pad.l + i * slot}
                y={pad.t}
                width={slot}
                height={plotH}
                fill="transparent"
                tabIndex={0}
                role="img"
                aria-label={`${d.day}: ₹${inr(d.value)}`}
                onPointerEnter={() => setActive(i)}
                onPointerLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(i)}
                style={{ cursor: "pointer", outline: "none" }}
              />
            </g>
          );
        })}
        {/* single direct label: the active (or today's) bar */}
        {(() => {
          const d = WEEK[shown];
          const cx = pad.l + shown * slot + slot / 2;
          return (
            <g pointerEvents="none">
              <rect x={cx - 34} y={y(d.value) - 26} width="68" height="20" rx="6" fill={C.ink} />
              <text x={cx} y={y(d.value) - 12} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#fff">
                ₹{inr(d.value)}
              </text>
            </g>
          );
        })()}
      </svg>
      <table className="sr-only">
        <caption>Sales this week</caption>
        <tbody>
          {WEEK.map((d) => (
            <tr key={d.day}>
              <th scope="row">{d.day}</th>
              <td>₹{inr(d.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-[18px] bg-white p-4 ring-1", className)} style={{ ["--tw-ring-color" as string]: C.line }}>
      {children}
    </div>
  );
}

function StatusPill({ s }: { s: Status }) {
  return (
    <span className="whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: STATUS_STYLE[s].bg, color: STATUS_STYLE[s].fg }}>
      {s}
    </span>
  );
}

export default function BusinessApp({ name, area }: DemoProps) {
  const { mode, scrollToSection } = useScreen();
  const desktop = mode === "desktop";
  const [tab, setTab] = useState<Tab>("home");
  const [orders, setOrders] = useState(ORDERS);
  const [reminded, setReminded] = useState<Set<string>>(new Set());
  const [remind, setRemind] = useState<(typeof DUES)[number] | null>(null);
  const [newOrder, setNewOrder] = useState(false);
  const [created, setCreated] = useState<string | null>(null);
  const [customer, setCustomer] = useState("Hari Om Stores");
  const [qty, setQty] = useState([4, 2, 0]);
  const [toast, showToast] = useToast(3400);

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

  const subtotal = ITEMS.reduce((a, it, i) => a + it.price * qty[i], 0);
  const gst = Math.round(subtotal * 0.05);
  const dueTotal = DUES.reduce((a, d) => a + d.amount, 0);
  const low = STOCK.filter((s) => s.qty < s.min);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  const createOrder = () => {
    const id = `SO-${1043 + orders.length - ORDERS.length}`;
    setOrders((o) => [{ id, customer, items: qty.reduce((a, b) => a + b, 0), amount: subtotal + gst, status: "Pending", time: "Just now" }, ...o]);
    setCreated(`INV-${2611 + orders.length - ORDERS.length}`);
  };

  const content = (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }} className="grid gap-3 @3xl:gap-4">
        {tab === "home" && (
          <>
            <div className="mb-1">
              <p className="text-[13px] font-medium" style={{ color: C.mute }}>
                {today}
              </p>
              <h1 className="text-[24px] font-bold tracking-[-0.02em] @3xl:text-[28px]">{greeting}</h1>
            </div>
            <div className="grid grid-cols-2 gap-3 @3xl:grid-cols-4 @3xl:gap-4">
              {[
                { label: "Today's sales", value: "₹48,250", sub: "▲ 12% vs yesterday", color: C.green, go: "reports" as Tab },
                { label: "Orders today", value: "23", sub: "5 still pending", color: C.mute, go: "orders" as Tab },
                { label: "To collect", value: compact(dueTotal), sub: `${DUES.length} customers`, color: C.amber, go: "dues" as Tab },
                { label: "Low stock", value: String(low.length), sub: "items below limit", color: C.red, go: "stock" as Tab },
              ].map((k) => (
                <button key={k.label} type="button" onClick={() => go(k.go)} className="rounded-[18px] bg-white p-4 text-left ring-1 transition-shadow hover:shadow-md" style={{ ["--tw-ring-color" as string]: C.line }}>
                  <p className="text-[12.5px] font-medium" style={{ color: C.mute }}>
                    {k.label}
                  </p>
                  <p className="mt-1 text-[24px] font-bold tracking-[-0.02em]">{k.value}</p>
                  <p className="text-[11.5px] font-semibold" style={{ color: k.color }}>
                    {k.sub}
                  </p>
                </button>
              ))}
            </div>
            <div className="grid gap-3 @3xl:grid-cols-[1.4fr_1fr] @3xl:gap-4">
              <Card>
                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-bold">Sales this week</p>
                  <p className="text-[12px] font-semibold" style={{ color: C.mute }}>
                    ₹3,21,250 total
                  </p>
                </div>
                <div className="mt-2">
                  <SalesChart />
                </div>
              </Card>
              <Card>
                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-bold">Running low</p>
                  <button type="button" onClick={() => go("stock")} className="text-[12px] font-semibold" style={{ color: C.blue }}>
                    See all
                  </button>
                </div>
                <ul className="mt-3 grid gap-2.5">
                  {low.slice(0, 4).map((s) => (
                    <li key={s.name} className="flex items-center justify-between gap-3 text-[13px]">
                      <span className="truncate">{s.name}</span>
                      <span className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ background: C.redSoft, color: C.red }}>
                        {s.qty} left
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
            <Card>
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-bold">Recent orders</p>
                <button type="button" onClick={() => go("orders")} className="text-[12px] font-semibold" style={{ color: C.blue }}>
                  View all
                </button>
              </div>
              <ul className="mt-2 divide-y" style={{ borderColor: C.line }}>
                {orders.slice(0, 3).map((o) => (
                  <li key={o.id} className="flex items-center gap-3 py-2.5" style={{ borderColor: C.line }}>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full text-[12px] font-bold" style={{ background: C.blueSoft, color: C.blue }}>
                      {initials(o.customer)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-semibold">{o.customer}</span>
                      <span className="text-[11.5px]" style={{ color: C.mute }}>
                        {o.id} · {o.time}
                      </span>
                    </span>
                    <span className="text-right">
                      <span className="block text-[13.5px] font-bold">₹{inr(o.amount)}</span>
                      <StatusPill s={o.status} />
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </>
        )}

        {tab === "orders" && (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-[22px] font-bold tracking-[-0.02em]">Orders</h1>
              <button
                type="button"
                onClick={() => {
                  setCreated(null);
                  setNewOrder(true);
                }}
                className="flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-bold text-white"
                style={{ background: C.blue }}
              >
                <Plus className="size-4" /> New order
              </button>
            </div>
            <Card className="p-0">
              <ul className="divide-y" style={{ borderColor: C.line }}>
                {orders.map((o) => (
                  <motion.li key={o.id} layout initial={{ backgroundColor: "#e9effe" }} animate={{ backgroundColor: "#ffffff" }} transition={{ duration: 1.6 }} className="flex items-center gap-3 px-4 py-3" style={{ borderColor: C.line }}>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-semibold">{o.customer}</span>
                      <span className="text-[12px]" style={{ color: C.mute }}>
                        {o.id} · {o.items} items · {o.time}
                      </span>
                    </span>
                    <span className="text-right">
                      <span className="block text-[14px] font-bold">₹{inr(o.amount)}</span>
                      <StatusPill s={o.status} />
                    </span>
                  </motion.li>
                ))}
              </ul>
            </Card>
          </>
        )}

        {tab === "stock" && (
          <>
            <h1 className="text-[22px] font-bold tracking-[-0.02em]">Stock</h1>
            <Card className="p-0">
              <ul className="divide-y" style={{ borderColor: C.line }}>
                {STOCK.map((s) => {
                  const isLow = s.qty < s.min;
                  const pct = Math.min(100, (s.qty / (s.min * 2)) * 100);
                  return (
                    <li key={s.name} className="px-4 py-3" style={{ borderColor: C.line }}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="min-w-0">
                          <span className="block truncate text-[14px] font-semibold">{s.name}</span>
                          <span className="text-[12px]" style={{ color: isLow ? C.red : C.mute }}>
                            {s.qty} {s.unit} left · reorder at {s.min}
                          </span>
                        </span>
                        {isLow ? (
                          <button type="button" onClick={() => showToast(`Purchase order for ${s.name} sent to your supplier on WhatsApp.`)} className="shrink-0 rounded-full px-3 py-1.5 text-[12px] font-bold text-white" style={{ background: C.red }}>
                            Reorder
                          </button>
                        ) : (
                          <span className="shrink-0 text-[12px] font-semibold" style={{ color: C.green }}>
                            In stock
                          </span>
                        )}
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} style={{ background: isLow ? C.red : C.green }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </>
        )}

        {tab === "dues" && (
          <>
            <div className="rounded-[18px] p-5 text-white" style={{ background: `linear-gradient(135deg, ${C.blue}, #1d3fb8)` }}>
              <p className="text-[12.5px] font-medium text-white/75">Total to collect</p>
              <p className="text-[32px] font-bold tracking-[-0.02em]">₹{inr(dueTotal)}</p>
              <p className="text-[12px] text-white/75">from {DUES.length} customers · reminders go out on WhatsApp with a UPI link</p>
            </div>
            <Card className="p-0">
              <ul className="divide-y" style={{ borderColor: C.line }}>
                {DUES.map((d) => {
                  const done = reminded.has(d.name);
                  return (
                    <li key={d.name} className="flex items-center gap-3 px-4 py-3" style={{ borderColor: C.line }}>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-semibold">{d.name}</span>
                        <span className="text-[12px] font-medium" style={{ color: d.days > 10 ? C.red : C.mute }}>
                          ₹{inr(d.amount)} · {d.days} days overdue
                        </span>
                      </span>
                      <button
                        type="button"
                        disabled={done}
                        onClick={() => setRemind(d)}
                        className="shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] font-bold"
                        style={done ? { background: C.greenSoft, color: C.green } : { background: C.blueSoft, color: C.blue }}
                      >
                        {done ? "Reminded ✓" : "Remind"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </>
        )}

        {tab === "reports" && (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-[22px] font-bold tracking-[-0.02em]">GST summary</h1>
              <span className="rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold ring-1" style={{ ["--tw-ring-color" as string]: C.line }}>
                September 2026
              </span>
            </div>
            <Card>
              <dl className="grid grid-cols-[1fr_auto] gap-y-2.5 text-[13.5px]">
                {[
                  ["Taxable sales", "₹12,48,300"],
                  ["GST collected", "₹98,640"],
                  ["Purchases", "₹9,36,500"],
                  ["Input tax credit", "−₹71,280"],
                ].map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt style={{ color: C.mute }}>{k}</dt>
                    <dd className="text-right font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-3 flex items-center justify-between border-t pt-3" style={{ borderColor: C.line }}>
                <span className="text-[14px] font-bold">Net GST payable</span>
                <span className="text-[20px] font-bold">₹27,360</span>
              </div>
            </Card>
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <p className="text-[12px]" style={{ color: C.mute }}>
                  Invoices raised
                </p>
                <p className="text-[22px] font-bold">412</p>
              </Card>
              <Card>
                <p className="text-[12px]" style={{ color: C.mute }}>
                  Collected this month
                </p>
                <p className="text-[22px] font-bold">₹11.6L</p>
              </Card>
            </div>
            <button type="button" onClick={() => showToast(realSiteNote("this downloads an Excel/PDF your CA can file from directly."))} className="flex items-center justify-center gap-2 rounded-[14px] py-3.5 text-[14px] font-bold text-white" style={{ background: C.ink }}>
              <FileText className="size-4" /> Download for your CA
            </button>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className="relative min-h-full @3xl:grid @3xl:grid-cols-[232px_1fr]" style={{ ...font, background: C.bg }}>
      {/* Sidebar (desktop) */}
      <aside className="hidden border-r bg-white @3xl:sticky @3xl:top-0 @3xl:flex @3xl:h-[768px] @3xl:flex-col @3xl:p-5" style={{ borderColor: C.line }}>
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl text-[13px] font-bold text-white" style={{ background: C.blue }}>
            {initials(name)}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[14px] font-bold">{name}</span>
            <span className="text-[11.5px]" style={{ color: C.mute }}>
              {area}, Ranchi
            </span>
          </span>
        </div>
        <nav className="mt-7 grid gap-1" aria-label="App">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => go(t.id)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] font-semibold transition-colors"
              style={tab === t.id ? { background: C.blueSoft, color: C.blue } : { color: C.mute }}
            >
              <t.icon className="size-[18px]" strokeWidth={2} /> {t.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto rounded-xl p-3 text-[12px]" style={{ background: C.bg, color: C.mute }}>
          <p className="font-bold" style={{ color: C.ink }}>
            Daily summary
          </p>
          Sent to owners on WhatsApp every evening at 9 PM.
        </div>
      </aside>

      <div className="min-w-0">
        {/* Top bar */}
        <header data-section="top" className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b bg-white/95 px-4 py-3 backdrop-blur @3xl:px-8" style={{ borderColor: C.line }}>
          <div className="flex min-w-0 items-center gap-2.5 @3xl:hidden">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl text-[13px] font-bold text-white" style={{ background: C.blue }}>
              {initials(name)}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[15px] font-bold">{name}</span>
              <span className="text-[11.5px]" style={{ color: C.mute }}>
                Wholesale · {area}
              </span>
            </span>
          </div>
          <div className="hidden h-10 w-[360px] items-center gap-2 rounded-xl px-3 text-[13.5px] @3xl:flex" style={{ background: C.bg, color: C.mute }}>
            <Search className="size-4" /> Search orders, customers, items…
          </div>
          <div className="flex items-center gap-3">
            <span className="relative">
              <Bell className="size-5" style={{ color: C.mute }} />
              <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full" style={{ background: C.red }} />
            </span>
            <span className="hidden items-center gap-2 @3xl:flex">
              <span className="grid size-8 place-items-center rounded-full bg-slate-200 text-[12px] font-bold">RS</span>
              <span className="text-[13px] font-semibold">Owner</span>
            </span>
          </div>
        </header>

        <main className="p-4 pb-28 @3xl:p-8">{content}</main>
      </div>

      {/* Bottom tabs (phone) */}
      {!desktop && (
        <nav className="sticky bottom-0 z-30 grid grid-cols-5 border-t bg-white px-2 pb-6 pt-2" style={{ borderColor: C.line }} aria-label="App">
          {TABS.map((t) => (
            <button key={t.id} type="button" onClick={() => go(t.id)} className="flex flex-col items-center gap-1 py-1 text-[10.5px] font-semibold" style={{ color: tab === t.id ? C.blue : C.mute }}>
              <t.icon className="size-[21px]" strokeWidth={tab === t.id ? 2.4 : 1.9} />
              {t.label}
            </button>
          ))}
        </nav>
      )}

      {/* Reminder preview */}
      <Sheet open={!!remind} onClose={() => setRemind(null)} title="Send payment reminder" style={font}>
        {remind && (
          <div>
            <p className="pr-8 text-[18px] font-bold">Remind {remind.name}</p>
            <p className="mt-1 text-[13px]" style={{ color: C.mute }}>
              This message goes out on WhatsApp:
            </p>
            <div className="mt-3 rounded-2xl rounded-tl-sm p-3.5 text-[14px] leading-relaxed" style={{ background: "#d9fdd3" }}>
              Namaste! This is a gentle reminder from <b>{name}</b>. ₹{inr(remind.amount)} is pending for invoice {remind.invoice}. You can pay instantly by UPI: <span className="font-semibold text-[#0f6ea8] underline">pay.{name.toLowerCase().replace(/[^a-z]/g, "")}.in/{remind.invoice.toLowerCase()}</span>. Thank you!
            </div>
            <button
              type="button"
              onClick={() => {
                setReminded((s) => new Set(s).add(remind.name));
                setRemind(null);
                showToast(`Reminder sent to ${remind.name} ✓`);
              }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[14.5px] font-bold text-white"
              style={{ background: "#1fa855" }}
            >
              <Send className="size-4" /> Send on WhatsApp
            </button>
          </div>
        )}
      </Sheet>

      {/* New order */}
      <Sheet open={newOrder} onClose={() => setNewOrder(false)} title="New order" style={font}>
        <AnimatePresence mode="wait" initial={false}>
          {!created ? (
            <motion.div key="form" exit={{ opacity: 0 }}>
              <p className="pr-8 text-[18px] font-bold">New order</p>
              <p className="mt-4 text-[12px] font-bold uppercase tracking-[0.08em]" style={{ color: C.mute }}>
                Customer
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["Hari Om Stores", "Gupta Stores", "Maa Tara Kirana"].map((c) => (
                  <button key={c} type="button" onClick={() => setCustomer(c)} className="rounded-full px-3 py-1.5 text-[12.5px] font-semibold ring-1" style={customer === c ? { background: C.blue, color: "#fff", ["--tw-ring-color" as string]: C.blue } : { ["--tw-ring-color" as string]: C.line }}>
                    {c}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-[12px] font-bold uppercase tracking-[0.08em]" style={{ color: C.mute }}>
                Items
              </p>
              <ul className="mt-2 grid gap-2">
                {ITEMS.map((it, i) => (
                  <li key={it.name} className="flex items-center justify-between gap-3 rounded-xl p-2.5 ring-1" style={{ ["--tw-ring-color" as string]: C.line }}>
                    <span className="min-w-0">
                      <span className="block truncate text-[13.5px] font-semibold">{it.name}</span>
                      <span className="text-[12px]" style={{ color: C.mute }}>
                        ₹{inr(it.price)} each
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      <button type="button" aria-label={`Less ${it.name}`} onClick={() => setQty((q) => q.map((v, k) => (k === i ? Math.max(0, v - 1) : v)))} className="grid size-7 place-items-center rounded-full bg-slate-100 font-bold">
                        −
                      </button>
                      <span className="w-5 text-center text-[14px] font-bold tabular-nums">{qty[i]}</span>
                      <button type="button" aria-label={`More ${it.name}`} onClick={() => setQty((q) => q.map((v, k) => (k === i ? v + 1 : v)))} className="grid size-7 place-items-center rounded-full font-bold text-white" style={{ background: C.blue }}>
                        +
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 grid grid-cols-2 gap-y-1 text-[13.5px]">
                <dt style={{ color: C.mute }}>Subtotal</dt>
                <dd className="text-right font-semibold">₹{inr(subtotal)}</dd>
                <dt style={{ color: C.mute }}>GST (5%)</dt>
                <dd className="text-right font-semibold">₹{inr(gst)}</dd>
                <dt className="font-bold">Total</dt>
                <dd className="text-right text-[17px] font-bold">₹{inr(subtotal + gst)}</dd>
              </dl>
              <button type="button" disabled={!subtotal} onClick={createOrder} className="mt-4 w-full rounded-xl py-3.5 text-[14.5px] font-bold text-white disabled:opacity-50" style={{ background: C.blue }}>
                Create invoice & send on WhatsApp
              </button>
            </motion.div>
          ) : (
            <motion.div key="ok" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-3 text-center">
              <SuccessTick color={C.green} />
              <p className="mt-4 text-[20px] font-bold">Invoice {created} sent</p>
              <p className="mt-1 text-[13.5px]" style={{ color: C.mute }}>
                {customer} received a GST invoice for ₹{inr(subtotal + gst)} on WhatsApp.
              </p>
              <button
                type="button"
                onClick={() => {
                  setNewOrder(false);
                  go("orders");
                }}
                className="mt-5 w-full rounded-xl py-3.5 text-[14.5px] font-bold text-white"
                style={{ background: C.ink }}
              >
                See it in orders
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </Sheet>
      <Toast message={toast} />
    </div>
  );
}

