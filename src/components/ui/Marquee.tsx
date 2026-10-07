import type { CSSProperties, ReactNode } from "react";
import { cn } from "../../lib/utils";

/**
 * Infinite, GPU-cheap marquee. The track holds two identical copies and slides
 * by exactly one copy's width. Pauses on hover; frozen for reduced motion.
 */
export function Marquee({
  children,
  reverse = false,
  duration = 48,
  className,
  gap = "3rem",
}: {
  children: ReactNode;
  reverse?: boolean;
  duration?: number;
  className?: string;
  gap?: string;
}) {
  const style = { "--marquee-duration": `${duration}s`, "--gap": gap } as CSSProperties;
  return (
    <div className={cn("group/marquee flex overflow-hidden", className)} style={style}>
      <div
        className={cn(
          "flex w-max shrink-0 items-center group-hover/marquee:[animation-play-state:paused]",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
        )}
      >
        <div className="flex shrink-0 items-center gap-(--gap) pr-(--gap)">{children}</div>
        <div className="flex shrink-0 items-center gap-(--gap) pr-(--gap)" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
