import { cn } from "../../lib/utils";

/**
 * The Xhibit mark: two crossing bars — red-earth clay over ochre — like two
 * frames crossing on a gallery wall. Reads cleanly down to favicon size.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect x="12.6" y="1.2" width="6.8" height="29.6" rx="3.4" transform="rotate(45 16 16)" fill="#e9a23b" />
      <rect x="12.6" y="1.2" width="6.8" height="29.6" rx="3.4" transform="rotate(-45 16 16)" fill="#c4532d" />
      <path d="M16 11.2 20.8 16 16 20.8 11.2 16Z" fill="#8f3417" opacity=".55" />
    </svg>
  );
}

export function Logo({ tone = "ink", className }: { tone?: "ink" | "light"; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="size-[1.6rem]" />
      <span
        className={cn("font-display text-[1.45rem] leading-none tracking-[-0.03em]", tone === "light" ? "text-ivory" : "text-ink")}
        style={{ fontWeight: 560, fontVariationSettings: '"opsz" 72' }}
      >
        Xhibit
      </span>
      <span
        className={cn(
          "rounded-[6px] px-1.5 py-[3px] text-[0.625rem] font-bold leading-none tracking-[0.14em]",
          tone === "light" ? "bg-ivory/12 text-ivory" : "bg-ink text-ivory",
        )}
      >
        AI
      </span>
    </span>
  );
}
