import CaptureTool from '@cs/components/tools/capture-tool'
import DynamicIsland from '@cs/components/dynamic-island'
import { useCallback, useEffect, useRef } from 'react'
import { useAppStore } from '@cs/store'
import { useShallow } from 'zustand/shallow'
import clsx from 'clsx'

export function DemoApp() {
  const [theme, show, setShow] = useAppStore(useShallow(state => [state.theme, state.show, state.setShow]))

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
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key == 'Escape') setShowWithTransition(!show)
    }
    document.addEventListener('keydown', handleEscapeKey)
    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [show])

  if (!show) return null

  return (
    <div className={clsx(theme, 'animate-fade-in text-foreground')} ref={ref}>
      <DynamicIsland />
      <CaptureTool />
    </div>
  )
}
