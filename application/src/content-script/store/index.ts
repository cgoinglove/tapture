import { isLanguageSupported, APP_NAME, IS_DEV } from '@const'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createChromePersistStorage, sessionPersistStorage } from './persist-storage'
import { isFunction } from '@shared/util'
import { getBrowserRegion } from '@lib/browser/region'

type Tool = 'capture' | 'pointer'

type DownloadStatus = {
  progress: number
  status: 'init' | 'downloading' | 'success' | 'fail'
  initTime?: number
}

export interface AppState {
  show: boolean
  theme: 'dark' | 'light'
  textNodeSelectEnabled: boolean
  tool: Tool
  sourceLang: string
  targetLang: string
  downloadProgress: DownloadStatus
}

export interface AppDispatch {
  setTheme(theme: string)
  setShow(flag?: boolean)
  setLang(lang: string, type: 'source' | 'target')
  setTool(tool: Tool)
  activate()
  deactivate()
  setDownloadProgress(progress: Setter<DownloadStatus>)
}

const getDefaultTargetLang = (sourceLang: string = '') => {
  if (isLanguageSupported(sourceLang)) return sourceLang
  const region = getBrowserRegion()
  if (isLanguageSupported(region)) return region
  return 'en'
}

const initialState: AppState = {
  show: IS_DEV,
  textNodeSelectEnabled: true,
  // theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  theme: 'light',
  tool: 'capture',
  targetLang: getDefaultTargetLang(),
  sourceLang: 'en',
  downloadProgress: {
    status: 'init',
    progress: 0,
  },
}

export const useAppStore = create(
  persist<AppState & AppDispatch>(
    set => ({
      ...initialState,
      setTheme(theme) {
        set({ theme: theme == 'dark' ? 'dark' : 'light' })
      },
      setShow(flag) {
        set({ show: flag })
      },
      setLang(lang, type) {
        const nextValue = getDefaultTargetLang(lang)
        if (type == 'source') set({ sourceLang: nextValue })
        else if (type == 'target') {
          set({ targetLang: nextValue })
        }
      },
      setTool(tool) {
        set({ tool })
      },
      activate() {
        set({ textNodeSelectEnabled: true })
      },
      deactivate() {
        set({ textNodeSelectEnabled: false })
      },
      setDownloadProgress(progress) {
        set(prev => {
          const nextState = isFunction(progress) ? progress(prev.downloadProgress) : progress
          return {
            downloadProgress: nextState,
          }
        })
      },
    }),
    {
      name: APP_NAME,
      storage: IS_DEV ? sessionPersistStorage : createChromePersistStorage(state => useAppStore.setState(state)),
      partialize(state) {
        return {
          tool: state.tool,
          theme: state.theme,
          sourceLang: state.sourceLang,
          targetLang: state.targetLang,
        } as AppState & AppDispatch
      },
    },
  ),
)

export const getStoreState = (): AppState => useAppStore.getState() as AppState
