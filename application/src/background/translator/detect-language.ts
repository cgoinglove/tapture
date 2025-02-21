const detectLanguageFromChar = (char: string): string => {
  if (!char || char.length === 0) return 'unknown'

  const code = char.charCodeAt(0)

  // 한글: U+AC00 ~ U+D7A3
  if (code >= 0xac00 && code <= 0xd7a3) {
    return 'ko'
  }

  // 일본어: 히라가나 (U+3040 ~ U+309F), 가타카나 (U+30A0 ~ U+30FF)
  if ((code >= 0x3040 && code <= 0x309f) || (code >= 0x30a0 && code <= 0x30ff)) {
    return 'ja'
  }

  // 중국어: CJK 통합 한자 (U+4E00 ~ U+9FFF)
  if (code >= 0x4e00 && code <= 0x9fff) {
    return 'zh'
  }

  // 아랍어: U+0600 ~ U+06FF
  if (code >= 0x0600 && code <= 0x06ff) {
    return 'ar'
  }

  // 러시아어(키릴 문자): U+0400 ~ U+04FF
  if (code >= 0x0400 && code <= 0x04ff) {
    return 'ru'
  }

  // 기본 라틴 문자 (영어 등)
  if ((code >= 0x0041 && code <= 0x005a) || (code >= 0x0061 && code <= 0x007a)) {
    return 'en'
  }

  return 'unknown'
}

function getMaxKey(obj: Record<string, number>): string | undefined {
  let maxKey: string | undefined
  let maxValue = -Infinity
  for (const key in obj) {
    if (obj[key] > maxValue) {
      maxValue = obj[key]
      maxKey = key
    }
  }
  return maxKey
}

/** @deprecated */
export const detectLanguageFromText = (text: string): string => {
  const cleaned = text.replace(/[^\p{L}]+/gu, '')

  const scores = {} as Record<string, number>

  for (const char of cleaned) {
    const lang = detectLanguageFromChar(char)
    scores[lang] ??= 0
    scores[lang] += 1
  }

  return getMaxKey(scores) || 'unknown'
}
