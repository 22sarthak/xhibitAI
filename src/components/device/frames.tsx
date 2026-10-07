import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export const PHONE = { w: 414, h: 868, screenW: 390 } as const;
export const DESKTOP = { w: 1280, h: 820 } as const;

export interface Chrome {
  /** Colour behind the phone status bar / browser tab strip. */
  bar: string;
  /** Status bar text colour. */
  tone: "dark" | "light";
}

function StatusIcons({ color }: { color: string }) {
  return (
    <span className="flex items-center gap-[6px]" style={{ color }}>
      <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden="true">
        <rect x="0" y="8" width="3" height="4" rx="1" />
        <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
        <rect x="10" y="3" width="3" height="9" rx="1" />
        <rect x="15" y="0" width="3" height="12" rx="1" />
      </svg>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" aria-hidden="true">
        <path d="M8 2.4c2.3 0 4.4.9 6 2.4l1.3-1.4A10.6 10.6 0 0 0 8 .4 10.6 10.6 0 0 0 .7 3.4L2 4.8a8.6 8.6 0 0 1 6-2.4Zm0 3.8c1.3 0 2.5.5 3.4 1.3l1.3-1.4A6.8 6.8 0 0 0 8 4.2c-1.8 0-3.5.7-4.7 1.9l1.3 1.4c.9-.8 2.1-1.3 3.4-1.3Zm0 3.7c-.6 0-1.1.2-1.5.6L8 12l1.5-1.5c-.4-.4-.9-.6-1.5-.6Z" />
      </svg>
      <svg width="27" height="13" viewBox="0 0 27 13" fill="none" aria-hidden="true">
        <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="currentColor" opacity="0.4" />
        <rect x="2" y="2" width="18" height="9" rx="2" fill="currentColor" />
        <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" opacity="0.45" />
      </svg>
    </span>
  );
}

/** A modern phone, drawn in CSS so it's crisp at any size. Logical size 414×868. */
export function PhoneFrame({ children, chrome, className }: { children: ReactNode; chrome: Chrome; className?: string }) {
  const ink = chrome.tone === "light" ? "#ffffff" : "#111111";
  return (
    <div
      className={cn("relative rounded-[64px] bg-[#0c0c0d] p-[12px]", className)}
      style={{
        width: PHONE.w,
        height: PHONE.h,
        boxShadow:
          "inset 0 0 0 1.5px #3a3a3c, inset 0 0 0 4px #121214, 0 2px 6px rgba(20,12,6,.12), 0 34px 70px -22px rgba(20,12,6,.45), 0 90px 140px -60px rgba(20,12,6,.5)",
      }}
    >
      {/* hardware buttons */}
      <span aria-hidden="true" className="absolute -left-[3px] top-[118px] h-[30px] w-[4px] rounded-l-[2px] bg-[#232325]" />
      <span aria-hidden="true" className="absolute -left-[3px] top-[178px] h-[62px] w-[4px] rounded-l-[2px] bg-[#232325]" />
      <span aria-hidden="true" className="absolute -left-[3px] top-[252px] h-[62px] w-[4px] rounded-l-[2px] bg-[#232325]" />
      <span aria-hidden="true" className="absolute -right-[3px] top-[206px] h-[96px] w-[4px] rounded-r-[2px] bg-[#232325]" />

      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[52px] bg-white">
        {/* status bar */}
        <div
          className="relative z-30 flex h-[50px] shrink-0 items-center justify-between px-[34px] pt-[6px]"
          style={{ background: chrome.bar }}
        >
          <span className="font-sans text-[16px] font-semibold tracking-[-0.01em]" style={{ color: ink, fontFamily: "system-ui, -apple-system, sans-serif" }}>
            9:41
          </span>
          <StatusIcons color={ink} />
        </div>
        {/* dynamic island */}
        <div aria-hidden="true" className="absolute left-1/2 top-[11px] z-40 h-[34px] w-[118px] -translate-x-1/2 rounded-full bg-black" />
        <div className="relative min-h-0 flex-1">{children}</div>
        {/* home indicator */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[8px] left-1/2 z-50 h-[5px] w-[136px] -translate-x-1/2 rounded-full"
          style={{ background: chrome.tone === "light" ? "rgba(255,255,255,.85)" : "rgba(0,0,0,.8)" }}
        />
      </div>
      {/* glass edge highlight */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[64px] ring-1 ring-white/10" />
    </div>
  );
}

/** A clean desktop browser window. Logical size 1280×820. */
export function BrowserFrame({ children, domain, className }: { children: ReactNode; domain: string; className?: string }) {
  return (
    <div
      className={cn("flex flex-col overflow-hidden rounded-[18px] bg-white", className)}
      style={{
        width: DESKTOP.w,
        height: DESKTOP.h,
        boxShadow: "0 0 0 1px rgba(20,12,6,.08), 0 2px 6px rgba(20,12,6,.08), 0 40px 90px -30px rgba(20,12,6,.45)",
      }}
    >
      <div className="flex h-[52px] shrink-0 items-center gap-4 border-b border-black/[0.06] bg-[#f6f3ee] px-5">
        <div className="flex gap-2" aria-hidden="true">
          <span className="size-[13px] rounded-full bg-[#ff5f57]" />
          <span className="size-[13px] rounded-full bg-[#febc2e]" />
          <span className="size-[13px] rounded-full bg-[#28c840]" />
        </div>
        <div className="flex flex-1 justify-center">
          <div className="flex h-[32px] w-[min(520px,60%)] items-center justify-center gap-2 rounded-[9px] bg-white text-[15px] text-black/65 shadow-[0_0_0_1px_rgba(0,0,0,.05)]">
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
              <rect x="1" y="6" width="10" height="7.5" rx="2" fill="currentColor" opacity=".6" />
              <path d="M3.2 6V4.4a2.8 2.8 0 0 1 5.6 0V6" stroke="currentColor" strokeWidth="1.5" opacity=".6" />
            </svg>
            <span className="truncate" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
              {domain}
            </span>
          </div>
        </div>
        <div className="w-[52px]" aria-hidden="true" />
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}
