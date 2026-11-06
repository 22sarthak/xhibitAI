import { Suspense } from "react";
import { useParams, useSearchParams } from "react-router";
import { DemoDevice } from "../components/device/DemoDevice";
import { DeviceScreen } from "../components/device/DeviceScreen";
import { demoSpec, type DemoSlug } from "../content/showcase";
import { demoComponents } from "../demos/registry";

/**
 * Development-only, for screenshots and QA:
 *   /dev/demo/<slug>?mode=phone|laptop   one demo in its device frame, full size
 *   /dev/demo/<slug>?mode=page&w=1280     the whole desktop page with no frame (for showcase images)
 */
export default function DemoPreview() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const spec = demoSpec(slug as DemoSlug);
  if (!spec) return <p className="p-10">Unknown demo: {slug}</p>;

  if (params.get("mode") === "page") {
    const Site = demoComponents[spec.slug];
    return (
      <div id="device" style={{ width: Number(params.get("w")) || 1280 }}>
        <DeviceScreen mode="desktop" label="" interactive={false}>
          <Suspense fallback={null}>
            <Site name={spec.demo.name} area={spec.demo.area} city={spec.demo.city} />
          </Suspense>
        </DeviceScreen>
      </div>
    );
  }

  const mode = params.get("mode") === "laptop" ? "laptop" : "phone";
  return (
    <div className="grid min-h-screen place-items-center bg-[#e9e9e4] p-6">
      <div id="device" style={{ width: mode === "laptop" ? 1440 : 414 }}>
        <DemoDevice industry={spec} mode={mode} />
      </div>
    </div>
  );
}
