import { useState } from "react";
import { contactIsPlaceholder } from "../../lib/whatsapp";

/** Development-only reminder: the contact details are still placeholders. */
export function DevNotice() {
  const [dismissed, setDismissed] = useState(false);
  if (!import.meta.env.DEV || !contactIsPlaceholder || dismissed || navigator.webdriver) return null;
  return (
    <div className="fixed bottom-4 left-4 z-30 max-w-[19rem] rounded-2xl bg-ink p-4 pr-10 text-[0.8125rem] leading-snug text-ivory shadow-lift">
      <p className="font-semibold">Dev note: placeholder contact details</p>
      <p className="mt-1 text-ivory/70">
        Add your real phone, WhatsApp and booking link in <code className="rounded bg-ivory/10 px-1">site.config.ts</code>. This note only
        shows in development.
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="absolute right-2 top-2 grid size-7 place-items-center rounded-full text-ivory/60 hover:bg-ivory/10"
      >
        ×
      </button>
    </div>
  );
}
