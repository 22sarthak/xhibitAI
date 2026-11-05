import { useLocation } from "react-router";
import { site } from "../../../site.config";
import { curtainFor, industries } from "../../content/industries";
import { curtainForService, services } from "../../content/services";
import { track } from "../../lib/api";
import { usePersonalization } from "../../lib/personalization";
import { useSmoothScroll } from "../../lib/smooth-scroll";
import { HOME_CURTAIN, TLink, usePageTransition } from "../../lib/transition";
import { mailHref, telHref, waHref, waMessage } from "../../lib/whatsapp";
import { Logo } from "../brand/Logo";
import { ButtonLink } from "../ui/Button";
import { FacebookIcon, InstagramIcon, LinkedinIcon, WhatsAppDisc, YoutubeIcon } from "../ui/icons";
import { NAV_LINKS } from "./Nav";

const socials = [
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "linkedin", label: "LinkedIn", Icon: LinkedinIcon },
  { key: "youtube", label: "YouTube", Icon: YoutubeIcon },
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
] as const;

export function Footer() {
  const { pathname } = useLocation();
  const onHome = pathname === "/";
  const { go } = usePageTransition();
  const { scrollTo } = useSmoothScroll();
  const { name } = usePersonalization();
  const year = new Date().getFullYear();

  const goSection = (id: string) => (onHome ? scrollTo(`#${id}`) : go(`/#${id}`, HOME_CURTAIN));
  const linkCls = "text-ivory/70 transition-colors hover:text-ivory";

  return (
    <footer className="grain-light relative overflow-hidden bg-dusk text-ivory">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-0 h-[36rem] w-[36rem] rounded-full bg-cobalt/25 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-violet/20 blur-[120px]" />

      <div className="container-x relative pb-10 pt-24 sm:pt-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Logo tone="light" />
            <p className="mt-8 max-w-[16ch] font-display text-[clamp(2.2rem,1.4rem+2.8vw,3.6rem)] leading-[1.02] tracking-[-0.02em]">
              Made with you. <em className="text-ochre">Made to be seen.</em>
            </p>
            <p className="mt-5 max-w-sm text-ivory/65">
              Websites, web apps and AI tools, designed and built around your idea for businesses and founders across India.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink
                href={waHref(waMessage({ businessName: name }))}
                external
                variant="light"
                icon={<WhatsAppDisc />}
                onClick={() => track("whatsapp_click", { location: "footer" })}
              >
                Chat on WhatsApp
              </ButtonLink>
              <ButtonLink href={telHref()} variant="outline-light" onClick={() => track("call_click", { location: "footer" })}>
                {site.contact.phoneDisplay}
              </ButtonLink>
            </div>
          </div>

          <nav aria-label="Services" className="lg:col-span-2 lg:col-start-6">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-ivory/45">Services</p>
            <ul className="mt-5 grid gap-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <TLink to={`/services/${s.slug}`} curtain={curtainForService(s)} className={linkCls}>
                    {s.short}
                  </TLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Industries" className="lg:col-span-2 lg:col-start-8">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-ivory/45">Live demos</p>
            <ul className="mt-5 grid gap-2.5">
              {industries.map((ind) => (
                <li key={ind.slug}>
                  <TLink to={`/for/${ind.slug}`} curtain={curtainFor(ind)} className={linkCls}>
                    {ind.name}
                  </TLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="grid grid-cols-2 gap-10 lg:col-span-3 lg:col-start-10 lg:grid-cols-1">
            <nav aria-label="Company">
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-ivory/45">Xhibit</p>
              <ul className="mt-5 grid gap-2.5">
                {NAV_LINKS.filter((l) => l.id !== "industries").map((l) => (
                  <li key={l.id}>
                    <a
                      href={`/#${l.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        goSection(l.id);
                      }}
                      className={linkCls}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="/#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      goSection("contact");
                    }}
                    className={linkCls}
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
            <div>
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-ivory/45">Say hello</p>
              <address className="mt-5 grid gap-2.5 not-italic">
                <a href={mailHref()} className={linkCls}>
                  {site.contact.email}
                </a>
                <span className="text-ivory/45">{site.brand.city}, India</span>
                <span className="text-ivory/45">{site.contact.hours}</span>
              </address>
              {socials.some((s) => site.socials[s.key]) && (
                <ul className="mt-6 flex gap-2" aria-label="Social media">
                  {socials
                    .filter((s) => site.socials[s.key])
                    .map(({ key, label, Icon }) => (
                      <li key={key}>
                        <a
                          href={site.socials[key]}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={label}
                          className="grid size-10 place-items-center rounded-full bg-ivory/[0.07] text-ivory/80 transition-colors hover:bg-ivory/15 hover:text-ivory"
                        >
                          <Icon className="size-[18px]" />
                        </a>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Giant wordmark */}
        <p
          aria-hidden="true"
          className="pointer-events-none mt-20 select-none bg-linear-to-b from-ivory/[0.16] to-ivory/[0.01] bg-clip-text text-center font-display text-[31vw] leading-[0.8] tracking-[-0.06em] text-transparent sm:mt-24 xl:text-[28rem]"
          style={{ fontWeight: 400 }}
        >
          Xhibit
        </p>

        <div className="mt-8 flex flex-col gap-3 border-t border-ivory/10 pt-6 text-[0.8125rem] text-ivory/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.brand.name} · {site.brand.city}, India
          </p>
          <p className="flex gap-5">
            <TLink to="/privacy" className="hover:text-ivory">
              Privacy
            </TLink>
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                if (onHome) scrollTo(0, { offset: 0 });
                else go("/", HOME_CURTAIN);
              }}
              className="hover:text-ivory"
            >
              Back to top ↑
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
