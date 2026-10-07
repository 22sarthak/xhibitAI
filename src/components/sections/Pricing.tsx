import { motion } from "motion/react";
import { site, type Plan } from "../../../site.config";
import { track } from "../../lib/api";
import { ease } from "../../lib/motion";
import { usePersonalization } from "../../lib/personalization";
import { cn, inr } from "../../lib/utils";
import { waHref, waMessage } from "../../lib/whatsapp";
import { ButtonLink } from "../ui/Button";
import { Eyebrow } from "../ui/Eyebrow";
import { WhatsAppDisc } from "../ui/icons";
import { Reveal, RevealHeading } from "../ui/Reveal";

const { pricing, foundingOffer } = site;

function Check({ light }: { light?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className={cn("mt-1 size-4 shrink-0", light ? "text-ochre" : "text-sal")} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlanCard({ plan, index }: { plan: Plan; index: number }) {
  const { name } = usePersonalization();
  const dark = !!plan.highlight;
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease, delay: index * 0.1 }}
      className={cn(
        "relative flex flex-col rounded-[30px] p-7 sm:p-8",
        dark ? "bg-ink text-ivory shadow-[0_40px_80px_-30px_rgb(29_26_22/0.6)] lg:-my-4 lg:py-12" : "bg-linen ring-1 ring-ink/[0.08]",
      )}
      aria-labelledby={`plan-${plan.id}`}
    >
      {dark && (
        <span className="absolute -top-3.5 left-8 rounded-full bg-ochre px-3.5 py-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-ink">
          Most popular
        </span>
      )}
      <h3 id={`plan-${plan.id}`} className="font-display text-[1.9rem] leading-none tracking-[-0.02em]">
        {plan.name}
      </h3>
      <p className={cn("mt-3 min-h-[3rem]", dark ? "text-ivory/65" : "text-ink-soft")}>{plan.forWho}</p>

      {pricing.show ? (
        <div className="mt-6 flex items-baseline gap-2">
          {plan.prefix && <span className={cn("text-[0.9rem]", dark ? "text-ivory/60" : "text-ink-soft")}>{plan.prefix}</span>}
          <span className="tabular font-display text-[3.1rem] leading-none tracking-[-0.03em]">
            {pricing.currency}
            {inr(plan.price)}
          </span>
          <span className={cn("text-[0.875rem]", dark ? "text-ivory/60" : "text-ink-soft")}>{plan.period}</span>
        </div>
      ) : (
        <p className="mt-6 font-display text-[1.6rem]">Custom quote</p>
      )}
      <p className={cn("mt-3 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[0.8125rem] font-semibold", dark ? "bg-ivory/10" : "bg-sand")}>
        <span className="size-1.5 rounded-full bg-current opacity-70" />
        {plan.timeline}
      </p>

      <ul className="mt-7 grid gap-3 text-[0.95rem]">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-3">
            <Check light={dark} />
            <span className={dark ? "text-ivory/85" : ""}>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-9">
        <ButtonLink
          href={waHref(waMessage({ plan: plan.name, businessName: name }))}
          external
          variant={dark ? "light" : "primary"}
          size="lg"
          icon={<WhatsAppDisc className="-ml-3 size-9" />}
          className="w-full pl-3"
          onClick={() => track("whatsapp_click", { location: "pricing", plan: plan.id })}
        >
          Talk about {plan.name}
        </ButtonLink>
      </div>
    </motion.article>
  );
}

function FoundingOffer() {
  const left = foundingOffer.spots - foundingOffer.spotsTaken;
  if (!foundingOffer.enabled || left <= 0) return null;
  return (
    <Reveal className="mt-14">
      <div className="relative overflow-hidden rounded-[30px] bg-linear-to-br from-ochre-soft via-blush to-sand p-7 ring-1 ring-ink/[0.06] sm:p-10">
        <div aria-hidden="true" className="absolute -right-10 -top-10 size-56 rounded-full bg-linen/50 blur-2xl" />
        <div className="relative grid items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-clay-deep">Founding client offer</p>
            <h3 className="mt-3 font-display text-[clamp(1.7rem,1.3rem+1.5vw,2.6rem)] leading-[1.1] tracking-[-0.02em]">
              Be one of our first {foundingOffer.spots} clients in {site.brand.city} — get {foundingOffer.perk}.
            </h3>
            <p className="mt-3 max-w-[40rem] text-ink-soft">
              We're new, and we'd rather earn your trust than ask for it. All we ask is {foundingOffer.ask.replace(/^in return for /, "")}.
            </p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-[0.8125rem] font-semibold text-ink-soft">
              <span className="tabular font-display text-[1.6rem] text-ink">{left}</span> of {foundingOffer.spots} spots left
            </p>
            <div className="mt-3 flex gap-1.5" aria-hidden="true">
              {Array.from({ length: foundingOffer.spots }, (_, i) => (
                <span key={i} className={cn("h-2.5 flex-1 rounded-full", i < foundingOffer.spotsTaken ? "bg-ink" : "bg-linen ring-1 ring-ink/15")} />
              ))}
            </div>
            <ButtonLink
              href={waHref(`Hi ${site.brand.name}! I'd like one of your founding client spots.`)}
              external
              size="lg"
              icon={<WhatsAppDisc className="-ml-3 size-9" />}
              className="mt-6 w-full pl-3"
              onClick={() => track("whatsapp_click", { location: "founding_offer" })}
            >
              Claim a founding spot
            </ButtonLink>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function Pricing() {
  const care = pricing.carePlan;
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="section-y bg-sand/60">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow no="06">Pricing</Eyebrow>
            <RevealHeading id="pricing-title" text="Clear prices. *No surprises.*" className="mt-6 text-display" />
          </div>
          <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.1}>
            <p className="text-lead text-ink-soft">
              One-time setup with no hidden charges. {pricing.paymentTerms}
            </p>
          </Reveal>
        </div>

        <FoundingOffer />

        <div className="mt-14 grid gap-5 lg:grid-cols-3 lg:items-stretch lg:gap-6">
          {pricing.plans.map((p, i) => (
            <PlanCard key={p.id} plan={p} index={i} />
          ))}
        </div>

        <Reveal className="mt-6">
          <div className="grid items-center gap-6 rounded-[30px] bg-linen p-7 ring-1 ring-ink/[0.08] sm:p-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h3 className="font-display text-[1.6rem] leading-none">{care.name}</h3>
              {pricing.show && (
                <p className="mt-3 flex items-baseline gap-1.5">
                  <span className="tabular font-display text-[2.2rem] leading-none">
                    {pricing.currency}
                    {inr(care.price)}
                  </span>
                  <span className="text-ink-soft">{care.period}</span>
                </p>
              )}
              <p className="mt-2 text-[0.875rem] text-ink-soft">Optional. Cancel anytime.</p>
            </div>
            <ul className="grid gap-3 text-[0.95rem] sm:grid-cols-2 lg:col-span-8">
              {care.features.map((f) => (
                <li key={f} className="flex gap-3">
                  <Check />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <p className="mx-auto mt-10 max-w-[48rem] text-center text-ink-soft">{pricing.note}</p>
      </div>
    </section>
  );
}
