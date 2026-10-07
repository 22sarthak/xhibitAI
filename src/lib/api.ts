import { site } from "../../site.config";

const API_BASE = ((import.meta.env.VITE_API_URL as string | undefined) ?? "").replace(/\/$/, "");
export const apiUrl = (p: string) => `${API_BASE}/api${p}`;

/* ── Campaign tracking (utm_*) — remembered for the visit, sent with enquiries ── */
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const;

export function captureUtm() {
  try {
    const params = new URLSearchParams(window.location.search);
    const found = UTM_KEYS.filter((k) => params.get(k));
    if (found.length) {
      const utm = Object.fromEntries(found.map((k) => [k, params.get(k)!.slice(0, 80)]));
      sessionStorage.setItem("xh:utm", JSON.stringify(utm));
    }
  } catch {
    /* storage can be blocked — that's fine */
  }
}

function readUtm(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem("xh:utm") ?? "{}");
  } catch {
    return {};
  }
}

/* ── Lightweight first-party events: WhatsApp/call taps, demo views ── */
const TRACK_IN_DEV = import.meta.env.VITE_TRACK_DEV === "1";

export function track(type: string, data: Record<string, unknown> = {}) {
  if (!site.analytics.trackEvents) return;
  if (import.meta.env.DEV && !TRACK_IN_DEV) return;
  try {
    // text/plain keeps sendBeacon simple (no CORS preflight); the API parses it as JSON.
    const body = JSON.stringify({ type, path: window.location.pathname, data, ...readUtm() });
    const blob = new Blob([body], { type: "text/plain" });
    if (!navigator.sendBeacon?.(apiUrl("/events"), blob)) {
      void fetch(apiUrl("/events"), { method: "POST", body, keepalive: true }).catch(() => {});
    }
  } catch {
    /* never let analytics break the page */
  }
}

/* ── Enquiry form ── */
export interface EnquiryInput {
  name: string;
  phone: string;
  business_name?: string;
  business_type?: string;
  message?: string;
  preferred_contact: "whatsapp" | "call";
  source_page: string;
  /** Honeypot: real people never see or fill this. */
  company_website?: string;
}

export type EnquiryResult = { ok: true; id: string } | { ok: false; error: string; field?: string };

export async function submitEnquiry(input: EnquiryInput): Promise<EnquiryResult> {
  try {
    const res = await fetch(apiUrl("/enquiries"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...input, ...readUtm() }),
    });
    if (res.ok) {
      const json = (await res.json()) as { id: string };
      return { ok: true, id: json.id };
    }
    if (res.status === 422) {
      const json = (await res.json().catch(() => null)) as { detail?: Array<{ loc?: string[]; msg?: string }> } | null;
      const first = json?.detail?.[0];
      const field = first?.loc?.[first.loc.length - 1];
      return {
        ok: false,
        field,
        error: field === "phone" ? "Please enter a valid 10-digit mobile number." : "Please check the highlighted details.",
      };
    }
    if (res.status === 429) {
      return { ok: false, error: "Too many attempts from this connection. Please try again in a few minutes." };
    }
    return { ok: false, error: "Something went wrong on our side." };
  } catch {
    return { ok: false, error: "We couldn't reach our server." };
  }
}
