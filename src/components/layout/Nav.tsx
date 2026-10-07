import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { site } from "../../../site.config";
import { curtainFor, industries } from "../../content/industries";
import { track } from "../../lib/api";
import { ease, easeSwift } from "../../lib/motion";
import { usePersonalization } from "../../lib/personalization";
import { useSmoothScroll } from "../../lib/smooth-scroll";
import { HOME_CURTAIN, usePageTransition } from "../../lib/transition";
import { cn } from "../../lib/utils";
import { telHref, waHref, waMessage } from "../../lib/whatsapp";
import { Logo } from "../brand/Logo";
import { ButtonLink } from "../ui/Button";
import { WhatsAppDisc } from "../ui/icons";

export const NAV_LINKS = [
  { id: "industries", label: "Industries" },
  { id: "services", label: "Services" },
  { id: "process", label: "How it works" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
] as const;

function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) {
      setActive(null);
      return;
    }
    const els = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const inView = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inView.add(e.target.id);
          else inView.delete(e.target.id);
        }
        // The section crossing the middle of the screen wins; none if we're between them.
        setActive(NAV_LINKS.find((l) => inView.has(l.id))?.id ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);
  return active;
}

export function Nav() {
  const location = useLocation();
  const onHome = location.pathname === "/";
  const { go } = usePageTransition();
  const { scrollTo, stop, start } = useSmoothScroll();
  const { name } = usePersonalization();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(onHome);
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    if (open) return;
    setHidden(y > 160 && y > prev + 2 ? true : y < prev - 2 ? false : hidden);
  });

  // Mobile menu: lock scroll, Esc to close, keep focus inside.
  useEffect(() => {
    if (!open) return;
    stop();
    document.documentElement.style.overflow = "hidden";
    const first = panel.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panel.current) {
        const f = Array.from(panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
          e.preventDefault();
          f[0].focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      start();
      menuButton.current?.focus();
    };
  }, [open, start, stop]);

  const goSection = (id: string) => {
    setOpen(false);
    if (onHome) scrollTo(`#${id}`);
    else go(`/#${id}`, HOME_CURTAIN);
  };

  const wa = waHref(waMessage({ businessName: name }));

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-5 sm:pt-5">
        <motion.nav
          aria-label="Main"
          initial={{ y: -90, opacity: 0 }}
          animate={{ y: hidden ? -110 : 0, opacity: 1 }}
          transition={{ duration: 0.6, ease }}
          className={cn(
            "pointer-events-auto flex w-full max-w-[76rem] items-center justify-between gap-4 rounded-full py-2 pl-4 pr-2 transition-[background-color,box-shadow,backdrop-filter] duration-500 sm:pl-5",
            scrolled || !onHome
              ? "bg-ivory/75 shadow-[0_10px_34px_-14px_rgb(60_35_15/0.22)] ring-1 ring-ink/[0.07] backdrop-blur-xl"
              : "bg-ivory/0",
          )}
        >
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              if (onHome) scrollTo(0, { offset: 0 });
              else go("/", HOME_CURTAIN);
            }}
            className="rounded-full"
            aria-label={`${site.brand.name} — home`}
          >
            <Logo />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`/#${l.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    goSection(l.id);
                  }}
                  aria-current={active === l.id ? "true" : undefined}
                  className={cn(
                    "relative block rounded-full px-4 py-2 text-[0.9rem] font-medium transition-colors",
                    active === l.id ? "text-ink" : "text-ink-soft hover:text-ink",
                  )}
                >
                  {active === l.id && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-ink/[0.07]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex">
              <ButtonLink
                href={wa}
                external
                size="sm"
                icon={<WhatsAppDisc className="-ml-2 size-7" />}
                onClick={() => track("whatsapp_click", { location: "nav" })}
                className="pl-2"
              >
                Talk to us
              </ButtonLink>
            </span>
            <button
              ref={menuButton}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
              className="flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-[0.875rem] font-semibold text-ivory lg:hidden"
            >
              <span className="relative block h-2.5 w-4" aria-hidden="true">
                <span className={cn("absolute left-0 top-0 h-[1.5px] w-full bg-current transition-transform duration-300", open && "translate-y-[4.5px] rotate-45")} />
                <span className={cn("absolute bottom-0 left-0 h-[1.5px] w-full bg-current transition-transform duration-300", open && "-translate-y-[4.5px] -rotate-45")} />
              </span>
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </motion.nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ivory px-6 pb-8 pt-28 lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 3.5rem) 2.6rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 3.5rem) 2.6rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 3.5rem) 2.6rem)" }}
            transition={{ duration: 0.7, ease: easeSwift }}
          >
            <motion.ul
              className="flex flex-col"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.18 } } }}
            >
              {NAV_LINKS.map((l, i) => (
                <motion.li
                  key={l.id}
                  className="border-b border-line"
                  variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
                >
                  <a
                    href={`/#${l.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      goSection(l.id);
                    }}
                    className="flex items-baseline justify-between py-4 font-display text-[2.1rem] leading-none tracking-[-0.02em]"
                  >
                    {l.label}
                    <span className="tabular font-sans text-xs font-semibold text-ink-mute">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              className="mt-8"
            >
              <p className="eyebrow">See a live demo</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {industries.map((ind) => (
                  <a
                    key={ind.slug}
                    href={`/for/${ind.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setOpen(false);
                      go(`/for/${ind.slug}`, curtainFor(ind));
                    }}
                    className="rounded-full bg-sand px-3.5 py-2 text-[0.875rem] font-medium"
                  >
                    {ind.kind}
                  </a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.6, ease } }}
              className="mt-auto grid gap-3 pt-10"
            >
              <ButtonLink href={wa} external size="lg" icon={<WhatsAppDisc className="size-8" />} onClick={() => track("whatsapp_click", { location: "menu" })}>
                Chat on WhatsApp
              </ButtonLink>
              <ButtonLink href={telHref()} variant="secondary" size="lg" onClick={() => track("call_click", { location: "menu" })}>
                Call {site.contact.phoneDisplay}
              </ButtonLink>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
