import { useEffect } from "react";
import { site } from "../../site.config";
import { Hero } from "../components/hero/Hero";
import { AIAssistant } from "../components/sections/AIAssistant";
import { Contact } from "../components/sections/Contact";
import { FAQ } from "../components/sections/FAQ";
import { LocalStrip } from "../components/sections/LocalStrip";
import { PreviewStudio } from "../components/sections/PreviewStudio";
import { Process } from "../components/sections/Process";
import { SearchStory } from "../components/sections/SearchStory";
import { Services } from "../components/sections/Services";
import { WhyUs } from "../components/sections/WhyUs";
import { Work } from "../components/sections/Work";
import { useSeo } from "../lib/seo";
import { useSmoothScroll } from "../lib/smooth-scroll";
import { useRouteReady } from "../lib/transition";

export default function Home() {
  useRouteReady();
  useSeo({ title: site.seo.title, description: site.seo.description, path: "/" });
  const { scrollTo } = useSmoothScroll();

  // Arriving at /#contact (etc.) from a shared link.
  useEffect(() => {
    if (!window.location.hash) return;
    const t = window.setTimeout(() => scrollTo(window.location.hash, { immediate: true }), 60);
    return () => window.clearTimeout(t);
  }, [scrollTo]);

  return (
    <>
      <Hero />
      <LocalStrip />
      <SearchStory />
      <Work />
      <PreviewStudio />
      <Services />
      <AIAssistant />
      <Process />
      <WhyUs />
      <FAQ />
      <Contact />
    </>
  );
}
