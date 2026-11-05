import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export const PHONE = { w: 414, h: 868, screenW: 390 } as const;
export const DESKTOP = { w: 1280, h: 820 } as const;
/** MacBook-style laptop: 1316 × 822 screen inside a 1360-wide lid, on a 1440-wide base. */
export const LAPTOP = { w: 1440, h: 912 } as const;

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

function BrowserBar({ domain, compact }: { domain: string; compact?: boolean }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-4 border-b border-black/[0.07] bg-[#f4f4f2] px-5",
        compact ? "h-[40px]" : "h-[52px]",
      )}
    >
      <div className="flex gap-2" aria-hidden="true">
        <span className="size-[12px] rounded-full bg-[#ff5f57]" />
        <span className="size-[12px] rounded-full bg-[#febc2e]" />
        <span className="size-[12px] rounded-full bg-[#28c840]" />
      </div>
      <div className="flex flex-1 justify-center">
        <div className="flex h-[26px] w-[min(460px,56%)] items-center justify-center gap-2 rounded-[7px] bg-white text-[13px] text-black/60 shadow-[0_0_0_1px_rgba(0,0,0,.06)]">
          <svg width="10" height="12" viewBox="0 0 12 14" fill="none" aria-hidden="true">
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
  );
}

/** A MacBook drawn in CSS: aluminium-edged lid with a notch, a browser window on screen, and the base. */
export function LaptopFrame({ children, domain, className }: { children: ReactNode; domain: string; className?: string }) {
  return (
    <div className={cn("relative", className)} style={{ width: LAPTOP.w, height: LAPTOP.h }}>
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 rounded-t-[36px] rounded-b-[12px] bg-[#0b0b0d] p-[22px] pb-[34px]"
        style={{ width: 1360, boxShadow: "inset 0 0 0 2px #2b2b30, 0 0 0 2px #c3c5ca, 0 0 0 3px #9a9ca2" }}
      >
        <div aria-hidden="true" className="absolute left-1/2 top-[22px] z-20 h-[24px] w-[160px] -translate-x-1/2 rounded-b-[12px] bg-[#0b0b0d]">
          <span className="absolute left-1/2 top-[8px] size-[8px] -translate-x-1/2 rounded-full bg-[#1d2333] ring-1 ring-[#2f3446]" />
        </div>
        <div className="relative flex flex-col overflow-hidden rounded-[8px] bg-white" style={{ height: 822 }}>
          {/* macOS menu bar: the notch sits inside it, as on a real MacBook */}
          <div
            className="flex h-[28px] shrink-0 items-center justify-between bg-[#ececee] px-5 text-[13px] text-black/80"
            style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" }}
            aria-hidden="true"
          >
            <span className="flex items-center gap-5">
              <svg width="13" height="15" viewBox="0 0 17 20" fill="currentColor">
                <path d="M14.1 10.6c0-2.5 2-3.7 2.1-3.8-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.8C3.8 5 2.2 6 1.4 7.6c-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.7-1.1-2.7-4.2zM11.6 3.1c.7-.8 1.2-2 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.4z" />
              </svg>
              <b className="font-semibold">Safari</b>
              <span>File</span>
              <span>Edit</span>
              <span>View</span>
              <span>History</span>
            </span>
            <span className="flex items-center gap-4">
              <span>Fri 6 Nov</span>
              <span>9:41 AM</span>
            </span>
          </div>
          <BrowserBar domain={domain} compact />
          <div className="relative min-h-0 flex-1">{children}</div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-[8px] h-[26px]">
        <div
          className="absolute inset-0 rounded-b-[30px] rounded-t-[3px]"
          style={{ background: "linear-gradient(180deg, #eceef1 0%, #d3d5da 38%, #a8abb1 100%)" }}
        />
        <div className="absolute left-1/2 top-0 h-[10px] w-[220px] -translate-x-1/2 rounded-b-[12px] bg-[#b2b4ba]" />
      </div>
      <div aria-hidden="true" className="absolute inset-x-[90px] bottom-0 h-[14px] rounded-[50%] bg-black/25 blur-[10px]" />
    </div>
  );
}
