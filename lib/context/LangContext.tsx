"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Lang } from "@/types";
import { t } from "@/lib/i18n";

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  T: (key: string) => string;
}

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
  T: (k) => k,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("js_lang") as Lang | null;
    if (stored === "en" || stored === "te") setLangState(stored);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("js_lang", l);
  }

  const T = (key: string) => t(lang, key);

  return (
    <LangContext.Provider value={{ lang, setLang, T }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
