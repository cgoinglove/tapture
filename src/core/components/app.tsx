import { useEffect, useRef, useState } from 'react'
import CaptureTool from '@core/components/tools/capture-tool'
import DynamicIsland from './dynamic-island'
import { getStoreState, useAppStore } from '@core/store'
import { useShallow } from 'zustand/shallow'
import clsx from 'clsx'
import { MarkStyle } from './tools/helper'
import { isNull } from '@lib/shared'

export function TranslatorApp() {
  const [globalShow, setGlobalShow, theme] = useAppStore(useShallow(state => [state.show, state.setShow, state.theme]))
  const [show, setShow] = useState(false)

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isNull(chrome?.runtime)) return

    const handler = message => {
      if (!message?.action) return

      switch (message.action as string) {
        case 'open':
          return setGlobalShow(true)
        case 'close':
          return setGlobalShow(false)
        case 'toogle':
          return setGlobalShow(!getStoreState().show)
      }
    }
    chrome.runtime.onMessage.addListener(handler)

    return () => {
      chrome.runtime.onMessage.removeListener(handler)
    }
  }, [])

  useEffect(() => {
    if (globalShow) {
      clearTimeout(timeoutRef.current!)
      timeoutRef.current = null
      setShow(true)
    } else {
      ref.current?.classList.add('animate-fade-out')
      timeoutRef.current = setTimeout(() => {
        setShow(false)
      }, 300)
    }
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
