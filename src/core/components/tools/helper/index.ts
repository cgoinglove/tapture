import { randomId } from '@lib/shared'

import { AppSubscribeEvent, getStoreState } from '@core/store'
import { generateTextNodeMaker } from '@lib/text-node-maker'
import { Chain } from '@lib/safe-chain'

export const MarkStyle = `
  mark {
      background-color: #a5b4fc !important;
      color: #1e1b4b! important;
  }
  @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
  }
  mark.translating {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
`

const selectedTemplate = document.createElement('mark')
export const selectedMarker = generateTextNodeMaker(selectedTemplate)

const translationTemplate = document.createElement('mark')
translationTemplate.classList.add('translating')
export const translationMarker = generateTextNodeMaker(translationTemplate)

export const isNonEmptyTextNode = (el: any): el is Node => {
  return el?.nodeType === Node.TEXT_NODE && (el.textContent || '').trim().length > 0
}

export const isTranslatableElement = (el?: any): el is HTMLElement =>
  el?.hasChildNodes?.() &&
  !selectedMarker.isMarked(el) &&
  !translationMarker.isMarked(el) &&
  Array.from(el.childNodes).some(isNonEmptyTextNode)

const streamTranslateElement = async (el: HTMLElement) => {
  const translator = getStoreState().provider

  const originText = el.textContent!
  const { sourceLang, targetLang } = getStoreState()

  const requestId = randomId()

  return new Promise<string>(resolve => {
    const handler = (event: AppSubscribeEvent<'translate'>) => {
      if (event.data.requestId != requestId) return
      switch (event.data.status) {
        case 'end': {
          translator.unsubscribe('translate', handler)
          const result = event.data.message ?? originText
          el.textContent = result
          return resolve(result)
        }
        case 'update': {
          el.textContent = event.data.message.padEnd(originText.length, ' ')
          return
        }
      }
    }
    translator.subscribe('translate', handler)

    translator.publish('translate', {
      message: originText,
      requestId,
      sourceLang,
      targetLang,
    })
  })
    .then(() => el)
    .catch(() => el)
}

export const elementTranslation = Chain(selectedMarker.unmark)
  .then(translationMarker.mark)
  .then(streamTranslateElement)
  .then(translationMarker.unmark)
  .unwrap()
