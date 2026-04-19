import { useState, useCallback } from "react";
import { storage } from "../storage";
import { LS } from "../constants";
import { TRANSLATIONS } from "../i18n";

export function useLanguage() {
  const [lang, setLang] = useState(() => storage.get(LS.lang) || "en");

  const toggleLang = useCallback(() => {
    setLang(prev => {
      const next = prev === "en" ? "es" : "en";
      storage.set(LS.lang, next);
      return next;
    });
  }, []);

  return { lang, t: TRANSLATIONS[lang], toggleLang };
}
