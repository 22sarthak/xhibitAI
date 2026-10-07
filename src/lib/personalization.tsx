import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * "Type your business name" — the name follows the visitor across every demo,
 * the browser bar, and the WhatsApp message. Also readable from the URL
 * (?name=Kesar%20Kitchen&area=Lalpur) so you can send personalised demo links.
 */
interface PersonalizationValue {
  name: string;
  setName: (v: string) => void;
  area: string;
  setArea: (v: string) => void;
}

const PersonalizationContext = createContext<PersonalizationValue | null>(null);

const MAX = 40;
const clean = (v: string) => v.replace(/\s+/g, " ").replace(/^\s+/, "").slice(0, MAX);

function initial(key: "name" | "area") {
  if (typeof window === "undefined") return "";
  const fromUrl = new URLSearchParams(window.location.search).get(key);
  if (fromUrl) return clean(fromUrl).trim();
  try {
    return sessionStorage.getItem(`xh:${key}`) ?? "";
  } catch {
    return "";
  }
}

function persist(key: string, v: string) {
  try {
    sessionStorage.setItem(`xh:${key}`, v.trim());
  } catch {
    /* private mode — ignore */
  }
}

export function PersonalizationProvider({ children }: { children: ReactNode }) {
  const [name, setNameState] = useState(() => initial("name"));
  const [area, setAreaState] = useState(() => initial("area"));

  const setName = useCallback((v: string) => {
    const c = clean(v);
    setNameState(c);
    persist("name", c);
  }, []);
  const setArea = useCallback((v: string) => {
    const c = clean(v);
    setAreaState(c);
    persist("area", c);
  }, []);

  const value = useMemo(() => ({ name, setName, area, setArea }), [name, setName, area, setArea]);
  return <PersonalizationContext.Provider value={value}>{children}</PersonalizationContext.Provider>;
}

export function usePersonalization() {
  const ctx = useContext(PersonalizationContext);
  if (!ctx) throw new Error("usePersonalization must be used inside PersonalizationProvider");
  return ctx;
}
