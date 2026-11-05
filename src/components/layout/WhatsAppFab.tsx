import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { site } from "../../../site.config";
import { industryBySlug } from "../../content/industries";
import { track } from "../../lib/api";
import { ease } from "../../lib/motion";
import { usePersonalization } from "../../lib/personalization";
import { waHref, waMessage } from "../../lib/whatsapp";
import { WhatsAppIcon } from "../ui/icons";

/**
 * The floating WhatsApp button. Its pre-filled message knows which page the
 * visitor is on ("I saw your clinic demo…") and their business name, if typed.
 * A single gentle nudge bubble appears once per visit.
 */
export function WhatsAppFab() {
  const { pathname } = useLocation();
  const { name } = usePersonalization();
  const industry = pathname.startsWith("/for/") ? industryBySlug(pathname.split("/")[2]) : undefined;
  const href = waHref(waMessage({ kind: industry?.kind, businessName: name }));
  const [shown, setShown] = useState(false);
  const [nudge, setNudge] = useState(false);

  // The hero has its own WhatsApp button, so the floating one waits until the visitor scrolls past it.
  useEffect(() => {
    const update = () => setShown(window.scrollY > window.innerHeight * 0.75);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [pathname]);

  // One gentle nudge per visit, on larger screens only, after the visitor has explored a while. It hides itself.
  useEffect(() => {
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    try {
      if (sessionStorage.getItem("xh:nudged")) return;
    } catch {
      /* ignore */
    }
    let hide = 0;
    const t = window.setTimeout(() => {
      if (window.scrollY < window.innerHeight) return;
      setNudge(true);
      hide = window.setTimeout(() => setNudge(false), 8000);
      try {
        sessionStorage.setItem("xh:nudged", "1");
      } catch {
        /* ignore */
      }
    }, 30000);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(hide);
    };
  }, []);

  const replyLine = site.promises.whatsappReplyHours
    ? `We reply within ${site.promises.whatsappReplyHours} hours.`
    : "We'd love to help.";

  return (
    <div
      className="fixed bottom-4 right-4 z-30 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <AnimatePresence>
        {nudge && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.5, ease }}
            className="relative w-[17rem] origin-bottom-right rounded-2xl bg-linen p-4 pr-9 shadow-lift ring-1 ring-ink/[0.06]"
            role="status"
          >
            <p className="text-[0.9rem] font-semibold leading-snug text-ink">
              {industry ? `Want this for your ${industry.kind.toLowerCase()}?` : "Want to see your business online?"}
            </p>
            <p className="mt-1 text-[0.8125rem] leading-snug text-ink-soft">Message us on WhatsApp. {replyLine}</p>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => setNudge(false)}
              className="absolute right-2 top-2 grid size-7 place-items-center rounded-full text-ink-mute hover:bg-ink/5 hover:text-ink"
            >
              <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
              </svg>
            </button>
            <span aria-hidden="true" className="absolute -bottom-1.5 right-6 size-3 rotate-45 bg-linen" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with ${site.brand.name} on WhatsApp`}
        onClick={() => {
          setNudge(false);
          track("whatsapp_click", { location: "fab", industry: industry?.slug });
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={shown ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        tabIndex={shown ? 0 : -1}
        aria-hidden={!shown}
        style={{ pointerEvents: shown ? "auto" : "none" }}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 320, damping: 20 }}
        className="relative grid size-[3.4rem] place-items-center rounded-full bg-wa text-white shadow-[0_10px_24px_-10px_rgb(12_14_24/0.45)]"
      >
        <WhatsAppIcon className="relative size-7" />
      </motion.a>
    </div>
  );
}
