import { useCallback, useEffect, useRef, useState } from 'react'
import CaptureTool from '@core/components/tools/capture-tool'
import DynamicIsland from './dynamic-island'
import { useAppStore } from '@core/store'
import { useShallow } from 'zustand/shallow'
import clsx from 'clsx'
import { MarkStyle } from './tools/helper'
import { isNull } from '@lib/shared'

export function TranslatorApp() {
  const [globalShow, theme] = useAppStore(useShallow(state => [state.show, state.theme]))
  const [show, setShow] = useState(false)

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  const ref = useRef<HTMLDivElement>(null)

  const setShowWithTransition = useCallback((flag: boolean) => {
    if (flag) {
      clearTimeout(timeoutRef.current!)
      timeoutRef.current = null
      setShow(true)
    } else {
      ref.current?.classList.add('animate-fade-out')
      timeoutRef.current = setTimeout(() => {
        setShow(false)
      }, 300)
    }
  }, [])

  useEffect(() => {
    if (isNull(chrome?.runtime)) return

    const handler = message => {
      if (!message?.action) return

      switch (message.action as string) {
        case 'open':
          return setShowWithTransition(true)
        case 'close':
          return setShowWithTransition(false)
      }
    }
    chrome.runtime.onMessage.addListener(handler)

    return () => {
      chrome.runtime.onMessage.removeListener(handler)
    }
  }, [])

  useEffect(() => {
    setShowWithTransition(globalShow)
  }, [globalShow])

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = MarkStyle
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])
  if (!show) return null

  return (
    <div className={clsx(theme, 'animate-fade-in text-foreground z-[99999999]')} ref={ref}>
      <DynamicIsland />
      <CaptureTool />
    </div>
  )
}
