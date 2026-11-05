import { motion } from "motion/react";
import { Eye, KeyRound, Lightbulb, MessageCircle, ScrollText } from "lucide-react";
import { site } from "../../../site.config";
import { ease } from "../../lib/motion";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal, RevealHeading } from "../ui/Reveal";

const { promises, brand } = site;

/** The approved brand promises, plus the WhatsApp reply time. Each card has its own hue. */
const cards = [
  { icon: Eye, title: "See it before you pay", text: "We design your key screens first. Like them? Then we talk money.", tint: "bg-cobalt-soft text-cobalt" },
  { icon: Lightbulb, title: "Built around your idea", text: "No templates forced on you. We shape the product around how you work.", tint: "bg-ochre-soft text-[#8a5a00]" },
  { icon: ScrollText, title: "Plain talk, written quotes", text: "Clear scope, clear dates and a written quote. You always know what you're paying for.", tint: "bg-sal-soft text-sal" },
  { icon: KeyRound, title: "Yours to keep", text: "Your domain, code and data are registered in your name. No lock-ins, ever.", tint: "bg-violet-soft text-violet" },
  promises.whatsappReplyHours > 0 && {
    icon: MessageCircle,
    title: `Replies within ${promises.whatsappReplyHours} hours`,
    text: `On WhatsApp, ${promises.workingHours}, every working day.`,
    tint: "bg-rose-soft text-rose-deep",
  },
].filter(Boolean) as { icon: typeof Eye; title: string; text: string; tint: string }[];

export function WhyUs() {
  return (
    <section id="about" aria-labelledby="about-title" className="section-y">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Eyebrow no="07">Why Xhibit</Eyebrow>
            <RevealHeading id="about-title" text="A small team that *picks up the phone*." className="mt-6 text-display" emClass="italic text-cobalt" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-16">
            <Reveal>
              <p className="font-display text-[clamp(1.35rem,1.05rem+1vw,1.85rem)] leading-[1.38] text-ink">{brand.vision}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-lead text-ink-soft">{brand.mission}</p>
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
              className="rounded-[22px] bg-linen p-6 ring-1 ring-ink/[0.07]"
            >
              <span className={`grid size-11 place-items-center rounded-xl ${c.tint}`}>
                <c.icon className="size-5" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-sans text-[1.0625rem] font-bold">{c.title}</h3>
              <p className="mt-2 text-[0.95rem] text-ink-soft">{c.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
