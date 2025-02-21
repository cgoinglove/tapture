export class ChromeLocalStorage implements DataStorage {
  get(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([key], result => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve(result[key])
        }
      })
    })
  }

  set(key: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [key]: value }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve()
        }
      })
    })
  }

  remove(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.remove(key, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve()
        }
      })
    })
  }
}
