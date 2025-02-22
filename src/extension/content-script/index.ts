import createTapture from '@core/index'
import { IS_DEV } from '@lib/const'
import { ContentScriptEventProvider } from '@lib/event-provider/content-script-event-provider'
import style from './output.css?raw'

const container = document.createElement('div')
container.id = 'tapture-root'
container.style.zIndex = '9999999'
container.style.position = 'relative'
document.body.appendChild(container)

const styleElement = document.createElement('style')
styleElement.textContent = style as string
const shadowRoot = container.attachShadow({ mode: 'open' })
shadowRoot.appendChild(styleElement)

if (IS_DEV) console.log('inject Tapture')

createTapture(shadowRoot, new ContentScriptEventProvider())
