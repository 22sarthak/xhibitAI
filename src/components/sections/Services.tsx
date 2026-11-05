import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { curtainForService, serviceBySlug, services, type ServiceSlug } from "../../content/services";
import { ease } from "../../lib/motion";
import { TLink } from "../../lib/transition";
import { cn } from "../../lib/utils";
import { Eyebrow } from "../ui/Eyebrow";
import { Marquee } from "../ui/Marquee";
import { Reveal, RevealHeading } from "../ui/Reveal";
import { LiveChat, LiveNotifications } from "./LiveVisuals";

/* Every visual here is real: screenshots of our own demo products, a real map, and live, self-playing phone screens. */

function Tile({ className, visual, title, text, tag, tagClass, to }: { className?: string; visual: ReactNode; title: string; text: string; tag: string; tagClass: string; to?: ServiceSlug }) {
  const service = to ? serviceBySlug(to) : undefined;
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[24px] bg-linen p-5 ring-1 ring-ink/[0.07] transition-shadow duration-500 hover:shadow-lift sm:p-6",
        className,
      )}
    >
      <div className="relative min-h-[12rem] flex-1">{visual}</div>
      <div className="relative mt-6">
        <p className={cn("text-[0.75rem] font-semibold uppercase tracking-[0.16em]", tagClass)}>{tag}</p>
        <h3 className="mt-2 text-title text-ink">{title}</h3>
        <p className="mt-2 max-w-[46ch] text-ink-soft">{text}</p>
        {service && (
          <TLink
            to={`/services/${service.slug}`}
            curtain={curtainForService(service)}
            className="mt-4 inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-ink underline-offset-4 hover:underline"
          >
            More about {service.short.toLowerCase()} <ArrowRight className="size-4" aria-hidden="true" />
          </TLink>
        )}
      </div>
    </motion.article>
  );
}

/** A screenshot in a slim browser window. */
function BrowserShot({ src, domain, alt, className }: { src: string; domain: string; alt: string; className?: string }) {
  return (
    <div className={cn("flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-soft ring-1 ring-ink/[0.08]", className)}>
      <div className="flex h-8 items-center gap-1.5 border-b border-ink/[0.06] bg-[#f4f4f2] px-3">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="mx-auto rounded-md bg-white px-3 py-0.5 text-[0.6875rem] text-ink-mute ring-1 ring-ink/[0.05]">{domain}</span>
      </div>
      <img src={src} alt={alt} loading="lazy" decoding="async" className="block aspect-[5/3] min-h-0 w-full flex-1 object-cover object-left-top transition-transform duration-[1.2s] ease-(--ease-soft) group-hover:scale-[1.02]" />
    </div>
  );
}

function WebsiteVisual() {
  return (
    <div className="relative h-full">
      <BrowserShot src="/showcase/web-restaurant.webp" domain="kesarkitchen.in" alt="Kesar Kitchen restaurant website on a laptop screen" />
    </div>
  );
}

function ChatVisual() {
  return (
    <div className="relative h-full min-h-[25rem]">
      <LiveChat />
    </div>
  );
}

function WebAppVisual() {
  return <BrowserShot src="/showcase/web-business.webp" domain="app.shreetraders.in" alt="Shree Traders sales and stock dashboard" />;
}

function NotificationsVisual() {
  return (
    <div className="relative h-full min-h-[22rem]">
      <LiveNotifications />
    </div>
  );
}

function MapVisual() {
  return (
    <div className="relative h-full min-h-[14rem] overflow-hidden rounded-xl bg-[#f2efe9]">
      <img src="/maps/jayanagar.webp" alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      <svg width="30" height="40" viewBox="0 0 38 48" className="absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-full drop-shadow-md" aria-hidden="true">
        <path d="M19 47s17-15.6 17-28A17 17 0 0 0 2 19c0 12.4 17 28 17 28z" fill="#ea4335" />
        <circle cx="19" cy="19" r="7" fill="#a50e0e" />
      </svg>
      <div className="absolute inset-x-3 bottom-3 rounded-xl bg-white p-3 shadow-soft" style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
        <p className="text-[0.875rem] font-semibold text-[#202124]">Your business</p>
        <p className="mt-0.5 flex items-center gap-1 text-[0.75rem] text-[#5f6368]">
          4.8 <span className="text-[#fbbc04]">★★★★★</span> (212) · Restaurant
        </p>
        <p className="text-[0.75rem] text-[#188038]">Open · Closes 11 PM</p>
      </div>
      <span className="absolute right-2 top-2 rounded bg-white/85 px-1.5 py-0.5 text-[0.625rem] text-ink-mute">© OpenStreetMap</span>
    </div>
  );
}

const careItems = ["New features", "Content updates", "Daily backups", "Security updates", "Speed checks", "Google posts", "Festive offers", "Analytics reviews"];

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="section-y">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow no="04">What we do</Eyebrow>
            <RevealHeading id="services-title" text="Everything you need, *built* for the web." className="mt-6 text-display" emClass="italic text-sal" />
          </div>
          <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.1}>
            <p className="text-lead text-ink-soft">One team for your website, your web apps and your AI, explained in plain language and honestly priced.</p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-6 lg:gap-5">
          <Tile
            className="md:col-span-2 lg:col-span-4"
            tag="Websites & landing pages"
            tagClass="text-clay-deep"
            to="websites"
            title="Websites that make people stop scrolling."
            text="Fast, beautiful sites and landing pages that work on every screen, from a phone to a big monitor, and are easy to find on Google."
            visual={<WebsiteVisual />}
          />
          <Tile
            className="lg:col-span-2"
            tag="AI assistants"
            tagClass="text-sal"
            to="ai-automation"
            title="A WhatsApp assistant that never sleeps."
            text="Answers the questions you hear fifty times a day, books customers in, and hands over to you anytime."
            visual={<ChatVisual />}
          />
          <Tile
            className="lg:col-span-2"
            tag="Web apps & dashboards"
            tagClass="text-cobalt"
            to="web-apps"
            title="Software for how you actually work."
            text="Booking systems, order and stock dashboards, customer portals and internal tools, all in the browser."
            visual={<WebAppVisual />}
          />
          <Tile
            className="lg:col-span-2"
            tag="Automations"
            tagClass="text-violet"
            title="Messages that send themselves."
            text="Confirmations, reminders, payment nudges and review requests, on time, every time."
            visual={<NotificationsVisual />}
          />
          <Tile
            className="lg:col-span-2"
            tag="Google presence"
            tagClass="text-rose-deep"
            title="Show up when customers search."
            text="We set up your Google Business Profile, connect it to your site and help you collect genuine reviews."
            visual={<MapVisual />}
          />
        </div>

        <nav aria-label="All services" className="mt-5 flex flex-wrap items-center gap-2 rounded-[24px] bg-linen p-3 ring-1 ring-ink/[0.07] sm:p-4">
          <span className="px-2 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-ink-soft">Explore</span>
          {services.map((s) => (
            <TLink
              key={s.slug}
              to={`/services/${s.slug}`}
              curtain={curtainForService(s)}
              className="group inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.9rem] font-semibold text-ink ring-1 ring-ink/10 transition-colors hover:bg-ink hover:text-ivory"
            >
              {s.short}
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </TLink>
          ))}
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease }}
          className="mt-5 grid items-center gap-6 overflow-hidden rounded-[24px] bg-ink p-6 text-white sm:p-8 lg:grid-cols-12"
        >
          <div className="min-w-0 lg:col-span-5">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-ochre">After launch</p>
            <h3 className="mt-2 text-title">We don't disappear after launch.</h3>
            <p className="mt-2 text-white/70">New feature, new photos or a festive offer? Send us a WhatsApp and we'll handle it.</p>
          </div>
          <div className="mask-fade-x min-w-0 lg:col-span-7" aria-hidden="true">
            <Marquee duration={36} gap="0.75rem">
              {careItems.map((c) => (
                <span key={c} className="whitespace-nowrap rounded-full bg-white/[0.08] px-4 py-2.5 text-[0.875rem] ring-1 ring-white/10">
                  {c}
                </span>
              ))}
            </Marquee>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
