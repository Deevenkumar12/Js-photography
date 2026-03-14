export * from "./database";

export type Lang = "en" | "te";

export interface I18nStrings {
  [key: string]: string;
}

export interface I18nDict {
  en: I18nStrings;
  te: I18nStrings;
}
