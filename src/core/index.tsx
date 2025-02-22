import { StrictMode } from 'react'
import { Container, createRoot } from 'react-dom/client'
import { TranslatorApp } from '@core/components/app'
import { useAppStore } from '@core/store'

export default function createTapture(container: Container, provider: EventProvider<any, any>) {
  useAppStore.getState().setProvider(provider)

  const root = createRoot(container)

  root.render(
    <StrictMode>
      <TranslatorApp />
    </StrictMode>,
  )

  return {
    dispose: root.unmount,
    isOpen: () => useAppStore.getState().show,
    open: useAppStore.getState().setShow.bind(null, true),
    close: useAppStore.getState().setShow.bind(null, false),
  }
}
