import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DemoApp from './docs-app'
import '@core/input.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DemoApp />
  </StrictMode>,
)

// inject trapture
import createTapture from '@core/index'
import Woker from './web-worker.ts?worker'
import { WebWokerEventProvider } from '@lib/event-provider/web-woker-event-provider'
const container = document.createElement('div')
container.id = 'tapture-rootxasdasd'
container.style.zIndex = '9999999'
container.style.position = 'relative'
document.body.appendChild(container)
const woker = new Woker()
createTapture(container, new WebWokerEventProvider(woker))
