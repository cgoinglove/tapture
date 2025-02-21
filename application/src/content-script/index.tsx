import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TranslatorApp } from '@cs/components/app'
import style from './tailwind.out.css?raw'

const container = document.createElement('div')
container.id = 'tapture-root'
container.style.zIndex = '9999999'
container.style.position = 'relative'
document.body.appendChild(container)

const styleElement = document.createElement('style')

styleElement.textContent = style as string

const shadowRoot = container.attachShadow({ mode: 'open' })

shadowRoot.appendChild(styleElement)

createRoot(shadowRoot).render(
  <StrictMode>
    <TranslatorApp />
  </StrictMode>,
)
