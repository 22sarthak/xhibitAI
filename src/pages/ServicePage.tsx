import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { site } from "../../site.config";
import { DemoDevice } from "../components/device/DemoDevice";
import { Contact } from "../components/sections/Contact";
import { LiveChat, LiveNotifications } from "../components/sections/LiveVisuals";
import { Accordion } from "../components/ui/Accordion";
import { ButtonLink } from "../components/ui/Button";
import { Eyebrow } from "../components/ui/Eyebrow";
import { WhatsAppDisc } from "../components/ui/icons";
import { Reveal, RevealHeading } from "../components/ui/Reveal";
import { steps } from "../content/home";
import { curtainFor, industryBySlug } from "../content/industries";
import { curtainForService, serviceBySlug, services, type Service } from "../content/services";
import { demoSpec } from "../content/showcase";
import { prefetchDemo } from "../demos/registry";
import { track } from "../lib/api";
import { useMediaQuery } from "../lib/hooks";
import { ease } from "../lib/motion";
import { usePersonalization } from "../lib/personalization";
import { useSeo } from "../lib/seo";
import { useSmoothScroll } from "../lib/smooth-scroll";
import { HOME_CURTAIN, TLink, useRouteReady } from "../lib/transition";
import { waHref, waMessage } from "../lib/whatsapp";
import NotFound from "./NotFound";

export default function ServicePage() {
  const { slug } = useParams();
  const service = serviceBySlug(slug);
  if (!service) return <NotFound />;
  return <ServiceView key={service.slug} service={service} />;
}

const promises = [
  "See your design before you pay",
  "A written quote within a day",
  "Live in days, not months",
  "Your domain, code and data in your name",
  `Replies on WhatsApp within ${site.promises.whatsappReplyHours} hours`,
];

function ServiceView({ service }: { service: Service }) {
  useRouteReady();
  useSeo({ title: service.seoTitle, description: service.seoDescription, path: `/services/${service.slug}`, image: `/og/service-${service.slug}.jpg` });
  const { name } = usePersonalization();
  const { scrollTo } = useSmoothScroll();
  const wa = waHref(waMessage({ topic: service.topic, businessName: name }));
  const others = services.filter((s) => s.slug !== service.slug);

  useEffect(() => {
    track("service_view", { service: service.slug });
  }, [service.slug]);

  return (
    <article>
      {/* ── Hero with live devices ── */}
      <section aria-labelledby="service-title" className="relative p-2 sm:p-3">
        <div className="grain relative overflow-clip rounded-[28px] sm:rounded-[36px] lg:rounded-[44px]" style={{ background: `linear-gradient(170deg, ${service.soft} 0%, #f5f5f2 62%)` }}>
          <div className="container-x relative pb-14 pt-28 sm:pt-32 lg:pb-20">
            <TLink to="/#services" curtain={HOME_CURTAIN} className="inline-flex items-center gap-2 text-[0.875rem] font-medium text-ink-soft hover:text-ink">
              <ArrowLeft className="size-4" /> All services
            </TLink>
            <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <Eyebrow>{service.name}</Eyebrow>
                <RevealHeading as="h1" id="service-title" text={service.headline} className="mt-6 text-display text-ink" emClass={`italic ${service.accent}`} animateOnMount delay={0.15} />
              </div>
              <motion.div
                className="lg:col-span-5"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease, delay: 0.45 }}
              >
                <p className="text-lead text-ink-soft">{service.intro}</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href={wa} external size="lg" icon={<WhatsAppDisc />} onClick={() => track("whatsapp_click", { location: "service_hero", service: service.slug })}>
                    Talk to us
                  </ButtonLink>
                  <ButtonLink
                    href="#quote"
                    variant="secondary"
                    size="lg"
                    arrow
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo("#quote");
                    }}
                  >
                    How it works
                  </ButtonLink>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="mt-14"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease, delay: 0.35 }}
            >
              {service.demo ? <DevicePair service={service} /> : <AiPair />}
              <p className="mt-6 text-center text-[0.8125rem] text-ink-soft">
                {service.demo ? (
                  service.demoNote
                ) : (
                  <>
                    <span className="sm:hidden">This chat is live: watch a customer book an appointment.</span>
                    <span className="hidden sm:inline">{service.demoNote}</span>
                  </>
                )}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── What you get ── */}
      <section aria-labelledby="get-title" className="section-y">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>What you get</Eyebrow>
              <RevealHeading id="get-title" text="Everything it needs, *nothing it doesn't*." className="mt-6 text-display" emClass={`italic ${service.accent}`} />
            </div>
            <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.1}>
              <p className="text-lead text-ink-soft">Every project is shaped around your idea, so this is where we start, not a fixed package.</p>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.8, ease, delay: (i % 3) * 0.08 }}
                className="rounded-[24px] bg-linen p-6 ring-1 ring-ink/[0.07] sm:p-7"
              >
                <span className="grid size-11 place-items-center rounded-2xl" style={{ background: service.soft, color: service.deep }}>
                  <f.icon className="size-5" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-sans text-[1.0625rem] font-bold text-ink">{f.title}</h3>
                <p className="mt-1.5 text-ink-soft">{f.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who it's for + live demos ── */}
      <section aria-labelledby="for-title" className="px-2 sm:px-3">
        <div className="rounded-[28px] bg-sand/70 sm:rounded-[36px] lg:rounded-[44px]">
          <div className="container-x grid gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <Eyebrow>Who it's for</Eyebrow>
              <h2 id="for-title" className="mt-6 text-[clamp(1.9rem,1.4rem+2vw,3rem)] leading-[1.05] tracking-[-0.02em]">
                Made for businesses <em className={`italic ${service.accent}`}>like yours</em>.
              </h2>
              <ul className="mt-8 flex flex-wrap gap-2">
                {service.goodFor.map((g) => (
                  <li key={g} className="rounded-full bg-linen px-4 py-2 text-[0.9rem] font-medium ring-1 ring-ink/[0.07]">
                    {g}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">See it live</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {service.related.map((slug) => {
                  const ind = industryBySlug(slug)!;
                  return (
                    <TLink
                      key={slug}
                      to={`/for/${slug}`}
                      curtain={curtainFor(ind)}
                      onIntent={() => prefetchDemo(slug)}
                      className="group flex items-center gap-4 rounded-[22px] bg-linen p-4 ring-1 ring-ink/[0.07] transition-shadow duration-500 hover:shadow-lift"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-2xl text-white" style={{ background: ind.theme.deep }}>
                        <ind.icon className="size-5" strokeWidth={1.8} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-ink">{ind.demo.name}</span>
                        <span className="block truncate text-[0.875rem] text-ink-soft">{ind.name}</span>
                      </span>
                      <ArrowUpRight className="size-5 shrink-0 text-ink-soft transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </TLink>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works + promises + FAQs ── */}
      <section id="quote" aria-labelledby="how-title" className="section-y scroll-mt-24">
        <div className="container-x">
          <Eyebrow>How it works</Eyebrow>
          <RevealHeading id="how-title" text="From first call to *live*." className="mt-6 text-display" emClass={`italic ${service.accent}`} />
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.8, ease, delay: i * 0.08 }}
                className="rounded-[24px] bg-linen p-6 ring-1 ring-ink/[0.07]"
              >
                <span className="text-[0.75rem] font-semibold uppercase tracking-[0.16em]" style={{ color: service.deep }}>
                  {s.day}
                </span>
                <h3 className="mt-3 font-display text-[1.5rem] leading-tight">{s.title}</h3>
                <p className="mt-2 text-[0.9375rem] text-ink-soft">{s.text}</p>
              </motion.li>
            ))}
          </ol>

          <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <Reveal>
                <div className="rounded-[28px] bg-ink p-7 text-white sm:p-9">
                  <h2 className="font-display text-[2.1rem] leading-[1.05]">Built around you, priced honestly</h2>
                  <p className="mt-3 text-white/65">Every project is quoted after a short call, in writing. No surprises later.</p>
                  <ul className="mt-7 grid gap-2.5 text-[0.95rem] text-white/85">
                    {promises.map((p) => (
                      <li key={p} className="flex gap-3">
                        <Check className="mt-1 size-4 shrink-0 text-ochre" aria-hidden="true" /> {p}
                      </li>
                    ))}
                  </ul>
                  <ButtonLink
                    href={wa}
                    external
                    variant="light"
                    size="lg"
                    icon={<WhatsAppDisc />}
                    className="mt-8 w-full"
                    onClick={() => track("whatsapp_click", { location: "service_quote", service: service.slug })}
                  >
                    Get a written quote
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <Eyebrow>Questions</Eyebrow>
              <RevealHeading text="What people *ask us*." className="mt-6 text-[clamp(1.9rem,1.4rem+2vw,3rem)] leading-[1.05] tracking-[-0.03em]" emClass={`italic ${service.accent}`} />
              <Reveal className="mt-8">
                <Accordion items={service.faqs} />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <Contact source={`service_${service.slug}`} defaultProject={service.project} />

      {/* ── Other services ── */}
      <section aria-labelledby="more-title" className="section-y">
        <div className="container-x">
          <Eyebrow>More we build</Eyebrow>
          <h2 id="more-title" className="mt-6 text-[clamp(1.9rem,1.4rem+2vw,3rem)] leading-[1.05] tracking-[-0.03em]">
            Need something else?
          </h2>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => (
              <TLink
                key={o.slug}
                to={`/services/${o.slug}`}
                curtain={curtainForService(o)}
                className="group relative overflow-hidden rounded-[24px] p-5 ring-1 ring-ink/[0.07] transition-shadow duration-500 hover:shadow-lift"
                style={{ background: `linear-gradient(150deg, ${o.soft}, #ffffff 80%)` }}
              >
                <span className="flex items-center justify-between">
                  <span className="text-[0.75rem] font-semibold uppercase tracking-[0.16em]" style={{ color: o.deep }}>
                    {o.short}
                  </span>
                  <ArrowUpRight className="size-5 text-ink-soft transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
                <span className="mt-8 block font-display text-[1.35rem] leading-tight">{o.headline.replace(/\*/g, "")}</span>
              </TLink>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}

/** The service's live demo on a MacBook, with the same site on an iPhone in front. */
function DevicePair({ service }: { service: Service }) {
  const industry = demoSpec(service.demo!);
  const wide = useMediaQuery("(min-width: 1024px)");
  const { name } = usePersonalization();
  return (
    <div className="relative mx-auto max-w-[64rem] pb-[5%] pr-[4%]">
      <DemoDevice industry={industry} name={name} mode="laptop" interactive={wide} />
      <div className="absolute -bottom-[2%] right-[-2%] w-[21%] max-w-[15rem] drop-shadow-2xl">
        <DemoDevice industry={industry} name={name} mode="phone" interactive={false} />
      </div>
    </div>
  );
}

/** Two live phone screens: the assistant chatting, and automated messages arriving. */
function AiPair() {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setMounted(true), { rootMargin: "300px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const phone = "relative aspect-[9/17.5] w-full max-w-[17.5rem] rounded-[46px] bg-[#111] p-[9px] shadow-lift";
  return (
    <div ref={ref} className="flex items-center justify-center gap-5 sm:gap-10 sm:pb-10">
      <div className={phone}>
        <div className="relative h-full overflow-hidden rounded-[38px] bg-[#efe9df]">{mounted && <LiveChat />}</div>
      </div>
      <div className={`${phone} hidden translate-y-10 sm:block`}>
        <div className="relative h-full overflow-hidden rounded-[38px] bg-[#2a3fd8]">{mounted && <LiveNotifications />}</div>
      </div>
    </div>
  );
}
