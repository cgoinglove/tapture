import { APP_NAME, IS_DEV } from '@const'
import { provider } from '@bg/provider'
import { Translator } from './translator'
import { PromiseQueue } from '@shared/util'

if (IS_DEV) {
  chrome.tabs.query({}, function (tabs) {
    const extensionsTab = tabs.find(tab => !tab.url || tab.url.startsWith('chrome://extensions'))
    if (!extensionsTab) {
      chrome.tabs.create({ url: 'chrome://extensions' })
    }
  })
}

const translator = Translator({
  fake: false,
  progressCallback(info) {
    provider.publish('translator-progress', info)
  },
})

const addTask = PromiseQueue()

provider.subscribe('translate', event => {
  addTask(async () => {
    const { data, portId } = event
    try {
      provider.publishTo(portId, 'translate', {
        status: 'start',
        ...data,
      })
      const out = await translator.translateStream(data.message, data.sourceLang, data.targetLang, text => {
        provider.publishTo(portId, 'translate', {
          status: 'update',
          ...data,
          message: text,
        })
      })

      provider.publishTo(portId, 'translate', {
        status: 'end',
        ...data,
        message: out,
      })
    } catch (e) {
      provider.publishTo(portId, 'translate', {
        status: 'end',
        ...data,
        fail: true,
        error: (e as Error).message || 'Error',
      })
    }
  })
})

provider.subscribe('ping', event => {
  provider.publishTo(event.portId, 'ping', undefined)
})

chrome.contextMenus.removeAll(() => {
  chrome.contextMenus.create(
    {
      id: APP_NAME,
      title: APP_NAME,
      contexts: ['all'],
    },
    () => {
      if (chrome.runtime.lastError) {
        console.warn(chrome.runtime.lastError.message)
      }
    },
  )
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === APP_NAME && tab?.id) {
    chrome.tabs.sendMessage(tab.id, { action: 'open' })
  }
})
chrome.action.onClicked.addListener(tab => {
  if (tab?.id) {
    chrome.tabs.sendMessage(tab.id, { action: 'open' })
  }
})

chrome.commands.onCommand.addListener(command => {
  console.log({ command })
})
