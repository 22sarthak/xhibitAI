import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { ease } from "../../lib/motion";
import { cn } from "../../lib/utils";

export function Accordion({
  items,
  defaultOpen = 0,
  tone = "ink",
}: {
  items: { q: string; a: string }[];
  defaultOpen?: number | null;
  tone?: "ink" | "light";
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const base = useId();
  const light = tone === "light";

  return (
    <div className={cn("border-t", light ? "border-ivory/15" : "border-line")}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className={cn("border-b", light ? "border-ivory/15" : "border-line")}>
            <h3 className="m-0">
              <button
                id={`${base}-b${i}`}
                aria-expanded={isOpen}
                aria-controls={`${base}-p${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left"
              >
                <span
                  className={cn(
                    "font-display text-[1.2rem] leading-snug tracking-[-0.01em] transition-colors md:text-[1.35rem]",
                    !isOpen && (light ? "group-hover:text-ochre" : "group-hover:text-clay-deep"),
                  )}
                >
                  {item.q}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 grid size-9 shrink-0 place-items-center rounded-full ring-1 transition-[background-color,transform] duration-500 ease-(--ease-soft)",
                    light ? "ring-ivory/25" : "ring-ink/15",
                    isOpen && (light ? "rotate-45 bg-ivory text-ink" : "rotate-45 bg-ink text-ivory"),
                  )}
                >
                  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M8 2.5v11M2.5 8h11" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${base}-p${i}`}
                  role="region"
                  aria-labelledby={`${base}-b${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease }}
                  className="overflow-hidden"
                >
                  <p className={cn("max-w-[62ch] pb-7 pr-10", light ? "text-ivory/75" : "text-ink-soft")}>{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
