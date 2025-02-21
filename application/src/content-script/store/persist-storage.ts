import { ChromeLocalStorage } from '@lib/browser/chrome-storage'
import { equla, isNotNull, randomId } from '@shared/util'
import { PersistStorage } from 'zustand/middleware'

export const createChromePersistStorage = <S = any>(onChange?: (newState: Partial<S>) => void): PersistStorage<S> => {
  let storeName = randomId()
  const cache: Map<string, any> = new Map()

  if (onChange) {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local' && Object.hasOwn(changes, storeName)) {
        const { newValue } = changes[storeName]
        onChange(newValue as Partial<S>)
      }
    })
  }

  const storage = new ChromeLocalStorage()

  return {
    async getItem(name) {
      if (storeName != name) storeName = name
      const state = await storage.get(name)
      return state ? { state } : null
    },
    setItem(name, { state }) {
      const prev = cache.get(name)
      if (isNotNull(prev) && equla(prev, state)) return
      cache.set(name, state)
      return storage.set(name, state)
    },
    removeItem(name) {
      cache.delete(name)
      return storage.remove(name)
    },
  } as PersistStorage<S>
}

export const sessionPersistStorage: PersistStorage<any> = {
  getItem(name) {
    const data = sessionStorage.getItem(name) || '{}'
    return JSON.parse(data).state || null
  },
  removeItem(name) {
    sessionStorage.removeItem(name)
  },
  setItem(name, value) {
    sessionStorage.setItem(name, JSON.stringify({ state: value.state }))
  },
}
