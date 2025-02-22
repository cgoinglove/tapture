import { useCallback, useEffect, useState } from 'react'

import { elementTranslation, isNonEmptyTextNode, isTranslatableElement, selectedMarker } from '../helper'
import { useAppStore } from '@core/store'
import { CaptureHandler, useCaptureElements } from '@core/hooks/use-capture-element'

const initialRect = {
  left: 0,
  top: 0,
  width: 0,
  height: 0,
  isCapturing: false,
}

export default function CaptureTool() {
  const enabled = useAppStore(state => state.textNodeSelectEnabled)

  const [rect, setRect] = useState(initialRect)

  const captureContext = useCaptureElements(enabled, isTranslatableElement)

  const handleCaptureEvent = useCallback<CaptureHandler>(event => {
    const { position, status, elements } = event
    setRect({
      left: Math.min(position.startX, position.endX),
      top: Math.min(position.startY, position.endY),
      width: Math.abs(position.endX - position.startX),
      height: Math.abs(position.endY - position.startY),
      isCapturing: status != 'end',
    })

    if (status != 'end') return

    elements
      .flatMap(element => Array.from(element.childNodes))
      .filter(selectedMarker.isMarked)
      .forEach(elementTranslation)
  }, [])

  useEffect(() => {
    const off1 = captureContext.onCapture(handleCaptureEvent)
    const off2 = captureContext.onElementCaptured(el =>
      el.childNodes.forEach(child => isNonEmptyTextNode(child) && selectedMarker.mark(child)),
    )
    const off3 = captureContext.onElementUnCaptured(el => el.childNodes.forEach(selectedMarker.unmark))

    return () => {
      off1()
      off2()
      off3()
    }
  }, [])

  return rect.isCapturing ? (
    <div
      className='fixed border border-dashed pointer-events-none border-indigo-300/50 bg-indigo-300/20 rounded-xs'
      style={{
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      }}
    />
  ) : null
}
