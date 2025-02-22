import { stableHash } from './hash'

export const createIncrement =
  (i = 0) =>
  () =>
    i++

export const noop = () => {}

export const wait = (delay = 0) => new Promise<void>(resolve => setTimeout(resolve, delay))

export const randomRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)

export const isString = (value: any): value is string => typeof value === 'string'

export const isFunction = <T extends (...args: any[]) => any = (...args: any[]) => any>(v: unknown): v is T => typeof v == 'function'

export const isObject = (value: any): value is Record<string, any> => Object(value) === value

export const isNull = (value: any): value is null | undefined => value == null

export const isNotNull = <T>(value: T): value is NonNullable<T> => value != null

export const isPromiseLike = (x: unknown): x is PromiseLike<unknown> => isFunction((x as any)?.then)

export const randomId = () => {
  return 'tapture-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const groupBy = <T>(arr: T[], getter: keyof T | ((item: T) => string)) =>
  arr.reduce(
    (prev, item) => {
      const key: string = getter instanceof Function ? getter(item) : (item[getter] as string)

      if (!prev[key]) prev[key] = []
      prev[key].push(item)
      return prev
    },
    {} as Record<string, T[]>,
  )

export const chunkArray = <T>(arr: T[], chunkSize: number): T[][] => {
  if (chunkSize <= 0) {
    throw new Error('chunkSize는 0보다 커야 합니다.')
  }
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize))
  }
  return result
}

export const equla = (a?: any, b?: any): boolean => stableHash(a) === stableHash(b)
