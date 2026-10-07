import { site } from "../../../site.config";
import { businessTypes, neighbourhoods } from "../../content/home";
import { LogoMark } from "../brand/Logo";
import { Marquee } from "../ui/Marquee";

export function LocalStrip() {
  return (
    <section aria-labelledby="local-title" className="relative overflow-hidden py-14 sm:py-20">
      <h2 id="local-title" className="eyebrow mx-auto mb-9 flex w-fit justify-center font-sans">
        <span aria-hidden="true" className="h-px w-8 bg-current opacity-35" />
        Made for businesses across {site.brand.city}
        <span aria-hidden="true" className="h-px w-8 bg-current opacity-35" />
      </h2>
      <p className="sr-only">
        We work with {businessTypes.join(", ").toLowerCase()} in {neighbourhoods.join(", ")} and across {site.brand.city}.
      </p>
      <div aria-hidden="true" className="mask-fade-x">
        <Marquee duration={60} gap="2.5rem">
          {businessTypes.map((t) => (
            <span
              key={t}
              className="flex items-center gap-10 whitespace-nowrap font-display text-[clamp(2.2rem,1.5rem+2.6vw,4rem)] italic leading-[1.1] tracking-[-0.02em] text-ink/90"
            >
              {t}
              <LogoMark className="size-[0.42em] shrink-0 opacity-80" />
            </span>
          ))}
        </Marquee>
        <Marquee reverse duration={75} gap="1.75rem" className="mt-6">
          {neighbourhoods.map((n) => (
            <span key={n} className="flex items-center gap-7 whitespace-nowrap text-[0.8125rem] font-semibold uppercase tracking-[0.22em] text-ink-soft">
              {n}
              <span className="size-1.5 rounded-full bg-clay/70" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
