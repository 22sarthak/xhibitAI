import { site } from "../../../site.config";
import { faqs } from "../../content/home";
import { track } from "../../lib/api";
import { usePersonalization } from "../../lib/personalization";
import { waHref, waMessage } from "../../lib/whatsapp";
import { Accordion } from "../ui/Accordion";
import { ButtonLink } from "../ui/Button";
import { Eyebrow } from "../ui/Eyebrow";
import { WhatsAppDisc } from "../ui/icons";
import { Reveal, RevealHeading } from "../ui/Reveal";

const faqJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export function FAQ() {
  const { name } = usePersonalization();
  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Eyebrow no="08">Questions</Eyebrow>
            <RevealHeading id="faq-title" text="Questions owners *ask us*." className="mt-6 text-display" />
            <Reveal delay={0.1}>
              <div className="mt-8 rounded-[26px] bg-sand p-6">
                <p className="font-sans text-[1.0625rem] font-bold">Still unsure about something?</p>
                <p className="mt-1.5 text-[0.95rem] text-ink-soft">
                  Ask us on WhatsApp — no question is too basic.
                  {site.promises.whatsappReplyHours ? ` We reply within ${site.promises.whatsappReplyHours} hours.` : ""}
                </p>
                <ButtonLink
                  href={waHref(waMessage({ businessName: name, topic: "your services" }))}
                  external
                  className="mt-5 pl-2"
                  icon={<WhatsAppDisc className="-ml-1 size-8" />}
                  onClick={() => track("whatsapp_click", { location: "faq" })}
                >
                  Ask a question
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
        <Reveal className="lg:col-span-7 lg:col-start-6">
          <Accordion items={faqs} />
        </Reveal>
      </div>
    </section>
  );
}
