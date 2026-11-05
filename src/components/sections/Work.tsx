import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { curtainFor, industryBySlug, type IndustrySlug } from "../../content/industries";
import { prefetchDemo } from "../../demos/registry";
import { track } from "../../lib/api";
import { useMediaQuery } from "../../lib/hooks";
import { ease } from "../../lib/motion";
import { cn } from "../../lib/utils";
import { DemoDevice } from "../device/DemoDevice";
import { ButtonRoute } from "../ui/Button";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal, RevealHeading } from "../ui/Reveal";

/** The projects shown on the laptop, each labelled by what kind of product it is. */
const PROJECTS: { slug: IndustrySlug; kind: string }[] = [
  { slug: "restaurants", kind: "Website" },
  { slug: "business", kind: "Web app" },
  { slug: "retail", kind: "Online store" },
  { slug: "hotels", kind: "Booking site" },
  { slug: "schools", kind: "Portal" },
];

export function Work() {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const wide = useMediaQuery("(min-width: 1024px)");
  const project = PROJECTS[index];
  const industry = industryBySlug(project.slug)!;

  // Build the live demos only when the section is about to be seen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setMounted(true), { rootMargin: "700px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="work" aria-labelledby="work-title" className="section-y scroll-mt-4 overflow-hidden">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow no="02">Our work</Eyebrow>
            <RevealHeading id="work-title" text="Real products, on *every screen*." className="mt-6 text-display" emClass="italic text-violet" />
          </div>
          <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.1}>
            <p className="text-lead text-ink-soft">
              Websites, web apps and stores we've built to show what's possible. They're live: scroll and click around inside the laptop.
            </p>
          </Reveal>
        </div>

        <div role="tablist" aria-label="Choose a project" className="no-scrollbar -mx-5 mt-10 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {PROJECTS.map((p, i) => {
            const ind = industryBySlug(p.slug)!;
            const selected = i === index;
            return (
              <button
                key={p.slug}
                role="tab"
                type="button"
                aria-selected={selected}
                onClick={() => {
                  setIndex(i);
                  track("work_select", { industry: p.slug });
                }}
                onPointerEnter={() => prefetchDemo(p.slug)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[0.9rem] font-semibold transition-colors",
                  selected ? "bg-ink text-white" : "bg-linen text-ink ring-1 ring-ink/10 hover:ring-ink/30",
                )}
              >
                <span className={cn("text-[0.75rem] font-medium", selected ? "text-white/60" : "text-ink-mute")}>{p.kind}</span>
                {ind.demo.name}
              </button>
            );
          })}
        </div>

        <div ref={ref} className="relative mt-10 pb-[6%] pr-[5%]">
          {mounted ? (
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.6, ease }}
                className="relative"
              >
                <DemoDevice industry={industry} mode="laptop" interactive={wide} />
                <div className="absolute -bottom-[5%] right-[-4%] w-[22%] max-w-[17rem] drop-shadow-2xl">
                  <DemoDevice industry={industry} mode="phone" interactive={false} />
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="aspect-[1440/912] rounded-[28px] bg-sand" />
          )}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-5 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="text-[0.9rem] text-ink-soft">
            <span className="font-semibold text-ink">{industry.demo.name}</span> · {project.kind} · {industry.demo.area}, {industry.demo.city}
          </p>
          <ButtonRoute to={`/for/${project.slug}`} curtain={curtainFor(industry)} onIntent={() => prefetchDemo(project.slug)} variant="secondary" arrow>
            Open the full demo
          </ButtonRoute>
        </div>
      </div>
    </section>
  );
}
