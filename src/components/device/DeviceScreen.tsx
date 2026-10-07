import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from "react";
import { cn } from "../../lib/utils";

/* ──────────────────────────────────────────────────────────────────────────
 *  The screen inside a device frame: a scroll container for the demo site,
 *  plus an overlay layer where demo sheets/toasts render (so they stay inside
 *  the device), plus a small API so the page can "tour" the demo:
 *  deviceRef.current.goTo("menu") scrolls the demo to [data-section="menu"].
 * ────────────────────────────────────────────────────────────────────────── */

export interface DeviceApi {
  goTo: (sectionId: string) => void;
}

interface ScreenContextValue {
  overlay: HTMLElement | null;
  registerNav: (fn: ((id: string) => boolean) | null) => void;
  mode: "phone" | "desktop";
  /** Scroll this device (only) to a [data-section] — for links inside demos. */
  scrollToSection: (id: string, highlight?: boolean) => void;
}

const ScreenContext = createContext<ScreenContextValue>({
  overlay: null,
  registerNav: () => {},
  mode: "phone",
  scrollToSection: () => {},
});

export const useScreen = () => useContext(ScreenContext);

/** Demo sites with tabs (e.g. the business app) can intercept tour navigation. */
export function useDemoNav(handler: (id: string) => boolean) {
  const { registerNav } = useScreen();
  const saved = useRef(handler);
  useLayoutEffect(() => {
    saved.current = handler;
  });
  useEffect(() => {
    registerNav((id) => saved.current(id));
    return () => registerNav(null);
  }, [registerNav]);
}

export function DeviceScreen({
  children,
  apiRef,
  interactive = true,
  label,
  mode = "phone",
  accent = "#c4532d",
  autoScroll = false,
}: {
  children: ReactNode;
  apiRef?: Ref<DeviceApi>;
  interactive?: boolean;
  label: string;
  mode?: "phone" | "desktop";
  /** Colour of the highlight ring when a section is toured to. */
  accent?: string;
  /** Slowly glide down the page, like someone browsing (hero showcase). */
  autoScroll?: boolean;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [overlay, setOverlay] = useState<HTMLDivElement | null>(null);
  const navHandler = useRef<((id: string) => boolean) | null>(null);

  useEffect(() => {
    if (!autoScroll || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const startAt = performance.now() + 900;
    const duration = 2600;
    const step = (now: number) => {
      const sc = scroller.current;
      if (!sc) return;
      const t = Math.min(1, Math.max(0, (now - startAt) / duration));
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      sc.scrollTop = eased * Math.min(300, sc.scrollHeight - sc.clientHeight);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [autoScroll]);

  const scrollToSection = useCallback(
    (id: string, highlight = false) => {
      const sc = scroller.current;
      if (!sc) return;
      if (id === "top") {
        sc.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const el = sc.querySelector<HTMLElement>(`[data-section="${id}"]`);
      if (!el) return;
      // Device is CSS-scaled: convert on-screen distance back to logical pixels.
      const scRect = sc.getBoundingClientRect();
      const scale = scRect.height / sc.offsetHeight || 1;
      const top = (el.getBoundingClientRect().top - scRect.top) / scale + sc.scrollTop - (mode === "phone" ? 64 : 80);
      sc.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      if (highlight) {
        el.animate(
          [
            { boxShadow: `inset 0 0 0 0px ${accent}00` },
            { boxShadow: `inset 0 0 0 4px ${accent}`, offset: 0.25 },
            { boxShadow: `inset 0 0 0 4px ${accent}`, offset: 0.7 },
            { boxShadow: `inset 0 0 0 0px ${accent}00` },
          ],
          { duration: 1700, delay: 450, easing: "ease-out" },
        );
      }
    },
    [accent, mode],
  );

  useImperativeHandle(
    apiRef,
    () => ({
      goTo(id: string) {
        if (navHandler.current?.(id)) return;
        scrollToSection(id, true);
      },
    }),
    [scrollToSection],
  );

  const ctx = useMemo<ScreenContextValue>(
    () => ({ overlay, registerNav: (fn) => (navHandler.current = fn), mode, scrollToSection }),
    [overlay, mode, scrollToSection],
  );

  return (
    <ScreenContext.Provider value={ctx}>
      <div className="relative h-full w-full">
        <div
          ref={scroller}
          data-lenis-prevent
          role="region"
          aria-label={label}
          tabIndex={interactive ? 0 : -1}
          className={cn(
            "demo-root no-scrollbar h-full w-full overflow-y-auto overflow-x-hidden overscroll-contain @container focus-visible:outline-none",
            !interactive && "pointer-events-none overflow-hidden",
          )}
        >
          {children}
        </div>
        <div ref={setOverlay} className="demo-root pointer-events-none absolute inset-0 z-40 overflow-hidden @container" />
      </div>
    </ScreenContext.Provider>
  );
}
