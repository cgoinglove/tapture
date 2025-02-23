import { createRoot } from 'react-dom/client'
import DemoApp from './docs-app'
import '@core/tailwind.css'

createRoot(document.getElementById('root')!).render(<DemoApp />)
