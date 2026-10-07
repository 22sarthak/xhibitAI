import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Target = number | string | HTMLElement;
interface ScrollOptions {
  offset?: number;
  immediate?: boolean;
}

interface SmoothScrollValue {
  scrollTo: (target: Target, opts?: ScrollOptions) => void;
  stop: () => void;
  start: () => void;
}

const SmoothScrollContext = createContext<SmoothScrollValue | null>(null);

const NAV_OFFSET = -84;

/**
 * Lenis smooth scrolling on desktop (mouse/trackpad) only. Phones keep their
 * native scroll, and reduced-motion users get no smoothing at all.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduced || !fine) return;
    const instance = new Lenis({ lerp: 0.105, smoothWheel: true, autoRaf: true, allowNestedScroll: true });
    setLenis(instance);
    return () => {
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  const scrollTo = useCallback(
    (target: Target, opts: ScrollOptions = {}) => {
      const offset = opts.offset ?? NAV_OFFSET;
      if (lenis) {
        lenis.scrollTo(target, { offset, immediate: opts.immediate, force: true, duration: opts.immediate ? 0 : 1.25 });
        return;
      }
      let top: number;
      if (typeof target === "number") top = target;
      else {
        const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
        if (!el) return;
        top = el.getBoundingClientRect().top + window.scrollY + offset;
      }
      window.scrollTo({ top, behavior: opts.immediate || reduced ? "auto" : "smooth" });
    },
    [lenis, reduced],
  );

  const stop = useCallback(() => lenis?.stop(), [lenis]);
  const start = useCallback(() => lenis?.start(), [lenis]);

  const value = useMemo(() => ({ scrollTo, stop, start }), [scrollTo, stop, start]);
  return <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>;
}

export function useSmoothScroll() {
  const ctx = useContext(SmoothScrollContext);
  if (!ctx) throw new Error("useSmoothScroll must be used inside SmoothScrollProvider");
  return ctx;
}
