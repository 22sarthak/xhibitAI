import { motion, type Variants } from "motion/react";
import { Fragment, type ElementType, type ReactNode } from "react";
import { ease, inViewOnce } from "../../lib/motion";
import { cn } from "../../lib/utils";

/** Fades and rises into view once. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  amount,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={amount ? { once: true, amount } : inViewOnce}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Container that staggers its <RevealItem> children. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={inViewOnce}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  );
}

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease } },
};

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={revealItem}>
      {children}
    </motion.div>
  );
}

/**
 * Heading whose words rise out of a mask, one after another.
 * Wrap words in *asterisks* to set them in the italic accent.
 */
export function RevealHeading({
  as: Tag = "h2",
  text,
  className,
  emClass = "italic text-clay",
  delay = 0,
  animateOnMount = false,
  id,
}: {
  as?: ElementType;
  text: string;
  className?: string;
  emClass?: string;
  delay?: number;
  animateOnMount?: boolean;
  id?: string;
}) {
  // *Emphasis* may span several words: "in *five seconds*."
  let inEm = false;
  const tokens = text.split(/\s+/).map((raw) => {
    let word = raw;
    if (word.startsWith("*")) {
      inEm = true;
      word = word.slice(1);
    }
    const em = inEm;
    if (/\*[.,!?—:;]*$/.test(word)) {
      word = word.replace(/\*(?=[.,!?—:;]*$)/, "");
      inEm = false;
    }
    return { word, em };
  });
  const plain = tokens.map((t) => t.word).join(" ");
  const trigger = animateOnMount
    ? { initial: "hidden", animate: "show" }
    : { initial: "hidden", whileInView: "show", viewport: inViewOnce };

  return (
    <Tag className={className} id={id}>
      <span className="sr-only">{plain}</span>
      <motion.span
        aria-hidden="true"
        className="block"
        {...trigger}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: delay } } }}
      >
        {tokens.map((t, i) => (
          <Fragment key={i}>
            <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-top">
              <motion.span
                className={cn("inline-block origin-bottom-left", t.em && emClass)}
                variants={{
                  hidden: { y: "112%", rotate: 3 },
                  show: { y: "0%", rotate: 0, transition: { duration: 1.05, ease } },
                }}
              >
                {t.word}
              </motion.span>
            </span>
            {i < tokens.length - 1 ? " " : null}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}
