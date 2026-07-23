import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enCommon from "./locales/en/common.json";
import enAuth from "./locales/en/auth.json";
import enHome from "./locales/en/home.json";
import enSearch from "./locales/en/search.json";
import enSearchPicker from "./locales/en/searchPicker.json";
import enSession from "./locales/en/session.json";
import enTemplates from "./locales/en/templates.json";
import enStatistics from "./locales/en/statistics.json";
import enProfile from "./locales/en/profile.json";
import enAdmin from "./locales/en/admin.json";

import plCommon from "./locales/pl/common.json";
import plAuth from "./locales/pl/auth.json";
import plHome from "./locales/pl/home.json";
import plSearch from "./locales/pl/search.json";
import plSearchPicker from "./locales/pl/searchPicker.json";
import plSession from "./locales/pl/session.json";
import plTemplates from "./locales/pl/templates.json";
import plStatistics from "./locales/pl/statistics.json";
import plProfile from "./locales/pl/profile.json";
import plAdmin from "./locales/pl/admin.json";

import ukCommon from "./locales/uk/common.json";
import ukAuth from "./locales/uk/auth.json";
import ukHome from "./locales/uk/home.json";
import ukSearch from "./locales/uk/search.json";
import ukSearchPicker from "./locales/uk/searchPicker.json";
import ukSession from "./locales/uk/session.json";
import ukTemplates from "./locales/uk/templates.json";
import ukStatistics from "./locales/uk/statistics.json";
import ukProfile from "./locales/uk/profile.json";
import ukAdmin from "./locales/uk/admin.json";

export const supportedLanguages = ["en", "pl", "uk"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

export const namespaces = [
  "common",
  "auth",
  "home",
  "search",
  "searchPicker",
  "session",
  "templates",
  "statistics",
  "profile",
  "admin",
] as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        auth: enAuth,
        home: enHome,
        search: enSearch,
        searchPicker: enSearchPicker,
        session: enSession,
        templates: enTemplates,
        statistics: enStatistics,
        profile: enProfile,
        admin: enAdmin,
      },
      pl: {
        common: plCommon,
        auth: plAuth,
        home: plHome,
        search: plSearch,
        searchPicker: plSearchPicker,
        session: plSession,
        templates: plTemplates,
        statistics: plStatistics,
        profile: plProfile,
        admin: plAdmin,
      },
      uk: {
        common: ukCommon,
        auth: ukAuth,
        home: ukHome,
        search: ukSearch,
        searchPicker: ukSearchPicker,
        session: ukSession,
        templates: ukTemplates,
        statistics: ukStatistics,
        profile: ukProfile,
        admin: ukAdmin,
      },
    },
    ns: namespaces,
    defaultNS: "common",
    fallbackLng: "en",
    supportedLngs: supportedLanguages,
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
});

export default i18n;
