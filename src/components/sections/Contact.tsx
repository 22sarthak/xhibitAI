import { motion } from "motion/react";
import { ArrowUpRight, CalendarDays, MapPin, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { site } from "../../../site.config";
import type { IndustrySlug } from "../../content/industries";
import { track } from "../../lib/api";
import { ease } from "../../lib/motion";
import { usePersonalization } from "../../lib/personalization";
import { cn } from "../../lib/utils";
import { telHref, waHref, waMessage } from "../../lib/whatsapp";
import { EnquiryForm } from "../forms/EnquiryForm";
import { Eyebrow } from "../ui/Eyebrow";
import { WhatsAppIcon } from "../ui/icons";
import { Reveal, RevealHeading } from "../ui/Reveal";

function ContactCard({
  href,
  icon,
  title,
  text,
  external,
  accent,
  onClick,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  text: string;
  external?: boolean;
  accent?: boolean;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "group flex items-center gap-4 rounded-[22px] p-4 pr-5 ring-1 transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-soft",
        accent ? "bg-ink text-ivory ring-ink" : "bg-linen/80 ring-ink/[0.08] backdrop-blur hover:bg-linen",
      )}
    >
      <span className={cn("grid size-12 shrink-0 place-items-center rounded-2xl", accent ? "bg-wa text-white" : "bg-sand text-clay-deep")}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-sans text-[1rem] font-bold">{title}</span>
        <span className={cn("block truncate text-[0.875rem]", accent ? "text-ivory/65" : "text-ink-soft")}>{text}</span>
      </span>
      <ArrowUpRight className="size-5 shrink-0 opacity-50 transition-[transform,opacity] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden="true" />
    </a>
  );
}

export function Contact({ defaultType, source = "home" }: { defaultType?: IndustrySlug; source?: string }) {
  const { name } = usePersonalization();
  const { contact, promises, brand } = site;
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative px-2 pb-2 sm:px-3 sm:pb-3">
      <div className="grain relative overflow-hidden rounded-[28px] sm:rounded-[36px] lg:rounded-[44px]">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-sand" />
        <div aria-hidden="true" className="absolute -right-[15%] -top-[25%] -z-10 h-[80%] w-[70%] rounded-full bg-[radial-gradient(closest-side,#f5c79d,transparent)]" />
        <div aria-hidden="true" className="absolute -bottom-[30%] -left-[10%] -z-10 h-[80%] w-[60%] rounded-full bg-[radial-gradient(closest-side,#f4d9cc,transparent)]" />

        <div className="container-x section-y grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Eyebrow no="09">Contact</Eyebrow>
            <RevealHeading id="contact-title" text="Let's put your business *online*." className="mt-6 text-display" />
            <Reveal delay={0.1}>
              <p className="mt-6 text-lead text-ink-soft">
                Tell us a little about your business.
                {promises.whatsappReplyHours ? ` We'll reply on WhatsApp within ${promises.whatsappReplyHours} hours (${promises.workingHours}).` : ""}
              </p>
            </Reveal>
            <Reveal delay={0.15} className="mt-10 grid gap-3">
              <ContactCard
                accent
                href={waHref(waMessage({ businessName: name }))}
                external
                icon={<WhatsAppIcon className="size-6" />}
                title="Chat on WhatsApp"
                text={`Fastest way to reach us · ${contact.phoneDisplay}`}
                onClick={() => track("whatsapp_click", { location: `contact_${source}` })}
              />
              <ContactCard
                href={telHref()}
                icon={<Phone className="size-5" strokeWidth={1.8} />}
                title="Call us"
                text={`${contact.phoneDisplay} · ${contact.hours}`}
                onClick={() => track("call_click", { location: `contact_${source}` })}
              />
              <ContactCard
                href={contact.bookingUrl}
                external
                icon={<CalendarDays className="size-5" strokeWidth={1.8} />}
                title="Book a free 20-minute call"
                text="Pick a time that suits you"
                onClick={() => track("booking_click", { location: `contact_${source}` })}
              />
              {promises.inPersonVisits && (
                <ContactCard
                  href={contact.mapsUrl}
                  external
                  icon={<MapPin className="size-5" strokeWidth={1.8} />}
                  title="We'll come to you"
                  text={`Anywhere in ${brand.city} · based in ${contact.address.split(",")[0]}`}
                />
              )}
            </Reveal>
          </div>

          <motion.div
            className="lg:col-span-7 lg:col-start-6 xl:col-span-6 xl:col-start-7"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, ease }}
          >
            <div className="rounded-[30px] bg-linen/95 p-6 shadow-lift ring-1 ring-ink/[0.06] backdrop-blur sm:p-9">
              <h3 className="font-display text-[1.75rem] leading-tight tracking-[-0.02em]">Send us a message</h3>
              <p className="mb-7 mt-1.5 text-ink-soft">Takes 30 seconds. No spam, ever.</p>
              <EnquiryForm defaultType={defaultType} source={source} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
