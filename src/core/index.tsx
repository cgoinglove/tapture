import { StrictMode } from 'react'
import { Container, createRoot } from 'react-dom/client'
import { TranslatorApp } from '@core/components/app'
import { useAppStore } from '@core/store'

export default function createTapture(container: Container, provider: EventProvider<any, any>) {
  useAppStore.getState().setProvider(provider)

  createRoot(container).render(
    <StrictMode>
      <TranslatorApp />
    </StrictMode>,
  )
}
