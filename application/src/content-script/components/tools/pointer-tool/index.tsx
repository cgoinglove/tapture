import { isNotNull } from '@shared/util'
import { useCallback, useEffect, useRef } from 'react'
import { elementTranslation, isNonEmptyTextNode, isTranslatableElement, selectedMarker } from '../helper'
import { useAppStore } from '@cs/store'
/** @deprecated */
export default function PointerTool() {
  const enabled = useAppStore(state => state.textNodeSelectEnabled)

  const hoverdNodeRef = useRef<HTMLElement>(undefined)

  const setHoveredNode = useCallback((next?: HTMLElement) => {
    if (next == hoverdNodeRef.current) return

    if (isNotNull(hoverdNodeRef.current)) {
      hoverdNodeRef.current.removeEventListener('click', handleClick)
      hoverdNodeRef.current.childNodes.forEach(selectedMarker.unmark)
      hoverdNodeRef.current = undefined
    }

    if (isNotNull(next)) {
      next.addEventListener('click', handleClick)
      next.childNodes.forEach(child => {
        if (isNonEmptyTextNode(child)) {
          selectedMarker.mark(child)
        }
      })
      hoverdNodeRef.current = next
    }
  }, [])

  const handleClick = useCallback(async (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const promises = Array.from(hoverdNodeRef.current!.childNodes).filter(selectedMarker.isMarked).map(elementTranslation)

    Promise.allSettled(promises).finally(setHoveredNode.bind(null))
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = document.elementFromPoint(e.clientX, e.clientY)
    if (selectedMarker.isMarked(el!)) return
    setHoveredNode(isTranslatableElement(el) ? el : undefined)
  }, [])

  useEffect(() => {
    if (!enabled) {
      return setHoveredNode(undefined)
    }
    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [enabled])

  return null
}
