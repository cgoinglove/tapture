export class BackgroundEventProvider<PM extends AppEventMap, SM extends AppEventMap> implements EventProvider<PM, SM> {
  private ports: Map<string, chrome.runtime.Port> = new Map()
  private handlers: Map<string, Array<(...args: any[]) => void>>

  constructor() {
    this.handlers = new Map()
    chrome.runtime.onConnect.addListener(port => {
      const id = port.name
      this.ports.set(id, port)
      port.onMessage.addListener(eventMap => {
        this.handlers.get(eventMap.action)?.forEach(hanlder => {
          hanlder({ data: eventMap.data, portId: id })
        })
      })
      port.onDisconnect.addListener(() => {
        this.ports.delete(id)
      })
    })
  }
  publishTo<Action extends PM['action']>(portId: string, action: Action, data: AppEventData<PM, Action>): void {
    const port = this.ports.get(portId)
    if (!port) return
    port.postMessage({ action, data })
  }
  publish<Action extends PM['action']>(action: Action, data: AppEventData<PM, Action>): void {
    for (const portId of this.ports.keys()) {
      this.publishTo(portId, action, data)
    }
  }
  subscribe<Action extends SM['action']>(action: Action, handler: (event: AppEvent<SM, Action> & { portId: string }) => void): void {
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
