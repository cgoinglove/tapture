import { useCallback, useEffect, useRef } from 'react'
import { isNull } from '@lib/shared'

type CaptureContext = {
  startX: number
  startY: number
  endX: number
  endY: number
  isCapturing: boolean
}

const initialCaptureContext: CaptureContext = {
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
  isCapturing: false,
}

const getGridPointsInRect = (minX: number, minY: number, width: number, height: number, step: number = 10) => {
  const startX = Math.floor(minX / step) * step
  const startY = Math.floor(minY / step) * step
  const endX = Math.ceil((minX + width) / step) * step
  const endY = Math.ceil((minY + height) / step) * step

  const points: { x: number; y: number }[] = []
  for (let x = startX; x <= endX; x += step) {
    for (let y = startY; y <= endY; y += step) {
      points.push({ x, y })
    }
  }
  return points
}

export type CaptureHandlerEvent = {
  status: 'start' | 'capturing' | 'end'
  position: Pick<CaptureContext, 'endX' | 'endY' | 'startX' | 'startY'>
  elements: HTMLElement[]
}
export type CaptureHandler = (event: CaptureHandlerEvent) => void

export type ElementHandler = (el: HTMLElement) => void

export const useCaptureElements = (enable: boolean = false, elementSelector: (el: HTMLElement) => boolean) => {
  const contextRef = useRef(initialCaptureContext)

  const capturedElementsRef = useRef<Set<HTMLElement>>(new Set())
  const visitedPointsRef = useRef<Map<string, HTMLElement | undefined>>(new Map())
  const selectorRef = useRef<(el: HTMLElement) => boolean>(() => true)

  const eventBus = useRef({
    remove: [] as ElementHandler[],
    add: [] as ElementHandler[],
    capture: [] as CaptureHandler[],
  })

  if (selectorRef.current != elementSelector) selectorRef.current = elementSelector

  const addElement = useCallback((element: HTMLElement) => {
    capturedElementsRef.current.add(element)
    eventBus.current.add.forEach(callback => callback(element))
  }, [])

  const removeElement = useCallback((element: HTMLElement) => {
    if (!capturedElementsRef.current.has(element)) return
    capturedElementsRef.current.delete(element)
    eventBus.current.remove.forEach(callback => callback(element))
  }, [])

  const dispatchCaptureEvent = useCallback((status: CaptureHandlerEvent['status']) => {
    eventBus.current.capture.forEach(callback =>
      callback({
        status,
        position: {
          endX: contextRef.current.endX,
          endY: contextRef.current.endY,
          startX: contextRef.current.startX,
          startY: contextRef.current.startY,
        },
        elements: Array.from(capturedElementsRef.current),
      }),
    )
  }, [])

  const visit = useCallback((position: { x: number; y: number }) => {
    const { x, y } = position
    const point = `${x}_${y}`
    if (visitedPointsRef.current.has(point)) return visitedPointsRef.current.get(point)
    const el = document.elementFromPoint(x, y) as HTMLElement
    const shouldAdd = !isNull(el) && selectorRef.current(el)
    const result = shouldAdd ? el : undefined
    visitedPointsRef.current.set(point, result)
    return result
  }, [])

  const moveHandler = useCallback((e: MouseEvent) => {
    const minX = Math.min(contextRef.current.startX, e.clientX)
    const minY = Math.min(contextRef.current.startY, e.clientY)
    const width = Math.abs(e.clientX - contextRef.current.startX)
    const height = Math.abs(e.clientY - contextRef.current.startY)

    if (!contextRef.current.isCapturing) {
      if (width * height < 100) return

      contextRef.current.isCapturing = true
      dispatchCaptureEvent('start')
    }

    contextRef.current = {
      ...contextRef.current,
      endX: e.clientX,
      endY: e.clientY,
    }

    dispatchCaptureEvent('capturing')

    const currentRect = {
      left: minX,
      top: minY,
      right: minX + width,
      bottom: minY + height,
    }

    const removeTargets = Array.from(capturedElementsRef.current.keys()).filter(el => {
      const rect = el.getBoundingClientRect()
      const isOut =
        rect.right < currentRect.left || rect.left > currentRect.right || rect.bottom < currentRect.top || rect.top > currentRect.bottom
      return isOut
    })
    removeTargets.forEach(el => removeElement(el))

    const points = getGridPointsInRect(minX, minY, width, height, 10)

    points.forEach(point => {
      const element = visit(point)
      if (element && !capturedElementsRef.current.has(element)) addElement(element)
    })
  }, [])

  const clear = useCallback(() => {
    Array.from(capturedElementsRef.current.keys()).forEach(removeElement)
    endCaptureHandler()
  }, [])

  const handleEscapeKey = useCallback((e: KeyboardEvent) => {
    if (e.key == 'Escape') {
      e.stopPropagation()
      e.preventDefault()
      clear()
    }
  }, [])

  const endCaptureHandler = useCallback(() => {
    document.removeEventListener('mousemove', moveHandler)
    document.removeEventListener('keydown', handleEscapeKey)
    document.removeEventListener('mouseup', endCaptureHandler)
    contextRef.current = initialCaptureContext
    dispatchCaptureEvent('end')
    Array.from(capturedElementsRef.current.keys()).forEach(removeElement)
    capturedElementsRef.current = new Set()
    visitedPointsRef.current = new Map()
  }, [])

  const startCaptureHandler = useCallback((e: MouseEvent) => {
    e.preventDefault()
    document.addEventListener('mouseup', endCaptureHandler)
    document.addEventListener('mousemove', moveHandler)
    document.addEventListener('keydown', handleEscapeKey, {
      capture: true,
    })
    contextRef.current = {
      isCapturing: false,
      startX: e.clientX,
      startY: e.clientY,
      endX: e.clientX,
      endY: e.clientY,
    }
  }, [])

  const onElementCaptured = useCallback((callback: ElementHandler) => {
    eventBus.current.add.push(callback)
    return () => {
      eventBus.current.add = eventBus.current.add.filter(cb => cb != callback)
    }
  }, [])
  const onElementUnCaptured = useCallback((callback: ElementHandler) => {
    eventBus.current.remove.push(callback)
    return () => {
      eventBus.current.remove = eventBus.current.remove.filter(cb => cb != callback)
    }
  }, [])

  const onCapture = useCallback((callback: CaptureHandler) => {
    eventBus.current.capture.push(callback)
    return () => {
      eventBus.current.capture = eventBus.current.capture.filter(cb => cb != callback)
    }
  }, [])

  useEffect(() => {
    if (!enable) return clear()
    document.addEventListener('mousedown', startCaptureHandler)
    return () => document.removeEventListener('mousedown', startCaptureHandler)
  }, [enable])

  return {
    onCapture,
    onElementCaptured,
    onElementUnCaptured,
  }
}
