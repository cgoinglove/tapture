interface AppEventMap<Action = any, T = any> {
  action: Action
  data: T
}

type AppEventData<T extends AppEventMap, Action extends T['action']> = Extract<T, { action: Action }>['data']

type AppEvent<T extends AppEventMap, Action extends T['action']> = { data: AppEventData<T, Action> }

type AppEventHandler<T extends AppEventMap, Action extends T['action']> = (event: AppEvent<T, Action>) => void

interface EventProvider<PublishEvent extends AppEventMap, SubscribeEvent extends AppEventMap> {
  publish<Action extends PublishEvent['action']>(action: Action, data: AppEventData<PublishEvent, Action>): void

  subscribe<Action extends SubscribeEvent['action']>(action: Action, handler: AppEventHandler<SubscribeEvent, Action>): void

  unsubscribe<Action extends SubscribeEvent['action']>(action: Action, handler: AppEventHandler<SubscribeEvent, Action>): void
}
