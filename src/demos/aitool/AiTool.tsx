import "@fontsource-variable/manrope";
import "@fontsource/mukta/devanagari-400.css";
import "@fontsource/mukta/devanagari-600.css";
import { Check, Copy, History, LoaderCircle, PenLine, RotateCcw, Sparkles, Wand2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useScreen } from "../../components/device/DeviceScreen";
import { cn, initials } from "../../lib/utils";
import { Toast, useToast, type DemoProps } from "../kit";

/* ── Likho · an AI tool that writes product listings and captions in English, Hindi or Hinglish ── */

const C = {
  bg: "#f7f7fb",
  ink: "#16151c",
  mute: "#686676",
  line: "rgba(22,21,28,.08)",
  violet: "#5b3ff2",
  violetSoft: "#eeeafe",
  pink: "#e8457c",
};
const font: CSSProperties = { fontFamily: '"Manrope Variable", "Mukta", system-ui, sans-serif', color: C.ink };

type Lang = "en" | "hi" | "hing";
const LANGS: { id: Lang; label: string }[] = [
  { id: "en", label: "English" },
  { id: "hi", label: "हिंदी" },
  { id: "hing", label: "Hinglish" },
];

type Copy4 = { title: string; desc: string; bullets: string[]; caption: string };
const PRESETS: { id: string; tab: string; product: string; details: string; out: Record<Lang, Copy4> }[] = [
  {
    id: "saree",
    tab: "Saree",
    product: "Handloom cotton saree",
    details: "Pure cotton, handwoven in Bengal, temple border, mustard yellow, 6.3 m with blouse piece",
    out: {
      en: {
        title: "Temple Border, Mustard Yellow, Pure Cotton (6.3 m with Blouse Piece)",
        desc: "Woven by hand on traditional looms in Bengal, this pure cotton saree is soft, breathable and made for long days. The mustard body is finished with a classic temple border that looks just as good at a puja as it does at the office.",
        bullets: ["Pure handloom cotton, light and breathable", "Classic temple border, 6.3 m with blouse piece", "Gentle hand wash; gets softer with every wash"],
        caption: "Sunshine, but make it handwoven ☀️ Our mustard temple-border saree is pure cotton, woven by hand in Bengal. Comfortable from morning puja to evening plans. DM to order 🛍️ #handloom #cottonsaree #vocalforlocal",
      },
      hi: {
        title: "टेम्पल बॉर्डर, सरसों पीला रंग, शुद्ध सूती (6.3 मी., ब्लाउज़ पीस सहित)",
        desc: "बंगाल के पारंपरिक करघों पर हाथ से बुनी यह शुद्ध सूती साड़ी मुलायम और हल्की है, जो पूरे दिन आराम देती है। सरसों पीले रंग पर क्लासिक टेम्पल बॉर्डर इसे पूजा से लेकर दफ़्तर तक हर मौके के लिए खास बनाता है।",
        bullets: ["शुद्ध हैंडलूम कॉटन, हल्की और हवादार", "टेम्पल बॉर्डर, 6.3 मीटर, ब्लाउज़ पीस सहित", "हल्के हाथ से धोएँ, हर धुलाई के साथ और मुलायम"],
        caption: "धूप जैसी खिली-खिली ☀️ बंगाल में हाथ से बुनी हमारी सरसों पीली कॉटन साड़ी, सुबह की पूजा से शाम की महफ़िल तक। ऑर्डर के लिए DM करें 🛍️ #हैंडलूम #cottonsaree",
      },
      hing: {
        title: "Temple Border, Mustard Yellow, Pure Cotton (6.3 m + Blouse Piece)",
        desc: "Bengal ke traditional looms par haath se buni yeh pure cotton saree bahut soft aur halki hai, poore din comfortable. Mustard colour par classic temple border, puja ho ya office, har jagah perfect.",
        bullets: ["Pure handloom cotton, halki aur breathable", "Temple border, 6.3 m, blouse piece ke saath", "Haath se dhoyein, har wash ke baad aur soft"],
        caption: "Dhoop jaisi fresh ☀️ Haath se buni mustard cotton saree, seedha Bengal ke looms se. Subah ki puja se shaam ke plans tak 💛 Order ke liye DM karein! #handloom #cottonsaree #vocalforlocal",
      },
    },
  },
  {
    id: "oil",
    tab: "Groundnut oil",
    product: "Cold-pressed groundnut oil",
    details: "Wood-pressed (kachi ghani), no chemicals, peanuts from Karnataka farms, 1 litre glass bottle",
    out: {
      en: {
        title: "Wood-Pressed Kachi Ghani, Chemical-Free, 1 L Glass Bottle",
        desc: "Pressed slowly in a traditional wooden ghani, this groundnut oil keeps its natural aroma, colour and nutrients. No heat, no chemicals, no blending: just peanuts from Karnataka farms, bottled in glass.",
        bullets: ["Wood-pressed at low temperature, never refined", "Single-origin peanuts from Karnataka farms", "Glass bottle, no plastic, 1 litre"],
        caption: "Smell that? That's real groundnut oil 🥜 Wood-pressed the slow way, no chemicals, no shortcuts. Your dosas will thank you. Order on WhatsApp 📦 #coldpressed #woodpressedoil #healthycooking",
      },
      hi: {
        title: "लकड़ी की घानी से निकाला, बिना केमिकल, 1 लीटर कांच की बोतल",
        desc: "पारंपरिक लकड़ी की घानी में धीरे-धीरे पेरा गया यह मूंगफली का तेल अपनी असली खुशबू, रंग और पोषण बनाए रखता है। न गर्मी, न केमिकल, न मिलावट, बस कर्नाटक के खेतों की मूंगफली, कांच की बोतल में।",
        bullets: ["कम तापमान पर लकड़ी की घानी से, रिफ़ाइंड नहीं", "कर्नाटक के खेतों की मूंगफली", "कांच की बोतल, प्लास्टिक नहीं, 1 लीटर"],
        caption: "यह खुशबू है असली मूंगफली के तेल की 🥜 लकड़ी की घानी में धीरे से पेरा गया, बिना केमिकल। WhatsApp पर ऑर्डर करें 📦 #कच्चीघानी #coldpressed",
      },
      hing: {
        title: "Kachi Ghani Wood-Pressed, No Chemicals, 1 L Glass Bottle",
        desc: "Traditional lakdi ki ghani mein dheere-dheere nikala gaya groundnut oil, apni asli khushboo aur nutrition ke saath. Na heat, na chemicals, na milawat, bas Karnataka ke kheton ki moongphali.",
        bullets: ["Low temperature par wood-pressed, refined nahi", "Karnataka ke kheton ki moongphali", "Glass bottle, plastic nahi, 1 litre"],
        caption: "Yeh khushboo hai asli moongphali tel ki 🥜 Wood-pressed, bina chemicals, bina shortcut. Aapke dose bolenge thank you! WhatsApp pe order karein 📦 #woodpressedoil #healthycooking",
      },
    },
  },
  {
    id: "diya",
    tab: "Brass diyas",
    product: "Brass diya set",
    details: "Set of 4, handcrafted in Moradabad, polished brass, 3 inch each, comes in a gift box",
    out: {
      en: {
        title: "Set of 4, Handcrafted Polished Brass, 3 inch, Gift Box",
        desc: "Handcrafted by artisans in Moradabad, these solid brass diyas bring a warm, steady glow to your mandir, doorstep or Diwali table. Each one is polished by hand and arrives in a gift box, ready to give.",
        bullets: ["Solid brass, hand-polished in Moradabad", "Set of 4, 3 inch each, reusable for years", "Comes in a gift box, ready for Diwali"],
        caption: "Light up this Diwali the timeless way 🪔 Handcrafted brass diyas from Moradabad, set of 4 in a gift box. Perfect for your mandir or for gifting ✨ Limited stock, DM now! #diwali #brassdiya #handmadeinindia",
      },
      hi: {
        title: "4 का सेट, हाथ से बने पॉलिश्ड पीतल के दीये, 3 इंच, गिफ़्ट बॉक्स",
        desc: "मुरादाबाद के कारीगरों के हाथों से बने ये पीतल के दीये आपके मंदिर, दरवाज़े या दिवाली की सजावट में गर्म, सुनहरी रोशनी लाते हैं। हर दीया हाथ से पॉलिश किया गया है और गिफ़्ट बॉक्स में आता है।",
        bullets: ["शुद्ध पीतल, मुरादाबाद में हाथ से पॉलिश", "4 दीयों का सेट, हर दीया 3 इंच", "गिफ़्ट बॉक्स में, दिवाली के लिए तैयार"],
        caption: "इस दिवाली रोशनी हो सदाबहार 🪔 मुरादाबाद के कारीगरों के हाथों से बने पीतल के दीये, गिफ़्ट बॉक्स में। अभी DM करें ✨ #दिवाली #पीतलदीया",
      },
      hing: {
        title: "Set of 4, Handmade Brass Diyas, 3 inch, Gift Box",
        desc: "Moradabad ke kaarigaron ke haathon se bane yeh brass diye aapke mandir aur Diwali decor mein ek garam, sunehri roshni laate hain. Har diya hand-polished hai aur gift box mein aata hai.",
        bullets: ["Solid brass, Moradabad mein hand-polished", "4 diyon ka set, har diya 3 inch", "Gift box mein, Diwali ke liye ready"],
        caption: "Is Diwali, roshni ho timeless 🪔 Moradabad ke handmade brass diye, set of 4, gift box ke saath. Mandir ke liye ya gifting ke liye perfect ✨ Stock limited hai, abhi DM karein! #diwali #brassdiya",
      },
    },
  },
];

const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

type Block = { key: string; label: string; parts: string[][] };

function buildBlocks(product: string, copy: Copy4): Block[] {
  const words = (s: string) => s.split(" ");
  return [
    { key: "title", label: "Product title", parts: [words(`${titleCase(product.trim() || "Your product")} | ${copy.title}`)] },
    { key: "desc", label: "Description", parts: [words(copy.desc)] },
    { key: "bullets", label: "Highlights", parts: copy.bullets.map(words) },
    { key: "caption", label: "Instagram caption", parts: [words(copy.caption)] },
  ];
}

export default function AiTool({ name }: DemoProps) {
  const { scrollToSection } = useScreen();
  const [preset, setPreset] = useState(0);
  const [product, setProduct] = useState(PRESETS[0].product);
  const [details, setDetails] = useState(PRESETS[0].details);
  const [lang, setLang] = useState<Lang>("en");
  const [credits, setCredits] = useState(38);
  const [result, setResult] = useState(() => ({ preset: 0, lang: "en" as Lang, product: PRESETS[0].product }));
  const [phase, setPhase] = useState<"done" | "thinking" | "writing">("done");
  const [shown, setShown] = useState(Infinity);
  const [copied, setCopied] = useState<string | null>(null);
  const [toast, showToast] = useToast(2400);
  const timer = useRef<number | undefined>(undefined);

  const blocks = useMemo(() => buildBlocks(result.product, PRESETS[result.preset].out[result.lang]), [result]);
  const totalWords = blocks.reduce((a, b) => a + b.parts.reduce((x, p) => x + p.length, 0), 0);

  // Reveal the answer word by word, like a model writing it.
  useEffect(() => {
    if (phase !== "writing") return;
    timer.current = window.setInterval(() => {
      setShown((n) => {
        if (n + 2 >= totalWords) {
          window.clearInterval(timer.current);
          setPhase("done");
          return Infinity;
        }
        return n + 2;
      });
    }, 45);
    return () => window.clearInterval(timer.current);
  }, [phase, totalWords]);

  const pick = (i: number) => {
    setPreset(i);
    setProduct(PRESETS[i].product);
    setDetails(PRESETS[i].details);
  };

  const generate = () => {
    if (phase !== "done") return;
    setResult({ preset, lang, product });
    setShown(0);
    setPhase("thinking");
    setCredits((c) => Math.max(0, c - 1));
    scrollToSection("output");
    window.setTimeout(() => setPhase("writing"), 900);
  };

  const copy = (key: string, text: string) => {
    void navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(key);
    showToast("Copied. Paste it into your store or Instagram.");
    window.setTimeout(() => setCopied(null), 1600);
  };

  let budget = shown;
  const take = (ws: string[]) => {
    const n = Math.max(0, Math.min(ws.length, budget));
    budget -= n;
    return ws.slice(0, n).join(" ");
  };
  const hindi = result.lang === "hi";

  return (
    <div className="min-h-full" style={{ ...font, background: C.bg }}>
      {/* Top bar */}
      <header data-section="top" className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b bg-white/95 px-4 py-3 backdrop-blur @3xl:px-6" style={{ borderColor: C.line }}>
        <span className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-[10px] text-white" style={{ background: `linear-gradient(135deg, ${C.violet}, ${C.pink})` }}>
            <PenLine className="size-4" />
          </span>
          <span className="text-[17px] font-extrabold tracking-[-0.02em]">{name}</span>
        </span>
        <nav className="hidden items-center gap-1 text-[13.5px] font-semibold @3xl:flex" aria-label="App">
          <span className="rounded-lg px-3 py-1.5" style={{ background: C.violetSoft, color: C.violet }}>
            New listing
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5" style={{ color: C.mute }}>
            <History className="size-4" /> History
          </span>
          <span className="px-3 py-1.5" style={{ color: C.mute }}>
            Brand voice
          </span>
        </nav>
        <span className="flex items-center gap-2.5">
          <span className="rounded-full px-2.5 py-1 text-[11.5px] font-bold" style={{ background: C.violetSoft, color: C.violet }}>
            {credits} credits
          </span>
          <span className="grid size-8 place-items-center rounded-full bg-[#ffd9e6] text-[11px] font-bold">{initials("Tana Bana")}</span>
        </span>
      </header>

      <div className="grid gap-4 p-4 @3xl:grid-cols-[400px_1fr] @3xl:gap-6 @3xl:p-6">
        {/* Input */}
        <section aria-label="Your product" className="rounded-[20px] bg-white p-5 ring-1 @3xl:self-start" style={{ ["--tw-ring-color" as string]: C.line }}>
          <p className="text-[18px] font-extrabold tracking-[-0.02em]">Write a listing</p>
          <p className="mt-1 text-[13px]" style={{ color: C.mute }}>
            Tell us about the product. We'll write the title, description and caption.
          </p>

          <p className="mt-5 text-[12px] font-bold uppercase tracking-[0.08em]" style={{ color: C.mute }}>
            Try an example
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {PRESETS.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => pick(i)}
                className="rounded-full px-3 py-1.5 text-[12.5px] font-semibold ring-1"
                style={preset === i ? { background: C.ink, color: "#fff", ["--tw-ring-color" as string]: C.ink } : { ["--tw-ring-color" as string]: C.line }}
              >
                {p.tab}
              </button>
            ))}
          </div>

          <label className="mt-4 block text-[12.5px] font-bold">
            Product
            <input
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              maxLength={50}
              className="mt-1.5 h-11 w-full rounded-[12px] px-3 text-[14px] font-medium outline-none ring-1 focus:ring-2"
              style={{ ["--tw-ring-color" as string]: C.line, background: C.bg }}
            />
          </label>
          <label className="mt-3 block text-[12.5px] font-bold">
            Key details
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              className="mt-1.5 w-full resize-none rounded-[12px] px-3 py-2.5 text-[13.5px] font-medium leading-relaxed outline-none ring-1 focus:ring-2"
              style={{ ["--tw-ring-color" as string]: C.line, background: C.bg }}
            />
          </label>

          <p className="mt-3 text-[12.5px] font-bold">Language</p>
          <div className="mt-1.5 grid grid-cols-3 gap-1 rounded-[12px] p-1" style={{ background: C.bg }}>
            {LANGS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLang(l.id)}
                className="rounded-[9px] py-2 text-[13px] font-bold transition-colors"
                style={lang === l.id ? { background: "#fff", color: C.ink, boxShadow: "0 1px 3px rgba(0,0,0,.08)" } : { color: C.mute }}
              >
                {l.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={generate}
            disabled={phase !== "done"}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-[14px] py-3.5 text-[14.5px] font-bold text-white transition-opacity disabled:opacity-70"
            style={{ background: `linear-gradient(135deg, ${C.violet}, ${C.pink})` }}
          >
            {phase === "done" ? <Wand2 className="size-4" /> : <LoaderCircle className="size-4 animate-spin" />}
            {phase === "done" ? "Write my listing" : "Writing…"}
          </button>
        </section>

        {/* Output */}
        <section data-section="output" aria-label="Your listing" aria-live="polite" className="rounded-[20px] bg-white p-5 ring-1 @3xl:p-6" style={{ ["--tw-ring-color" as string]: C.line }}>
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-[15px] font-extrabold">
              <Sparkles className="size-4" style={{ color: C.violet }} /> Your listing
            </p>
            <span className="text-[12px] font-semibold" style={{ color: C.mute }}>
              {phase === "thinking" ? "Reading your details…" : phase === "writing" ? "Writing…" : `${LANGS.find((l) => l.id === result.lang)!.label} · ready to paste`}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {phase === "thinking" ? (
              <motion.div key="think" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-5 grid gap-3">
                {[90, 100, 76, 84].map((w, i) => (
                  <div key={i} className="h-4 animate-pulse rounded-full" style={{ width: `${w}%`, background: C.violetSoft }} />
                ))}
              </motion.div>
            ) : (
              <motion.div key={`${result.preset}-${result.lang}-${result.product}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 grid gap-3">
                {blocks.map((b) => {
                  const texts = b.parts.map(take);
                  if (!texts.some(Boolean)) return null;
                  const full = b.parts.map((p) => p.join(" "));
                  return (
                    <div key={b.key} className="rounded-[14px] p-4" style={{ background: C.bg }}>
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[11.5px] font-bold uppercase tracking-[0.08em]" style={{ color: C.violet }}>
                          {b.label}
                        </p>
                        {phase === "done" && (
                          <button type="button" onClick={() => copy(b.key, full.join("\n"))} className="flex items-center gap-1 text-[12px] font-bold" style={{ color: copied === b.key ? "#11865a" : C.mute }}>
                            {copied === b.key ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                            {copied === b.key ? "Copied" : "Copy"}
                          </button>
                        )}
                      </div>
                      {b.key === "bullets" ? (
                        <ul className={cn("mt-2 grid gap-1.5 text-[14px] leading-relaxed", hindi && "text-[15px]")}>
                          {texts.map((t, i) =>
                            t ? (
                              <li key={i} className="flex gap-2">
                                <span style={{ color: C.violet }}>•</span>
                                {t}
                              </li>
                            ) : null,
                          )}
                        </ul>
                      ) : (
                        <p className={cn("mt-2 leading-relaxed", b.key === "title" ? "text-[15.5px] font-bold" : "text-[14px]", hindi && "text-[15px]")}>{texts[0]}</p>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {phase === "done" && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[12px]" style={{ color: C.mute }}>
              <span>Check facts like sizes and prices before you publish.</span>
              <button type="button" onClick={generate} className="flex items-center gap-1.5 font-bold" style={{ color: C.violet }}>
                <RotateCcw className="size-3.5" /> Write again
              </button>
            </div>
          )}
        </section>
      </div>
      <Toast message={toast} style={font} />
    </div>
  );
}
