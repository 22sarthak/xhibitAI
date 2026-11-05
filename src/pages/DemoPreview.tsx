import { useParams, useSearchParams } from "react-router";
import { DemoDevice } from "../components/device/DemoDevice";
import { demoSpec, type DemoSlug } from "../content/showcase";

/** Development-only: /dev/demo/<slug>?mode=phone|laptop renders one demo full size, for screenshots and QA. */
export default function DemoPreview() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const mode = params.get("mode") === "laptop" ? "laptop" : "phone";
  const spec = demoSpec(slug as DemoSlug);
  if (!spec) return <p className="p-10">Unknown demo: {slug}</p>;
  return (
    <div className="grid min-h-screen place-items-center bg-[#e9e9e4] p-6">
      <div id="device" style={{ width: mode === "laptop" ? 1440 : 414 }}>
        <DemoDevice industry={spec} mode={mode} />
      </div>
    </div>
  );
}
