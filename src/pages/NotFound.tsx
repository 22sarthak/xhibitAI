import { useEffect } from "react";
import { site } from "../../site.config";
import { ButtonRoute } from "../components/ui/Button";
import { curtainFor, industries } from "../content/industries";
import { HOME_CURTAIN, TLink, useRouteReady } from "../lib/transition";

export default function NotFound() {
  useRouteReady();
  useEffect(() => {
    document.title = `Page not found — ${site.brand.name}`;
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <section className="relative p-2 sm:p-3" aria-labelledby="nf-title">
      <div className="grain relative grid min-h-[calc(100svh-1rem)] place-items-center overflow-hidden rounded-[28px] bg-sand px-6 py-32 text-center sm:rounded-[44px]">
        <div aria-hidden="true" className="absolute -right-32 -top-32 size-[30rem] rounded-full bg-[radial-gradient(closest-side,#f5c79d,transparent)]" />
        <div className="relative max-w-[40rem]">
          <p className="eyebrow mx-auto">Error 404</p>
          <h1 id="nf-title" className="mt-6 text-display">
            This exhibit has <em className="text-clay">moved.</em>
          </h1>
          <p className="mx-auto mt-5 max-w-[30rem] text-lead text-ink-soft">The page you're looking for isn't here — but your business could be. Try one of these instead:</p>
          <div className="mt-8 flex justify-center">
            <ButtonRoute to="/" curtain={HOME_CURTAIN} size="lg" arrow>
              Back to the gallery
            </ButtonRoute>
          </div>
          <ul className="mt-10 flex flex-wrap justify-center gap-2">
            {industries.map((i) => (
              <li key={i.slug}>
                <TLink to={`/for/${i.slug}`} curtain={curtainFor(i)} className="block rounded-full bg-linen px-4 py-2 text-[0.875rem] font-medium ring-1 ring-ink/10 hover:bg-ivory">
                  {i.name}
                </TLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
