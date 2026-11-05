import { useEffect } from "react";
import { useParams } from "react-router";
import { LogoMark } from "../components/brand/Logo";
import { DemoDevice } from "../components/device/DemoDevice";
import { LiveChat, LiveNotifications } from "../components/sections/LiveVisuals";
import { baseSilk, industries, industryBySlug } from "../content/industries";
import { serviceBySlug } from "../content/services";

/**
 * Development-only: a 1200×630 social share card. `npm run og` screenshots
 * /og/home and /og/<industry> into public/og/*.jpg.
 */
export default function OgCard() {
  const { slug } = useParams();
  const service = slug?.startsWith("service-") ? serviceBySlug(slug.slice("service-".length)) : undefined;
  const industry = industryBySlug(service ? (service.demo ?? "clinics") : slug) ?? industries[0];
  const isHome = slug === "home";
  const silk = isHome || (service && !service.demo) ? baseSilk : industry.theme.silk;

  useEffect(() => {
    document.documentElement.style.background = "#f5f5f2";
  }, []);

  return (
    <div
      id="og"
      className="relative overflow-hidden"
      style={{
        width: 1200,
        height: 630,
        background: `radial-gradient(60% 80% at 85% 20%, ${silk[1]} 0%, transparent 70%), radial-gradient(50% 70% at 95% 95%, ${silk[2]}cc 0%, transparent 70%), radial-gradient(40% 60% at 10% 110%, ${silk[3]}55 0%, transparent 70%), ${silk[0]}`,
      }}
    >
      <div className="absolute left-[72px] top-[64px] flex items-center gap-3">
        <LogoMark className="size-9" />
        <span className="font-display text-[34px] leading-none tracking-[-0.03em]" style={{ fontWeight: 560 }}>
          Xhibit
        </span>
        <span className="rounded-md bg-ink px-2 py-1 text-[13px] font-bold leading-none tracking-[0.14em] text-ivory">AI</span>
      </div>

      <div className="absolute left-[72px] top-[160px] w-[500px]">
        <p className="text-[16px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
          {isHome ? "Websites · Web apps · AI tools" : service ? `Services — ${service.name}` : `Exhibit ${industry.no} — ${industry.name}`}
        </p>
        <p className="mt-6 font-display text-[64px] leading-[1] tracking-[-0.025em] text-ink">
          {isHome ? (
            <>
              Made with you. <em className="text-cobalt">Made to be seen.</em>
            </>
          ) : service ? (
            service.headline.split("*").map((part, i) => (i % 2 ? <em key={i} className={service.accent}>{part}</em> : part))
          ) : (
            industry.headline
          )}
        </p>
        <p className="mt-7 text-[21px] leading-snug text-ink-soft">
          {isHome || service ? "See your design before you pay · Live in days, not months" : "See a live demo — try it with your own name"}
        </p>
      </div>

      {service && !service.demo ? (
        /* AI: the assistant chat and the lock screen, side by side */
        <>
          <div className="absolute right-[250px] top-[90px] h-[600px] w-[300px] rotate-[-3deg] rounded-[46px] bg-[#111] p-[9px] drop-shadow-[0_30px_40px_rgb(0_0_0/0.25)]">
            <div className="relative h-full overflow-hidden rounded-[38px]">
              <LiveChat autoplay={false} />
            </div>
          </div>
          <div className="absolute right-[-40px] top-[150px] h-[600px] w-[300px] rotate-[4deg] rounded-[46px] bg-[#111] p-[9px] drop-shadow-[0_30px_40px_rgb(0_0_0/0.25)]">
            <div className="relative h-full overflow-hidden rounded-[38px]">
              <LiveNotifications autoplay={false} />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* MacBook bleeding off the right edge, iPhone in front of it */}
          <div className="absolute right-[-150px] top-[120px] w-[760px] drop-shadow-[0_30px_40px_rgb(0_0_0/0.18)]">
            <DemoDevice industry={industry} mode="laptop" interactive={false} />
          </div>
          <div className="absolute bottom-[-150px] left-[600px] w-[210px] rotate-[-4deg] drop-shadow-[0_24px_30px_rgb(0_0_0/0.28)]">
            <DemoDevice industry={industry} mode="phone" interactive={false} />
          </div>
        </>
      )}
    </div>
  );
}
