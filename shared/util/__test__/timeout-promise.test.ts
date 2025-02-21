import { test, expect } from 'vitest'
import { timeoutPromise } from '../src/base/timeout-promise'

// 1. 주어진 시간 내에 promise가 해결되면 결과를 반환해야 함
test('주어진 시간 내에 promise가 해결되면 결과를 반환한다', async () => {
  const promise = new Promise<number>(resolve => {
    setTimeout(() => resolve(42), 50) // 50ms 후에 resolve
  })
  // 100ms 타임아웃 내에 promise가 해결되므로 정상 결과 반환
  const result = await timeoutPromise(100, promise)
  expect(result).toBe(42)
})

// 2. 주어진 시간 내에 promise가 해결되지 않으면 타임아웃 에러가 발생해야 함
test('주어진 시간 내에 promise가 해결되지 않으면 타임아웃 에러가 발생한다', async () => {
  const promise = new Promise<number>(resolve => {
    setTimeout(() => resolve(42), 200) // 200ms 후에 resolve
  })
  // 100ms 타임아웃 내에 promise가 해결되지 않으므로 타임아웃 에러 발생
  await expect(timeoutPromise(100, promise)).rejects.toThrow('Promise timed out')
})

// 3. promise가 reject 될 경우, 해당 에러를 그대로 전달해야 함
test('promise가 reject 될 경우, 해당 에러를 그대로 전달한다', async () => {
  const errorMessage = 'Original error'
  const promise = new Promise<number>((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), 50) // 50ms 후에 reject
  })
  await expect(timeoutPromise(100, promise)).rejects.toThrow(errorMessage)
})
