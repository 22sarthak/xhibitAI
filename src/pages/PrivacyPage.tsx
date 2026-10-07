import type { ReactNode } from "react";
import { site } from "../../site.config";
import { Eyebrow } from "../components/ui/Eyebrow";
import { useSeo } from "../lib/seo";
import { useRouteReady } from "../lib/transition";
import { mailHref } from "../lib/whatsapp";

const UPDATED = "2 October 2026";

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line py-8">
      <h2 className="font-display text-[1.6rem] leading-tight tracking-[-0.01em]">{title}</h2>
      <div className="mt-3 grid gap-3 text-ink-soft [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-2 [&_li]:ml-5 [&_li]:list-disc">{children}</div>
    </section>
  );
}

/**
 * A plain-language privacy notice for the enquiry form, written with India's
 * Digital Personal Data Protection Act, 2023 in mind. Have a lawyer review it
 * before you rely on it.
 */
export default function PrivacyPage() {
  useRouteReady();
  useSeo({
    title: `Privacy policy — ${site.brand.name}`,
    description: `How ${site.brand.name} collects, uses and protects the details you share with us.`,
    path: "/privacy",
  });
  const { brand, contact } = site;

  return (
    <article className="container-x max-w-[52rem] pb-24 pt-36">
      <Eyebrow>Privacy</Eyebrow>
      <h1 className="mt-6 text-display">Your details, handled with care.</h1>
      <p className="mt-5 text-lead text-ink-soft">
        In plain words: we only collect what we need to reply to you, we never sell it, and you can ask us to delete it anytime. Last updated {UPDATED}.
      </p>
      {import.meta.env.DEV && (
        <p className="mt-6 rounded-2xl border-2 border-dashed border-ink/15 p-4 text-[0.9rem] text-ink-soft">
          <b className="text-ink">Dev note:</b> this is a sensible starting template, not legal advice. Have it reviewed before launch. (This note doesn't show on the live site.)
        </p>
      )}

      <div className="mt-10">
        <Block title="Who we are">
          <p>
            {brand.name} ("we", "us") builds websites, apps and automation for businesses, based in {brand.city}, {brand.region}, India. For anything about your
            data, write to <a href={mailHref("Privacy request")}>{contact.email}</a>.
          </p>
        </Block>
        <Block title="What we collect">
          <ul>
            <li>
              <b className="text-ink">When you send an enquiry:</b> your name, mobile number, business name and type, your message, and how you'd like us to
              contact you.
            </li>
            <li>
              <b className="text-ink">When you use the site:</b> anonymous counts of things like WhatsApp-button taps and which demos are viewed, the page you came
              from, and campaign tags in the link (utm_*). We don't use advertising cookies or trackers.
            </li>
            <li>
              <b className="text-ink">In your browser only:</b> if you type your business name into a demo, it's kept in your browser's session storage so the
              demos can show it. It isn't sent to us unless you submit the form.
            </li>
          </ul>
        </Block>
        <Block title="Why we use it">
          <p>
            Only to reply to your enquiry, prepare a quote or design preview, and keep in touch about work you've asked us about. By submitting the form you agree
            to us contacting you for this purpose. We never sell or rent your details, and we don't share them except with service providers who help us run this
            website (such as hosting), under strict confidentiality.
          </p>
        </Block>
        <Block title="How long we keep it">
          <p>
            Enquiries are kept for up to 24 months after our last conversation, then deleted — or sooner if you ask. Anonymous usage counts may be kept longer
            because they can't identify you.
          </p>
        </Block>
        <Block title="Your rights">
          <p>You can ask us to show you the details we hold, correct them, or delete them — and you can withdraw your consent to being contacted at any time.</p>
          <p>
            Just email <a href={mailHref("Privacy request")}>{contact.email}</a> or message us on WhatsApp at {contact.phoneDisplay}. We'll respond within 7 days. If
            you're not satisfied, you may also approach the Data Protection Board of India.
          </p>
        </Block>
        <Block title="Keeping it safe">
          <p>
            Data is sent over HTTPS, stored on access-controlled servers, and only our team can see it. No system is perfect, but we take reasonable,
            industry-standard precautions and will tell you promptly if something ever goes wrong.
          </p>
        </Block>
      </div>
    </article>
  );
}
