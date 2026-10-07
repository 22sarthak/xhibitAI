import { Suspense, useEffect } from "react";
import { useParams } from "react-router";
import { site } from "../../site.config";
import { LogoMark } from "../components/brand/Logo";
import { DeviceScreen } from "../components/device/DeviceScreen";
import { PHONE, PhoneFrame } from "../components/device/frames";
import { baseSilk, industries, industryBySlug } from "../content/industries";
import { demoChrome, demoComponents } from "../demos/registry";

/**
 * Development-only: a 1200×630 social share card. `npm run og` screenshots
 * /og/home and /og/<industry> into public/og/*.jpg.
 */
export default function OgCard() {
  const { slug } = useParams();
  const industry = industryBySlug(slug) ?? industries[0];
  const isHome = slug === "home";
  const silk = isHome ? baseSilk : industry.theme.silk;
  const Site = demoComponents[industry.slug];

  useEffect(() => {
    document.documentElement.style.background = "#fbf7f0";
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

      <div className="absolute left-[72px] top-[170px] w-[640px]">
        <p className="text-[18px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
          {isHome ? `Websites · Apps · AI · ${site.brand.city}` : `Exhibit ${industry.no} — ${industry.name}`}
        </p>
        <p className="mt-6 font-display text-[76px] leading-[0.98] tracking-[-0.035em] text-ink" style={{ fontVariationSettings: '"opsz" 144' }}>
          {isHome ? (
            <>
              Let {site.brand.city} find <em className="text-clay">your business.</em>
            </>
          ) : (
            industry.headline
          )}
        </p>
        <p className="mt-8 text-[22px] text-ink-soft">
          {isHome ? "Free design preview · Live in 7 days" : "See a live demo — try it with your own name"}
        </p>
      </div>

      <div className="absolute -bottom-[120px] right-[70px] w-[330px] rotate-[6deg]">
        <div style={{ width: 330, height: (330 * PHONE.h) / PHONE.w }}>
          <div className="origin-top-left" style={{ width: PHONE.w, height: PHONE.h, transform: `scale(${330 / PHONE.w})` }}>
            <PhoneFrame chrome={demoChrome[industry.slug]}>
              <DeviceScreen interactive={false} label="">
                <Suspense fallback={null}>
                  <Site name={industry.demo.name} area={industry.demo.area} />
                </Suspense>
              </DeviceScreen>
            </PhoneFrame>
          </div>
        </div>
      </div>
    </div>
  );
}
