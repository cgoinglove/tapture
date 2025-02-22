export class WebWokerEventProvider<PM extends AppEventMap, SM extends AppEventMap> implements EventProvider<PM, SM> {
  private handlers: Map<string, Array<(...args: any[]) => void>>

  constructor(private woker: Worker) {
    this.handlers = new Map()
    this.woker.addEventListener('message', event => {
      this.handlers.get(event.data.action)?.forEach(hanlder => {
        hanlder({ data: event.data.data })
      })
    })
  }

  publish<Action extends PM['action']>(action: Action, data: AppEventData<PM, Action>): void {
    this.woker.postMessage({
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
