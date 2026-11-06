import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { site } from "../../../site.config";
import { productSteps, steps } from "../../content/home";
import { track } from "../../lib/api";
import { cn } from "../../lib/utils";
import { ease } from "../../lib/motion";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal, RevealHeading } from "../ui/Reveal";

const TRACKS = [
  { id: "business", label: "Business website", steps },
  { id: "product", label: "Startup or product", steps: productSteps },
] as const;

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const [trackId, setTrackId] = useState<(typeof TRACKS)[number]["id"]>("business");
  const current = TRACKS.find((t) => t.id === trackId)!;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.6 });

  return (
    <section id="process" aria-labelledby="process-title" className="section-y">
      <div className="container-x">
        <div className="max-w-[46rem]">
          <Eyebrow no="06">How it works</Eyebrow>
          <RevealHeading
            id="process-title"
            text="From first call to *live*, without the headache."
            emClass="italic text-rose"
            className="mt-6 text-display"
          />
          <Reveal delay={0.1}>
            <p className="mt-6 text-lead text-ink-soft">No jargon, no endless meetings. Four clear steps, a live preview link the whole way, and we're always one WhatsApp away.</p>
          </Reveal>
          <Reveal delay={0.15} className="mt-8">
            <div role="tablist" aria-label="What are you building?" className="inline-flex rounded-full bg-sand p-1">
              {TRACKS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={trackId === t.id}
                  onClick={() => {
                    setTrackId(t.id);
                    track("process_track", { track: t.id });
                  }}
                  className={cn("relative rounded-full px-4 py-2 text-[0.875rem] font-semibold transition-colors sm:px-5", trackId === t.id ? "text-ivory" : "text-ink-soft hover:text-ink")}
                >
                  {trackId === t.id && <motion.span layoutId="process-track" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                  <span className="relative">{t.label}</span>
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <div ref={ref} className="relative mt-16 lg:mt-20">
          {/* Track: vertical on phones, horizontal on desktop */}
          <div aria-hidden="true" className="absolute bottom-6 left-[1.1rem] top-2 w-px bg-ink/10 lg:bottom-auto lg:left-0 lg:right-0 lg:top-[1.1rem] lg:h-px lg:w-auto" />
          <motion.div
            aria-hidden="true"
            style={{ scaleY: progress }}
            className="absolute bottom-6 left-[1.1rem] top-2 w-px origin-top bg-clay lg:hidden"
          />
          <motion.div
            aria-hidden="true"
            style={{ scaleX: progress }}
            className="absolute left-0 right-0 top-[1.1rem] hidden h-px origin-left bg-clay lg:block"
          />

          <AnimatePresence mode="wait" initial={false}>
            <motion.ol
              key={trackId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease }}
              className="grid gap-12 lg:grid-cols-4 lg:gap-8"
            >
              {current.steps.map((step, i) => (
                <Step key={step.title} index={i} total={current.steps.length} progress={progress} {...step} />
              ))}
            </motion.ol>
          </AnimatePresence>
        </div>

        {site.promises.freeDesignPreview && (
          <Reveal className="mt-20">
            <div className="flex flex-col items-start gap-6 rounded-[28px] bg-sand p-7 sm:flex-row sm:items-center sm:p-9">
              <span className="font-display text-[3.4rem] leading-none text-clay" aria-hidden="true">
                “
              </span>
              <p className="flex-1 font-display text-[clamp(1.35rem,1.1rem+1vw,1.9rem)] leading-snug tracking-[-0.01em]">
                {trackId === "business" ? (
                  <>
                    Our promise: you'll see your homepage design <em className="text-clay-deep">before</em> you pay a single rupee. If you don't love it,
                    you don't pay.
                  </>
                ) : (
                  <>
                    Our promise: you'll tap through a working prototype <em className="text-clay-deep">before</em> we write a line of code, so you
                    only pay to build what you're sure about.
                  </>
                )}
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function Step({
  index,
  total,
  progress,
  day,
  title,
  text,
}: {
  index: number;
  total: number;
  progress: ReturnType<typeof useSpring>;
  day: string;
  title: string;
  text: string;
}) {
  const at = index / (total - 1 || 1);
  const fill = useTransform(progress, [Math.max(0, at - 0.08), at], [0, 1]);
  const bg = useTransform(fill, (f) => (f > 0.5 ? "#e2501f" : "#f5f5f2"));
  const fg = useTransform(fill, (f) => (f > 0.5 ? "#f5f5f2" : "#0b0b0c"));

  return (
    <motion.li
      className="relative pl-14 lg:pl-0 lg:pt-14"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 0.8, ease, delay: index * 0.08 }}
    >
      <motion.span
        aria-hidden="true"
        style={{ backgroundColor: bg, color: fg }}
        className="tabular absolute left-0 top-0 grid size-[2.2rem] place-items-center rounded-full text-[0.8125rem] font-bold ring-1 ring-ink/15"
      >
        {index + 1}
      </motion.span>
      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-clay-deep">{day}</p>
      <h3 className="mt-2 text-title">{title}</h3>
      <p className="mt-3 text-ink-soft">{text}</p>
    </motion.li>
  );
}
