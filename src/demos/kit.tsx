import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useScreen } from "../components/device/DeviceScreen";
import { cn, initials } from "../lib/utils";

/* Shared building blocks for the eight demo websites. Everything that floats
 * (sheets, toasts) renders into the device's overlay so it stays "on screen". */

export interface DemoProps {
  /** Business name to show (visitor's own, or the demo default). */
  name: string;
  area: string;
}

export function DemoImg({
  src,
  alt = "",
  className,
  eager,
  style,
}: {
  src: string;
  alt?: string;
  className?: string;
  eager?: boolean;
  style?: CSSProperties;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      ref={(el) => {
        if (el?.complete && el.naturalWidth) setLoaded(true);
      }}
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      onLoad={() => setLoaded(true)}
      className={cn(
        "block h-full w-full object-cover transition-opacity duration-700 ease-out",
        loaded ? "opacity-100" : "opacity-0",
        className,
      )}
      style={style}
    />
  );
}

export function Avatar({
  name,
  from,
  to,
  size = 44,
  className,
}: {
  name: string;
  from: string;
  to: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("grid shrink-0 place-items-center rounded-full font-semibold text-white", className)}
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${from}, ${to})`, fontSize: size * 0.36 }}
    >
      {initials(name)}
    </span>
  );
}

export function Stars({ value = 5, size = 13, color = "#f5a524" }: { value?: number; size?: number; color?: string }) {
  return (
    <span role="img" className="inline-flex gap-[2px]" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z"
            fill={i < Math.round(value) ? color : "transparent"}
            stroke={color}
            strokeWidth="1.2"
          />
        </svg>
      ))}
    </span>
  );
}

/** Bottom sheet on phones, centred dialog on desktop — always inside the device. */
export function Sheet({
  open,
  onClose,
  title,
  children,
  style,
  className,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  /** Wider dialog on desktop (e.g. product quick view). */
  wide?: boolean;
}) {
  const { overlay, mode } = useScreen();
  if (!overlay) return null;
  const desktop = mode === "desktop";
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="sheet"
          className={cn("pointer-events-auto absolute inset-0 flex justify-center", desktop ? "items-center" : "items-end")}
          style={style}
          initial="hidden"
          animate="show"
          exit="hidden"
          onKeyDown={(e) => e.key === "Escape" && onClose()}
        >
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              "relative max-h-[88%] w-full overflow-y-auto bg-white shadow-2xl",
              desktop ? cn("rounded-[24px] p-7", wide ? "max-w-[620px]" : "max-w-[460px]") : "rounded-t-[30px] px-5 pb-10 pt-3",
              className,
            )}
            variants={
              desktop
                ? { hidden: { opacity: 0, y: 24, scale: 0.97 }, show: { opacity: 1, y: 0, scale: 1 } }
                : { hidden: { y: "100%" }, show: { y: 0 } }
            }
            transition={{ type: "spring", stiffness: 340, damping: 34 }}
          >
            {!desktop && <div aria-hidden="true" className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-black/15" />}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-black/[0.06] text-black/60"
            >
              <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
              </svg>
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    overlay,
  );
}

export function useToast(ms = 2800) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const show = useCallback(
    (m: string) => {
      setMessage(m);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setMessage(null), ms);
    },
    [ms],
  );
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return [message, show] as const;
}

export function Toast({ message, style }: { message: string | null; style?: CSSProperties }) {
  const { overlay } = useScreen();
  if (!overlay) return null;
  return createPortal(
    <AnimatePresence>
      {message && (
        <motion.div
          key={message}
          role="status"
          className="absolute inset-x-5 bottom-9 z-10 mx-auto max-w-[380px] rounded-2xl bg-[#141414]/95 px-4 py-3.5 text-[14px] leading-snug text-white shadow-[0_20px_40px_-12px_rgba(0,0,0,.5)]"
          style={style}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>,
    overlay,
  );
}

/** Animated check mark for confirmations. */
export function SuccessTick({ color = "#16a34a", size = 64 }: { color?: string; size?: number }) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 64 64" initial="hidden" animate="show" aria-hidden="true">
      <motion.circle
        cx="32"
        cy="32"
        r="29"
        fill={`${color}18`}
        stroke={color}
        strokeWidth="3"
        variants={{ hidden: { pathLength: 0, opacity: 0 }, show: { pathLength: 1, opacity: 1, transition: { duration: 0.6 } } }}
      />
      <motion.path
        d="M20 33l8 8 16-17"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 0.45, delay: 0.45 } } }}
      />
    </motion.svg>
  );
}

/** Note shown on demo-only actions, so visitors understand what would happen for real. */
export const realSiteNote = (what: string) => `On your real website, ${what}`;
