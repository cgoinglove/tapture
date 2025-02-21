import { CSSProperties, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { isNotNull, isNull, randomId, TIME, wait } from '@shared/util'
import { useAppStore } from '@cs/store'
import { ContentScriptSubscribeEvent, provider } from '@cs/provider'
import DefaultWidget from './widgets/default'
import { useShallow } from 'zustand/shallow'
import ModelDownloadWidget from './widgets/model-download-progress'
import AlertMessage from './widgets/alert-message'
import clsx from 'clsx'
import Configuration from './widgets/configuration'

interface DownloadInfo {
  filename: string
  total: number
  loaded: number
}

interface Message {
  id: string
  type: 'error' | 'info' | 'success'
  message: ReactNode
}

const layoutClass = 'fixed top-0 flex justify-center transform -translate-x-1/2 translate-y-2 left-1/2'
export default function DynamicIsland() {
  const [rect, setRect] = useState({ width: 0, height: 0 })

  const downloadInfoRef = useRef<DownloadInfo[]>([])

  const [messageQueue, setMessageQueue] = useState<Message[]>([])

  const [showConfiguration, setShowConfiguration] = useState(false)

  const [downloadProgress, activate, deactivate, setDownloadProgress] = useAppStore(
    useShallow(state => [state.downloadProgress, state.activate, state.deactivate, state.setDownloadProgress]),
  )

  const dynamicRef = useRef<HTMLDivElement>(null)

  const [processingRequests, setProcessingRequests] = useState<string[]>([])

  const widgetType = useMemo(() => {
    if (showConfiguration) return 'configuration'
    if (messageQueue.length) return 'message'
    if (downloadProgress.status == 'downloading') {
      const now = Date.now()
      if (downloadProgress.initTime! + TIME.SECONDS(7) > now) return 'download-progress'
    }
  }, [downloadProgress, messageQueue.length, showConfiguration])

  const dynamicComponent = useMemo<ReactNode>(() => {
    let Widget = <DefaultWidget openConfiguration={setShowConfiguration.bind(null, true)} />
    switch (widgetType) {
      case 'configuration':
        {
          Widget = <Configuration close={setShowConfiguration.bind(null, false)} />
        }
        break
      case 'message':
        {
          const item = messageQueue[0]
          Widget = <AlertMessage variant={item.type}>{item.message}</AlertMessage>
        }
        break
      case 'download-progress':
        {
          Widget = <ModelDownloadWidget />
        }
        break
    }
    return (
      <section className='p-1.5 animate-fade-in' key={widgetType}>
        {Widget}
      </section>
    )
  }, [widgetType])

  const addMessage = useCallback((type: Message['type'], message: ReactNode, delay?: number) => {
    const id = randomId()
    const messageItem = { id, message, type }
    setMessageQueue(prev => [...prev, messageItem])
    wait(delay || 3000).then(() => setMessageQueue(prev => prev.filter(v => v.id != messageItem.id)))
  }, [])

  useEffect(() => {
    if (!dynamicRef.current) return
    const observer = new ResizeObserver(c => {
      for (const entry of c.values()) {
        const { width, height } = entry.contentRect
        setRect({ width, height })
      }
    })
    observer.observe(dynamicRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const handleTranslate = (event: ContentScriptSubscribeEvent<'translate'>) => {
      switch (event.data.status) {
        case 'start': {
          setProcessingRequests(prev => [...prev, event.data.requestId])
          break
        }
        case 'end': {
          setProcessingRequests(prev => prev.filter(v => v != event.data.requestId))
          if (isNotNull(event.data.error)) {
            console.error(new Error(event.data.error))
            addMessage('error', event.data.error)
          }
          break
        }
      }
    }
    provider.subscribe('translate', handleTranslate)

    return () => {
      provider.unsubscribe('translate', handleTranslate)
    }
  }, [])

  useEffect(() => {
    const handleTranslatorProgress = (event: ContentScriptSubscribeEvent<'translator-progress'>) => {
      const data = event.data
      switch (data.status) {
        case 'fail':
          downloadInfoRef.current = []
          addMessage('error', data.error)
          setDownloadProgress({ progress: 0, status: 'fail' })
          return
        case 'start':
          downloadInfoRef.current = []
          setDownloadProgress({ progress: 0, status: 'init' })
          return
        case 'success':
          downloadInfoRef.current = []
          setDownloadProgress({ progress: 100, status: 'success' })
          return
      }

      let target: DownloadInfo = downloadInfoRef.current.find(info => info.filename == data.file)!

      if (isNull(target)) {
        target = {
          filename: data.file,
          loaded: 0,
          total: 100,
        }

        downloadInfoRef.current.push(target)
      }

      if (data.status == 'progress') {
        target.loaded = data.loaded
        target.total = data.total
      }

      if (data.status == 'done' || data.status == 'ready') {
        downloadInfoRef.current = downloadInfoRef.current.filter(info => info != target)
      }

      const progress =
        (downloadInfoRef.current.reduce((prev, file) => prev + file.loaded, 0) /
          downloadInfoRef.current.reduce((prev, file) => prev + file.total, 0)) *
        100

      setDownloadProgress(prev => {
        const now = Date.now()
        return {
          status: (prev.initTime ?? now) + TIME.SECONDS(2) < now ? 'downloading' : 'init',
          progress: progress || prev.progress,
          initTime: prev.initTime ?? now,
        }
      })
    }

    provider.subscribe('translator-progress', handleTranslatorProgress)
    return () => {
      provider.unsubscribe('translator-progress', handleTranslatorProgress)
    }
  }, [])

  return (
    <div onMouseLeave={activate} onMouseEnter={deactivate} style={{ '--parent-radius': '24px' } as CSSProperties}>
      <div className={clsx(layoutClass, 'rounded-[var(--parent-radius)] bg-background')}>
        <div
          style={{
            width: `${rect.width}px`,
            height: `${rect.height}px`,
          }}
          className={clsx(
            processingRequests.length && 'before:bg-custom-gradient before:animate-gradient-border bg-transparent',
            'before:-z-10 overflow-hidden before:bg-200 before:absolute before:inset-0 relative w-full h-full transition-all duration-200 ease-out rounded-[var(--parent-radius)] p-1 ring-1 ring-ringColor',
          )}
        >
          <div className='transition-colors w-full h-full bg-background rounded-[calc(var(--parent-radius)-0.25rem)]' />
        </div>
      </div>
      <div className={clsx(layoutClass, 'rounded-[var(--parent-radius)]')}>
        <div className='relative flex flex-col justify-center'>
          <div ref={dynamicRef}>{dynamicComponent}</div>
        </div>
      </div>
    </div>
  )
}
