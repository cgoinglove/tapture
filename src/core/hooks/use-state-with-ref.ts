import { useCallback, useRef, useState } from 'react'

export const useStateWithRef = <T = any>(initialValue: T) => {
  const [state, setState] = useState(initialValue)
  const ref = useRef(initialValue)

  const setter = useCallback((dispatch: T | ((prev: T) => T)) => {
    let value: T
    if (typeof dispatch == 'function') value = (dispatch as (prev: T) => T)(ref.current)
    else value = dispatch
    ref.current = value
    setState(value)
  }, [])

  return [state, ref, setter] as const
}
