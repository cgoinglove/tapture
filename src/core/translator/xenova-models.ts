const DEFAULT_MODEL = 'Xenova/nllb-200-distilled-600M'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getModel(_src: string, _tgt: string): string {
  return DEFAULT_MODEL
}

export function isFastModel(src: string, tgt: string): boolean {
  return getModel(src, tgt) != DEFAULT_MODEL
}

export function getDefaultModelOption(src: string, tgt: string) {
  if ([src, tgt].every(Object.hasOwn.bind(null, DEFAULT_MODEL_LANGUAGE_MAP))) {
    return {
      src_lang: DEFAULT_MODEL_LANGUAGE_MAP[src],
      tgt_lang: DEFAULT_MODEL_LANGUAGE_MAP[tgt],
    }
  }
  throw new Error('Not Found Language Code')
}

const DEFAULT_MODEL_LANGUAGE_MAP: Record<string, string> = {
  en: 'eng_Latn',
  zh: 'zho_Hans',
  es: 'spa_Latn',
  ar: 'arb_Arab',
  pt: 'por_Latn',
  id: 'ind_Latn',
  fr: 'fra_Latn',
  ja: 'jpn_Jpan',
  ru: 'rus_Cyrl',
  de: 'deu_Latn',
  ko: 'kor_Hang',
  hi: 'hin_Deva',
  it: 'ita_Latn',
  tr: 'tur_Latn',
  vi: 'vie_Latn',
  pl: 'pol_Latn',
  fa: 'pes_Arab',
  nl: 'nld_Latn',
  th: 'tha_Thai',
  uk: 'ukr_Cyrl',
}
