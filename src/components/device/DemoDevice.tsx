import { Suspense, type Ref } from "react";
import type { DemoSpec } from "../../content/showcase";
import { demoChrome, demoComponents } from "../../demos/registry";
import { toDomain } from "../../lib/utils";
import { DeviceScreen, type DeviceApi } from "./DeviceScreen";
import { BrowserFrame, DESKTOP, LAPTOP, LaptopFrame, PHONE, PhoneFrame } from "./frames";
import { Scaled } from "./Scaled";

function Loading({ color }: { color: string }) {
  return (
    <div className="flex h-full flex-col gap-4 p-5" style={{ background: "#faf8f5" }} aria-hidden="true">
      <div className="h-11 rounded-2xl opacity-80" style={{ background: color }} />
      <div className="h-56 animate-pulse rounded-3xl bg-black/[0.06]" />
      <div className="h-5 w-2/3 animate-pulse rounded-full bg-black/[0.06]" />
      <div className="h-5 w-1/2 animate-pulse rounded-full bg-black/[0.06]" />
    </div>
  );
}

/** A live, tappable demo website inside a phone or desktop browser frame. */
export function DemoDevice({
  industry,
  name,
  area,
  city,
  mode = "phone",
  interactive = true,
  apiRef,
  className,
}: {
  industry: DemoSpec;
  name?: string;
  area?: string;
  city?: string;
  mode?: "phone" | "desktop" | "laptop";
  interactive?: boolean;
  apiRef?: Ref<DeviceApi>;
  className?: string;
}) {
  const Site = demoComponents[industry.slug];
  const chrome = demoChrome[industry.slug];
  const displayName = name?.trim() || industry.demo.name;
  const displayArea = area?.trim() || industry.demo.area;
  const displayCity = city?.trim() || industry.demo.city;
  const label = `Interactive demo: a ${industry.kind.toLowerCase()} website for ${displayName}`;

  const screen = (
    <DeviceScreen apiRef={apiRef} interactive={interactive} label={label} mode={mode === "phone" ? "phone" : "desktop"} accent={industry.theme.deep}>
      <Suspense fallback={<Loading color={chrome.bar} />}>
        <Site name={displayName} area={displayArea} city={displayCity} />
      </Suspense>
    </DeviceScreen>
  );

  if (mode === "laptop") {
    return (
      <Scaled width={LAPTOP.w} height={LAPTOP.h} className={className}>
        <LaptopFrame domain={toDomain(displayName)}>{screen}</LaptopFrame>
      </Scaled>
    );
  }
  if (mode === "desktop") {
    return (
      <Scaled width={DESKTOP.w} height={DESKTOP.h} className={className}>
        <BrowserFrame domain={toDomain(displayName)}>{screen}</BrowserFrame>
      </Scaled>
    );
  }
  return (
    <Scaled width={PHONE.w} height={PHONE.h} className={className}>
      <PhoneFrame chrome={chrome}>{screen}</PhoneFrame>
    </Scaled>
  );
}
