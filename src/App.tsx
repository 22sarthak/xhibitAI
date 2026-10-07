import { MotionConfig } from "motion/react";
import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router";
import { Footer } from "./components/layout/Footer";
import { Nav } from "./components/layout/Nav";
import { WhatsAppFab } from "./components/layout/WhatsAppFab";
import { DevNotice } from "./components/layout/DevNotice";
import { PersonalizationProvider } from "./lib/personalization";
import { SmoothScrollProvider } from "./lib/smooth-scroll";
import { TransitionProvider } from "./lib/transition";
import Home from "./pages/Home";

const IndustryPage = lazy(() => import("./pages/IndustryPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
// Dev-only route used by `npm run og` to render social share images.
const OgCard = import.meta.env.DEV ? lazy(() => import("./pages/OgCard")) : null;

function Shell() {
  const location = useLocation();

  if (OgCard && location.pathname.startsWith("/og/")) {
    return (
      <Suspense fallback={null}>
        <Routes>
          <Route path="/og/:slug" element={<OgCard />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <>
      <a href="#main" className="skip-link rounded-full bg-ink px-5 py-3 text-sm font-semibold text-ivory">
        Skip to content
      </a>
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Suspense fallback={<div className="min-h-[100svh]" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/for/:slug" element={<IndustryPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <WhatsAppFab />
      <DevNotice />
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <PersonalizationProvider>
        <SmoothScrollProvider>
          <TransitionProvider>
            <Shell />
          </TransitionProvider>
        </SmoothScrollProvider>
      </PersonalizationProvider>
    </MotionConfig>
  );
}
