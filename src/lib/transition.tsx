import { motion, useReducedMotion } from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router";
import { ease, easeSwift } from "./motion";
import { useSmoothScroll } from "./smooth-scroll";
import { wait } from "./utils";

/* ──────────────────────────────────────────────────────────────────────────
 *  Page transitions — "the curtain".
 *  Moving between screens, a panel in the destination's colour sweeps up with
 *  its exhibit label ("Exhibit 04 — Gyms & Fitness"), the new page mounts
 *  underneath, and the curtain lifts away. Reduced-motion users get none of it.
 * ────────────────────────────────────────────────────────────────────────── */

export interface CurtainSpec {
  color: string;
  ink: string;
  eyebrow: string;
  title: string;
}

export const HOME_CURTAIN: CurtainSpec = {
  color: "#17152a",
  ink: "#fbf7f0",
  eyebrow: "Xhibit AI",
  title: "Your business, on display.",
};

type Phase = "idle" | "cover" | "hold" | "reveal";

interface TransitionValue {
  go: (to: string, curtain?: CurtainSpec) => void;
  signalReady: () => void;
  phase: Phase;
}

const TransitionContext = createContext<TransitionValue | null>(null);
const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const navType = useNavigationType();
  const reduced = useReducedMotion();
  const { scrollTo, stop, start } = useSmoothScroll();

  const [phase, setPhase] = useState<Phase>("idle");
  const [curtain, setCurtain] = useState<CurtainSpec>(HOME_CURTAIN);
  const pendingTo = useRef<string | null>(null);
  const readyResolve = useRef<(() => void) | null>(null);

  /* ── Scroll memory for back/forward ── */
  const positions = useRef(new Map<string, number>());
  const currentKey = useRef(location.key);
  const pendingRestore = useRef<number | null>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    // Fires before React swaps the page, so scrollY still belongs to the page we're leaving.
    const onPop = () => positions.current.set(currentKey.current, window.scrollY);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  // Layout effect: must run before the incoming page's useRouteReady() effect.
  useLayoutEffect(() => {
    currentKey.current = location.key;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (navType === "POP") pendingRestore.current = positions.current.get(location.key) ?? 0;
  }, [location.key, navType]);

  const signalReady = useCallback(() => {
    readyResolve.current?.();
    readyResolve.current = null;
    if (pendingRestore.current !== null) {
      const y = pendingRestore.current;
      pendingRestore.current = null;
      requestAnimationFrame(() => scrollTo(y, { immediate: true, offset: 0 }));
    }
  }, [scrollTo]);

  const navigateAndWait = useCallback(
    (to: string) => {
      const ready = new Promise<void>((res) => {
        readyResolve.current = res;
      });
      navigate(to);
      return Promise.race([ready, wait(1800)]);
    },
    [navigate],
  );

  const go = useCallback(
    (to: string, spec?: CurtainSpec) => {
      const url = new URL(to, window.location.href);
      const target = url.pathname + url.search + url.hash;

      // Same page: just glide to the section.
      if (url.pathname === window.location.pathname) {
        if (url.search !== window.location.search) navigate(url.pathname + url.search, { replace: true });
        if (url.hash) scrollTo(url.hash);
        else scrollTo(0, { offset: 0 });
        return;
      }
      if (phase !== "idle") return;
      positions.current.set(currentKey.current, window.scrollY);

      if (reduced) {
        void navigateAndWait(url.pathname + url.search).then(async () => {
          await nextFrame();
          if (url.hash) scrollTo(url.hash, { immediate: true });
          else window.scrollTo(0, 0);
        });
        return;
      }
      pendingTo.current = target;
      setCurtain(spec ?? HOME_CURTAIN);
      stop();
      setPhase("cover");
    },
    [navigate, navigateAndWait, phase, reduced, scrollTo, stop],
  );

  const onCurtainDone = useCallback(
    async (definition: string) => {
      if (definition === "cover" && pendingTo.current) {
        const to = pendingTo.current;
        setPhase("hold");
        window.scrollTo(0, 0);
        scrollTo(0, { immediate: true, offset: 0 });
        await navigateAndWait(to.split("#")[0]);
        await nextFrame();
        await nextFrame();
        const hash = to.includes("#") ? `#${to.split("#")[1]}` : "";
        if (hash) scrollTo(hash, { immediate: true });
        setPhase("reveal");
      } else if (definition === "reveal") {
        pendingTo.current = null;
        setPhase("idle");
        start();
      }
    },
    [navigateAndWait, scrollTo, start],
  );

  const value = useMemo(() => ({ go, signalReady, phase }), [go, signalReady, phase]);

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <Curtain phase={phase} spec={curtain} onDone={onCurtainDone} />
    </TransitionContext.Provider>
  );
}

function Curtain({ phase, spec, onDone }: { phase: Phase; spec: CurtainSpec; onDone: (d: string) => void }) {
  const variant = phase === "idle" ? "idle" : phase === "reveal" ? "reveal" : "cover";
  const showText = phase === "cover" || phase === "hold";
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-150 h-[120vh] will-change-transform"
      style={{
        background: spec.color,
        color: spec.ink,
        borderRadius: "50% 50% 50% 50% / 9vh 9vh 9vh 9vh",
        pointerEvents: phase === "idle" ? "none" : "auto",
      }}
      initial={false}
      animate={variant}
      variants={{
        idle: { y: "100vh", transition: { duration: 0 } },
        cover: { y: "-10vh", transition: { duration: 0.62, ease: easeSwift } },
        reveal: { y: "-122vh", transition: { duration: 0.74, ease: easeSwift } },
      }}
      onAnimationComplete={(d) => void onDone(String(d))}
    >
      <div className="absolute inset-x-0 top-[10vh] flex h-screen flex-col items-center justify-center px-6 text-center">
        <motion.p
          className="text-[0.72rem] font-semibold uppercase tracking-[0.24em]"
          initial={false}
          animate={showText ? { opacity: 0.72, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.5, ease, delay: showText ? 0.22 : 0 }}
        >
          {spec.eyebrow}
        </motion.p>
        <motion.p
          className="mt-5 max-w-[16ch] font-display text-[clamp(2.4rem,1.4rem+5vw,5.75rem)] italic leading-[0.98] tracking-[-0.03em]"
          initial={false}
          animate={showText ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease, delay: showText ? 0.28 : 0 }}
        >
          {spec.title}
        </motion.p>
      </div>
    </motion.div>
  );
}

export function usePageTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("usePageTransition must be used inside TransitionProvider");
  return ctx;
}

/** Call once in each page component so the curtain knows it can lift. */
export function useRouteReady() {
  const { signalReady } = usePageTransition();
  useEffect(() => {
    signalReady();
  }, [signalReady]);
}

type TLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  curtain?: CurtainSpec;
  onIntent?: () => void;
};

/** An internal link that travels with the curtain transition. */
export function TLink({ to, curtain, onIntent, onClick, onPointerEnter, onFocus, children, ...rest }: TLinkProps) {
  const { go } = usePageTransition();
  return (
    <a
      href={to}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        go(to, curtain);
      }}
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        onIntent?.();
      }}
      onFocus={(e) => {
        onFocus?.(e);
        onIntent?.();
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
