import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

/** Each section number gets its own hue, matching that section's italic accent. */
const HUE: Record<string, string> = {
  "01": "text-cobalt",
  "02": "text-violet",
  "03": "text-clay-deep",
  "04": "text-sal",
  "05": "text-rose-deep",
  "06": "text-rose-deep",
  "07": "text-cobalt",
  "08": "text-violet",
  "09": "text-clay-deep",
};

/** Museum-label section marker: "No. 03 ─── How it works". */
export function Eyebrow({
  no,
  children,
  tone = "ink",
  className,
}: {
  no?: string;
  children: ReactNode;
  tone?: "ink" | "light";
  className?: string;
}) {
  return (
    <p className={cn("eyebrow", tone === "light" && "text-ivory/70", className)}>
      {no && <span className={cn("tabular", tone === "light" ? "text-ochre" : (HUE[no] ?? "text-clay-deep"))}>No. {no}</span>}
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-35" />
      <span>{children}</span>
    </p>
  );
}
