import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DemoPage from './demo-page'
import '@cs/tailwind.css'
import { DemoApp } from './demo-app'

createRoot(document.getElementById('tapture-root')!).render(
  <StrictMode>
    <div className='-z-10'>
      <DemoPage />
    </div>
    <DemoApp />
  </StrictMode>,
)
