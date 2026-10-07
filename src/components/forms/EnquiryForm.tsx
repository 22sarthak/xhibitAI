import { AnimatePresence, motion } from "motion/react";
import { LoaderCircle } from "lucide-react";
import { useId, useRef, useState, type FormEvent } from "react";
import { site } from "../../../site.config";
import { industries, type IndustrySlug } from "../../content/industries";
import { SuccessTick } from "../../demos/kit";
import { submitEnquiry, track } from "../../lib/api";
import { ease } from "../../lib/motion";
import { usePersonalization } from "../../lib/personalization";
import { cn } from "../../lib/utils";
import { waHref } from "../../lib/whatsapp";
import { TLink } from "../../lib/transition";
import { Button, ButtonLink } from "../ui/Button";
import { WhatsAppDisc } from "../ui/icons";

type Errors = Partial<Record<"name" | "phone" | "message", string>>;

/** "+91 98765-43210" / "098765 43210" → "9876543210", or null if not a valid Indian mobile. */
export function normalisePhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

const fieldCls =
  "h-14 w-full rounded-2xl bg-white px-4 text-[1rem] text-ink ring-1 ring-ink/12 transition-shadow placeholder:text-ink-mute/70 focus:outline-none focus:ring-2 focus:ring-clay aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[#c2410c]";

export function EnquiryForm({ defaultType, source }: { defaultType?: IndustrySlug; source: string }) {
  const uid = useId();
  const { name: businessName, setName: setBusinessName } = usePersonalization();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState<string>(defaultType ?? "");
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState<"whatsapp" | "call">("whatsapp");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const kind = industries.find((i) => i.slug === type)?.kind.toLowerCase();
  const fallbackText = [
    `Hi ${site.brand.name}! I'm ${name.trim() || "interested in a website"}`,
    businessName.trim() ? ` from ${businessName.trim()}` : "",
    kind ? ` (${kind})` : "",
    ".",
    message.trim() ? ` ${message.trim()}` : "",
    phone.trim() ? ` You can reach me on ${phone.trim()}.` : "",
  ].join("");

  const validate = () => {
    const e: Errors = {};
    if (name.trim().length < 2) e.name = "Please tell us your name.";
    if (!normalisePhone(phone)) e.phone = "Please enter a 10-digit mobile number.";
    if (message.length > 1000) e.message = "Please keep it under 1,000 characters.";
    setErrors(e);
    return e;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    const res = await submitEnquiry({
      name: name.trim(),
      phone: normalisePhone(phone)!,
      business_name: businessName.trim() || undefined,
      business_type: type || undefined,
      message: message.trim() || undefined,
      preferred_contact: contact,
      source_page: source,
      company_website: honeypot || undefined,
    });
    if (res.ok) {
      setStatus("sent");
      track("form_submit", { source, industry: type });
    } else {
      setStatus("error");
      setServerError(res.error);
      if (res.field === "phone") setErrors({ phone: res.error });
    }
  };

  const firstName = name.trim().split(" ")[0];

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="flex min-h-[30rem] flex-col items-center justify-center text-center"
            role="status"
          >
            <SuccessTick color="#2e4b3c" size={76} />
            <h3 className="mt-6 font-display text-[2rem] leading-tight tracking-[-0.02em]">Thank you{firstName ? `, ${firstName}` : ""}!</h3>
            <p className="mt-3 max-w-[26rem] text-ink-soft">
              We've got your details and we'll {contact === "whatsapp" ? "WhatsApp" : "call"} you
              {site.promises.whatsappReplyHours ? ` within ${site.promises.whatsappReplyHours} hours` : " soon"} ({site.promises.workingHours}).
            </p>
            <ButtonLink href={waHref(fallbackText)} external variant="secondary" className="mt-8 pl-2" icon={<WhatsAppDisc className="-ml-1 size-8" />}>
              Can't wait? Chat now
            </ButtonLink>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid gap-5"
            aria-describedby={`${uid}-privacy`}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor={`${uid}-name`} className="mb-2 block text-[0.875rem] font-semibold">
                  Your name
                </label>
                <input
                  id={`${uid}-name`}
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  placeholder="e.g. Rakesh Kumar"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? `${uid}-name-err` : undefined}
                  className={fieldCls}
                />
                {errors.name && (
                  <p id={`${uid}-name-err`} className="mt-1.5 text-[0.8125rem] font-medium text-[#b42d08]">
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor={`${uid}-phone`} className="mb-2 block text-[0.875rem] font-semibold">
                  Mobile / WhatsApp number
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[1rem] text-ink-soft">+91</span>
                  <input
                    id={`${uid}-phone`}
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel-national"
                    placeholder="98765 43210"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? `${uid}-phone-err` : undefined}
                    className={cn(fieldCls, "pl-14")}
                  />
                </div>
                {errors.phone && (
                  <p id={`${uid}-phone-err`} className="mt-1.5 text-[0.8125rem] font-medium text-[#b42d08]">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor={`${uid}-biz`} className="mb-2 block text-[0.875rem] font-semibold">
                Business name <span className="font-normal text-ink-mute">(optional)</span>
              </label>
              <input
                id={`${uid}-biz`}
                name="business_name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                autoComplete="organization"
                placeholder="e.g. Sharma Sweets"
                className={fieldCls}
              />
            </div>

            <fieldset>
              <legend className="mb-2 text-[0.875rem] font-semibold">What kind of business?</legend>
              <div className="flex flex-wrap gap-2">
                {[...industries.map((i) => ({ value: i.slug as string, label: i.kind })), { value: "other", label: "Something else" }].map((o) => (
                  <label key={o.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="business_type"
                      value={o.value}
                      checked={type === o.value}
                      onChange={() => setType(o.value)}
                      className="peer sr-only"
                    />
                    <span className="block rounded-full bg-white px-3.5 py-2 text-[0.875rem] font-medium ring-1 ring-ink/12 transition-colors peer-checked:bg-ink peer-checked:text-ivory peer-checked:ring-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-clay">
                      {o.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor={`${uid}-msg`} className="mb-2 block text-[0.875rem] font-semibold">
                Anything you'd like to tell us? <span className="font-normal text-ink-mute">(optional)</span>
              </label>
              <textarea
                id={`${uid}-msg`}
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="e.g. I want customers to see our menu and book tables online."
                aria-invalid={!!errors.message}
                className={cn(fieldCls, "h-auto resize-none py-3.5 leading-relaxed")}
              />
              {errors.message && <p className="mt-1.5 text-[0.8125rem] font-medium text-[#b42d08]">{errors.message}</p>}
            </div>

            <fieldset>
              <legend className="mb-2 text-[0.875rem] font-semibold">How should we reach you?</legend>
              <div className="inline-flex rounded-full bg-white p-1 ring-1 ring-ink/12">
                {(["whatsapp", "call"] as const).map((c) => (
                  <label key={c} className="relative cursor-pointer">
                    <input type="radio" name="preferred_contact" value={c} checked={contact === c} onChange={() => setContact(c)} className="peer sr-only" />
                    <span className="relative z-10 block rounded-full px-5 py-2 text-[0.875rem] font-semibold transition-colors peer-checked:text-ivory peer-focus-visible:outline-2 peer-focus-visible:outline-clay">
                      {c === "whatsapp" ? "WhatsApp" : "Phone call"}
                    </span>
                    {contact === c && (
                      <motion.span layoutId={`${uid}-contact`} className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                    )}
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Honeypot — hidden from people, irresistible to bots */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor={`${uid}-website`}>Website</label>
              <input id={`${uid}-website`} tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            </div>

            <AnimatePresence>
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                  role="alert"
                >
                  <div className="rounded-2xl bg-[#fdeee6] p-4 text-[0.9rem] text-[#7a2a12]">
                    <p className="font-semibold">{serverError} Your details are safe — send them on WhatsApp instead:</p>
                    <ButtonLink
                      href={waHref(fallbackText)}
                      external
                      size="sm"
                      variant="whatsapp"
                      className="mt-3"
                      onClick={() => track("whatsapp_click", { location: "form_fallback" })}
                    >
                      Send on WhatsApp
                    </ButtonLink>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center">
              <Button type="submit" size="lg" arrow={status !== "sending"} disabled={status === "sending"} className="w-full sm:w-auto">
                {status === "sending" ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> Sending…
                  </span>
                ) : (
                  "Send enquiry"
                )}
              </Button>
              <p id={`${uid}-privacy`} className="text-[0.8125rem] leading-snug text-ink-soft">
                By sending, you agree that {site.brand.name} may contact you about this enquiry. We never share your number.{" "}
                <TLink to="/privacy" className="underline underline-offset-2 hover:text-ink">
                  Privacy policy
                </TLink>
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
