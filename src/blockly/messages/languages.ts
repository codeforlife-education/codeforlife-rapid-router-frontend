import * as bg from "blockly/msg/bg"
import * as ca from "blockly/msg/ca"
import * as en from "blockly/msg/en"
import * as enGb from "blockly/msg/en-gb"
import * as es from "blockly/msg/es"
import * as fr from "blockly/msg/fr"
import * as hi from "blockly/msg/hi"
import * as pl from "blockly/msg/pl"
import * as ptBr from "blockly/msg/pt-br"
import * as ru from "blockly/msg/ru"

import * as bg_custom from "./bg"
import * as ca_custom from "./ca"
import * as enGb_custom from "./en-gb"
import * as en_custom from "./en"
import * as es_custom from "./es"
import * as fr_custom from "./fr"
import * as hi_custom from "./hi"
import * as pl_custom from "./pl"
import * as ptBr_custom from "./pt-br"
import * as ru_custom from "./ru"

// Blockly ships built-in messages for many more languages than this, but we
// only offer the ones the old site supports (see
// https://www.codeforlife.education/rapidrouter/ - the language dropdown).
export const LANGUAGE_NAMES = {
  bg: "български",
  ca: "Català",
  en: "English",
  "en-gb": "English (UK)",
  es: "Español",
  fr: "Français",
  hi: "हिन्दी",
  pl: "Polski",
  "pt-br": "Português (Brasil)",
  ru: "русский",
} as const

export type Language = keyof typeof LANGUAGE_NAMES

export const LANGUAGES = Object.keys(LANGUAGE_NAMES) as Language[]

export const DEFAULT_LANGUAGE: Language = "en"

const DEFAULT_MESSAGES: Record<Language, object> = {
  bg,
  ca,
  en,
  "en-gb": enGb,
  es,
  fr,
  hi,
  pl,
  "pt-br": ptBr,
  ru,
}

const CUSTOM_MESSAGES: Record<Language, object> = {
  bg: bg_custom,
  ca: ca_custom,
  en: en_custom,
  "en-gb": enGb_custom,
  es: es_custom,
  fr: fr_custom,
  hi: hi_custom,
  pl: pl_custom,
  "pt-br": ptBr_custom,
  ru: ru_custom,
}

/** The full set of Blockly messages (built-in + our own) for a language. */
export function getBlocklyMessages(language: Language) {
  return {
    ...DEFAULT_MESSAGES[language],
    ...CUSTOM_MESSAGES[language],
  }
}
