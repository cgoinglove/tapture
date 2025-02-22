import { Translator } from '@core/translator'
import { WebWokerEventProvider } from '@lib/event-provider/web-woker-event-provider'

type PublishEventMap = TranslateResponseEvent | TranslateProgressEvent | PingEvent
type SubscribeEventMap = TranslateRequestEvent | PingEvent

const provider = new WebWokerEventProvider<PublishEventMap, SubscribeEventMap>(self as unknown as Worker)

const translator = Translator({
  fake: true,
  progressCallback(info) {
    provider.publish('translator-progress', info)
  },
})

provider.subscribe('translate', async event => {
  const { data } = event
  try {
    provider.publish('translate', {
      status: 'start',
      ...data,
    })
    const out = await translator.translateStream(data.message, data.sourceLang, data.targetLang, text => {
      provider.publish('translate', {
        status: 'update',
        ...data,
        message: text,
      })
    })

    provider.publish('translate', {
      status: 'end',
      ...data,
      message: out,
    })
  } catch (e) {
    provider.publish('translate', {
      status: 'end',
      ...data,
      fail: true,
      error: (e as Error).message || 'Error',
    })
  }
})

provider.subscribe('ping', () => provider.publish('ping', undefined))
