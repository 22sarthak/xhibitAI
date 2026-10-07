import "@fontsource-variable/bodoni-moda";
import "@fontsource-variable/bodoni-moda/wght-italic.css";
import "@fontsource-variable/jost";
import { Heart, MapPin, Search, ShoppingBag, Store, Video } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, type CSSProperties } from "react";
import { useScreen } from "../../components/device/DeviceScreen";
import { cn } from "../../lib/utils";
import { DemoImg, Sheet, Toast, realSiteNote, useToast, type DemoProps } from "../kit";

/* ── Tana Bana · ethnic wear & handloom boutique ───────────────────────── */

const C = { ecru: "#f8f3ea", paper: "#efe6d6", indigo: "#22305b", rose: "#b4235a", gold: "#c9a15b", ink: "#1f1a17", line: "rgba(31,26,23,.1)" };
const serif: CSSProperties = { fontFamily: '"Bodoni Moda Variable", Didot, Georgia, serif' };
const font: CSSProperties = { fontFamily: '"Jost Variable", system-ui, sans-serif', color: C.ink };
const img = (n: string) => `/demos/retail/${n}.webp`;

type Product = { id: string; name: string; colour: string; price: number; mrp?: number; cat: "Sarees" | "Lehengas" | "Men" | "Kurtis"; img: string; tag?: string; fabric: string };
const PRODUCTS: Product[] = [
  { id: "p1", name: "Banarasi Silk Saree", colour: "Violet", price: 8499, mrp: 10999, cat: "Sarees", img: "banarasi", fabric: "Pure silk · zari border · blouse piece included" },
  { id: "p2", name: "Tussar Silk Saree", colour: "Pista", price: 5299, cat: "Sarees", img: "tussar", tag: "Made in Jharkhand", fabric: "Handwoven Tussar silk · natural sheen" },
  { id: "p3", name: "Kanjeevaram Silk", colour: "Royal blue", price: 12999, mrp: 14999, cat: "Sarees", img: "kanjeevaram", fabric: "Pure mulberry silk · temple border" },
  { id: "p4", name: "Embroidered Lehenga", colour: "Lilac", price: 18999, cat: "Lehengas", img: "lehenga", tag: "New", fabric: "Georgette · thread & sequin work · can-can" },
  { id: "p5", name: "Chikankari Kurta", colour: "Mint", price: 2499, cat: "Men", img: "kurta", fabric: "Cotton · hand-embroidered chikankari" },
  { id: "p6", name: "Cotton Kurti Set", colour: "Sage", price: 1899, mrp: 2299, cat: "Kurtis", img: "kurti", fabric: "Soft cotton · kurti, pants & dupatta" },
  { id: "p7", name: "Bandhani Dupatta", colour: "Lime", price: 1299, cat: "Kurtis", img: "dupatta", fabric: "Gajji silk · hand-tied bandhani" },
  { id: "p8", name: "Tissue Silk Saree", colour: "Gold", price: 6999, cat: "Sarees", img: "tissue", tag: "Festive", fabric: "Tissue silk · lightweight · festive shimmer" },
];
const FILTERS = ["All", "Sarees", "Lehengas", "Kurtis", "Men"] as const;

export default function RetailSite({ name, area }: DemoProps) {
  const { mode, scrollToSection } = useScreen();
  const desktop = mode === "desktop";
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [liked, setLiked] = useState<Set<string>>(new Set(["p2"]));
  const [bag, setBag] = useState(0);
  const [bump, setBump] = useState(0);
  const [view, setView] = useState<Product | null>(null);
  const [toast, showToast] = useToast(3600);

  const list = filter === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === filter);
  const addToBag = () => {
    setBag((b) => b + 1);
    setBump((n) => n + 1);
  };

  return (
    <div className="relative min-h-full" style={{ ...font, background: C.ecru }}>
      <div className="px-4 py-2 text-center text-[11.5px] font-medium tracking-[0.06em] text-white" style={{ background: C.indigo }}>
        Free delivery in Ranchi above ₹1,999 · COD available
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 grid grid-cols-[1fr_auto_1fr] items-center border-b px-5 py-3 @3xl:px-12" style={{ background: "rgba(248,243,234,.95)", borderColor: C.line, backdropFilter: "blur(10px)" }}>
        <nav className="hidden gap-7 text-[13px] uppercase tracking-[0.14em] text-black/60 @3xl:flex" aria-label="Demo menu">
          {[
            ["products", "Shop"],
            ["story", "Our story"],
            ["visit", "Visit store"],
          ].map(([id, l]) => (
            <button key={id} type="button" onClick={() => scrollToSection(id)} className="hover:text-black">
              {l}
            </button>
          ))}
        </nav>
        <Search className="size-5 @3xl:hidden" strokeWidth={1.6} aria-hidden="true" />
        <p className="truncate text-center text-[25px] italic leading-none" style={{ ...serif, fontWeight: 500 }}>
          {name}
        </p>
        <div className="flex items-center justify-end gap-4">
          <Search className="hidden size-5 @3xl:block" strokeWidth={1.6} aria-hidden="true" />
          <motion.span key={bump} animate={bump ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.4 }} className="relative">
            <ShoppingBag className="size-[22px]" strokeWidth={1.6} aria-label="Bag" />
            {bag > 0 && (
              <span className="absolute -right-2 -top-1.5 grid size-[18px] place-items-center rounded-full text-[10px] font-bold text-white" style={{ background: C.rose }}>
                {bag}
              </span>
            )}
          </motion.span>
        </div>
      </header>

      {/* Hero */}
      <section data-section="top" className="relative h-[540px] overflow-hidden @3xl:h-[600px]">
        <DemoImg src={img("hero")} alt="Model in a red and gold silk saree" eager className="object-[50%_20%]" />
        <div className="absolute inset-0 bg-linear-to-t from-[#1f1a17]/85 via-[#1f1a17]/15 to-transparent @3xl:bg-linear-to-r @3xl:from-[#1f1a17]/75 @3xl:via-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 text-white @3xl:inset-y-0 @3xl:flex @3xl:max-w-[560px] @3xl:flex-col @3xl:justify-center @3xl:p-14">
          <p className="text-[11px] uppercase tracking-[0.34em] text-white/80">Diwali 2026</p>
          <h1 className="mt-3 text-[52px] italic leading-[0.95] @3xl:text-[84px]" style={{ ...serif, fontWeight: 500 }}>
            The Festive Edit
          </h1>
          <p className="mt-3 text-[14.5px] leading-relaxed text-white/80">Banarasi, Tussar and handloom sarees — woven by artisans, chosen for you.</p>
          <div className="mt-6 flex gap-2.5">
            <button type="button" onClick={() => scrollToSection("products")} className="flex-1 bg-white py-3.5 text-[13px] font-medium uppercase tracking-[0.16em] @3xl:flex-none @3xl:px-8" style={{ color: C.ink }}>
              Shop the edit
            </button>
            <button type="button" onClick={() => scrollToSection("visit")} className="flex-1 py-3.5 text-[13px] font-medium uppercase tracking-[0.16em] ring-1 ring-white/60 @3xl:flex-none @3xl:px-8">
              Visit store
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section data-section="categories" className="px-5 pt-8 @3xl:px-12 @3xl:pt-14">
        <div className="no-scrollbar -mx-5 flex gap-4 overflow-x-auto px-5 @3xl:mx-0 @3xl:justify-center @3xl:gap-10 @3xl:px-0">
          {[
            ["Sarees", "banarasi"],
            ["Lehengas", "lehenga"],
            ["Kurtis", "kurti"],
            ["Men", "kurta"],
            ["Dupattas", "dupatta"],
          ].map(([label, src]) => (
            <button key={label} type="button" onClick={() => setFilter((FILTERS as readonly string[]).includes(label) ? (label as (typeof FILTERS)[number]) : "All")} className="flex shrink-0 flex-col items-center gap-2">
              <span className="size-[74px] overflow-hidden rounded-full ring-2 ring-offset-2 @3xl:size-[96px]" style={{ ["--tw-ring-color" as string]: C.gold, ["--tw-ring-offset-color" as string]: C.ecru }}>
                <DemoImg src={img(src)} alt="" />
              </span>
              <span className="text-[12.5px] uppercase tracking-[0.12em]">{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Products */}
      <section data-section="products" className="px-5 pt-10 @3xl:px-12 @3xl:pt-16">
        <div className="flex items-end justify-between">
          <h2 className="text-[34px] italic leading-none @3xl:text-[48px]" style={{ ...serif, fontWeight: 500 }}>
            New arrivals
          </h2>
          <span className="text-[12px] uppercase tracking-[0.14em] text-black/45">{list.length} pieces</span>
        </div>
        <div className="no-scrollbar -mx-5 mt-4 flex gap-2 overflow-x-auto px-5 @3xl:mx-0 @3xl:px-0">
          {FILTERS.map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)} className="shrink-0 rounded-full px-4 py-2 text-[12.5px] uppercase tracking-[0.1em] ring-1" style={filter === f ? { background: C.ink, color: "#fff", ["--tw-ring-color" as string]: C.ink } : { ["--tw-ring-color" as string]: C.line }}>
              {f}
            </button>
          ))}
        </div>
        <motion.div layout className="mt-5 grid grid-cols-2 gap-x-3 gap-y-6 @3xl:grid-cols-4 @3xl:gap-x-5">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <motion.article key={p.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3 }}>
                <div className="relative aspect-[3/4] overflow-hidden" style={{ background: C.paper }}>
                  <button type="button" onClick={() => setView(p)} className="absolute inset-0" aria-label={`Quick view ${p.name}`}>
                    <DemoImg src={img(p.img)} alt={`${p.name} in ${p.colour}`} />
                  </button>
                  {p.tag && (
                    <span className="pointer-events-none absolute left-2 top-2 px-2 py-1 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-white" style={{ background: p.tag === "Made in Jharkhand" ? C.indigo : C.rose }}>
                      {p.tag}
                    </span>
                  )}
                  <button
                    type="button"
                    aria-label={liked.has(p.id) ? "Remove from wishlist" : "Add to wishlist"}
                    aria-pressed={liked.has(p.id)}
                    onClick={() =>
                      setLiked((s) => {
                        const n = new Set(s);
                        if (n.has(p.id)) n.delete(p.id);
                        else n.add(p.id);
                        return n;
                      })
                    }
                    className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white/90"
                  >
                    <Heart className="size-4" strokeWidth={1.8} fill={liked.has(p.id) ? C.rose : "none"} color={liked.has(p.id) ? C.rose : C.ink} />
                  </button>
                </div>
                <p className="mt-2.5 truncate text-[14px]">{p.name}</p>
                <p className="text-[12px] text-black/50">{p.colour}</p>
                <p className="mt-1 text-[14px] font-semibold">
                  ₹{p.price.toLocaleString("en-IN")}
                  {p.mrp && (
                    <>
                      <span className="ml-2 text-[12px] font-normal text-black/40 line-through">₹{p.mrp.toLocaleString("en-IN")}</span>
                      <span className="ml-1.5 text-[11.5px]" style={{ color: C.rose }}>
                        {Math.round((1 - p.price / p.mrp) * 100)}% off
                      </span>
                    </>
                  )}
                </p>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Story */}
      <section data-section="story" className="mt-14 @3xl:mt-20 @3xl:grid @3xl:grid-cols-2" style={{ background: C.indigo }}>
        <div className="h-[260px] @3xl:h-auto">
          <DemoImg src={img("loom")} alt="Colourful threads on a handloom" />
        </div>
        <div className="p-7 text-white @3xl:p-14">
          <p className="text-[11px] uppercase tracking-[0.3em]" style={{ color: C.gold }}>
            Our story
          </p>
          <h2 className="mt-3 text-[38px] italic leading-[1.02] @3xl:text-[54px]" style={{ ...serif, fontWeight: 500 }}>
            Woven in Jharkhand.
          </h2>
          <p className="mt-4 text-[14.5px] leading-relaxed text-white/75">
            Jharkhand is famous for its Tussar silk. Since 1994 we've worked directly with weaving families — so every saree you take home supports the hands that made it.
          </p>
        </div>
      </section>

      {/* Visit */}
      <section data-section="visit" className="px-5 pb-32 pt-12 @3xl:grid @3xl:grid-cols-2 @3xl:gap-10 @3xl:px-12 @3xl:pb-16 @3xl:pt-20">
        <div className="h-[220px] overflow-hidden @3xl:h-[340px]">
          <DemoImg src={img("store")} alt="Inside the boutique" />
        </div>
        <div className="mt-6 @3xl:mt-0">
          <h2 className="text-[34px] italic leading-none @3xl:text-[46px]" style={{ ...serif, fontWeight: 500 }}>
            Visit our store
          </h2>
          <p className="mt-3 flex items-start gap-2 text-[14.5px] text-black/65">
            <MapPin className="mt-0.5 size-4 shrink-0" /> Main Road, {area}, Ranchi · Open 10:30 AM – 9 PM, all days
          </p>
          <div className="mt-5 rounded-2xl p-4" style={{ background: C.paper }}>
            <p className="flex items-center gap-2 text-[14.5px] font-semibold">
              <Video className="size-4" /> Shop on a video call
            </p>
            <p className="mt-1 text-[13px] text-black/60">Can't come in? See sarees live on a WhatsApp video call and order from home.</p>
            <button type="button" onClick={() => showToast(realSiteNote("customers book a video-call slot and the shop gets it on WhatsApp."))} className="mt-3 px-5 py-2.5 text-[12.5px] font-medium uppercase tracking-[0.14em] text-white" style={{ background: C.ink }}>
              Book a video call
            </button>
          </div>
          <p className="mt-8 text-[12px] text-black/45">© 2026 {name} · Website by Xhibit AI</p>
        </div>
      </section>

      {!desktop && (
        <div className="sticky bottom-0 z-30 grid grid-cols-2 gap-2 border-t bg-[#f8f3ea]/95 px-4 pb-7 pt-3 backdrop-blur" style={{ borderColor: C.line }}>
          <button type="button" onClick={() => showToast(realSiteNote("this opens WhatsApp with the shop."))} className="py-3 text-[12.5px] font-medium uppercase tracking-[0.12em] ring-1" style={{ ["--tw-ring-color" as string]: C.ink }}>
            WhatsApp us
          </button>
          <button type="button" onClick={() => scrollToSection("products")} className="py-3 text-[12.5px] font-medium uppercase tracking-[0.12em] text-white" style={{ background: C.ink }}>
            Shop now
          </button>
        </div>
      )}

      <Sheet open={!!view} onClose={() => setView(null)} title={view?.name ?? "Product"} style={font} wide>
        {view && (
          <div className="@container">
            <div className={cn("gap-5", desktop ? "grid grid-cols-2" : "")}>
              <div className={cn("overflow-hidden", desktop ? "aspect-[3/4]" : "h-[260px]")} style={{ background: C.paper }}>
                <DemoImg src={img(view.img)} alt="" />
              </div>
              <div className={desktop ? "" : "mt-4"}>
                <p className="text-[24px] italic leading-tight" style={{ ...serif, fontWeight: 500 }}>
                  {view.name}
                </p>
                <p className="text-[13px] text-black/50">{view.colour}</p>
                <p className="mt-2 text-[20px] font-semibold">₹{view.price.toLocaleString("en-IN")}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-black/60">{view.fabric}</p>
                <div className="mt-4 grid gap-2">
                  <button type="button" onClick={() => showToast(realSiteNote(`this opens WhatsApp with the ${view.name} already in the message.`))} className="py-3 text-[12.5px] font-medium uppercase tracking-[0.12em] text-white" style={{ background: "#1fa855" }}>
                    Ask on WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      showToast(`Reserved for 48 hours at our ${area} store. ${realSiteNote("the shop is notified instantly.")}`);
                      setView(null);
                    }}
                    className="flex items-center justify-center gap-2 py-3 text-[12.5px] font-medium uppercase tracking-[0.12em] ring-1"
                    style={{ ["--tw-ring-color" as string]: C.ink }}
                  >
                    <Store className="size-4" /> Reserve in store
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      addToBag();
                      setView(null);
                    }}
                    className="py-3 text-[12.5px] font-medium uppercase tracking-[0.12em] text-white"
                    style={{ background: C.ink }}
                  >
                    Add to bag
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Sheet>
      <Toast message={toast} />
    </div>
  );
}
