import { BackgroundEventProvider } from '@lib/provider/bacground-event-provider'

type PublishEventMap = TranslateResponseEvent | TranslateProgressEvent | SetStateEvent<any> | PingEvent
type SubscribeEventMap = TranslateRequestEvent | SetStateEvent<any> | PingEvent

export const provider = new BackgroundEventProvider<PublishEventMap, SubscribeEventMap>()
