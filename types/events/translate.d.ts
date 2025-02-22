type TranslateEventWith<T> = {
  targetLang: string
  sourceLang: string
} & T

type TranslateRequestEvent = AppEventMap<
  'translate',
  TranslateEventWith<{
    message: string
    requestId: string
  }>
>

type TranslateResponseEvent = AppEventMap<
  'translate',
  | TranslateEventWith<{
      status: 'start' | 'update'
      message: string
      requestId: string
    }>
  | TranslateEventWith<{
      status: 'end'
      fail?: boolean
      message: string
      error?: string
      requestId: string
    }>
>

type ProgressInfo =
  | {
      status: 'start' | 'success'
    }
  | {
      status: 'fail'
      error?: string
    }
  | {
      status: 'done' | 'ready' | 'download' | 'initiate'
      name: string
      file: string
    }
  | {
      status: 'progress'
      name: string
      file: string
      loaded: number
      total: number
      progress: number
    }

type TranslateProgressEvent = AppEventMap<'translator-progress', TranslateEventWith<ProgressInfo>>
