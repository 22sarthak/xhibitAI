import type { Transition, Variants } from "motion/react";

/** Entrances: a slow exhale. */
export const ease = [0.22, 1, 0.36, 1] as const;
/** Things that must move decisively (curtains, sheets). */
export const easeSwift = [0.76, 0, 0.24, 1] as const;

export const spring: Transition = { type: "spring", stiffness: 380, damping: 32, mass: 0.8 };
export const softSpring: Transition = { type: "spring", stiffness: 140, damping: 22, mass: 1 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease } },
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

export const inViewOnce = { once: true, margin: "0px 0px -12% 0px" } as const;
