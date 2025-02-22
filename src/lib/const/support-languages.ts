export const SUPPORT_LANGUAGES: Record<string, { name: string; icon: string }> = {
  en: { name: 'English', icon: '🇺🇸' }, // 영어
  zh: { name: 'Chinese', icon: '🇨🇳' }, // 중국어(간체)
  es: { name: 'Spanish', icon: '🇪🇸' }, // 스페인어
  ar: { name: 'Arabic', icon: '🇦🇪' }, // 현대 표준 아랍어
  pt: { name: 'Portuguese', icon: '🇵🇹' }, // 포르투갈어
  id: { name: 'Indonesian', icon: '🇮🇩' }, // 인도네시아어
  fr: { name: 'French', icon: '🇫🇷' }, // 프랑스어
  ja: { name: 'Japanese', icon: '🇯🇵' }, // 일본어
  ru: { name: 'Russian', icon: '🇷🇺' }, // 러시아어
  de: { name: 'German', icon: '🇩🇪' }, // 독일어
  ko: { name: 'Korean', icon: '🇰🇷' }, // 한국어
  hi: { name: 'Hindi', icon: '🇮🇳' }, // 힌디어
  it: { name: 'Italian', icon: '🇮🇹' }, // 이탈리아어
  tr: { name: 'Turkish', icon: '🇹🇷' }, // 터키어
  vi: { name: 'Vietnamese', icon: '🇻🇳' }, // 베트남어
  pl: { name: 'Polish', icon: '🇵🇱' }, // 폴란드어
  fa: { name: 'Western Persian', icon: '🇮🇷' }, // 서부 페르시아어
  nl: { name: 'Dutch', icon: '🇳🇱' }, // 네덜란드어
  th: { name: 'Thai', icon: '🇹🇭' }, // 태국어
  uk: { name: 'Ukrainian', icon: '🇺🇦' }, // 우크라이나어
}

export function isLanguageSupported(lang: string) {
  return Object.hasOwn(SUPPORT_LANGUAGES, lang)
}
