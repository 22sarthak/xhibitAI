import { site } from "../../site.config";

export const waHref = (text: string) => `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(text)}`;
export const telHref = () => `tel:${site.contact.phone}`;
export const mailHref = (subject = "Website enquiry") =>
  `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}`;

interface MessageContext {
  /** e.g. "Restaurant" */
  kind?: string;
  businessName?: string;
  plan?: string;
  topic?: string;
}

/**
 * Builds the pre-filled WhatsApp message. Context-aware so the very first
 * message already tells you what the person was looking at.
 */
export function waMessage(ctx: MessageContext = {}) {
  const brand = site.brand.name;
  const name = ctx.businessName?.trim();
  const kind = ctx.kind?.toLowerCase();

  if (ctx.plan) {
    return `Hi ${brand}! I'm interested in the ${ctx.plan} package${name ? ` for ${name}` : ""}. Can we talk?`;
  }
  if (kind) {
    return name
      ? `Hi ${brand}! I run ${name}, a ${kind} in ${site.brand.city}. I saw your ${kind} demo and I'd like a website like that.`
      : `Hi ${brand}! I saw your ${kind} demo and I'd like something like that for my ${kind}.`;
  }
  if (ctx.topic) {
    return `Hi ${brand}! I'd like to know more about ${ctx.topic}${name ? ` for ${name}` : ""}.`;
  }
  return name
    ? `Hi ${brand}! I run ${name} in ${site.brand.city} and I'd like to get it online.`
    : `Hi ${brand}! I'd like to know more about getting my business online.`;
}

/** True while the placeholder number in site.config.ts hasn't been replaced. */
export const contactIsPlaceholder = /^91?0{10}$/.test(site.contact.whatsapp);
