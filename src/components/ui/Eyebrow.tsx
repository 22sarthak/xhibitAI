import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

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
      {no && <span className={cn("tabular", tone === "light" ? "text-ochre" : "text-clay-deep")}>No. {no}</span>}
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-35" />
      <span>{children}</span>
    </p>
  );
}
