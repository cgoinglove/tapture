import { AppState } from '@cs/store'

type PublishEventMap = TranslateRequestEvent | SetStateEvent<AppState> | PingEvent
type SubscribeEventMap = TranslateResponseEvent | TranslateProgressEvent | SetStateEvent<AppState> | PingEvent

export type ContentScriptPublishEvent<Action extends PublishEventMap['action']> = AppEvent<PublishEventMap, Action>
export type ContentScriptSubscribeEvent<Action extends SubscribeEventMap['action']> = AppEvent<SubscribeEventMap, Action>

// import { WebWokerEventProvider } from '@lib/provider/web-woker-event-provider'
// import WebWoker from '../../web/web-worker.ts?worker'
// export const provider = new WebWokerEventProvider<PublishEventMap, SubscribeEventMap>(new WebWoker())

import { ContentScriptEventProvider } from '@lib/provider/content-script-event-provider'
export const provider = new ContentScriptEventProvider<PublishEventMap, SubscribeEventMap>()
