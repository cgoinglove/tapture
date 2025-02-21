import { useCallback, useEffect, useRef } from 'react'
import CaptureTool from '@cs/components/tools/capture-tool'
import DynamicIsland from './dynamic-island'
import { useAppStore } from '@cs/store'
import { useShallow } from 'zustand/shallow'
import clsx from 'clsx'
import { MarkStyle } from './tools/helper'

export function TranslatorApp() {
  const [show, theme, setShow] = useAppStore(useShallow(state => [state.show, state.theme, state.setShow]))

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  const ref = useRef<HTMLDivElement>(null)

  const setShowWithTransition = useCallback((flag: boolean) => {
    if (flag) {
      clearTimeout(timeoutRef.current!)
      setShow(true)
    } else {
      ref.current?.classList.add('animate-fade-out')
      timeoutRef.current = setTimeout(() => {
        setShow(false)
      }, 300)
    }
  }, [])

  useEffect(() => {
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
    const style = document.createElement('style')
    style.textContent = MarkStyle
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  if (!show) return null

  return (
    <div className={clsx(theme, 'animate-fade-in text-foreground')} ref={ref}>
      <DynamicIsland />
      <CaptureTool />
    </div>
  )
}
