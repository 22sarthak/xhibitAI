import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { curtainFor, industries, industryBySlug, type IndustrySlug } from "../../content/industries";
import { prefetchDemo } from "../../demos/registry";
import { track } from "../../lib/api";
import { ease } from "../../lib/motion";
import { usePersonalization } from "../../lib/personalization";
import { cn } from "../../lib/utils";
import { waHref, waMessage } from "../../lib/whatsapp";
import { DemoDevice } from "../device/DemoDevice";
import { ButtonLink, ButtonRoute } from "../ui/Button";
import { Eyebrow } from "../ui/Eyebrow";
import { WhatsAppDisc } from "../ui/icons";
import { Reveal, RevealHeading } from "../ui/Reveal";

function StepLabel({ n, children, id, htmlFor }: { n: number; children: string; id?: string; htmlFor?: string }) {
  const Tag = htmlFor ? "label" : "p";
  return (
    <Tag id={id} htmlFor={htmlFor} className="flex items-center gap-3 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">
      <span className="grid size-6 place-items-center rounded-full bg-ink text-[0.7rem] text-ivory" aria-hidden="true">
        {n}
      </span>
      {children}
    </Tag>
  );
}

export function PreviewStudio() {
  const { name, setName } = usePersonalization();
  const [slug, setSlug] = useState<IndustrySlug>("restaurants");
  const industry = industryBySlug(slug)!;
  const who = name.trim() || "my business";
  const demoUrl = `/for/${slug}${name.trim() ? `?name=${encodeURIComponent(name.trim())}` : ""}`;

  return (
    <section id="industries" aria-labelledby="studio-title" className="relative scroll-mt-4 px-2 sm:px-3">
      <div
        className="relative overflow-clip rounded-[28px] transition-[background-color] duration-1000 sm:rounded-[36px] lg:rounded-[44px]"
        style={{ backgroundColor: `color-mix(in oklab, var(--color-sand) 62%, ${industry.theme.tint})` }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 size-[34rem] rounded-full bg-linen/50 blur-3xl" />
        <div className="container-x section-y relative grid gap-12 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-10 lg:gap-y-0">
          {/* Top: heading + inputs */}
          <div className="lg:col-span-6 lg:row-start-1">
            <Eyebrow no="02">Try it yourself</Eyebrow>
            <RevealHeading id="studio-title" text="See your business online — in *five seconds*." className="mt-6 text-display" />
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-[32rem] text-lead text-ink-soft">
                Type your business name, pick what you do, and watch your website appear. It's live — tap around inside the phone.
              </p>
            </Reveal>

            <Reveal delay={0.15} className="mt-10">
              <StepLabel n={1} htmlFor="studio-name">
                Your business name
              </StepLabel>
              <div className="relative mt-3">
                <input
                  id="studio-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sharma Sweets"
                  maxLength={40}
                  autoComplete="organization"
                  spellCheck={false}
                  className="h-16 w-full rounded-2xl bg-linen/90 px-5 pr-14 font-display text-[1.55rem] tracking-[-0.01em] text-ink shadow-soft ring-1 ring-ink/10 transition-shadow placeholder:text-ink-mute/60 focus:outline-none focus:ring-2 focus:ring-clay"
                />
                {name && (
                  <button
                    type="button"
                    onClick={() => setName("")}
                    aria-label="Clear name"
                    className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-ink-mute hover:bg-ink/5 hover:text-ink"
                  >
                    ×
                  </button>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.2} className="mt-8">
              <StepLabel n={2} id="studio-type">
                What do you do?
              </StepLabel>
              <div role="radiogroup" aria-labelledby="studio-type" className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {industries.map((ind) => {
                  const selected = ind.slug === slug;
                  return (
                    <button
                      key={ind.slug}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => {
                        setSlug(ind.slug);
                        track("studio_select", { industry: ind.slug });
                      }}
                      onPointerEnter={() => prefetchDemo(ind.slug)}
                      onFocus={() => prefetchDemo(ind.slug)}
                      className={cn(
                        "relative flex items-center gap-2.5 rounded-2xl px-3.5 py-3 text-left text-[0.9rem] font-semibold transition-colors",
                        selected ? "text-ivory" : "bg-linen/70 text-ink ring-1 ring-ink/[0.07] hover:bg-linen",
                      )}
                    >
                      {selected && (
                        <motion.span
                          layoutId="studio-chip"
                          className="absolute inset-0 rounded-2xl bg-ink shadow-[0_10px_24px_-10px_rgb(29_26_22/0.6)]"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                      <ind.icon className="relative size-[1.1rem] shrink-0" strokeWidth={1.8} aria-hidden="true" />
                      <span className="relative">{ind.kind}</span>
                    </button>
                  );
                })}
              </div>
            </Reveal>
          </div>

          {/* Device */}
          <div className="lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">
            <div className="lg:sticky lg:top-24">
              <div className="relative mx-auto w-full max-w-[20rem] sm:max-w-[21.5rem]">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={slug}
                    initial={{ opacity: 0, y: 30, rotate: 2.5, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, rotate: -2.5, scale: 0.96 }}
                    transition={{ duration: 0.65, ease }}
                  >
                    <DemoDevice industry={industry} name={name} />
                  </motion.div>
                </AnimatePresence>
                <p className="mt-6 flex items-center justify-center gap-2 text-[0.8125rem] font-medium text-ink-soft">
                  <span className="relative flex size-2">
                    <span className="absolute inset-0 animate-ping rounded-full bg-sal/60" />
                    <span className="relative size-2 rounded-full bg-sal" />
                  </span>
                  It's live — tap, scroll and try things
                </p>
              </div>
            </div>
          </div>

          {/* Bottom: what's inside + CTAs */}
          <div className="lg:col-span-6 lg:row-start-2 lg:pt-10">
            <div className="rounded-3xl bg-linen/70 p-6 ring-1 ring-ink/[0.06] backdrop-blur sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">What's inside</p>
                <span className="tabular text-[0.8125rem] font-semibold text-clay-deep">Exhibit {industry.no}</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.ul
                  key={slug}
                  className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2"
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
                >
                  {industry.studioPoints.map((p) => (
                    <motion.li
                      key={p}
                      className="flex items-start gap-2.5 text-[0.9375rem]"
                      variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0, transition: { duration: 0.4, ease } } }}
                    >
                      <svg viewBox="0 0 16 16" className="mt-1 size-4 shrink-0 text-sal" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {p}
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>
              <p className="mt-5 text-[0.8125rem] text-ink-soft">Also perfect for {industry.alsoFor}.</p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonRoute to={demoUrl} curtain={curtainFor(industry)} onIntent={() => prefetchDemo(slug)} arrow size="lg">
                Open the full {industry.kind.toLowerCase()} demo
              </ButtonRoute>
              <ButtonLink
                variant="secondary"
                size="lg"
                href={waHref(waMessage({ kind: industry.kind, businessName: name }))}
                external
                icon={<WhatsAppDisc className="-ml-3 size-8" />}
                className="pl-4"
                onClick={() => track("whatsapp_click", { location: "studio", industry: slug })}
              >
                I want this for {who.length > 18 ? "my business" : who}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
