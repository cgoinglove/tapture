import { randomId } from '@shared/util'

export class ContentScriptEventProvider<PM extends AppEventMap, SM extends AppEventMap> implements EventProvider<PM, SM> {
  private handlers: Map<string, Array<(...args: any[]) => void>>
  private port?: chrome.runtime.Port
  private id!: string
  constructor() {
    this.handlers = new Map()
    this.init()
    window.addEventListener('pageshow', event => {
      if ((event as PageTransitionEvent).persisted) {
        this.port?.disconnect()
        this.port = undefined
        this.init()
      }
    })
  }
  private init() {
    if (this.port) return
    this.id = randomId()

    this.port = chrome.runtime.connect({ name: this.id })
    this.port.onDisconnect.addListener(() => {
      this.port = undefined
    })
    this.port.onMessage.addListener(eventMap => {
      this.handlers.get(eventMap.action)?.forEach(hanlder => {
        hanlder({ data: eventMap.data })
      })
    })
  }
  publish<Action extends PM['action']>(action: Action, data: AppEventData<PM, Action>): void {
    if (!this.port) this.init()
    this.port?.postMessage({
      action,
      data,
    })
  }
  subscribe<Action extends SM['action']>(action: Action, handler: AppEventHandler<SM, Action>): void {
    if (!this.handlers.has(action)) {
      this.handlers.set(action, [])
    }
    this.handlers.get(action)!.push(handler)
  }
  unsubscribe<Action extends SM['action']>(action: Action, handler: AppEventHandler<SM, Action>): void {
    if (this.handlers.has(action)) {
      this.handlers.set(
        action,
        this.handlers.get(action)!.filter(h => h !== handler),
      )
    }
  }
}
