import { motion } from "motion/react";
import { Eye, Handshake, KeyRound, MapPin, MessageCircle } from "lucide-react";
import { site } from "../../../site.config";
import { ease } from "../../lib/motion";
import { initials } from "../../lib/utils";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal, RevealHeading } from "../ui/Reveal";

const { promises, brand } = site;

const cards = [
  promises.inPersonVisits && {
    icon: MapPin,
    title: "We come to you",
    text: `Anywhere in ${brand.city} — your shop, clinic or school. Chai's on us.`,
  },
  promises.freeDesignPreview && {
    icon: Eye,
    title: "See it before you pay",
    text: "We design your homepage first. Like it? Then we talk money.",
  },
  promises.whatsappReplyHours > 0 && {
    icon: MessageCircle,
    title: `Replies within ${promises.whatsappReplyHours} hours`,
    text: `On WhatsApp, ${promises.workingHours}, every working day.`,
  },
  {
    icon: Handshake,
    title: "No tech talk",
    text: "Plain language, written quotes and clear dates. You'll always know what you're paying for.",
  },
  {
    icon: KeyRound,
    title: "It's yours",
    text: "Your domain and website are registered in your business's name. No lock-ins, ever.",
  },
].filter(Boolean) as { icon: typeof MapPin; title: string; text: string }[];

export function WhyUs() {
  return (
    <section id="about" aria-labelledby="about-title" className="section-y">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Eyebrow no="07">Why Xhibit</Eyebrow>
            <RevealHeading id="about-title" text="A Ranchi team that *picks up the phone*." className="mt-6 text-display" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-16">
            <Reveal>
              <p className="font-display text-[clamp(1.3rem,1.05rem+0.9vw,1.75rem)] leading-[1.4] tracking-[-0.01em] text-ink">
                We started {brand.name} because some of the best businesses in {brand.city} were invisible online — and the options were either too
                technical or too expensive.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-lead text-ink-soft">
                So we keep it simple. We sit with you, understand how your business really works, and build something you're proud to share. Then we
                stay — because a website is never really “finished”.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.85, ease, delay: i * 0.07 }}
              className="rounded-[26px] bg-linen p-6 ring-1 ring-ink/[0.07]"
            >
              <span className="grid size-11 place-items-center rounded-2xl bg-sand text-clay-deep">
                <c.icon className="size-5" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-sans text-[1.0625rem] font-bold">{c.title}</h3>
              <p className="mt-2 text-[0.95rem] text-ink-soft">{c.text}</p>
            </motion.div>
          ))}
        </div>

        {site.founders.length > 0 ? (
          <div className="mt-16">
            <p className="eyebrow">The people you'll work with</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {site.founders.map((f) => (
                <Reveal key={f.name}>
                  <figure className="flex items-center gap-5 rounded-[26px] bg-linen p-5 ring-1 ring-ink/[0.07]">
                    {f.photo ? (
                      <img src={f.photo} alt={f.name} className="size-20 shrink-0 rounded-2xl object-cover" loading="lazy" />
                    ) : (
                      <span className="grid size-20 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-clay to-ochre font-display text-[1.8rem] text-ivory">
                        {initials(f.name)}
                      </span>
                    )}
                    <figcaption>
                      <p className="font-display text-[1.35rem] leading-tight">{f.name}</p>
                      <p className="text-[0.875rem] font-semibold text-clay-deep">{f.role}</p>
                      {f.note && <p className="mt-1 text-[0.875rem] text-ink-soft">{f.note}</p>}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        ) : (
          import.meta.env.DEV && (
            <div className="mt-16 rounded-[26px] border-2 border-dashed border-ink/15 p-6 text-[0.95rem] text-ink-soft">
              <b className="text-ink">Dev note:</b> add your founders (name, role and a real photo) in <code>site.config.ts</code> → <code>founders</code>.
              Real faces are the strongest trust signal you have. This box doesn't appear on the live site.
            </div>
          )
        )}
      </div>
    </section>
  );
}
