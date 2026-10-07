import { motion, useScroll, useTransform } from "motion/react";
import { ArrowLeft, ArrowUpRight, Check, Copy, Link2 } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { site } from "../../site.config";
import { DemoDevice } from "../components/device/DemoDevice";
import type { DeviceApi } from "../components/device/DeviceScreen";
import { Contact } from "../components/sections/Contact";
import { Accordion } from "../components/ui/Accordion";
import { ButtonLink } from "../components/ui/Button";
import { Eyebrow } from "../components/ui/Eyebrow";
import { WhatsAppDisc } from "../components/ui/icons";
import { Reveal, RevealHeading } from "../components/ui/Reveal";
import { curtainFor, industries, industryBySlug, type Industry } from "../content/industries";
import { prefetchDemo } from "../demos/registry";
import { track } from "../lib/api";
import { useMediaQuery } from "../lib/hooks";
import { ease } from "../lib/motion";
import { usePersonalization } from "../lib/personalization";
import { useSeo } from "../lib/seo";
import { useSmoothScroll } from "../lib/smooth-scroll";
import { HOME_CURTAIN, TLink, useRouteReady } from "../lib/transition";
import { cn, inr, toDomain } from "../lib/utils";
import { waHref, waMessage } from "../lib/whatsapp";
import NotFound from "./NotFound";

export default function IndustryPage() {
  const { slug } = useParams();
  const industry = industryBySlug(slug);
  if (!industry) return <NotFound />;
  return <IndustryView key={industry.slug} industry={industry} />;
}

function IndustryView({ industry }: { industry: Industry }) {
  useRouteReady();
  useSeo({ title: industry.seoTitle, description: industry.seoDescription, path: `/for/${industry.slug}`, image: `/og/${industry.slug}.jpg` });
  const { name, setName, area, setArea } = usePersonalization();
  const { scrollTo } = useSmoothScroll();
  const [, setSearchParams] = useSearchParams();
  const deviceRef = useRef<DeviceApi>(null);
  const lastTouch = useRef(0);
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const wide = useMediaQuery("(min-width: 1024px)");
  const displayName = name.trim() || industry.demo.name;

  useEffect(() => {
    track("demo_view", { industry: industry.slug });
  }, [industry.slug]);

  // Keep the shareable link in the address bar in sync with the name.
  useEffect(() => {
    const t = window.setTimeout(() => {
      const p: Record<string, string> = {};
      if (name.trim()) p.name = name.trim();
      if (area.trim()) p.area = area.trim();
      setSearchParams(p, { replace: true, preventScrollReset: true });
    }, 450);
    return () => window.clearTimeout(t);
  }, [name, area, setSearchParams]);

  const goFeature = (i: number, fromScroll = false) => {
    setActive(i);
    if (fromScroll && Date.now() - lastTouch.current < 4000) return;
    deviceRef.current?.goTo(industry.features[i].id);
  };

  const shareUrl = () => {
    const u = new URL(`${site.brand.url}/for/${industry.slug}`);
    if (name.trim()) u.searchParams.set("name", name.trim());
    if (area.trim()) u.searchParams.set("area", area.trim());
    return u.toString();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl());
      setCopied(true);
      track("copy_demo_link", { industry: industry.slug });
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard blocked — ignore */
    }
  };

  const plan = site.pricing.plans.find((p) => p.id === industry.plan)!;
  const others = industries.filter((i) => i.slug !== industry.slug);

  return (
    <article style={{ ["--tint" as string]: industry.theme.tint }}>
      {/* ── Hero + feature tour with a sticky live phone ── */}
      <section aria-labelledby="industry-title" className="relative p-2 sm:p-3">
        <div className="grain relative overflow-clip rounded-[28px] sm:rounded-[36px] lg:rounded-[44px]" style={{ background: `linear-gradient(160deg, ${industry.theme.tint} 0%, #fbf7f0 70%)` }}>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 -top-40 size-[44rem] rounded-full opacity-60 blur-3xl"
            style={{ background: `radial-gradient(closest-side, ${industry.theme.silk[1]}, transparent)` }}
          />
          <div className="container-x relative grid gap-12 pb-16 pt-28 sm:pt-32 lg:grid-cols-12 lg:gap-10 lg:pb-24">
            <div className="min-w-0 lg:col-span-6">
              <TLink to="/#industries" curtain={HOME_CURTAIN} className="inline-flex items-center gap-2 text-[0.875rem] font-medium text-ink-soft hover:text-ink">
                <ArrowLeft className="size-4" /> All industries
              </TLink>
              <Eyebrow no={industry.no} className="mt-8">
                {industry.name}
              </Eyebrow>
              <RevealHeading as="h1" id="industry-title" text={industry.headline} className="mt-6 text-display text-ink" animateOnMount delay={0.15} />
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease, delay: 0.45 }}
                className="mt-6 max-w-[36rem] text-lead text-ink-soft"
              >
                {industry.intro}
              </motion.p>

              {/* Make it yours */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease, delay: 0.6 }}
                className="mt-9 rounded-[26px] bg-linen/85 p-5 shadow-soft ring-1 ring-ink/[0.06] backdrop-blur sm:p-6"
              >
                <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">Make it yours</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-[1.4fr_1fr]">
                  <label className="block">
                    <span className="sr-only">Your {industry.kind.toLowerCase()}'s name</span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={industry.kind === "Business" ? "Your business name" : `Your ${industry.kind.toLowerCase()}'s name`}
                      maxLength={40}
                      autoComplete="organization"
                      className="h-14 w-full rounded-2xl bg-white px-4 font-display text-[1.3rem] ring-1 ring-ink/10 placeholder:text-ink-mute/60 focus:outline-none focus:ring-2 focus:ring-clay"
                    />
                  </label>
                  <label className="block">
                    <span className="sr-only">Area in {site.brand.city}</span>
                    <input
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder={`Area, e.g. ${industry.demo.area}`}
                      maxLength={30}
                      className="h-14 w-full rounded-2xl bg-white px-4 text-[1rem] ring-1 ring-ink/10 placeholder:text-ink-mute/70 focus:outline-none focus:ring-2 focus:ring-clay"
                    />
                  </label>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[0.8125rem] text-ink-soft">
                  <span className="flex items-center gap-2">
                    <Link2 className="size-4" /> {toDomain(displayName)}
                  </span>
                  <button type="button" onClick={copyLink} className="flex items-center gap-1.5 rounded-full bg-sand px-3 py-1.5 font-semibold text-ink transition-colors hover:bg-sand-deep">
                    {copied ? <Check className="size-3.5 text-sal" /> : <Copy className="size-3.5" />}
                    {copied ? "Link copied" : "Copy personalised link"}
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease, delay: 0.75 }}
                className="mt-6 flex flex-col gap-3 sm:flex-row"
              >
                <ButtonLink
                  href={waHref(waMessage({ kind: industry.kind, businessName: name }))}
                  external
                  size="lg"
                  icon={<WhatsAppDisc className="-ml-3 size-9" />}
                  className="pl-3"
                  onClick={() => track("whatsapp_click", { location: "industry_hero", industry: industry.slug })}
                >
                  Get this for {name.trim() && name.trim().length <= 20 ? name.trim() : `my ${industry.kind.toLowerCase()}`}
                </ButtonLink>
                <ButtonLink
                  href="#plan"
                  variant="secondary"
                  size="lg"
                  arrow
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("#plan");
                  }}
                >
                  See the price
                </ButtonLink>
              </motion.div>

              {/* Feature tour — desktop drives the sticky phone; phones get chips under the device */}
              <div className="mt-16 hidden lg:block">
                <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">Tap a feature — the phone shows it live</p>
                <ol className="mt-5 grid gap-3">
                  {industry.features.map((f, i) => (
                    <FeatureRow key={f.title} index={i} active={active === i} feature={f} onSelect={() => goFeature(i)} onCentre={() => wide && goFeature(i, true)} />
                  ))}
                </ol>
              </div>
            </div>

            <div className="min-w-0 lg:col-span-5 lg:col-start-8">
              <div className="lg:sticky lg:top-28">
                <motion.div
                  className="mx-auto w-full max-w-[20rem] sm:max-w-[21.5rem]"
                  initial={{ opacity: 0, y: 60, rotate: 3 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ duration: 1.2, ease, delay: 0.3 }}
                  onPointerDown={() => (lastTouch.current = Date.now())}
                  onWheel={() => (lastTouch.current = Date.now())}
                >
                  <DemoDevice industry={industry} name={name} area={area} apiRef={deviceRef} />
                </motion.div>
                <div className="no-scrollbar -mx-5 mt-6 flex gap-2 overflow-x-auto px-5 lg:hidden" aria-label="Jump to a feature">
                  {industry.features.map((f, i) => (
                    <button
                      key={f.title}
                      type="button"
                      onClick={() => goFeature(i)}
                      className={cn(
                        "flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-[0.8125rem] font-semibold transition-colors",
                        active === i ? "bg-ink text-ivory" : "bg-linen/80 text-ink ring-1 ring-ink/10",
                      )}
                    >
                      <f.icon className="size-4" strokeWidth={1.8} /> {f.title}
                    </button>
                  ))}
                </div>
                <p className="mt-5 text-center text-[0.8125rem] text-ink-soft">
                  Live demo · everything works · <span className="text-ink">{toDomain(displayName)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The same site on a big screen ── */}
      <BigScreen industry={industry} name={name} area={area} />

      {/* ── Features (phones get the full list here) ── */}
      <section className="container-x pb-4 lg:hidden" aria-label="What's included">
        <ol className="grid gap-3">
          {industry.features.map((f, i) => (
            <FeatureRow key={f.title} index={i} active={false} feature={f} onSelect={() => goFeature(i)} />
          ))}
        </ol>
      </section>

      {/* ── Automations ── */}
      <section aria-labelledby="auto-title" className="section-y">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>Works quietly in the background</Eyebrow>
              <RevealHeading id="auto-title" text="The busywork, *automated.*" className="mt-6 text-display" />
            </div>
            <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.1}>
              <p className="text-lead text-ink-soft">These run on their own — so you can focus on your customers, not your phone.</p>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {industry.automations.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.9, ease, delay: i * 0.1 }}
                className="rounded-[28px] bg-linen p-6 ring-1 ring-ink/[0.07] sm:p-7"
              >
                <p className="font-display text-[1.45rem] leading-tight">{a.title}</p>
                <div className="mt-5 rounded-2xl bg-ink px-4 py-3 text-[0.875rem] text-ivory">
                  <span className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-ochre">When</span>
                  <p className="mt-0.5">{a.trigger}</p>
                </div>
                <ol className="relative mt-4 grid gap-3 pl-6">
                  <span aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-px bg-ink/15" />
                  {a.steps.map((s, k) => (
                    <motion.li
                      key={s}
                      className="relative text-[0.9375rem]"
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 + k * 0.25 + i * 0.1 }}
                    >
                      <span aria-hidden="true" className="absolute -left-6 top-1.5 size-[15px] rounded-full border-[3px] border-linen" style={{ background: industry.theme.deep }} />
                      {s}
                    </motion.li>
                  ))}
                </ol>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Outcomes ── */}
      <section aria-label="What changes for you" className="px-2 sm:px-3">
        <div className="rounded-[28px] px-2 sm:rounded-[36px] lg:rounded-[44px]" style={{ background: industry.theme.deep, color: industry.theme.onDeep }}>
          <div className="container-x grid gap-10 py-16 sm:py-20 md:grid-cols-3">
            {industry.outcomes.map((o, i) => (
              <Reveal key={o.title} delay={i * 0.1}>
                <p className="tabular font-display text-[1rem] opacity-85">0{i + 1}</p>
                <p className="mt-3 font-display text-[clamp(1.6rem,1.3rem+1.2vw,2.3rem)] leading-[1.1] tracking-[-0.02em]">{o.title}</p>
                <p className="mt-3 opacity-75">{o.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recommended package + FAQs ── */}
      <section id="plan" aria-labelledby="plan-title" className="section-y scroll-mt-24">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Eyebrow>Recommended for you</Eyebrow>
            <Reveal className="mt-6">
              <div className="rounded-[30px] bg-ink p-7 text-ivory shadow-[0_40px_80px_-30px_rgb(29_26_22/0.6)] sm:p-9">
                <h2 id="plan-title" className="font-display text-[2.2rem] leading-none">
                  {plan.name}
                </h2>
                <p className="mt-3 text-ivory/65">{plan.forWho}</p>
                {site.pricing.show && (
                  <p className="mt-6 flex items-baseline gap-2">
                    {plan.prefix && <span className="text-ivory/60">{plan.prefix}</span>}
                    <span className="tabular font-display text-[3rem] leading-none">
                      {site.pricing.currency}
                      {inr(plan.price)}
                    </span>
                  </p>
                )}
                <p className="mt-3 inline-flex rounded-full bg-ivory/10 px-3 py-1 text-[0.8125rem] font-semibold">{industry.timeline}</p>
                <ul className="mt-6 grid gap-2.5 text-[0.95rem] text-ivory/85">
                  {plan.features.slice(0, 5).map((f) => (
                    <li key={f} className="flex gap-3">
                      <Check className="mt-1 size-4 shrink-0 text-ochre" /> {f}
                    </li>
                  ))}
                </ul>
                <ButtonLink
                  href={waHref(waMessage({ plan: plan.name, businessName: name }))}
                  external
                  variant="light"
                  size="lg"
                  icon={<WhatsAppDisc className="-ml-3 size-9" />}
                  className="mt-8 w-full pl-3"
                  onClick={() => track("whatsapp_click", { location: "industry_plan", industry: industry.slug })}
                >
                  Talk about {plan.name}
                </ButtonLink>
                {site.foundingOffer.enabled && site.foundingOffer.spots > site.foundingOffer.spotsTaken && (
                  <p className="mt-4 text-center text-[0.8125rem] text-ivory/60">
                    Founding offer: {site.foundingOffer.perk} for our first {site.foundingOffer.spots} clients.
                  </p>
                )}
              </div>
            </Reveal>
            <TLink to="/#pricing" curtain={HOME_CURTAIN} className="mt-5 inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-ink-soft hover:text-ink">
              Compare all packages <ArrowUpRight className="size-4" />
            </TLink>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Eyebrow>{industry.kind} questions</Eyebrow>
            <RevealHeading text={`What ${industry.kind.toLowerCase()} owners *ask us*.`} className="mt-6 text-[clamp(1.9rem,1.4rem+2vw,3rem)] leading-[1.05] tracking-[-0.03em]" />
            <Reveal className="mt-8">
              <Accordion items={industry.faqs} />
            </Reveal>
            <p className="mt-6 text-ink-soft">Also perfect for {industry.alsoFor}.</p>
          </div>
        </div>
      </section>

      <Contact defaultType={industry.slug} source={`industry_${industry.slug}`} />

      {/* ── Other industries ── */}
      <section aria-labelledby="others-title" className="section-y">
        <div className="container-x">
          <Eyebrow>Explore other exhibits</Eyebrow>
          <h2 id="others-title" className="mt-6 text-[clamp(1.9rem,1.4rem+2vw,3rem)] leading-[1.05] tracking-[-0.03em]">
            Not a {industry.kind.toLowerCase()}? See yours.
          </h2>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => (
              <TLink
                key={o.slug}
                to={`/for/${o.slug}`}
                curtain={curtainFor(o)}
                onIntent={() => prefetchDemo(o.slug)}
                className="group relative overflow-hidden rounded-[24px] p-5 ring-1 ring-ink/[0.07] transition-[transform,box-shadow] duration-500 ease-(--ease-soft) hover:-translate-y-1 hover:shadow-lift"
                style={{ background: `linear-gradient(150deg, ${o.theme.tint}, #fffdf9 80%)` }}
              >
                <span className="flex items-center justify-between">
                  <span className="tabular text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-ink-soft">Exhibit {o.no}</span>
                  <ArrowUpRight className="size-5 text-ink-soft transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
                <span className="mt-8 grid size-11 place-items-center rounded-2xl text-white" style={{ background: o.theme.deep }}>
                  <o.icon className="size-5" strokeWidth={1.8} />
                </span>
                <span className="mt-4 block font-display text-[1.35rem] leading-tight">{o.name}</span>
                <span className="mt-1 block text-[0.875rem] text-ink-soft">{o.tagline}</span>
              </TLink>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}

function FeatureRow({
  index,
  active,
  feature,
  onSelect,
  onCentre,
}: {
  index: number;
  active: boolean;
  feature: Industry["features"][number];
  onSelect: () => void;
  onCentre?: () => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const centre = useRef(onCentre);
  useLayoutEffect(() => {
    centre.current = onCentre;
  });
  const observe = !!onCentre;
  useEffect(() => {
    if (!observe || !ref.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && centre.current?.(), { rootMargin: "-48% 0px -48% 0px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [observe]);

  return (
    <li ref={ref}>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={active}
        className={cn(
          "group flex w-full items-start gap-4 rounded-[22px] p-4 text-left transition-[background-color,box-shadow] duration-500",
          active ? "bg-linen shadow-soft ring-1 ring-ink/[0.08]" : "hover:bg-linen/60",
        )}
      >
        <span className={cn("grid size-11 shrink-0 place-items-center rounded-2xl transition-colors", active ? "bg-ink text-ivory" : "bg-sand text-ink")}>
          <feature.icon className="size-5" strokeWidth={1.8} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="tabular text-[0.75rem] font-semibold text-clay-deep">0{index + 1}</span>
            <span className="font-sans text-[1.0625rem] font-bold text-ink">{feature.title}</span>
          </span>
          <span className="mt-1 block text-ink-soft">{feature.text}</span>
        </span>
      </button>
    </li>
  );
}

function BigScreen({ industry, name, area }: { industry: Industry; name: string; area: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 30%"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const displayName = name.trim() || industry.demo.name;

  // Only build the big-screen demo when it's about to scroll into view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setMounted(true), { rootMargin: "600px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section aria-labelledby="bigscreen-title" className="section-y overflow-hidden">
      <div className="container-x">
        <div className="mx-auto max-w-[44rem] text-center">
          <Eyebrow className="mx-auto">One website, every screen</Eyebrow>
          <RevealHeading id="bigscreen-title" text="And on a *big screen*, it looks like this." className="mt-6 text-display" />
          <Reveal delay={0.1}>
            <p className="mt-5 text-lead text-ink-soft">
              The same site adapts to laptops and desktops — at your own address, <span className="text-ink">{toDomain(displayName)}</span>. Go ahead,
              click around.
            </p>
          </Reveal>
        </div>
        <motion.div ref={ref} style={{ scale, y }} className="mx-auto mt-14 max-w-[72rem]">
          {mounted ? (
            <DemoDevice industry={industry} name={name} area={area} mode="desktop" />
          ) : (
            <div className="aspect-[1280/820] rounded-[18px] bg-sand" />
          )}
        </motion.div>
      </div>
    </section>
  );
}
