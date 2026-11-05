import { buildTypes, businessTypes } from "../../content/home";
import { Marquee } from "../ui/Marquee";

/** One accent per item, cycling, so the strip reads as a palette rather than a single orange. */
const DOTS = ["bg-clay", "bg-cobalt", "bg-sal", "bg-violet", "bg-ochre", "bg-rose"];

export function LocalStrip() {
  return (
    <section aria-labelledby="local-title" className="relative overflow-hidden py-14 sm:py-20">
      <h2 id="local-title" className="eyebrow mx-auto mb-9 flex w-fit justify-center font-sans">
        <span aria-hidden="true" className="h-px w-8 bg-current opacity-35" />
        Built for every kind of business
        <span aria-hidden="true" className="h-px w-8 bg-current opacity-35" />
      </h2>
      <p className="sr-only">
        We build {buildTypes.join(", ").toLowerCase()} for {businessTypes.join(", ").toLowerCase()} and startups across India.
      </p>
      <div aria-hidden="true" className="mask-fade-x">
        <Marquee duration={60} gap="2.75rem">
          {businessTypes.map((t, i) => (
            <span
              key={t}
              className="flex items-center gap-11 whitespace-nowrap font-display text-[clamp(2.2rem,1.5rem+2.6vw,4rem)] italic leading-[1.1] tracking-[-0.01em] text-ink"
            >
              {t}
              <span className={`size-[0.22em] shrink-0 rounded-full ${DOTS[i % DOTS.length]}`} />
            </span>
          ))}
        </Marquee>
        <Marquee reverse duration={75} gap="1.75rem" className="mt-6">
          {buildTypes.map((n) => (
            <span key={n} className="flex items-center gap-7 whitespace-nowrap text-[0.8125rem] font-semibold uppercase tracking-[0.22em] text-ink-soft">
              {n}
              <span className="size-1 rounded-full bg-ink/30" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
