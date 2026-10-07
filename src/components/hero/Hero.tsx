import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from "react";
import { site } from "../../../site.config";
import { industries } from "../../content/industries";
import { demoChrome, demoComponents, prefetchDemo } from "../../demos/registry";
import { track } from "../../lib/api";
import { useInterval, useMediaQuery, usePageVisible } from "../../lib/hooks";
import { ease } from "../../lib/motion";
import { usePersonalization } from "../../lib/personalization";
import { useSmoothScroll } from "../../lib/smooth-scroll";
import { waHref, waMessage } from "../../lib/whatsapp";
import { DeviceScreen } from "../device/DeviceScreen";
import { PHONE, PhoneFrame } from "../device/frames";
import { Scaled } from "../device/Scaled";
import { LogoMark } from "../brand/Logo";
import { Button, ButtonLink } from "../ui/Button";
import { WhatsAppDisc } from "../ui/icons";
import { Magnetic } from "../ui/Magnetic";

const SilkCanvas = lazy(() => import("./SilkCanvas"));

/** Headline accent colour per industry (all pass contrast on the light silk). */
const WORD_COLOR: Record<string, string> = {
  restaurants: "#8e2b23",
  clinics: "#0c6b6a",
  schools: "#23408e",
  salons: "#8a3a5c",
  gyms: "#4a6a0a",
  hotels: "#2b5a3f",
  retail: "#3f3f96",
  business: "#1f4fbf",
};

function SilkFallback({ palette, animate }: { palette: [string, string, string, string]; animate: boolean }) {
  const style = {
    "--g1": palette[1],
    "--g2": palette[2],
    "--g3": palette[3],
    background: palette[0],
    transition: "--g1 1.4s ease, --g2 1.4s ease, --g3 1.4s ease, background-color 1.4s ease",
  } as CSSProperties;
  return (
    <div className="absolute inset-0 overflow-hidden" style={style} aria-hidden="true">
      <div
        className={`absolute -right-[25%] -top-[30%] h-[95%] w-[90%] rounded-full ${animate ? "animate-drift-a" : ""}`}
        style={{ background: "radial-gradient(closest-side, var(--g1) 0%, var(--g1) 30%, transparent 100%)" }}
      />
      <div
        className={`absolute -bottom-[30%] -right-[10%] h-[85%] w-[95%] rounded-full opacity-70 ${animate ? "animate-drift-b" : ""}`}
        style={{ background: "radial-gradient(closest-side, var(--g2) 0%, var(--g2) 25%, transparent 100%)" }}
      />
      <div
        className={`absolute -bottom-[25%] -left-[20%] h-[70%] w-[70%] rounded-full opacity-40 ${animate ? "animate-drift-c" : ""}`}
        style={{ background: "radial-gradient(closest-side, var(--g3), transparent)" }}
      />
    </div>
  );
}

function RotatingWord({ word, color }: { word: string; color: string }) {
  return (
    <span className="relative inline-grid whitespace-nowrap align-baseline">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={word}
          className="col-start-1 row-start-1 inline-block pr-[0.06em] italic"
          style={{ color }}
          initial={{ y: "55%", opacity: 0, filter: "blur(10px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-45%", opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease }}
        >
          {word}.
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function RotatingBadge() {
  const text = `MADE IN ${site.brand.city.toUpperCase()} • WEBSITES • APPS • AI • `;
  return (
    <div className="relative size-[118px]" aria-hidden="true">
      <motion.svg
        viewBox="0 0 120 120"
        className="absolute inset-0 h-full w-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <path id="badge-circle" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0" />
        </defs>
        <text className="fill-ink font-sans text-[10.4px] font-semibold tracking-[0.2em]">
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </motion.svg>
      <div className="absolute inset-[30px] grid place-items-center rounded-full bg-ivory/90 shadow-soft backdrop-blur">
        <LogoMark className="size-8" />
      </div>
    </div>
  );
}

export function Hero() {
  const reduced = useReducedMotion();
  const desktopFx = useMediaQuery("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
  const { name } = usePersonalization();
  const { scrollTo } = useSmoothScroll();
  const visible = usePageVisible();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.25 });

  const [index, setIndex] = useState(0);
  const [webgl, setWebgl] = useState<"pending" | "ok" | "failed">("pending");
  const industry = industries[index];
  const Site = demoComponents[industry.slug];

  useInterval(() => setIndex((i) => (i + 1) % industries.length), !reduced && inView && visible ? 3600 : null);
  useEffect(() => {
    prefetchDemo(industries[(index + 1) % industries.length].slug);
  }, [index]);

  const useWebgl = desktopFx && !reduced && webgl !== "failed";
  const trust = [
    site.promises.freeDesignPreview && "Free design preview",
    site.promises.liveInDays > 0 && `Live in ${site.promises.liveInDays} days`,
    site.promises.inPersonVisits && `We visit you in ${site.brand.city}`,
  ].filter(Boolean) as string[];
  const spotsLeft = site.foundingOffer.spots - site.foundingOffer.spotsTaken;

  return (
    <section ref={ref} id="top" aria-labelledby="hero-title" className="relative p-2 sm:p-3">
      <div className="grain relative isolate flex min-h-[calc(100svh-1rem)] flex-col overflow-hidden rounded-[28px] sm:min-h-[calc(100svh-1.5rem)] sm:rounded-[36px] lg:rounded-[44px]">
        {/* Background: WebGL silk on desktop, soft CSS gradient elsewhere */}
        <div className="absolute inset-0 -z-10">
          <SilkFallback palette={industry.theme.silk} animate={!reduced} />
          {useWebgl && (
            <Suspense fallback={null}>
              <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: webgl === "ok" ? 1 : 0 }} transition={{ duration: 1.6 }}>
                <SilkCanvas
                  palette={industry.theme.silk}
                  className="h-full w-full"
                  onReady={() => setWebgl("ok")}
                  onFail={() => setWebgl("failed")}
                />
              </motion.div>
            </Suspense>
          )}
          {/* legibility wash behind the headline */}
          <div className="absolute inset-0 bg-linear-to-b from-ivory/70 via-ivory/20 to-transparent lg:bg-linear-to-r lg:from-ivory/75 lg:via-ivory/25 lg:to-transparent" />
        </div>

        <div className="container-x relative grid flex-1 items-center gap-10 pb-10 pt-28 sm:pt-32 lg:grid-cols-12 lg:gap-6 lg:pb-16 lg:pt-28 lg:[@media(max-height:820px)]:pb-10 lg:[@media(max-height:820px)]:pt-24">
          {/* Copy */}
          <div className="lg:col-span-7">
            {site.foundingOffer.enabled && spotsLeft > 0 && (
              <motion.a
                href="#pricing"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#pricing");
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.15 }}
                className="group inline-flex items-center gap-2.5 rounded-full bg-linen/75 py-1.5 pl-2 pr-4 text-[0.8125rem] font-medium text-ink ring-1 ring-ink/10 backdrop-blur-md transition-colors hover:bg-linen"
              >
                <span className="whitespace-nowrap rounded-full bg-ink px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-ivory">
                  Founding offer
                </span>
                <span className="whitespace-nowrap">
                  <span className="sm:hidden">{site.foundingOffer.perk.split(" ")[0]} off · first {site.foundingOffer.spots} clients</span>
                  <span className="max-sm:hidden">
                    {site.foundingOffer.perk.split(" and ")[0]} for our first {site.foundingOffer.spots} clients
                  </span>
                </span>
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </motion.a>
            )}

            <h1 id="hero-title" className="mt-6 text-hero text-ink">
              <span className="sr-only">
                Let {site.brand.city} find your business — websites, apps and AI for restaurants, clinics, schools, salons, gyms, hotels and shops.
              </span>
              <motion.span
                aria-hidden="true"
                className="block"
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } } }}
              >
                {["Let", site.brand.city, "find"].map((w) => (
                  <span key={w} className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-top">
                    <motion.span
                      className="inline-block"
                      variants={{ hidden: { y: "110%" }, show: { y: "0%", transition: { duration: 1.1, ease } } }}
                    >
                      {w}&nbsp;
                    </motion.span>
                  </span>
                ))}
                <br className="max-sm:hidden" />
                <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-top">
                  <motion.span
                    className="inline-block"
                    variants={{ hidden: { y: "110%" }, show: { y: "0%", transition: { duration: 1.1, ease } } }}
                  >
                    your&nbsp;
                  </motion.span>
                </span>
                <br className="sm:hidden" />
                <motion.span
                  className="inline-block"
                  variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 1.1, ease } } }}
                >
                  <RotatingWord word={industry.word} color={WORD_COLOR[industry.slug]} />
                </motion.span>
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.75 }}
              className="mt-7 max-w-[34rem] text-lead text-ink-soft"
            >
              We build beautiful websites, booking apps and WhatsApp assistants for local businesses — so new customers can{" "}
              <span className="text-ink">find you, trust you and reach you in one tap.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.9 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Magnetic>
                <ButtonLink
                  href={waHref(waMessage({ businessName: name }))}
                  external
                  size="lg"
                  icon={<WhatsAppDisc className="-ml-3 size-9" />}
                  onClick={() => track("whatsapp_click", { location: "hero" })}
                  className="w-full pl-3 sm:w-auto"
                >
                  Chat on WhatsApp
                </ButtonLink>
              </Magnetic>
              <Button variant="secondary" size="lg" arrow onClick={() => scrollTo("#industries")} className="w-full sm:w-auto">
                See your business online
              </Button>
            </motion.div>

            {trust.length > 0 && (
              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease, delay: 1.1 }}
                className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.875rem] text-ink-soft"
                aria-label="Our promises"
              >
                {trust.map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <svg viewBox="0 0 16 16" className="size-4 text-sal" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {t}
                  </li>
                ))}
              </motion.ul>
            )}
          </div>

          {/* Phone */}
          <motion.div
            className="relative mx-auto w-full max-w-[17.5rem] sm:max-w-[19.5rem] lg:col-span-5 lg:mr-6 lg:max-w-[18.5rem] xl:mr-10 xl:max-w-[20rem] 2xl:max-w-[21.5rem] lg:[@media(max-height:820px)]:max-w-[15.5rem]"
            initial={{ opacity: 0, y: 80, rotate: 4 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1.4, ease, delay: 0.35 }}
            aria-hidden="true"
          >
            <div className="animate-float">
              <Scaled width={PHONE.w} height={PHONE.h}>
                <PhoneFrame chrome={demoChrome[industry.slug]}>
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={industry.slug}
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.9, ease }}
                    >
                      <DeviceScreen interactive={false} label="" autoScroll>
                        <Suspense fallback={<div className="h-full" style={{ background: demoChrome[industry.slug].bar }} />}>
                          <Site name={name.trim() || industry.demo.name} area={industry.demo.area} />
                        </Suspense>
                      </DeviceScreen>
                    </motion.div>
                  </AnimatePresence>
                </PhoneFrame>
              </Scaled>
            </div>

            {/* What this business receives */}
            <AnimatePresence mode="wait">
              <motion.div
                key={industry.slug}
                initial={{ opacity: 0, y: 16, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 22, delay: 0.7 } }}
                exit={{ opacity: 0, y: -10, scale: 0.96, transition: { duration: 0.25 } }}
                className="absolute -left-4 top-[18%] flex w-[15.5rem] items-center gap-3 rounded-2xl bg-linen/90 p-3 pr-4 shadow-lift ring-1 ring-ink/5 backdrop-blur-xl sm:-left-16 lg:-left-24"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl text-white" style={{ background: industry.theme.deep }}>
                  <industry.notification.icon className="size-5" strokeWidth={1.8} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.8125rem] font-semibold leading-tight text-ink">{industry.notification.title}</span>
                  <span className="mt-0.5 block truncate text-[0.75rem] text-ink-soft">{industry.notification.meta}</span>
                </span>
                <span className="absolute right-3 top-2.5 text-[0.625rem] font-medium text-ink-mute">now</span>
              </motion.div>
            </AnimatePresence>

            <div className="absolute -bottom-6 -right-2 hidden sm:block lg:-right-10">
              <RotatingBadge />
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.button
          type="button"
          onClick={() => scrollTo("#why")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-ink-soft lg:flex"
        >
          Scroll
          <span className="relative h-9 w-px overflow-hidden bg-ink/15">
            <motion.span
              className="absolute inset-x-0 top-0 h-3 bg-ink/70"
              animate={{ y: [-12, 36] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </motion.button>
      </div>
    </section>
  );
}
